'use strict';
const assert=require('node:assert/strict');
const {assignCells}=require('./map-placement');
// The first city prefers cell 0 but must yield it to a city with no alternative.
assert.deepEqual(assignCells([[1,4],[2,Infinity]]),[1,0]);
assert.deepEqual(assignCells([[Infinity,2],[1,4]]),[1,0]);
assert.throws(()=>assignCells([[1,Infinity],[2,Infinity]]),/No valid/);
assert.deepEqual(assignCells([]),[]);
// Compare against exhaustive optima on small varied matrices, including bans.
let seed=1939;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function optimum(a,i=0,used=new Set()){
 if(i===a.length)return 0;
 return Math.min(...a[i].map((cost,j)=>{
  if(used.has(j)||!Number.isFinite(cost))return Infinity;
  return cost+optimum(a,i+1,new Set([...used,j]));
 }));
}
for(let t=0;t<80;t++){
 const a=Array.from({length:4},()=>Array.from({length:6},()=>rand()<.2?Infinity:Math.floor(rand()*100)));
 const best=optimum(a);
 if(!Number.isFinite(best)){assert.throws(()=>assignCells(a));continue;}
 const chosen=assignCells(a);assert.equal(new Set(chosen).size,a.length);
 assert.equal(chosen.reduce((s,j,i)=>s+a[i][j],0),best,'globally optimal placement');
}
console.log('City placement: constrained assignment and exhaustive optimality checks passed.');
