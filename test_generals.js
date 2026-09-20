'use strict';
const assert=require('node:assert/strict'),D=require('./js/data/load-node'),{Game}=require('./js/engine/game');
const added=D.GENERALS.map(g=>g.id).filter(id=>!D.INITIAL_UNITS.some(u=>u.gen===id));
assert.equal(D.GENERALS.length,116);assert.equal(new Set(D.GENERALS.map(g=>g.id)).size,116);
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
console.log('Generals: 116 unique commanders, legacy save availability, assignments, airbase aura/no stacking, flight radius and targeted attack passed');

const validSkills=new Set(['atk','def','mov','nozoc','rng','counter','citydef','vs','aura','rage']);
assert.equal(new Set(D.GENERALS.map(g=>g.en)).size,116);
for(const general of D.GENERALS){
 assert(D.COUNTRIES[general.ct],general.id+' country');
 assert(general.skills.length>=1&&general.skills.length<=3);
 assert(general.en&&general.career&&general.design&&general.reference.startsWith('https://'));
 for(const skill of general.skills){
  assert(validSkills.has(skill.k));if(skill.cls)assert(['inf','art','tank','air'].includes(skill.cls));
  if(skill.k==='vs')assert(['inf','art','tank','air'].includes(skill.tgt));
  if(['mov','rng'].includes(skill.k))assert(Number.isInteger(skill.n)&&skill.n>=1&&skill.n<=2);
  else if(!['nozoc','rage'].includes(skill.k))assert(skill.m>0&&skill.m<=.5);
 }
 // Every roster entry can be assigned and survives save/load, including countries that join later.
 const trial=new Game('axis','normal',{initialGround:false});trial.cf[general.ct]='axis';for(const ci of trial.cities)if(ci.ct===general.ct)ci.owner='axis';
 for(const u of trial.units)if(u.gen===general.id)u.gen=null;
 trial.genUnit[general.id]=null;
 const unit=trial.units.find(u=>u.ct==='de'&&!trial.isAir(u)&&!trial.isNaval(u));
 assert(trial.assignGeneral(general.id,unit),general.id+' assign');
 assert.equal(Game.deserialize(trial.serialize()).units.find(u=>u.id===unit.id).gen,general.id);
}
console.log('All 116 identities, skill schemas, country codes, assignment and save roundtrips passed');
