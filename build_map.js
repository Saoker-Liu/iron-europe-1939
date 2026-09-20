'use strict';
/* Reproducible offline geography builder. See MAP_NOTES.md for provenance,
 * snapshot date and the 45 km generalisation limit. No network needed. */
const fs = require('fs'), path = require('path');
const {assignCells}=require('./map-placement');
const G = require('./js/core/geography.js');
require('./js/core/hex.js'); require('./js/data/nations.js'); require('./js/data/military.js');
const N = globalThis.GameData.modules.nations, military = globalThis.GameData.modules.military;
const { width: W, height: H } = G.spec;
const read = n => JSON.parse(fs.readFileSync(path.join(__dirname, 'map_sources', n + '.geojson'), 'utf8'));
const modern = read('countries'), historic = read('countries1938');
const countryCodes = {
 'Germany':'de','Austria':'de','United Kingdom':'uk','Ireland':'ie','France':'fr','Spain':'es',
 'Portugal':'pt','Belgium':'be','Netherlands':'nl','Luxembourg':'lu','Switzerland':'ch',
 'Italy':'it','Poland':'pl','Czechoslovakia':'cz','Hungary':'hu','Romania':'ro',
 'Yugoslavia':'yu','Albania':'al','Greece':'gr','Bulgaria':'bg','Turkey':'tr',
 'USSR':'su','Estonia':'ee','Latvia':'lv','Lithuania':'lt','Finland':'fi',
 'Sweden':'se','Norway':'no','Denmark':'dk','Iceland':'is'
};
function rings(geometry) { return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : []; }
function bbox(ring) { return ring.reduce((b,p)=>[Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]); }
function inRing([x,y], ring) {
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
  const a=ring[i],b=ring[j];
  if((a[1]>y)!==(b[1]>y) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside;
}
function indexed(features, code) {
 return features.flatMap(f=>rings(f.geometry).map(poly=>({poly,box:bbox(poly[0]),ct:code(f)})))
  .filter(p=>p.box[2]>-30&&p.box[0]<65&&p.box[3]>32&&p.box[1]<74);
}
function hit(p, polys) { return polys.find(o=>p[0]>=o.box[0]&&p[0]<=o.box[2]&&p[1]>=o.box[1]&&p[1]<=o.box[3]&&inRing(p,o.poly[0])&&!o.poly.slice(1).some(h=>inRing(p,h))); }
const coasts=indexed(modern.features, f=>f.properties.ADMIN);
const borders=indexed(historic.features.filter(f=>countryCodes[f.properties.NAME]),f=>countryCodes[f.properties.NAME]);
const czechModern=indexed(modern.features.filter(f=>f.properties.ADMIN==='Czechia'),()=> 'bm');
const slovakModern=indexed(modern.features.filter(f=>f.properties.ADMIN==='Slovakia'),()=> 'sk');
const austriaModern=indexed(modern.features.filter(f=>f.properties.ADMIN==='Austria'),()=> 'de');
// Small annexations and the 1939 Czech/Slovak partition are explicitly generalised.
// These control areas only apply inside the relevant historical country polygon.
const slovakSouth=[[16.8,47.7],[18.8,47.7],[20.5,48.0],[22.5,48.3],[22.5,48.75],[21.2,48.8],[20.65,48.55],[20.0,48.4],[19.25,48.23],[18.7,48.2],[18.45,48.25],[17.95,48.17],[17.3,48.05],[16.8,47.7]];
const protectorate=[[12.65,49.25],[13.0,49.65],[13.15,50.1],[13.65,50.3],[14.2,50.55],[14.8,50.65],[15.5,50.4],[16.2,50.2],[16.6,49.8],[17.35,49.6],[18.35,49.6],[18.3,49.05],[17.3,48.8],[16.3,48.8],[15.7,49.0],[15.1,48.75],[14.5,48.8],[13.8,49.0],[12.65,49.25]];
const memel=[[20.9,55.0],[22.1,55.0],[22.45,55.3],[21.65,55.9],[21.05,55.9],[20.9,55.0]];
const danzig=[[18.1,54.1],[18.35,54.45],[18.85,54.45],[19.45,54.35],[19.35,54.1],[18.65,53.9],[18.1,54.1]];
function countryAt(lon,lat,modernName) {
 const alias={'Republic of Serbia':'Serbia','Aland':'Finland','Jersey':'United Kingdom','Guernsey':'United Kingdom','Isle of Man':'United Kingdom'};
 modernName=alias[modernName]||modernName;
 const p=[lon,lat]; let ct=hit(p,borders)?.ct;
 const europeanNames=new Set([...Object.keys(countryCodes),'Russia','Ukraine','Belarus','Moldova','Georgia','Armenia','Azerbaijan','Kazakhstan','Czechia','Slovakia','Croatia','Slovenia','Serbia','Bosnia and Herzegovina','Montenegro','Kosovo','North Macedonia','Cyprus','Northern Cyprus','Akrotiri Sovereign Base Area','Dhekelia Sovereign Base Area','Malta','Gibraltar','Faroe Islands']);
 if(!europeanNames.has(modernName))return 'xx';
 if(modernName==='Faroe Islands')return 'dk';
 if(modernName==='Kazakhstan')return 'su';
 // The historical world file contains stray 1920-era Aegean/Caucasus polygons.
 // Use the stable physical/country outline here, then apply 1939 exceptions below.
 if(modernName==='Turkey')ct='tr';
 if(modernName==='Greece')ct='gr';
 if(['Georgia','Armenia','Azerbaijan'].includes(modernName))ct='su';
 if(hit(p,austriaModern))ct='de';
 if(ct==='cz') {
  if(hit(p,czechModern))ct=inRing(p,protectorate)?'bm':'de';
  else if(hit(p,slovakModern))ct=inRing(p,slovakSouth)||lon>22.15?'hu':'sk';
  else ct='hu'; // Carpathian Ruthenia, occupied by Hungary in March 1939.
 }
 if(ct==='lt'&&inRing(p,memel))ct='de';
 if((ct==='de'||ct==='pl')&&inRing(p,[[17.3,53.3],[17.2,54.0],[17.7,54.45],[18.1,54.85],[18.6,54.7],[18.55,54.45],[18.1,54.1],[18.65,53.9],[18.8,53.6],[19.4,53.4],[18.6,53.05],[17.3,53.3]]))ct='pl';
 if((ct==='de'||ct==='pl')&&inRing(p,danzig))ct='dz';
 // Southern Dobruja remained Romanian until September 1940.
 if(modernName==='Bulgaria'&&inRing(p,[[26.55,44.15],[27.1,43.95],[28.6,43.75],[28.65,43.4],[27.8,43.35],[27.2,43.65],[26.55,44.15]]))ct='ro';
 // Italian Dodecanese, British Cyprus/Malta/Gibraltar. Do not inherit today's owners.
 if(lon>26.2&&lon<29.8&&lat>35.5&&lat<37.6&&modernName==='Greece')ct='it';
 if(modernName==='Cyprus'||modernName==='Northern Cyprus'||modernName==='Akrotiri Sovereign Base Area'||modernName==='Dhekelia Sovereign Base Area')ct='uk';
 if(modernName==='Malta'||modernName==='Gibraltar')ct='uk';
 if(modernName==='Iceland')ct='is';
 // The modern Kaliningrad exclave was East Prussia in 1939. Its modern coast
 // extends beyond the historical polygon; never fill those coastal gaps as USSR.
 if(modernName==='Russia'&&lon>19&&lon<23&&lat>54&&lat<56)ct='de';
 if(modernName==='Russia'&&!ct)ct='su';
 // Modern coast polygons occasionally extend beyond the coarser historical coast.
 if(!ct) {
  const alias={Russia:'su',Ukraine:'su',Belarus:'su',Georgia:'su',Armenia:'su',Azerbaijan:'su',Moldova:'ro',Czechia:'bm',Slovakia:'sk',Croatia:'yu',Slovenia:'yu',Serbia:'yu','Bosnia and Herzegovina':'yu',Montenegro:'yu',Kosovo:'yu','North Macedonia':'yu'};
  ct=countryCodes[modernName]||alias[modernName]||'xx';
 }
 return ct;
}
const naturalLakeNames=/Ladoga|Onega|Peipus|Vänern|Vättern|Saimaa|Inari|Oulujärvi|Päijänne|Pielinen|Imandra|Beloye|Ilmen|Geneva|Léman|Constance|Balaton|Van$|Beyşehir|Tuz|Prespa|Ohrid|Scutari/i;
const lakes=indexed(read('lakes').features.filter(f=>naturalLakeNames.test(f.properties.name||'')),()=>null);
const mountains=[
 ['斯堪的纳维亚山脉',65,[[6,59],[7,61],[9,63],[12,65],[15,67],[19,69],[23,70]]],
 ['苏格兰高地',38,[[-5.3,56.5],[-4.8,57.4],[-4.5,58.2]]],
 ['比利牛斯山脉',32,[[-1.6,43.1],[0,42.8],[1.4,42.65],[2.6,42.45]]],
 ['坎塔布连山脉',32,[[-7,43.0],[-5,43.15],[-3,43.05]]],
 ['伊比利亚山脉',30,[[-3.1,42.0],[-2.1,40.6],[-.8,40.0]]],
 ['中央山系',30,[[-6.4,40.4],[-4.8,40.5],[-3.6,41.0]]],
 ['贝蒂科山脉',40,[[-5.4,36.7],[-3.5,37.1],[-2.4,37.3]]],
 ['阿尔卑斯山脉',55,[[6.4,44.0],[6.8,45.1],[7.5,46],[9.1,46.6],[11.3,47],[13.0,46.8],[14.4,46.5]]],
 ['亚平宁山脉',30,[[8.5,44.4],[10.4,44.2],[12.3,43.3],[13.5,42.2],[14.6,41],[16.0,39.6]]],
 ['喀尔巴阡山脉',38,[[17.8,49],[19.6,49.2],[21.6,49.0],[23.9,48.0],[25.8,47.1],[26.2,45.5],[24.5,45.4],[22.6,45.2]]],
 ['迪纳拉山脉',35,[[14.5,45.5],[16.0,44.5],[17.8,43.7],[19.1,42.7],[20.1,41.2]]],
 ['品都斯山脉',30,[[20.2,40.5],[21.1,39.5],[22.1,38.6],[22.3,37.5]]],
 ['巴尔干山脉',28,[[22.6,43.3],[24.5,42.8],[26.8,42.8]]],
 ['罗多彼山脉',35,[[23.3,42],[24.5,41.7],[25.5,41.4]]],
 ['高加索山脉',55,[[39.5,44.2],[41.5,43.3],[43.5,42.7],[45.4,42.1],[47.7,41.2]]],
 ['托罗斯山脉',45,[[29.5,36.7],[31.3,37.4],[33.2,37.1],[35,37.8],[37.2,38.2]]],
 ['本都山脉',35,[[31.4,41.0],[34,41.2],[37,40.6],[40,40.5]]],
 ['乌拉尔山脉',45,[[59,52],[59.1,55],[59.3,58],[59.4,61],[60,64],[62,67]]]
];
const hills=[
 [45,[[-4,52],[-3.3,53],[-2.2,54.2]]], [50,[[2.4,44.3],[3,45.2],[3.2,46.2]]],
 [30,[[6.8,47.6],[7,48.5]]],[35,[[8.2,47.8],[8.3,48.7]]],
 [50,[[7.5,50],[9,51],[10.5,51.5],[12.1,50.2]]], [35,[[13,49],[14.3,48.7]]],
 [35,[[15.5,50.5],[17,50.1]]], [55,[[30,58],[33,57],[34,55.5]]],
 [65,[[30,49],[29,48],[28.5,47]]], [55,[[44.5,53],[45,51],[44,49.5]]]
];
const forests=[
 [[-7,60],[5,60],[5,72],[35,72],[40,63],[38,59],[31,57],[25,57],[20,55],[13,55],[9,57],[-7,60]],
 [[28,59],[38,59],[40,63],[56,68],[65,65],[65,55],[50,54],[40,54],[31,55],[28,59]],
 [[23,53],[28,53],[31,52],[30,51],[25,51],[23,53]],
 [[4.5,50.4],[6.4,50.5],[6.6,49.4],[5.1,49.5],[4.5,50.4]],
 [[-.9,45.2],[-.8,43.7],[.2,44],[.2,45],[-.9,45.2]],
 [[12.4,49.5],[13.4,50.1],[14.2,49.1],[13.4,48.6],[12.4,49.5]]
];
function segmentDistance(p,a,b) {
 const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));
 return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);
}
const ranges=mountains.map(([name,width,line])=>({name,width,line:line.map(p=>G.project(...p))}));
const hillRanges=hills.map(([width,line])=>({width,line:line.map(p=>G.project(...p))}));
function near(p,o) { return o.line.slice(1).some((b,i)=>segmentDistance(p,o.line[i],b)<o.width); }
function terrainAt(p) {
 const xy=G.project(...p);
 if(ranges.some(o=>near(xy,o)))return 'm';
 if(hillRanges.some(o=>near(xy,o)))return 'h';
 if(forests.some(r=>inRing(p,r)))return 'f';
 // Scattered central European woodland; deterministic and geographically bounded.
 if(p[0]>7&&p[0]<24&&p[1]>48&&p[1]<55 && Math.sin(p[0]*2.7)+Math.cos(p[1]*3.1)>1.05)return 'f';
 return '.';
}
const rows=Array.from({length:H},()=>Array(W).fill('~'));
const homes=Array.from({length:H},()=>Array(W).fill(null));
for(let r=0;r<H;r++)for(let c=0;c<W;c++) {
 const p=G.hexToGeo(c,r), land=hit(p,coasts);
 if(!land)continue;
 // IJsselmeer: do not show post-war Flevoland reclamations in 1939.
 if(p[0]>5.15&&p[0]<5.85&&p[1]>52.3&&p[1]<52.8&&!hit(p,borders))continue;
 if(hit(p,lakes)){ rows[r][c]='l';continue; }
 const ct=countryAt(...p,land.ct);homes[r][c]=ct;
 rows[r][c]=ct==='xx'?'x':terrainAt(p);
}
const inMap=(c,r)=>c>=0&&r>=0&&c<W&&r<H;
const neigh=(c,r)=>[[1,0],[-1,0],[r&1?1:0,-1],[r&1?0:-1,-1],[r&1?1:0,1],[r&1?0:-1,1]].map(([x,y])=>[x+c,y+r]).filter(p=>inMap(...p));
const landAt=(c,r)=>inMap(c,r)&&homes[r][c]&&homes[r][c]!=='xx';
const edgeKey=(a,b)=>[a.join(','),b.join(',')].sort().join('|');
// At 45 km resolution Cres otherwise fills the entire Kvarner Gulf and encloses
// Fiume inland. Prioritise the gulf's navigable water over this sub-grid island.
const kvarner=G.geoToHex(14.45,44.95);
rows[kvarner[1]][kvarner[0]]='~';homes[kvarner[1]][kvarner[0]]=null;
// Cornwall is a continuous peninsula. Centre-only sampling severed its narrow
// neck and left the Lizard as a fictitious offshore island.
for(const [a,b]of [[[-5.55,50.12],[-4.7,50.4]],[[-4.7,50.4],[-3.8,50.65]]])
 for(const [c,r]of lineHexes(a,b)){rows[r][c]='.';homes[r][c]='uk';}
