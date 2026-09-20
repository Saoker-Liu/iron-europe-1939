/* =========================================================================
 * 《钢铁欧陆 1939》 js/engine/game.js —— 核心引擎（无 DOM 依赖，可在 Node 下无头测试）
 * 六边形移动(迪杰斯特拉+ZOC) / 战斗结算 / 城市经济 / AI / 历史事件 / 存档
 * 依赖：js/core/hex.js 与 js/data/* 各数据模块（由 loader / js/data/load-node.js 预先装配）
 * ========================================================================= */
'use strict';

/* Node 无头环境：按序加载全部数据模块并装配到 globalThis */
if (typeof window === 'undefined' && typeof require === 'function') {
  Object.assign(globalThis, require('../data/load-node.js'));
}

const { key, hexDist } = HexMath;
const DIRS_EVEN = [[1, 0], [-1, 0], [0, -1], [-1, -1], [0, 1], [-1, 1]];
const DIRS_ODD  = [[1, 0], [-1, 0], [1, -1], [0, -1], [1, 1], [0, 1]];

class Game {
  constructor(playerFaction, difficulty, options = {}) {
    this.playerFaction = playerFaction || 'axis';
    this.difficulty = difficulty || 'normal';
    const DMULT = {
      easy:   { atk: 0.88, def: 0.88, inc: 0.85 },
      normal: { atk: 1.00, def: 1.00, inc: 1.00 },
      hard:   { atk: 1.12, def: 1.12, inc: 1.20 },
    };
    this.aiMult = DMULT[this.difficulty] || DMULT.normal;
    this.turn = 0;
    this.fallout = {};
    this.construction = [];
    this.nextId = 1;
    this.gold = Object.assign({}, START_GOLD);
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
    if(options.initialFleet!==false)this.cf.us='neutral';
    for (const ct in COUNTRIES) {
      if (COUNTRIES[ct].controller) this.cf[ct] = this.cf[COUNTRIES[ct].controller];
    }

    // 地形 & 城市
    this.terr = {};              // key -> 字符
    for (let r = 0; r < MAP_H; r++) {
      const row = (MAP_ROWS[r] || '').padEnd(MAP_W, '~');
      for (let c = 0; c < MAP_W; c++) this.terr[key(c, r)] = row[c];
    }
    this.cities = CITIES.map(ci => ({ ...ci, owner: this.cf[ci.ct], inc: (ECONOMY.income && ECONOMY.income[ci.k]) || 0 }));
    for (const ci of this.cities) this.terr[key(ci.x, ci.y)] = 'c';
    this.cityByKey = {}; for (const ci of this.cities) this.cityByKey[ci.k] = ci;
    this.harbors = this.buildHarbors();
    // Major-city airports are scenario abstractions, not individual historical airfields.
    this.airfields = this.cities.filter(ci=>!ci.demilitarized && (ci.cap || MAP_META.cityLabelLevels[ci.k]<=1));
    this.terrDirty = true; this._terrCache = null;
    this.blockedEdges = new Set(MAP_META.blockedEdges);
    this.riverEdges = new Set(MAP_META.riverEdges || []);
    this.provinces = new Int16Array(MAP_W * MAP_H).fill(-1);
    const citiesByCountry = {};
    this.cities.forEach((ci, i) => (citiesByCountry[ci.ct] ||= []).push(i));
    for (let r = 0; r < MAP_H; r++) for (let c = 0; c < MAP_W; c++) {
      const list = citiesByCountry[this.homeCountryOf(c, r)] || [];
      let best = -1, bd = Infinity;
      for (const i of list) {
        const ci = this.cities[i], d = hexDist(c, r, ci.x, ci.y);
        if (d < bd) { best = i; bd = d; }
      }
      this.provinces[r * MAP_W + c] = best;
    }

    // 将领状态
    this.genUnit = {};           // genId -> unitId | null
    this.genKills = {};          // genId -> 击杀数
    for (const g of GENERALS) { this.genUnit[g.id] = null; this.genKills[g.id] = 0; }

    // 单位
    this.units = [];
    this.usedShipNames = new Set();
    for (const d of INITIAL_UNITS) {
      if(this.equipOf(d.eq).cls==='air')continue; // Replaced by the national air scenario.
      this.spawnUnit(d.ct, d.eq, d.x, d.y, { gen: d.gen, silent: true });
    }
    if(options.initialFleet!==false)this.deployInitialFleets();
    if(options.initialAir!==false)this.deployInitialAirForces();
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
  edgeKey(a, b) { return [a.join(','), b.join(',')].sort().join('|'); }
  landPassable(c, r) { return !!TERRAIN[this.tile(c, r)]?.pass; }
  landNeighbors(c, r) {
    return this.neighbors(c, r).filter(p => this.landPassable(...p) &&
      !this.blockedEdges.has(this.edgeKey([c, r], p)));
  }
  transportOf(u) { return (ECONOMY.transports || []).find(t => t.id === u.transport) || null; }
  isNaval(u) { return !!CLASSES[u.eq.cls].naval; }
  isAir(u) { return u.eq.cls==='air'; }
  airRole(u) { return u.eq.airRole||'tactical'; }
  airRoleName(u) { return AIR.roles[this.airRole(u)]?.name||'空军'; }
  cargoOf(u) { return this.units.find(p=>p.carrierId===u.id)||null; }
  airBase(u) { const ci=this.cityByKey[u.airbase];return ci&&this.airfields.includes(ci)&&ci.owner===this.unitFaction(u)?ci:null; }
  airRadius(u) { return Math.max(1,this.movOf(u)); }
  airUnitsAt(cityKey) { return this.units.filter(u=>this.isAir(u)&&u.airbase===cityKey); }
  nearestAirfield(f,c,r) {
    return this.airfields.filter(ci=>ci.owner===f).sort((a,b)=>hexDist(c,r,a.x,a.y)-hexDist(c,r,b.x,b.y)||a.k.localeCompare(b.k))[0]||null;
  }
  airRoster(city) {
    const native=AIR.equipment[city.ct]?city.ct:'neutral';
    const ct=this.cf[city.ct]===city.owner?native:({axis:'de',west:'uk',sov:'su'}[city.owner]||'neutral');
    const countries=[ct];if(city.ct==='uk'&&city.owner==='west'&&this.usaIn)countries.push('us');
    return countries.flatMap(country=>Object.keys(AIR.roles).map(role=>{
      const list=EQUIP[country].air.map((eq,i)=>({eq,eqKey:`${country}:air:${i}`,country})).filter(o=>o.eq.airRole===role);
      const available=list.filter(o=>o.eq.yr<=this.year()).sort((a,b)=>a.eq.yr-b.eq.yr||a.eq.tier-b.eq.tier);
      const pick=available.at(-1)||list[0];return pick?{...pick,locked:!available.length}:null;
    }).filter(Boolean));
  }
  airBuildError(cityKey,eqKey,faction=this.playerFaction) {
    const ci=this.cityByKey[cityKey];
    if(!ci||!this.airfields.includes(ci))return '此城市没有机场';
    if(!['axis','west','sov'].includes(faction)||ci.owner!==faction)return '只能在己方机场组建';
    if(!this.airRoster(ci).some(o=>o.eqKey===eqKey&&!o.locked))return '只能组建此机场当前已解锁的最新机型';
    if(this.gold[faction]<this.equipOf(eqKey).cost)return '经济不足';
    return '';
  }
  recruitAir(cityKey,eqKey,faction=this.playerFaction) {
    if(this.airBuildError(cityKey,eqKey,faction))return null;
    const ci=this.cityByKey[cityKey],country=eqKey.split(':')[0];
    const ct=country==='neutral'?(this.cf[ci.ct]===faction?ci.ct:{axis:'de',west:'uk',sov:'su'}[faction]):country;
    const u=this.spawnUnit(ct,eqKey,ci.x,ci.y,{});
    this.gold[faction]-=u.eq.cost;u.moved=true;u.attacked=true;
    this.pushLog(`${this.factionName(faction)} 在${ci.n}机场组建${u.eq.n}（-${u.eq.cost}金），下回合可出击。`,'econ');return u;
  }
  rebaseAir(u,cityKey) {
    const base=this.airBase(u),ci=this.cityByKey[cityKey];
    if(!this.units.includes(u)||!this.isAir(u)||!base||!ci||!this.airfields.includes(ci)||ci===base||ci.owner!==this.unitFaction(u)||u.moved||u.attacked||hexDist(base.x,base.y,ci.x,ci.y)>this.airRadius(u))return false;
    u.airbase=ci.k;u.c=ci.x;u.r=ci.y;u.moved=true;u.attacked=true;u.dug=false;
    const cargo=this.cargoOf(u);if(cargo){cargo.c=ci.x;cargo.r=ci.y;}
    this.pushLog(`${u.eq.n} 转场至${ci.n}机场，本回合行动结束。`,'info');return true;
  }
  loadParatrooper(plane,para) {
    if(!plane||!para)return false;
    const base=this.airBase(plane);
    if(!plane||!para||!this.units.includes(plane)||!this.units.includes(para)||!this.isAir(plane)||this.airRole(plane)!=='transport'||!base||!para.eq.para||para.carrierId||para.embarked||this.cargoOf(plane)||this.unitFaction(para)!==this.unitFaction(plane)||para.c!==base.x||para.r!==base.y||plane.moved||plane.attacked||para.moved||para.attacked)return false;
    para.carrierId=plane.id;para.moved=true;para.attacked=true;para.dug=false;
    this.pushLog(`${para.eq.n}在${base.n}登上${plane.eq.n}。`,'info');return true;
  }
  unloadParatrooper(plane) {
    const para=this.cargoOf(plane),base=this.airBase(plane);
    if(!para||!base||plane.moved||plane.attacked||this.unitAt(base.x,base.y))return false;
    delete para.carrierId;para.c=base.x;para.r=base.y;para.moved=true;para.attacked=true;plane.moved=true;plane.attacked=true;return true;
  }
  paradropError(plane,c,r) {
    const base=this.airBase(plane);
    if(!this.units.includes(plane)||!this.isAir(plane)||this.airRole(plane)!=='transport'||!base||!this.cargoOf(plane))return '需要装载伞兵的运输机';
    if(plane.moved||plane.attacked)return '本回合已行动';
    if(!Number.isInteger(c)||!Number.isInteger(r)||!this.landPassable(c,r)||this.unitAt(c,r))return '伞降目标必须是空闲陆格';
    if(hexDist(base.x,base.y,c,r)>this.airRadius(plane)||c===base.x&&r===base.y)return '目标超出航程或位于起飞机场';
    const city=this.cityAt(c,r);if(city?.demilitarized)return '不能伞降到非军事区';
    return '';
  }
  paradrop(plane,c,r) {
    if(this.paradropError(plane,c,r))return false;
    const para=this.cargoOf(plane),f=this.unitFaction(plane),ct=this.homeCountryOf(c,r);
    delete para.carrierId;para.c=c;para.r=r;para.moved=true;para.attacked=true;plane.moved=true;plane.attacked=true;
    if(ct&&this.cf[ct]==='neutral'&&f!=='neutral')this.neutralDefect(ct,f);
    const city=this.cityAt(c,r);if(city&&city.owner!==f)this.captureCity(city,f,para);
    this.pushLog(`${plane.eq.n}完成伞降，${para.eq.n}在(${c},${r})着陆，下回合可行动。`,'battle');return true;
  }
  contamination(c,r) { return this.fallout[key(c,r)]||0; }
  cityIncome(ci) { return this.contamination(ci.x,ci.y)>0?0:ci.inc; }
  nuclearError(u,c,r) {
    if(!this.units.includes(u)||!this.isAir(u)||this.airRole(u)!=='strategic'||!this.airBase(u))return '只有战略轰炸机可执行核打击';
    if(this.year()<AIR.nuclear.year)return `${AIR.nuclear.year}年核技术尚未解锁`;
    if(u.attacked||u.moved)return '本回合已行动';
    if(this.gold[this.unitFaction(u)]<AIR.nuclear.cost)return '核打击经济不足';
    if(!Number.isInteger(c)||!Number.isInteger(r)||!this.inMap(c,r)||this.tile(c,r)==='x'||hexDist(u.c,u.r,c,r)>this.airRadius(u))return '目标超出作战范围';
    return '';
  }
  nuclearStrike(u,c,r) {
    if(this.nuclearError(u,c,r))return false;
    const f=this.unitFaction(u),cells=[[c,r],...this.neighbors(c,r)],affected=new Set(cells.map(p=>key(...p)));
    this.gold[f]-=AIR.nuclear.cost;u.moved=true;u.attacked=true;
    // Blast and fallout affect every layer and every side, including the launcher's base if selected.
    for(const ci of this.cities.filter(ci=>affected.has(key(ci.x,ci.y)))){
      if(ci.owner==='neutral')this.neutralDefect(ci.ct,f);
      else if(ci.owner!==f)this.declareWar(f,ci.owner);
    }
    for(const target of [...this.units]){
      if(!this.units.includes(target)||!affected.has(key(target.c,target.r)))continue;
      const tf=this.unitFaction(target);if(tf==='neutral')this.neutralDefect(target.ct,f);else if(tf!==f)this.declareWar(f,tf);
      target.hp-=target.c===c&&target.r===r?target.hp:AIR.nuclear.splash;
      if(target.hp<=0)this.killUnit(target);
    }
    for(const p of cells)this.fallout[key(...p)]=AIR.nuclear.duration;
    this.pushLog(`核打击命中(${c},${r})：中心格所有部队消灭，邻格损失${AIR.nuclear.splash}兵力；污染${AIR.nuclear.duration}回合，每回合损失${AIR.nuclear.damage}兵力，污染城市收入归零。（-${AIR.nuclear.cost}金）`,'war');
    return true;
  }
  applyFalloutDamage() {
    for(const u of [...this.units])if(this.units.includes(u)&&this.contamination(u.c,u.r)){
      u.hp-=AIR.nuclear.damage;if(u.hp<=0)this.killUnit(u);
    }
  }
  ageFallout() { for(const k of Object.keys(this.fallout)){if(--this.fallout[k]<=0)delete this.fallout[k];} }
  removeLostAirfields() {
    for(const u of [...this.units])if(this.isAir(u)&&!this.airBase(u)){
      this.pushLog(`${u.eq.n}因驻扎机场失守而损失。`,'war');this.killUnit(u);
    }
  }

  unitName(u) { return this.isNaval(u)?u.shipName:u.eq.n; }
  navalIdentity(u) {
    return `${COUNTRIES[u.ct]?.name||u.ct} · ${CLASSES[u.eq.cls].name} · ${u.eq.className||u.eq.n} · ${this.unitName(u)}`;
  }
  shipNamePool(ct,eqKey) { return eqKey.split(':')[0]===ct ? NAVAL.names[eqKey]||[] : []; }
  genericShipName(cls) { return {bc:'战列巡洋舰',cve:'护航航母',cv:'航空母舰'}[cls]||CLASSES[cls].name; }
  shipNameAvailable(ct,entry) {
    return !this.usedShipNames.has(`${ct}:${entry.n}`)&&(!entry.identity||!this.usedShipNames.has(`${ct}:@${entry.identity}`));
  }
  nextShipName(ct,eqKey) {
    const found=this.shipNamePool(ct,eqKey).find(e=>this.shipNameAvailable(ct,e));
    if(found)return found;
    const prefix=this.genericShipName(this.equipOf(eqKey).cls);
    let i=1;while(this.usedShipNames.has(`${ct}:${prefix}${i}`))i++;
    return {n:prefix+i,kind:'generic'};
  }
  rememberShipName(ct,entry) {
    this.usedShipNames.add(`${ct}:${entry.n}`);
    if(entry.identity)this.usedShipNames.add(`${ct}:@${entry.identity}`);
  }
  shipNameInfo(u) {
    return this.shipNamePool(u.ct,u.eqKey).find(e=>e.n===u.shipName)||{n:u.shipName,kind:'generic'};
  }
  deployInitialAirForces() {
    for(const d of AIR.initialUnits){
      const city=this.cityByKey[d.base],ct=AIR.equipment[d.ct]?d.ct:'neutral';
      const index=EQUIP[ct].air.findIndex(e=>e.airRole===d.role&&e.tier===d.tier);
      const eq=EQUIP[ct].air[index];
      if(!city||city.ct!==d.ct||city.owner!==this.cf[d.ct]||!this.airfields.includes(city)||!eq||eq.yr>this.year())throw Error('无效的初始空军部署：'+d.ct+' / '+d.base+' / '+d.role);
      // Explicit bases avoid accidentally assigning neutral aircraft to another country.
      this.spawnUnit(d.ct,`${ct}:air:${index}`,city.x,city.y,{gen:d.gen,silent:true});
    }
  }
  deployInitialFleets() {
    const reserved=new Set(this.harbors.map(h=>key(h.c,h.r)));
    for(const d of NAVAL.initialFleets||[]){
      const harbor=typeof d.base==='string'?this.harbors.find(h=>h.cityKey===d.base):null;
      const origin=Array.isArray(d.base)?d.base:harbor?[harbor.c,harbor.r]:null;
      if(!origin||!this.ocean(...origin))throw Error('开局舰队基地无效：'+d.base);
      const queue=[origin],seen=new Set([key(...origin)]);let spot=null;
      for(let i=0;i<queue.length;i++){
        const p=queue[i];
        if(!reserved.has(key(...p))&&!this.unitAt(...p)){spot=p;break;}
        for(const q of this.seaNeighbors(...p))if(!seen.has(key(...q))){seen.add(key(...q));queue.push(q);}
      }
      if(!spot)throw Error('开局舰队没有可用海格：'+d.ct);
      this.spawnUnit(d.ct,d.eq,...spot,{silent:true});
    }
  }
  isEmbarked(u) { return !!u.embarked && !!this.transportOf(u) && !CLASSES[u.eq.cls].fly && !this.isNaval(u); }
  isSeagoing(u) { return this.isNaval(u) || this.isEmbarked(u); }
  buildHarbors() {
    const used=new Set(),out=[];
    const cities=NAVAL.portCities.map(k=>this.cityByKey[k]).filter(ci=>ci&&!ci.demilitarized);
    // Scarce shoreline first so adjacent cities cannot steal each other's only berth.
    cities.sort((a,b)=>this.neighbors(a.x,a.y).filter(p=>this.ocean(...p)).length-this.neighbors(b.x,b.y).filter(p=>this.ocean(...p)).length);
    for(const ci of cities){
      const spots=this.neighbors(ci.x,ci.y).filter(p=>this.ocean(...p)&&!used.has(key(...p)));
      spots.sort((a,b)=>this.neighbors(...b).filter(p=>this.ocean(...p)).length-this.neighbors(...a).filter(p=>this.ocean(...p)).length);
      if(spots.length){const [c,r]=spots[0];used.add(key(c,r));out.push({cityKey:ci.k,c,r});}
    }
    return out;
  }
  hasFacility(city,kind) {
    return kind==='factory'?!!city.factory:kind==='airfield'?this.airfields.includes(city):kind==='harbor'?this.harbors.some(h=>h.cityKey===city.k):false;
  }
  harborSites(city) {
    return this.neighbors(city.x,city.y).filter(([c,r])=>this.ocean(c,r)&&
      !this.harborAt(c,r)&&!this.unitAt(c,r)&&
      !this.construction.some(p=>p.kind==='harbor'&&p.c===c&&p.r===r));
  }
  constructionError(cityKey,kind,site=null,faction=this.playerFaction) {
    const ci=this.cityByKey[cityKey],rule=ECONOMY.construction[kind];
    if(!ci||!Object.hasOwn(ECONOMY.construction,kind))return '无效的建设项目';
    if(!['axis','west','sov'].includes(faction)||ci.owner!==faction)return '只能在己方城市建设';
    if(ci.demilitarized&&kind!=='factory')return '非军事区不能建设军事设施';
    if(this.hasFacility(ci,kind))return '此设施已建成';
    if(this.construction.some(p=>p.cityKey===ci.k&&p.kind===kind))return '此设施正在建设';
    if(kind==='harbor'){
      const sites=this.harborSites(ci);
      if(!sites.length)return '没有可用的相邻海域';
      if(site&&(!Array.isArray(site)||site.length!==2||!sites.some(p=>p[0]===site[0]&&p[1]===site[1])))return '港址必须是空闲且未被预留的相邻海格';
    }
    if(this.gold[faction]<rule.cost)return '经济不足';
    return '';
  }
  startConstruction(cityKey,kind,site=null,faction=this.playerFaction) {
    if(this.constructionError(cityKey,kind,site,faction)||kind==='harbor'&&!site)return false;
    const rule=ECONOMY.construction[kind],ci=this.cityByKey[cityKey];
    this.gold[faction]-=rule.cost;
    this.construction.push({cityKey,kind,remaining:rule.turns,...(kind==='harbor'?{c:site[0],r:site[1]}:{})});
    this.pushLog(`${ci.n}开始建设${rule.name}（-${rule.cost}金，${rule.turns}回合）。`,'econ');
    return true;
  }
  advanceConstruction() {
    this.construction=this.construction.filter(p=>{
      const ci=this.cityByKey[p.cityKey],occupant=p.kind==='harbor'?this.unitAt(p.c,p.r):null;
      if(occupant&&this.unitFaction(occupant)!==ci.owner){
        this.pushLog(`${ci.n}港口工地被非己方部队占据，本回合停工。`,'info');return true;
      }
      if(--p.remaining>0)return true;
      if(p.kind==='factory')ci.factory=true;
      else if(p.kind==='airfield')this.airfields.push(ci);
      else this.harbors.push({cityKey:ci.k,c:p.c,r:p.r});
      this.pushLog(`${ci.n}${ECONOMY.construction[p.kind].name}建设完成。`,'econ');
      return false;
    });
  }
  harborAt(c,r) { return this.harbors.find(h=>h.c===c&&h.r===r)||null; }
  navalCountry(city) {
    if(this.cf[city.ct]===city.owner)return NAVAL.equipment[city.ct]?city.ct:'neutral';
    return {axis:'de',west:'uk',sov:'su'}[city.owner]||'neutral';
  }
  navalRoster(city) {
    const countries=[this.navalCountry(city)];
    if(city.ct==='uk'&&city.owner==='west'&&this.usaIn)countries.push('us');
    return countries.flatMap(ct=>Object.keys(NAVAL.classes).map(cls=>{
      const list=EQUIP[ct][cls],available=list.map((eq,i)=>({eq,i})).filter(x=>x.eq.yr<=this.year());
      const pick=available.at(-1)||{eq:list[0],i:0};
      return {eqKey:`${ct}:${cls}:${pick.i}`,eq:pick.eq,locked:!available.length,country:ct};
    }));
  }
  navalBuildError(cityKey,eqKey,faction) {
    const ci=this.cityByKey[cityKey],h=this.harbors.find(p=>p.cityKey===cityKey);
    if(!ci||!h||ci.demilitarized)return '此处没有可用军港';
    if(!['axis','west','sov'].includes(faction)||ci.owner!==faction)return '只能在己方军港建造';
    if(this.unitAt(h.c,h.r))return '泊位被占用，请先驶离或清除敌舰';
    const offer=this.navalRoster(ci).find(o=>o.eqKey===eqKey&&!o.locked);
    if(!offer)return '只能建造当前年份已解锁的最新舰型';
    if(this.gold[faction]<offer.eq.cost)return '经济不足';
    return '';
  }
  recruitNaval(cityKey,eqKey,faction=this.playerFaction) {
    if(this.navalBuildError(cityKey,eqKey,faction))return null;
    const ci=this.cityByKey[cityKey],h=this.harbors.find(p=>p.cityKey===cityKey),eq=this.equipOf(eqKey);
    const rosterCt=eqKey.split(':')[0];
    const ct=rosterCt==='neutral'?ci.ct:rosterCt;
    this.gold[faction]-=eq.cost;
    const u=this.spawnUnit(ct,eqKey,h.c,h.r,{});u.moved=true;u.attacked=true;
    this.pushLog(`${this.factionName(faction)} 在${ci.n}军港建造 ${this.navalIdentity(u)}（-${eq.cost}金），下回合可行动。`,'econ');
    return u;
  }
  ocean(c,r) { return this.tile(c,r) === '~'; }
  seaNeighbors(c,r) {
    const out=this.neighbors(c,r).filter(p=>this.ocean(...p)&&!this.blockedEdges.has(this.edgeKey([c,r],p)));
    for(const p of NAVAL.passages){
      if(key(c,r)===key(...p.a))out.push(p.b);
      if(key(c,r)===key(...p.b))out.push(p.a);
    }
    return out;
  }
  // Strategic connectivity for AI; costs/ownership/occupancy are checked by moveRange.
  transportNeighbors(c,r) {
    const out=this.neighbors(c,r).filter(p => (this.ocean(...p) || this.landPassable(...p)) &&
      (this.ocean(c,r) || this.ocean(...p) || !this.blockedEdges.has(this.edgeKey([c,r],p))));
    if(this.ocean(c,r))for(const p of this.seaNeighbors(c,r))if(!out.some(q=>key(...p)===key(...q)))out.push(p);
    return out;
  }
  transportPrice(u,id) {
    const next=(ECONOMY.transports || []).find(t=>t.id===id),old=this.transportOf(u);
    return next ? next.cost-(old ? old.cost : 0) : Infinity;
  }
  canEquipTransport(u,id) {
    const ship=(ECONOMY.transports || []).find(t=>t.id===id),price=this.transportPrice(u,id);
    return this.units.includes(u) && !this.isNaval(u) && !CLASSES[u.eq.cls].fly && !u.embarked && !u.moved && !u.attacked &&
      this.landPassable(u.c,u.r) && this.neighbors(u.c,u.r).some(p=>this.ocean(...p)) &&
      !!ship && ship.year<=this.year() && price>0 && this.gold[this.unitFaction(u)]>=price;
  }
  equipTransport(u,id) {
    if(!this.canEquipTransport(u,id))return false;
    const price=this.transportPrice(u,id);this.gold[this.unitFaction(u)]-=price;u.transport=id;
    this.pushLog(`${u.eq.n} 配备${this.transportOf(u).name}（-${price} 金），可选择相邻海格下海。`,'econ');
    return true;
  }
  movementEndsTurn(u,c,r) { return this.isAir(u) || !this.isNaval(u) && !CLASSES[u.eq.cls].fly && this.isEmbarked(u)!==this.ocean(c,r); }
  unitAt(c, r) { return this.units.find(u => !this.isAir(u) && !u.carrierId && u.c === c && u.r === r) || null; }
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

  equipOf(eqKey) { const [ct, cls, idx] = String(eqKey).split(':'); return EQUIP[ct]?.[cls]?.[+idx]; }

  /* Fixed historical borders; city control spreads only within its own country. */
  territoryOwner(c, r) {
    if (!this.inMap(c, r)) return null;
    const ct = this.homeCountryOf(c, r);
    if (!ct) return null;
    const i = this.provinces[r * MAP_W + c];
    return i >= 0 ? this.cities[i].owner : this.cf[ct];
  }
  homeCountryOf(c, r) {   // 该格属于哪个母国的势力范围（冬季"苏联土地"判定）
    return HOME_COUNTRIES[r]?.[c] || null;
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
    if(this.isAir(u))return this.airRadius(u);
    if (this.isEmbarked(u)) return 1;
    if (this.isNaval(u)) return u.eq.rng;
    let rng = CLASSES.art.ranged && u.eq.cls === 'art' ? (u.eq.rng || 2) : 1;
    const s = this.genSkill(u, 'rng'); if (s) rng += s.n;
    return rng;
  }

  /* ------------------------------ 移动 ------------------------------ */
  terrainCost(u, c, r) {
    if(this.isSeagoing(u))return this.ocean(c,r)?1:Infinity;
    const t = this.tile(c, r); const T = TERRAIN[t];
    if (CLASSES[u.eq.cls].fly && (t === '~' || t === 'l')) return 1;
    if (!T || !T.pass) return Infinity;
    return T.cost ? T.cost[u.eq.cls] : 1;
  }
  /* 迪杰斯特拉：可达格成本表 + 前驱(用于还原路径) */
  moveRange(u) {
    if(u.carrierId || u.moved || u.attacked)return {cost:new Map(),prev:new Map()};
    if(this.isAir(u)){
      const cost=new Map(),prev=new Map(),base=this.airBase(u);
      if(base)for(const ci of this.airfields)if(ci!==base&&ci.owner===this.unitFaction(u)&&hexDist(base.x,base.y,ci.x,ci.y)<=this.airRadius(u)){cost.set(key(ci.x,ci.y),hexDist(base.x,base.y,ci.x,ci.y));prev.set(key(ci.x,ci.y),key(u.c,u.r));}
      return {cost,prev};
    }
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
      for (const [nc, nr] of (this.isSeagoing(u)?this.seaNeighbors(c,r):this.neighbors(c, r))) {
        const nk = key(nc, nr), t = this.tile(nc, nr);
        if (!t || (!CLASSES[u.eq.cls].fly && !(this.isSeagoing(u) ? this.ocean(nc,nr) : this.landPassable(nc,nr)))) continue;
        if (!CLASSES[u.eq.cls].fly && this.blockedEdges.has(this.edgeKey([c, r], [nc, nr]))) continue;
        const occ = this.unitAt(nc, nr);
        if (occ && this.unitFaction(occ) !== this.unitFaction(u)) continue;   // 敌方格阻挡
        const step = this.terrainCost(u, nc, nr) + (this.isSeagoing(u)?hexDist(c,r,nc,nr)-1:0) +
          (!CLASSES[u.eq.cls].fly && !this.isSeagoing(u) && this.riverEdges.has(this.edgeKey([c, r], [nc, nr])) ? 1 : 0);
        const ncost = bc + step;
        if (ncost > mov) continue;
        if (!cost.has(nk) || ncost < cost.get(nk)) { cost.set(nk, ncost); prev.set(nk, bk); }
        // 进入敌方控制区 → 移动终止于该格
        if (!this.hasNoZOC(u)) {
          const nearEnemy = (this.isSeagoing(u) ? this.neighbors(nc,nr) : this.landNeighbors(nc, nr)).some(([ec, er]) => {
            const e = this.unitAt(ec, er);
            return e && this.atWar(this.unitFaction(u), this.unitFaction(e)) && this.canStrikeFrom(e,ec,er,{...u,c:nc,r:nr});
          });
          if (nearEnemy) zocStop.add(nk);
        }
      }
    }
    cost.delete(start);
    // 可停留格：无单位占据
    const ends = new Map();
    for (const [k, v] of cost) {
      const p = k.split(',').map(Number);
      if ((this.isSeagoing(u) ? this.ocean(...p) : this.landPassable(...p)) && !this.unitAt(...p)) ends.set(k, v);
    }
    // A shore transition is a separate adjacent move and ends both actions.
    if(!this.isNaval(u) && !CLASSES[u.eq.cls].fly && this.transportOf(u))for(const p of this.neighbors(u.c,u.r)){
      const valid=this.isEmbarked(u)?this.landPassable(...p):this.ocean(...p);
      if(valid&&!this.unitAt(...p)){ends.set(key(...p),mov);prev.set(key(...p),start);}
    }
    return { cost: ends, prev };
  }
  pathTo(u, ck) {
    const { cost, prev } = this.moveRange(u);
    if(!cost.has(ck))return null;
    const path = []; let k = ck;
    while (k && k !== key(u.c, u.r)) { path.unshift(k); k = prev.get(k); }
    return path.length ? path.map(s => s.split(',').map(Number)) : null;
  }
  movOf(u) {
    if(this.isEmbarked(u))return this.transportOf(u).move;
    let m = u.eq.mov;
    const s = this.genSkill(u, 'mov'); if (s) m += s.n;
    return m;
  }

