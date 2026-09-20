'use strict';
const assert=require('node:assert/strict');
const D=require('./js/data/load-node');
const {Game,key}=require('./js/engine/game');
const g=new Game('axis', 'normal', {initialFleet:false});g.units=[];
const sea=[10,10];
const names=[];
for(let i=0;i<4;i++)names.push(g.spawnUnit('de','de:bb:1',10+i,1,{}).shipName);
assert.deepEqual(names,['俾斯麦号','提尔皮茨号','战列舰1','战列舰2']);
assert.equal(g.navalIdentity(g.units[1]),'德国 · 战列舰 · 俾斯麦级 · 提尔皮茨号');
assert.equal(D.EQUIP.uk.cv[0].className,'皇家方舟级','single-ship designs still expose a distinct class name');
const bismarck=g.units[0];g.killUnit(bismarck);
assert.equal(g.nextShipName('de','de:bb:1').n,'战列舰3','sunk names are not reused');
assert.equal(g.nextShipName('de','de:bb:1').n,'战列舰3','preview does not reserve names');
const h1=g.spawnUnit('de','de:bb:2',14,1,{}),h2=g.spawnUnit('de','de:bb:2',15,1,{});
assert.equal(h1.shipName,'兴登堡号');assert.equal(h2.shipName,'腓特烈大帝号');
assert.equal(g.shipNameInfo(h1).kind,'proposed','unconfirmed H-class names must not masquerade as historical names');
for(let i=0;i<5;i++)g.spawnUnit('de','de:ca:0',20+i,1,{});
assert.equal(g.nextShipName('de','de:cve:0').kind,'generic','same hull cannot appear as both Seydlitz and Weser');
const minor1=g.spawnUnit('se','neutral:bb:0',25,1,{}),minor2=g.spawnUnit('se','neutral:bb:2',26,1,{});
assert.equal(minor1.shipName,'战列舰1');assert.equal(minor2.shipName,'战列舰2','generic numbering continues across class upgrades');
assert.equal(g.spawnUnit('no','neutral:bb:0',27,1,{}).shipName,'战列舰1','numbering is national');
g.gold.axis=0;assert.equal(g.recruitNaval('kiel','de:dd:0'),null);
assert.equal(g.nextShipName('de','de:dd:0').n,'Z1莱伯雷希特·马斯号','failed build consumes no name');
g.gold.axis=1000;const built=g.recruitNaval('kiel','de:dd:0');assert.equal(built.shipName,'Z1莱伯雷希特·马斯号');
const roundTrip=Game.deserialize(g.serialize());
assert.deepEqual(roundTrip.units.map(u=>u.shipName),g.units.map(u=>u.shipName));
assert.equal(roundTrip.nextShipName('de','de:bb:1').n,'战列舰3','sunk name ledger survives load');
const old=JSON.parse(g.serialize());old.v=5;delete old.usedShipNames;old.units.forEach(u=>delete u.shipName);
const migrated=Game.deserialize(JSON.stringify(old));
assert.equal(migrated.units.length,g.units.length,'loading old saves never adds initial fleets');
assert(migrated.units.every(u=>typeof u.shipName==='string'));
assert.equal(new Set(migrated.units.map(u=>u.ct+':'+u.shipName)).size,migrated.units.length);
const bad=JSON.parse(g.serialize());bad.units[1].shipName=bad.units[0].shipName;
assert.throws(()=>Game.deserialize(JSON.stringify(bad)),/重复舰名/);
bad.units[1].shipName='<img src=x onerror=alert(1)>';
assert.throws(()=>Game.deserialize(JSON.stringify(bad)),/舰名无效/);
// Initial fleets: real sea positions, no stacking, no port blocking or future classes.
const start=new Game('axis'),navy=start.units.filter(u=>start.isNaval(u));
const counts=Object.fromEntries(Object.keys(D.COUNTRIES).map(ct=>[ct,navy.filter(u=>u.ct===ct).length]).filter(x=>x[1]));
assert.deepEqual(Object.fromEntries(['uk','us','fr','it','de','su'].map(ct=>[ct,counts[ct]])),{uk:20,us:16,fr:12,it:10,de:9,su:7});
assert.equal(navy.length,91);assert.equal(start.units.length,D.INITIAL_UNITS.filter(u=>start.equipOf(u.eq).cls!=='air').length+91+D.AIR.initialUnits.length);
const surface=start.units.filter(u=>!start.isAir(u));
assert.equal(new Set(surface.map(u=>key(u.c,u.r))).size,surface.length);
assert.equal(new Set(navy.map(u=>u.ct+':'+u.shipName)).size,navy.length);
for(const u of navy){
 assert(start.ocean(u.c,u.r));assert(!start.harborAt(u.c,u.r));assert(!u.embarked&&!u.transport);
 assert(u.eq.yr<=1939&&!u.eq.planned,'no unbuilt or future models in opening fleet');
 assert.equal(start.shipNameInfo(u).kind,['uk','us','fr','it','de','su'].includes(u.ct)?'historical':'generic');
}
assert.deepEqual(start.gold,D.START_GOLD,'starting fleets do not charge production funds');
const strength=ct=>navy.filter(u=>u.ct===ct).reduce((n,u)=>n+u.eq.cost,0);
assert(strength('uk')>strength('us'));assert(strength('us')>strength('fr'));assert(strength('fr')>strength('it'));
assert(strength('it')>strength('de'));assert(strength('de')>strength('su'));
assert.equal(start.cf.us,'neutral');
const american=navy.filter(u=>u.ct==='us'),ids=american.map(u=>u.id);
assert(american.every(u=>start.targetsOf(u).length===0));
start.turn=D.EVENTS.find(e=>e.kind==='usa').t;start.processEvents();
assert.equal(start.cf.us,'west');assert(american.every(u=>start.unitFaction(u)==='west'));
assert.deepEqual(start.units.filter(u=>u.ct==='us'&&start.isNaval(u)).map(u=>u.id),ids,'entry activates existing fleet, not duplicate spawns');
const reload=Game.deserialize(start.serialize());assert.equal(reload.units.filter(u=>reload.isNaval(u)).length,91);
assert.equal(reload.cf.us,'west');
// Every historical model has an explicit pool (possibly empty for unnamed designs).
for(const [ct,roster]of Object.entries(D.NAVAL.equipment))if(ct!=='neutral'){
 for(const [cls,list]of Object.entries(roster))list.forEach((_,i)=>{
  const pool=D.NAVAL.names[`${ct}:${cls}:${i}`];assert(Array.isArray(pool));
  assert.equal(new Set(pool.map(e=>e.n)).size,pool.length);
  for(const entry of pool)assert(['historical','planned','proposed'].includes(entry.kind));
 });
}
console.log('Naval names: national/class pools, fallback numbering, sunk-name history, previews, UI-safe legacy migration and 91-ship starting scenario passed.');
