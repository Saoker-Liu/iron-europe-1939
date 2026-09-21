const assert=require('node:assert/strict'),{Game,hexDist}=require('./js/engine/game'),D=require('./js/data/load-node');
let g=new Game('sov');const westBefore=g.cities.filter(c=>c.owner==='west').length;
g.neutralDefect('fi','sov');assert.equal(g.cf.fi,'local:fi');assert(g.atWar('sov','local:fi'));assert(!g.atWar('sov','west'));assert(!g.atWar('sov','neutral'));assert.equal(g.cities.filter(c=>c.owner==='west').length,westBefore);
const su=g.units.find(u=>u.ct==='su'),fi=g.units.find(u=>u.ct==='fi'),uk=g.units.find(u=>u.ct==='uk');
assert(g.canTargetFaction(su,fi));assert(g.canTargetFaction(fi,su));assert(!g.canTargetFaction(fi,uk));assert(g.anyWar('local:fi'));
let saved=Game.deserialize(g.serialize());assert(saved.atWar('sov','local:fi'));assert.equal(saved.cf.uk,'west');
// Occupation preserves nationality/units; only ALL tied city owners transfer a boundary cell.
g=new Game('axis');let cell;
for(let r=0;r<D.MAP_H&&!cell;r++)for(let c=0;c<D.MAP_W;c++){
 const deps=g.dependencies[r*D.MAP_W+c];if(g.legalCountry(c,r)==='pl'&&deps.length>1&&deps.every(i=>!g.cities[i].cap)){cell=[c,r,deps];break;}
}
assert(cell);const [c,r,deps]=cell;const attacker=g.units.find(u=>u.ct==='de');const troops=g.units.filter(u=>u.ct==='pl').length;
g.captureCity(g.cities[deps[0]],'axis',attacker);assert.equal(g.territoryCountry(c,r),'pl');assert.equal(g.units.filter(u=>u.ct==='pl').length,troops);
for(const i of deps.slice(1))g.captureCity(g.cities[i],'axis',attacker);assert.equal(g.territoryCountry(c,r),'de');
// Capital surrender annihilates national forces, then pact cedes eastern Polish regions to USSR.
g.captureCity(g.cityByKey.warsaw,'axis',attacker);assert.equal(g.annexed.pl,'de');assert(!g.units.some(u=>u.ct==='pl'));assert.equal(g.cityByKey.lwow.ct,'su');assert.equal(g.cityByKey.warsaw.ct,'de');assert(g.diplomacyEvents.poland);assert(!g.atWar('sov','west'));
saved=Game.deserialize(g.serialize());assert.equal(saved.cityByKey.lwow.ct,'su');assert.equal(saved.territoryCountry(saved.cityByKey.lwow.x,saved.cityByKey.lwow.y),'su');assert(saved.diplomacyEvents.poland);
// Cession evacuates, without deleting/refunding, to a nearest legal free national tile.
g=new Game('sov');const city=g.cityByKey.chisinau;let donor=g.units.find(u=>u.ct==='ro'&&u.c===city.x&&u.r===city.y);donor ||= g.spawnUnit('ro','neutral:infantry:0',city.x,city.y,{});const pos=[donor.c,donor.r],n=g.units.length;
assert(g.cedeTerritory('ro','su',['chisinau']));assert.equal(g.units.length,n);assert.equal(city.ct,'su');assert.equal(g.legalCountry(donor.c,donor.r),'ro');assert.notDeepEqual([donor.c,donor.r],pos);
// Baltic annexation removes all national units and has no allied war consequence.
g.turn=D.turnOf(1940,6);g.processEvents();for(const ct of ['ee','lv','lt']){assert.equal(g.annexed[ct],'su');assert(!g.units.some(u=>u.ct===ct));}assert(!g.atWar('sov','west'));
const after=g.units.length;g.processEvents();assert.equal(g.units.length,after);
// Both winter-war outcomes leave Finland independent, and peace removes only the bilateral war.
for(const sovietWins of [true,false]){
 g=new Game('sov');g.beginLocalWar('fi');const mover=g.units.find(u=>u.ct===(sovietWins?'su':'fi'));
 const destination=g.cityByKey[sovietWins?'helsinki':'leningrad'];g.captureCity(destination,g.unitFaction(mover),mover);
 assert.equal(g.winterWar.status,'peace');assert(!g.annexed.fi);assert(!g.annexed.su);assert(!g.atWar('sov','local:fi'));assert(!g.atWar('sov','west'));assert.equal(g.cf.fi,'neutral');
 assert.equal(g.cityByKey.helsinki.ct,'fi');assert.equal(g.cityByKey.leningrad.owner,'sov');assert.equal(g.cityByKey.viipuri.ct,sovietWins?'su':'fi');
}
console.log('Diplomacy: bilateral war, tied dependencies, occupation, surrender/partition, cession evacuation, Baltic annexation, event idempotence, saves and both winter-war armistices passed.');


