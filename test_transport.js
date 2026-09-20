'use strict';
const assert=require('node:assert/strict');
const D=require('./js/data/load-node');
const {Game,key,hexDist}=require('./js/engine/game');
const g=new Game('axis');g.units=[];g.gold.axis=500;
const port=g.cityByKey.dover, shore=[port.x,port.y];
const sea=g.neighbors(...shore).find(p=>g.ocean(...p));
const u=g.spawnUnit('de','de:tank:0',...shore,{});
assert.equal(D.MAP_META.routes,undefined,'fixed transport routes removed from map data');
assert.equal(g.ferryDestinations,undefined,'no teleporting ferry API');
assert(!g.moveUnit(u,...sea, [sea]),'caller cannot bypass embark purchase with a custom path');
g.gold.axis=24;assert(!g.equipTransport(u,'transport'));assert.equal(g.gold.axis,24);
g.gold.axis=500;assert(!g.equipTransport(u,'amphibious'),'technology locked in 1939');
assert(g.equipTransport(u,'transport'));assert.equal(g.gold.axis,475);
assert(!g.equipTransport(u,'transport'),'no repeated charge');
assert(!g.moveRange(u).cost.has(key(g.cityByKey.calais.x,g.cityByKey.calais.y)),'cannot teleport across Channel');
assert(g.moveUnit(u,...sea));assert(u.embarked&&u.moved&&u.attacked);
assert(!g.moveUnit(u,...shore),'cannot disembark in the embarkation turn');
assert.equal(g.moveRange(u).cost.size,0);
assert(!g.equipTransport(u,'assault'),'no upgrade at sea');
g.startTurnFor('axis');
u.gen='guderian';g.genUnit.guderian=u.id;u.vet=3;u.dug=true;
assert.equal(g.movOf(u),5,'ship speed ignores original tank and general mobility');
assert.equal(g.effDef(u),6,'ship defense replaces tank, veteran, general and dug-in defense');
u.dug=false;u.gen=null;u.vet=0;
const onSeaAttack=g.effAtk(u);u.embarked=false;const onLandAttack=g.effAtk(u);u.embarked=true;
assert(Math.abs(onSeaAttack/onLandAttack-.2)<1e-10);
const seaStep=g.neighbors(...sea).find(p=>g.ocean(...p));
g.riverEdges.add(g.edgeKey(sea,seaStep));
assert.equal(g.moveRange(u).cost.get(key(...seaStep)),1,'river overlay never adds sailing cost');
const range=g.moveRange(u);
for(const [k,cost]of range.cost){
 const p=k.split(',').map(Number);
 assert(cost<=5);
 if(!g.ocean(...p))assert.equal(hexDist(u.c,u.r,...p),1,'landing only adjacent to start of turn');
 assert(g.tile(...p)!=='l','lakes are not ocean transport');
}
const voyage=[...range.cost].find(([k,c])=>c>=2&&g.ocean(...k.split(',').map(Number)));
assert(voyage,'multi-cell ocean movement available');
const gold=g.gold.axis;assert(g.moveUnit(u,...voyage[0].split(',').map(Number)));
assert(u.moved&&!u.attacked,'sailing may be followed by an attack');assert.equal(g.gold.axis,gold,'no per-voyage fee');
const saved=Game.deserialize(g.serialize()),loaded=saved.units.find(v=>v.id===u.id);
assert(loaded.embarked&&loaded.transport==='transport');assert.equal(saved.movOf(loaded),5);
// Reset only for independent combat/landing scenarios, with real coast coordinates.
[u.c,u.r]=sea;u.moved=u.attacked=false;
const enemy=g.spawnUnit('uk','uk:inf:0',...shore,{});
assert(g.targetsOf(u).includes(enemy),'transport can assault adjacent occupied shore');
assert(!g.moveRange(u).cost.has(key(...shore)),'occupied beach blocks landing');
const rec=g.attack(u,enemy);assert(rec&&rec.dmg>0&&rec.counter>0,'shore defense can counterattack transports');
assert(!g.attack(u,enemy),'cannot attack twice');
g.killUnit(enemy);g.startTurnFor('axis');u.hp=60;
g.startTurnFor('axis');assert.equal(u.hp,60,'no automatic healing at sea');
assert(g.moveUnit(u,...shore));assert(!u.embarked&&u.transport==='transport');
assert(u.moved&&u.attacked,'landing consumes both actions');
assert.equal(g.movOf(u),u.eq.mov,'land equipment restored');
assert.equal(g.effDef(u),u.eq.def);
g.startTurnFor('axis');g.turn=28; // January 1942
const beforeUpgrade=g.gold.axis;assert(g.equipTransport(u,'amphibious'));
assert.equal(g.gold.axis,beforeUpgrade-30,'upgrade pays only the difference');
assert(!g.equipTransport(u,'transport'),'cannot downgrade for a refund');
g.turn=52;assert(g.equipTransport(u,'assault'));
assert(g.moveUnit(u,...sea));assert.equal(g.effDef(u),18);
u.eq=g.equipOf('de:art:0');u.eqKey='de:art:0';u.gen='guderian';
assert.equal(g.rangeOf(u),1,'transported artillery cannot use land artillery range');
u.gen=null;
const advancedAttack=g.effAtk(u);u.transport='transport';assert(advancedAttack>g.effAtk(u));u.transport='assault';
const invalid=JSON.parse(g.serialize());invalid.units[0].transport='unknown';
assert.throws(()=>Game.deserialize(JSON.stringify(invalid)),/运输舰艇类型/);
// Existing v3 saves have no naval fields and migrate as ordinary land units.
g.startTurnFor('axis');assert(g.moveUnit(u,...shore));
const old=JSON.parse(g.serialize());old.v=3;old.units.forEach(v=>{delete v.transport;delete v.embarked;});
assert(Game.deserialize(JSON.stringify(old)).units.every(v=>!v.embarked&&!v.transport));
const air=g.spawnUnit('de','de:air:0',...g.landNeighbors(...shore)[0],{});
assert(!g.equipTransport(air,'transport'),'aircraft cannot buy ships');
// AI must buy, embark, sail and land; no pre-equipped test-only shortcut.
const ai=new Game('axis');ai.units=[];ai.gold.west=200;ai.aiRecruit=()=>{};
ai.cities.forEach(c=>c.owner='neutral');ai.cityByKey.dover.owner='west';ai.cityByKey.calais.owner='axis';
const landing=ai.cityByKey.calais, troop=ai.spawnUnit('uk','uk:inf:0',...shore,{});
let sailed=false;
for(let i=0;i<20&&ai.cityByKey.calais.owner!=='west';i++){
 ai.startTurnFor('west');ai.aiTurn('west');sailed ||= troop.embarked;
}
assert(sailed,'AI actually embarks');
assert.equal(ai.cityByKey.calais.owner,'west','AI crosses sea and captures beachhead');
assert(!troop.embarked&&troop.c===landing.x&&troop.r===landing.y);
console.log('Transport: purchase, unlocks, shore transitions, ocean movement, combat penalties, saves and AI landing passed.');
