'use strict';
const assert=require('node:assert/strict'),{Game}=require('./js/engine/game'),D=require('./js/data/load-node');
const g=new Game('axis','normal',{initialAir:false,initialFleet:false});g.units=[];g.gold.axis=10000;const city=g.cityByKey.berlin;
assert.equal(g.rosterFor(city).length,11);assert(g.rosterFor(city).every(o=>o.eq.cls==='inf'));
assert.equal(g.recruit('berlin','de:art:0'),null);assert.equal(g.recruitFactory('berlin','de:art:0'),null);
assert.equal(g.recruit('london','uk:infantry:0'),null);assert.equal(g.recruit('berlin','su:infantry:0'),null);assert.equal(g.recruit('berlin','de:inf:0'),null);
for(const turn of [0,16,40]){
 g.turn=turn;const tier=turn===0?0:turn===16?1:2;const offers=g.rosterFor(city);assert(offers.every(o=>o.eq.tier===tier));
 const before=g.gold.axis,u=g.recruit('berlin',offers[0].eqKey);assert(u&&u.moved&&u.attacked);assert.equal(g.gold.axis,before-u.eq.cost);g.killUnit(u);
 if(tier)assert.equal(g.recruit('berlin','de:militia:0'),null);
}
g.turn=0;assert(g.startConstruction('berlin','factory'));g.advanceConstruction();g.advanceConstruction();assert.equal(g.factoryRoster(city).length,0);g.advanceConstruction();
assert.equal(g.factoryRoster(city).length,10);assert.equal(g.recruit('berlin','de:art:0'),null);
const gun=g.recruitFactory('berlin',g.factoryRoster(city)[0].eqKey);assert(gun);assert.equal(g.recruitFactory('berlin','de:tank:0'),null);g.killUnit(gun);
for(const [ct,role]of [['de','motorized'],['su','infantry'],['uk','airborne'],['fr','mountain'],['it','militia']])for(let i=0;i<3;i++){
 const e=D.EQUIP[ct][role][i],n=D.EQUIP.neutral[role][i];assert.equal(e.cost,n.cost);assert(e.atk>n.atk&&e.def>n.def);assert.equal(e.mov,n.mov);
}
const noAirport=g.cities.find(c=>c.owner==='axis'&&!g.airfields.includes(c));assert(g.recruit(noAirport.k,'de:airborne:0'));
const spawn=role=>g.spawnUnit('de','de:'+role+':0',city.x,city.y,{});
g.units=[];const inf=spawn('infantry'),mountain=spawn('mountain'),marine=spawn('marine'),ranger=spawn('ranger');
const [c,r]=g.neighbors(city.x,city.y)[0],def=g.spawnUnit('uk','uk:infantry:0',c,r,{});
for(const [terrain,special]of [['h',mountain],['m',mountain],['f',ranger]]){g.terr[c+','+r]=terrain;assert(g.terrainCost(special,c,r)<g.terrainCost(inf,c,r));assert(g.computeDamage(special,def,{preview:true})>g.computeDamage(inf,def,{preview:true}));}
g.terr[c+','+r]='.';g.riverEdges.add(g.edgeKey([city.x,city.y],[c,r]));assert(g.effAtk(marine,def)>g.effAtk(inf,def));
g.riverEdges.clear();for(const u of [inf,marine]){u.transport='transport';u.embarked=true;}assert(g.effAtk(marine,def)>g.effAtk(inf,def));
// New and legacy keys both survive saves; saved units do not auto-upgrade.
g.units=[];const old=g.spawnUnit('de','de:inf:0',city.x,city.y,{});const newUnit=g.spawnUnit('de','de:airborne:0',c,r,{});
const restored=Game.deserialize(g.serialize());assert.equal(restored.units.find(u=>u.id===old.id).eqKey,'de:inf:0');assert(restored.units.find(u=>u.id===newUnit.id).eq.para);assert(restored.cityByKey.berlin.factory);
g.units=[];g.captureCity(g.cityByKey.paris,'axis');assert(g.rosterFor(g.cityByKey.paris).some(o=>o.eq.n.includes('武装党卫军')));assert(g.recruit('paris','de:infantry:0'));assert.equal(g.units.at(-1).ct,'de');
console.log('Infantry: 11 roles, 3 dates, national replacements, factory gates, terrain skills, ownership and save compatibility passed');
// Marine river movement discount is reflected in the actual path cost map.
const riverGame=new Game('axis','normal',{initialAir:false,initialFleet:false});riverGame.units=[];
const home=riverGame.cityByKey.berlin,[rc,rr]=riverGame.neighbors(home.x,home.y)[0];riverGame.terr[rc+','+rr]='.';
riverGame.riverEdges=new Set([riverGame.edgeKey([home.x,home.y],[rc,rr])]);
const foot=riverGame.spawnUnit('de','de:infantry:0',home.x,home.y,{});const footCost=riverGame.moveRange(foot).cost.get(rc+','+rr);riverGame.killUnit(foot);
const navalInf=riverGame.spawnUnit('de','de:marine:0',home.x,home.y,{});assert.equal(footCost,2);assert.equal(riverGame.moveRange(navalInf).cost.get(rc+','+rr),1);
// Enemy AI uses its own nationality and cannot buy factory units in ordinary cities.
const ai=new Game('axis','normal',{initialAir:false,initialFleet:false});ai.units=[];ai.gold.west=10000;ai.aiRecruit('west',true);
assert(ai.units.length);assert(ai.units.every(u=>u.eq.cls==='inf'&&u.eq.infRole&&ai.unitFaction(u)==='west'));
console.log('Infantry movement and AI city restrictions passed');
