/* Screen-space labels: independent from the capped terrain texture. */
(function(root){
 'use strict';
 const tier=(z,meta)=>z<meta.labelZooms[0]?0:z<meta.labelZooms[1]?1:z<meta.labelZooms[2]-1e-9?2:3;
 function candidates(meta,cities,z){
  const level=tier(z,meta);
  const names=meta.labels.filter(l=>l.level===level).map(l=>({...l,text:l.name,id:'geo:'+l.name,priority:l.kind==='country'?0:l.kind==='region'?1:2}));
  if(level>0)for(const ci of cities)if(level===3||meta.cityLabelLevels[ci.k]===level)
   names.push({id:'city:'+ci.k,text:ci.n,kind:'city',grid:[ci.x+.5*(ci.y&1),ci.y],priority:3,capital:!!ci.cap,all:level===3});
  if(level===2)for(const c of meta.canals||[])names.push({id:'canal:'+c.id,text:c.name,kind:'canal',grid:c.labelAnchor,priority:2});
  return names;
 }
 const intersects=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
 // Returns screen coordinates, preserving every visible city at maximum zoom.
 function layout(items,{z,x,y,width,height},measure){
  const s=36*z,placed=[],boxes=[];
  const sorted=items.slice().sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
  for(const item of sorted){
   const ax=item.grid[0]*s*Math.sqrt(3)+x,ay=item.grid[1]*s*1.5+y;
   if(ax<0||ax>width||ay<0||ay>height)continue;
   const fontSize=item.kind==='country'?14:item.kind==='city'?12:13;
   const lines=item.all&&item.text.length>9?[item.text.slice(0,9),item.text.slice(9)]:[item.text];
   const w=Math.max(...lines.map(t=>measure(t,fontSize)))+8,h=lines.length*(fontSize+3)+4;
   const gap=item.kind==='city'?s*.88:0;
   const offsets=item.kind==='city'?[[0,gap+h/2],[0,-gap-h/2],[s*.9+w/2,0],[-s*.9-w/2,0]]:
    [[0,0],[0,-22],[0,22],[32,0],[-32,0],[0,-44],[0,44]];
   let best=null,bestOverlap=Infinity;
   for(const [dx,dy]of offsets){
    const lx=Math.max(w/2,Math.min(width-w/2,ax+dx)),ly=Math.max(h/2,Math.min(height-h/2,ay+dy));
    const box=[lx-w/2,ly-h/2,lx+w/2,ly+h/2];
    const hits=boxes.filter(b=>intersects(box,b));
    const overlap=hits.reduce((n,b)=>n+(Math.min(b[2],box[2])-Math.max(b[0],box[0]))*(Math.min(b[3],box[3])-Math.max(b[1],box[1])),0);
    if(overlap<bestOverlap){best={...item,ax,ay,x:lx,y:ly,box,lines,fontSize,leader:Math.hypot(lx-ax,ly-ay)>gap+h/2+4};bestOverlap=overlap;}
    if(!overlap)break;
   }
   if(best&&(bestOverlap===0||item.all)){placed.push(best);boxes.push(best.box);}
  }
  return placed;
 }
 const api={tier,candidates,layout};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.MapLabels=api;
})(typeof window!=='undefined'?window:globalThis);
