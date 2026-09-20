'use strict';
// Cartographic hierarchy, not additional states or administrative boundaries.
// Each name belongs to exactly one zoom band. Coordinates are WGS84 anchors.
module.exports=function labelData(G,N){
 const labels=[];
 function add(level,kind,entries){
  for(const [name,lon,lat]of entries)labels.push({name,lon,lat,grid:G.geoToGrid(lon,lat),level,kind});
 }
 const countries={de:[10,51.5],uk:[-2,53],fr:[2,46.7],es:[-3.2,39.6],pt:[-8,39.5],it:[12,43],su:[42,58],pl:[21.5,52.3],se:[16,63],no:[8,62],fi:[27,64],ro:[25,46],hu:[19,47],yu:[19,44],gr:[22,39],tr:[33,39],ie:[-8,53],dk:[9.2,56.3],ee:[25.5,58.6],lv:[25,57],lt:[23.7,55.5],bg:[25,42.5],is:[-19,65],ch:[8.2,46.8],be:[4.6,50.6],nl:[5.5,52.3],sk:[19.3,48.8],bm:[15.2,49.8],al:[20,41],lu:[6.13,49.61],dz:[18.65,54.35]};
 for(const [ct,p]of Object.entries(countries)){
  add(0,'country',[[ct==='bm'?'捷克保护国':ct==='al'?'阿尔巴尼亚':N.COUNTRIES[ct].name,...p]]);
  labels.at(-1).country=ct;
 }
 add(0,'sea',[
  ['大西洋',-15,48],['北海',3,57],['波罗的海',19,57],['地中海',8,37],
  ['黑海',34,43],['挪威海',0,66],['白海',37,65.5],['里海',50,43]
 ]);
 add(0,'region',[
  ['乌克兰',32.5,49],['白俄罗斯',29,54],['北高加索',43.2,44.5],
  ['斯堪的纳维亚',15,65],['安纳托利亚半岛',34.5,39],['伊比利亚半岛',-4,40.5],
  ['亚平宁半岛',13.2,42],['巴尔干半岛',22,42.8],['西欧平原',3,50.5],
  ['中欧平原',15.5,53.5],['东欧平原',43,55.5],['乌拉尔山脉',59,60],['波罗的海三国',25,56.6]
 ]);
 add(1,'sea',[
  ['比斯开湾',-5.5,45.3],['英吉利海峡',-2.5,49.6],['爱尔兰海',-5,53.7],
  ['波的尼亚湾',20,63],['芬兰湾',26,59.7],['亚得里亚海',16,42],
  ['爱琴海',24.2,38],['第勒尼安海',11.8,39.5],['爱奥尼亚海',18.5,37.5],
  ['亚速海',36.8,46.2],['拉多加湖',31.5,61],['奥涅加湖',35.4,61.8]
 ]);
 add(1,'island',[
  ['马略卡岛',2.95,39.65],['科西嘉岛',9.1,42.1],['撒丁岛',9,40],['西西里岛',14,37.6],
  ['马耳他岛',14.4,35.9],['塞浦路斯',33.2,35],['十二群岛',27.2,36.6],
  ['爱琴群岛',25.3,38.7],['克里特岛',24.8,35.2],['法罗群岛',-6.9,62.1],
  ['马恩岛',-4.5,54.2],['哥特兰岛',18.6,57.5],['奥兰群岛',20,60.2],
  ['博恩霍尔姆岛',14.95,55.15],['萨列马岛',22.4,58.4],['扬马延岛',-8.4,71]
 ]);
 add(1,'region',[
  ['苏格兰',-4.1,56.8],['威尔士',-3.7,52.3],['北爱尔兰',-6.6,54.7],['英格兰',-1.4,52.2],
  ['卡累利阿',31.8,63.5],['克里木半岛',34.1,45.25],['库班地区',38.9,45.2],
  ['亚美尼亚',44.7,40.2],['格鲁吉亚',43.5,42.1],['阿塞拜疆',47.6,40.5],['比萨拉比亚',28.7,47.2],
  ['诺曼底',-.7,49],['布列塔尼',-3,48.2],['普罗旺斯',6,44],['阿基坦',-.3,44.5],
  ['巴伐利亚',11.5,48.8],['西里西亚',16.9,50.7],['东普鲁士',21,54.5],
  ['加利西亚（西班牙）',-7.6,42.8],['巴斯克地区',-2.6,43.1],['加泰罗尼亚',1.5,41.8],['安达卢西亚',-4.5,37.5],
  ['拉普兰',25,67.6],['日德兰',9.2,56.5],['特兰西瓦尼亚',24,46.4],['达尔马提亚',16.7,43.5],
  ['奥克西塔尼亚',2,44],['加利西亚（东欧）',23,49.7],
  ['比利牛斯山脉',.5,42.7],['阿尔卑斯山脉',10,46.5],['奥地利',14,47.5],
  ['克罗地亚',16,45.5],['莱茵兰',7,50.5],
  ['伏尔加河流域',44,54],['波河平原',10.4,45],['伯罗奔尼撒',22,37.5]
 ]);
 add(2,'region',[
  ['阿布哈兹地区',41.1,43.2],['阿扎尔地区',41.9,41.7],['伊梅列季',42.9,42.4],
  ['卡赫季',45.7,41.7],['阿拉拉特平原',44.5,40],['阿布歇隆半岛',49.7,40.5],
  ['阿迪格地区',40,44.7],['车臣地区',45.7,43.2],['达吉斯坦',47.2,42.7],
  ['刻赤半岛',36.1,45.3],['克里木南岸',34.2,44.6],['卡累利阿地峡',29.7,60.6],
  ['顿河地区',40.7,47.6],['顿巴斯',38,48],['第聂伯河下游',33.5,47.1],['布贾克',29.1,45.9],
  ['苏格兰高地',-4.5,57.6],['康沃尔',-4.8,50.4],['南威尔士',-3.6,51.6],
  ['东安格利亚',.7,52.4],['菲英岛',10.35,55.35],['西兰岛',11.8,55.5],['鲁尔区',7,51.5],
  ['波西米亚',14.5,49.8],['摩拉维亚',17,49.3],['斯洛文尼亚',14.8,46.1],['多布罗加',28.3,44.5],
  ['下诺曼底',-1,48.8],['上诺曼底',1,49.5],['巴奇卡',19.4,45.9],['西巴纳特',20.5,45.4],
  ['提契诺',8.85,46.2],['弗留利',13.1,46.1],['萨伦托',18,40.1]
 ]);
 add(2,'sea',[
  ['墨西拿海峡',15.6,38.2],['博斯普鲁斯海峡',29.05,41.15],['达达尼尔海峡',26.45,40.2],
  ['刻赤海峡',36.55,45.2],['布里斯托尔湾',-4.3,51.35],['卡利亚里湾',9.15,39.1]
 ]);
 const primary=`london birm manch glasgow edinburgh paris lille bordeaux lyon marseille berlin hamburg cologne frankfurt munich breslau vienna prague konigsberg warsaw poznan krakow lwow rome milan turin naples palermo moscow leningrad gorky minsk kiev odessa sevast kharkov staling rostov madrid barca seville lisbon porto amsterdam rotterdam brussels antwerp stockholm goteborg oslo bergen copenhagen helsinki bern budapest bucharest belgrade sofia athens salonika istanbul ankara izmir murmansk arkhangelsk genoa venice liverpool bristol toulouse bremen kiel essen leipzig dresden lodz voronezh krasnodar novorossiysk baku tbilisi yerevan kazan kuibyshev zurich`.split(' ');
 const secondary=`stettin strasburg brest smolensk saratov astrakhan viipuri cluj chisinau uzhhorod kosice gdynia dover calais ajaccio cagliari heraklion valletta nicosia rhodes gibraltar zara trieste bologna florence ancona bari taranto messina catania cassino plymouth portsmouth newcastle hull sheffield aberdeen dunkirk caen cherbourg lehavre rouen saintlo rennes nantes orleans tours reims metz nancy dijon toulon grenoble sedan lubeck hanover dortmund nuremberg stuttgart kassel saarbrucken aachen innsbruck graz linz salzburg lublin brestlitovsk grodno bialystok katowice torun tula kursk orel bryansk rzhev velikiye_luki vitebsk mogilev gomel zhitomir dnepropetrovsk zaporozhye stalino narvik trondheim tromso turku tampere oulu malmo aarhus liege ghent bastogne arnhem eindhoven ploiesti constanta sarajevo split skopje ljubljana debrecen edirne trabzon bilbao valencia zaragoza brno pilsen fiume palma scapaflow ronne torshavn jersey janmayen douglas cardiff swansea nottingham leeds inverness cork galway acoruna murcia granada wilhelmshaven emden rostock visby karlskrona mariehamn plovdiv burgas ruse szeged pecs gyor timisoara oradea brasov iasi podgorica novisad petrovgrad batumi kutaisi grozny makhachkala ordzhonikidze sukhumi kerch sochi novgorod nikolaev cherkassy pskov petrozavodsk kalinin yaroslavl ryazan kuressaare tartu narva liepaja brunsbuettel livorno verona samsun konya erzurum geneva basel leuven namur thehague utrecht breda odense aalborg lulea umea gavle uppsala jonkoping linkoping norrkoping vaasa kuopio pori rovaniemi gaziantep malatya kastamonu bursa adana antalya kayseri sivas diyarbakir van stavanger kristiansand bodo alesund bydgoszcz czestochowa luck rowno pinsk tarnopol vologda ivanovo vyazma mariupol nice durres akureyri`.split(' ');
 const keys=new Set(N.CITIES.map(ci=>ci.k));
 for(const k of [...primary,...secondary])if(!keys.has(k))throw Error('Unknown label city: '+k);
 const cityLabelLevels=Object.fromEntries(N.CITIES.map(ci=>[ci.k,ci.cap||primary.includes(ci.k)?1:secondary.includes(ci.k)?2:3]));
 return {labels,cityLabelLevels,labelZooms:[.24,.65,2.2],labelRevision:2};
};
