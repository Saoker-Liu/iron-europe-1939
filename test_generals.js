'use strict';
const assert=require('node:assert/strict'),D=require('./js/data/load-node'),{Game}=require('./js/engine/game');
const added=['rundstedt','katukov','govorov','bradley','leclerc','tedder','bor'];
assert.equal(D.GENERALS.length,23);assert.equal(new Set(D.GENERALS.map(g=>g.id)).size,23);
const g=new Game('west');const save=JSON.parse(g.serialize());
for(const id of added){delete save.genUnit[id];delete save.genKills[id];}
const loaded=Game.deserialize(JSON.stringify(save));
for(const id of added)assert.equal(loaded.genUnit[id],null,'new commander available in old save');
assert(loaded.assignGeneral('tedder',loaded.units.find(u=>u.ct==='uk'&&loaded.isAir(u))));
assert.equal(Game.deserialize(loaded.serialize()).units.find(u=>u.gen==='tedder').gen,'tedder');
g.units=[];const ci=g.cityByKey.london,[c,r]=g.landNeighbors(ci.x,ci.y)[0];
const ally=g.spawnUnit('uk','uk:infantry:0',c,r,{});
const plain=g.effAtk(ally);
g.spawnUnit('uk','uk:infantry:0',ci.x,ci.y,{}); // Airport ground occupant must not mask the aircraft commander.
const airKey=g.airRoster(ci).find(o=>o.eq.airRole==='fighter').eqKey;
const tedder=g.spawnUnit('uk',airKey,ci.x,ci.y,{});tedder.gen='tedder';
assert(Math.abs(g.effAtk(ally)/plain-1.1)<1e-9);
const second=g.spawnUnit('uk',airKey,ci.x,ci.y,{});second.gen='eisenhower';
assert(Math.abs(g.effAtk(ally)/plain-1.1)<1e-9,'auras do not stack');
second.ct='de';tedder.carrierId=1;assert.equal(g.effAtk(ally),plain,'enemy and carried commanders give no aura');
tedder.carrierId=null;tedder.gen='balbo';assert.equal(g.airRadius(tedder),tedder.eq.mov+1);
ally.gen='bradley';assert.equal(g.movOf(ally),ally.eq.mov+1);
const target=g.spawnUnit('de','de:infantry:0',ci.x,ci.y,{});
ally.gen=null;const base=g.effAtk(ally,target);ally.gen='konev';assert(Math.abs(g.effAtk(ally,target)/base-1.25)<1e-9);
console.log('Generals: 23 unique commanders, legacy save availability, assignments, airbase aura/no stacking, flight radius and targeted attack passed');
