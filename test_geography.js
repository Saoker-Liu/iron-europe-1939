'use strict';
const assert = require('node:assert/strict');
const D = require('./js/data/load-node');
const { Game, key, hexDist } = require('./js/engine/game');
const g = new Game('axis');
const geo = D.Geography;
function at(lon, lat) { return geo.geoToHex(lon, lat); }
function home(lon, lat) { return g.homeCountryOf(...at(lon, lat)); }
function route(a, b, ferry = false) {
  const q = [[...a, 0]], seen = new Set([key(...a)]);
  for (let i = 0; i < q.length; i++) {
    const [c, r, d] = q[i];
    if (c === b[0] && r === b[1]) return d;
    for (const p of [...g.landNeighbors(c, r), ...(ferry ? g.ferryDestinations(c, r) : [])]) {
      if (!seen.has(key(...p))) { seen.add(key(...p)); q.push([...p, d + 1]); }
    }
  }
  return Infinity;
}
const city = k => [g.cityByKey[k].x, g.cityByKey[k].y];

// Independent historical landmarks: pre-invasion borders, NOT post-war borders.
for (const [name, lon, lat, ct] of [
  ['Berlin',13.4,52.52,'de'], ['Vienna',16.37,48.21,'de'],
  ['Prague protectorate',14.44,50.08,'bm'], ['Bratislava',17.11,48.15,'sk'],
  ['Kosice Vienna Award',21.26,48.72,'hu'], ['Ruthenia',22.3,48.62,'hu'],
  ['Lwow',24.03,49.84,'pl'], ['Wilno',25.28,54.69,'pl'],
  ['Memel',21.14,55.7,'de'], ['Karelian isthmus',28.75,60.71,'fi'],
  ['Petseri',27.61,57.81,'ee'], ['Bessarabia',28.84,47.01,'ro'],
  ['Transylvania',23.59,46.77,'ro'], ['Southern Dobruja',27.83,43.57,'ro'],
  ['Corsica',9.15,42.2,'fr'], ['Sardinia',9,40,'it'],
  ['Northern Ireland',-6.7,54.8,'uk'], ['Ireland',-8,53,'ie'],
]) assert.equal(home(lon,lat),ct,name);
assert.equal(g.cityByKey.danzig.ct,'dz');
assert.equal(g.cityByKey.gdynia.ct,'pl');
assert(g.cityByKey.gdynia.y < g.cityByKey.danzig.y,'Gdynia north of Danzig');
assert(g.cityByKey.ankara.cap && !g.cityByKey.istanbul.cap,'Turkey capital Ankara');
assert.equal(g.cf.it,'neutral'); assert.equal(g.cf.al,'neutral');
assert.equal(g.cf.sk,'axis'); assert.equal(g.cf.bm,'axis');

// City expansion: requested ports and battle locations are playable city objects.
assert.equal(D.CITIES.length,436);
assert(D.CITIES.length>400,'regional expansion exceeds 400 cities');
assert.equal(new Set(D.CITIES.map(ci=>ci.k)).size,D.CITIES.length,'unique city keys');
for (const [k,ct] of Object.entries({genoa:'it',venice:'it',zara:'it',liverpool:'uk',dunkirk:'fr',caen:'fr',cherbourg:'fr',saintlo:'fr',split:'yu',brestlitovsk:'pl'})) {
  assert.equal(g.cityByKey[k].ct,ct,k+' 1939 owner');
  assert.equal(g.cityAt(...city(k)).k,k,k+' usable city');
}
assert.equal(home(15.2314,44.1194),'it','Zara Italian enclave');
assert(g.landNeighbors(...city('zara')).some(p=>g.homeCountryOf(...p)==='yu'),'Zara coastal enclave has Yugoslav land boundary');
assert(g.cityByKey.dunkirk.x>g.cityByKey.calais.x && g.cityByKey.dunkirk.y<g.cityByKey.lille.y,'Dunkirk east of Calais and north of Lille');
assert(g.neighbors(...city('dunkirk')).some(p=>g.tile(...p)==='~'),'Dunkirk coastal port');
assert(!g.landNeighbors(...city('cherbourg')).some(p=>g.homeCountryOf(...p)==='uk'),'Cherbourg separated from Channel Islands');
assert.equal(g.cities.filter(ci=>ci.region==='诺曼底').length,5);
assert(!g.cityByKey.normandy,'Normandy is a region, not a fictional city');
for (const [ct,budget] of Object.entries(D.ECONOMY.countryIncomeBudget)) {
  assert.equal(g.cities.filter(ci=>ci.ct===ct).reduce((sum,ci)=>sum+ci.inc,0),budget,ct+' income budget');
}
assert(g.cities.every(ci=>Number.isInteger(ci.inc)&&ci.inc>0),'all cities have positive income');

