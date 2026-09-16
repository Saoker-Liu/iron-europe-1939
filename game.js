/* =========================================================================
 * 《钢铁欧陆 1939》 game.js —— 核心引擎（无 DOM 依赖，可在 Node 下无头测试）
 * 六边形移动(迪杰斯特拉+ZOC) / 战斗结算 / 城市经济 / AI / 历史事件 / 存档
 * ========================================================================= */
'use strict';

/* 由 data.js 提供: CLASSES TERRAIN ATK_MOD FACTION_NAME FACTION_COLOR
 * COUNTRIES MAP_ROWS CITIES EQUIP GENERALS EVENTS INITIAL_UNITS turnOf */
if (typeof window === 'undefined' && typeof require === 'function') {
  // Node 无头环境：装载 data.js 到全局
  Object.assign(globalThis, require('./data.js'));
}

const MAP_W = 114, MAP_H = 65;
const key = (c, r) => c + ',' + r;
const DIRS_EVEN = [[1, 0], [-1, 0], [0, -1], [-1, -1], [0, 1], [-1, 1]];
const DIRS_ODD  = [[1, 0], [-1, 0], [1, -1], [0, -1], [1, 1], [0, 1]];

/* 偏移坐标 -> 立方坐标，用于距离 */
function cubeOf(c, r) { const q = c - ((r - (r & 1)) >> 1); return [q, r, -q - r]; }
function hexDist(c1, r1, c2, r2) {
  const a = cubeOf(c1, r1), b = cubeOf(c2, r2);
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
}

class Game {
  constructor(playerFaction, difficulty) {
    this.playerFaction = playerFaction || 'axis';
    this.difficulty = difficulty || 'normal';
    const DMULT = {
      easy:   { atk: 0.88, def: 0.88, inc: 0.85 },
      normal: { atk: 1.00, def: 1.00, inc: 1.00 },
      hard:   { atk: 1.12, def: 1.12, inc: 1.20 },
    };
    this.aiMult = DMULT[this.difficulty] || DMULT.normal;
    this.turn = 0;
    this.nextId = 1;
    this.gold = { axis: 120, west: 120, sov: 120 };
    this.westBonus = 0;          // 美国参战后同盟国收入加成
    this.usaIn = false;
    this.wars = new Set(['axis|west']);
    this.log = [];
    this.stats = { kills: { axis: 0, west: 0, sov: 0 }, };
    this.pendingEvents = [];     // 待 UI 弹窗的事件

    // 国家 -> 阵营（意大利/匈牙利/罗马尼亚开局中立，由事件激活）
    this.cf = {};
    for (const k in COUNTRIES) this.cf[k] = COUNTRIES[k].faction;
    this.cf.it = 'neutral'; this.cf.hu = 'neutral'; this.cf.ro = 'neutral';

    // 地形 & 城市
    this.terr = {};              // key -> 字符
    for (let r = 0; r < MAP_H; r++) {
      const row = (MAP_ROWS[r] || '').padEnd(MAP_W, '~');
      for (let c = 0; c < MAP_W; c++) this.terr[key(c, r)] = row[c];
    }
    this.cities = CITIES.map(ci => ({ ...ci, owner: this.cf[ci.ct] }));
    for (const ci of this.cities) this.terr[key(ci.x, ci.y)] = 'c';
    this.cityByKey = {}; for (const ci of this.cities) this.cityByKey[ci.k] = ci;
    this.terrDirty = true; this._terrCache = null;

    // 将领状态
    this.genUnit = {};           // genId -> unitId | null
    this.genKills = {};          // genId -> 击杀数
    for (const g of GENERALS) { this.genUnit[g.id] = null; this.genKills[g.id] = 0; }

    // 单位
    this.units = [];
    for (const d of INITIAL_UNITS) {
      this.spawnUnit(d.ct, d.eq, d.x, d.y, { gen: d.gen, silent: true });
    }
    this.pushLog(`1939年9月，德国入侵波兰，英法对德宣战——第二次世界大战爆发！`, 'war');
    this.checkVictory();
  }

  /* ------------------------------ 基础查询 ------------------------------ */
  tile(c, r) { return (c >= 0 && c < MAP_W && r >= 0 && r < MAP_H) ? this.terr[key(c, r)] : null; }
  inMap(c, r) { return c >= 0 && c < MAP_W && r >= 0 && r < MAP_H; }
  neighbors(c, r) {
    const D = (r & 1) ? DIRS_ODD : DIRS_EVEN, out = [];
    for (const [dc, dr] of D) { const nc = c + dc, nr = r + dr; if (this.inMap(nc, nr)) out.push([nc, nr]); }
    return out;
  }
  unitAt(c, r) { return this.units.find(u => u.c === c && u.r === r) || null; }
  cityAt(c, r) { return this.cities.find(ci => ci.x === c && ci.y === r) || null; }
  unitFaction(u) { return this.cf[u.ct]; }
  genOf(u) { return u.gen ? GENERALS.find(g => g.id === u.gen) : null; }
  atWar(a, b) { return a !== b && this.wars.has([a, b].sort().join('|')); }
  anyWar(f) { return ['axis', 'west', 'sov'].some(x => x !== f && this.atWar(f, x)); }
  factionName(f) { return FACTION_NAME[f] || f; }