// Capital movement is fully reversible, including partition and disbanded armies.
g=new Game('axis');const warsaw=g.cityByKey.warsaw;
for(const x of [...g.units])if(x.c===warsaw.x&&x.r===warsaw.y)g.killUnit(x);
const origin=g.landNeighbors(warsaw.x,warsaw.y)[0];
const blocker=g.unitAt(...origin);if(blocker)g.killUnit(blocker);
const mover=g.spawnUnit('de','de:infantry:0',...origin,{}),before=g.movementState();
assert(g.moveUnit(mover,warsaw.x,warsaw.y));assert.equal(g.cityByKey.lwow.ct,'su');assert(g.canUndoMove(mover));
assert(g.undoMove(mover));assert.deepEqual(g.movementState(),before);
// A capitulated occupier cannot leave phantom control over third-country cities.
g=new Game('sov');g.cityByKey.lille.controlCt='de';g.cityByKey.lille.owner='axis';
const french=g.units.filter(u=>u.ct==='fr').length;g.annexCountry('de','su');
assert.equal(g.cityByKey.lille.ct,'su');assert(!g.cities.some(ci=>g.controllingCountry(ci)==='de'));assert.equal(g.units.filter(u=>u.ct==='fr').length,french);
// Generic equipment in an occupied city belongs to its actual national controller.
g=new Game('sov');g.beginLocalWar('fi');const occupied=g.cityByKey.novgorod;occupied.owner='local:fi';occupied.controlCt='fi';
for(const x of [...g.units])if(x.c===occupied.x&&x.r===occupied.y)g.killUnit(x);
g.gold['local:fi']=1000;const offer=g.rosterFor(occupied)[0],recruit=g.recruit(occupied.k,offer.eqKey,'local:fi');
assert(recruit);assert.equal(recruit.ct,'fi');assert.equal(g.unitFaction(recruit),'local:fi');
// Cession keeps aircraft and ships alive, relocating each to a suitable national destination.
g=new Game('sov');const v=g.cityByKey.viipuri,base=g.cityByKey.helsinki;
if(!g.airfields.includes(v))g.airfields.push(v);
const planeKey=g.airRoster(v)[0].eqKey,plane=g.spawnUnit('fi',planeKey,v.x,v.y,{});plane.airbase=v.k;
const port=g.harbors.find(h=>h.cityKey===v.k),ship=port&&g.units.find(u=>u.ct==='fi'&&u.c===port.c&&u.r===port.r&&g.isNaval(u));
assert(g.cedeTerritory('fi','su',[v.k]));assert(g.units.includes(plane));assert(g.airBase(plane));assert.equal(g.airBase(plane).ct,'fi');
if(ship){assert(g.units.includes(ship));assert(g.ocean(ship.c,ship.r));}
// A treaty with temporarily unavailable bases preserves and later redeploys aircraft.
g=new Game('sov');const air=g.units.find(u=>u.ct==='fi'&&g.isAir(u));g.airfields=g.airfields.filter(ci=>ci.ct!=='fi');
g.relocateNationalUnits('fi',[air]);assert(air.evacuated);g.removeLostAirfields();assert(g.units.includes(air));
g=Game.deserialize(g.serialize());const reserve=g.units.find(u=>u.id===air.id);assert(reserve.evacuated);
g.airfields.push(g.cityByKey.helsinki);g.beginLocalWar('fi');g.startTurnFor('local:fi');assert(!reserve.evacuated);assert(g.airBase(reserve));
console.log('Diplomacy edge cases: undo/partition, occupied holdings, national recruitment, evacuation/base recovery passed.');