// v8: all 24 specifically requested regional centres, without changing capitals.
for(const [ct,keys]of Object.entries({
 ch:['zurich','geneva','basel'],be:['leuven','namur'],nl:['thehague','utrecht','breda'],
 dk:['odense','aalborg'],se:['lulea','umea','gavle','uppsala','jonkoping','linkoping','norrkoping'],
 fi:['vaasa','kuopio','pori'],tr:['gaziantep','malatya','kastamonu','bursa']
}))for(const k of keys){
 const ci=g.cityByKey[k];assert(ci,k+' present');assert.equal(ci.ct,ct,k+' 1939 nationality');
 assert.equal(g.cityAt(...city(k)).k,k,k+' independent playable cell');
 assert(ci.region&&ci.major,k+' regional search and prominent label');
}
assert(g.cityByKey.amsterdam.cap&&!g.cityByKey.thehague.cap,'Dutch seat of government is not the capital');
assert(g.cityByKey.bern.cap&&!g.cityByKey.zurich.cap&&!g.cityByKey.geneva.cap,'Swiss capital remains Bern');
assert.deepEqual(city('geneva'),at(6.1432,46.2044),'Geneva retained at southwest border');
assert(g.cityByKey.geneva.x<g.cityByKey.lausanne.x&&g.cityByKey.geneva.y>g.cityByKey.lausanne.y,'Geneva southwest of Lausanne');
const displayedLon=k=>geo.hexToGeo(...city(k))[0];
assert(displayedLon('thehague')<displayedLon('utrecht'),'The Hague stays west of Utrecht');
assert(g.cityByKey.thehague.y<g.cityByKey.rotterdam.y,'The Hague north of Rotterdam');
assert(g.cityByKey.breda.y>g.cityByKey.rotterdam.y,'Breda south of Rotterdam');
assert(g.cityByKey.maastricht.y>g.cityByKey.eindhoven.y,'southern Limburg represented');
assert.equal(g.homeCountryOf(...city('liege')),'be','Limburg correction preserves Liege');
assert.deepEqual(city('odense'),at(10.3883,55.4038),'Odense on Funen');
assert.equal(route(city('odense'),city('copenhagen')),Infinity,'Funen and Zealand separated by water');
assert(Number.isFinite(route(city('odense'),city('copenhagen'),true)),'Odense has ferry access');
for(const k of ['luck','rowno','pinsk','tarnopol'])assert.equal(g.cityByKey[k].ct,'pl','eastern Polish border in August 1939');
assert.equal(g.cityByKey.olomouc.ct,'bm');
assert.equal(route(city('reggiocalabria'),city('messina')),Infinity,'new port does not bridge Strait of Messina');
assert(Number.isFinite(route(city('reggiocalabria'),city('messina'),true)));
assert(new Set(g.cities.map(ci=>key(ci.x,ci.y))).size===g.cities.length,'no city shares a cell');

// Small strategic ports/bases must stay on their islands and retain 1939 owners.
for(const [k,ct,lon,lat] of [
 ['fiume','it',14.4422,45.3271],['palma','es',2.6502,39.5696],
 ['scapaflow','uk',-3.191,58.835],['ronne','dk',14.706,55.101],
 ['torshavn','dk',-6.7716,62.0079],['jersey','uk',-2.1045,49.1838],
 ['janmayen','no',-8.5,70.98]
]) {
 assert.equal(g.cityByKey[k].ct,ct,k+' 1939 owner');
 assert.deepEqual(city(k),at(lon,lat),k+' stays on intended island/enclave');
 assert(g.neighbors(...city(k)).some(p=>g.tile(...p)==='~'),k+' coastal access');
 assert(D.MAP_META.routes.some(rt=>rt.cities.includes(k)),k+' supply connection');
}
assert.equal(g.homeCountryOf(67,52),'de','East Prussian coastal gap must not inherit modern Russian ownership');
for(let r=0;r<D.MAP_H;r++)for(let c=0;c<D.MAP_W;c++) {
 const [lon,lat]=geo.hexToGeo(c,r);
 if(lon>19&&lon<23&&lat>54&&lat<56) assert.notEqual(g.homeCountryOf(c,r),'su','no Soviet enclave beside Königsberg');
}
assert(g.landNeighbors(...city('fiume')).some(p=>g.homeCountryOf(...p)==='yu'),'Fiume has Yugoslav land boundary');
for(const [a,b]of [['palma','barca'],['scapaflow','aberdeen'],['ronne','copenhagen'],['torshavn','scapaflow'],['jersey','portsmouth'],['jersey','cherbourg'],['janmayen','tromso']]) {
 assert.equal(route(city(a),city(b)),Infinity,a+' is separated by sea from '+b);
 assert(Number.isFinite(route(city(a),city(b),true)),a+' usable sea transport to '+b);
}