// Preserve the Bristol Channel and Severn/Avon estuary at sub-grid scale.
// This opens the formerly enclosed water hex west of Bristol to the Atlantic.
for(const [c,r]of lineHexes([-4.2,51.35],[-3.15,51.43])){rows[r][c]='~';homes[r][c]=null;}
// Retain tiny but strategically relevant islands and states at one-hex resolution.
// Only these explicit anchors can promote a sea cell to land; never arbitrary units.
const anchors={valletta:'uk',gibraltar:'uk',luxembourg:'lu',danzig:'dz',rhodes:'it',bratislava:'sk',kosice:'hu',zara:'it',dunkirk:'fr',fiume:'it',scapaflow:'uk',ronne:'dk',torshavn:'dk',jersey:'uk',janmayen:'no',douglas:'uk',visby:'se',mariehamn:'fi',plymouth:'uk',kuressaare:'ee',brunsbuettel:'de',geneva:'ch',thehague:'nl',odense:'dk'};
const anchorLocations=Object.fromEntries(N.CITIES.filter(ci=>anchors[ci.k]).map(ci=>[ci.k,G.geoToHex(ci.lon,ci.lat)]));
// Southern Dutch Limburg is narrower than one cell. Preserve a connected cell
// north of Maastricht rather than overwrite Liege's cell or move it 69 km away.
anchorLocations.maastricht=G.geoToHex(5.7,51.1);
anchors.maastricht='nl';
for(const ci of N.CITIES.filter(ci=>anchors[ci.k])){
 const [c,r]=anchorLocations[ci.k];rows[r][c]='.';homes[r][c]=ci.ct;
}
const cityLocations={},used=new Set();
for(const [k,p]of Object.entries(anchorLocations)){
 if(used.has(p.join(',')))throw Error('Overlapping city anchors: '+k);
 cityLocations[k]=p;used.add(p.join(','));
}
for(const ct of [...new Set(N.CITIES.map(ci=>ci.ct))].sort()){
 const cities=N.CITIES.filter(ci=>ci.ct===ct&&!cityLocations[ci.k]).sort((a,b)=>a.k<b.k?-1:1);
 const targets=cities.map(ci=>G.project(ci.lon,ci.lat)),cells=[];
 for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(homes[r][c]===ct&&!used.has(c+','+r)){
  const xy=G.project(...G.hexToGeo(c,r));
  if(targets.some(p=>Math.hypot(p[0]-xy[0],p[1]-xy[1])<60))
   cells.push({p:[c,r],xy,coastal:neigh(c,r).some(([x,y])=>rows[y][x]==='~')});
 }
 const costs=cities.map((ci,i)=>cells.map(cell=>{
  const d=Math.hypot(targets[i][0]-cell.xy[0],targets[i][1]-cell.xy[1]);
  return d<60&&(!ci.port||cell.coastal)?Math.round(d*d*1000):Infinity;
 }));
 let assigned;try{assigned=assignCells(costs);}catch(e){throw Error(ct+' city placement: '+e.message);}
 assigned.forEach((j,i)=>{const p=cells[j].p;cityLocations[cities[i].k]=p;used.add(p.join(','));});
}
// Perekop is narrower than a hex: preserve its genuine north-south land connection.
function lineHexes(a,b) {
 const p=G.project(...a),q=G.project(...b),n=Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1])/8),out=[];
 for(let i=0;i<=n;i++){const h=G.geoToHex(...G.unproject(p[0]+(q[0]-p[0])*i/n,p[1]+(q[1]-p[1])*i/n));if(inMap(...h)&&!out.some(v=>v.join(',')===h.join(',')))out.push(h);}return out;
}
for(const [c,r]of lineHexes([33.7,46.35],[33.9,45.7])){rows[r][c]='.';homes[r][c]='su';}
// Explicit sea cuts prevent sub-grid straits from becoming walkable land bridges.
const cuts=[
 ['多佛尔海峡',[.7,50.65],[2.15,51.5]],
 ['墨西拿海峡',[15.4,38.45],[15.85,37.8]],
 ['博斯普鲁斯海峡',[29.12,41.3],[28.99,40.95]],
 ['达达尼尔海峡',[26.1,40.0],[26.8,40.5]],
 ['厄勒海峡',[12.55,55.35],[12.65,56.15]],
 ['大贝尔特海峡',[10.85,54.7],[11.05,55.85]],
 ['小贝尔特海峡',[9.65,54.9],[9.8,55.6]],
 ['刻赤海峡',[36.45,45.5],[36.6,45.0]],
 ['彭特兰海峡',[-3.7,58.78],[-2.75,58.7]],
 ['塞文河口',[-3.25,51.35],[-2.6,51.62]],
 ['直布罗陀海峡',[-6,35.95],[-5.1,35.95]]
];
function crosses(a,b,c,d) {const cross=(p,q,s)=>(q[0]-p[0])*(s[1]-p[1])-(q[1]-p[1])*(s[0]-p[0]);return cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0;}
const blockedEdges=[];
for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(landAt(c,r))for(const p of neigh(c,r))if(landAt(...p)&&r*W+c<p[1]*W+p[0]){
 const a=G.project(...G.hexToGeo(c,r)),b=G.project(...G.hexToGeo(...p));
 const cts=[homes[r][c],homes[p[1]][p[0]]];
 if((cts.includes('dk')&&cts.includes('se'))||(cts.includes('uk')&&cts.includes('fr'))||cuts.some(([,s,t])=>crosses(a,b,G.project(...s),G.project(...t))))blockedEdges.push(edgeKey([c,r],p));
}
// City placement must not connect Malta / Rhodes / Gibraltar across open water.
for(const k of ['valletta','rhodes','ronne','torshavn','jersey','janmayen','douglas','mariehamn']){
 const p=cityLocations[k];for(const q of neigh(...p))if(landAt(...q)&&Math.hypot(...G.project(...G.hexToGeo(...q)).map((v,i)=>v-G.project(N.CITIES.find(c=>c.k===k).lon,N.CITIES.find(c=>c.k===k).lat)[i]))>35)blockedEdges.push(edgeKey(p,q));
}
// Sea transport now uses purchased vessels and adjacent ocean cells.
// Geographic remapping of old deployments, constrained to their own 1939 country.
const occupied=new Set(used), deployments=[];
for(const d of military.INITIAL_UNITS) {
 const ct=d.ct; const lon=d.lon??(d.x-24)/2,lat=d.lat??66.5-d.y/2;const target=G.project(lon,lat);
 let best,bd=Infinity;
 for(let r=0;r<H;r++)for(let c=0;c<W;c++){
  if(homes[r][c]!==ct||occupied.has(c+','+r))continue;
  const p=G.project(...G.hexToGeo(c,r)),dist=Math.hypot(p[0]-target[0],p[1]-target[1]);
  if(dist<bd){bd=dist;best=[c,r];}
 }
 if(!best)throw Error('No deployment land for '+ct);
 occupied.add(best.join(','));deployments.push({...d,x:best[0],y:best[1]});
}
for(const ct of ['sk','lu','dz']){
 const ci=N.CITIES.find(ci=>ci.ct===ct),p=cityLocations[ci.k];
 const spot=neigh(...p).find(v=>homes[v[1]][v[0]]===ct&&!occupied.has(v.join(',')))||p;
 if(deployments.some(d=>d.x===spot[0]&&d.y===spot[1]))continue;
 deployments.push({ct,eq:'neutral:inf:0',x:spot[0],y:spot[1]});occupied.add(spot.join(','));
}
const riverNames={Rhine:'莱茵河',Danube:'多瑙河',Seine:'塞纳河',Loire:'卢瓦尔河',Rhone:'罗讷河',Po:'波河',Elbe:'易北河',Oder:'奥得河',Vistula:'维斯瓦河',Dnieper:'第聂伯河',Don:'顿河',Volga:'伏尔加河',Dniester:'德涅斯特河',Daugava:'西德维纳河',Dvina:'西德维纳河',Tagus:'塔霍河',Douro:'杜罗河',Ebro:'埃布罗河',Dnepr:'第聂伯河'};
const rivers=read('rivers').features.filter(f=>riverNames[f.properties.name]).flatMap(f=>{
 const lines=f.geometry.type==='MultiLineString'?f.geometry.coordinates:[f.geometry.coordinates];
 return lines.map(line=>({name:riverNames[f.properties.name],path:line.map(p=>G.geoToGrid(...p).map(v=>+v.toFixed(3))),geographic:true}));
});
// Sub-grid artificial waterway, NOT a one-hex-wide sea trench. Existing bridges
// and ferries are abstracted by normal land movement. See MAP_NOTES.md for source.
const canalCoordinates=[[9.143,53.897],[9.174,53.921],[9.213,53.939],
 [9.283,54.003],[9.293,54.023],[9.328,54.057],[9.331,54.098],
 [9.387,54.143],[9.483,54.167],[9.551,54.198],[9.602,54.248],
 [9.664,54.288],[9.682,54.313],[9.754,54.336],[9.824,54.367],
 [9.897,54.349],[9.963,54.345],[10.044,54.372],[10.143,54.369]];
