'use strict';
const assert=require('node:assert/strict'),{Game,key}=require('./js/engine/game'),D=require('./js/data/load-node');
const g=new Game('axis'),ground=g.units.filter(u=>!g.isAir(u)&&!g.isNaval(u));
assert.equal(ground.length,774);assert.equal(g.units.length,1010);assert.deepEqual(g.gold,D.START_GOLD);
assert.equal(new Set(ground.map(u=>key(u.c,u.r))).size,ground.length);
for(const u of ground){assert(g.landPassable(u.c,u.r));assert.equal(g.homeCountryOf(u.c,u.r),u.ct);if(u.eq.infRole||u.eq.artRole||u.eq.armorRole)assert(u.eq.yr<=1939);}
const majors=g.cities.filter(ci=>!ci.demilitarized&&(ci.cap||D.MAP_META.cityLabelLevels[ci.k]<=1));assert.equal(majors.length,93);
for(const ci of majors){const u=g.unitAt(ci.x,ci.y);assert(u&&u.ct===ci.ct&&u.guardCity===ci.k&&u.dug,ci.k+' defended');}
for(const p of g.groundBorderCells()){
 const u=g.unitAt(p.c,p.r);if(p.active)assert(u&&u.ct===p.ct,'active border '+key(p.c,p.r));
 else assert(u&&u.ct===p.ct||g.landNeighbors(p.c,p.r).some(q=>g.unitAt(...q)?.ct===p.ct),'covered border '+key(p.c,p.r));
}
for(const ct of ['de','su','fr','uk','it','pl']){const ci=majors.find(c=>c.ct===ct&&c.cap);assert(g.aaCover(g.unitAt(ci.x,ci.y)).length,'capital AA '+ct);}
for(const d of D.INITIAL_UNITS.filter(u=>u.gen&&g.equipOf(u.eq).cls!=='air'))assert.equal(g.units.filter(u=>u.gen===d.gen&&u.eqKey===d.eq).length,1,'preserve commander '+d.gen);
const restored=Game.deserialize(g.serialize());assert.equal(restored.units.length,g.units.length);assert.equal(restored.units.filter(u=>u.guardCity).length,93);
const old=new Game('axis','normal',{initialGround:false});assert.equal(old.units.filter(u=>!old.isAir(u)&&!old.isNaval(u)).length,127);assert.equal(Game.deserialize(old.serialize()).units.length,old.units.length);
const again=new Game('axis');assert.deepEqual(again.units.map(u=>[u.ct,u.eqKey,u.c,u.r,u.guardCity]),g.units.map(u=>[u.ct,u.eqKey,u.c,u.r,u.guardCity]),'deterministic deployment');
// Existing airborne rules now find occupied capitals, rather than free landing targets.
const plane=g.spawnUnit('de','de:air:'+D.EQUIP.de.air.findIndex(e=>e.airRole==='transport'&&e.tier===0),g.cityByKey.berlin.x,g.cityByKey.berlin.y,{});
const para=g.spawnUnit('de','de:airborne:0',plane.c,plane.r,{});para.carrierId=plane.id;
assert(g.paradropError(plane,g.cityByKey.warsaw.x,g.cityByKey.warsaw.y));g.killUnit(plane);
const capitalGuards=['london','paris','moscow','leningrad'].map(k=>g.unitAt(g.cityByKey[k].x,g.cityByKey[k].y));
g.endTurn();
for(const u of capitalGuards){assert(g.units.includes(u));const ci=g.cityByKey[u.guardCity];assert.equal(u.c,ci.x);assert.equal(u.r,ci.y);assert(u.dug);}
console.log('Ground scenario: 774 troops, 93 defended cities, complete active borders, covered peacetime borders, national positions, reserves, AI guards and saves passed');
// A guarded factory can produce into adjacent friendly land without abandoning the city.
const production=new Game('axis');const berlin=production.cityByKey.berlin,guard=production.unitAt(berlin.x,berlin.y);
const open=production.landNeighbors(berlin.x,berlin.y).find(p=>production.territoryOwner(...p)==='axis');assert(open);
const occupying=production.unitAt(...open);if(occupying)production.killUnit(occupying);production.gold.axis=10000;
const fresh=production.recruitFactory('berlin','de:armor_car:0');assert(fresh);assert.equal(production.unitAt(berlin.x,berlin.y),guard);assert.equal(production.territoryOwner(fresh.c,fresh.r),'axis');assert.notDeepEqual([fresh.c,fresh.r],[berlin.x,berlin.y]);
console.log('Guarded cities can recruit without moving their defending unit');

// Neutral guards remain attackable explicitly by the player, without AI declaring wars automatically.
const diplomacy=new Game('axis');
const neutral=diplomacy.units.find(u=>u.ct==='lu'&&u.guardCity);assert(neutral);
const adj=diplomacy.landNeighbors(neutral.c,neutral.r)[0];assert(adj);
const oldOccupant=diplomacy.unitAt(...adj);if(oldOccupant)diplomacy.killUnit(oldOccupant);
const invader=diplomacy.spawnUnit('de','de:infantry:0',...adj,{});
assert(!diplomacy.targetsOf(invader).includes(neutral));
assert(diplomacy.targetsOf(invader,true).includes(neutral));
assert(diplomacy.attack(invader,neutral));assert.notEqual(diplomacy.cf.lu,'neutral');
console.log('Neutral guards can be attacked by the player and trigger national entry into the war');