// Projection round trips and bounds; local error is limited to hex discretisation.
// v7: named 1939 places, including a separate Novgorod rather than modern Nizhny Novgorod.
for(const k of ['sukhumi','kerch','sochi','novgorod','kazan','nikolaev','cherkassy','pskov','tikhvin','petrozavodsk','kalinin','yaroslavl','ryazan','tambov','penza','kuibyshev','ulyanovsk','kirov','vinnytsia','poltava','sumy','kherson','kremenchug','simferopol','maikop'])
 assert.equal(g.cityByKey[k].ct,'su',k+' 1939 USSR');
assert.equal(g.cities.filter(ci=>ci.ct==='su').length,74);
assert.equal(g.cityByKey.gorky.n,'高尔基');
assert(hexDist(...city('novgorod'),...city('gorky'))>15,'two different Novgorods');
for(const [k,ct]of Object.entries({kuressaare:'ee',tartu:'ee',narva:'ee',liepaja:'lv',daugavpils:'lv',siauliai:'lt'}))
 assert.equal(g.cityByKey[k].ct,ct,k+' independent Baltic state in August 1939');
assert.deepEqual(city('kuressaare'),at(22.485,58.252),'Kuressaare on Saaremaa');
assert(g.cityByKey.kuressaare.mapLabel.includes('萨列马岛'));
assert.equal(route(city('kuressaare'),city('tallinn')),Infinity,'Saaremaa has no mainland land bridge');
assert(Number.isFinite(route(city('kuressaare'),city('tallinn'),true)),'Saaremaa sea transport');
// Kerch must be on the Crimean shore. The existing strait stays impassable on foot.
assert.equal(g.homeCountryOf(...city('kerch')),'su');
assert(g.cityByKey.kerch.lon>36&&g.cityByKey.kerch.lon<36.6);
assert(geo.hexToGeo(...city('kerch'))[0]<36.5,'Kerch rendered on the western/Crimean side of the strait');
const kerchOpposite=at(36.78,45.35);
assert(route(city('kerch'),kerchOpposite)>20,'no shortcut from Kerch to Taman across the strait');
const canal=D.MAP_META.canals.find(c=>c.k==='kielcanal');
assert(canal && canal.name==='基尔运河' && canal.historicName==='威廉皇帝运河');
assert.deepEqual(canal.endpoints,['brunsbuettel','kiel']);
assert.deepEqual(canal.coordinates[0],[9.143,53.897],'western lock on Elbe estuary');
assert.deepEqual(canal.coordinates.at(-1),[10.143,54.369],'eastern lock at Holtenau');
let canalLength=0;
for(let i=0;i<canal.coordinates.length;i++){
 const [lon,lat]=canal.coordinates[i];
 assert(lon>9&&lon<10.2&&lat>53.85&&lat<54.4,'canal in Schleswig-Holstein');
 assert(canal.path[i].every((v,j)=>Math.abs(v-geo.geoToGrid(lon,lat)[j])<.000001),'canal projection');
 if(i){const a=geo.project(...canal.coordinates[i-1]),b=geo.project(lon,lat);canalLength+=Math.hypot(a[0]-b[0],a[1]-b[1]);}
}
assert(canalLength>85&&canalLength<105,'generalised canal length about 99 km');
assert.equal(g.cityByKey.brunsbuettel.ct,'de');
assert(route(city('flensburg'),city('hamburg'))<10,'canal bridges preserve German land routes');

