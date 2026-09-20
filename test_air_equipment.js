'use strict';
const assert=require('node:assert/strict');
const D=require('./js/data/load-node'),{Game,key,hexDist}=require('./js/engine/game');
const fresh=()=>{const g=new Game('axis','normal',{initialFleet:false});g.units=[];g.gold.axis=10000;return g;};
const eqKey=(ct,role,tier=0)=>ct+':air:'+D.EQUIP[ct].air.findIndex(e=>e.airRole===role&&e.tier===tier);
for(const ct of ['de','uk','us','su','fr','it','jp','neutral'])for(const role of Object.keys(D.AIR.roles)){
 const list=D.EQUIP[ct].air.filter(e=>e.airRole===role);assert(list.length>=1&&list.length<=3,ct+role);
 assert(list.every(e=>e.mov>0&&e.def>0&&e.cost>0));if(role==='transport')assert(list.every(e=>e.atk===0));
}
for(const tier of [0,1,2]){
 const list=D.EQUIP.neutral.air.filter(e=>e.tier===tier),fighter=list.find(e=>e.airRole==='fighter'),strat=list.find(e=>e.airRole==='strategic');
 assert(list.every(e=>e.cost>=fighter.cost&&e.cost<=strat.cost));assert(list.every(e=>e.mov<=strat.mov));
}
let g=fresh(),berlin=g.cityByKey.berlin;
const spawn=role=>g.spawnUnit('de',eqKey('de',role),berlin.x,berlin.y,{});
const fighter=spawn('fighter'),heavy=spawn('heavy'),cas=spawn('cas'),naval=spawn('naval'),tac=spawn('tactical'),strat=spawn('strategic'),transport=spawn('transport');
const target=g.spawnUnit('uk','uk:inf:0',...g.landNeighbors(berlin.x,berlin.y)[0],{});
const airTarget=g.spawnUnit('uk',eqKey('uk','cas'),g.cityByKey.london.x,g.cityByKey.london.y,{});
const tank={...target,eq:D.EQUIP.uk.tank[0]},ship={...target,eq:D.EQUIP.uk.dd[0]};
assert(g.effAtk(fighter,airTarget)>g.effAtk(fighter,tank)*5);assert(g.effAtk(heavy,airTarget)>g.effAtk(fighter,airTarget));
assert(g.effAtk(cas,tank)>g.effAtk(cas,airTarget)*5);assert(g.effAtk(naval,ship)>g.effAtk(naval,tank)*5);
assert(tac.eq.mov>cas.eq.mov&&tac.eq.def>cas.eq.def&&tac.eq.cost>cas.eq.cost);
assert.equal(g.computeDamage(transport,target,{preview:true}),0);assert.equal(g.targetsOf(transport).length,0);assert.equal(g.attack(transport,target),null);assert(!g.canCounter(transport,fighter));
const oldOffer=g.airRoster(berlin).find(o=>o.eq.airRole==='fighter');g.turn=28;const newOffer=g.airRoster(berlin).find(o=>o.eq.airRole==='fighter');assert.notEqual(oldOffer.eqKey,newOffer.eqKey);assert.equal(g.recruitAir('berlin',oldOffer.eqKey),null);assert(g.recruitAir('berlin',newOffer.eqKey));
// Cargo never blocks land, cannot act independently, follows rebasing, and retains identity on landing.
g=fresh();berlin=g.cityByKey.berlin;
const plane=g.spawnUnit('de',eqKey('de','transport'),berlin.x,berlin.y,{}),para=g.recruit('berlin',g.rosterFor(berlin).find(o=>o.eq.para).eqKey);assert(para);assert(!g.loadParatrooper(plane,para));
g.startTurnFor('axis');assert(g.loadParatrooper(plane,para));assert.equal(g.unitAt(berlin.x,berlin.y),null);assert(!g.playerUnits().includes(para));assert.equal(g.moveRange(para).cost.size,0);assert.equal(g.targetsOf(para).length,0);
assert(!g.loadParatrooper(plane,para));assert(!g.paradrop(plane,0,1));
const land=g.landNeighbors(berlin.x,berlin.y)[0];const blocker=g.spawnUnit('de','de:inf:0',...land,{});assert(!g.paradrop(plane,...land));g.killUnit(blocker);
assert(g.paradrop(plane,...land));assert(!para.carrierId);assert.equal(g.unitAt(...land),para);assert(plane.attacked&&para.attacked);assert(!g.paradrop(plane,...land));
g.startTurnFor('axis');para.c=plane.c;para.r=plane.r;assert(g.loadParatrooper(plane,para));
const destination=g.airfields.find(ci=>ci.k!=='berlin'&&ci.owner==='axis'&&hexDist(plane.c,plane.r,ci.x,ci.y)<=g.airRadius(plane));assert(g.rebaseAir(plane,destination.k));assert.equal(para.c,plane.c);assert.equal(para.r,plane.r);
let save=g.serialize(),restored=Game.deserialize(save);assert.equal(restored.cargoOf(restored.units.find(u=>u.id===plane.id)).id,para.id);
let invalid=JSON.parse(save);invalid.units.find(u=>u.id===para.id).carrierId=99999;assert.throws(()=>Game.deserialize(JSON.stringify(invalid)),/载运关系/);
g.killUnit(plane);assert(!g.units.includes(para),'transport destruction destroys cargo');
// Airport capture by landed paratroopers is allowed, unlike aircraft occupation.
g=fresh();berlin=g.cityByKey.berlin;const dropPlane=g.spawnUnit('de',eqKey('de','transport'),berlin.x,berlin.y,{}),troop=g.spawnUnit('de','de:para:0',berlin.x,berlin.y,{});assert(g.loadParatrooper(dropPlane,troop));
const dropCity=g.cities.find(ci=>ci.owner==='west'&&hexDist(berlin.x,berlin.y,ci.x,ci.y)<=g.airRadius(dropPlane));assert(dropCity);assert(g.paradrop(dropPlane,dropCity.x,dropCity.y));assert.equal(dropCity.owner,'axis');
// Nuclear attack: gate, all layers/affiliations, no repeated action, full six-turn suppression.
g=fresh();berlin=g.cityByKey.berlin;const bomber=g.spawnUnit('de',eqKey('de','strategic'),berlin.x,berlin.y,{}),city=g.cityByKey.hamburg;
assert(!g.nuclearStrike(bomber,city.x,city.y));g.turn=64;assert.equal(g.year(),1945);
g.gold.axis=1999;assert(!g.nuclearStrike(bomber,city.x,city.y));g.gold.axis=10000;
const centerGround=g.spawnUnit('de','de:inf:0',city.x,city.y,{}),centerPlane=g.spawnUnit('de',eqKey('de','transport'),city.x,city.y,{}),centerCargo=g.spawnUnit('de','de:para:0',city.x,city.y,{});assert(g.loadParatrooper(centerPlane,centerCargo));
const adjacent=g.landNeighbors(city.x,city.y)[0],neighbor=g.spawnUnit('uk','uk:inf:0',...adjacent,{});
const faraway=g.spawnUnit('uk','uk:inf:0',g.cityByKey.london.x,g.cityByKey.london.y,{}),before=g.gold.axis;
assert(g.nuclearStrike(bomber,city.x,city.y));assert.equal(before-g.gold.axis,2000);
for(const u of [centerGround,centerPlane,centerCargo])assert(!g.units.includes(u));assert.equal(neighbor.hp,25);assert.equal(faraway.hp,100);assert.equal(Object.keys(g.fallout).length,7);assert.equal(g.cityIncome(city),0);assert(!g.nuclearStrike(bomber,city.x,city.y));
restored=Game.deserialize(g.serialize());assert.deepEqual(restored.fallout,g.fallout);assert.equal(restored.cityIncome(restored.cityByKey.hamburg),0);
g.aiTurn=()=>[];g.processEvents=()=>{};g.isWinter=()=>false;
const baseIncome=city.inc;
for(let i=0;i<6;i++){
 assert.equal(g.contamination(city.x,city.y),6-i);assert.equal(g.cityIncome(city),0);
 const expectedIncome=g.factionIncome('axis'),gold=g.gold.axis;
 g.endTurn();assert.equal(g.gold.axis-gold,expectedIncome,'six full income collections suppressed');
 if(i===0)assert.equal(neighbor.hp,5,'fallout damage without healing');
}
assert.equal(g.cityIncome(city),baseIncome);assert.equal(g.contamination(city.x,city.y),0);assert(!g.units.includes(neighbor));
invalid=JSON.parse(g.serialize());invalid.fallout={'999,999':6};assert.throws(()=>Game.deserialize(JSON.stringify(invalid)),/核污染/);
// Compatibility: old equipment indices remain the same role and cargo/fallout default empty.
const legacy=JSON.parse(fresh().serialize());legacy.v=7;delete legacy.fallout;assert.deepEqual(Game.deserialize(JSON.stringify(legacy)).fallout,{});
console.log('Aircraft equipment: seven roles, progression, combat specialization, cargo, paradrops, nuclear blast, six-round fallout/income and save validation passed.');
// AI special missions follow the same loaded-cargo and funding rules.
const aiDrop=fresh(),aiBase=aiDrop.cityByKey.berlin;
const aiTransport=aiDrop.spawnUnit('de',eqKey('de','transport'),aiBase.x,aiBase.y,{}),aiPara=aiDrop.spawnUnit('de','de:para:0',aiBase.x,aiBase.y,{});
aiDrop.gold.axis=0;aiDrop.aiAir('axis',[],true);assert(aiTransport.attacked&&!aiPara.carrierId&&aiPara.c!==aiBase.x,'AI loads and drops airport paratroopers');
const aiNuke=fresh();aiNuke.turn=64;const launch=aiNuke.cityByKey.berlin,nukeTarget=aiNuke.cityByKey.hamburg;
nukeTarget.owner='west';const aiBomber=aiNuke.spawnUnit('de',eqKey('de','strategic',0),launch.x,launch.y,{});
const positions=[[nukeTarget.x,nukeTarget.y],...aiNuke.landNeighbors(nukeTarget.x,nukeTarget.y)].slice(0,4);assert.equal(positions.length,4);
for(const p of positions)aiNuke.spawnUnit('uk','uk:inf:0',...p,{});
aiNuke.aiAir('axis',[],true);assert(aiBomber.attacked&&aiNuke.contamination(nukeTarget.x,nukeTarget.y)===6,'AI nuclear mission against concentration');
console.log('AI air special missions: loaded paradrop and funded nuclear strike passed.');
