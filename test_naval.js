'use strict';
const assert=require('node:assert/strict');
const D=require('./js/data/load-node');
const {Game,key,hexDist}=require('./js/engine/game');
const g=new Game('axis');g.units=[];g.gold.axis=10000;
const required=['scapaflow','plymouth','portsmouth','hamburg','wilhelmshaven','kiel','brest','marseille','toulon','genoa','venice','taranto','sevast','odessa','leningrad'];
const sea=g.seaDistances([[0,1]]);
for(const k of required)assert(g.harbors.some(h=>h.cityKey===k),'required yard '+k);
assert.equal(new Set(g.harbors.map(h=>key(h.c,h.r))).size,g.harbors.length);
for(const h of g.harbors){
 const ci=g.cityByKey[h.cityKey];assert(g.ocean(h.c,h.r));assert.equal(hexDist(h.c,h.r,ci.x,ci.y),1);
 assert(sea.has(key(h.c,h.r)),ci.n+' must reach the Atlantic by sea');
}
for(const [ct,roster]of Object.entries(D.NAVAL.equipment)){
 assert.equal(Object.keys(roster).length,8);
 for(const [cls,list]of Object.entries(roster)){
  assert(list.length>=1&&list.length<=3,ct+cls);
  list.forEach((eq,i)=>{assert.equal(eq.cls,cls);assert(eq.cost>0&&eq.mov>0&&eq.rng>0);if(i)assert(eq.yr>list[i-1].yr);});
 }
}
const kiel=g.cityByKey.kiel,h=g.harbors.find(h=>h.cityKey==='kiel');
function year(y){g.turn=(y-1939)*12-8;}
function offer(cls){return g.navalRoster(kiel).find(o=>o.eq.cls===cls);}
for(const [y,bb,bc]of [[1939,0,0],[1940,0,0],[1941,1,0],[1942,1,1],[1943,2,1],[1945,2,1]]){
 year(y);assert.equal(offer('bb').eqKey,'de:bb:'+bb);assert.equal(offer('bc').eqKey,'de:bc:'+bc);
 assert.equal(offer('cv').eqKey,'de:cv:0');assert.equal(offer('cve').eqKey,'de:cve:0');
}
year(1939);assert.equal(g.recruitNaval('kiel','de:bb:1'),null);
assert.equal(g.recruit('kiel','de:dd:0'),null,'no ships on city land');
assert.equal(g.recruitNaval('brest','fr:dd:0'),null,'cannot build at enemy yard');
g.gold.axis=119;assert.equal(g.recruitNaval('kiel','de:dd:0'),null);assert.equal(g.gold.axis,119);
g.gold.axis=10000;
const ship=g.recruitNaval('kiel','de:dd:0');assert(ship);assert.equal(g.gold.axis,9880);
assert(ship.moved&&ship.attacked);assert(!ship.embarked&&!ship.transport);assert.equal(g.moveRange(ship).cost.size,0);
assert.equal(g.recruitNaval('kiel','de:sub:0'),null,'occupied berth');assert.equal(g.gold.axis,9880);
g.startTurnFor('axis');assert(!g.equipTransport(ship,'transport'));
assert(!g.moveUnit(ship,kiel.x,kiel.y),'navy cannot enter city');
const range=g.moveRange(ship);assert(range.cost.size>0);
for(const k of range.cost.keys())assert(g.ocean(...k.split(',').map(Number)));
const dest=[...range.cost.keys()].find(k=>hexDist(h.c,h.r,...k.split(',').map(Number))>1);
assert(dest);assert(g.moveUnit(ship,...dest.split(',').map(Number)));assert(ship.attacked&&!ship.embarked,'sailing without targets automatically waits');
year(1943);assert.equal(g.recruitNaval('kiel','de:dd:0'),null,'obsolete model cannot be forged');
assert(g.recruitNaval('kiel','de:dd:2'));
// All target modifiers must remain finite, including embarked army targets.
for(const cls of Object.keys(D.CLASSES))for(const other of Object.keys(D.CLASSES))assert(Number.isFinite(D.ATK_MOD[cls][other]));
g.units=[];
const water=[h.c,h.r],next=g.neighbors(...water).find(p=>g.ocean(...p));
const dd=g.spawnUnit('de','de:dd:0',...water,{}),sub=g.spawnUnit('uk','uk:sub:0',...next,{});
assert(g.targetsOf(dd).includes(sub));assert(Number.isFinite(g.computeDamage(dd,sub,{preview:true})));
const before=sub.hp,rec=g.attack(dd,sub);assert(sub.hp<before&&rec.counter>0);
g.units=[];
const bb=g.spawnUnit('de','de:bb:0',...water,{}),ss=g.spawnUnit('uk','uk:sub:0',...next,{});
assert(!g.targetsOf(bb).includes(ss),'battleships cannot attack submerged targets');
const army=g.spawnUnit('uk','uk:inf:0',kiel.x,kiel.y,{});
assert(!g.canStrikeFrom(ss,...next,army),'submarines cannot attack land');
assert(g.targetsOf(bb).includes(army),'coastal bombardment');
g.units=[];
const transport=g.spawnUnit('uk','uk:tank:0',...next,{});transport.transport='transport';transport.embarked=true;
const raider=g.spawnUnit('de','de:sub:0',...water,{});
assert(g.targetsOf(raider).includes(transport));assert(Number.isFinite(g.computeDamage(raider,transport,{preview:true})));
assert.equal(g.attack(raider,transport).counter,0,'transport cannot counterattack a submarine');
raider.hp=40;g.startTurnFor('axis');assert.equal(raider.hp,65,'repair at friendly berth');
kiel.owner='west';raider.hp=40;g.startTurnFor('axis');assert.equal(raider.hp,40,'no repair at captured berth');
assert.equal(g.recruitNaval('kiel','de:sub:0'),null,'capture revokes production');
g.units=[];g.gold.west=10000;
const captured=g.recruitNaval('kiel','uk:dd:1','west');assert(captured);assert.equal(g.unitFaction(captured),'west');
assert.equal(captured.ct,'uk','captured yard builds occupier roster');
g.usaIn=true;assert(g.navalRoster(g.cityByKey.plymouth).some(o=>o.country==='us'));
g.usaIn=false;assert(!g.navalRoster(g.cityByKey.plymouth).some(o=>o.country==='us'));
const oslo=g.cityByKey.bergen;assert.equal(g.navalRoster(oslo)[0].country,'neutral');
const save=g.serialize(),restored=Game.deserialize(save);assert.equal(restored.units[0].eqKey,captured.eqKey);assert(restored.isNaval(restored.units[0]));
const invalid=JSON.parse(save);invalid.units[0].c=kiel.x;invalid.units[0].r=kiel.y;
assert.throws(()=>Game.deserialize(JSON.stringify(invalid)),/海军位置/);
// Opening two estuaries must not destroy an old save or move its units invisibly.
const old=JSON.parse(save);old.v=4;old.units=[{...old.units[0],ct:'de',eqKey:'de:inf:0',c:50,r:55}];
const migrated=Game.deserialize(JSON.stringify(old));assert(migrated.isEmbarked(migrated.units[0]));
// AI launches ships via the real economy and sails/attacks via normal commands.
const ai=new Game('axis');ai.units=[];ai.gold.west=2000;const acts=[];
ai.aiNavy('west',acts,true);const fleet=ai.units.find(u=>ai.isNaval(u));assert(fleet&&fleet.moved&&fleet.attacked);
assert(ai.gold.west<2000);ai.startTurnFor('west');
const targetPos=ai.neighbors(fleet.c,fleet.r).find(p=>ai.ocean(...p));
const target=ai.spawnUnit('de','de:sub:0',...targetPos,{});ai.aiNavy('west',acts,true);assert(target.hp<100);
ai.units=[];ai.gold.west=0;
const patrol=ai.spawnUnit('uk','uk:dd:0',10,20,{});
const remote=ai.spawnUnit('de','de:bb:0',10,27,{}),distance=hexDist(patrol.c,patrol.r,remote.c,remote.r);
ai.aiNavy('west',[],true);assert(patrol.moved&&hexDist(patrol.c,patrol.r,remote.c,remote.r)<distance,'AI sails toward naval enemy');
for(const passage of D.NAVAL.passages){
 const channel=new Game('axis');channel.units=[];
 const vessel=channel.spawnUnit('de','de:dd:0',...passage.a,{});
 assert.equal(channel.moveRange(vessel).cost.get(key(...passage.b)),hexDist(...passage.a,...passage.b),'strait costs geometric distance');
 assert(channel.moveUnit(vessel,...passage.b));assert(!vessel.embarked);
}
// No AI-only limits on launches, treasury share, fleet size, or ships per harbor.
for(const atWar of [false,true]){
 const unlimited=new Game('axis');unlimited.units=[];
 unlimited.cities.forEach(ci=>ci.owner='neutral');
 unlimited.cityByKey.plymouth.owner='west';
 for(let i=0;i<20;i++){
  const ship=unlimited.spawnUnit('uk','uk:dd:0',i,1,{});
  ship.moved=true;ship.attacked=true;
 }
 unlimited.gold.west=120;
 unlimited.aiNavy('west',[],atWar);
 assert.equal(unlimited.units.length,21,'one harbor may support more than twenty ships in war or peace');
 assert.equal(unlimited.gold.west,0,'AI may spend its entire treasury on an affordable ship');
}
const multiple=new Game('axis');multiple.units=[];multiple.gold.west=10000;
multiple.cities.forEach(ci=>ci.owner='neutral');
for(const k of ['plymouth','portsmouth','scapaflow'])multiple.cityByKey[k].owner='west';
multiple.aiNavy('west',[],false);
assert.equal(multiple.units.length,3,'all three free ports launch in a single peace turn');
assert(multiple.units.every(u=>u.moved&&u.attacked),'new ships still wait until next turn');
const paid=multiple.units.reduce((n,u)=>n+u.eq.cost,0);
assert.equal(multiple.gold.west,10000-paid);
multiple.aiNavy('west',[],false);assert.equal(multiple.units.length,3,'occupied berths still prevent stacking');
console.log(`Navy: ${g.harbors.length} ports; unlocks, economy, sea combat, saves, AI and unrestricted naval production passed.`);