const canals=[{k:'kielcanal',name:'基尔运河',historicName:'威廉皇帝运河',
 coordinates:canalCoordinates,path:canalCoordinates.map(p=>G.geoToGrid(...p)),
 labelAnchor:G.geoToGrid(9.664,54.288),labelOffset:[-4,-2.4],
 endpoints:['brunsbuettel','kiel'],opened:1895,expanded:1914}];
const riverEdges = new Set();
for(const river of rivers)for(let i=1;i<river.path.length;i++) {
 const a=river.path[i-1],b=river.path[i];
 for(let r=Math.max(0,Math.floor(Math.min(a[1],b[1]))-1);r<=Math.min(H-1,Math.ceil(Math.max(a[1],b[1]))+1);r++)
 for(let c=Math.max(0,Math.floor(Math.min(a[0],b[0]))-1);c<=Math.min(W-1,Math.ceil(Math.max(a[0],b[0]))+1);c++) {
  if(!landAt(c,r))continue;
  for(const [x,y] of neigh(c,r))if(landAt(x,y)&&crosses([c+.5*(r&1),r],[x+.5*(y&1),y],a,b))riverEdges.add(edgeKey([c,r],[x,y]));
 }
}
const landingCells=[];
for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(homes[r][c]==='fr'){
 const [lon,lat]=G.hexToGeo(c,r);
 if(lon>=-1.8&&lon<=.3&&lat>=49.05&&lat<=49.65&&neigh(c,r).some(([x,y])=>rows[y][x]==='~'))landingCells.push([c,r]);
}
const labelData=require('./map-label-data')(G,N);
const map={...G.spec,rows:rows.map(r=>r.join('')),homes,cityLocations,deployments,rivers,canals,riverEdges:[...riverEdges],blockedEdges:[...new Set(blockedEdges)],landingCells,...labelData,land:[],shallows:[]};
// Quantise projection metadata so V8/libm rounding differences across OS/Node versions do not change generated bytes.
const mapJSON=JSON.stringify(map,(_key,value)=>typeof value==='number'&&!Number.isInteger(value)?Number(value.toFixed(6)):value);
const output='/* Generated by node build_map.js --write. Sources and limitations: MAP_NOTES.md. */\n(function(){const root=typeof window!==\'undefined\'?window:globalThis;root.GameData=root.GameData||{modules:{}};root.GameData.modules.map='+mapJSON+';})();\n';
if(process.argv.includes('--write'))fs.writeFileSync(path.join(__dirname,'js/data/map.js'),output);
else if(process.argv.includes('--check')) {if(fs.readFileSync(path.join(__dirname,'js/data/map.js'),'utf8').replace(/\r\n/g,'\n')!==output)throw Error('Generated map out of date');}
else console.log(output);
const totals={};for(const row of rows)for(const t of row)totals[t]=(totals[t]||0)+1;
console.error(JSON.stringify({grid:[W,H],terrain:totals,cities:N.CITIES.length,units:deployments.length,coastalLandingCells:landingCells.length,blockedEdges:map.blockedEdges.length}));