  year() { return 1939 + Math.floor((8 + this.turn) / 12); }
  month0() { return (8 + this.turn) % 12; }
  isWinter() { const m = this.month0(); return (m === 11 || m === 0 || m === 1) && this.year() >= 1941; }
  dateLabel() {
    const M = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return `${this.year()}年${M[this.month0()]}`;
  }

  equipOf(eqKey) { const [ct, cls, idx] = eqKey.split(':'); return EQUIP[ct][cls][+idx]; }

  /* 领土：每格归属最近城市的所有者阵营（医疗/冬季判定用） */
  territoryOwner(c, r) {
    if (this.terrDirty || !this._terrCache) {
      const cache = {};
      for (let rr = 0; rr < MAP_H; rr++) for (let cc = 0; cc < MAP_W; cc++) {
        if (this.tile(cc, rr) === '~') continue;
        let best = null, bd = 1e9;
        for (const ci of this.cities) {
          const d = hexDist(cc, rr, ci.x, ci.y);
          if (d < bd) { bd = d; best = ci; }
        }
        cache[key(cc, rr)] = best ? best.owner : 'neutral';
      }
      this._terrCache = cache; this.terrDirty = false;
    }
    return this._terrCache[key(c, r)];
  }
  homeCountryOf(c, r) {   // 该格属于哪个母国的势力范围（冬季"苏联土地"判定）
    let best = null, bd = 1e9;
    for (const ci of this.cities) {
      const d = hexDist(c, r, ci.x, ci.y);
      if (d < bd) { bd = d; best = ci; }
    }
    return best ? best.ct : null;
  }

  /* ------------------------------ 将领技能 ------------------------------ */
  genSkill(u, k) {   // u 的将领是否带有指定类型技能（兵种限定自动匹配本单位兵种）
    const g = this.genOf(u); if (!g) return null;
    return g.skills.find(s => s.k === k && (!s.cls || s.cls === u.eq.cls)) || null;
  }
  hasNoZOC(u) {
    if (CLASSES[u.eq.cls].fly) return true;
    if (this.genSkill(u, 'nozoc')) return true;
    return false;
  }
  rangeOf(u) {
    let rng = CLASSES.art.ranged && u.eq.cls === 'art' ? (u.eq.rng || 2) : 1;
    const s = this.genSkill(u, 'rng'); if (s) rng += s.n;
    return rng;
  }

  /* ------------------------------ 移动 ------------------------------ */
  terrainCost(u, c, r) {
    const t = this.tile(c, r); const T = TERRAIN[t];
    if (!T || !T.pass) return Infinity;
    return T.cost ? T.cost[u.eq.cls] : 1;
  }
  /* 迪杰斯特拉：可达格成本表 + 前驱(用于还原路径) */
  moveRange(u) {
    const start = key(u.c, u.r);
    const cost = new Map([[start, 0]]), prev = new Map(), zocStop = new Set();
    const visited = new Set();
    const mov = this.movOf(u);
    while (true) {
      let bk = null, bc = Infinity;
      for (const [k, v] of cost) { if (!visited.has(k) && v < bc) { bc = v; bk = k; } }
      if (bk === null || bc > mov) break;
      visited.add(bk);
      const [c, r] = bk.split(',').map(Number);
      if (zocStop.has(bk)) continue;                      // 控制区：到此为止
      for (const [nc, nr] of this.neighbors(c, r)) {
        const nk = key(nc, nr), t = this.tile(nc, nr);
        if (!t || t === '~') continue;                    // 海洋不可入(浅滩=可)
        const occ = this.unitAt(nc, nr);
        if (occ && this.unitFaction(occ) !== this.unitFaction(u)) continue;   // 敌方格阻挡
        const step = this.terrainCost(u, nc, nr);
        const ncost = bc + step;
        if (ncost > mov) continue;
        if (!cost.has(nk) || ncost < cost.get(nk)) { cost.set(nk, ncost); prev.set(nk, bk); }
        // 进入敌方控制区 → 移动终止于该格
        if (!this.hasNoZOC(u)) {
          const nearEnemy = this.neighbors(nc, nr).some(([ec, er]) => {
            const e = this.unitAt(ec, er);
            return e && this.atWar(this.unitFaction(u), this.unitFaction(e));
          });
          if (nearEnemy) zocStop.add(nk);
        }
      }
    }
    cost.delete(start);
    // 可停留格：无单位占据
    const ends = new Map();
    for (const [k, v] of cost) { if (!this.unitAt(...k.split(',').map(Number))) ends.set(k, v); }
    return { cost: ends, prev };
  }
  pathTo(u, ck) {
    const { prev } = this.moveRange(u);
    const path = []; let k = ck;
    while (k && k !== key(u.c, u.r)) { path.unshift(k); k = prev.get(k); }
    return path.length ? path.map(s => s.split(',').map(Number)) : null;
  }
  movOf(u) {
    let m = u.eq.mov;
    const s = this.genSkill(u, 'mov'); if (s) m += s.n;
    return m;
  }

