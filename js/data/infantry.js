(function(){
 const root=typeof window!=='undefined'?window:globalThis;
 const roles={
 militia:{name:'普通民兵',group:'民兵',atk:10,def:14,mov:2,cost:20},
 garrison:{name:'卫戍部队',group:'民兵',atk:14,def:30,mov:1,cost:30},
 irregular:{name:'非正规步兵',group:'民兵',atk:18,def:20,mov:3,cost:40},
 infantry:{name:'普通步兵师',group:'徒步步兵',atk:30,def:30,mov:3,cost:60},
 mountain:{name:'山地步兵师',group:'徒步步兵',atk:30,def:30,mov:3,cost:75,nt:'丘陵／山地移动成本降低1，进攻时该地形防御加成减半'},
 marine:{name:'海军陆战师',group:'徒步步兵',atk:30,def:30,mov:3,cost:75,nt:'免跨河额外移动消耗；跨河攻击保留90%，登陆攻击额外保留30个百分点'},
 ranger:{name:'游骑兵师',group:'徒步步兵',atk:30,def:30,mov:3,cost:75,nt:'森林移动成本降低1，进攻时森林防御加成减半'},
 airborne:{name:'伞兵师',group:'徒步步兵',atk:30,def:30,mov:3,cost:75,para:true,nt:'在机场登上运输机执行伞降'},
 cavalry:{name:'骑兵师',group:'机动步兵',atk:30,def:30,mov:4,cost:75},
 motorized:{name:'摩托化步兵师',group:'机动步兵',atk:34,def:34,mov:5,cost:90},
 mechanized:{name:'机械化步兵师',group:'机动步兵',atk:40,def:42,mov:6,cost:120}
 };
 const specials={de:{role:'motorized',name:'武装党卫军师'},su:{role:'infantry',name:'近卫军师'},uk:{role:'airborne',name:'皇家伞兵师'},fr:{role:'mountain',name:'山地猎兵师'},it:{role:'militia',name:'黑衫军'}};
 const equipment={};
 for(const ct of ['de','su','uk','fr','it','neutral']){
  equipment[ct]={};
  for(const [role,r]of Object.entries(roles))equipment[ct][role]=[1939,1941,1943].map((yr,tier)=>{
   const special=specials[ct]?.role===role;
   return {n:yr+'型'+(special?specials[ct].name:r.name),cls:'inf',infRole:role,tier,yr,atk:r.atk+tier*5+(special?3:0),def:r.def+tier*5+(special?3:0),mov:r.mov,cost:Math.round(r.cost*(1+.1*tier)),para:!!r.para,nt:(r.nt||'')+(special?'；国家特色替代：同价，攻击／防御各+3':''),group:r.group};
  });
 }
 root.GameData.modules.infantry={roles,specials,equipment};
})();
