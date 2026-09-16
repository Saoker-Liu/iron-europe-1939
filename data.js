/* =========================================================================
 * 《钢铁欧陆 1939》 —— 二战欧洲战场六边形回合制战棋
 * data.js : 静态数据（地形 / 地图 / 城市 / 装备 / 将领 / 历史事件）
 * =========================================================================
 * 地图采用 odd-r 偏移坐标的尖顶六边形，114 列 × 65 行。
 * 坐标换算: col = round(经度) + 12 (-12E..44E)   row = round(66.5 - 纬度)
 * 依据真实经纬度海岸线栅格化（见 build_map.js），1 格 ≈ 1°×1°。
 * 图例: ~ 海洋   = 海峡浅滩(可通行: 多佛尔/博斯普鲁斯/墨西拿)   . 平原
 *       f 森林   h 丘陵   m 山地   城市由 CITIES 放置并覆盖地形
 * ========================================================================= */

'use strict';

/* ---------------------------- 兵种与地形 ---------------------------- */

// 兵种基础定义（数值基线，实际单位属性来自各国装备 EQUIP）
const CLASSES = {
  inf:  { name: '步兵', glyph: '步' },
  art:  { name: '炮兵', glyph: '炮', ranged: true, baseRange: 2, neverCounters: true },
  tank: { name: '装甲', glyph: '坦' },
  air:  { name: '空军', glyph: '轰', fly: true, ignoresZOC: true, ignoresTerrainDef: true },
};

// 地形：通行花费(按兵种)、防御加成
const TERRAIN = {
  '~': { name: '海洋',   pass: false, cost: null,                          def: 0,    color: '#26415e' },
  '=': { name: '海峡浅滩', pass: true, cost: { inf: 2, tank: 3, art: 3, air: 1 }, def: 0,    color: '#3a6d94' },
  '.': { name: '平原',   pass: true, cost: { inf: 1, tank: 1, art: 1, air: 1 }, def: 0,    color: '#7d9059' },
  'f': { name: '森林',   pass: true, cost: { inf: 2, tank: 2, art: 2, air: 1 }, def: 0.30, color: '#4c7040' },
  'h': { name: '丘陵',   pass: true, cost: { inf: 2, tank: 2, art: 2, air: 1 }, def: 0.40, color: '#8c8154' },
  'm': { name: '山地',   pass: true, cost: { inf: 3, tank: 3, art: 3, air: 1 }, def: 0.60, color: '#8f867d' },
  'c': { name: '城市',   pass: true, cost: { inf: 1, tank: 1, art: 1, air: 1 }, def: 0.40, color: '#8a8273' },
};

// 兵种克制表：ATK_MOD[攻击方兵种][防御方兵种]
const ATK_MOD = {
  inf:  { inf: 1.00, art: 1.30, tank: 0.65, air: 0.50 },
  art:  { inf: 1.00, art: 1.10, tank: 1.15, air: 0.60 },
  tank: { inf: 1.15, art: 1.40, tank: 1.00, air: 0.40 },
  air:  { inf: 1.15, art: 1.30, tank: 1.10, air: 1.00 },
};

/* ---------------------------- 阵营与国家 ---------------------------- */

const FACTION_NAME = {
  axis: '轴心国', west: '同盟国', sov: '苏联', neutral: '中立国',
};
const FACTION_COLOR = {
  axis: '#43484a', west: '#2f5f9e', sov: '#8f1f16', neutral: '#6f6f6f',
};
const PLAYER_FACTIONS = ['axis', 'west', 'sov'];

// faction 为初始阵营；匈牙利/罗马尼亚/意大利由事件改变
const COUNTRIES = {
  de: { name: '德国',   color: '#66796b', faction: 'axis' },
  it: { name: '意大利', color: '#8fae86', faction: 'axis' },      // 1940-06 参战
  uk: { name: '英国',   color: '#b39b45', faction: 'west' },
  fr: { name: '法国',   color: '#54729e', faction: 'west' },
  pl: { name: '波兰',   color: '#a5703c', faction: 'west' },
  us: { name: '美国',   color: '#4e8a68', faction: 'west' },      // 1941-12 参战
  su: { name: '苏联',   color: '#b03a31', faction: 'sov' },
  es: { name: '西班牙', color: '#a08c5a', faction: 'neutral' },
  pt: { name: '葡萄牙', color: '#7a8c5a', faction: 'neutral' },
  nl: { name: '荷兰',   color: '#b06a3a', faction: 'neutral' },
  be: { name: '比利时', color: '#8a7a3a', faction: 'neutral' },
  se: { name: '瑞典',   color: '#7c8f9c', faction: 'neutral' },
  no: { name: '挪威',   color: '#8aa1a8', faction: 'neutral' },
  dk: { name: '丹麦',   color: '#c0504d', faction: 'neutral' },
  fi: { name: '芬兰',   color: '#9bb0c4', faction: 'neutral' },
  ee: { name: '爱沙尼亚', color: '#81b0a8', faction: 'neutral' },
  lv: { name: '拉脱维亚', color: '#9c8a4e', faction: 'neutral' },
  lt: { name: '立陶宛', color: '#a8843c', faction: 'neutral' },
  ie: { name: '爱尔兰', color: '#79a86b', faction: 'neutral' },
  ch: { name: '瑞士',   color: '#c74e4e', faction: 'neutral' },
  hu: { name: '匈牙利', color: '#8f7a4f', faction: 'neutral' },   // 1940-11 加入轴心
  ro: { name: '罗马尼亚', color: '#b09255', faction: 'neutral' }, // 1940-11 加入轴心
  yu: { name: '南斯拉夫', color: '#7e8ca0', faction: 'neutral' },
  bg: { name: '保加利亚', color: '#96794f', faction: 'neutral' },
  gr: { name: '希腊',   color: '#6f9fc4', faction: 'neutral' },
  tr: { name: '土耳其', color: '#b3603f', faction: 'neutral' },
};

/* ---------------------------- 地图（114×65，0.5°/格） ---------------------------- */