// Regional expansion uses the 1939 border even where later wartime annexations differ.
for(const [ct,keys]of Object.entries({
 uk:['douglas','cardiff','swansea','nottingham','leeds','southampton','exeter','inverness','norwich'],
 ie:['cork','galway','limerick','waterford'],
 es:['acoruna','vigo','bilbao','murcia','cartagena','granada','malaga','alicante','oviedo','santander','burgos','valladolid','salamanca','cordoba'],
 de:['wilhelmshaven','emden','rostock','magdeburg','erfurt','regensburg'],
 se:['visby','karlskrona'],fi:['mariehamn'],bg:['plovdiv','burgas','ruse'],
 hu:['szeged','pecs','gyor','miskolc'],
 ro:['timisoara','arad','oradea','brasov','sibiu','iasi','galati','craiova'],
 yu:['podgorica','novisad','subotica','petrovgrad','nis','banjaluka','osijek','dubrovnik'],
 su:['yerevan','batumi','tbilisi','baku','kutaisi','grozny','makhachkala','ordzhonikidze']
}))for(const k of keys)assert.equal(g.cityByKey[k].ct,ct,k+' 1939 country');
for(const k of ['douglas','visby','mariehamn']) {
 const ci=g.cityByKey[k];assert.deepEqual(city(k),at(ci.lon,ci.lat),k+' island position');
 assert.equal(route(city(k),city('berlin')),Infinity,k+' separated from mainland');
 assert(Number.isFinite(route(city(k),city('berlin'),true)),k+' reachable by sea');
}
assert(g.cityByKey.ronne.mapLabel.includes('博恩霍尔姆'));
assert(!D.MAP_META.labels.some(l=>l.name==='博恩霍尔姆岛'),'no displaced floating Bornholm label');
assert(g.cityByKey.bilbao.major && g.cityByKey.bilbao.region==='巴斯克');
assert.equal(g.cityByKey.petrovgrad.n,'彼得罗夫格勒','pre-1946 city name');
for(const k of ['yerevan','tbilisi','baku'])assert(!g.cityByKey[k].cap,'republic capital does not trigger USSR capitulation');
// The apparent island SW of Plymouth is Cornwall: restore land connectivity.
assert.equal(home(-5.28,50.06),'uk');
assert(Number.isFinite(route(at(-5.28,50.06),city('london'))),'Cornwall peninsula connected to Britain');
assert.deepEqual(city('plymouth'),at(-4.1427,50.3755),'Plymouth at its actual coastal hex');
assert(route(city('cardiff'),city('bristol'))>1,'no walking directly across the Severn estuary');
// A port must touch water connected to the Atlantic, not an enclosed sea-coloured hole.
const ocean=new Set(['0,50']),waterQueue=[[0,50]];
for(let i=0;i<waterQueue.length;i++)for(const p of g.neighbors(...waterQueue[i]))
 if(g.tile(...p)==='~'&&!ocean.has(key(...p))){ocean.add(key(...p));waterQueue.push(p);}
for(const k of ['bristol','plymouth','cardiff','swansea','douglas','visby','mariehamn','wilhelmshaven','emden'])
 assert(g.neighbors(...city(k)).some(p=>ocean.has(key(...p))),k+' open sea access');
// Åland keeps Finnish sovereignty and a civilian port; neither player nor AI may recruit there.
const alandGame=new Game('axis'),aland=alandGame.cityByKey.mariehamn;
assert(aland.demilitarized);assert(!alandGame.unitAt(aland.x,aland.y));
aland.owner='axis';alandGame.gold.axis=1000;
assert.equal(alandGame.recruit('mariehamn','neutral:inf:0'),null);
assert.equal(alandGame.gold.axis,1000,'demilitarisation rejection does not charge money');
assert(Game.deserialize(alandGame.serialize()).cityByKey.mariehamn.demilitarized,'status survives save/load');

for(let r=0;r<D.MAP_H;r+=7)for(let c=0;c<D.MAP_W;c+=7)
  assert.deepEqual(at(...geo.hexToGeo(c,r)),[c,r]);
for(const ci of D.CITIES) {
  assert(g.landPassable(ci.x,ci.y),ci.k+' on passable land');
  assert.equal(g.homeCountryOf(ci.x,ci.y),ci.ct,ci.k+' national border');
  const a=geo.project(ci.lon,ci.lat),b=geo.project(...geo.hexToGeo(ci.x,ci.y));
  assert(Math.hypot(a[0]-b[0],a[1]-b[1]) < 60,ci.k+' displacement');
}
for(const u of D.INITIAL_UNITS) assert.equal(g.homeCountryOf(u.x,u.y),u.ct,'deployment '+u.ct);
assert(g.cityByKey.staling.x < D.MAP_W-10,'Stalingrad east-bank room');
const counts={};for(const r of D.MAP_ROWS)for(const t of r)counts[t]=(counts[t]||0)+1;
assert(counts['.']>counts.f && counts.m>250 && counts.l>10,'terrain diversity');
assert(!counts['='],'no artificial shallows');