  moveUnit(u, c, r, path) {
    u.moved = true; u.dug = false;
    u.c = c; u.r = r;
    const city = this.cityAt(c, r);
    if (city && city.owner !== this.unitFaction(u)) this.captureCity(city, this.unitFaction(u), u);
    // 大国军队开进中立国领土 → 中立国即刻倒向敌方（历史：1940 低地国家）
    const hc = this.homeCountryOf(c, r);
    if (hc && COUNTRIES[hc].faction === 'neutral' && this.cf[hc] === 'neutral'
        && this.unitFaction(u) !== 'neutral') {
      this.neutralDefect(hc, this.unitFaction(u));
    }
  }

  /* ------------------------------ 战斗 ------------------------------ */
  effAtk(u, target) {
    const f = this.unitFaction(u);
    let m = 1;
    m *= 0.55 + 0.45 * (u.hp / 100);                       // 兵力衰减
    m *= 1 + 0.08 * u.vet;                                 // 老练度
    const g = this.genOf(u);
    if (g) {
      const rank = Math.min(5, 1 + Math.floor((this.genKills[g.id] || 0) / 3));
      m *= 1 + 0.04 * (rank - 1);
      for (const s of g.skills) if (s.k === 'atk' && (!s.cls || s.cls === u.eq.cls)) m *= 1 + s.m;
    }
    if (target) m *= ATK_MOD[u.eq.cls][target.eq.cls];     // 兵种克制
    const vs = this.genSkill(u, 'vs');
    if (vs && target && target.eq.cls === vs.tgt) m *= 1 + vs.m;
    if (this.genSkill(u, 'rage') && u.hp < 50) m *= 1.15;
    // 光环：相邻友军将领(艾森豪威尔)
    for (const [ec, er] of this.neighbors(u.c, u.r)) {
      const a = this.unitAt(ec, er);
      if (a && this.unitFaction(a) === f && a.gen) {
        const ag = this.genOf(a);
        if (ag && ag.skills.some(s => s.k === 'aura')) { m *= 1.1; break; }
      }
    }
    if (f !== this.playerFaction) m *= this.aiMult.atk;
    return u.eq.atk * m;
  }
  effDef(u) {
    const f = this.unitFaction(u);
    let m = 1;
    m *= 1 + 0.08 * u.vet;
    const g = this.genOf(u);
    if (g) {
      const rank = Math.min(5, 1 + Math.floor((this.genKills[g.id] || 0) / 3));
      m *= 1 + 0.04 * (rank - 1);
      for (const s of g.skills) if (s.k === 'def' && (!s.cls || s.cls === u.eq.cls)) m *= 1 + s.m;
    }
    if (u.dug) m *= 1.30;
    if (f !== this.playerFaction) m *= this.aiMult.def;
    return u.eq.def * m;
  }
  terrainDefBonus(c, r) {
    const t = this.tile(c, r);
    if (t === 'c') { const ci = this.cityAt(c, r); return ci && ci.cap ? 0.6 : 0.4; }
    return TERRAIN[t] ? TERRAIN[t].def : 0;
  }
  /* 预览伤害(期望值) / 实际结算 */
  computeDamage(att, def, opt) {
    const a = this.effAtk(att, def);
    const ignoreTerrain = att.eq.cls === 'art' || att.eq.cls === 'air';
    let dm = 1 + (ignoreTerrain ? 0 : this.terrainDefBonus(def.c, def.r));
    const cd = this.genSkill(def, 'citydef');
    if (cd && this.cityAt(def.c, def.r)) dm *= 1 + cd.m;
    const d = this.effDef(def) * dm;
    let dmg = 42 * a / (a + d);
    if (!opt || !opt.preview) dmg *= 0.85 + Math.random() * 0.3;
    return Math.max(3, Math.round(dmg));
  }
  canAttackNow(u) { return !u.attacked && u.hp > 0; }
  targetsOf(u) {
    const out = [], f = this.unitFaction(u), rng = this.rangeOf(u);
    if (!this.canAttackNow(u)) return out;
    for (const e of this.units) {
      if (!this.atWar(f, this.unitFaction(e))) continue;
      const dist = hexDist(u.c, u.r, e.c, e.r);
      if (u.eq.cls === 'art') { if (dist <= rng) out.push(e); }
      else if (dist === 1) out.push(e);
    }
    return out;
  }
  attack(att, def) {
    const rec = { type: 'battle', aC: att.c, aR: att.r, c: def.c, r: def.r, killed: false, counter: 0 };
    const fA = this.unitFaction(att), fD = this.unitFaction(def);
    // 中立国被攻击 → 倒向攻击者的敌对阵营
    if (fD === 'neutral') this.neutralDefect(def.ct, fA);
    const dmg = this.computeDamage(att, def);
    def.hp -= dmg; rec.dmg = dmg;
    att.attacked = true; att.dug = false; att.moved = true;
    att.xp += 20;
    if (def.hp <= 0) {
      rec.killed = true; this.killUnit(def);
      att.xp += 30; this.stats.kills[fA] = (this.stats.kills[fA] || 0) + 1;
      if (att.gen) { this.genKills[att.gen] = (this.genKills[att.gen] || 0) + 1; }
    } else {
      // 反击：近战 & 防守方为步兵/装甲
      const dist = hexDist(att.c, att.r, def.c, def.r);
      if (dist === 1 && (def.eq.cls === 'inf' || def.eq.cls === 'tank')) {
        let cm = 0.55;
        const cs = this.genSkill(def, 'counter'); if (cs) cm += cs.m;
        const a2 = this.effAtk(def, att);
        const d2 = this.effDef(att) * (1 + ((att.eq.cls === 'art' || att.eq.cls === 'air') ? 0 : this.terrainDefBonus(att.c, att.r)));
        const cdmg = Math.max(2, Math.round(42 * a2 / (a2 + d2) * cm * (0.85 + Math.random() * 0.3)));
        att.hp -= cdmg; rec.counter = cdmg;
        def.xp += 15;
        if (att.hp <= 0) { rec.attDied = true; this.killUnit(att); }
      }
    }
    this.updateVet(att);
    const an = att.eq.n + (att.gen ? `(${this.genOf(att).name})` : '');
    const dn = def.eq.n;
    this.pushLog(`${an} 攻击 ${dn}，造成 ${rec.dmg} 点伤害${rec.killed ? '，将其歼灭！' : ''}${rec.counter ? `，遭反击 ${rec.counter} 点。` : ''}`, 'battle');
    return rec;
  }
  updateVet(u) {
    if (!u) return;
    const TH = [100, 250, 450];
    let v = 0; for (const t of TH) if (u.xp >= t) v++;
    u.vet = v;
  }
  killUnit(u) {
    this.units = this.units.filter(x => x !== u);
    if (u.gen) { this.genUnit[u.gen] = null; }
  }

