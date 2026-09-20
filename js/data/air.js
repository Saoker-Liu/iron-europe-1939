/* Aircraft roles and representative WWII equipment. Unlocks/stats are game abstractions.
 * Historical references and role conversions: AIR_CATALOG.md. Legacy :air:0 keys are retained. */
(function(){
 const root=typeof window!=='undefined'?window:globalThis;
 const roles={
  fighter:{name:'轻型战斗机',atk:30,def:14,radius:6,cost:120,air:2.4,inf:.65,ground:.18,sea:.12,role:'机场制空，善于歼灭飞机；对步兵有限杀伤，对装甲和舰船效果很弱'},
  heavy:{name:'重型战斗机',atk:39,def:20,radius:9,cost:260,air:2.5,inf:.75,ground:.25,sea:.18,role:'更远航程、更强火力与防护的制空机型'},
  cas:{name:'近地支援机',atk:44,def:8,radius:7,cost:140,air:.12,inf:1.55,ground:1.65,sea:.35,role:'短程对地支援，擅长攻击步兵、装甲与炮兵，易遭战斗机杀伤'},
  naval:{name:'海军轰炸机',atk:42,def:11,radius:9,cost:160,air:.15,inf:.4,ground:.3,sea:2.1,role:'鱼雷／反舰与海上巡逻任务，专长攻击舰队及海运部队，可反潜'},
  tactical:{name:'战术轰炸机',atk:48,def:16,radius:10,cost:280,air:.18,inf:1.6,ground:1.5,sea:.55,role:'中程战术对地轰炸，比近地支援机航程远、防护强'},
  strategic:{name:'战略轰炸机',atk:65,def:30,radius:16,cost:480,air:.2,inf:1.9,ground:1.65,sea:.5,role:'远程重型对地轰炸；1945年核技术解锁后可执行核打击'},
  transport:{name:'运输机',atk:0,def:14,radius:12,cost:260,air:0,inf:0,ground:0,sea:0,role:'无攻击能力；装载一支伞兵并执行伞降或随队转场'},
 };
 // Entries: model, game unlock year, optional note. Repeated families denote distinct variants/roles.
 const models={
 de:{fighter:[['Bf 109 E',1939],['Fw 190 A',1941],['Bf 109 K',1944]],heavy:[['Bf 110 C',1939],['Ju 88 C',1940],['Me 410',1943]],cas:[['Ju 87 B 斯图卡',1939],['Hs 129 B',1942],['Ju 87 G',1943]],naval:[['He 115',1939],['Fw 200 C',1940],['Ju 88 A-17',1943]],tactical:[['He 111 H',1939],['Ju 88 A-4',1940],['Ju 188',1943]],strategic:[['He 177 A',1942]],transport:[['Ju 52/3m',1939],['Ju 252',1942],['Me 323',1942]]},
 uk:{fighter:[['飓风 Mk I',1939],['喷火 Mk V',1941],['喷火 Mk XIV',1944]],heavy:[['布伦海姆 Mk IF',1939],['英俊战士 Mk IF',1940],['蚊式 NF Mk II',1942]],cas:[['莱桑德',1939,'陆军协同／轻型对地任务概化'],['台风 Mk IB',1942],['暴风 Mk V',1944]],naval:[['剑鱼 Mk I',1939],['博福特 Mk I',1940],['英俊战士 TF Mk X',1943]],tactical:[['布伦海姆 Mk IV',1939],['波士顿 Mk III',1941,'美国A-20在英国服役型号'],['蚊式 B Mk IV',1942]],strategic:[['惠灵顿 Mk I',1939],['哈利法克斯 Mk I',1941],['兰开斯特 Mk I',1942]],transport:[['哈罗运输型',1939,'轰炸机改运输用途'],['达科他 Mk III',1942,'美国C-47在英国服役型号'],['约克',1943]]},
 us:{fighter:[['P-36 霍克',1939],['P-40 战鹰',1940],['P-51D 野马',1944]],heavy:[['P-38F 闪电',1942],['P-38J 闪电',1943],['P-61 黑寡妇',1944]],cas:[['A-17 诺马德',1939],['A-36 阿帕奇',1943],['P-47D 雷电',1943,'战斗轰炸任务配置']],naval:[['TBD 蹂躏者',1939],['SBD 无畏',1940],['TBF 复仇者',1942]],tactical:[['B-18 大刀',1939],['B-25 米切尔',1941],['B-26 掠夺者',1941]],strategic:[['B-17 空中堡垒',1939],['B-24 解放者',1941],['B-29 超级堡垒',1944]],transport:[['C-39',1939],['C-47 空中列车',1941],['C-46 突击队员',1942]]},
 su:{fighter:[['I-16',1939],['Yak-1',1940],['La-7',1944]],heavy:[['Pe-3',1941],['Pe-3bis',1942]],cas:[['I-153 对地型',1939,'战斗机对地任务配置'],['Il-2',1941],['Il-10',1945]],naval:[['DB-3T',1939],['Il-4T',1942],['A-20G 鱼雷型',1943,'租借法案进口，苏联海军航空兵改装']],tactical:[['SB-2',1939],['Pe-2',1941],['Tu-2',1942]],strategic:[['TB-3',1939],['Pe-8',1940],['Yer-2',1941,'双发远程轰炸机，按战略任务归类']],transport:[['TB-3 运输型',1939],['PS-84 / Li-2',1939,'DC-3许可生产家族；Li-2名称自1942年使用'],['C-47 租借型',1942]]},
 fr:{fighter:[['MS.406',1939],['D.520',1940],['喷火 Mk IX（自由法国）',1943,'进口／盟军援助']],heavy:[['Potez 630',1939],['Potez 631',1939]],cas:[['Breguet 691',1939],['Breguet 693',1940],['P-47D（自由法国）',1944,'进口／盟军援助，战斗轰炸用途']],naval:[['Latécoère 298',1939],['PV-1 Ventura（法国）',1944,'盟军援助，海上巡逻任务']],tactical:[['Bloch MB.210',1939],['LeO 451',1939],['B-26（自由法国）',1944,'进口／盟军援助']],strategic:[['Farman F.222',1939],['Farman F.223',1939],['Halifax（自由法国）',1944,'法国机组在英国皇家空军作战，按国家编成概化']],transport:[['Bloch MB.220',1939,'民用运输机军用征调'],['Potez 650',1939],['C-47（自由法国）',1944,'进口／盟军援助']]},
 it:{fighter:[['C.200 雷电',1939],['C.202 闪电',1941],['C.205 灰猎犬',1943]],heavy:[['Fiat CR.25',1941,'有限服役，侦察／护航任务概化'],['IMAM Ro.57',1943]],cas:[['Breda Ba.65',1939],['Ju 87 Picchiatello',1940,'德国进口'],['Breda Ba.88M',1943,'少量改装，作战影响有限']],naval:[['SM.79 鱼雷型',1940],['SM.84',1941],['SM.79bis',1943]],tactical:[['SM.79 轰炸型',1939],['Fiat BR.20',1939],['Cant Z.1007bis',1940]],strategic:[['Piaggio P.108B',1942]],transport:[['SM.73',1939],['SM.75',1939],['SM.82',1940]]},
 jp:{fighter:[['A5M 九六式舰战',1939],['A6M 零式舰战',1940],['Ki-84 疾风',1944]],heavy:[['Ki-45 屠龙',1942],['J1N1-S 月光',1943],['Ki-102',1944,'重型战斗／对地多用途家族']],cas:[['Ki-32 九八式轻轰',1939],['Ki-51 九九式袭击机',1940],['Ki-102乙',1944,'对地配置']],naval:[['B5N 九七式舰攻',1939],['D4Y 彗星',1942],['B6N 天山',1943]],tactical:[['Ki-21 九七式重轰',1939],['Ki-49 吞龙',1941],['Ki-67 飞龙',1944]],strategic:[['G3M 九六式陆攻',1939,'双发远程轰炸机，按战略任务归类'],['G4M 一式陆攻',1941,'双发远程轰炸机，按战略任务归类']],transport:[['Ki-34',1939],['Ki-57',1940],['L2D 零式运输机',1940,'DC-3许可生产']]},
 };
 const legacy={de:['cas',0],uk:['strategic',2],us:['strategic',0],su:['tactical',1],fr:['tactical',0],it:['tactical',0],neutral:['cas',0]};
 const equipment={};
 for(const ct of [...Object.keys(models),'neutral']){
  const entries=[];
  for(const [role,rule]of Object.entries(roles)){
   const list=ct==='neutral'?['基础型','改进型','先进型'].map((n,i)=>[n+rule.name,[1939,1942,1944][i],'通用游戏模板']):models[ct][role];
   list.forEach(([n,yr,note=''],tier)=>entries.push({n,cls:'air',airRole:role,tier,atk:role==='transport'?0:rule.atk+tier*8,def:rule.def+tier*5,mov:rule.radius+tier,cost:rule.cost+tier*Math.round(rule.cost*.10),yr,nt:note,role:rule.role}));
  }
  const old=legacy[ct];if(old){const i=entries.findIndex(e=>e.airRole===old[0]&&e.tier===old[1]);entries.unshift(...entries.splice(i,1));}
  equipment[ct]=entries;
 }
 root.GameData=root.GameData||{modules:{}};
 root.GameData.modules.air={roles,equipment,nuclear:{year:1945,cost:2000,splash:75,damage:20,duration:6},paratrooper:{n:'伞兵部队',cls:'inf',para:true,atk:29,def:26,mov:3,cost:100,yr:1939,nt:'可在机场登上运输机并执行伞降'}};
})();