const MAP_ROWS = [
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~mmmmmmmmmfffffffffffffffffffffffffffffffffffffffff~~~~~~ffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~fffmmmmmmmmmffffffffffffffffffffffffffffffffff~~~~~~~~~~fffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~fffffffmmmmmmmmmfffffffffffffffffffffffffffffffff~~~~~~~~ffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffffmmmmmmmffffffffffffffffffffffffffffffffffff~~~~~~~~~ffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffffmmmmmmmffffffffff~~~fffffffffffffffffffffffffff~~~~~~fffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffffmmmmmmmfffffffffff~~~~fffffffffffffffffffffffffff~~~~~ffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffmmmmmmmffffffffffff~~~ffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffmmmmmmmfffffffffff~~~~~fffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffmmmmmmmffffffffffff~~~~~~fffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffmmmmmmmfffffffffffff~~~~~~~fffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffmmmmmmmffffffffffffff~~~~~~~~fffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffmmmmmmmffffffffffffffff~~~~~~~~fffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~mmmmmmmfffffffffffffffffffff~ff~~fffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffffffffffffffffffffffffff~~~~~~ffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffffffffffffffffffffffff~~~~~~~~~fffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~fffffffffffffffffffffff~~~~~~~~~~~~fffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~mmmm~~~~~~~~~~~~~~~~~~~~ffffffffffffffffffff~~~~~~~~ffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~fmmfff~~~~~~~~~~~~~~~~~~~f~~~~~ff~fffffffffff~~fff~~~~fffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~ffffffff~~~~~~~~~~~~~~~~~~~~ffffff~~ffffffffff~~fff~~~~fffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~hhhfffff~~~~~~~~~~~~~~~~~~~fffff~~~fffffffff~~~fff~~~ffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~fmmmffff~~~~~~~~~~~~~~~~~~~fffff~~~~fffff~~~~~~~~~~~~ffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~fmmmffff~~~~~~~~~~~~~~~~~~~fffff~~~~ffff~~~~~~~~~~~~~ffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~fhhf~fffffffff~~~~~~~~~~~~~~~~~~ffffff~~ff~ff~~~~~~~~~~~~~ffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~ffff~~ffffffff~~~~~~~~~~~~~~~~~~ffff~~~~~~~~~~~~~~~~~~~~~~ffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~fffff~ffffffff~~~~~~~~~~~~~~~~~~fffffff~~~fffffffffff~~~ffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~fffffffff~~~~ffffff~~~~~~~~~~~~~~~~~~~~~~fffffff~~~~~~~~~~~~~~ffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~ffffffff~~~ffffffffff~~~~~fff~~~~~~~~fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~ffffffff~~~~fffffffff~~~~~~~~~ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~fffffffff~~hfffffffffffff~~~~~fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~fffffffff~~~~ffffffffffff~~~~~fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~fffff~~~~~~ffffffffffff~~~~fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~fffffffffff=fff...fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~fffffffffffff~fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~fffff~~~~~~~~~fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~fffff~fffffffffffffffffhfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~ffff~~~~~ffffffffffffffhfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~fffff~~~fffffffffffffffhfffffffffffhhhhffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~fffffffffffffffffffffffmmmmmmmmmmmmmfffffffffffffffffffmmmmmfffffffffffffffffffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~ffffffffffffffffffmmmmmmmmmmmmmffffffffffffffffffmmmmmmmffffffffffffffffff~~~~~~~~~fffffffffff',
  '~~~~~~~~~~~~~~~~~~~~ffffffffffffffffffmmmmmmmmmmmmmffffffffffffffffffmmmmmmmffffffff~~~~~~~~~~~~~~~~~~ffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~fffffffffffffffmmmmmmmmmmmmmmmmmfffffffffffffffffmmmmmmmfffffffff~~~~~~~~~~~~~~~~~~ffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~fffffffffffffffmmmmmmmmmmmmmmmmmfffffffffffffffffmmmmmmmffffffffffffffffffff~~~~~ffmmmmmfffff',
  '~~~~~~~~~~~~~~~~~~~~~~fffffffffffffffmmfffffffffffmmmffffffffffffffffmmmmmmmffffff~~~~~~~~~fffffff~~~fffmmmmmmmfff',
  '~~~~~~~~~~~~~~~~~~~~~~fffffffffffffffffffffffffffffffffffffffffffffffmmmmmmmffffff~~~~~~~~~ffffff~~~~fffmmmmmmmfff',
  '~~~~~~~~~~~~~~~~~~~~~~fffffffffffffffmmmfffhhhfff~~~~ffffffffffffffffmmmmmmfffffff~~~~~~~~fffffff~~~ffffmmmmmmmfff',
  '~~~~~~~~~~~~~~~~~~~~~~fffffffffffffffffff~~hhhffff~~~ffffffffffffffffmmmmmmffffffffffffffffffffffffffffffmmmmmmmff',
  '~~~~~~~~~~~~~~~~~~~~~mmmmmmmffffffffff~~mmmfffffhhhff~~~hhhffffffffffffffffffffff~~~~~~~~~~~~~~~~~~~~~~~fmmmmmmmff',
  '~~~~~~~~~~~~~~~~~~~ffmmmmmmmmff~~~~~~~~~~~~~ffffhhhhf~~~hhhfffffffffffffhhhhhffff~~~~~~~~~~~~~~~~~~~~~~~ffmmmmmmmf',
  '~~~~~~ffffffffffffffmmmmmmmmfff~~~~~~~~~~ff~~~~fmmmmf~~~~hhhffffffffffffhhhhhfff~~~~~~~~~~~~~~~~~~~~~~~~~~~fmmmmmf',
  '~~~~~~ffffffffffffffffffffffff~~~~~~~~~~~ff~~~~ffhhhh~~~~hhh~~~fffffffffffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~~fmmmmmf',
  '~~~~~~~ffffffffffffffffffffffff~~~~~~~~~~ff~~~~~ffhhhhff~~~~~~~fffffffff~~~fffff~~~~~~~~~~~~~~~~~~~~~~~~~~~fffffff',
  '~~~~~~~ffffffffffffffffffff~~~~~~~~~~~~~~~ff~~~~~~fhhhhff~~~~~~fmmmfffff~~~~fffffff=ffhhhhhhhhhhhhhhhfffffffffffff',
  '~~~~~~~ffffffffffffffffff~~~~~~~~~~~~~~~~~ffffffffffffmmmffff~~fmmmffff~~~~~ffffffff~~ffhhhhhhhhhhhhhfffffffffffff',
  '~~~~~~~fffffffffffffffff~~~~~ff~~~~~~~~~~~fffffffffffffmmmfff~~fmmmffff~~~~~ffffffffffffhhhhhhhhhhhhhhhfffffffffff',
  '~~~~~~~fffffffffffffffff~~~~~~~~~~~~~~~~~~ffffffffffffffhhh~~~~~~mmmfff~~~~~~~ffffffffffffhhhhhhhhhhhhhhhfffffffff',
  '~~~~~~~fffffffffffffffff~~~~~~~~~~~~~~~~~~fffffffffffffmmm~~~~~~~fmmfff~~~~~~fffffffffffffhhhhhhhhhhhhhhhfffffffff',
  '~~~~~~ffffffffffffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ff~~~~~~~~~ffffff~~~~~~ffffffffffffhhhhhhhhhhhhhfffffffffff',
  '~~~~~~~fffffffffffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~ffff=mmf~~~~~~~~fffffff~~~~~ffffffffffffhhhhhhhhhhhhhfffffffffff',
  '~~~~~~~ffffffffffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~ffffff=ff~~~~~~~~~ffff~~~~~~~ffffffffffffhhhhhhhhhhhhhfffffffffff',
  '~~~~~~~ffffffffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffff~fff~~~~~~~~fff~~~~~~~~ffffffffffffhhhhhhhhhhhhhhhfffffffff',
  '~~~~~~~~~~~fffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffmmmmmfffffffffffffffffffff',
  '~~~~~~~~~~~~~ffffffff~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffmmmmmfffffffffffffffffffffff',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffff~~~~~~~~~~~~fffff~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ffffff~~~~~~~~~~~~~fff~~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
];

