const assert=require('node:assert/strict'),{Game}=require('./js/engine/game');
function setup(){const g=new Game('axis');g.units=[];g.blockedEdges.clear();g.riverEdges.clear();for(let r=18;r<25;r++)for(let c=18;c<27;c++)g.terr[c+','+r]='.';g.cf.pl='west';return g;}
let g=setup(),u=g.spawnUnit('de','de:infantry:0',20,20,{});u.dug=true;
assert(g.moveUnit(u,21,20));assert(u.moved&&u.attacked);assert(!g.pendingPlayerUnits().includes(u));assert(g.canUndoMove(u));
assert(!g.moveUnit(u,22,20));assert(g.canUndoMove(u),'invalid actions preserve undo');
let saved;
assert(g.undoMove(u));assert.equal(u.c,20);assert(!u.moved&&!u.attacked&&u.dug);
u.dug=false;const enemy=g.spawnUnit('pl','neutral:infantry:0',22,20,{});
assert(g.moveUnit(u,21,20));assert(!u.attacked);assert(g.attack(u,enemy));assert(!g.canUndoMove(u));
g=setup();u=g.spawnUnit('de','de:infantry:0',20,20,{});const v=g.spawnUnit('de','de:infantry:0',20,23,{});
assert(g.moveUnit(u,21,20));assert(g.moveUnit(v,21,23));assert(!g.canUndoMove(u));assert(g.canUndoMove(v));
g.startTurnFor('axis');assert(!g.canUndoMove(v));
g=new Game('axis');g.units=[];const ci=g.cityByKey.paris;ci.owner='west';const from=g.landNeighbors(ci.x,ci.y)[0];u=g.spawnUnit('de','de:infantry:0',...from,{});u.eq={...u.eq,mov:20};
assert(g.moveUnit(u,ci.x,ci.y));assert.equal(ci.owner,'axis');assert(!g.canUndoMove(u));assert(!g.undoMove(u));assert.equal(ci.owner,'axis');
g=new Game('axis');g.units=[];const home=g.cityByKey.berlin;u=g.spawnUnit('de','de:infantry:0',home.x,home.y,{});const dest=g.landNeighbors(u.c,u.r)[0];assert(g.moveUnit(u,...dest));
saved=Game.deserialize(g.serialize());const loaded=saved.units.find(x=>x.id===u.id);assert(saved.canUndoMove(loaded));assert(saved.undoMove(loaded));assert.equal(loaded.c,home.x);
console.log('Undo movement: auto-wait, real attacks, invalid attempts, next unit, turn boundary, capture rollback and save/resume passed.');


// Equal movement-cost routes must prefer avoiding a neutral country.
g=setup();g.homeCountryOf=(c,r)=>c===21&&r===20?'ch':'de';u=g.spawnUnit('de','de:infantry:0',20,20,{});
const path=g.pathTo(u,'21,19');assert(path);assert.equal(path.length,2);assert(!path.some(([c,r])=>c===21&&r===20));
assert(g.moveUnit(u,21,19));assert.equal(g.cf.ch,'neutral');assert(g.canUndoMove(u));
g.undoMove(u);assert(g.moveUnit(u,21,20));assert.notEqual(g.cf.ch,'neutral');assert(!g.canUndoMove(u));
console.log('Neutral routing: equal-cost safe route preferred; declaring war cannot be undone.');
