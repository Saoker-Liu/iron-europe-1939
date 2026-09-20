(function(){
 const root=typeof window!=='undefined'?window:globalThis;
 const roles={car:{name:'装甲车',cost:90,atk:34,def:26,mov:6},light:{name:'轻型坦克',cost:130,atk:44,def:36,mov:5},medium:{name:'中型坦克',cost:180,atk:56,def:48,mov:4},heavy:{name:'重型坦克',cost:250,atk:70,def:64,mov:3},superheavy:{name:'超重型坦克',cost:340,atk:86,def:82,mov:2}};
 const equipment={};
 for(const ct of ['de','it','fr','uk','su','neutral']){
  equipment[ct]={};
  for(const [role,r]of Object.entries(roles))equipment[ct]['armor_'+role]=[1939,1941,1943].map((yr,tier)=>{
   const e={n:yr+'型'+r.name,cls:'tank',armorRole:role,yr,tier,cost:Math.round(r.cost*(1+.1*tier)),atk:r.atk+8*tier,def:r.def+6*tier,mov:r.mov,nt:''};
   if(ct==='fr'&&role==='car'){e.n=yr+'型潘哈德装甲车';e.antiInfantry=1.3;e.nt='法国特色：对未登船步兵攻击+30%';}
   if(ct==='it'&&role==='light'){e.n=yr+'型L6轻型坦克';e.mov++;e.nt='意大利特色：移动力+1';}
   if(ct==='uk'&&role==='medium'){e.n=yr+'型萤火虫坦克';e.antiArmor=1.35;e.nt='英国特色：对陆上装甲与机械化步兵攻击+35%';}
   if(ct==='su'&&role==='medium'){e.n=yr+'型T-34坦克';e.fastRecovery=true;e.nt='苏联特色：己方城市每回合恢复35兵力，己方境内20，敌方境内10；海运与核污染中不恢复';}
   if(ct==='de'&&role==='heavy'){e.n=yr+'型虎式坦克';e.def+=8;e.counterMultiplier=.8;e.nt='德国特色：防御+8，反击系数80%（通用55%）';}
   return e;
  });
 }
 root.GameData.modules.armor={roles,equipment};
})();
