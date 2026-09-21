const assert=require('node:assert/strict');
const {Game}=require('./js/engine/game');
const g=new Game('axis');g.units=[];g.blockedEdges.clear();g.riverEdges.clear();
for(let r=18;r<=22;r++)for(let c=18;c<=22;c++)g.terr[c+','+r]='m';
const u=g.spawnUnit('de','de:infantry:0',20,20,{});u.eq={...u.eq,mov:1};
const neighbors=g.neighbors(20,20);let range=g.moveRange(u);
for(const p of neighbors){assert(range.cost.has(p.join(',')));assert.deepEqual(g.pathTo(u,p.join(',')),[p]);}
assert.equal(range.cost.size,6,'cannot chain minimum moves');
g.riverEdges.add(g.edgeKey([20,20],neighbors[0]));assert(g.moveRange(u).cost.has(neighbors[0].join(',')));
u.eq.mov=0;assert.equal(g.moveRange(u).cost.size,6);
const [a,b,c,d]=neighbors;g.spawnUnit('de','de:infantry:0',...a,{});g.spawnUnit('pl','neutral:infantry:0',...b,{});
g.blockedEdges.add(g.edgeKey([20,20],c));g.terr[d.join(',')]='~';range=g.moveRange(u);
for(const p of [a,b,c,d])assert(!range.cost.has(p.join(',')),'blocked destination '+p);
const target=neighbors[4];assert(g.moveUnit(u,...target));assert(u.moved);assert.equal(g.moveRange(u).cost.size,0);
u.moved=false;u.attacked=true;assert.equal(g.moveRange(u).cost.size,0);
console.log('Minimum movement: mountain, river, zero movement, single step, occupied tiles, blocked edges, coast and action restrictions passed.');