/* 城市列表：k=唯一id  n=名称  xy=(列,行)=0.5°经纬度换算  ct=母国  cap=首都  inc=收入 */
const CITIES = [
  // 英国（+北爱尔兰）与爱尔兰
  { k: 'london',   n: '伦敦',     x: 24, y: 30, ct: 'uk', cap: true,  inc: 45 },
  { k: 'birm',     n: '伯明翰',   x: 20, y: 28, ct: 'uk', cap: false, inc: 12 },
  { k: 'manch',    n: '曼彻斯特', x: 20, y: 26, ct: 'uk', cap: false, inc: 20 },
  { k: 'glasgow',  n: '格拉斯哥', x: 15, y: 21, ct: 'uk', cap: false, inc: 15 },
  { k: 'edinburgh',n: '爱丁堡',   x: 18, y: 21, ct: 'uk', cap: false, inc: 12 },
  { k: 'belfast',  n: '贝尔法斯特', x: 12, y: 24, ct: 'uk', cap: false, inc: 8 },
  { k: 'dublin',   n: '都柏林',   x: 11, y: 26, ct: 'ie', cap: true,  inc: 12 },
  // 法国
  { k: 'paris',    n: '巴黎',     x: 29, y: 35, ct: 'fr', cap: true,  inc: 45 },
  { k: 'lille',    n: '里尔',     x: 30, y: 32, ct: 'fr', cap: false, inc: 15 },
  { k: 'strasburg',n: '斯特拉斯堡', x: 39, y: 36, ct: 'fr', cap: false, inc: 15 },
  { k: 'brest',    n: '布雷斯特', x: 15, y: 36, ct: 'fr', cap: false, inc: 15 },
  { k: 'bordeaux', n: '波尔多',   x: 23, y: 43, ct: 'fr', cap: false, inc: 15 },
  { k: 'lyon',     n: '里昂',     x: 34, y: 42, ct: 'fr', cap: false, inc: 15 },
  { k: 'marseille',n: '马赛',     x: 35, y: 46, ct: 'fr', cap: false, inc: 20 },
  // 德国（含 1937 年版图：奥地利/波希米亚/西里西亚/东普鲁士）
  { k: 'berlin',   n: '柏林',     x: 27, y: 28, ct: 'de', cap: true,  inc: 45 },
  { k: 'hamburg',  n: '汉堡',     x: 44, y: 26, ct: 'de', cap: false, inc: 25 },
  { k: 'stettin',  n: '斯德丁',   x: 53, y: 26, ct: 'de', cap: false, inc: 12 },
  { k: 'cologne',  n: '科隆',     x: 38, y: 31, ct: 'de', cap: false, inc: 25 },
  { k: 'frankfurt',n: '法兰克福', x: 41, y: 33, ct: 'de', cap: false, inc: 15 },
  { k: 'munich',   n: '慕尼黑',   x: 47, y: 37, ct: 'de', cap: false, inc: 15 },
  { k: 'breslau',  n: '布雷斯劳', x: 58, y: 31, ct: 'de', cap: false, inc: 15 },
  { k: 'vienna',   n: '维也纳',   x: 57, y: 37, ct: 'de', cap: false, inc: 20 },
  { k: 'prague',   n: '布拉格',   x: 53, y: 33, ct: 'de', cap: false, inc: 20 },
  { k: 'konigsberg', n: '柯尼斯堡', x: 65, y: 24, ct: 'de', cap: false, inc: 15 },
  // 波兰（1939 年版图）
  { k: 'warsaw',   n: '华沙',     x: 66, y: 29, ct: 'pl', cap: true,  inc: 30 },
  { k: 'danzig',   n: '但泽',     x: 60, y: 24, ct: 'pl', cap: false, inc: 15 },
  { k: 'poznan',   n: '波兹南',   x: 58, y: 28, ct: 'pl', cap: false, inc: 12 },
  { k: 'krakow',   n: '克拉科夫', x: 64, y: 33, ct: 'pl', cap: false, inc: 15 },
  { k: 'lwow',     n: '利沃夫',   x: 72, y: 33, ct: 'pl', cap: false, inc: 15 },
  { k: 'wilno',    n: '维尔纽斯', x: 75, y: 24, ct: 'pl', cap: false, inc: 10 },
  // 意大利
  { k: 'rome',     n: '罗马',     x: 49, y: 49, ct: 'it', cap: true,  inc: 40 },
  { k: 'milan',    n: '米兰',     x: 42, y: 42, ct: 'it', cap: false, inc: 25 },
  { k: 'turin',    n: '都灵',     x: 39, y: 43, ct: 'it', cap: false, inc: 15 },
  { k: 'naples',   n: '那不勒斯', x: 53, y: 51, ct: 'it', cap: false, inc: 15 },
  { k: 'palermo',  n: '巴勒莫',   x: 51, y: 57, ct: 'it', cap: false, inc: 15 },
  // 苏联
  { k: 'moscow',   n: '莫斯科',   x: 99, y: 22, ct: 'su', cap: true,  inc: 45 },
  { k: 'leningrad',n: '列宁格勒', x: 85, y: 13, ct: 'su', cap: false, inc: 30 },
  { k: 'gorky',    n: '高尔基',   x: 112, y: 20, ct: 'su', cap: false, inc: 10 },
  { k: 'minsk',    n: '明斯克',   x: 79, y: 25, ct: 'su', cap: false, inc: 20 },
  { k: 'smolensk', n: '斯摩棱斯克', x: 88, y: 25, ct: 'su', cap: false, inc: 12 },
  { k: 'kiev',     n: '基辅',     x: 85, y: 32, ct: 'su', cap: false, inc: 25 },
  { k: 'odessa',   n: '敖德萨',   x: 85, y: 40, ct: 'su', cap: false, inc: 15 },
  { k: 'sevast',   n: '塞瓦斯托波尔', x: 91, y: 44, ct: 'su', cap: false, inc: 15 },
  { k: 'kharkov',  n: '哈尔科夫', x: 96, y: 33, ct: 'su', cap: false, inc: 20 },
  { k: 'staling',  n: '斯大林格勒', x: 113, y: 36, ct: 'su', cap: false, inc: 25 },
  { k: 'rostov',   n: '罗斯托夫', x: 103, y: 39, ct: 'su', cap: false, inc: 15 },
  // 中立国
  { k: 'madrid',   n: '马德里',   x: 17, y: 52, ct: 'es', cap: true,  inc: 25 },
  { k: 'barca',    n: '巴塞罗那', x: 28, y: 50, ct: 'es', cap: false, inc: 15 },
  { k: 'seville',  n: '塞维利亚', x: 12, y: 58, ct: 'es', cap: false, inc: 12 },
  { k: 'lisbon',   n: '里斯本',   x: 6,  y: 56, ct: 'pt', cap: true,  inc: 12 },
  { k: 'porto',    n: '波尔图',   x: 7,  y: 51, ct: 'pt', cap: false, inc: 10 },
  { k: 'amsterdam',n: '阿姆斯特丹', x: 34, y: 28, ct: 'nl', cap: true, inc: 15 },
  { k: 'rotterdam',n: '鹿特丹',   x: 33, y: 29, ct: 'nl', cap: false, inc: 12 },
  { k: 'brussels', n: '布鲁塞尔', x: 33, y: 31, ct: 'be', cap: true,  inc: 15 },
  { k: 'antwerp',  n: '安特卫普', x: 33, y: 30, ct: 'be', cap: false, inc: 12 },
  { k: 'stockholm',n: '斯德哥尔摩', x: 60, y: 14, ct: 'se', cap: true,  inc: 15 },
  { k: 'goteborg', n: '哥德堡',   x: 48, y: 18, ct: 'se', cap: false, inc: 12 },
  { k: 'oslo',     n: '奥斯陆',   x: 45, y: 13, ct: 'no', cap: true,  inc: 15 },
  { k: 'bergen',   n: '卑尔根',   x: 35, y: 12, ct: 'no', cap: false, inc: 12 },
  { k: 'copenhagen', n: '哥本哈根', x: 49, y: 22, ct: 'dk', cap: true, inc: 12 },
  { k: 'helsinki', n: '赫尔辛基', x: 74, y: 13, ct: 'fi', cap: true,  inc: 12 },
  { k: 'tallinn',  n: '塔林',     x: 74, y: 14, ct: 'ee', cap: true,  inc: 10 },
  { k: 'riga',     n: '里加',     x: 72, y: 19, ct: 'lv', cap: true,  inc: 12 },
  { k: 'kaunas',   n: '考纳斯',   x: 72, y: 23, ct: 'lt', cap: true,  inc: 10 },
  { k: 'klaipeda', n: '克莱佩达', x: 66, y: 22, ct: 'lt', cap: false, inc: 8 },
  { k: 'bern',     n: '伯尔尼',   x: 39, y: 39, ct: 'ch', cap: true,  inc: 10 },
  { k: 'budapest', n: '布达佩斯', x: 62, y: 38, ct: 'hu', cap: true,  inc: 20 },
  { k: 'bucharest',n: '布加勒斯特', x: 76, y: 44, ct: 'ro', cap: true,  inc: 25 },
  { k: 'belgrade', n: '贝尔格莱德', x: 65, y: 43, ct: 'yu', cap: true, inc: 15 },
  { k: 'zagreb',   n: '萨格勒布', x: 56, y: 41, ct: 'yu', cap: false, inc: 12 },
  { k: 'sofia',    n: '索菲亚',   x: 71, y: 48, ct: 'bg', cap: true,  inc: 15 },
  { k: 'varna',    n: '瓦尔纳',   x: 80, y: 47, ct: 'bg', cap: false, inc: 10 },
  { k: 'athens',   n: '雅典',     x: 71, y: 57, ct: 'gr', cap: true,  inc: 15 },
  { k: 'salonika', n: '萨洛尼卡', x: 70, y: 52, ct: 'gr', cap: false, inc: 12 },
  { k: 'istanbul', n: '伊斯坦布尔', x: 82, y: 51, ct: 'tr', cap: true, inc: 15 },
  { k: 'ankara',   n: '安卡拉',   x: 90, y: 53, ct: 'tr', cap: false, inc: 20 },
  { k: 'izmir',    n: '伊兹密尔', x: 78, y: 56, ct: 'tr', cap: false, inc: 12 },
];

