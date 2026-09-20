/* 无头逻辑测试：node test_logic.js
 * 1) 地图/城市数据一致性校验
 * 2) 三种玩家阵营 × 80 回合 AI 模拟，断言不变量
 */
'use strict';
const D = require('./js/data/load-node.js');
const { Game, hexDist, key, MAP_W, MAP_H } = require('./js/engine/game.js');

let fails = 0;
function assert(cond, msg) {
  if (!cond) { console.error('  [FAIL] ' + msg); fails++; }
}

/* ---------- 1. 数据校验 ---------- */
console.log('== 数据校验 ==');
D.MAP_ROWS.forEach((row, i) => {
  assert(row.length === MAP_W, `地图第 ${i} 行长度 ${row.length} != ${MAP_W}: "${row}"`);
});
for (const ci of D.CITIES) {
  const t = D.MAP_ROWS[ci.y][ci.x];
  assert(t && D.TERRAIN[t].pass, `城市 ${ci.n} (${ci.x},${ci.y}) 落在海洋上(=${t})`);
}
const cityPos = new Set(D.CITIES.map(ci => key(ci.x, ci.y)));
assert(cityPos.size === D.CITIES.length, '存在重叠城市');
for (const u of D.INITIAL_UNITS) {
  const t = D.MAP_ROWS[u.y] && D.MAP_ROWS[u.y][u.x];
  assert(t && D.TERRAIN[t].pass, `初始单位 ${u.ct} ${u.eq} (${u.x},${u.y}) 站在海上/越界 (=${t})`);
}
const posCount = {};
for (const u of D.INITIAL_UNITS) { const k = key(u.x, u.y); posCount[k] = (posCount[k] || 0) + 1; }
for (const k in posCount) assert(posCount[k] === 1, `初始单位叠格: ${k} 有 ${posCount[k]} 个`);
console.log(`  城市 ${D.CITIES.length} 座，初始单位 ${D.INITIAL_UNITS.length} 个`);

/* 地理连通性：允许运输船经过海洋；不再要求岛屿与大陆有陆桥。 */
{
  const g = new Game('axis', 'normal');
  const berlin = D.CITIES.find(ci => ci.k === 'berlin');
  const seen = new Set([key(berlin.x, berlin.y)]);
  const q = [[berlin.x, berlin.y]];
  while (q.length) {
    const [c, r] = q.shift();
    for (const [nc, nr] of g.transportNeighbors(c, r)) {
      const t = g.tile(nc, nr);
      if (!seen.has(key(nc, nr))) { seen.add(key(nc, nr)); q.push([nc, nr]); }
    }
  }
  for (const ci of D.CITIES) {
    assert(seen.has(key(ci.x, ci.y)), `城市 ${ci.n} 与大陆不连通`);
  }
  console.log('  大陆连通性 OK，可达格 ' + seen.size);
}

/* ---------- 2. 战斗/移动 单元测试 ---------- */
console.log('== 机制测试 ==');
{
  const g = new Game('axis', 'normal', {initialGround:false});
  const tank = g.units.find(u => u.gen === 'guderian');
  const rng = g.moveRange(tank);
  assert(rng.cost.size > 5, `古德里安移动力异常，可达 ${rng.cost.size} 格`);
  assert(g.movOf(tank) === 7, `古德里安(III号5+2)移动力应为7，实际 ${g.movOf(tank)}`);
  // 德波步兵互殴
  const deInf = g.units.find(u => u.ct === 'de' && u.eq.cls === 'inf');
  const plInf = g.units.find(u => u.ct === 'pl');
  const city = g.cityByKey.berlin;
  deInf.c = city.x; deInf.r = city.y;
  [plInf.c, plInf.r] = g.landNeighbors(city.x, city.y)[0];
  const before = plInf.hp;
  g.attack(deInf, plInf);
  assert(plInf.hp < before, '攻击未造成伤害');
  assert(deInf.attacked === true, '攻击后应标记 acted');
  // 招募
  const berlin = g.cityByKey.berlin;
  g.units = g.units.filter(u => u !== deInf);
  const gold0 = g.gold.axis;
  const u2 = g.recruit('berlin', 'de:infantry:0');
  assert(u2 && g.gold.axis === gold0 - 60, '柏林招募步兵应花费60金');
  assert(u2.attacked === true && u2.moved === true, '新兵当回合不可行动');
  assert(g.recruit('berlin', 'de:tank:2') === null, '城市被占/年份未到应招募失败');
  // 存档往返
  const snap = g.serialize();
  const g2 = Game.deserialize(snap);
  assert(g2.units.length === g.units.length, '存档往返单位数不一致');
  assert(g2.gold.axis === g.gold.axis, '存档往返金币不一致');
  assert(g2.atWar('axis', 'west'), '存档往返宣战状态丢失');
}
console.log('  机制测试完成');

/* ---------- 3. 80 回合模拟 ---------- */
console.log('== 80 回合模拟 ==');
for (const pf of ['axis', 'west', 'sov']) {
  for (const diff of ['normal']) {
    const g = new Game(pf, diff);
    try {
      for (let t = 0; t < 80; t++) {
        const { actions } = g.endTurn();
        // 不变量
        for (const u of g.units) {
          const tk = g.tile(u.c, u.r);
          assert(tk && (g.isNaval(u) ? tk === '~' && !u.embarked && !u.transport : u.embarked ? tk === '~' && !!g.transportOf(u) && u.eq.cls!=='air' : D.TERRAIN[tk].pass), `[${pf}] 单位 ${u.eq.n} 站在海上 (${u.c},${u.r}) 回合${g.turn}`);
        }
        const unitsAt = {};
        const navalNames = new Set();
        for(const u of g.units.filter(u=>g.isNaval(u))){
          const nameKey=u.ct+':'+u.shipName;
          assert(typeof u.shipName==='string'&&u.shipName.length>0,`[${pf}] 海军缺少舰名`);
          assert(!navalNames.has(nameKey),`[${pf}] 舰名重复 ${nameKey}`);
          assert(g.usedShipNames.has(nameKey),`[${pf}] 舰名未登记 ${nameKey}`);
          navalNames.add(nameKey);
        }
        for(const u of g.units.filter(u=>g.isAir(u))){const base=g.airBase(u);assert(base&&u.c===base.x&&u.r===base.y,`[${pf}] 空军失去机场 ${u.id}`);}
        for (const u of g.units.filter(u=>!g.isAir(u)&&!u.carrierId)) { const k = key(u.c, u.r); unitsAt[k] = (unitsAt[k] || 0) + 1; }
        for (const k in unitsAt) assert(unitsAt[k] === 1, `[${pf}] 单位叠格 ${k} 回合${g.turn}`);
        for (const f of ['axis', 'west', 'sov']) assert(g.gold[f] >= 0, `[${pf}] ${f} 金币为负 回合${g.turn}`);
        if (g.over) break;
      }
      const caps = {};
      for (const ci of g.cities) caps[ci.owner] = (caps[ci.owner] || 0) + 1;
      console.log(`  [${pf}/${diff}] T${g.turn} ${g.dateLabel()} over=${g.over || '-'} 城市分布=${JSON.stringify(caps)} 单位=${g.units.length} 击杀=${JSON.stringify(g.stats.kills)}`);
    } catch (e) {
      console.error(`  [FAIL] ${pf} 模拟崩溃 回合${g.turn}:`, e);
      fails++;
    }
  }
}

console.log(fails === 0 ? '\n全部通过 ✔' : `\n${fails} 项失败 ✘`);
process.exit(fails === 0 ? 0 : 1);