  moveUnit(u, c, r, path) {
    if(!this.units.includes(u)||u.carrierId||u.moved||u.attacked)return false;
    if(this.isAir(u))return this.rebaseAir(u,this.cityAt(c,r)?.k);
    const f = this.unitFaction(u);
    // Never trust caller-supplied paths to bypass movement/terrain/occupancy rules.
    path=this.pathTo(u,key(c,r));if(!path)return false;
    const transition=this.movementEndsTurn(u,c,r);
    if(transition){u.embarked=this.ocean(c,r);u.attacked=true;
      this.pushLog(`${u.eq.n}${u.embarked?'下海':'上岸'}，本回合行动结束。`,'info');}
    for (const p of path) {
      const ct = this.homeCountryOf(...p);
      if (ct && !COUNTRIES[ct].context && !COUNTRIES[ct].controller && this.cf[ct] === 'neutral' && f !== 'neutral') this.neutralDefect(ct, f);
    }
    u.moved = true; u.dug = false;
    u.c = c; u.r = r;
    const city = this.cityAt(c, r);
    if (city && city.owner !== this.unitFaction(u)) this.captureCity(city, this.unitFaction(u), u);
    // 大国军队开进中立国领土 → 中立国即刻倒向敌方（历史：1940 低地国家）
    return true;
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
    if(target&&this.isAir(u)){
      const rule=AIR.roles[this.airRole(u)];
      m*=this.isAir(target)?rule.air:this.isSeagoing(target)?rule.sea:target.eq.cls==='inf'?rule.inf:rule.ground;
    } else if (target && !this.isEmbarked(u)) m *= ATK_MOD[u.eq.cls][this.isEmbarked(target)?'inf':target.eq.cls];     // 兵种克制
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
    return u.eq.atk * m * (this.isEmbarked(u)?this.transportOf(u).attackMultiplier:1);
  }
  effDef(u) {
    if(this.isEmbarked(u))return this.transportOf(u).defense*(this.unitFaction(u)!==this.playerFaction?this.aiMult.def:1);
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
    if(a<=0)return 0;
    const ignoreTerrain = !this.isEmbarked(att) && (att.eq.cls === 'art' || att.eq.cls === 'air');
    let dm = 1 + (ignoreTerrain ? 0 : this.terrainDefBonus(def.c, def.r));
    const cd = this.genSkill(def, 'citydef');
    if (cd && this.cityAt(def.c, def.r)) dm *= 1 + cd.m;
    const d = this.effDef(def) * dm;
    let dmg = 42 * a / (a + d);
    if (!opt || !opt.preview) dmg *= 0.85 + Math.random() * 0.3;
    return Math.max(3, Math.round(dmg));
  }
  canAttackNow(u) { return !u.carrierId && !(this.isAir(u)&&this.airRole(u)==='transport') && !u.attacked && u.hp > 0; }
  canStrikeFrom(u,c,r,e) {
    if(u.carrierId||e.carrierId)return false;
    if(this.isAir(u)&&this.airRole(u)==='transport')return false;
    if(this.isAir(u)){
      const base=this.airBase(u);
      return !!base && c===base.x && r===base.y && hexDist(base.x,base.y,e.c,e.r)<=this.airRadius(u);
    }
    const dist=hexDist(c,r,e.c,e.r);
    if(dist<1||dist>this.rangeOf(u))return false;
    if(u.eq.cls==='sub'&&!this.isSeagoing(e))return false;
    // Only depth charges and carrier/land-based aircraft can engage submarines.
    if(e.eq.cls==='sub'&&!this.isEmbarked(u)&&!['sub','dd','cve','cv','air'].includes(u.eq.cls))return false;
    if(e.eq.cls==='sub'&&this.isEmbarked(u))return false;
    if(!this.isEmbarked(u)&&u.eq.cls!=='air'&&u.eq.cls!=='art'&&this.blockedEdges.has(this.edgeKey([c,r],[e.c,e.r])))return false;
    return true;
  }
  canCounter(def,att) {
    // Incoming sorties reach the target: naval AA can respond even when the base is distant.
    if(this.isAir(att))return this.isAir(def)?this.airRole(def)!=='transport'&&!!this.airBase(def):this.isNaval(def)&&def.eq.cls!=='sub';
    if(!this.canStrikeFrom(def,def.c,def.r,att))return false;
    return this.isNaval(def) || (hexDist(att.c,att.r,def.c,def.r)===1 && (this.isEmbarked(def)||['inf','tank'].includes(def.eq.cls)));
  }
  targetsOf(u) {
    if(!this.canAttackNow(u))return [];
    return this.units.filter(e=>this.atWar(this.unitFaction(u),this.unitFaction(e))&&this.canStrikeFrom(u,u.c,u.r,e));
  }
  attack(att, def) {
    if(!this.units.includes(att)||!this.units.includes(def)||!this.targetsOf(att).includes(def))return null;
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
      if (this.canCounter(def,att)) {
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
    const an = this.unitName(att) + (att.gen ? `(${this.genOf(att).name})` : '');
    const dn = this.unitName(def);
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
    const cargo=this.cargoOf(u);if(cargo)this.killUnit(cargo);
    this.units = this.units.filter(x => x !== u);
    if (u.gen) { this.genUnit[u.gen] = null; }
  }

  /* ------------------------------ 城市 ------------------------------ */
  captureCity(city, faction, byUnit) {
    if(byUnit&&(this.isAir(byUnit)||byUnit.carrierId))return false;
    const old = city.owner;
    city.owner = faction; this.terrDirty = true;
    const cn = COUNTRIES[city.ct].name;
    this.pushLog(`${this.factionName(faction)} 占领 ${cn} ${city.n}！`, 'war');
    // 首都易手 → 该国全境易帜
    if (city.cap) {
      let flipped = 0;
      for (const ci of this.cities) {
        if ((ci.ct === city.ct || COUNTRIES[ci.ct].controller === city.ct) && ci.owner !== faction) { ci.owner = faction; flipped++; }
      }
      this.terrDirty = true;
      this.pushLog(`${cn}首都 ${city.n} 陷落，${cn}全境沦陷！（${flipped} 座城市易手）`, 'war');
    }
    this.removeLostAirfields();
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
    let base = this.cities.filter(ci => ci.owner === f).reduce((s, ci) => s + this.cityIncome(ci), 0);
    if (f === 'west' && this.usaIn) base += ECONOMY.usaIncomeBonus;
    if (f !== this.playerFaction) base = Math.round(base * this.aiMult.inc);
    return base;
  }
  factionCityCount(f) { return this.cities.filter(ci => ci.owner === f).length; }

  /* 招募：返回单位或 null */
  recruit(cityK, eqKey) {
    const city = this.cityByKey[cityK]; if (!city || city.demilitarized) return null;
    const f = city.owner;
    if (this.unitAt(city.x, city.y)) return null;
    const eq = this.equipOf(eqKey);
    if(eq?.para&&!this.airfields.includes(city))return null;
    if (!eq || eq.cls==='air' || CLASSES[eq.cls].naval || eq.yr > this.year()) return null;
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
      moved: false, attacked: false, dug: false, gen: null, transport:null, embarked:false,
    };
    if(this.isAir(u)){
      const base=this.nearestAirfield(this.unitFaction(u),x,y);
      if(!base)throw Error('没有己方机场可部署空军');
      u.airbase=base.k;u.c=base.x;u.r=base.y;
    }
    if(this.isNaval(u)){
      const entry=this.nextShipName(ct,eqKey);
      u.shipName=entry.n;this.rememberShipName(ct,entry);
    }
    this.units.push(u);
    if (opt && opt.gen && this.genUnit[opt.gen] === null) {
      u.gen = opt.gen; this.genUnit[opt.gen] = u.id;
      if (!(opt && opt.silent)) this.pushLog(`${this.genOf(u).name} 将军就任 ${eq.n} 指挥官`, 'info');
    }
    return u;
  }
  assignGeneral(genId, unit) {
    if(!unit||this.isNaval(unit))return false; // Existing roster contains land/air commanders only.
    if (this.genUnit[genId] !== null) return false;
    const old = this.units.find(u => u.gen === genId);
    if (old) { old.gen = null; this.genUnit[genId] = null; }
    if (unit.gen) this.genUnit[unit.gen] = null;
    unit.gen = genId; this.genUnit[genId] = unit.id;
    return true;
  }