/* ---------------------------- 各国装备（ recruitable ） ----------------------------
 * 每条: n 名称  cls 兵种  atk/def/mov  cost 花费  rng 射程(炮兵)  yr 解锁年份  nt 备注
 *---------------------------------------------------------------------------- */
const EQUIP = {
  de: {
    inf: [
      { n: '国防军步兵师',     cls: 'inf', atk: 28, def: 30, mov: 3, cost: 60,  yr: 1939, nt: '毛瑟98k / MG34' },
      { n: '武装党卫军师',     cls: 'inf', atk: 32, def: 35, mov: 3, cost: 90,  yr: 1942, nt: '精锐狂热部队' },
    ],
    art: [
      { n: '105mm leFH18 榴弹炮', cls: 'art', atk: 40, def: 12, mov: 2, cost: 130, rng: 2, yr: 1939, nt: '德军师属标准火炮' },
      { n: '88mm FlaK36 高射炮', cls: 'art', atk: 46, def: 16, mov: 2, cost: 165, rng: 2, yr: 1940, nt: '反一切之炮' },
      { n: '古斯塔夫列车炮',   cls: 'art', atk: 78, def: 10, mov: 1, cost: 520, rng: 3, yr: 1943, nt: '800mm 塞瓦斯托波尔攻坚神器' },
    ],
    tank: [
      { n: 'III号坦克',        cls: 'tank', atk: 40, def: 32, mov: 5, cost: 200, yr: 1939, nt: '闪击战主力' },
      { n: 'IV号坦克 F2 型',   cls: 'tank', atk: 46, def: 36, mov: 5, cost: 240, yr: 1942, nt: '长身管 75mm' },
      { n: '虎式重型坦克',     cls: 'tank', atk: 54, def: 46, mov: 4, cost: 300, yr: 1943, nt: '88mm KwK36' },
    ],
    air: [
      { n: '斯图卡俯冲轰炸机', cls: 'air', atk: 42, def: 8, mov: 7, cost: 230, yr: 1939, nt: '尖啸死神' },
    ],
  },
  su: {
    inf: [
      { n: '步兵师',           cls: 'inf', atk: 27, def: 31, mov: 3, cost: 55,  yr: 1939, nt: '波波沙 / 莫辛纳甘' },
      { n: '近卫步兵师',       cls: 'inf', atk: 34, def: 37, mov: 3, cost: 90,  yr: 1943, nt: '斯大林格勒淬炼' },
    ],
    art: [
      { n: '76mm ZiS-3 加农炮', cls: 'art', atk: 38, def: 12, mov: 2, cost: 120, rng: 2, yr: 1939, nt: '百搭师炮' },
      { n: '喀秋莎火箭炮',     cls: 'art', atk: 50, def: 8,  mov: 2, cost: 170, rng: 2, yr: 1941, nt: 'BM-13 火风暴' },
    ],
    tank: [
      { n: 'T-34/76 坦克',     cls: 'tank', atk: 44, def: 36, mov: 5, cost: 210, yr: 1940, nt: '倾斜装甲革命' },
      { n: 'T-34/85 坦克',     cls: 'tank', atk: 50, def: 40, mov: 5, cost: 250, yr: 1944, nt: '85mm 反虎利器' },
    ],
    air: [
      { n: 'Pe-2 轰炸机',      cls: 'air', atk: 38, def: 8, mov: 7, cost: 220, yr: 1942, nt: '俯冲轰炸先锋' },
    ],
  },
  uk: {
    inf: [
      { n: '英联邦步兵师',     cls: 'inf', atk: 27, def: 31, mov: 3, cost: 58,  yr: 1939, nt: '李恩菲尔德步枪' },
    ],
    art: [
      { n: '25磅野战炮',       cls: 'art', atk: 39, def: 13, mov: 2, cost: 125, rng: 2, yr: 1939, nt: '射速见长' },
    ],
    tank: [
      { n: '玛蒂尔达 II 步兵坦克', cls: 'tank', atk: 35, def: 45, mov: 4, cost: 190, yr: 1940, nt: '装甲厚重的移动堡垒' },
      { n: '克伦威尔巡洋坦克', cls: 'tank', atk: 44, def: 34, mov: 6, cost: 230, yr: 1943, nt: '高速突击' },
    ],
    air: [
      { n: '兰开斯特轰炸机',   cls: 'air', atk: 46, def: 9, mov: 7, cost: 250, yr: 1942, nt: '夜间区域轰炸' },
    ],
  },
  fr: {
    inf: [
      { n: '法国步兵师',       cls: 'inf', atk: 26, def: 33, mov: 3, cost: 55,  yr: 1939, nt: '马奇诺防线守备' },
    ],
    art: [
      { n: '75mm 1897 野战炮', cls: 'art', atk: 38, def: 12, mov: 2, cost: 115, rng: 2, yr: 1939, nt: '一战传奇速射炮' },
    ],
    tank: [
      { n: '索玛 S35 坦克',    cls: 'tank', atk: 40, def: 38, mov: 4, cost: 200, yr: 1939, nt: '铸造炮塔先驱' },
      { n: 'B1 重型坦克',      cls: 'tank', atk: 38, def: 47, mov: 3, cost: 210, yr: 1939, nt: '钢铁怪物' },
    ],
    air: [
      { n: '布洛克 MB.210 轰炸机', cls: 'air', atk: 34, def: 8, mov: 6, cost: 200, yr: 1939, nt: '法军主力轰炸机' },
    ],
  },
  pl: {
    inf: [
      { n: '波兰步兵师',       cls: 'inf', atk: 25, def: 29, mov: 3, cost: 50,  yr: 1939, nt: '骑兵反冲锋' },
    ],
    art: [
      { n: '波兰射炮兵营',     cls: 'art', atk: 34, def: 11, mov: 2, cost: 105, rng: 2, yr: 1939, nt: '1930 式加农炮' },
    ],
    tank: [
      { n: '7TP 轻型坦克',     cls: 'tank', atk: 30, def: 27, mov: 5, cost: 150, yr: 1939, nt: '首个柴油发动机坦克' },
    ],
    air: [],
  },
  it: {
    inf: [
      { n: '意大利步兵师',     cls: 'inf', atk: 23, def: 26, mov: 3, cost: 45,  yr: 1939, nt: '卡尔卡诺步枪' },
    ],
    art: [
      { n: '75mm 山地炮',      cls: 'art', atk: 34, def: 11, mov: 3, cost: 105, rng: 2, yr: 1939, nt: '阿尔卑斯山地作战' },
    ],
    tank: [
      { n: 'M13/40 中型坦克',  cls: 'tank', atk: 32, def: 28, mov: 4, cost: 150, yr: 1940, nt: '薄装甲' },
    ],
    air: [
      { n: 'SM.79 轰炸机',     cls: 'air', atk: 36, def: 8, mov: 7, cost: 210, yr: 1939, nt: '三引擎"雀鹰"' },
    ],
  },
  us: { // 美军装备：1942 年起可在伦敦招募，诺曼底登陆时登场
    inf: [
      { n: '美军步兵师',       cls: 'inf', atk: 30, def: 32, mov: 3, cost: 62,  yr: 1942, nt: '加兰德半自动步枪' },
    ],
    art: [
      { n: 'M2 105mm 榴弹炮',  cls: 'art', atk: 42, def: 13, mov: 2, cost: 135, rng: 2, yr: 1942, nt: '标准师属火炮' },
    ],
    tank: [
      { n: '谢尔曼 M4 坦克',   cls: 'tank', atk: 46, def: 38, mov: 5, cost: 230, yr: 1942, nt: '可靠的海量生产' },
    ],
    air: [
      { n: 'B-17 空中堡垒',    cls: 'air', atk: 50, def: 10, mov: 7, cost: 260, yr: 1943, nt: '白昼精确轰炸' },
    ],
  },
  // 中立国家通用老式装备
  neutral: {
    inf: [
      { n: '老式步兵师', cls: 'inf', atk: 22, def: 26, mov: 3, cost: 45, yr: 1939, nt: '一战水平装备' },
    ],
    art: [
      { n: '老式野战炮', cls: 'art', atk: 30, def: 10, mov: 2, cost: 95, rng: 2, yr: 1939, nt: '库存火炮' },
    ],
    tank: [],
    air: [],
  },
};