  /* ------------------------------ 城市 ------------------------------ */
  captureCity(city, faction, byUnit) {
    const old = city.owner;
    city.owner = faction; this.terrDirty = true;
    const cn = COUNTRIES[city.ct].name;
    this.pushLog(`${this.factionName(faction)} 占领 ${cn} ${city.n}！`, 'war');
    // 首都易手 → 该国全境易帜
    if (city.cap) {
      let flipped = 0;
      for (const ci of this.cities) {
        if (ci.ct === city.ct && ci.owner !== faction) { ci.owner = faction; flipped++; }
      }
      this.terrDirty = true;
      this.pushLog(`${cn}首都 ${city.n} 陷落，${cn}全境沦陷！（${flipped} 座城市易手）`, 'war');
    }
    this.checkVictory();
  }
  /* 中立国被攻击：加入攻击者的最强交战敌对阵营 */
  neutralDefect(ct, attackerFaction) {
    if (this.cf[ct] !== 'neutral') return;
    const foes = ['axis', 'west', 'sov'].filter(f => f !== attackerFaction && this.atWar(attackerFaction, f));
    let target = null;
    if (foes.length) {
      target = foes.sort((a, b) => this.factionIncome(b) - this.factionIncome(a))[0];
    } else {
      const others = ['axis', 'west', 'sov'].filter(f => f !== attackerFaction);
      target = others.sort((a, b) => this.factionIncome(b) - this.factionIncome(a))[0];
      this.declareWar(attackerFaction, target);
    }
    this.cf[ct] = target;
    for (const ci of this.cities) if (ci.ct === ct) { ci.owner = target; }
    this.terrDirty = true;
    this.pushLog(`${COUNTRIES[ct].name}遭到进攻，全国倒向${this.factionName(target)}阵营对袭击者作战！`, 'war');
  }
  factionIncome(f) {
    let base = this.cities.filter(ci => ci.owner === f).reduce((s, ci) => s + ci.inc, 0);
    if (f === 'west' && this.usaIn) base += 40;
    if (f !== this.playerFaction) base = Math.round(base * this.aiMult.inc);
    return base;
  }
  factionCityCount(f) { return this.cities.filter(ci => ci.owner === f).length; }

