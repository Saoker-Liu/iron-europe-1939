/* =========================================================================
 * i18n-en-mil: military-domain English dictionary + data mutators.
 * Loaded after i18n-en.js / i18n-en-geo.js. Chinese stays the data source;
 * I18N.translateData() applies the onData mutators once after assemble.
 * ========================================================================= */
(function(){
'use strict';
/* EN dictionary: military domain (classes, equipment, air/naval models, events). */
I18N.add({
  /* ---- unit classes ---- */
  '步兵': 'Infantry', '炮兵': 'Artillery', '装甲': 'Armour', '空军': 'Air unit',
  '防空炮': 'Anti-Aircraft Gun', '反坦克炮': 'Anti-Tank Gun', '野战炮': 'Field Gun', '火箭炮': 'Rocket Launcher',
  '潜艇': 'Submarine', '驱逐舰': 'Destroyer', '轻巡洋舰': 'Light Cruiser', '重巡洋舰': 'Heavy Cruiser',
  '战列巡洋舰': 'Battlecruiser', '战列舰': 'Battleship', '护航／轻型航母': 'Escort/Light Carrier', '航空母舰': 'Aircraft Carrier',
  '护航航母': 'Escort Carrier',

  /* ---- economy (construction/transport names are data-mutated) ---- */
  '工厂': ' Factory', '机场': 'Airfield', '港口': 'Port',
  '运输船': 'Transport Ship', '两栖运输舰': 'Amphibious Transport', '两栖突击舰': 'Assault Amphibious Ship',

  /* ---- naval passages ---- */
  '直布罗陀海峡': 'Strait of Gibraltar', '达达尼尔海峡': 'Dardanelles', '博斯普鲁斯海峡': 'Bosphorus',

  /* ---- ship-name source notes ---- */
  '用户指定游戏拟名；H级舰名未正式确定': 'Player-designated game name; H-class names were never formally fixed',
  '用户指定游戏拟名；并非已确定的二战H级舰名': 'Player-designated game name; not a confirmed WWII H-class name',
  '塞德利茨号航母改装方案；与原舰共享名称额度': 'Carrier conversion of Seydlitz; shares a name quota with the original hull',
  '战前30型开工，战后以30K型完工': 'Laid down prewar as Type 30, completed postwar as Type 30K',

  /* ---- naval class role descriptions ---- */
  '鱼雷攻击海上目标；惧怕驱逐舰与护航航母。': 'Torpedo attacks at sea; fears destroyers and escort carriers.',
  '高速护航、反潜；可近岸支援。': 'Fast escort and anti-submarine; can support near shore.',
  '防空与反驱逐舰，兼顾岸轰。': 'Anti-air and anti-destroyer, plus shore bombardment.',
  '中坚水面舰，善于对舰与岸轰。': 'Backbone surface combatant, strong vs ships and ashore.',
  '包括大型巡洋舰；高速重火力，装甲弱于战列舰。': 'Includes large cruisers; fast and heavily armed, weaker armour than battleships.',
  '重装甲、远程舰炮；无法有效反潜。': 'Heavy armour, long-range guns; cannot hunt submarines effectively.',
  '舰载机反潜和护航；无独立舰载机棋子。': 'Carrier aircraft for ASW and escort; no separate air unit piece.',
  '舰载机远程对舰及对地攻击；需护航保护。': 'Long-range carrier strikes vs ships and land; needs escort.',
  '通用游戏型号，无对应史实舰级': 'Generic game type, no historical class',

  /* ---- air role descriptions ---- */
  '机场制空，善于歼灭飞机；对步兵有限杀伤，对装甲和舰船效果很弱': 'Airfield air superiority, excels at killing planes; limited vs infantry, very weak vs armour and ships',
  '更远航程、更强火力与防护的制空机型': 'Air superiority with longer range, more firepower and protection',
  '短程对地支援，擅长攻击步兵、装甲与炮兵，易遭战斗机杀伤': 'Short-range ground support, strong vs infantry, armour and artillery; vulnerable to fighters',
  '鱼雷／反舰与海上巡逻任务，专长攻击舰队及海运部队，可反潜': 'Torpedo/anti-ship and maritime patrol; hunts fleets and sea transport, can spot submarines',
  '中程战术对地轰炸，比近地支援机航程远、防护强': 'Medium-range tactical bombing; longer legs and better protection than CAS',
  '远程重型对地轰炸；1945年核技术解锁后可执行核打击': 'Long-range heavy bombing; delivers nuclear strikes once 1945 nuclear tech unlocks',
  '无攻击能力；装载一支伞兵并执行伞降或随队转场': 'No attack; carries one paratrooper unit for airdrop or ferry flights',
  '通用游戏模板': 'Generic game template',

  /* ---- infantry role-composed names (yr + 型 + name) ---- */
  '1939型普通民兵': '1939 Militia', '1941型普通民兵': '1941 Militia', '1943型普通民兵': '1943 Militia',
  '1939型卫戍部队': '1939 Garrison', '1941型卫戍部队': '1941 Garrison', '1943型卫戍部队': '1943 Garrison',
  '1939型非正规步兵': '1939 Irregular Infantry', '1941型非正规步兵': '1941 Irregular Infantry', '1943型非正规步兵': '1943 Irregular Infantry',
  '1939型普通步兵师': '1939 Infantry Division', '1941型普通步兵师': '1941 Infantry Division', '1943型普通步兵师': '1943 Infantry Division',
  '1939型山地步兵师': '1939 Mountain Division', '1941型山地步兵师': '1941 Mountain Division', '1943型山地步兵师': '1943 Mountain Division',
  '1939型海军陆战师': '1939 Marine Division', '1941型海军陆战师': '1941 Marine Division', '1943型海军陆战师': '1943 Marine Division',
  '1939型游骑兵师': '1939 Ranger Division', '1941型游骑兵师': '1941 Ranger Division', '1943型游骑兵师': '1943 Ranger Division',
  '1939型伞兵师': '1939 Paratrooper Division', '1941型伞兵师': '1941 Paratrooper Division', '1943型伞兵师': '1943 Paratrooper Division',
  '1939型骑兵师': '1939 Cavalry Division', '1941型骑兵师': '1941 Cavalry Division', '1943型骑兵师': '1943 Cavalry Division',
  '1939型摩托化步兵师': '1939 Motorized Division', '1941型摩托化步兵师': '1941 Motorized Division', '1943型摩托化步兵师': '1943 Motorized Division',
  '1939型机械化步兵师': '1939 Mechanized Division', '1941型机械化步兵师': '1941 Mechanized Division', '1943型机械化步兵师': '1943 Mechanized Division',
  '1939型武装党卫军师': '1939 Waffen-SS Division', '1941型武装党卫军师': '1941 Waffen-SS Division', '1943型武装党卫军师': '1943 Waffen-SS Division',
  '1939型近卫军师': '1939 Guards Division', '1941型近卫军师': '1941 Guards Division', '1943型近卫军师': '1943 Guards Division',
  '1939型皇家伞兵师': '1939 Royal Paratrooper Division', '1941型皇家伞兵师': '1941 Royal Paratrooper Division', '1943型皇家伞兵师': '1943 Royal Paratrooper Division',
  '1939型山地猎兵师': '1939 Mountain Jaeger Division', '1941型山地猎兵师': '1941 Mountain Jaeger Division', '1943型山地猎兵师': '1943 Mountain Jaeger Division',
  '1939型黑衫军': '1939 Blackshirts', '1941型黑衫军': '1941 Blackshirts', '1943型黑衫军': '1943 Blackshirts',

  /* ---- artillery / armor role-composed names ---- */
  '1939型炮兵': '1939 Artillery', '1941型炮兵': '1941 Artillery', '1943型炮兵': '1943 Artillery',
  '1939型防空炮': '1939 Anti-Aircraft Gun', '1941型防空炮': '1941 Anti-Aircraft Gun', '1943型防空炮': '1943 Anti-Aircraft Gun',
  '1939型反坦克炮': '1939 Anti-Tank Gun', '1941型反坦克炮': '1941 Anti-Tank Gun', '1943型反坦克炮': '1943 Anti-Tank Gun',
  '1939型野战炮': '1939 Field Gun', '1941型野战炮': '1941 Field Gun', '1943型野战炮': '1943 Field Gun',
  '1939型火箭炮': '1939 Rocket Launcher', '1941型火箭炮': '1941 Rocket Launcher', '1943型火箭炮': '1943 Rocket Launcher',
  '1939型88mm防空炮': '1939 88mm AA Gun', '1941型88mm防空炮': '1941 88mm AA Gun', '1943型88mm防空炮': '1943 88mm AA Gun',
  '1939型山地榴弹炮': '1939 Mountain Howitzer', '1941型山地榴弹炮': '1941 Mountain Howitzer', '1943型山地榴弹炮': '1943 Mountain Howitzer',
  '1939型施耐德野战炮': '1939 Schneider Field Gun', '1941型施耐德野战炮': '1941 Schneider Field Gun', '1943型施耐德野战炮': '1943 Schneider Field Gun',
  '1939型6磅反坦克炮': '1939 6-pounder Anti-Tank Gun', '1941型6磅反坦克炮': '1941 6-pounder Anti-Tank Gun', '1943型6磅反坦克炮': '1943 6-pounder Anti-Tank Gun',
  '1939型喀秋莎火箭炮': '1939 Katyusha Rocket Launcher', '1941型喀秋莎火箭炮': '1941 Katyusha Rocket Launcher', '1943型喀秋莎火箭炮': '1943 Katyusha Rocket Launcher',
  '1939型装甲车': '1939 Armoured Car', '1941型装甲车': '1941 Armoured Car', '1943型装甲车': '1943 Armoured Car',
  '1939型轻型坦克': '1939 Light Tank', '1941型轻型坦克': '1941 Light Tank', '1943型轻型坦克': '1943 Light Tank',
  '1939型中型坦克': '1939 Medium Tank', '1941型中型坦克': '1941 Medium Tank', '1943型中型坦克': '1943 Medium Tank',
  '1939型重型坦克': '1939 Heavy Tank', '1941型重型坦克': '1941 Heavy Tank', '1943型重型坦克': '1943 Heavy Tank',
  '1939型超重型坦克': '1939 Super-heavy Tank', '1941型超重型坦克': '1941 Super-heavy Tank', '1943型超重型坦克': '1943 Super-heavy Tank',
  '1939型潘哈德装甲车': '1939 Panhard Armoured Car', '1941型潘哈德装甲车': '1941 Panhard Armoured Car', '1943型潘哈德装甲车': '1943 Panhard Armoured Car',
  '1939型L6轻型坦克': '1939 L6 Light Tank', '1941型L6轻型坦克': '1941 L6 Light Tank', '1943型L6轻型坦克': '1943 L6 Light Tank',
  '1939型萤火虫坦克': '1939 Firefly Tank', '1941型萤火虫坦克': '1941 Firefly Tank', '1943型萤火虫坦克': '1943 Firefly Tank',
  '1939型T-34坦克': '1939 T-34 Tank', '1941型T-34坦克': '1941 T-34 Tank', '1943型T-34坦克': '1943 T-34 Tank',
  '1939型虎式坦克': '1939 Tiger Tank', '1941型虎式坦克': '1941 Tiger Tank', '1943型虎式坦克': '1943 Tiger Tank',

  /* ---- shared unit notes ---- */
  '丘陵／山地移动成本降低1，进攻时该地形防御加成减半': 'Moves 1 cheaper in hills/mountains; halved terrain defence bonus when attacking there',
  '免跨河额外移动消耗；跨河攻击保留90%，登陆攻击额外保留30个百分点': 'No river-crossing move cost; keeps 90% when attacking across rivers, +30 points when storming ashore',
  '森林移动成本降低1，进攻时森林防御加成减半': 'Moves 1 cheaper in forest; halved forest defence bonus when attacking there',
  '在机场登上运输机执行伞降': 'Boards transports at airfields for airborne drops',
  '；国家特色替代：同价，攻击／防御各+3': '; national special: same cost, +3 attack/+3 defence',
  '在机场登上运输机执行伞降；国家特色替代：同价，攻击／防御各+3': 'Boards transports at airfields for airborne drops; national special: same cost, +3 attack/+3 defence',
  '丘陵／山地移动成本降低1，进攻时该地形防御加成减半；国家特色替代：同价，攻击／防御各+3': 'Moves 1 cheaper in hills/mountains, halved terrain defence bonus when attacking; national special: same cost, +3 attack/+3 defence',
  '对装甲伤害降低': 'Reduced damage vs armour',
  '本格与邻格友军空袭伤害降低50%；最强一支防空炮拦截反击，不叠加': 'Air-strike damage to this and adjacent friendly hexes cut 50%; strongest AA gun intercepts counterattacks, no stacking',
  '对装甲增伤，对非装甲效果较弱': 'Bonus damage vs armour, weaker vs soft targets',
  '射程3格；可在射程内反击': 'Range 3; can counterattack within range',
  '攻击目标后方相邻、距发射者更远的格子，对其中敌方地面单位造成40%溅射伤害': 'Hits hexes behind the target, farther from the shooter, splashing 40% damage onto enemy ground units there',
  '对装甲伤害降低；意大利特色：山地移动成本降低1，山地作战攻击+15%': 'Reduced damage vs armour; Italian special: moves 1 cheaper in mountains, +15% attack in mountain combat',
  '本格与邻格友军空袭伤害降低50%；最强一支防空炮拦截反击，不叠加；德国特色：对装甲明显增伤': 'Air-strike damage cut 50% here and on adjacent friendlies; strongest AA intercepts, no stacking; German special: clearly bonus damage vs armour',
  '射程3格；可在射程内反击；法国特色：反击系数110%（普通炮兵55%）': 'Range 3, counterattacks in range; French special: counter coefficient 110% (regular artillery 55%)',
  '对装甲增伤，对非装甲效果较弱；英国特色：进一步强化反装甲、削弱对非装甲伤害': 'Bonus vs armour, weaker vs soft targets; British special: even stronger anti-armour, further reduced vs soft targets',
  '攻击目标后方相邻、距发射者更远的格子，对其中敌方地面单位造成65%溅射伤害；苏联特色': 'Splashes 65% damage onto enemy ground units in hexes behind the target; Soviet special',
  '法国特色：对未登船步兵攻击+30%': 'French special: +30% attack vs unembarked infantry',
  '意大利特色：移动力+1': 'Italian special: +1 movement',
  '英国特色：对陆上装甲与机械化步兵攻击+35%': 'British special: +35% attack vs land armour and mechanized infantry',
  '苏联特色：己方城市每回合恢复35兵力，己方境内20，敌方境内10；海运与核污染中不恢复': 'Soviet special: recovers 35 strength per turn in own cities, 20 at home, 10 abroad; no recovery at sea or in nuclear fallout',
  '德国特色：防御+8，反击系数80%（通用55%）': 'German special: +8 defence, counter coefficient 80% (generic 55%)',

  /* ---- original 1939 equipment tree ---- */
  '国防军步兵师': 'Wehrmacht Infantry Division', '毛瑟98k / MG34': 'Mauser 98k / MG34',
  '武装党卫军师': 'Waffen-SS Division', '精锐狂热部队': 'Fanatical elite',
  '105mm leFH18 榴弹炮': '10.5cm leFH 18 Howitzer', '德军师属标准火炮': 'Standard German divisional gun',
  '88mm FlaK36 高射炮': '8.8cm FlaK 36 AA Gun', '反一切之炮': 'The anti-everything gun',
  '古斯塔夫列车炮': 'Schwerer Gustav Railway Gun', '800mm 塞瓦斯托波尔攻坚神器': '800mm siege engine of Sevastopol',
  'III号坦克': 'Panzer III', '闪击战主力': 'Blitzkrieg workhorse',
  'IV号坦克 F2 型': 'Panzer IV F2', '长身管 75mm': 'Long-barrelled 75mm',
  '虎式重型坦克': 'Tiger Heavy Tank', '88mm KwK36': '88mm KwK 36',
  '斯图卡俯冲轰炸机': 'Ju 87 Stuka', '尖啸死神': 'The screeching death',
  '步兵师': 'Infantry Division', '波波沙 / 莫辛纳甘': 'PPSh-41 / Mosin-Nagant',
  '近卫步兵师': 'Guards Infantry Division', '斯大林格勒淬炼': 'Tempered at Stalingrad',
  '76mm ZiS-3 加农炮': '76mm ZiS-3 Gun', '百搭师炮': 'The all-purpose divisional gun',
  '喀秋莎火箭炮': 'Katyusha Rocket Launcher', 'BM-13 火风暴': 'BM-13 firestorm',
  'T-34/76 坦克': 'T-34/76', '倾斜装甲革命': 'Sloped-armour revolution',
  'T-34/85 坦克': 'T-34/85', '85mm 反虎利器': '85mm Tiger-killer',
  'Pe-2 轰炸机': 'Pe-2 Bomber', '俯冲轰炸先锋': 'Dive-bombing pioneer',
  '英联邦步兵师': 'Commonwealth Infantry Division', '李恩菲尔德步枪': 'Lee-Enfield rifle',
  '25磅野战炮': '25-pounder Field Gun', '射速见长': 'Known for its rate of fire',
  '玛蒂尔达 II 步兵坦克': 'Matilda II Infantry Tank', '装甲厚重的移动堡垒': 'Heavily armoured moving fortress',
  '克伦威尔巡洋坦克': 'Cromwell Cruiser Tank', '高速突击': 'High-speed assault',
  '兰开斯特轰炸机': 'Lancaster Bomber', '夜间区域轰炸': 'Night area bombing',
  '法国步兵师': 'French Infantry Division', '马奇诺防线守备': 'Maginot Line garrison',
  '75mm 1897 野战炮': '75mm Modele 1897 Field Gun', '一战传奇速射炮': 'Legendary WWI rapid-fire gun',
  '索玛 S35 坦克': 'Somua S35', '铸造炮塔先驱': 'Cast-turret pioneer',
  'B1 重型坦克': 'Char B1 Heavy Tank', '钢铁怪物': 'Iron monster',
  '布洛克 MB.210 轰炸机': 'Bloch MB.210 Bomber', '法军主力轰炸机': 'Mainstay French bomber',
  '波兰步兵师': 'Polish Infantry Division', '骑兵反冲锋': 'Cavalry countercharges',
  '波兰射炮兵营': 'Polish Artillery Battalion', '1930 式加农炮': 'Model 1930 gun',
  '7TP 轻型坦克': '7TP Light Tank', '首个柴油发动机坦克': 'First diesel-engined tank',
  '意大利步兵师': 'Italian Infantry Division', '卡尔卡诺步枪': 'Carcano rifle',
  '75mm 山地炮': '75mm Mountain Gun', '阿尔卑斯山地作战': 'Alpine warfare',
  'M13/40 中型坦克': 'M13/40 Medium Tank', '薄装甲': 'Thin armour',
  'SM.79 轰炸机': 'SM.79 Bomber', '三引擎"雀鹰"': 'Three-engine Sparrowhawk',
  '美军步兵师': 'US Infantry Division', '加兰德半自动步枪': 'Garand semi-automatic rifle',
  'M2 105mm 榴弹炮': 'M2 105mm Howitzer', '标准师属火炮': 'Standard divisional howitzer',
  '谢尔曼 M4 坦克': 'Sherman M4 Tank', '可靠的海量生产': 'Reliable mass production',
  'B-17 空中堡垒': 'B-17 Flying Fortress', '白昼精确轰炸': 'Daylight precision bombing',
  '老式步兵师': 'Outdated Infantry Division', '一战水平装备': 'WWI-era equipment',
  '老式野战炮': 'Outdated Field Gun', '库存火炮': 'Stockpile artillery',
  '基础型航空队': 'Basic Air Wing', '通用早期航空队；机场系统的基础机型': 'Generic early air wing; baseline type of the airfield system',

  /* ---- air models (zh-containing names) ---- */
  'Ju 87 B 斯图卡': 'Ju 87 B Stuka',
  '飓风 Mk I': 'Hurricane Mk I', '喷火 Mk V': 'Spitfire Mk V', '喷火 Mk XIV': 'Spitfire Mk XIV',
  '布伦海姆 Mk IF': 'Blenheim Mk IF', '英俊战士 Mk IF': 'Beaufighter Mk IF', '蚊式 NF Mk II': 'Mosquito NF Mk II',
  '莱桑德': 'Lysander', '台风 Mk IB': 'Typhoon Mk IB', '暴风 Mk V': 'Tempest Mk V',
  '剑鱼 Mk I': 'Swordfish Mk I', '博福特 Mk I': 'Beaufort Mk I', '英俊战士 TF Mk X': 'Beaufighter TF Mk X',
  '布伦海姆 Mk IV': 'Blenheim Mk IV', '波士顿 Mk III': 'Boston Mk III', '蚊式 B Mk IV': 'Mosquito B Mk IV',
  '惠灵顿 Mk I': 'Wellington Mk I', '哈利法克斯 Mk I': 'Halifax Mk I', '哈罗运输型': 'Harrow Transport',
  '达科他 Mk III': 'Dakota Mk III', '约克': 'York',
  'P-36 霍克': 'P-36 Hawk', 'P-40 战鹰': 'P-40 Warhawk', 'P-51D 野马': 'P-51D Mustang',
  'P-38F 闪电': 'P-38F Lightning', 'P-38J 闪电': 'P-38J Lightning', 'P-61 黑寡妇': 'P-61 Black Widow',
  'A-17 诺马德': 'A-17 Nomad', 'A-36 阿帕奇': 'A-36 Apache', 'P-47D 雷电': 'P-47D Thunderbolt',
  'TBD 蹂躏者': 'TBD Devastator', 'SBD 无畏': 'SBD Dauntless', 'TBF 复仇者': 'TBF Avenger',
  'B-18 大刀': 'B-18 Bolo', 'B-25 米切尔': 'B-25 Mitchell', 'B-26 掠夺者': 'B-26 Marauder',
  'B-24 解放者': 'B-24 Liberator', 'B-29 超级堡垒': 'B-29 Superfortress',
  'C-47 空中列车': 'C-47 Skytrain', 'C-46 突击队员': 'C-46 Commando',
  'I-153 对地型': 'I-153 Ground-Attack', 'A-20G 鱼雷型': 'A-20G Torpedo', 'TB-3 运输型': 'TB-3 Transport', 'C-47 租借型': 'C-47 Lend-Lease',
  '喷火 Mk IX（自由法国）': 'Spitfire Mk IX (Free French)', 'P-47D（自由法国）': 'P-47D (Free French)',
  'PV-1 Ventura（法国）': 'PV-1 Ventura (France)', 'B-26（自由法国）': 'B-26 (Free French)',
  'Halifax（自由法国）': 'Halifax (Free French)', 'C-47（自由法国）': 'C-47 (Free French)',
  'SM.79 轰炸型': 'SM.79 Bomber', 'C.200 雷电': 'C.200 Saetta', 'C.202 闪电': 'C.202 Folgore', 'C.205 灰猎犬': 'C.205 Veltro',
  'SM.79 鱼雷型': 'SM.79 Torpedo',
  'A5M 九六式舰战': 'A5M Claude', 'A6M 零式舰战': 'A6M Zero', 'Ki-84 疾风': 'Ki-84 Frank',
  'Ki-45 屠龙': 'Ki-45 Nick', 'J1N1-S 月光': 'J1N1-S Gekko', 'Ki-102': 'Ki-102',
  'Ki-32 九八式轻轰': 'Ki-32 Mary', 'Ki-51 九九式袭击机': 'Ki-51 Sonia', 'Ki-102乙': 'Ki-102 Otsu',
  'B5N 九七式舰攻': 'B5N Kate', 'D4Y 彗星': 'D4Y Judy', 'B6N 天山': 'B6N Jill',
  'Ki-21 九七式重轰': 'Ki-21 Sally', 'Ki-49 吞龙': 'Ki-49 Helen', 'Ki-67 飞龙': 'Ki-67 Peggy',
  'G3M 九六式陆攻': 'G3M Nell', 'G4M 一式陆攻': 'G4M Betty',
  'Ki-34': 'Ki-34', 'Ki-57': 'Ki-57', 'L2D 零式运输机': 'L2D Tabby',

  /* ---- air model notes ---- */
  '陆军协同／轻型对地任务概化': 'Army co-operation / light ground-attack abstraction',
  '美国A-20在英国服役型号': 'US A-20 in British service',
  '轰炸机改运输用途': 'Bomber converted for transport duty',
  '美国C-47在英国服役型号': 'US C-47 in British service',
  '进口／盟军援助': 'Imported / Allied aid',
  '进口／盟军援助，战斗轰炸用途': 'Imported / Allied aid, fighter-bomber role',
  '盟军援助，海上巡逻任务': 'Allied aid, maritime patrol role',
  '法国机组在英国皇家空军作战，按国家编成概化': 'French crews serving in the RAF, abstracted as a national formation',
  '民用运输机军用征调': 'Airliner requisitioned for military transport',
  '有限服役，侦察／护航任务概化': 'Limited service; reconnaissance/escort abstraction',
  '德国进口': 'Imported from Germany',
  '少量改装，作战影响有限': 'Few conversions, limited combat impact',
  '双发远程轰炸机，按战略任务归类': 'Twin-engine long-range bomber, classed as strategic',
  '租借法案进口，苏联海军航空兵改装': 'Lend-lease import, converted for Soviet naval aviation',
  'DC-3许可生产家族；Li-2名称自1942年使用': 'Licensed DC-3 family; named Li-2 from 1942',
  '战斗机对地任务配置': 'Fighter in ground-attack configuration',
  '战斗轰炸任务配置': 'Fighter-bomber configuration',
  '重型战斗／对地多用途家族': 'Heavy fighter / ground-attack multi-role family',
  '对地配置': 'Ground-attack configuration',
  'DC-3许可生产': 'Licensed DC-3 production',

  /* ---- air role names ---- */
  '轻型战斗机': 'Light Fighter', '重型战斗机': 'Heavy Fighter', '近地支援机': 'Close Air Support',
  '海军轰炸机': 'Naval Bomber', '战术轰炸机': 'Tactical Bomber', '战略轰炸机': 'Strategic Bomber', '运输机': 'Transport Plane',
  '兰开斯特 Mk I': 'Lancaster Mk I',

  /* ---- air neutral composed names ---- */
  '基础型轻型战斗机': 'Basic Light Fighter', '改进型轻型战斗机': 'Improved Light Fighter', '先进型轻型战斗机': 'Advanced Light Fighter',
  '基础型重型战斗机': 'Basic Heavy Fighter', '改进型重型战斗机': 'Improved Heavy Fighter', '先进型重型战斗机': 'Advanced Heavy Fighter',
  '基础型近地支援机': 'Basic Close Air Support', '改进型近地支援机': 'Improved Close Air Support', '先进型近地支援机': 'Advanced Close Air Support',
  '基础型海军轰炸机': 'Basic Naval Bomber', '改进型海军轰炸机': 'Improved Naval Bomber', '先进型海军轰炸机': 'Advanced Naval Bomber',
  '基础型战术轰炸机': 'Basic Tactical Bomber', '改进型战术轰炸机': 'Improved Tactical Bomber', '先进型战术轰炸机': 'Advanced Tactical Bomber',
  '基础型战略轰炸机': 'Basic Strategic Bomber', '改进型战略轰炸机': 'Improved Strategic Bomber', '先进型战略轰炸机': 'Advanced Strategic Bomber',
  '基础型运输机': 'Basic Transport Plane', '改进型运输机': 'Improved Transport Plane', '先进型运输机': 'Advanced Transport Plane',
  '基础型': 'Basic', '改进型': 'Improved', '先进型': 'Advanced',

  /* ---- naval neutral composed names ---- */
  '基础型潜艇': 'Basic Submarine', '改进型潜艇': 'Improved Submarine', '先进型潜艇': 'Advanced Submarine',
  '基础型驱逐舰': 'Basic Destroyer', '改进型驱逐舰': 'Improved Destroyer', '先进型驱逐舰': 'Advanced Destroyer',
  '基础型轻巡洋舰': 'Basic Light Cruiser', '改进型轻巡洋舰': 'Improved Light Cruiser', '先进型轻巡洋舰': 'Advanced Light Cruiser',
  '基础型重巡洋舰': 'Basic Heavy Cruiser', '改进型重巡洋舰': 'Improved Heavy Cruiser', '先进型重巡洋舰': 'Advanced Heavy Cruiser',
  '基础型战列巡洋舰': 'Basic Battlecruiser', '改进型战列巡洋舰': 'Improved Battlecruiser', '先进型战列巡洋舰': 'Advanced Battlecruiser',
  '基础型战列舰': 'Basic Battleship', '改进型战列舰': 'Improved Battleship', '先进型战列舰': 'Advanced Battleship',
  '基础型护航／轻型航母': 'Basic Escort/Light Carrier', '改进型护航／轻型航母': 'Improved Escort/Light Carrier', '先进型护航／轻型航母': 'Advanced Escort/Light Carrier',
  '基础型航空母舰': 'Basic Aircraft Carrier', '改进型航空母舰': 'Improved Aircraft Carrier', '先进型航空母舰': 'Advanced Aircraft Carrier',

  /* ---- paratrooper ---- */
  '伞兵部队': 'Paratrooper Unit', '可在机场登上运输机并执行伞降': 'Boards transports at airfields and executes airborne drops',

  /* ---- naval model names ---- */
  'VII型': 'Type VII', 'IX型': 'Type IX', 'XXI型': 'Type XXI',
  '1934型': 'Type 1934', '1936A型': 'Type 1936A', '1936B型': 'Type 1936B',
  '柯尼斯堡级': 'Königsberg Class', '莱比锡级': 'Leipzig Class', 'M级': 'M Class',
  '希佩尔海军上将级': 'Admiral Hipper Class',
  '德意志级装甲舰': 'Deutschland-class Panzerschiff', '沙恩霍斯特级': 'Scharnhorst Class',
  '德意志级前无畏舰': 'Deutschland-class Pre-dreadnought', '俾斯麦级': 'Bismarck Class',
  '兴登堡级（H级计划）': 'Hindenburg Class (H-Plan)', '塞德利茨改装型': 'Seydlitz Conversion', '齐柏林伯爵级': 'Graf Zeppelin Class',
  /* naval build-tree notes (NAVAL.models third slot) shared with no other section */
  'Z计划轻巡洋舰': 'Z Plan Light Cruisers',
  '对应H-39；兴登堡为游戏名称，并非正式确定的舰级名': 'Corresponds to H-39; Hindenburg is the in-game name, never an officially confirmed class name',
  '威悉河改装计划；史实1942年提出，游戏按指定规则开局可用': 'Weser conversion plan; proposed historically in 1942, available from the start under scenario rules',
  '齐柏林伯爵号未完工': 'Graf Zeppelin was never completed',
  '1939年设计的狮级建造计划': 'Lion-class build programme drawn up in 1939',
  '战前远洋潜艇计划': 'Pre-war ocean-going submarine programme',
  '战前设计；战后以不同防空配置完工': 'Pre-war design; completed postwar with different anti-air fits',
  '重巡洋舰设计研究': 'Heavy cruiser design study',
  '战列舰设计计划': 'Battleship design programme',
  '霞飞、潘勒韦计划': 'Joffre and Painlevé programmes',
  '战时驱逐舰建造计划': 'Wartime destroyer construction programme',
  '卡索内个人技术构想；非获批建造舰级，游戏作为战巡方案': 'Ferrati personal technical concept; never an approved class, adopted as the game battlecruiser design',
  '邮轮奥古斯都号改装护航航母，未完工': 'Liner Augustus conversion into escort carrier, never completed',
  '邮轮罗马号改装航母，未服役': 'Liner Roma conversion into carrier, never commissioned',
  '战前开工，战后才服役': 'Laid down pre-war, commissioned only after the war',
  '大型巡洋舰计划，未完工': 'Large cruiser programme, never completed',
  '苏维埃联盟等舰，未完工': 'Sovetsky Soyuz and sisters, never completed',
  '战前设计研究，未建成': 'Pre-war design study, never built',
  '1943—1944年设计研究，未建成': '1943-1944 design study, never built',
  '设计方案，未开工': 'Design study, never laid down',
  'S级': 'S Class', 'T级': 'T Class', 'V级': 'V Class',
  '部族级': 'Tribal Class', 'J/K/N级': 'J/K/N Class', '战斗级': 'Battle Class',
  '城级': 'Town Class', '斐济级（殖民地级）': 'Fiji Class (Crown Colony)', '敏捷级': 'Swiftsure Class',
  '郡级': 'County Class', '声望级': 'Renown Class', '海军上将级（胡德）': 'Admiral Class (Hood)',
  '伊丽莎白女王级': 'Queen Elizabeth Class', '乔治五世级': 'King George V Class', '狮级': 'Lion Class',
  '复仇者级': 'Avenger Class', '统治者级': 'Ruler Class', '巨像级': 'Colossus Class',
  '皇家方舟号': 'Ark Royal', '光辉级': 'Illustrious Class', '怨仇级': 'Implacable Class',
  '可畏级（1500吨型）': 'Redoutable Class (1500-ton)', '密涅瓦级': 'Minerve Class', '罗兰·莫里约型': 'Roland Morillot Type',
  '豺级': 'Chacal Class', '空想级': 'Le Fantasque Class', '莫加多尔级': 'Mogador Class',
  '迪盖-特鲁安级': 'Duguay-Trouin Class', '拉·加利索尼埃级': 'La Galissonnière Class', '德·格拉斯级': 'De Grasse Class',
  '絮弗伦级': 'Suffren Class', '阿尔及利亚号': 'Algérie', 'C5型（圣路易计划）': 'C5 Design (Project Saint-Louis)',
  '敦刻尔克级': 'Dunkerque Class', '布列塔尼级': 'Bretagne Class', '黎塞留级': 'Richelieu Class', '阿尔萨斯级': 'Alsace Class',
  '迪克斯穆德号（复仇者型）': 'Dixmude (Avenger Type)', '贝亚恩号': 'Béarn', '霞飞级': 'Joffre Class',
  '600吨系列': '600-ton Series', '马尔切洛级': 'Marcello Class', '马可尼级': 'Marconi Class',
  '西北风级': 'Maestrale Class', '士兵级': 'Soldati Class', '金质勋章指挥官级': 'Capitani Romani Class',
  '朱萨诺级': 'Giussano Class', '阿布鲁齐公爵级': 'Duca degli Abruzzi Class', '罗马统帅级': 'Capitani Romani Class',
  '特伦托级': 'Trento Class', '扎拉级': 'Zara Class',
  '卡索内1921年高速主力舰方案': 'Ferrati 1921 Fast Capital Ship Design',
  '加富尔伯爵级': 'Conte di Cavour Class', '卡约·杜伊里奥级（改装）': 'Caio Duilio Class (Rebuilt)', '利托里奥级': 'Littorio Class',
  '鹞鹰号（Sparviero）': 'Sparviero', '天鹰号（Aquila）': 'Aquila',
  'Shch型（狗鱼）': 'Shch Series (Pike)', 'S型': 'S Class', 'K型': 'K Class',
  '愤怒级（7型）': 'Gnevny Class (Type 7)', '机智级（7U型）': 'Razumny Class (Type 7U)', '火力级（30型）': 'Ognevoy Class (Type 30)',
  '斯维特兰娜级': 'Svetlana Class', '恰帕耶夫级（68型）': 'Chapaev Class (Type 68)',
  '基洛夫级（26型）': 'Kirov Class (Type 26)', '马克西姆·高尔基型（26bis）': 'Maxim Gorky Type (26-bis)',
  '喀琅施塔得级（69型）': 'Kronstadt Class (Type 69)', '甘古特级': 'Gangut Class', '苏联级（23型）': 'Sovetsky Soyuz Class (Type 23)',
  '71A型轻型航母': 'Type 71A Light Carrier', '72型航空母舰': 'Type 72 Carrier',
  '海豚级': 'Dolphin Class', '小鲨鱼级': 'Gato Class', '巴劳级': 'Balao Class',
  '法拉格特级': 'Farragut Class', '弗莱彻级': 'Fletcher Class', '基林级': 'Gearing Class',
  '布鲁克林级': 'Brooklyn Class', '克利夫兰级': 'Cleveland Class', '法戈级': 'Fargo Class',
  '新奥尔良级': 'New Orleans Class', '巴尔的摩级': 'Baltimore Class', '俄勒冈城级': 'Oregon City Class',
  '阿拉斯加级': 'Alaska Class', '新墨西哥级': 'New Mexico Class', '北卡罗来纳级': 'North Carolina Class', '衣阿华级': 'Iowa Class',
  '博格级': 'Bogue Class', '独立级': 'Independence Class', '科芒斯门特湾级': 'Commencement Bay Class',
  '列克星敦级': 'Lexington Class', '约克城级': 'Yorktown Class', '埃塞克斯级': 'Essex Class',
  '海大型': 'Kaidai Type', '巡潜乙型（伊十五型）': 'Type B1 Cruiser Submarine (I-15)', '伊四百型': 'Type I-400',
  '吹雪级': 'Fubuki Class', '阳炎级': 'Kagero Class', '秋月级': 'Akizuki Class',
  '长良级': 'Nagara Class', '阿贺野级': 'Agano Class', '大淀号': 'Oyodo',
  '妙高级': 'Myoko Class', '高雄级': 'Takao Class', '利根级': 'Tone Class',
  '金刚级': 'Kongo Class', 'B-65大型巡洋舰方案': 'B-65 Large Cruiser Design',
  '扶桑级': 'Fuso Class', '长门级': 'Nagato Class', '大和级': 'Yamato Class',
  '龙骧号': 'Ryujo', '瑞凤级': 'Zuiho Class', '千岁级（航母改装）': 'Chitose Class (Carrier Conversion)',
  '赤城号': 'Akagi', '翔鹤级': 'Shokaku Class', '大凤号': 'Taiho',

  /* ---- naval equipment className compositions ---- */
  '皇家方舟级': 'Ark Royal Class', '阿尔及利亚级': 'Algérie Class', '贝亚恩级': 'Béarn Class',
  '大淀级': 'Oyodo Class', '龙骧级': 'Ryujo Class', '赤城级': 'Akagi Class', '大凤级': 'Taiho Class',

  /* ---- naval model notes (incl. 【计划／未建成】 prefixed) ---- */
  '【计划／未建成】Z计划轻巡洋舰': '[Planned/Unbuilt] Z Plan light cruiser',
  '德意志、舍尔海军上将、施佩伯爵海军上将；按游戏规则归入战巡，史实为装甲舰／重巡洋舰': 'Deutschland, Admiral Scheer, Admiral Graf Spee; game rules class them as battlecruisers, historically Panzerschiffe/heavy cruisers',
  '沙恩霍斯特、格奈森瑙；史实亦常归为战列舰': 'Scharnhorst, Gneisenau; also often classed as battleships',
  '石勒苏益格-荷尔施泰因、西里西亚；与装甲舰同名但不是同一舰级': 'Schleswig-Holstein, Schlesien; shares names with the Panzerschiffe but a different class',
  '俾斯麦、提尔皮茨': 'Bismarck, Tirpitz',
  '【计划／未建成】对应H-39；兴登堡为游戏名称，并非正式确定的舰级名': '[Planned/Unbuilt] corresponds to H-39; Hindenburg is a game name, not a confirmed class name',
  '【计划／未建成】威悉河改装计划；史实1942年提出，游戏按指定规则开局可用': '[Planned/Unbuilt] Weser conversion; proposed 1942, available at start per scenario rules',
  '【计划／未建成】齐柏林伯爵号未完工': '[Planned/Unbuilt] Graf Zeppelin never completed',
  '【计划／未建成】战前开工，战后才服役': '[Planned/Unbuilt] laid down prewar, completed after the war',
  '180毫米炮；史实分类存在差异，游戏归入重巡': '180mm guns; historical classification disputed, game classes as heavy cruiser',
  '【计划／未建成】大型巡洋舰计划，未完工': '[Planned/Unbuilt] large cruiser project, never completed',
  '【计划／未建成】苏维埃联盟等舰，未完工': '[Planned/Unbuilt] Sovetskaya Soyuz and sisters, never completed',
  '【计划／未建成】战前设计研究，未建成': '[Planned/Unbuilt] prewar design study, never built',
  '【计划／未建成】1943—1944年设计研究，未建成': '[Planned/Unbuilt] 1943-44 design study, never built',
  '游戏升级顺序，不代表胡德晚于声望服役': 'Game upgrade order, not commissioning dates',
  '【计划／未建成】1939年设计的狮级建造计划': '[Planned/Unbuilt] 1939 Lion-class building programme',
  '【计划／未建成】战前远洋潜艇计划': '[Planned/Unbuilt] prewar ocean-going submarine programme',
  '【计划／未建成】战前设计；战后以不同防空配置完工': '[Planned/Unbuilt] prewar design; completed postwar with a different AA fit',
  '【计划／未建成】重巡洋舰设计研究': '[Planned/Unbuilt] heavy cruiser design study',
  '敦刻尔克、斯特拉斯堡；史实为快速战列舰，游戏归入战巡': 'Dunkerque, Strasbourg; fast battleships historically, game classes as battlecruisers',
  '【计划／未建成】战列舰设计计划': '[Planned/Unbuilt] battleship design programme',
  '原英国护航航母Biter；1945年移交法国': 'Former British escort carrier Biter; transferred to France in 1945',
  '【计划／未建成】霞飞、潘勒韦计划': '[Planned/Unbuilt] Joffre and Painleve programme',
  '【计划／未建成】战时驱逐舰建造计划': '[Planned/Unbuilt] wartime destroyer programme',
  '史实亦称大型驱逐舰／轻巡洋舰': 'Also classed as large destroyers/light cruisers',
  '【计划／未建成】卡索内个人技术构想；非获批建造舰级，游戏作为战巡方案': '[Planned/Unbuilt] Ferrati personal concept; never an approved class, game uses it as a battlecruiser design',
  '【计划／未建成】邮轮奥古斯都号改装护航航母，未完工': '[Planned/Unbuilt] liner Augustus converted to escort carrier, never completed',
  '【计划／未建成】邮轮罗马号改装航母，未服役': '[Planned/Unbuilt] liner Roma converted to carrier, never commissioned',
  '1944年开工，战后服役；按建造期解锁': 'Laid down 1944, completed postwar; unlocked by building period',
  '史实分类为大型巡洋舰': 'Historically classed as a large cruiser',
  '轻型航母': 'Light carrier',
  '改装后为快速战列舰，游戏保留战巡分类': 'Rebuilt as fast battleships; game keeps the battlecruiser class',
  '【计划／未建成】设计方案，未开工': '[Planned/Unbuilt] design study, never laid down',

  /* ---- events ---- */
  '西线闪击战': 'Blitzkrieg in the West',
  '1940年5月10日，德军发起"黄色方案"，装甲集群穿越阿登森林，法兰西战役爆发。': 'On 10 May 1940 Germany launches Fall Gelb: panzer groups pour through the Ardennes and the Battle of France begins.',
  '意大利参战': 'Italy Enters the War',
  '1940年6月10日，墨索里尼向英法宣战，意大利加入轴心国作战。': 'On 10 June 1940 Mussolini declares war on Britain and France; Italy joins the Axis.',
  '不列颠空战': 'Battle of Britain',
  '戈林的德国空军与英国皇家空军在英伦上空展开殊死搏杀，"Never was so much owed by so many to so few."': 'The Luftwaffe of Goering and the Royal Air Force fight to the death over Britain: "Never was so much owed by so many to so few."',
  '巴尔干加入轴心': 'The Balkans Join the Axis',
  '1940年11月，匈牙利与罗马尼亚签署三国同盟条约，加入轴心国阵营（其领土与军队归轴心国指挥）。': 'In November 1940 Hungary and Romania sign the Tripartite Pact and join the Axis (their territory and armies come under Axis command).',
  '巴巴罗萨行动': 'Operation Barbarossa',
  '1941年6月22日凌晨3时15分，550万轴心国军队越过苏联边境，人类历史上规模最大的地面战争爆发！苏联进行全面动员。': 'At 03:15 on 22 June 1941, 5.5 million Axis troops cross the Soviet border — the largest land invasion in history begins! The USSR mobilizes totally.',
  '台风行动': 'Operation Typhoon',
  '德军发起进攻莫斯科的"台风行动"，"冬季将军"即将登上舞台。': 'Germany launches Operation Typhoon against Moscow; General Winter is about to take the stage.',
  '美国参战': 'America Enters the War',
  '珍珠港遇袭，美国正式参战！《租借法案》物资源源不断运抵伦敦，美军先头部队抵达英国。（同盟国收入+40，伦敦可招募美军装备）': 'Pearl Harbor is attacked and America formally enters the war! Lend-Lease supplies flow into London and the first US troops arrive in Britain. (Allied income +40; US equipment recruitable in London.)',
  '斯大林格勒': 'Stalingrad',
  '保卢斯第6集团军兵临斯大林格勒，人类历史上最惨烈的城市攻防战拉开序幕。': 'Paulus 6th Army reaches Stalingrad; the bloodiest urban battle in history begins.',
  '库尔斯克会战': 'Battle of Kursk',
  '史上最大规模坦克会战在普罗霍罗夫卡草原爆发，德军最后的战略主动权就此耗尽。': 'The largest tank battle in history erupts on the Prokhorovka steppe; Germany burns its last strategic initiative.',
  '诺曼底登陆': 'D-Day',
  '1944年6月6日，盟军五个师在诺曼底海滩抢滩登陆，"最长的一日"——第二战场开辟！': 'On 6 June 1944 five Allied divisions storm the Normandy beaches — The Longest Day: the Second Front opens!',
});

/* Ship-name maps (per navy) keyed by the zh name; consumed by the mil mutator. */
var SHIP_NAMES = {
 "de": {
  "柯尼斯堡号": "Königsberg",
  "卡尔斯鲁厄号": "Karlsruhe",
  "科隆号": "Köln",
  "莱比锡号": "Leipzig",
  "纽伦堡号": "Nürnberg",
  "M号计划舰": "Cruiser M",
  "N号计划舰": "Cruiser N",
  "希佩尔海军上将号": "Admiral Hipper",
  "布吕歇尔号": "Blücher",
  "欧根亲王号": "Prinz Eugen",
  "塞德利茨号": "Seydlitz",
  "吕措夫号": "Lützow",
  "德意志号": "Deutschland",
  "舍尔海军上将号": "Admiral Scheer",
  "施佩伯爵海军上将号": "Admiral Graf Spee",
  "沙恩霍斯特号": "Scharnhorst",
  "格奈森瑙号": "Gneisenau",
  "石勒苏益格-荷尔施泰因号": "Schleswig-Holstein",
  "西里西亚号": "Schlesien",
  "Z1莱伯雷希特·马斯号": "Z1 Leberecht Maass",
  "Z2格奥尔格·蒂勒号": "Z2 Georg Thiele",
  "Z3马克斯·舒尔茨号": "Z3 Max Schultz",
  "Z4理查德·拜岑号": "Z4 Richard Beitzen",
  "俾斯麦号": "Bismarck",
  "提尔皮茨号": "Tirpitz",
  "兴登堡号": "Hindenburg",
  "腓特烈大帝号": "Friedrich der Grosse",
  "K号计划战列舰": "Battleship K",
  "L号计划战列舰": "Battleship L",
  "M号计划战列舰": "Battleship M",
  "N号计划战列舰": "Battleship N",
  "威悉河号": "Weser",
  "齐柏林伯爵号": "Graf Zeppelin",
  "B号航空母舰": "Carrier B"
 },
 "uk": {
  "剑鱼号": "Swordfish",
  "海狮号": "Sealion",
  "鲟鱼号": "Sturgeon",
  "海马号": "Seahorse",
  "海星号": "Starfish",
  "鲨鱼号": "Shark",
  "特里同号": "Triton",
  "凯旋号": "Triumph",
  "雷霆号": "Thunderbolt",
  "三叉戟号": "Trident",
  "太库号": "Taku",
  "塔彭号": "Tarpon",
  "风险号": "Venture",
  "维京号": "Viking",
  "警惕号": "Vigilant",
  "活力号": "Vigorous",
  "阿弗里迪号": "Afridi",
  "哥萨克号": "Cossack",
  "爱斯基摩号": "Eskimo",
  "毛利号": "Maori",
  "阿散蒂号": "Ashanti",
  "贝都因号": "Bedouin",
  "鞑靼人号": "Tartar",
  "索马里号": "Somali",
  "杰维斯号": "Jervis",
  "豺狼号": "Jackal",
  "标枪号": "Javelin",
  "朱庇特号": "Jupiter",
  "开尔文号": "Kelvin",
  "金伯利号": "Kimberley",
  "内里萨号": "Nerissa",
  "尼扎姆号": "Nizam",
  "巴尔弗勒号": "Barfleur",
  "阿尔马达号": "Armada",
  "特拉法尔加号": "Trafalgar",
  "卡迪斯号": "Cadiz",
  "南安普敦号": "Southampton",
  "纽卡斯尔号": "Newcastle",
  "伯明翰号": "Birmingham",
  "格拉斯哥号": "Glasgow",
  "谢菲尔德号": "Sheffield",
  "利物浦号": "Liverpool",
  "曼彻斯特号": "Manchester",
  "格洛斯特号": "Gloucester",
  "爱丁堡号": "Edinburgh",
  "贝尔法斯特号": "Belfast",
  "斐济号": "Fiji",
  "肯尼亚号": "Kenya",
  "毛里求斯号": "Mauritius",
  "尼日利亚号": "Nigeria",
  "特立尼达号": "Trinidad",
  "牙买加号": "Jamaica",
  "冈比亚号": "Gambia",
  "百慕大号": "Bermuda",
  "敏捷号": "Swiftsure",
  "安大略号": "Ontario",
  "壮丽号": "Magnificent",
  "肯特号": "Kent",
  "贝里克号": "Berwick",
  "康沃尔号": "Cornwall",
  "坎伯兰号": "Cumberland",
  "萨福克号": "Suffolk",
  "伦敦号": "London",
  "德文郡号": "Devonshire",
  "诺福克号": "Norfolk",
  "多塞特郡号": "Dorsetshire",
  "声望号": "Renown",
  "反击号": "Repulse",
  "胡德号": "Hood",
  "伊丽莎白女王号": "Queen Elizabeth",
  "厌战号": "Warspite",
  "勇士号": "Valiant",
  "巴勒姆号": "Barham",
  "马来亚号": "Malaya",
  "乔治五世号": "King George V",
  "威尔士亲王号": "Prince of Wales",
  "约克公爵号": "Duke of York",
  "安森号": "Anson",
  "豪号": "Howe",
  "狮号": "Lion",
  "鲁莽号": "Temeraire",
  "征服者号": "Conqueror",
  "雷神号": "Thunderer",
  "复仇者号": "Avenger",
  "猛攻者号": "Charger",
  "诈骗者号": "Biter",
  "统治者号": "Ruler",
  "阿米尔号": "Ameer",
  "阿瑟林号": "Arbiter",
  "巨像号": "Colossus",
  "荣耀号": "Glory",
  "海洋号": "Ocean",
  "可敬号": "Venerable",
  "复仇号": "Vengeance",
  "战士号": "Warrior",
  "皇家方舟号": "Ark Royal",
  "光辉号": "Illustrious",
  "胜利号": "Victorious",
  "可畏号": "Formidable",
  "不挠号": "Indomitable",
  "怨仇号": "Implacable",
  "不倦号": "Indefatigable"
 },
 "fr": {
  "可畏号": "Redoutable",
  "复仇者号": "Vengeur",
  "帕斯卡号": "Pascal",
  "巴斯德号": "Pasteur",
  "蒙日号": "Monge",
  "阿基米德号": "Archimède",
  "密涅瓦号": "Minerve",
  "朱农号": "Junon",
  "维纳斯号": "Vénus",
  "虹膜号": "Iris",
  "帕拉斯号": "Pallas",
  "谷神星号": "Cérès",
  "罗兰·莫里约号": "Roland Morillot",
  "拉普拉亚号": "La Praya",
  "马提尼克号": "Martinique",
  "瓜德罗普号": "Guadeloupe",
  "豺号": "Chacal",
  "美洲豹号": "Jaguar",
  "豹号": "Léopard",
  "猞猁号": "Lynx",
  "黑豹号": "Panthère",
  "虎号": "Tigre",
  "空想号": "Le Fantasque",
  "大胆号": "L'Audacieux",
  "恶毒号": "Le Malin",
  "可怖号": "Le Terrible",
  "凯旋号": "Le Triomphant",
  "不屈号": "L'Indomptable",
  "莫加多尔号": "Mogador",
  "伏尔塔号": "Volta",
  "迪盖-特鲁安号": "Duguay-Trouin",
  "拉莫特-皮凯号": "Lamotte-Picquet",
  "普里莫盖号": "Primaguet",
  "拉·加利索尼埃号": "La Galissonnière",
  "让·德·维埃纳号": "Jean de Vienne",
  "马赛曲号": "Marseillaise",
  "光荣号": "Gloire",
  "蒙卡尔姆号": "Montcalm",
  "乔治·莱格号": "Georges Leygues",
  "德·格拉斯号": "De Grasse",
  "沙托雷诺号": "Châteaurenault",
  "吉尚号": "Guichen",
  "絮弗伦号": "Suffren",
  "科尔贝尔号": "Colbert",
  "福煦号": "Foch",
  "杜普莱克斯号": "Dupleix",
  "阿尔及利亚号": "Algérie",
  "敦刻尔克号": "Dunkerque",
  "斯特拉斯堡号": "Strasbourg",
  "布列塔尼号": "Bretagne",
  "普罗旺斯号": "Provence",
  "洛林号": "Lorraine",
  "黎塞留号": "Richelieu",
  "让·巴尔号": "Jean Bart",
  "克莱蒙梭号": "Clemenceau",
  "加斯科涅号": "Gascogne",
  "迪克斯穆德号": "Dixmude",
  "贝亚恩号": "Béarn",
  "霞飞号": "Joffre",
  "潘勒韦号": "Painlevé"
 },
 "it": {
  "阿尔戈英雄号": "Argonauta",
  "菲萨利亚号": "Fisalia",
  "梅杜莎号": "Medusa",
  "塞尔彭特号": "Serpente",
  "萨尔帕号": "Salpa",
  "马尔切洛号": "Marcello",
  "丹多洛号": "Dandolo",
  "莫切尼戈号": "Mocenigo",
  "纳尼号": "Nani",
  "韦尼耶罗号": "Veniero",
  "古列尔莫·马可尼号": "Guglielmo Marconi",
  "亚历山德罗·马拉斯皮纳号": "Alessandro Malaspina",
  "莱昂纳多·达·芬奇号": "Leonardo da Vinci",
  "米凯莱·比安基号": "Michele Bianchi",
  "路易吉·托雷利号": "Luigi Torelli",
  "西北风号": "Maestrale",
  "东北风号": "Grecale",
  "西南风号": "Libeccio",
  "东南风号": "Scirocco",
  "阿尔皮诺号": "Alpino",
  "炮兵号": "Artigliere",
  "步兵号": "Ascari",
  "狙击兵号": "Bersagliere",
  "宪兵号": "Carabiniere",
  "掷弹兵号": "Granatiere",
  "指挥官马尔戈蒂尼号": "Comandante Margottini",
  "指挥官巴罗尼号": "Comandante Baroni",
  "指挥官博尔西尼号": "Comandante Borsini",
  "阿尔贝托·达·朱萨诺号": "Alberto da Giussano",
  "阿尔贝里科·达·巴尔比亚诺号": "Alberico da Barbiano",
  "巴尔托洛梅奥·科莱奥尼号": "Bartolomeo Colleoni",
  "乔瓦尼·德莱·班德·内雷号": "Giovanni delle Bande Nere",
  "阿布鲁齐公爵号": "Duca degli Abruzzi",
  "朱塞佩·加里波第号": "Giuseppe Garibaldi",
  "阿蒂利奥·雷戈洛号": "Attilio Regolo",
  "西庇阿·阿非利加诺号": "Scipione Africano",
  "庞培大帝号": "Pompeo Magno",
  "朱利奥·杰尔马尼科号": "Giulio Germanico",
  "特伦托号": "Trento",
  "的里雅斯特号": "Trieste",
  "扎拉号": "Zara",
  "阜姆号": "Fiume",
  "波拉号": "Pola",
  "戈里齐亚号": "Gorizia",
  "加富尔伯爵号": "Conte di Cavour",
  "朱利奥·凯撒号": "Giulio Cesare",
  "卡约·杜伊里奥号": "Caio Duilio",
  "安德烈亚·多里亚号": "Andrea Doria",
  "利托里奥号": "Littorio",
  "维托里奥·维内托号": "Vittorio Veneto",
  "罗马号": "Roma",
  "帝国号": "Impero",
  "鹞鹰号": "Sparviero",
  "天鹰号": "Aquila"
 },
 "su": {
  "愤怒号": "Gnevny",
  "威严号": "Grozny",
  "轰鸣号": "Gremyashchy",
  "威胁号": "Ryany",
  "敏捷号": "Rezvy",
  "迅速号": "Rastoropny",
  "机智号": "Razumny",
  "勇敢号": "Bditelny",
  "坚强号": "Stoiky",
  "自由号": "Svobodny",
  "严厉号": "Surovy",
  "火力号": "Ognevoy",
  "顽皮号": "Ozornoy",
  "红色乌克兰号": "Chervona Ukraina",
  "红色克里木号": "Krasny Krym",
  "恰帕耶夫号": "Chapaev",
  "古比雪夫号": "Kuibyshev",
  "热列兹尼亚科夫号": "Zheleznyakov",
  "契卡洛夫号": "Chkalov",
  "伏龙芝号": "Frunze",
  "基洛夫号": "Kirov",
  "伏罗希洛夫号": "Voroshilov",
  "马克西姆·高尔基号": "Maxim Gorky",
  "莫洛托夫号": "Molotov",
  "喀琅施塔得号": "Kronstadt",
  "塞瓦斯托波尔号": "Sevastopol",
  "马拉号": "Marat",
  "巴黎公社号": "Parizhskaya Kommuna",
  "十月革命号": "Oktyabrskaya Revolutsiya",
  "苏维埃联盟号": "Sovetskaya Soyuz",
  "苏维埃乌克兰号": "Sovetskaya Ukraina",
  "苏维埃俄罗斯号": "Sovetskaya Rossiya",
  "苏维埃白俄罗斯号": "Sovetskaya Belorussiya"
 },
 "us": {
  "海豚号": "Dolphin",
  "梭子鱼号": "Barracuda",
  "鲨鱼号": "Shark",
  "鲈鱼号": "Bass",
  "鲢鱼号": "Pike",
  "鲷鱼号": "Snapper",
  "小鲨鱼号": "Gato",
  "鼓鱼号": "Drum",
  "飞鱼号": "Flying Fish",
  "银汉鱼号": "Silversides",
  "石斑鱼号": "Grouper",
  "黑线鳕号": "Haddock",
  "巴劳号": "Balao",
  "刺尾鱼号": "Tang",
  "大青花鱼号": "Albacore",
  "刺鳍号": "Spadefish",
  "射水鱼号": "Archerfish",
  "海狮号": "Sea Lion",
  "法拉格特号": "Farragut",
  "杜威号": "Dewey",
  "赫尔号": "Hull",
  "麦克多诺号": "McDonough",
  "沃登号": "Worden",
  "戴尔号": "Dale",
  "弗莱彻号": "Fletcher",
  "拉德福德号": "Radford",
  "詹金斯号": "Jenkins",
  "尼古拉斯号": "Nicholas",
  "奥班农号": "O'Bannon",
  "约翰斯顿号": "Johnston",
  "霍尔号": "Hall",
  "基林号": "Gearing",
  "尤金·A·格林号": "Eugene A. Greene",
  "基思号": "Keith",
  "戴斯号": "Dyess",
  "布鲁克林号": "Brooklyn",
  "费城号": "Philadelphia",
  "萨凡纳号": "Savannah",
  "纳什维尔号": "Nashville",
  "菲尼克斯号": "Phoenix",
  "博伊西号": "Boise",
  "火奴鲁鲁号": "Honolulu",
  "克利夫兰号": "Cleveland",
  "哥伦比亚号": "Columbia",
  "蒙彼利埃号": "Montpelier",
  "丹佛号": "Denver",
  "圣菲号": "Santa Fe",
  "伯明翰号": "Birmingham",
  "法戈号": "Fargo",
  "亨廷顿号": "Huntington",
  "新奥尔良号": "New Orleans",
  "阿斯托里亚号": "Astoria",
  "明尼阿波利斯号": "Minneapolis",
  "塔斯卡卢萨号": "Tuscaloosa",
  "旧金山号": "San Francisco",
  "昆西号": "Quincy",
  "文森斯号": "Vincennes",
  "巴尔的摩号": "Baltimore",
  "波士顿号": "Boston",
  "堪培拉号": "Canberra",
  "匹兹堡号": "Pittsburgh",
  "圣保罗号": "Saint Paul",
  "俄勒冈城号": "Oregon City",
  "奥尔巴尼号": "Albany",
  "罗切斯特号": "Rochester",
  "阿拉斯加号": "Alaska",
  "关岛号": "Guam",
  "夏威夷号": "Hawaii",
  "菲律宾号": "Philippines",
  "波多黎各号": "Puerto Rico",
  "萨摩亚号": "Samoa",
  "新墨西哥号": "New Mexico",
  "密西西比号": "Mississippi",
  "爱达荷号": "Idaho",
  "北卡罗来纳号": "North Carolina",
  "华盛顿号": "Washington",
  "衣阿华号": "Iowa",
  "新泽西号": "New Jersey",
  "密苏里号": "Missouri",
  "威斯康星号": "Wisconsin",
  "伊利诺伊号": "Illinois",
  "肯塔基号": "Kentucky",
  "博格号": "Bogue",
  "卡德号": "Card",
  "科帕希号": "Copahee",
  "科尔号": "Core",
  "拿骚号": "Nassau",
  "独立号": "Independence",
  "普林斯顿号": "Princeton",
  "贝劳伍德号": "Belleau Wood",
  "考彭斯号": "Cowpens",
  "蒙特雷号": "Monterey",
  "兰利号": "Langley",
  "卡伯特号": "Cabot",
  "巴丹号": "Bataan",
  "圣哈辛托号": "San Jacinto",
  "科芒斯门特湾号": "Commencement Bay",
  "布洛克岛号": "Block Island",
  "吉尔伯特群岛号": "Gilbert Islands",
  "库拉湾号": "Kula Gulf",
  "韦拉湾号": "Vella Gulf",
  "列克星敦号": "Lexington",
  "萨拉托加号": "Saratoga",
  "约克城号": "Yorktown",
  "企业号": "Enterprise",
  "大黄蜂号": "Hornet",
  "埃塞克斯号": "Essex",
  "无畏号": "Intrepid",
  "富兰克林号": "Franklin",
  "邦克山号": "Bunker Hill",
  "黄蜂号": "Wasp",
  "汉考克号": "Hancock"
 },
 "jp": {
  "伊-156号": "I-156",
  "伊-157号": "I-157",
  "伊-158号": "I-158",
  "伊-159号": "I-159",
  "伊-15号": "I-15",
  "伊-17号": "I-17",
  "伊-19号": "I-19",
  "伊-21号": "I-21",
  "伊-23号": "I-23",
  "伊-25号": "I-25",
  "伊-400号": "I-400",
  "伊-401号": "I-401",
  "伊-402号": "I-402",
  "吹雪号": "Fubuki",
  "白雪号": "Shirayuki",
  "初雪号": "Hatsuyuki",
  "深雪号": "Miyuki",
  "丛云号": "Murakumo",
  "东云号": "Shinonome",
  "阳炎号": "Kagero",
  "不知火号": "Shiranui",
  "黑潮号": "Kuroshio",
  "亲潮号": "Oyashio",
  "雪风号": "Yukikaze",
  "天津风号": "Amatsukaze",
  "秋月号": "Akizuki",
  "照月号": "Teruzuki",
  "凉月号": "Suzutsuki",
  "初月号": "Hatsuzuki",
  "长良号": "Nagara",
  "五十铃号": "Isuzu",
  "名取号": "Natori",
  "由良号": "Yura",
  "鬼怒号": "Kinu",
  "阿武隈号": "Abukuma",
  "阿贺野号": "Agano",
  "能代号": "Noshiro",
  "矢矧号": "Yahagi",
  "酒匂号": "Sakawa",
  "大淀号": "Oyodo",
  "妙高号": "Myoko",
  "那智号": "Nachi",
  "足柄号": "Ashigara",
  "羽黑号": "Haguro",
  "高雄号": "Takao",
  "爱宕号": "Atago",
  "摩耶号": "Maya",
  "鸟海号": "Chokai",
  "利根号": "Tone",
  "筑摩号": "Chikuma",
  "金刚号": "Kongo",
  "比叡号": "Hiei",
  "榛名号": "Haruna",
  "雾岛号": "Kirishima",
  "扶桑号": "Fuso",
  "山城号": "Yamashiro",
  "长门号": "Nagato",
  "陆奥号": "Mutsu",
  "大和号": "Yamato",
  "武藏号": "Musashi",
  "龙骧号": "Ryujo",
  "瑞凤号": "Zuiho",
  "祥凤号": "Shoho",
  "千岁号": "Chitose",
  "千代田号": "Chiyoda",
  "赤城号": "Akagi",
  "翔鹤号": "Shokaku",
  "瑞鹤号": "Zuikaku",
  "大凤号": "Taiho"
 }
};

/* Generals: name/title/bio by data index (order-stable); career/design stay zh (not rendered). */
var GENERAL_EN = {
 "0": {
  "en": "Heinz Guderian",
  "title": "Father of the Panzer Troops",
  "bio": "Served in WWII as panzer group and panzer army commander."
 },
 "1": {
  "en": "Erwin Rommel",
  "title": "The Desert Fox",
  "bio": "Served in WWII as Afrika Korps and army group commander."
 },
 "2": {
  "en": "Erich von Manstein",
  "title": "Master Strategist",
  "bio": "Served in WWII as army and army group commander."
 },
 "3": {
  "en": "Walter Model",
  "title": "Lion of Defence",
  "bio": "Served in WWII as army group commander."
 },
 "4": {
  "en": "Albert Kesselring",
  "title": "Air Marshal",
  "bio": "Served in WWII as air fleet and theatre commander."
 },
 "5": {
  "en": "Gerd von Rundstedt",
  "title": "Veteran Commander of the West",
  "bio": "Served in WWII as C-in-C West and army group commander."
 },
 "6": {
  "en": "Georgy Zhukov",
  "title": "Marshal of Victory",
  "bio": "Served in WWII as front commander and Stavka representative."
 },
 "7": {
  "en": "Konstantin Rokossovsky",
  "title": "Undefeated Commander",
  "bio": "Served in WWII as front commander."
 },
 "8": {
  "en": "Ivan Konev",
  "title": "Artillery Marshal",
  "bio": "Served in WWII as null."
 },
 "9": {
  "en": "Vasily Chuikov",
  "title": "God of Urban Combat",
  "bio": "Served in WWII as Commander of 62nd Army and 8th Guards Army."
 },
 "10": {
  "en": "Mikhail Katukov",
  "title": "Master of Ambush",
  "bio": "Served in WWII as Commander of 1st Guards Tank Army."
 },
 "11": {
  "en": "Leonid Govorov",
  "title": "Artillery Scholar",
  "bio": "Served in WWII as Commander of Leningrad Front."
 },
 "12": {
  "en": "Bernard Montgomery",
  "title": "The Careful Hunter",
  "bio": "Served in WWII as commander of 8th Army and 21st Army Group."
 },
 "13": {
  "en": "George S. Patton",
  "title": "Blood and Guts",
  "bio": "Served in WWII as Commander of 3rd Army."
 },
 "14": {
  "en": "Charles de Gaulle",
  "title": "Leader of Free France",
  "bio": "Served in WWII as 4th Armoured Division commander and leader of Free France."
 },
 "15": {
  "en": "Dwight D. Eisenhower",
  "title": "Supreme Allied Commander",
  "bio": "Served in WWII as Supreme Commander, Allied Expeditionary Force."
 },
 "16": {
  "en": "Harold Alexander, 1st Earl Alexander of Tunis",
  "title": "Mediterranean Commander",
  "bio": "Served in WWII as Allied ground forces commander, Mediterranean."
 },
 "17": {
  "en": "Omar Bradley",
  "title": "The GI General",
  "bio": "Served in WWII as Commander of 12th Army Group."
 },
 "18": {
  "en": "Philippe Leclerc de Hauteclocque",
  "title": "Iron Cavalry of Free France",
  "bio": "Served in WWII as CO, Free French 2nd Armoured Division."
 },
 "19": {
  "en": "Arthur Tedder, 1st Baron Tedder",
  "title": "Deputy Supreme Allied Commander",
  "bio": "Served in WWII as Deputy Supreme Commander, Allied Expeditionary Force."
 },
 "20": {
  "en": "Giovanni Messe",
  "title": "Expeditionary Force Commander",
  "bio": "Served in WWII as expeditionary corps and 1st Army commander."
 },
 "21": {
  "en": "Italo Balbo",
  "title": "Air Power Pioneer",
  "bio": "Served in WWII as Air Marshal and Governor-General of Libya."
 },
 "22": {
  "en": "Tadeusz Bór-Komorowski",
  "title": "Leader of the Warsaw Uprising",
  "bio": "Served in WWII as Polish Home Army commander."
 },
 "23": {
  "en": "Fedor von Bock",
  "title": "Army Group Commander",
  "bio": "Served in WWII as army group commander."
 },
 "24": {
  "en": "Wilhelm Ritter von Leeb",
  "title": "Commander, Army Group North",
  "bio": "Served in WWII as Commander of Army Group North."
 },
 "25": {
  "en": "Günther von Kluge",
  "title": "Commander, Army Group Centre",
  "bio": "Served in WWII as Commander of Army Group Centre."
 },
 "26": {
  "en": "Paul Ludwig Ewald von Kleist",
  "title": "Panzer Group Commander",
  "bio": "Served in WWII as panzer group commander."
 },
 "27": {
  "en": "Hermann Hoth",
  "title": "Panzer Army Commander",
  "bio": "Served in WWII as panzer army commander."
 },
 "28": {
  "en": "Erich Hoepner",
  "title": "Commander, 4th Panzer Group",
  "bio": "Served in WWII as Commander of 4th Panzer Group."
 },
 "29": {
  "en": "Gotthard Heinrici",
  "title": "Commander, Army Group Vistula",
  "bio": "Served in WWII as Commander of Army Group Vistula."
 },
 "30": {
  "en": "Kurt Student",
  "title": "Airborne Forces Commander",
  "bio": "Served in WWII as airborne forces commander."
 },
 "31": {
  "en": "Eduard Dietl",
  "title": "Mountain Troops Commander",
  "bio": "Served in WWII as mountain troops commander."
 },
 "32": {
  "en": "Julius Ringel",
  "title": "CO, 5th Mountain Division",
  "bio": "Served in WWII as CO, 5th Mountain Division."
 },
 "33": {
  "en": "Hermann Balck",
  "title": "Armoured Division and Army Commander",
  "bio": "Served in WWII as panzer division and army commander."
 },
 "34": {
  "en": "Hasso von Manteuffel",
  "title": "Commander, 5th Panzer Army",
  "bio": "Served in WWII as Commander of 5th Panzer Army."
 },
 "35": {
  "en": "Wolfram von Richthofen",
  "title": "Air Fleet Commander",
  "bio": "Served in WWII as air fleet commander."
 },
 "36": {
  "en": "Hugo Sperrle",
  "title": "Commander, Air Fleet 3",
  "bio": "Served in WWII as Commander of Air Fleet 3."
 },
 "37": {
  "en": "Aleksandr Vasilevsky",
  "title": "Chief of General Staff, Front Commander",
  "bio": "Served in WWII as Chief of the General Staff and front commander."
 },
 "38": {
  "en": "Nikolai Vatutin",
  "title": "Commander, 1st Ukrainian Front",
  "bio": "Served in WWII as Commander of 1st Ukrainian Front."
 },
 "39": {
  "en": "Semyon Timoshenko",
  "title": "Front Commander",
  "bio": "Served in WWII as front commander."
 },
 "40": {
  "en": "Rodion Malinovsky",
  "title": "Commander, 2nd Ukrainian Front",
  "bio": "Served in WWII as Commander of 2nd Ukrainian Front."
 },
 "41": {
  "en": "Fyodor Tolbukhin",
  "title": "Commander, 3rd Ukrainian Front",
  "bio": "Served in WWII as Commander of 3rd Ukrainian Front."
 },
 "42": {
  "en": "Kirill Meretskov",
  "title": "Commander, Karelian Front",
  "bio": "Served in WWII as Commander of Karelian Front."
 },
 "43": {
  "en": "Ivan Bagramyan",
  "title": "Commander, 1st Baltic Front",
  "bio": "Served in WWII as Commander of 1st Baltic Front."
 },
 "44": {
  "en": "Ivan Chernyakhovsky",
  "title": "Commander, 3rd Belorussian Front",
  "bio": "Served in WWII as Commander of 3rd Belorussian Front."
 },
 "45": {
  "en": "Pavel Rybalko",
  "title": "Commander, 3rd Guards Tank Army",
  "bio": "Served in WWII as Commander of 3rd Guards Tank Army."
 },
 "46": {
  "en": "Pavel Rotmistrov",
  "title": "Commander, 5th Guards Tank Army",
  "bio": "Served in WWII as Commander of 5th Guards Tank Army."
 },
 "47": {
  "en": "Dmitry Lelyushenko",
  "title": "Commander, 4th Tank Army",
  "bio": "Served in WWII as Commander of 4th Tank Army."
 },
 "48": {
  "en": "Alexander Novikov",
  "title": "Commander, Soviet Air Forces",
  "bio": "Served in WWII as Commander of the Soviet Air Forces."
 },
 "49": {
  "en": "Konstantin Vershinin",
  "title": "Commander, 4th Air Army",
  "bio": "Served in WWII as Commander of 4th Air Army."
 },
 "50": {
  "en": "Alexander Golovanov",
  "title": "Commander, Long-Range Aviation",
  "bio": "Served in WWII as Commander of Long-Range Aviation."
 },
 "51": {
  "en": "Alan Brooke, 1st Viscount Alanbrooke",
  "title": "Chief of the Imperial General Staff",
  "bio": "Served in WWII as Chief of the Imperial General Staff."
 },
 "52": {
  "en": "Archibald Wavell, 1st Earl Wavell",
  "title": "C-in-C, Middle East",
  "bio": "Served in WWII as Commander-in-Chief, Middle East."
 },
 "53": {
  "en": "Claude Auchinleck",
  "title": "C-in-C, Middle East",
  "bio": "Served in WWII as Commander-in-Chief, Middle East."
 },
 "54": {
  "en": "William Slim, 1st Viscount Slim",
  "title": "Commander, 14th Army",
  "bio": "Served in WWII as Commander of 14th Army."
 },
 "55": {
  "en": "Miles Dempsey",
  "title": "Commander, 2nd Army",
  "bio": "Served in WWII as Commander of 2nd Army."
 },
 "56": {
  "en": "Brian Horrocks",
  "title": "GOC, 30th Corps",
  "bio": "Served in WWII as GOC 30th Corps."
 },
 "57": {
  "en": "Richard O'Connor",
  "title": "Western Desert Force Commander",
  "bio": "Served in WWII as Western Desert Force commander."
 },
 "58": {
  "en": "John Vereker, 6th Viscount Gort",
  "title": "Commander, British Expeditionary Force",
  "bio": "Served in WWII as Commander of the British Expeditionary Force."
 },
 "59": {
  "en": "Hugh Dowding",
  "title": "C-in-C, Fighter Command",
  "bio": "Served in WWII as Commander-in-Chief, Fighter Command."
 },
 "60": {
  "en": "Keith Park",
  "title": "No. 11 Group Commander",
  "bio": "Served in WWII as commander of No. 11 Group."
 },
 "61": {
  "en": "Sir Arthur Harris, 1st Baronet",
  "title": "C-in-C, Bomber Command",
  "bio": "Served in WWII as Commander-in-Chief, Bomber Command."
 },
 "62": {
  "en": "Arthur Coningham (RAF officer)",
  "title": "Tactical Air Commander",
  "bio": "Served in WWII as tactical air commander."
 },
 "63": {
  "en": "George C. Marshall",
  "title": "US Army Chief of Staff",
  "bio": "Served in WWII as US Army Chief of Staff."
 },
 "64": {
  "en": "Mark W. Clark",
  "title": "Commander, 5th Army",
  "bio": "Served in WWII as Commander of 5th Army."
 },
 "65": {
  "en": "Jacob L. Devers",
  "title": "Commander, 6th Army Group",
  "bio": "Served in WWII as Commander of 6th Army Group."
 },
 "66": {
  "en": "Courtney Hodges",
  "title": "Commander, 1st Army",
  "bio": "Served in WWII as Commander of 1st Army."
 },
 "67": {
  "en": "William Hood Simpson",
  "title": "Commander, 9th Army",
  "bio": "Served in WWII as Commander of 9th Army."
 },
 "68": {
  "en": "Alexander Patch",
  "title": "Commander, 7th Army",
  "bio": "Served in WWII as Commander of 7th Army."
 },
 "69": {
  "en": "Matthew Ridgway",
  "title": "CG, XVIII Airborne Corps",
  "bio": "Served in WWII as CG, XVIII Airborne Corps."
 },
 "70": {
  "en": "James M. Gavin",
  "title": "CO, 82nd Airborne Division",
  "bio": "Served in WWII as CG, 82nd Airborne Division."
 },
 "71": {
  "en": "Carl Spaatz",
  "title": "Strategic Air Forces Commander",
  "bio": "Served in WWII as strategic air forces commander."
 },
 "72": {
  "en": "Jean de Lattre de Tassigny",
  "title": "Commander, French 1st Army",
  "bio": "Served in WWII as Commander of French 1st Army."
 },
 "73": {
  "en": "Alphonse Juin",
  "title": "Commander, Expeditionary Corps in Italy",
  "bio": "Served in WWII as Commander of the Expeditionary Corps in Italy."
 },
 "74": {
  "en": "Marie-Pierre Kœnig",
  "title": "Free French Brigade Commander",
  "bio": "Served in WWII as Free French Brigade commander."
 },
 "75": {
  "en": "Edgard de Larminat",
  "title": "Free French Corps Commander",
  "bio": "Served in WWII as Free French Corps commander."
 },
 "76": {
  "en": "Maurice Gamelin",
  "title": "C-in-C, French Army",
  "bio": "Served in WWII as Commander-in-Chief of the French Army."
 },
 "77": {
  "en": "Maxime Weygand",
  "title": "Supreme Commander, French Forces",
  "bio": "Served in WWII as Supreme Commander of French Forces."
 },
 "78": {
  "en": "Charles Huntziger",
  "title": "Commander, French 2nd Army",
  "bio": "Served in WWII as Commander of French 2nd Army."
 },
 "79": {
  "en": "Joseph Vuillemin",
  "title": "French Air Force Chief of Staff",
  "bio": "Served in WWII as French Air Force Chief of Staff."
 },
 "80": {
  "en": "Pietro Badoglio",
  "title": "Italian Chief of the General Staff",
  "bio": "Served in WWII as Italian Chief of the General Staff."
 },
 "81": {
  "en": "Rodolfo Graziani",
  "title": "Italian Commander, North Africa",
  "bio": "Served in WWII as Italian commander in North Africa."
 },
 "82": {
  "en": "Ettore Bastico",
  "title": "North African Theatre Commander",
  "bio": "Served in WWII as North African theatre commander."
 },
 "83": {
  "en": "Italo Gariboldi",
  "title": "Commander, Italian 8th Army in Russia",
  "bio": "Served in WWII as Commander of Italian 8th Army in Russia."
 },
 "84": {
  "en": "Mario Roatta",
  "title": "Commander, 2nd Army",
  "bio": "Served in WWII as Commander of 2nd Army."
 },
 "85": {
  "en": "Vittorio Ambrosio",
  "title": "Army and General Staff Commander",
  "bio": "Served in WWII as army and general staff commander."
 },
 "86": {
  "en": "Gastone Gambara",
  "title": "Corps-Level Commander",
  "bio": "Served in WWII as corps-level commander."
 },
 "87": {
  "en": "Rino Corso Fougier",
  "title": "Italian Air Force Chief of Staff",
  "bio": "Served in WWII as Italian Air Force Chief of Staff."
 },
 "88": {
  "en": "Władysław Sikorski",
  "title": "C-in-C, Polish Forces-in-Exile",
  "bio": "Served in WWII as Commander-in-Chief of the Polish Forces-in-Exile."
 },
 "89": {
  "en": "Władysław Anders",
  "title": "GOC, Polish 2nd Corps",
  "bio": "Served in WWII as GOC Polish 2nd Corps."
 },
 "90": {
  "en": "Stanisław Maczek",
  "title": "CO, Polish 1st Armoured Division",
  "bio": "Served in WWII as CO, Polish 1st Armoured Division."
 },
 "91": {
  "en": "Stanisław Sosabowski",
  "title": "Independent Parachute Brigade Commander",
  "bio": "Served in WWII as Independent Parachute Brigade commander."
 },
 "92": {
  "en": "Tadeusz Kutrzeba",
  "title": "Commander, Poznan Army",
  "bio": "Served in WWII as Commander of Poznan Army."
 },
 "93": {
  "en": "Carl Gustaf Emil Mannerheim",
  "title": "C-in-C, Finnish Defence Forces",
  "bio": "Served in WWII as Commander-in-Chief of the Finnish Defence Forces."
 },
 "94": {
  "en": "Hjalmar Siilasvuo",
  "title": "Finnish Corps-Level Commander",
  "bio": "Served in WWII as Finnish corps-level commander."
 },
 "95": {
  "en": "Paavo Talvela",
  "title": "Finnish Corps-Level Commander",
  "bio": "Served in WWII as Finnish corps-level commander."
 },
 "96": {
  "en": "Erik Heinrichs",
  "title": "Karelian Army Commander, Chief of Staff",
  "bio": "Served in WWII as Commander of Karelian Army and Chief of Staff."
 },
 "97": {
  "en": "Aksel Airo",
  "title": "Head of Ops Planning, Finnish GHQ",
  "bio": "Served in WWII as Head of operations planning, Finnish GHQ."
 },
 "98": {
  "en": "Petre Dumitrescu",
  "title": "Commander, Romanian 3rd Army",
  "bio": "Served in WWII as Commander of Romanian 3rd Army."
 },
 "99": {
  "en": "Gheorghe Avramescu",
  "title": "Mountain Corps and 4th Army Commander",
  "bio": "Served in WWII as mountain corps and 4th Army commander."
 },
 "100": {
  "en": "Nicolae Dăscălescu",
  "title": "Commander, Romanian 4th Army",
  "bio": "Served in WWII as Commander of Romanian 4th Army."
 },
 "101": {
  "en": "Nicolae Ciupercă",
  "title": "Commander, Romanian 4th Army",
  "bio": "Served in WWII as Commander of Romanian 4th Army."
 },
 "102": {
  "en": "Ferenc Szombathelyi",
  "title": "Hungarian Chief of the General Staff",
  "bio": "Served in WWII as Hungarian Chief of the General Staff."
 },
 "103": {
  "en": "Gusztáv Jány",
  "title": "Commander, Hungarian 2nd Army",
  "bio": "Served in WWII as Commander of Hungarian 2nd Army."
 },
 "104": {
  "en": "Béla Miklós",
  "title": "Mobile Corps and 1st Army Commander",
  "bio": "Served in WWII as Mobile Corps and 1st Army commander."
 },
 "105": {
  "en": "Alexandros Papagos",
  "title": "C-in-C, Greek Army",
  "bio": "Served in WWII as Commander-in-Chief of the Greek Army."
 },
 "106": {
  "en": "Ioannis Pitsikas",
  "title": "Epirus Army Commander",
  "bio": "Served in WWII as Epirus Army commander."
 },
 "107": {
  "en": "Charalambos Katsimitros",
  "title": "CO, Greek 8th Infantry Division",
  "bio": "Served in WWII as CO, Greek 8th Infantry Division."
 },
 "108": {
  "en": "Otto Ruge",
  "title": "C-in-C, Norwegian Army",
  "bio": "Served in WWII as Commander-in-Chief of the Norwegian Army."
 },
 "109": {
  "en": "Carl Gustav Fleischer",
  "title": "CO, Norwegian 6th Division",
  "bio": "Served in WWII as CO, Norwegian 6th Division."
 },
 "110": {
  "en": "Henri Winkelman",
  "title": "C-in-C, Dutch Army",
  "bio": "Served in WWII as Commander-in-Chief of the Dutch Army."
 },
 "111": {
  "en": "Izaak H. Reijnders",
  "title": "Dutch Armed Forces Commander",
  "bio": "Served in WWII as Dutch armed forces commander."
 },
 "112": {
  "en": "Raoul Van Overstraeten",
  "title": "Belgian Military Adviser",
  "bio": "Served in WWII as Belgian military adviser."
 },
 "113": {
  "en": "Maurice Keyaerts",
  "title": "Ardennes Chasseurs and Cavalry Commander",
  "bio": "Served in WWII as Ardennes Chasseurs and cavalry commander."
 },
 "114": {
  "en": "Dušan Simović",
  "title": "Yugoslav Air Force and Staff Commander",
  "bio": "Served in WWII as Yugoslav air force and staff commander."
 },
 "115": {
  "en": "Koča Popović",
  "title": "Yugoslav Partisan Commander",
  "bio": "Served in WWII as Yugoslav Partisan commander."
 }
};

I18N.shipName = (ct, name) => {
  if (I18N.lang !== 'en') return name;
  for (const [key,pool] of Object.entries(NAVAL.names)) if (key.startsWith(ct+':')) {
    const entry=pool.find(e=>e.n===name); if(entry) return entry.en || name;
  }
  const match=name.match(/^(.+?)([0-9]+)$/);
  return match ? I18N.t(match[1])+' '+match[2] : I18N.t(name);
};
/* Mutators: swap military data strings in place after assemble (EN only).
 * group/glyph stay raw: group is compared for recruitment filters, glyphs are hanzi badges. */
I18N.onData(() => {
  for (const k of Object.keys(CLASSES)) { I18N.tr(CLASSES[k], 'name'); CLASSES[k].glyph = ({inf:'I',tank:'T',art:'A',air:'AF',sub:'SS',dd:'DD',cl:'CL',ca:'CA',bc:'BC',bb:'BB',cve:'CVL',cv:'CV'})[k] || CLASSES[k].glyph; }
  for (const ct of Object.keys(EQUIP)) for (const cls of Object.keys(EQUIP[ct])) {
    const list = EQUIP[ct][cls];
    if (!Array.isArray(list)) continue;
    for (const e of list) { I18N.tr(e, 'n'); I18N.tr(e, 'nt'); I18N.tr(e, 'role'); I18N.tr(e, 'className'); I18N.tr(e, 'name'); }
  }
  for (const k of Object.keys(AIR.roles)) { I18N.tr(AIR.roles[k], 'name'); I18N.tr(AIR.roles[k], 'role'); }
  for (const k of Object.keys(NAVAL.names)) for (const e of NAVAL.names[k]) {
    const ct = k.slice(0, k.indexOf(':'));
    const zh = e._zhn === undefined ? e.n : e._zhn;
    const ruled = zh.match(/^(.+?)号$/);
    const ruleEn = ruled && /^[A-ZЩСК0-9-]+$/i.test(ruled[1]) ? ruled[1].replace(/[ЩСК]/g, c => ({ 'Щ': 'Shch', 'С': 'S', 'К': 'K' })[c]) : null;
    const m = ruleEn !== null ? ruleEn : (SHIP_NAMES[ct] && SHIP_NAMES[ct][zh]);
    if (m !== undefined && m !== null) e.en = m;
    else e.en = I18N.t(e.n); // Canonical ship names are save identifiers: never translate in place.
    I18N.tr(e, 'note');
  }
  for (const p of NAVAL.passages) I18N.tr(p, 'name');
  /* shipyard build tree: [class name, year, note] triples per navy/class */
  for (const ct of Object.keys(NAVAL.models)) for (const cls of Object.keys(NAVAL.models[ct]))
    for (const e of NAVAL.models[ct][cls]) { I18N.tr(e, 0); I18N.tr(e, 2); }
  GENERALS.forEach((g, i) => {
    const r = GENERAL_EN[i];
    if (!r) return;
    if (g._zhname === undefined) g._zhname = g.name;
    g.name = r.en;
    if (g.title !== undefined && r.title !== undefined) { if (g._zhtitle === undefined) g._zhtitle = g.title; g.title = r.title; }
    if (g.bio !== undefined && r.bio !== undefined) { if (g._zhbio === undefined) g._zhbio = g.bio; g.bio = r.bio; }
  });
  for (const ev of EVENTS) { I18N.tr(ev, 'title'); I18N.tr(ev, 'text'); }
  const ECON_EN = { '工厂': 'Factory', '机场': 'Airfield', '港口': 'Port', '运输船': 'Transport Ship', '两栖运输舰': 'Amphibious Transport', '两栖突击舰': 'Assault Amphibious Ship' };
  for (const k of Object.keys(ECONOMY.construction)) {
    const r = ECONOMY.construction[k];
    if (ECON_EN[r.name]) { if (r._zhname === undefined) r._zhname = r.name; r.name = ECON_EN[r.name]; }
  }
  for (const t of ECONOMY.transports) if (ECON_EN[t.name]) { if (t._zhname === undefined) t._zhname = t.name; t.name = ECON_EN[t.name]; }
});
})();