/* ---------------------------- 将领 ----------------------------
 * 技能 effect 类型:
 *   atk {cls?, m}        攻击力加成(指定兵种或全体)
 *   def {cls?, m}        防御力加成
 *   mov {cls?, n}        移动力加成
 *   nozoc {}             无视敌方控制区
 *   rng {n}              炮兵射程+1
 *   counter {m}          反击伤害加成
 *   citydef {m}          驻守城市时防御加成
 *   vs {tgt, m}          对指定兵种伤害加成
 *   aura {m}             相邻友军攻击加成(光环)
 *   rage {}              自身兵力低于50%时攻击+15%
 *-------------------------------------------------------------- */
const GENERALS = [
  // ---- 德国 ----
  { id: 'guderian', name: '古德里安', ct: 'de', title: '装甲兵之父',
    skills: [{ k: 'atk', cls: 'tank', m: 0.25 }, { k: 'mov', cls: 'tank', n: 2 }, { k: 'nozoc' }],
    bio: '闪击战理论奠基人，1939 年第19装甲军横扫波兰，1940 年阿登突破直抵英吉利海峡，1941 年兵临莫斯科城下。' },
  { id: 'rommel', name: '隆美尔', ct: 'de', title: '沙漠之狐',
    skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'vs', tgt: 'art', m: 0.40 }, { k: 'rage' }],
    bio: '第7装甲师"魔鬼之师"师长，法国战役获骑士十字勋章；非洲军军团长，以少胜多震动北非。' },
  { id: 'manstein', name: '曼施坦因', ct: 'de', title: '战略大师',
    skills: [{ k: 'atk', cls: 'art', m: 0.25 }, { k: 'rng', n: 1 }],
    bio: '"曼施坦因计划"缔造者——装甲集群穿越阿登的镰刀收割；克里米亚与哈尔科夫反击战的名将。' },
  { id: 'model', name: '莫德尔', ct: 'de', title: '防御之狮',
    skills: [{ k: 'def', m: 0.30 }, { k: 'citydef', m: 0.40 }],
    bio: '东线"救火队员"，勒热夫防线令朱可夫顿足，1944 年在奥廖尔与阿登屡屡稳住崩坏战线。' },
  { id: 'kesselring', name: '凯塞林', ct: 'de', title: '空军元帅',
    skills: [{ k: 'atk', cls: 'air', m: 0.25 }, { k: 'def', cls: 'air', m: 0.30 }],
    bio: '波兰与法兰西战役的空中支援组织者，后任地中海战区总司令，构筑了古斯塔夫防线。' },
  // ---- 苏联 ----
  { id: 'zhukov', name: '朱可夫', ct: 'su', title: '胜利元帅',
    skills: [{ k: 'atk', m: 0.20 }, { k: 'def', m: 0.20 }],
    bio: '诺门坎、莫斯科、斯大林格勒、库尔斯克、柏林——几乎每一场决定性胜利都有他的名字。' },
  { id: 'rokossovsky', name: '罗科索夫斯基', ct: 'su', title: '常胜统帅',
    skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'def', cls: 'tank', m: 0.15 }],
    bio: '从战俘营走出的元帅，斯大林格勒合围战与"巴格拉季昂"行动的白俄罗斯方面军司令。' },
  { id: 'konev', name: '科涅夫', ct: 'su', title: '炮兵元帅',
    skills: [{ k: 'atk', cls: 'art', m: 0.25 }],
    bio: '以炮兵火力运用著称的方面军司令，库尔斯克、维斯瓦-奥得河攻势与柏林战役的主力指挥官。' },
  { id: 'chuikov', name: '崔可夫', ct: 'su', title: '城市战之神',
    skills: [{ k: 'citydef', m: 0.50 }, { k: 'counter', m: 0.30 }, { k: 'def', cls: 'inf', m: 0.20 }],
    bio: '斯大林格勒第62集团军司令，"贴身紧逼"战术让德军炮火优势失效，后直捣柏林市中心。' },
  // ---- 西方同盟国 ----
  { id: 'montgomery', name: '蒙哥马利', ct: 'uk', title: '谨慎的猎手',
    skills: [{ k: 'def', m: 0.25 }, { k: 'counter', m: 0.30 }],
    bio: '阿拉曼战役的胜利者，第8集团军统帅；以周密准备和谨慎推进著称，"先胜后战"的信徒。' },
  { id: 'patton', name: '巴顿', ct: 'us', title: '血胆将军',
    skills: [{ k: 'atk', cls: 'tank', m: 0.30 }, { k: 'mov', cls: 'tank', n: 1 }],
    bio: '第3集团军突击先锋，诺曼底突破与阿登反攻的利刃；美国装甲进攻作战的化身。' },
  { id: 'degaulle', name: '戴高乐', ct: 'fr', title: '自由法国领袖',
    skills: [{ k: 'atk', cls: 'tank', m: 0.20 }, { k: 'def', m: 0.10 }],
    bio: '战前装甲战术的鼓吹者，1940 年第4装甲师的反击者；"自由法国"运动的精神旗帜。' },
  { id: 'eisenhower', name: '艾森豪威尔', ct: 'us', title: '盟军最高统帅',
    skills: [{ k: 'aura', m: 0.10 }],
    bio: '霸王行动的组织者，把英美两国众多名将拧成一股绳的外交型统帅。' },
  { id: 'alexander', name: '亚历山大', ct: 'uk', title: '地中海统帅',
    skills: [{ k: 'atk', cls: 'inf', m: 0.15 }, { k: 'def', m: 0.15 }],
    bio: '敦刻尔克断后军长、地中海战区英军总司令，突尼斯与意大利战役的收束者。' },
  // ---- 意大利 ----
  { id: 'messe', name: '梅塞', ct: 'it', title: '远征军司令',
    skills: [{ k: 'atk', cls: 'tank', m: 0.15 }],
    bio: '意大利驻俄远征军(CSIR)与突尼斯第1集团军指挥官，意军中最清醒的职业军人。' },
  { id: 'balbo', name: '巴尔博', ct: 'it', title: '空军先驱',
    skills: [{ k: 'atk', cls: 'air', m: 0.20 }],
    bio: '意大利空军元帅、跨大西洋编队飞行先驱，利比亚总督。' },
];