  /* 招募：返回单位或 null */
  recruit(cityK, eqKey) {
    const city = this.cityByKey[cityK]; if (!city) return null;
    const f = city.owner;
    if (this.unitAt(city.x, city.y)) return null;
    const eq = this.equipOf(eqKey);
    if (!eq || eq.yr > this.year()) return null;
    if (eq.cls === 'tank' || eq.cls === 'art') {
      const allowUS = city.ct === 'uk' && this.usaIn;
      const rosterCt = (eqKey.startsWith('us:') && !allowUS) ? null : (EQUIP[city.ct] ? city.ct : 'neutral');
      if (eqKey.split(':')[0] !== rosterCt) return null;
    } else {
      const rosterCt = EQUIP[city.ct] ? city.ct : 'neutral';
      if (eqKey.split(':')[0] !== rosterCt) return null;
    }
    if (this.gold[f] < eq.cost) return null;
    this.gold[f] -= eq.cost;
    const u = this.spawnUnit(city.ct, eqKey, city.x, city.y, {});
    u.moved = true; u.attacked = true;                    // 本回合不可行动
    this.pushLog(`${this.factionName(f)} 在 ${city.n} 组建 ${eq.n}（-${eq.cost} 金）`, 'econ');
    return u;
  }
  spawnUnit(ct, eqKey, x, y, opt) {
    const eq = this.equipOf(eqKey);
    const u = {
      id: this.nextId++, ct, eqKey, eq,
      hp: 100, xp: 0, vet: 0, c: x, r: y,
      moved: false, attacked: false, dug: false, gen: null,
    };
    this.units.push(u);
    if (opt && opt.gen && this.genUnit[opt.gen] === null) {
      u.gen = opt.gen; this.genUnit[opt.gen] = u.id;
      if (!(opt && opt.silent)) this.pushLog(`${this.genOf(u).name} 将军就任 ${eq.n} 指挥官`, 'info');
    }
    return u;
  }
  assignGeneral(genId, unit) {
    if (this.genUnit[genId] !== null) return false;
    const old = this.units.find(u => u.gen === genId);
    if (old) { old.gen = null; this.genUnit[genId] = null; }
    if (unit.gen) this.genUnit[unit.gen] = null;
    unit.gen = genId; this.genUnit[genId] = unit.id;
    return true;
  }

  /* ------------------------------ 回合推进 ------------------------------ */
  startTurnFor(f) {
    // 收入 & 行动权恢复
    const inc = this.factionIncome(f);
    this.gold[f] += inc;
    for (const u of this.units) {
      if (this.unitFaction(u) !== f) continue;
      u.moved = false; u.attacked = false;
      const city = this.cityAt(u.c, u.r);
      let heal = 0;
      if (city && city.owner === f) heal = 25;
      else if (this.territoryOwner(u.c, u.r) === f) heal = 12;
      if (heal) u.hp = Math.min(100, u.hp + heal);
    }
  }
  endTurn() {
    const actions = [];
    for (const f of ['axis', 'west', 'sov']) {
      if (f === this.playerFaction) continue;
      this.startTurnFor(f);
      actions.push(...this.aiTurn(f));
    }
    // 冬季消耗（轴心国在苏联土地）
    if (this.isWinter()) {
      for (const u of [...this.units]) {
        if (this.unitFaction(u) === 'axis' && this.homeCountryOf(u.c, u.r) === 'su'
            && this.territoryOwner(u.c, u.r) === 'axis') {
          u.hp -= 12;
          if (u.hp <= 0) { this.pushLog(`${u.eq.n} 在俄罗斯严冬中全军覆没……`, 'war'); this.killUnit(u); }
        }
      }
      this.pushLog(`俄罗斯的严冬：轴心国部队在苏联土地上遭受冻伤减员。`, 'event');
    }
    this.turn++;
    this.processEvents();
    this.startTurnFor(this.playerFaction);
    this.pushLog(`—— ${this.dateLabel()}，${this.factionName(this.playerFaction)}回合开始（收入 +${this.factionIncome(this.playerFaction)} 金）——`, 'info');
    const v = this.checkVictory();
    return { actions, victory: v };
  }
  declareWar(a, b) {
    const k = [a, b].sort().join('|');
    if (this.wars.has(k)) return;
    this.wars.add(k);
    this.pushLog(`${this.factionName(a)} 对 ${this.factionName(b)} 宣战！`, 'war');
    this.checkVictory();
  }

