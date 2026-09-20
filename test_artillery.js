'use strict';
const assert=require('node:assert/strict'),{Game}=require('./js/engine/game'),D=require('./js/data/load-node');
const fresh=()=>{const g=new Game('axis','normal',{initialAir:false,initialFleet:false,initialFactories:false});g.units=[];g.gold.axis=10000;g.wars.add('axis|sov');return g;};
let g=fresh();const b=g.cityByKey.berlin;const make=(role,ct='de',x=b.x,y=b.y)=>g.spawnUnit(ct,ct+':gun_'+role+':0',x,y,{});
const gun=make('gun'),at=make('at'),aa=make('aa'),field=make('field'),rocket=make('rocket');
const tank=g.spawnUnit('uk','uk:tank:0',b.x+1,b.y,{}),inf=g.spawnUnit('uk','uk:infantry:0',b.x+1,b.y,{});
assert(g.effAtk(gun,inf)>g.effAtk(gun,tank));assert(g.effAtk(at,tank)>g.effAtk(at,inf));assert(g.effAtk(aa,tank)>g.effAtk({...aa,eq:D.EQUIP.neutral.gun_aa[0]},tank));assert.equal(g.rangeOf(field),g.rangeOf(gun)+1);
const ukAT={...at,eq:D.EQUIP.uk.gun_at[0]},genericAT={...at,eq:D.EQUIP.neutral.gun_at[0]};assert(g.effAtk(ukAT,tank)>g.effAtk(genericAT,tank));assert(g.effAtk(ukAT,inf)<g.effAtk(genericAT,inf));
g.terr[(b.x+1)+','+b.y]='m';assert(g.terrainCost({...gun,eq:D.EQUIP.it.gun_gun[0]},b.x+1,b.y)<g.terrainCost(gun,b.x+1,b.y));
// Cover mitigates hits even when the attacking aircraft's home base is distant.
g=fresh();const base=g.cityByKey.berlin,plane=g.spawnUnit('de','de:air:0',base.x,base.y,{}),victim=g.spawnUnit('uk','uk:infantry:0',base.x+2,base.y,{});
const unprotected=g.computeDamage(plane,victim,{preview:true});const battery=g.spawnUnit('uk','uk:gun_aa:0',victim.c+1,victim.r,{});
assert(g.computeDamage(plane,victim,{preview:true})<=Math.ceil(unprotected*.5));const planeHP=plane.hp;const result=g.attack(plane,victim);assert(result.aa&&plane.hp<planeHP-20);
plane.attacked=false;plane.moved=false;const protectedHit=g.computeDamage(plane,victim,{preview:true});const more=g.spawnUnit('uk','uk:gun_aa:0',victim.c,victim.r+1,{});assert.equal(g.computeDamage(plane,victim,{preview:true}),protectedHit);
battery.embarked=true;battery.transport='transport';more.embarked=true;more.transport='transport';assert.equal(g.aaCover(victim).length,0);
// Direct AA target fires once, even when destroyed by the incoming hit.
g=fresh();const bomber=g.spawnUnit('de','de:air:0',base.x,base.y,{}),targetAA=g.spawnUnit('uk','uk:gun_aa:0',base.x+1,base.y,{});targetAA.hp=1;const direct=g.attack(bomber,targetAA);assert(direct.killed&&direct.aa);assert.equal(direct.counter,direct.aa.dmg);
// Rocket splash is directional, hits multiple enemies, and excludes friends and air units.
g=fresh();const launcher=g.spawnUnit('de','de:gun_rocket:0',base.x,base.y,{}),target=g.spawnUnit('uk','uk:infantry:0',base.x+2,base.y,{}),rear=g.spawnUnit('uk','uk:infantry:0',base.x+3,base.y,{}),front=g.spawnUnit('uk','uk:infantry:0',base.x+1,base.y,{}),friend=g.spawnUnit('de','de:infantry:0',base.x+3,base.y,{});
const hits=g.rocketRearTargets(launcher,target);assert(hits.includes(rear)&&!hits.includes(front)&&!hits.includes(friend));rear.hp=1;const splash=g.attack(launcher,target);assert(splash.splash.some(h=>h.killed));assert(!g.units.includes(rear));assert.equal(front.hp,100);assert.equal(friend.hp,100);
assert(D.EQUIP.su.gun_rocket[0].splash>D.EQUIP.neutral.gun_rocket[0].splash);
// French field guns return stronger fire using the actual counterattack calculation.
function counter(ct){g=fresh();const attacker=g.spawnUnit('de','de:infantry:0',base.x,base.y,{}),defender=g.spawnUnit('fr',(ct==='fr'?'fr':'neutral')+':gun_field:0',base.x+1,base.y,{});const random=Math.random;Math.random=()=>.5;try{return g.attack(attacker,defender).counter;}finally{Math.random=random;}}
assert(counter('fr')>counter('neutral'));
g=fresh();const city=g.cityByKey.berlin;assert.equal(g.factoryRoster(city).length,0);city.factory=true;
for(const [turn,tier]of [[0,0],[16,1],[40,2]]){g.turn=turn;const offers=g.factoryRoster(city).filter(o=>o.eq.artRole);assert.equal(offers.length,5);assert(offers.every(o=>o.eq.tier===tier));}
g.turn=0;assert.equal(g.recruit('berlin','de:gun_gun:0'),null);assert.equal(g.recruitFactory('berlin','de:art:0'),null);const unit=g.recruitFactory('berlin','de:gun_gun:0');assert(unit);assert.equal(Game.deserialize(g.serialize()).units.find(u=>u.id===unit.id).eq.artRole,'gun');
console.log('Artillery: factory unlocks, five roles, national traits, AA radius/interception/no stacking, counters, rear splash and save passed');
// Protection ends outside the adjacent ring; neutral/hostile AA cannot protect the target.
g=fresh();const defended=g.spawnUnit('uk','uk:infantry:0',base.x+2,base.y,{}),outside=g.spawnUnit('uk','uk:gun_aa:0',base.x+4,base.y,{}),hostile=g.spawnUnit('de','de:gun_aa:0',base.x+2,base.y,{});assert.equal(g.aaCover(defended).length,0);
// Old artillery is still loaded with its original key, while special price premiums remain zero.
const legacy=g.spawnUnit('de','de:art:0',base.x,base.y,{});assert.equal(Game.deserialize(g.serialize()).units.find(u=>u.id===legacy.id).eqKey,'de:art:0');
for(const [ct,role]of [['de','aa'],['it','gun'],['fr','field'],['uk','at'],['su','rocket']])for(let i=0;i<3;i++)assert.equal(D.EQUIP[ct]['gun_'+role][i].cost,D.EQUIP.neutral['gun_'+role][i].cost);
console.log('Artillery coverage boundaries, same-price variants and legacy saves passed');