/* ---------------------------- 历史事件 ----------------------------
 * t: 触发回合(0=1939年9月)  月份换算: turnOf(year, month1based) = (year-1939)*12 + (month-9)
 *-------------------------------------------------------------- */
function turnOf(year, month1) { return (year - 1939) * 12 + (month1 - 9); }

const EVENTS = [
  { t: turnOf(1940, 5),  kind: 'log',   title: '西线闪击战', text: '1940年5月10日，德军发起"黄色方案"，装甲集群穿越阿登森林，法兰西战役爆发。' },
  { t: turnOf(1940, 6),  kind: 'italy', title: '意大利参战', text: '1940年6月10日，墨索里尼向英法宣战，意大利加入轴心国作战。' },
  { t: turnOf(1940, 9),  kind: 'log',   title: '不列颠空战', text: '戈林的德国空军与英国皇家空军在英伦上空展开殊死搏杀，"Never was so much owed by so many to so few."' },
  { t: turnOf(1940, 11), kind: 'axismin', title: '巴尔干加入轴心', text: '1940年11月，匈牙利与罗马尼亚签署三国同盟条约，加入轴心国阵营（其领土与军队归轴心国指挥）。' },
  { t: turnOf(1941, 6),  kind: 'barbarossa', title: '巴巴罗萨行动', text: '1941年6月22日凌晨3时15分，550万轴心国军队越过苏联边境，人类历史上规模最大的地面战争爆发！苏联进行全面动员。' },
  { t: turnOf(1941, 10), kind: 'log', title: '台风行动', text: '德军发起进攻莫斯科的"台风行动"，"冬季将军"即将登上舞台。' },
  { t: turnOf(1941, 12), kind: 'usa', title: '美国参战', text: '珍珠港遇袭，美国正式参战！《租借法案》物资源源不断运抵伦敦，美军先头部队抵达英国。（同盟国收入+40，伦敦可招募美军装备）' },
  { t: turnOf(1942, 7),  kind: 'log', title: '斯大林格勒', text: '保卢斯第6集团军兵临斯大林格勒，人类历史上最惨烈的城市攻防战拉开序幕。' },
  { t: turnOf(1943, 7),  kind: 'log', title: '库尔斯克会战', text: '史上最大规模坦克会战在普罗霍罗夫卡草原爆发，德军最后的战略主动权就此耗尽。' },
  { t: turnOf(1944, 6),  kind: 'dday', title: '诺曼底登陆', text: '1944年6月6日，盟军五个师在诺曼底海滩抢滩登陆，"最长的一日"——第二战场开辟！' },
];