  /* ------------------------------ 历史事件 ------------------------------ */
  processEvents() {
    for (const ev of EVENTS) {
      if (ev.t !== this.turn) continue;
      if (ev.kind === 'log') { this.pushLog(`【${ev.title}】${ev.text}`, 'event'); this.pendingEvents.push(ev); }
      else if (ev.kind === 'italy') {
        this.cf.it = 'axis';
        for (const ci of this.cities) if (ci.ct === 'it') ci.owner = 'axis';
        this.declareWar('axis', 'west'); this.terrDirty = true;
        this.pushLog(`【${ev.title}】${ev.text}`, 'event'); this.pendingEvents.push(ev);
      }
      else if (ev.kind === 'axismin') {
        this.cf.hu = 'axis'; this.cf.ro = 'axis';
        for (const ci of this.cities) if (ci.ct === 'hu' || ci.ct === 'ro') ci.owner = 'axis';
        this.terrDirty = true;
        this.pushLog(`【${ev.title}】${ev.text}`, 'event'); this.pendingEvents.push(ev);
      }
      else if (ev.kind === 'barbarossa') {
        if (this.cf.su !== 'sov') continue;
        this.declareWar('axis', 'sov');
        // 苏联总动员
        const spots = this.spawnSpots(['minsk', 'kiev', 'leningrad', 'moscow', 'kharkov'], 10, 2);
        const roster = ['su:inf:0', 'su:inf:0', 'su:inf:0', 'su:inf:0', 'su:inf:0', 'su:inf:0', 'su:inf:0', 'su:inf:0', 'su:art:0', 'su:art:0'];
        let n = 0;
        for (let i = 0; i < roster.length && spots.length; i++) {
          const [c, r] = spots.shift();
          this.spawnUnit('su', roster[i], c, r, {}); n++;
        }
        this.pushLog(`苏联全面动员：${n} 个师紧急开赴西部边境！`, 'war');
        this.pendingEvents.push(ev);
      }
      else if (ev.kind === 'usa') {
        this.usaIn = true; this.gold.west += 150;
        this.pushLog(`【${ev.title}】${ev.text}`, 'event'); this.pendingEvents.push(ev);
        const london = this.cityByKey.london;
        if (london && london.owner === 'west') {
          const spots = this.spawnSpots(['london'], 4, 2);
          const roster = ['us:tank:0', 'us:tank:0', 'us:inf:0', 'us:inf:0'];
          for (let i = 0; i < roster.length && spots.length; i++) {
            const [c, r] = spots.shift();
            this.spawnUnit('us', roster[i], c, r, {});
          }
        }
      }
      else if (ev.kind === 'dday') {
        const foes = ['axis', 'west', 'sov'].filter(f => this.atWar('west', f));
        if (!foes.length) continue;
        let spots = this.spawnSpots([], 0, 0, [[24, 34], [25, 34], [26, 34], [27, 34], [28, 34], [24, 35], [25, 35], [26, 35], [27, 35], [28, 35]]);
        spots = spots.filter(([c, r]) => foes.includes(this.territoryOwner(c, r)));
        if (spots.length < 2) spots = this.spawnSpots(['london'], 6, 2);
        const roster = ['us:tank:0', 'us:tank:0', 'us:inf:0', 'us:inf:0', 'uk:art:0', 'uk:inf:0'];
        let n = 0;
        for (let i = 0; i < roster.length && spots.length; i++) {
          const [c, r] = spots.shift();
          const ct = roster[i].split(':')[0];
          this.spawnUnit(ct, roster[i], c, r, {}); n++;
        }
        if (n) { this.pushLog(`盟军 ${n} 个师成功登陆欧洲大陆！`, 'war'); this.pendingEvents.push(ev); }
      }
    }
  }
  /* 在指定城市周围(或给定格子中)寻找可放置单位的空地 */
  spawnSpots(cityKeys, want, radius, fixed) {
    const cand = [];
    if (fixed) {
      for (const [c, r] of fixed) {
        const t = this.tile(c, r);
        if (t && t !== '~' && !this.unitAt(c, r)) cand.push([c, r]);
      }
      return cand.slice(0, want || cand.length);
    }
    for (const ck of cityKeys) {
      const ci = this.cityByKey[ck]; if (!ci) continue;
      for (let rr = ci.y - radius; rr <= ci.y + radius; rr++)
        for (let cc = ci.x - radius; cc <= ci.x + radius; cc++) {
          if (!this.inMap(cc, rr)) continue;
          const t = this.tile(cc, rr);
          if (t && t !== '~' && !this.unitAt(cc, rr) && !cand.some(([a, b]) => a === cc && b === rr)) cand.push([cc, rr]);
        }
    }
    // 优先离城市近的
    cand.sort((a, b) => {
      let da = 99, db = 99;
      for (const ck of cityKeys) { const ci = this.cityByKey[ck]; da = Math.min(da, hexDist(a[0], a[1], ci.x, ci.y)); db = Math.min(db, hexDist(b[0], b[1], ci.x, ci.y)); }
      return da - db;
    });
    return cand.slice(0, want);
  }

  /* ------------------------------ 胜负 ------------------------------ */
  capitalsOf(f) { return this.cities.filter(ci => ci.cap && ci.owner === f); }
  checkVictory() {
    // 玩家失败：己方阵营无首都
    const myCaps = this.capitalsOf(this.playerFaction);
    if (!myCaps.length) { this.over = 'defeat'; return 'defeat'; }
    // 玩家胜利：所有交战敌对阵营均无首都
    const foes = ['axis', 'west', 'sov'].filter(f => f !== this.playerFaction && this.atWar(this.playerFaction, f));
    if (foes.length && foes.every(f => !this.capitalsOf(f).length)) { this.over = 'victory'; return 'victory'; }
    this.over = null; return null;
  }

