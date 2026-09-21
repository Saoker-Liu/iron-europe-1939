'use strict';
const assert=require('node:assert/strict'),{Game}=require('./js/engine/game'),D=require('./js/data/load-node');
const fresh=()=>{const g=new Game('axis','normal',{initialAir:false,initialFleet:false});g.units=[];g.gold.axis=10000;return g;};
let g=fresh(),city=g.cityByKey.berlin;city.factory=true;
const roles=['car','light','medium','heavy','superheavy'];
for(const ct of ['de','it','fr','uk','su','neutral'])for(let tier=0;tier<3;tier++){
 const list=roles.map(r=>D.EQUIP[ct]['armor_'+r][tier]);
 for(let i=1;i<5;i++){assert(list[i].cost>list[i-1].cost);assert(list[i].atk>list[i-1].atk);assert(list[i].def>list[i-1].def);assert(list[i].mov<=list[i-1].mov);}
 for(const eq of list)assert.equal(eq.cost,D.EQUIP.neutral['armor_'+eq.armorRole][tier].cost);
}
for(const [turn,tier]of [[0,0],[16,1],[40,2]]){g.turn=turn;const offers=g.factoryRoster(city).filter(o=>o.eq.armorRole);assert.equal(offers.length,5);assert(offers.every(o=>o.eq.tier===tier));}
g.turn=0;assert.equal(g.recruit('berlin','de:armor_car:0'),null);assert.equal(g.recruitFactory('berlin','de:tank:0'),null);city.factory=false;assert.equal(g.recruitFactory('berlin','de:armor_car:0'),null);city.factory=true;
const before=g.gold.axis,car=g.recruitFactory('berlin','de:armor_car:0');assert(car.moved&&car.attacked);assert.equal(g.gold.axis,before-90);assert.equal(g.recruitFactory('berlin','de:armor_light:0'),null);
const inf=g.spawnUnit('uk','uk:infantry:0',city.x+1,city.y,{}),tank=g.spawnUnit('uk','uk:armor_medium:0',city.x+1,city.y,{});
assert(g.effAtk({...car,eq:D.EQUIP.fr.armor_car[0]},inf)>g.effAtk({...car,eq:D.EQUIP.neutral.armor_car[0]},inf));
assert(g.effAtk({...car,eq:D.EQUIP.uk.armor_medium[0]},tank)>g.effAtk({...car,eq:D.EQUIP.neutral.armor_medium[0]},tank));
assert.equal(D.EQUIP.it.armor_light[0].mov,D.EQUIP.neutral.armor_light[0].mov+1);
function retaliation(ct){g=fresh();const a=g.spawnUnit('uk','uk:infantry:0',city.x+1,city.y,{}),d=g.spawnUnit('de',ct+':armor_heavy:0',city.x,city.y,{});const random=Math.random;Math.random=()=>.5;try{return g.attack(a,d).counter;}finally{Math.random=random;}}
assert(retaliation('de')>retaliation('neutral'));assert(D.EQUIP.de.armor_heavy[0].def>D.EQUIP.neutral.armor_heavy[0].def);
// Recovery occurs once per owning turn, follows terrain control and respects existing exclusions.
g=fresh();const moscow=g.cityByKey.moscow,t34=g.spawnUnit('su','su:armor_medium:0',moscow.x,moscow.y,{});t34.hp=40;g.startTurnFor('sov');assert.equal(t34.hp,75);g.startTurnFor('axis');assert.equal(t34.hp,75);
let home;for(let r=0;r<D.MAP_H&&!home;r++)for(let c=0;c<D.MAP_W;c++)if(g.landPassable(c,r)&&!g.cityAt(c,r)&&g.territoryOwner(c,r)==='sov'){home=[c,r];break;}
[t34.c,t34.r]=home;t34.hp=40;g.startTurnFor('sov');assert.equal(t34.hp,60);
t34.c=city.x;t34.r=city.y;t34.hp=40;g.startTurnFor('sov');assert.equal(t34.hp,40,'peace territory cannot heal');g.declareWar('axis','sov');g.startTurnFor('sov');assert.equal(t34.hp,50);
g.fallout[city.x+','+city.y]=2;g.startTurnFor('sov');assert.equal(t34.hp,50);g.fallout={};t34.transport='transport';t34.embarked=true;g.startTurnFor('sov');assert.equal(t34.hp,50);t34.embarked=false;t34.c=moscow.x;t34.r=moscow.y;t34.hp=99;g.startTurnFor('sov');assert.equal(t34.hp,100);
const legacy=g.spawnUnit('de','de:tank:0',city.x,city.y,{}),save=Game.deserialize(g.serialize());assert(save.units.find(u=>u.id===t34.id).eq.fastRecovery);assert.equal(save.units.find(u=>u.id===legacy.id).eqKey,'de:tank:0');
console.log('Armor: five monotonic roles, dates, factory restrictions, same-price national traits, actual counters, T-34 recovery and saves passed');
