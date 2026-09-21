'use strict';
const assert=require('node:assert/strict');
const {Game}=require('./js/engine/game');
const D=require('./js/data/load-node');
const expected={de:24,su:28,uk:18,fr:14,it:12,es:6,pl:5,ro:4,yu:4,tr:4,se:3,nl:3,be:2,fi:2,hu:2,gr:2,ch:2,bg:2,pt:1,no:1,dk:1,ee:1,lv:1,lt:1,ie:1,sk:1};
for(const faction of ['axis','west','sov']){
 const g=new Game(faction),air=g.units.filter(u=>g.isAir(u));
 assert.equal(air.length,145);assert.equal(D.AIR.initialUnits.length,145);
 assert.deepEqual(Object.fromEntries(Object.keys(expected).map(ct=>[ct,air.filter(u=>u.ct===ct).length])),expected);
 assert.deepEqual(g.gold,D.START_GOLD,'no starting budget charged');
 assert.equal(g.airfields.length,93,'uses existing airports only');
 for(const u of air){
  const base=g.airBase(u);assert(base);assert.equal(base.ct,u.ct,'base belongs to same country, including neutral countries');
  assert.equal(u.c,base.x);assert.equal(u.r,base.y);assert(u.eq.yr<=1939,'no future aircraft');
  assert.equal(u.eq.tier,0);assert(!u.moved&&!u.attacked);assert.equal(u.hp,100);
  assert.equal(u.eqKey.split(':')[0],D.AIR.equipment[u.ct]?u.ct:'neutral');
 }
 assert.equal(g.units.filter(u=>!g.isAir(u)&&!g.isNaval(u)).length,773,'reinforced ground scenario');
 assert.equal(g.units.filter(u=>g.isNaval(u)).length,91,'fleets preserved');
 const commander=air.filter(u=>u.gen==='kesselring');assert.equal(commander.length,1);assert.equal(commander[0].eq.airRole,'cas');assert.equal(g.genUnit.kesselring,commander[0].id);
 const sov=g.units.find(u=>u.ct==='su'&&g.isAir(u));assert.equal(g.targetsOf(sov).length,0,'Soviet neutrality is preserved at start');
 const italian=air.filter(u=>u.ct==='it');assert(italian.every(u=>g.unitFaction(u)==='neutral'&&g.targetsOf(u).length===0));
 const ids=italian.map(u=>u.id);g.turn=D.EVENTS.find(e=>e.kind==='italy').t;g.processEvents();
 assert(italian.every(u=>g.unitFaction(u)==='axis'));assert.deepEqual(g.units.filter(u=>u.ct==='it'&&g.isAir(u)).map(u=>u.id),ids);
 const saved=Game.deserialize(g.serialize());assert.deepEqual(saved.units.filter(u=>saved.isAir(u)).map(u=>[u.id,u.ct,u.eqKey,u.airbase,u.gen]),g.units.filter(u=>g.isAir(u)).map(u=>[u.id,u.ct,u.eqKey,u.airbase,u.gen]));
 // Loading a pre-scenario save, including one with no aircraft, never injects a new air force.
 const old=JSON.parse(g.serialize());old.v=8;old.units=old.units.filter(u=>u.eqKey.split(':')[1]!=='air');old.genUnit.kesselring=null;
 assert.equal(Game.deserialize(JSON.stringify(old)).units.filter(u=>u.eq.cls==='air').length,0);
}
const bare=new Game('axis','normal',{initialAir:false});assert(!bare.units.some(u=>bare.isAir(u)));assert.equal(bare.units.filter(u=>bare.isNaval(u)).length,91);
console.log('Initial air forces: 145 formations / 26 nations, national bases, 1939 models, generals, neutrality, entry events and no save duplication passed.');