  /* ------------------------------ 回合推进 ------------------------------ */
  startTurnFor(f) {
    this.removeLostAirfields();
    // 收入 & 行动权恢复
    const inc = this.factionIncome(f);
    this.gold[f] += inc;
    for (const u of this.units) {
      if (this.unitFaction(u) !== f) continue;
      if(u.carrierId)continue;
      u.moved = false; u.attacked = false;
      if(this.contamination(u.c,u.r))continue;
      const city = this.cityAt(u.c, u.r);
      let heal = 0;
      if (this.isEmbarked(u)) continue;
      if (this.isNaval(u)) {
        const harbor=this.harborAt(u.c,u.r);
        if(harbor&&this.cityByKey[harbor.cityKey].owner===f)u.hp=Math.min(100,u.hp+25);
        continue;
      }
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
    this.applyFalloutDamage();
    this.turn++;
    this.processEvents();
    this.advanceConstruction();
    this.startTurnFor(this.playerFaction);
    this.ageFallout();
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
        this.cf.al = 'axis';
        for (const ci of this.cities) if (ci.ct === 'it' || ci.ct === 'al') ci.owner = 'axis';
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
        this.usaIn = true; this.cf.us='west'; this.gold.west += 150;
        for(const ci of this.cities)if(ci.ct==='us')ci.owner='west';
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
        let spots = this.spawnSpots([], 0, 0, MAP_META.landingCells);
        spots = spots.filter(([c, r]) => foes.includes(this.territoryOwner(c, r)));
        if (!spots.length) { this.pushLog('诺曼底登陆取消：没有可用的敌占海滩。', 'event'); continue; }
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
        if (this.landPassable(c, r) && !this.unitAt(c, r)) cand.push([c, r]);
      }
      return cand.slice(0, want || cand.length);
    }
    for (const ck of cityKeys) {
      const ci = this.cityByKey[ck]; if (!ci) continue;
      for (let rr = ci.y - radius; rr <= ci.y + radius; rr++)
        for (let cc = ci.x - radius; cc <= ci.x + radius; cc++) {
          if (!this.inMap(cc, rr)) continue;
          const t = this.tile(cc, rr);
          if (this.landPassable(cc, rr) && this.territoryOwner(cc, rr) === ci.owner && !this.unitAt(cc, rr) && !cand.some(([a, b]) => a === cc && b === rr)) cand.push([cc, rr]);
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
  seaDistances(points) {
    const dist=new Map(),queue=[];
    for(const [c,r]of points)if(this.ocean(c,r)&&!dist.has(key(c,r))){dist.set(key(c,r),0);queue.push([c,r]);}
    for(let i=0;i<queue.length;i++){
      const [c,r]=queue[i],d=dist.get(key(c,r));
      for(const p of this.seaNeighbors(c,r)){
        const nd=d+hexDist(c,r,...p);
        if(nd<(dist.get(key(...p))??Infinity)){dist.set(key(...p),nd);queue.push(p);}
      }
    }
    return dist;
  }
  aiNavy(f,acts,atWar) {
    const harbors=this.harbors.filter(h=>this.cityByKey[h.cityKey].owner===f);
    const enemies=this.units.filter(u=>this.atWar(f,this.unitFaction(u))&&this.isSeagoing(u));
    const targets=enemies.map(u=>[u.c,u.r]);
    if(!targets.length)for(const h of this.harbors)if(this.atWar(f,this.cityByKey[h.cityKey].owner))targets.push([h.c,h.r]);
    const dist=this.seaDistances(targets),home=this.seaDistances(harbors.map(h=>[h.c,h.r]));
    for(const u of this.units.filter(u=>this.unitFaction(u)===f&&this.isNaval(u))){
      if(atWar&&u.hp>=35)this.aiTryAttack(u,acts);
      if(!this.units.includes(u)||u.attacked)continue;
      const repair=u.hp<60,target=repair?home:dist;
      if(repair&&home.get(key(u.c,u.r))===0)continue;
      const here=target.get(key(u.c,u.r));
      if(here===undefined)continue; // No water path: do not chase across a continent.
      let best=null,score=-here*10;
      for(const k of this.moveRange(u).cost.keys()){
        const d=target.get(k);if(d===undefined)continue;
        const p=k.split(',').map(Number);
        const canHit=!repair&&this.units.some(e=>this.atWar(f,this.unitFaction(e))&&this.canStrikeFrom(u,...p,e));
        const s=-d*10+(canHit?35:0);
        if(s>score){score=s;best=p;}
      }
      if(best&&this.moveUnit(u,...best))acts.push({type:'move',unit:u,to:best});
      if(atWar&&this.units.includes(u))this.aiTryAttack(u,acts);
    }
    let fleetSize=this.units.filter(u=>this.unitFaction(u)===f&&this.isNaval(u)).length;
    const preferred=['dd','sub','cl','bb','cve','ca','cv','bc'];
    // Every free berth may launch, using the full remaining treasury in war or peace.
    for(const h of harbors){
      if(this.unitAt(h.c,h.r))continue;
      const roster=this.navalRoster(this.cityByKey[h.cityKey]),offset=fleetSize%preferred.length;
      for(const cls of [...preferred.slice(offset),...preferred.slice(0,offset)]){
        const o=roster.find(o=>o.eq.cls===cls&&!o.locked&&o.eq.cost<=this.gold[f]);
        if(o&&this.recruitNaval(h.cityKey,o.eqKey,f)){fleetSize++;break;}
      }
    }
  }
  aiAir(f,acts,atWar) {
    const enemies=this.cities.filter(ci=>this.atWar(f,ci.owner));
    const distance=(c,r)=>Math.min(...enemies.map(ci=>hexDist(c,r,ci.x,ci.y)));
    for(const u of this.units.filter(u=>this.isAir(u)&&this.unitFaction(u)===f)){
      if(!this.units.includes(u))continue;
      if(atWar&&this.airRole(u)==='transport'&&!u.attacked&&!u.moved){
        if(!this.cargoOf(u))this.loadParatrooper(u,this.unitAt(u.c,u.r));
        const drop=enemies.find(ci=>!this.paradropError(u,ci.x,ci.y));
        if(drop&&this.paradrop(u,drop.x,drop.y))continue;
      }
      if(atWar&&this.airRole(u)==='strategic'&&this.gold[f]>=AIR.nuclear.cost*2){
        const target=enemies.find(ci=>!this.nuclearError(u,ci.x,ci.y)&&
          this.units.filter(e=>hexDist(ci.x,ci.y,e.c,e.r)<=1&&this.atWar(f,this.unitFaction(e))).length>=4&&
          !this.units.some(e=>hexDist(ci.x,ci.y,e.c,e.r)<=1&&this.unitFaction(e)===f));
        if(target&&this.nuclearStrike(u,target.x,target.y))continue;
      }
      if(atWar&&!u.attacked)this.aiTryAttack(u,acts);
      if(!this.units.includes(u)||u.attacked||u.moved||!enemies.length)continue;
      const choices=[...this.moveRange(u).cost.keys()].map(k=>k.split(',').map(Number)).sort((a,b)=>distance(...a)-distance(...b));
      if(choices[0]&&distance(...choices[0])<distance(u.c,u.r)&&this.moveUnit(u,...choices[0]))acts.push({type:'move',unit:u,to:choices[0]});
    }
    if(!atWar)return;
    for(const ci of this.airfields.filter(ci=>ci.owner===f).sort((a,b)=>distance(a.x,a.y)-distance(b.x,b.y))){
      // AI force composition policy, not a player build/capacity limit.
      if(this.airUnitsAt(ci.k).length||distance(ci.x,ci.y)>12)continue;
      const para=this.unitAt(ci.x,ci.y)?.eq.para;
      const offer=this.airRoster(ci).filter(o=>!o.locked&&(para?o.eq.airRole==='transport':o.eq.airRole!=='transport')&&o.eq.cost<=this.gold[f]*.25).sort((a,b)=>b.eq.atk-a.eq.atk)[0];
      if(offer)this.recruitAir(ci.k,offer.eqKey,f);
    }
  }
  aiTurn(f) {
    const acts = [];
    const units = this.units.filter(u => this.unitFaction(u) === f && !u.carrierId && !this.isNaval(u) && !this.isAir(u));
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
      if(!u.transport&&!CLASSES[u.eq.cls].fly&&!u.moved&&!u.attacked){
        const sea=this.neighbors(u.c,u.r).filter(p=>this.ocean(...p));
        const target=u.hp<35?distHome:dist;
        const here=target.get(key(u.c,u.r));
        if(Number.isFinite(here)&&sea.some(p=>(target.get(key(...p))??Infinity)+5 <= here)){
          const ship=[...ECONOMY.transports].reverse().find(t=>this.canEquipTransport(u,t.id));
          if(ship)this.equipTransport(u,ship.id);
        }
      }
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
    this.aiAir(f,acts,atWar);
    this.aiNavy(f,acts,atWar);
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
      if (this.canCounter(e,u)) {
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
      for (const [nc, nr] of this.transportNeighbors(c, r)) {
        const t = this.tile(nc, nr);
        const transition=this.ocean(c,r)!==this.ocean(nc,nr);
        const nd = d + (transition ? 5 : this.ocean(nc,nr)?hexDist(c,r,nc,nr):(COST[t] || 2)) + (this.riverEdges.has(this.edgeKey([c, r], [nc, nr])) ? 1 : 0);
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
      for (const cls of ['inf', 'art', 'tank',...(this.airfields.includes(ci)?['para']:[])]) {
        (EQUIP[rosterCt][cls] || []).forEach((eq, i) => {
          if (eq.yr <= this.year() && eq.cost <= this.gold[f]) opts.push(`${rosterCt}:${cls}:${i}`);
        });
      }
      if (!opts.length) continue;
      // 地面部队构成偏好：装甲 4 / 炮兵 2.5 / 步兵 2.5；空军由机场逻辑组建。
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
  playerUnits() { return this.units.filter(u => !u.carrierId && this.unitFaction(u) === this.playerFaction); }
  /* 玩家可招募列表（某城市） */
  rosterFor(city) {
    const rosterCt = EQUIP[city.ct] ? city.ct : 'neutral';
    const out = [];
    for (const cls of ['inf', 'art', 'tank']) {
      (EQUIP[rosterCt][cls] || []).forEach((eq, i) => {
        out.push({ eqKey: `${rosterCt}:${cls}:${i}`, eq, locked: eq.yr > this.year() });
      });
    }
    if(this.airfields.includes(city))out.push({eqKey:`${rosterCt}:para:0`,eq:EQUIP[rosterCt].para[0],locked:false});
    // 1942 年后伦敦可招募美军装备
    if (city.ct === 'uk' && this.usaIn) {
      for (const cls of ['inf', 'art', 'tank']) {
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
      facilities:{factories:this.cities.filter(ci=>ci.factory).map(ci=>ci.k),airfields:this.airfields.map(ci=>ci.k),harbors:this.harbors},
      construction:this.construction,
      v: 9, fallout:this.fallout, mapVersion: MAP_META.version, turn: this.turn, nextId: this.nextId,
      terrainRevision:MAP_META.terrainRevision||0,
      usedShipNames:[...this.usedShipNames],
      playerFaction: this.playerFaction, difficulty: this.difficulty,
      gold: this.gold, westBonus: this.westBonus, usaIn: this.usaIn,
      wars: [...this.wars], cf: this.cf,
      cityOwners: this.cities.map(ci => ci.owner),
      stats: this.stats,
      genUnit: this.genUnit, genKills: this.genKills,
      units: this.units.map(u => ({
        id: u.id, ct: u.ct, eqKey: u.eqKey, shipName:u.shipName, hp: u.hp, xp: u.xp, vet: u.vet,
        c: u.c, r: u.r, airbase:u.airbase, carrierId:u.carrierId, moved: u.moved, attacked: u.attacked, dug: u.dug, gen: u.gen, transport:u.transport, embarked:this.isEmbarked(u),
      })),
      log: this.log.slice(-80),
    });
  }
  static deserialize(str) {
    const d = JSON.parse(str);
    if (d.mapVersion !== MAP_META.version) throw new Error('旧地图存档无法用于1939地理新版，请开始新战役。');
    const g = new Game(d.playerFaction, d.difficulty, {initialFleet:false,initialAir:false});
    g.turn = d.turn; g.nextId = d.nextId;
    g.gold = d.gold; g.westBonus = d.westBonus; g.usaIn = d.usaIn;
    g.wars = new Set(d.wars); g.cf = d.cf;
    g.fallout={};
    for(const [k,n]of Object.entries(d.fallout||{})){
      const p=k.split(',').map(Number);
      if(p.length!==2||!p.every(Number.isInteger)||!g.inMap(...p)||!Number.isInteger(n)||n<1||n>AIR.nuclear.duration)throw Error('存档中的核污染数据无效');
      g.fallout[k]=n;
    }
    d.cityOwners.forEach((o, i) => { g.cities[i].owner = o; });
    if(d.facilities){
      const f=d.facilities;
      if(!Array.isArray(f.factories)||!Array.isArray(f.airfields)||!Array.isArray(f.harbors))throw Error('存档中的设施数据无效');
      for(const k of [...f.factories,...f.airfields])if(!g.cityByKey[k])throw Error('存档中的设施城市无效');
      for(const k of f.factories)g.cityByKey[k].factory=true;
      g.airfields=[...new Set(f.airfields)].map(k=>g.cityByKey[k]);
      if(g.airfields.some(ci=>ci.demilitarized))throw Error('非军事区不能设置机场');
      const used=new Set(),cities=new Set();
      g.harbors=f.harbors.map(h=>{
        const ci=g.cityByKey[h.cityKey],k=key(h.c,h.r);
        if(!ci||ci.demilitarized||!Number.isInteger(h.c)||!Number.isInteger(h.r)||!g.ocean(h.c,h.r)||hexDist(ci.x,ci.y,h.c,h.r)!==1||used.has(k)||cities.has(ci.k))throw Error('存档中的港口数据无效');
        used.add(k);cities.add(ci.k);return {cityKey:ci.k,c:h.c,r:h.r};
      });
    }
    g.construction=[];
    for(const p of d.construction||[]){
      const ci=g.cityByKey[p.cityKey],rule=ECONOMY.construction[p.kind];
      if(!ci||!Object.hasOwn(ECONOMY.construction,p.kind)||!Number.isInteger(p.remaining)||p.remaining<1||p.remaining>rule.turns||g.hasFacility(ci,p.kind)||g.construction.some(q=>q.cityKey===ci.k&&q.kind===p.kind)||ci.demilitarized&&p.kind!=='factory')throw Error('存档中的建设数据无效');
      if(p.kind==='harbor'&&(!Number.isInteger(p.c)||!Number.isInteger(p.r)||!g.ocean(p.c,p.r)||hexDist(ci.x,ci.y,p.c,p.r)!==1||g.harborAt(p.c,p.r)||g.construction.some(q=>q.kind==='harbor'&&q.c===p.c&&q.r===p.r)))throw Error('存档中的港址数据无效');
      g.construction.push({cityKey:p.cityKey,kind:p.kind,remaining:p.remaining,...(p.kind==='harbor'?{c:p.c,r:p.r}:{})});
    }
    g.stats = d.stats;
    g.genUnit = d.genUnit; g.genKills = d.genKills;
    const coastCorrections=new Set(['54,27','55,27','47,37','44,57','76,107','78,107','79,107','77,108','79,108']);
    const reservedCells=new Set(d.units.map(u=>key(u.c,u.r))),coastMigrations=[];
    g.units = d.units.map(u => {
      const unit={...u,transport:u.transport||null,embarked:!!u.embarked,eq:g.equipOf(u.eqKey)};
      if(!unit.eq)throw Error('存档中的装备无效');
      if(unit.carrierId){
        if(!unit.eq.para||unit.embarked)throw Error('存档中的空运部队无效');
        return unit;
      }
      if(g.isAir(unit)){
        if(d.v<7){
          const base=g.nearestAirfield(g.unitFaction(unit),unit.c,unit.r);
          if(!base)throw Error('旧存档空军没有己方机场，请使用其它存档');
          unit.airbase=base.k;unit.c=base.x;unit.r=base.y;unit.dug=false;unit.transport=null;unit.embarked=false;
        }
        const base=g.airBase(unit);
        if(!base||unit.c!==base.x||unit.r!==base.y||unit.embarked||unit.transport)throw Error('存档中的空军机场或位置无效');
        unit.dug=false;return unit;
      }
      // Only legacy units on explicitly corrected coastline cells may relocate.
      // Reserve all old and newly assigned cells to prevent migration stacking.
      if((d.terrainRevision||0)<1&&coastCorrections.has(key(unit.c,unit.r))){
        const valid=(c,r)=>g.isSeagoing(unit)?g.ocean(c,r):g.landPassable(c,r);
        if(!valid(unit.c,unit.r)){
          const spots=[];
          for(let r=unit.r-4;r<=unit.r+4;r++)for(let c=unit.c-4;c<=unit.c+4;c++){
            const distance=hexDist(unit.c,unit.r,c,r);
            if(distance<=4&&valid(c,r)&&!reservedCells.has(key(c,r)))spots.push({c,r,distance});
          }
          spots.sort((a,b)=>a.distance-b.distance||a.r-b.r||a.c-b.c);
          if(!spots.length)throw Error('海岸修正后附近没有可用位置，请使用其它存档');
          const p=spots[0];unit.c=p.c;unit.r=p.r;reservedCells.add(key(p.c,p.r));coastMigrations.push(unit);
        }
      }
      if(d.v<5&&CLASSES[unit.eq.cls].fly&&['50,55','77,37'].includes(key(unit.c,unit.r))){
        const p=g.neighbors(unit.c,unit.r).find(p=>g.landPassable(...p)&&!d.units.some(v=>v.c===p[0]&&v.r===p[1]));
        if(!p)throw Error('旧河口空军存档需要先腾出相邻陆格后保存');
        unit.c=p[0];unit.r=p[1];
      }
      // v3/v4 land units on either newly opened estuary receive a basic transport.
      if(d.v<5&&!unit.embarked&&!CLASSES[unit.eq.cls].fly&&['50,55','77,37'].includes(key(unit.c,unit.r))){unit.transport='transport';unit.embarked=true;}
      if(g.isNaval(unit)){
        if(!g.ocean(unit.c,unit.r)||unit.embarked||unit.transport)throw Error('存档中的海军位置或状态无效');
        unit.dug=false;return unit;
      }
      if(unit.transport&&!g.transportOf(unit))throw Error('存档中的运输舰艇类型无效');
      if(unit.embarked&&(!g.isEmbarked(unit)||!g.ocean(unit.c,unit.r)))throw Error('存档中的运输状态无效');
      if(!unit.embarked&&!g.landPassable(unit.c,unit.r))throw Error('存档中存在未登船的海上单位');
      return unit;
    });
    const occupiedCarriers=new Set();
    for(const para of g.units.filter(u=>u.carrierId)){
      const plane=g.units.find(u=>u.id===para.carrierId);
      if(!plane||!g.isAir(plane)||g.airRole(plane)!=='transport'||occupiedCarriers.has(plane.id)||g.unitFaction(plane)!==g.unitFaction(para)||plane.c!==para.c||plane.r!==para.r)throw Error('存档中的伞兵载运关系无效');
      occupiedCarriers.add(plane.id);
    }
    // Reserve all existing names before allocating names to legacy unnamed ships.
    g.usedShipNames=new Set(Array.isArray(d.usedShipNames)?d.usedShipNames.filter(v=>typeof v==='string'):[]);
    const liveNames=new Set();
    for(const u of g.units.filter(u=>g.isNaval(u)&&u.shipName)){
      if(typeof u.shipName!=='string')throw Error('存档中的舰名无效');
      const record=g.shipNamePool(u.ct,u.eqKey).find(e=>e.n===u.shipName);
      const prefix=g.genericShipName(u.eq.cls),suffix=u.shipName.slice(prefix.length);
      if(!record&&!(u.shipName.startsWith(prefix)&&/^[1-9]\d*$/.test(suffix)))throw Error('存档中的舰名无效');
      const nameKey=`${u.ct}:${u.shipName}`,hullKey=record?.identity?`${u.ct}:@${record.identity}`:null;
      if(liveNames.has(nameKey)||(hullKey&&liveNames.has(hullKey)))throw Error('存档中存在重复舰名');
      liveNames.add(nameKey);if(hullKey)liveNames.add(hullKey);
      g.rememberShipName(u.ct,record||{n:u.shipName});
    }
    for(const u of g.units.filter(u=>g.isNaval(u)&&!u.shipName).sort((a,b)=>a.id-b.id)){
      const record=g.nextShipName(u.ct,u.eqKey);u.shipName=record.n;g.rememberShipName(u.ct,record);
    }
    g.log = d.log || [];
    if(d.v<7&&g.units.some(u=>g.isAir(u)))g.pushLog('空军机制升级：原有飞机已转入最近己方机场，兵力、经验与将领保留。','info');
    if(coastMigrations.length)g.pushLog(`地图海岸校正：${coastMigrations.length}支部队已移至最近空闲的同类地形格，兵力与装备保留。`,'info');
    g.terrDirty = true; g.over = null; g.pendingEvents = [];
    g.checkVictory();
    return g;
  }
}

/* 浏览器/Node 双端导出 */
if (typeof module !== 'undefined' && module.exports) module.exports = { Game, hexDist, key, MAP_W, MAP_H };
if (typeof window !== 'undefined') window.Game = Game;