// Test intended geography rather than the obsolete "all cities walkable" condition.
for(const [a,b]of [['london','paris'],['belfast','glasgow'],['palermo','rome'],['ajaccio','marseille'],['cagliari','rome'],['copenhagen','hamburg'],['heraklion','athens']]) {
  assert.equal(route(city(a),city(b)),Infinity,a+' must not have a land bridge');
  assert(Number.isFinite(route(city(a),city(b),true)),a+' explicit transport');
}
assert(route(city('sevast'),city('kiev')) < 25,'Crimea through Perekop');
for(const ci of D.CITIES) assert(Number.isFinite(route(city('berlin'),[ci.x,ci.y],true)),ci.k+' transport reachability');
for(const p of D.MAP_META.landingCells) {
  assert.equal(g.homeCountryOf(...p),'fr');
  assert(g.neighbors(...p).some(n=>g.tile(...n)==='~'),'Normandy beach');
}
assert(D.MAP_META.landingCells.length>=3);
assert(D.MAP_META.riverEdges.length>100,'real river crossings');

// Capture may never redraw the national boundary or absorb another country.
const borderBefore=home(25.28,54.69);
g.captureCity(g.cityByKey.minsk,'axis');
assert.equal(home(25.28,54.69),borderBefore);
assert.equal(g.territoryOwner(...city('wilno')),'west');

// Air can fly over water but cannot end on it; land units must purchase sea transport.
g.units=[];
const [dc,dr]=city('dover'),[cc,cr]=city('calais');
g.cityByKey.dover.owner='axis';g.cityByKey.calais.owner='axis';
const tank=g.spawnUnit('de','de:tank:0',dc,dr,{});
g.gold.axis=0;
assert(!g.moveRange(tank).cost.has(key(cc,cr)),'no free land crossing');
g.gold.axis=100;
assert(g.moveRange(tank).cost.has(key(cc,cr)),'port sea transport available');
g.moveUnit(tank,cc,cr);
assert.equal(g.gold.axis,75);assert(tank.attacked&&tank.moved);
g.units=[];
const air=g.spawnUnit('de','de:air:0',dc,dr,{});
assert(g.moveRange(air).cost.has(key(cc,cr)),'air crosses Channel');
for(const k of g.moveRange(air).cost.keys())assert(g.landPassable(...k.split(',').map(Number)));

// A narrow strait remains a water barrier even when its shores occupy adjacent hexes.
g.units=[];
const [shoreA,shoreB]=D.MAP_META.blockedEdges[0].split('|').map(s=>s.split(',').map(Number));
const infantry=g.spawnUnit('de','de:inf:0',...shoreA,{});
const defender=g.spawnUnit('uk','uk:inf:0',...shoreB,{});
assert(!g.targetsOf(infantry).includes(defender),'no melee across a strait');
g.units=g.units.filter(u=>u!==infantry);
const artillery=g.spawnUnit('de','de:art:0',...shoreA,{});
assert(g.targetsOf(artillery).includes(defender),'artillery can fire over water');
assert.equal(g.attack(artillery,defender).counter,0,'no infantry counterattack over water');
assert.throws(()=>Game.deserialize(JSON.stringify({v:2})),/旧地图/);
assert.throws(()=>Game.deserialize(JSON.stringify({v:3,mapVersion:'europe-1939-geographic-v3'})),/旧地图/);
assert.throws(()=>Game.deserialize(JSON.stringify({v:3,mapVersion:'europe-1939-geographic-v4'})),/旧地图/);
assert.throws(()=>Game.deserialize(JSON.stringify({v:3,mapVersion:'europe-1939-geographic-v5'})),/旧地图/);
assert.throws(()=>Game.deserialize(JSON.stringify({v:3,mapVersion:'europe-1939-geographic-v6'})),/旧地图/);
assert.throws(()=>Game.deserialize(JSON.stringify({v:3,mapVersion:'europe-1939-geographic-v7'})),/旧地图/);
assert.equal(Game.deserialize(g.serialize()).units.length,g.units.length);
console.log('Geography: historical checkpoints, projection, coastline, transport, river and save tests passed.');