/* ---------------------------- 初始部署 ----------------------------
 * ct 国家  eq "国家:兵种:序号"  gen 将领id  xy 位置（勿占己方招募城市）
 *-------------------------------------------------------------- */
const INITIAL_UNITS = [
  // 德国：21 个单位（西墙 / 波兰边境 / 东普鲁士）
  { ct: 'de', eq: 'de:inf:0',  x: 35, y: 32 },            // 亚琛·西墙
  { ct: 'de', eq: 'de:inf:0',  x: 38, y: 32 },            // 莱茵兰
  { ct: 'de', eq: 'de:inf:0',  x: 40, y: 35 },            // 黑森林
  { ct: 'de', eq: 'de:inf:0',  x: 43, y: 35 },            // 符腾堡
  { ct: 'de', eq: 'de:inf:0',  x: 44, y: 32 },            // 美因茨
  { ct: 'de', eq: 'de:inf:0',  x: 52, y: 27 },            // 波美拉尼亚西
  { ct: 'de', eq: 'de:inf:0',  x: 54, y: 28 },            // 奥得河下游
  { ct: 'de', eq: 'de:inf:0',  x: 56, y: 29 },            // 奥得河中游
  { ct: 'de', eq: 'de:inf:0',  x: 57, y: 31 },            // 下西里西亚
  { ct: 'de', eq: 'de:inf:0',  x: 59, y: 32 },            // 上西里西亚
  { ct: 'de', eq: 'de:inf:0',  x: 61, y: 33 },            // 切申
  { ct: 'de', eq: 'de:inf:0',  x: 64, y: 24 },            // 东普鲁士西
  { ct: 'de', eq: 'de:inf:0',  x: 66, y: 25 },            // 东普鲁士南
  { ct: 'de', eq: 'de:tank:0', x: 55, y: 27, gen: 'guderian' },
  { ct: 'de', eq: 'de:tank:0', x: 56, y: 31, gen: 'rommel' },
  { ct: 'de', eq: 'de:tank:0', x: 59, y: 30 },
  { ct: 'de', eq: 'de:tank:0', x: 62, y: 32 },
  { ct: 'de', eq: 'de:art:0',  x: 57, y: 29, gen: 'manstein' },
      { ct: 'de', eq: 'de:art:0',  x: 67, y: 24 },
  { ct: 'de', eq: 'de:air:0',  x: 48, y: 29, gen: 'kesselring' },
  { ct: 'de', eq: 'de:inf:0',  x: 37, y: 29 },            // 鲁尔以北
  // 波兰：10
  { ct: 'pl', eq: 'pl:inf:0',  x: 60, y: 24 },            // 但泽驻军
  { ct: 'pl', eq: 'pl:inf:0',  x: 59, y: 26 },            // 波兰走廊
  { ct: 'pl', eq: 'pl:inf:0',  x: 57, y: 28 },            // 波兹南
  { ct: 'pl', eq: 'pl:inf:0',  x: 65, y: 29 },            // 华沙以西
  { ct: 'pl', eq: 'pl:inf:0',  x: 67, y: 30 },            // 华沙东南
  { ct: 'pl', eq: 'pl:tank:0', x: 65, y: 28 },
  { ct: 'pl', eq: 'pl:inf:0',  x: 63, y: 34 },            // 克拉科夫以南
  { ct: 'pl', eq: 'pl:inf:0',  x: 73, y: 33 },            // 利沃夫以东
  { ct: 'pl', eq: 'pl:inf:0',  x: 74, y: 25 },            // 维尔纽斯
  { ct: 'pl', eq: 'pl:inf:0',  x: 68, y: 27 },
  // 法国：16
  { ct: 'fr', eq: 'fr:inf:0',  x: 29, y: 31 },            // 佛兰德
  { ct: 'fr', eq: 'fr:inf:0',  x: 31, y: 32 },            // 里尔
  { ct: 'fr', eq: 'fr:inf:0',  x: 28, y: 33 },            // 索姆河
  { ct: 'fr', eq: 'fr:inf:0',  x: 33, y: 33 },            // 阿登西口
  { ct: 'fr', eq: 'fr:inf:0',  x: 35, y: 33 },            // 阿登南口
  { ct: 'fr', eq: 'fr:inf:0',  x: 34, y: 34 },            // 香槟
  { ct: 'fr', eq: 'fr:inf:0',  x: 38, y: 36 },            // 马奇诺·孚日
  { ct: 'fr', eq: 'fr:inf:0',  x: 40, y: 37 },            // 阿尔萨斯南
  { ct: 'fr', eq: 'fr:art:0',  x: 39, y: 37 },            // 马奇诺炮兵
  { ct: 'fr', eq: 'fr:tank:0', x: 30, y: 36, gen: 'degaulle' },
  { ct: 'fr', eq: 'fr:tank:0', x: 27, y: 36 },            // 预备队
  { ct: 'fr', eq: 'fr:inf:0',  x: 17, y: 37 },            // 布列塔尼
  { ct: 'fr', eq: 'fr:inf:0',  x: 33, y: 42 },            // 里昂
  { ct: 'fr', eq: 'fr:inf:0',  x: 36, y: 42 },            // 阿尔卑斯军团
  { ct: 'fr', eq: 'fr:inf:0',  x: 34, y: 46 },            // 马赛
  { ct: 'fr', eq: 'fr:art:0',  x: 36, y: 35 },
  // 英国：9
  { ct: 'uk', eq: 'uk:inf:0',  x: 23, y: 30 },
  { ct: 'uk', eq: 'uk:inf:0',  x: 25, y: 31 },
  { ct: 'uk', eq: 'uk:tank:0', x: 25, y: 30, gen: 'montgomery', yr0: 1940 },
  { ct: 'uk', eq: 'uk:art:0',  x: 24, y: 31 },
  { ct: 'uk', eq: 'uk:inf:0',  x: 19, y: 26 },            // 曼彻斯特
  { ct: 'uk', eq: 'uk:inf:0',  x: 21, y: 28 },            // 伯明翰
  { ct: 'uk', eq: 'uk:inf:0',  x: 16, y: 22 },            // 格拉斯哥
  { ct: 'uk', eq: 'uk:inf:0',  x: 17, y: 21 },            // 爱丁堡
  { ct: 'uk', eq: 'uk:inf:0',  x: 12, y: 24 },            // 贝尔法斯特驻军
  // 苏联：25
  { ct: 'su', eq: 'su:inf:0',  x: 84, y: 14 },
  { ct: 'su', eq: 'su:inf:0',  x: 86, y: 14 },
  { ct: 'su', eq: 'su:inf:0',  x: 82, y: 15 },
  { ct: 'su', eq: 'su:inf:0',  x: 78, y: 26 },
  { ct: 'su', eq: 'su:inf:0',  x: 80, y: 26 },
  { ct: 'su', eq: 'su:inf:0',  x: 84, y: 33 },
  { ct: 'su', eq: 'su:inf:0',  x: 86, y: 33 },
  { ct: 'su', eq: 'su:inf:0',  x: 84, y: 41 },
  { ct: 'su', eq: 'su:inf:0',  x: 92, y: 45 },            // 克里米亚
  { ct: 'su', eq: 'su:inf:0',  x: 98, y: 23 },            // 莫斯科
  { ct: 'su', eq: 'su:inf:0',  x: 95, y: 34 },            // 哈尔科夫
  { ct: 'su', eq: 'su:inf:0',  x: 112, y: 37 },           // 斯大林格勒
  { ct: 'su', eq: 'su:inf:0',  x: 104, y: 40 },           // 罗斯托夫
  { ct: 'su', eq: 'su:inf:0',  x: 111, y: 21 },           // 高尔基
  { ct: 'su', eq: 'su:inf:0',  x: 76, y: 20 },
  { ct: 'su', eq: 'su:inf:0',  x: 75, y: 22 },
  { ct: 'su', eq: 'su:inf:0',  x: 88, y: 25 },            // 斯摩棱斯克
  { ct: 'su', eq: 'su:inf:0',  x: 90, y: 30 },
  { ct: 'su', eq: 'su:inf:0',  x: 86, y: 37 },
  { ct: 'su', eq: 'su:inf:0',  x: 93, y: 38 },
  { ct: 'su', eq: 'su:tank:0', x: 83, y: 26, gen: 'zhukov', yr0: 1940 },
  { ct: 'su', eq: 'su:tank:0', x: 83, y: 28, gen: 'rokossovsky', yr0: 1940 },
  { ct: 'su', eq: 'su:tank:0', x: 86, y: 26, yr0: 1940 },
  { ct: 'su', eq: 'su:art:0',  x: 81, y: 31, gen: 'konev' },
  { ct: 'su', eq: 'su:art:0',  x: 87, y: 32 },
  // 意大利：12（1940-06 参战后激活）
  { ct: 'it', eq: 'it:inf:0',  x: 48, y: 50 },
  { ct: 'it', eq: 'it:inf:0',  x: 50, y: 49 },
  { ct: 'it', eq: 'it:inf:0',  x: 41, y: 42 },            // 米兰
  { ct: 'it', eq: 'it:inf:0',  x: 38, y: 43 },            // 都灵
  { ct: 'it', eq: 'it:inf:0',  x: 52, y: 52 },            // 那不勒斯
  { ct: 'it', eq: 'it:inf:0',  x: 50, y: 58 },            // 西西里
  { ct: 'it', eq: 'it:inf:0',  x: 38, y: 42 },            // 阿尔卑斯山口
  { ct: 'it', eq: 'it:inf:0',  x: 45, y: 44 },            // 利古里亚
  { ct: 'it', eq: 'it:inf:0',  x: 51, y: 50 },
  { ct: 'it', eq: 'it:inf:0',  x: 48, y: 49 },
  { ct: 'it', eq: 'it:art:0',  x: 49, y: 48 },
  { ct: 'it', eq: 'it:tank:0', x: 44, y: 42, gen: 'messe', yr0: 1940 },
  // 中立国守备
  { ct: 'es', eq: 'neutral:inf:0', x: 18, y: 52 },
  { ct: 'es', eq: 'neutral:inf:0', x: 27, y: 50 },
  { ct: 'es', eq: 'neutral:inf:0', x: 11, y: 59 },
  { ct: 'pt', eq: 'neutral:inf:0', x: 7,  y: 57 },
  { ct: 'pt', eq: 'neutral:inf:0', x: 8,  y: 51 },
  { ct: 'ie', eq: 'neutral:inf:0', x: 10, y: 27 },
  { ct: 'nl', eq: 'neutral:inf:0', x: 35, y: 28 },
  { ct: 'nl', eq: 'neutral:inf:0', x: 34, y: 29 },
  { ct: 'be', eq: 'neutral:inf:0', x: 32, y: 31 },
  { ct: 'be', eq: 'neutral:inf:0', x: 34, y: 30 },
  { ct: 'se', eq: 'neutral:inf:0', x: 59, y: 14 },
  { ct: 'se', eq: 'neutral:inf:0', x: 49, y: 18 },
  { ct: 'no', eq: 'neutral:inf:0', x: 46, y: 13 },
  { ct: 'no', eq: 'neutral:inf:0', x: 36, y: 12 },
  { ct: 'dk', eq: 'neutral:inf:0', x: 49, y: 22 },
  { ct: 'fi', eq: 'neutral:inf:0', x: 75, y: 13 },
  { ct: 'ee', eq: 'neutral:inf:0', x: 73, y: 15 },
  { ct: 'lv', eq: 'neutral:inf:0', x: 71, y: 20 },
  { ct: 'lt', eq: 'neutral:inf:0', x: 71, y: 23 },
  { ct: 'lt', eq: 'neutral:inf:0', x: 67, y: 22 },
  { ct: 'ch', eq: 'neutral:inf:0', x: 40, y: 39 },
  { ct: 'hu', eq: 'neutral:inf:0', x: 61, y: 39 },
  { ct: 'ro', eq: 'neutral:inf:0', x: 75, y: 45 },
  { ct: 'yu', eq: 'neutral:inf:0', x: 64, y: 44 },
  { ct: 'yu', eq: 'neutral:inf:0', x: 55, y: 42 },
  { ct: 'bg', eq: 'neutral:inf:0', x: 70, y: 49 },
  { ct: 'bg', eq: 'neutral:inf:0', x: 79, y: 48 },
  { ct: 'gr', eq: 'neutral:inf:0', x: 70, y: 58 },
  { ct: 'gr', eq: 'neutral:inf:0', x: 69, y: 53 },
  { ct: 'tr', eq: 'neutral:inf:0', x: 81, y: 52 },
  { ct: 'tr', eq: 'neutral:inf:0', x: 89, y: 54 },
  { ct: 'tr', eq: 'neutral:inf:0', x: 79, y: 57 },
];

// Node 环境导出（无头测试用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLASSES, TERRAIN, ATK_MOD, FACTION_NAME, FACTION_COLOR, PLAYER_FACTIONS,
    COUNTRIES, MAP_ROWS, CITIES, EQUIP, GENERALS, EVENTS, INITIAL_UNITS, turnOf,
  };
}
