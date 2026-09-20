'use strict';
// Minimum-cost rectangular assignment (Hungarian algorithm). Forbidden pairs use
// Infinity. Unlike first-come placement, a city cannot push every later one away.
function assignCells(costs) {
 const n=costs.length;if(!n)return [];
 const m=costs[0].length;
 if(m<n||costs.some(row=>row.length!==m))throw Error('Insufficient or inconsistent candidate cells');
 const u=Array(n+1).fill(0),v=Array(m+1).fill(0),p=Array(m+1).fill(0),way=Array(m+1).fill(0);
 for(let i=1;i<=n;i++){
  p[0]=i;let j0=0;
  const min=Array(m+1).fill(Infinity),seen=Array(m+1).fill(false);
  do {
   seen[j0]=true;const i0=p[j0];let delta=Infinity,j1=0;
   for(let j=1;j<=m;j++)if(!seen[j]){
    const cur=costs[i0-1][j-1]-u[i0]-v[j];
    if(cur<min[j]){min[j]=cur;way[j]=j0;}
    if(min[j]<delta){delta=min[j];j1=j;}
   }
   if(!Number.isFinite(delta))throw Error('No valid city/cell assignment');
   for(let j=0;j<=m;j++)if(seen[j]){u[p[j]]+=delta;v[j]-=delta;}else min[j]-=delta;
   j0=j1;
  }while(p[j0]!==0);
  do {const j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0);
 }
 const assignment=Array(n);for(let j=1;j<=m;j++)if(p[j])assignment[p[j]-1]=j-1;
 return assignment;
}
module.exports={assignCells};
