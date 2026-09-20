'use strict';
const assert=require('node:assert/strict');
const D=require('./js/data/load-node'),L=require('./js/ui/map-labels');
const M=D.MAP_META;
const names=z=>new Set(L.candidates(M,D.CITIES,z).map(l=>l.text));
const required=['比斯开湾','科西嘉岛','撒丁岛','西西里岛','马耳他岛','塞浦路斯','十二群岛','爱琴群岛','苏格兰','威尔士','北爱尔兰','白俄罗斯','乌克兰','卡累利阿','克里木半岛','北高加索','亚美尼亚','格鲁吉亚','阿塞拜疆','比萨拉比亚'];
assert.equal(new Set(M.labels.map(l=>l.name)).size,M.labels.length);
for(const name of required)assert(M.labels.some(l=>l.name===name),name+' geographic label');
for(const l of M.labels){
 assert([0,1,2].includes(l.level));
 const expected=D.Geography.geoToGrid(l.lon,l.lat);
 assert(expected.every((v,i)=>Math.abs(v-l.grid[i])<.000001),'shared projection: '+l.name);
}
for(const [z,expected]of [[.025,0],[.23999,0],[.24,1],[.64999,1],[.65,2],[1.29999,2],[1.3,3],[2.2,3]])assert.equal(L.tier(z,M),expected);
const overview=names(.12),regional=names(.4),local=names(1),all=names(2.2);
for(const n of ['苏联','乌克兰','白俄罗斯','北高加索']){
 assert(overview.has(n));assert(!regional.has(n)&&!local.has(n)&&!all.has(n),'parent hidden: '+n);
}
for(const n of ['克里木半岛','亚美尼亚','格鲁吉亚','阿塞拜疆','库班地区','巴库','塞瓦斯托波尔','罗斯托夫']){
 assert(regional.has(n),n+' intermediate level');assert(!overview.has(n));
 if(['巴库','塞瓦斯托波尔','罗斯托夫'].includes(n))assert(local.has(n),'major city remains visible');
 else assert(!local.has(n),'parent region exits');
}
for(const n of ['阿布哈兹地区','巴统','索契','刻赤']){
 assert(local.has(n));assert(!overview.has(n)&&!regional.has(n));
}
assert(!L.candidates(M,D.CITIES,.12).some(l=>l.kind==='city'));
assert(L.candidates(M,D.CITIES,2.2).every(l=>l.kind==='city'));
assert.equal(L.candidates(M,D.CITIES,2.2).length,436);
for(const ci of D.CITIES)assert(all.has(ci.n));
// Islands anchor to their actual geography, not loose text moved far offshore.
for(const [name,key]of [['科西嘉岛','ajaccio'],['撒丁岛','cagliari'],['西西里岛','palermo'],['马耳他岛','valletta'],['塞浦路斯','nicosia']]){
 const l=M.labels.find(l=>l.name===name),ci=D.CITIES.find(c=>c.k===key);
 const a=D.Geography.project(l.lon,l.lat),b=D.Geography.project(ci.lon,ci.lat);
 assert(Math.hypot(a[0]-b[0],a[1]-b[1])<150,name+' anchored on correct island');
}
// Eligible city sets grow monotonically across every label threshold.
let previous=new Set();
for(const z of [.12,.24,.4,.65,1,1.2999,1.3,1.6,2.2]){
 const current=new Set(L.candidates(M,D.CITIES,z).filter(l=>l.kind==='city').map(l=>l.id));
 for(const id of previous)assert(current.has(id),'zoom must retain '+id);
 previous=current;
}
assert.equal(L.candidates(M,D.CITIES,1.3).filter(l=>l.kind==='city').length,436);
const clicks=Math.log(2.2/1.3)/Math.log(1.12);
assert(clicks>=4&&clicks<=5,'all cities appear 4–5 wheel increments before maximum');
const measure=(s,size)=>s.length*size;
const crowded=Array.from({length:8},(_,i)=>({id:''+i,text:'示例城市'+i,kind:'city',grid:[4,4],priority:3,all:false}));
const view={z:.8,x:0,y:0,width:800,height:600};
const placed=L.layout(crowded,view,measure);
assert(placed.length<crowded.length,'lower zoom suppresses collisions');
for(let i=0;i<placed.length;i++)for(let j=0;j<i;j++){
 const a=placed[i].box,b=placed[j].box;
 assert(!(a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1]),'labels do not overlap');
}
assert.equal(L.layout(crowded.map(c=>({...c,required:true})),view,measure).length,8,'eligible city names are not lost to new label collisions');
assert.equal(L.layout(crowded,{...view,x:-10000},measure).length,0,'offscreen labels culled');
console.log('Labels: requested geography, exclusive zoom tiers, city coverage, projection and collision handling passed.');
