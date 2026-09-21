'use strict';
const assert=require('node:assert/strict'),{Game,key}=require('./js/engine/game'),D=require('./js/data/load-node');
const g=new Game('axis'),ground=g.units.filter(u=>!g.isAir(u)&&!g.isNaval(u));
assert.equal(ground.length,773);assert.equal(g.units.length,1009);assert.deepEqual(g.gold,D.START_GOLD);
assert.equal(new Set(ground.map(u=>key(u.c,u.r))).size,ground.length);
for(const u of ground){assert(g.landPassable(u.c,u.r));assert.equal(g.homeCountryOf(u.c,u.r),u.ct);if(u.eq.infRole||u.eq.artRole||u.eq.armorRole)assert(u.eq.yr<=1939);}
const majors=g.cities.filter(ci=>!ci.demilitarized&&(ci.cap||D.MAP_META.cityLabelLevels[ci.k]<=1));assert.equal(majors.length,93);
for(const ci of majors){const u=g.unitAt(ci.x,ci.y);assert(u&&u.ct===ci.ct&&u.dug,ci.k+' defended');}
for(const p of g.groundBorderCells()){
 const u=g.unitAt(p.c,p.r);if(p.active)assert(u&&u.ct===p.ct,'active border '+key(p.c,p.r));
 else assert(u&&u.ct===p.ct||g.landNeighbors(p.c,p.r).some(q=>g.unitAt(...q)?.ct===p.ct),'covered border '+key(p.c,p.r));
}
for(const ct of ['de','su','fr','uk','it','pl']){const ci=majors.find(c=>c.ct===ct&&c.cap);assert(g.aaCover(g.unitAt(ci.x,ci.y)).length,'capital AA '+ct);}
for(const d of D.INITIAL_UNITS.filter(u=>u.gen&&g.equipOf(u.eq).cls!=='air'))assert.equal(g.units.filter(u=>u.gen===d.gen&&u.eqKey===d.eq).length,1,'preserve commander '+d.gen);
const restored=Game.deserialize(g.serialize());assert.equal(restored.units.length,g.units.length);assert(!restored.units.some(u=>u.guardCity));
const old=new Game('axis','normal',{initialGround:false});assert.equal(old.units.filter(u=>!old.isAir(u)&&!old.isNaval(u)).length,127);assert.equal(Game.deserialize(old.serialize()).units.length,old.units.length);
const again=new Game('axis');assert.deepEqual(again.units.map(u=>[u.ct,u.eqKey,u.c,u.r,u.guardCity]),g.units.map(u=>[u.ct,u.eqKey,u.c,u.r,u.guardCity]),'deterministic deployment');
// Existing airborne rules now find occupied capitals, rather than free landing targets.
const plane=g.spawnUnit('de','de:air:'+D.EQUIP.de.air.findIndex(e=>e.airRole==='transport'&&e.tier===0),g.cityByKey.berlin.x,g.cityByKey.berlin.y,{});
const para=g.spawnUnit('de','de:airborne:0',plane.c,plane.r,{});para.carrierId=plane.id;
assert(g.paradropError(plane,g.cityByKey.warsaw.x,g.cityByKey.warsaw.y));g.killUnit(plane);
// Occupied cities block all ground production, even if adjacent friendly cells are empty.
const production=new Game('axis');const berlin=production.cityByKey.berlin,guard=production.unitAt(berlin.x,berlin.y);
const open=production.landNeighbors(berlin.x,berlin.y).find(p=>production.territoryOwner(...p)==='axis');assert(open);
const occupying=production.unitAt(...open);if(occupying)production.killUnit(occupying);production.gold.axis=10000;
const before=production.gold.axis;
for(const legacy of [false,true]){
 if(legacy)guard.guardCity='berlin';
 assert.equal(production.recruit('berlin','de:infantry:0'),null);
 assert.equal(production.recruitFactory('berlin','de:armor_car:0'),null);
 assert.equal(production.gold.axis,before);
}
const migrated=Game.deserialize(production.serialize());assert(!migrated.units.some(u=>u.guardCity));
const legacySave=JSON.parse(production.serialize());legacySave.units.find(u=>u.id===guard.id).guardCity='berlin';
assert(!Game.deserialize(JSON.stringify(legacySave)).units.some(u=>u.guardCity));
production.killUnit(guard);
for(const factory of [false,true]){
 const fresh=factory?production.recruitFactory('berlin','de:armor_car:0'):production.recruit('berlin','de:infantry:0');
 assert(fresh);assert.deepEqual([fresh.c,fresh.r],[berlin.x,berlin.y]);assert(fresh.moved&&fresh.attacked);
 assert.equal(production.moveRange(fresh).cost.size,0);assert(!production.canAttackNow(fresh));production.killUnit(fresh);
}
console.log('Ground scenario: 773 troops, 93 defended cities, border coverage, city-only recruitment, new-unit turn restrictions and retired guard save migration passed');

// Neutral guards remain attackable explicitly by the player, without AI declaring wars automatically.
const diplomacy=new Game('axis');
const neutral=diplomacy.units.find(u=>u.ct==='lu');assert(neutral);
const adj=diplomacy.landNeighbors(neutral.c,neutral.r)[0];assert(adj);
const oldOccupant=diplomacy.unitAt(...adj);if(oldOccupant)diplomacy.killUnit(oldOccupant);
const invader=diplomacy.spawnUnit('de','de:infantry:0',...adj,{});
assert(!diplomacy.targetsOf(invader).includes(neutral));
assert(diplomacy.targetsOf(invader,true).includes(neutral));
assert(diplomacy.attack(invader,neutral));assert.notEqual(diplomacy.cf.lu,'neutral');
console.log('Neutral guards can be attacked by the player and trigger national entry into the war');