  /* ------------------------------ AI ------------------------------ */
  aiTurn(f) {
    const acts = [];
    const units = this.units.filter(u => this.unitFaction(u) === f);
    const atWar = this.anyWar(f);
    const enemyCities = this.cities.filter(ci => this.atWar(f, ci.owner));
    const ownCities = this.cities.filter(ci => ci.owner === f);
    const dist = this.distMapTo(enemyCities.length ? enemyCities : ownCities.slice(0, 1));
    const distHome = this.distMapTo(ownCities.length ? ownCities : enemyCities.slice(0, 1));

    // 出动顺序：装甲→炮→步兵
    const order = { tank: 0, art: 1, inf: 2, air: 3 };
    units.sort((a, b) => (order[a.eq.cls] - order[b.eq.cls]));

    for (const u of units) {
      if (!this.units.includes(u)) continue;              // 已阵亡
      // 1) 残血撤退
      if (u.hp < 35 && u.eq.cls !== 'air') {
        const t = this.bestTile(u, distHome, { defensive: true });
        if (t) { if (t[0] !== u.c || t[1] !== u.r) { acts.push({ type: 'move', unit: u, to: t }); this.aiMove(u, t, distHome); } continue; }
      }
      // 2) 相机攻击（当前位置）
      if (atWar && !u.attacked) this.aiTryAttack(u, acts);
      if (!this.units.includes(u)) continue;             // 阵亡于反击
      if (u.attacked) continue;
      // 3) 移动
      if (!u.moved) {
        const t = this.bestTile(u, dist, {});
        if (t) { acts.push({ type: 'move', unit: u, to: t }); this.aiMove(u, t, dist); }
      }
      // 4) 移动后攻击
      if (atWar && !u.attacked) this.aiTryAttack(u, acts);
    }
    // 5) 招募
    this.aiRecruit(f, atWar);
    return acts;
  }
  aiMove(u, t) {
    const { cost, prev } = this.moveRange(u);
    if (!cost.has(key(t[0], t[1]))) return;
    this.moveUnit(u, t[0], t[1]);
  }
  aiTryAttack(u, acts) {
    const ts = this.targetsOf(u);
    if (!ts.length) return;
    let best = null, bs = 0;
    for (const e of ts) {
      if (!this.units.includes(e)) continue;
      const dmg = this.computeDamage(u, e, { preview: true });
      let counter = 0;
      const dist = hexDist(u.c, u.r, e.c, e.r);
      if (dist === 1 && (e.eq.cls === 'inf' || e.eq.cls === 'tank')) {
        const a2 = this.effAtk(e, u), d2 = this.effDef(u);
        counter = 42 * a2 / (a2 + d2) * 0.55;
      }
      let score = dmg * 1.2 + (dmg >= e.hp ? 60 + e.eq.cost * 0.15 : 0) - counter * 0.6;
      const city = this.cityAt(e.c, e.r);
      if (city) score += 15;
      if (u.hp < counter + 5) score -= 100;               // 不做自杀攻击
      if (score > bs) { bs = score; best = e; }
    }
    if (best && bs > 4) acts.push(this.attack(u, best));
  }
  bestTile(u, dist, opt) {
    const { cost } = this.moveRange(u);
    if (!cost.size) return null;
    let best = null, bs = -1e9;
    const dHere = dist.get(key(u.c, u.r));
    for (const [k, c] of cost) {
      const [c1, r1] = k.split(',').map(Number);
      let s = -(dist.get(k) ?? 99) * 10;
      if (dHere !== undefined && (dist.get(k) ?? 99) > dHere) s -= 20;   // 尽量不远离目标
      s += this.terrainDefBonus(c1, r1) * 8;
      const city = this.cityAt(c1, r1);
      if (city && this.atWar(this.unitFaction(u), city.owner)) s += 120;  // 占空城
      if (city && city.owner === this.unitFaction(u) && u.hp < 60) s += 30;
      if (opt.defensive && city && city.owner === this.unitFaction(u)) s += 40;
      // 避免停在敌方炮兵射程内(简化：相邻强敌扣分)
      for (const [ec, er] of this.neighbors(c1, r1)) {
        const e = this.unitAt(ec, er);
        if (e && this.atWar(this.unitFaction(u), this.unitFaction(e)) && u.eq.def < e.eq.atk * 0.8) s -= 25;
      }
      if (s > bs) { bs = s; best = [c1, r1]; }
    }
    return best;
  }
  /* 多源迪杰斯特拉：到一组城市的地形距离（二叉堆） */
  distMapTo(cities) {
    const dist = new Map();
    const heap = [];
    const push = (d, c, r) => {
      heap.push([d, c, r]);
      let i = heap.length - 1;
      while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; const t = heap[p]; heap[p] = heap[i]; heap[i] = t; i = p; }
    };
    const pop = () => {
      const top = heap[0], last = heap.pop();
      if (heap.length) {
        heap[0] = last; let i = 0;
        for (;;) {
          const l = 2 * i + 1, rr = l + 1; let m = i;
          if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
          if (rr < heap.length && heap[rr][0] < heap[m][0]) m = rr;
          if (m === i) break;
          const t = heap[m]; heap[m] = heap[i]; heap[i] = t; i = m;
        }
      }
      return top;
    };
    for (const ci of cities) { dist.set(key(ci.x, ci.y), 0); push(0, ci.x, ci.y); }
    const COST = { '.': 1, f: 2, h: 2, m: 3, '=': 3, c: 1 };
    while (heap.length) {
      const [d, c, r] = pop();
      if (d > (dist.get(key(c, r)) ?? 1e9)) continue;
      for (const [nc, nr] of this.neighbors(c, r)) {
        const t = this.tile(nc, nr);
        if (!t || t === '~') continue;
        const nd = d + (COST[t] || 2);
        if (nd < (dist.get(key(nc, nr)) ?? 1e9)) { dist.set(key(nc, nr), nd); push(nd, nc, nr); }
      }
    }
    return dist;
  }
  aiRecruit(f, atWar) {
    const cities = this.cities.filter(ci => ci.owner === f);
    const cap = this.factionCityCount(f) * 3 + 8;
    const myUnits = this.units.filter(u => this.unitFaction(u) === f).length;
    const peaceCap = cities.length * 2;
    if (myUnits >= (atWar ? cap : peaceCap)) return;
    for (const ci of cities) {
      if (this.unitAt(ci.x, ci.y)) continue;
      const rosterCt = EQUIP[ci.ct] ? ci.ct : 'neutral';
      const opts = [];
      for (const cls of ['inf', 'art', 'tank', 'air']) {
        (EQUIP[rosterCt][cls] || []).forEach((eq, i) => {
          if (eq.yr <= this.year() && eq.cost <= this.gold[f]) opts.push(`${rosterCt}:${cls}:${i}`);
        });
      }
      if (!opts.length) continue;
      // 构成偏好：装甲 40% / 炮 25% / 步 25% / 空 10%；首都受威胁时偏好步兵
      const weight = ek => {
        const eq = this.equipOf(ek);
        if (eq.cls === 'tank') return 4;
        if (eq.cls === 'art') return 2.5;
        if (eq.cls === 'inf') return 2.5;
        return 1;
      };
      const totW = opts.reduce((s, ek) => s + weight(ek), 0);
      if (totW <= 0) continue;
      let pick = Math.random() * totW, chosen = opts[0];
      for (const ek of opts) { pick -= weight(ek); if (pick <= 0) { chosen = ek; break; } }
      // 超级武器只有富余时才买
      if (this.equipOf(chosen).cost > 400 && this.gold[f] < 600) continue;
      const u = this.recruit(ci.k, chosen);
      if (u) {
        // AI 给新部队指派空闲将领
        const pool = GENERALS.filter(g => this.cf[g.ct] === f && this.genUnit[g.id] === null);
        const match = pool.find(g => g.skills.some(s => s.cls === u.eq.cls)) || pool.find(g => !g.skills.some(s => s.cls));
        if (match) this.assignGeneral(match.id, u);
      }
    }
  }

  /* ------------------------------ 杂项 ------------------------------ */
  pushLog(text, kind) {
    this.log.push({ t: this.dateLabel(), text, kind: kind || 'info' });
    if (this.log.length > 400) this.log.shift();
  }
  playerUnits() { return this.units.filter(u => this.unitFaction(u) === this.playerFaction); }
  /* 玩家可招募列表（某城市） */
  rosterFor(city) {
    const rosterCt = EQUIP[city.ct] ? city.ct : 'neutral';
    const out = [];
    for (const cls of ['inf', 'art', 'tank', 'air']) {
      (EQUIP[rosterCt][cls] || []).forEach((eq, i) => {
        out.push({ eqKey: `${rosterCt}:${cls}:${i}`, eq, locked: eq.yr > this.year() });
      });
    }
    // 1942 年后伦敦可招募美军装备
    if (city.ct === 'uk' && this.usaIn) {
      for (const cls of ['inf', 'art', 'tank', 'air']) {
        (EQUIP.us[cls] || []).forEach((eq, i) => {
          out.push({ eqKey: `us:${cls}:${i}`, eq, locked: eq.yr > this.year() });
        });
      }
    }
    return out;
  }

  /* ------------------------------ 存档 ------------------------------ */
  serialize() {
    return JSON.stringify({
      v: 2, turn: this.turn, nextId: this.nextId,
      playerFaction: this.playerFaction, difficulty: this.difficulty,
      gold: this.gold, westBonus: this.westBonus, usaIn: this.usaIn,
      wars: [...this.wars], cf: this.cf,
      cityOwners: this.cities.map(ci => ci.owner),
      stats: this.stats,
      genUnit: this.genUnit, genKills: this.genKills,
      units: this.units.map(u => ({
        id: u.id, ct: u.ct, eqKey: u.eqKey, hp: u.hp, xp: u.xp, vet: u.vet,
        c: u.c, r: u.r, moved: u.moved, attacked: u.attacked, dug: u.dug, gen: u.gen,
      })),
      log: this.log.slice(-80),
    });
  }
  static deserialize(str) {
    const d = JSON.parse(str);
    const g = new Game(d.playerFaction, d.difficulty);
    g.turn = d.turn; g.nextId = d.nextId;
    g.gold = d.gold; g.westBonus = d.westBonus; g.usaIn = d.usaIn;
    g.wars = new Set(d.wars); g.cf = d.cf;
    d.cityOwners.forEach((o, i) => { g.cities[i].owner = o; });
    g.stats = d.stats;
    g.genUnit = d.genUnit; g.genKills = d.genKills;
    g.units = d.units.map(u => ({ ...u, eq: g.equipOf(u.eqKey) }));
    g.log = d.log || [];
    g.terrDirty = true; g.over = null; g.pendingEvents = [];
    g.checkVictory();
    return g;
  }
}

/* 浏览器/Node 双端导出 */
if (typeof module !== 'undefined' && module.exports) module.exports = { Game, hexDist, key, MAP_W, MAP_H };
if (typeof window !== 'undefined') window.Game = Game;
