(function(){
 const root=typeof window!=='undefined'?window:globalThis;
 const roles={
 gun:{name:'炮兵',atk:48,def:14,mov:2,rng:2,cost:90,armor:.55,soft:1,nt:'对装甲伤害降低'},
 aa:{name:'防空炮',atk:36,def:12,mov:2,rng:2,cost:100,armor:.55,soft:.65,nt:'本格与邻格友军空袭伤害降低50%；最强一支防空炮拦截反击，不叠加'},
 at:{name:'反坦克炮',atk:48,def:12,mov:2,rng:2,cost:100,armor:1.9,soft:.6,nt:'对装甲增伤，对非装甲效果较弱'},
 field:{name:'野战炮',atk:62,def:12,mov:2,rng:3,cost:130,armor:.75,soft:1.15,nt:'射程3格；可在射程内反击'},
 rocket:{name:'火箭炮',atk:56,def:10,mov:2,rng:2,cost:140,armor:.65,soft:1.15,splash:.4,nt:'攻击目标后方相邻、距发射者更远的格子，对其中敌方地面单位造成40%溅射伤害'}
 };
 const equipment={};
 for(const ct of ['de','it','fr','uk','su','neutral']){
  equipment[ct]={};
  for(const [role,r]of Object.entries(roles))equipment[ct]['gun_'+role]=[1939,1941,1943].map((yr,tier)=>{
   const e={...r,n:yr+'型'+r.name,cls:'art',artRole:role,yr,tier,atk:r.atk+8*tier,def:r.def+3*tier,cost:Math.round(r.cost*(1+.1*tier))};
   if(ct==='de'&&role==='aa'){e.n=yr+'型88mm防空炮';e.armor=1.9;e.nt+='；德国特色：对装甲明显增伤';}
   if(ct==='it'&&role==='gun'){e.n=yr+'型山地榴弹炮';e.mountainGun=true;e.nt+='；意大利特色：山地移动成本降低1，山地作战攻击+15%';}
   if(ct==='fr'&&role==='field'){e.n=yr+'型施耐德野战炮';e.counterMultiplier=1.1;e.nt+='；法国特色：反击系数110%（普通炮兵55%）';}
   if(ct==='uk'&&role==='at'){e.n=yr+'型6磅反坦克炮';e.armor=2.4;e.soft=.4;e.nt+='；英国特色：进一步强化反装甲、削弱对非装甲伤害';}
   if(ct==='su'&&role==='rocket'){e.n=yr+'型喀秋莎火箭炮';e.splash=.65;e.nt=e.nt.replace('40%','65%')+'；苏联特色';}
   return e;
  });
 }
 root.GameData.modules.artillery={roles,equipment};
})();
