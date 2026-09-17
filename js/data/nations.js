/* =========================================================================
 * ③ 国家与城市
 * COUNTRIES: 26 国（3 大阵营成员国 + 19 中立国）；颜色用于地图染色与单位描边
 * CITIES: 77 城，坐标 = 0.5° 经纬度换算（col = round(lon*2)+24, row = round((66.5-lat)*2)）
 *         cap=首都（占领→全国易手）；城市收入 inc 见 economy.js（按城市 key 合并）
 * ========================================================================= */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  root.GameData = root.GameData || { modules: {} };

  root.GameData.modules.nations = {
    COUNTRIES: {
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
    },
    FACTION_NAME: {
      axis: '轴心国', west: '同盟国', sov: '苏联', neutral: '中立国',
    },
    FACTION_COLOR: {
      axis: '#43484a', west: '#2f5f9e', sov: '#8f1f16', neutral: '#6f6f6f',
    },
    CITIES: [
      // 英国（+北爱尔兰）与爱尔兰
      { k: 'london',   n: '伦敦',     x: 24, y: 30, ct: 'uk', cap: true },
      { k: 'birm',     n: '伯明翰',   x: 20, y: 28, ct: 'uk' },
      { k: 'manch',    n: '曼彻斯特', x: 20, y: 26, ct: 'uk' },
      { k: 'glasgow',  n: '格拉斯哥', x: 15, y: 21, ct: 'uk' },
      { k: 'edinburgh',n: '爱丁堡',   x: 18, y: 21, ct: 'uk' },
      { k: 'belfast',  n: '贝尔法斯特', x: 12, y: 24, ct: 'uk' },
      { k: 'dublin',   n: '都柏林',   x: 11, y: 26, ct: 'ie', cap: true },
      // 法国
      { k: 'paris',    n: '巴黎',     x: 29, y: 35, ct: 'fr', cap: true },
      { k: 'lille',    n: '里尔',     x: 30, y: 32, ct: 'fr' },
      { k: 'strasburg',n: '斯特拉斯堡', x: 39, y: 36, ct: 'fr' },
      { k: 'brest',    n: '布雷斯特', x: 15, y: 36, ct: 'fr' },
      { k: 'bordeaux', n: '波尔多',   x: 23, y: 43, ct: 'fr' },
      { k: 'lyon',     n: '里昂',     x: 34, y: 42, ct: 'fr' },
      { k: 'marseille',n: '马赛',     x: 35, y: 46, ct: 'fr' },
      // 德国（含 1937 年版图：奥地利/波希米亚/西里西亚/东普鲁士）
      { k: 'berlin',   n: '柏林',     x: 27, y: 28, ct: 'de', cap: true },
      { k: 'hamburg',  n: '汉堡',     x: 44, y: 26, ct: 'de' },
      { k: 'stettin',  n: '斯德丁',   x: 53, y: 26, ct: 'de' },
      { k: 'cologne',  n: '科隆',     x: 38, y: 31, ct: 'de' },
      { k: 'frankfurt',n: '法兰克福', x: 41, y: 33, ct: 'de' },
      { k: 'munich',   n: '慕尼黑',   x: 47, y: 37, ct: 'de' },
      { k: 'breslau',  n: '布雷斯劳', x: 58, y: 31, ct: 'de' },
      { k: 'vienna',   n: '维也纳',   x: 57, y: 37, ct: 'de' },
      { k: 'prague',   n: '布拉格',   x: 53, y: 33, ct: 'de' },
      { k: 'konigsberg', n: '柯尼斯堡', x: 65, y: 24, ct: 'de' },
      // 波兰（1939 年版图）
      { k: 'warsaw',   n: '华沙',     x: 66, y: 29, ct: 'pl', cap: true },
      { k: 'danzig',   n: '但泽',     x: 60, y: 24, ct: 'pl' },
      { k: 'poznan',   n: '波兹南',   x: 58, y: 28, ct: 'pl' },
      { k: 'krakow',   n: '克拉科夫', x: 64, y: 33, ct: 'pl' },
      { k: 'lwow',     n: '利沃夫',   x: 72, y: 33, ct: 'pl' },
      { k: 'wilno',    n: '维尔纽斯', x: 75, y: 24, ct: 'pl' },
      // 意大利
      { k: 'rome',     n: '罗马',     x: 49, y: 49, ct: 'it', cap: true },
      { k: 'milan',    n: '米兰',     x: 42, y: 42, ct: 'it' },
      { k: 'turin',    n: '都灵',     x: 39, y: 43, ct: 'it' },
      { k: 'naples',   n: '那不勒斯', x: 53, y: 51, ct: 'it' },
      { k: 'palermo',  n: '巴勒莫',   x: 51, y: 57, ct: 'it' },
      // 苏联
      { k: 'moscow',   n: '莫斯科',   x: 99, y: 22, ct: 'su', cap: true },
      { k: 'leningrad',n: '列宁格勒', x: 85, y: 13, ct: 'su' },
      { k: 'gorky',    n: '高尔基',   x: 112, y: 20, ct: 'su' },
      { k: 'minsk',    n: '明斯克',   x: 79, y: 25, ct: 'su' },
      { k: 'smolensk', n: '斯摩棱斯克', x: 88, y: 25, ct: 'su' },
      { k: 'kiev',     n: '基辅',     x: 85, y: 32, ct: 'su' },
      { k: 'odessa',   n: '敖德萨',   x: 85, y: 40, ct: 'su' },
      { k: 'sevast',   n: '塞瓦斯托波尔', x: 91, y: 44, ct: 'su' },
      { k: 'kharkov',  n: '哈尔科夫', x: 96, y: 33, ct: 'su' },
      { k: 'staling',  n: '斯大林格勒', x: 113, y: 36, ct: 'su' },
      { k: 'rostov',   n: '罗斯托夫', x: 103, y: 39, ct: 'su' },
      // 中立国
      { k: 'madrid',   n: '马德里',   x: 17, y: 52, ct: 'es', cap: true },
      { k: 'barca',    n: '巴塞罗那', x: 28, y: 50, ct: 'es' },
      { k: 'seville',  n: '塞维利亚', x: 12, y: 58, ct: 'es' },
      { k: 'lisbon',   n: '里斯本',   x: 6,  y: 56, ct: 'pt', cap: true },
      { k: 'porto',    n: '波尔图',   x: 7,  y: 51, ct: 'pt' },
      { k: 'amsterdam',n: '阿姆斯特丹', x: 34, y: 28, ct: 'nl', cap: true },
      { k: 'rotterdam',n: '鹿特丹',   x: 33, y: 29, ct: 'nl' },
      { k: 'brussels', n: '布鲁塞尔', x: 33, y: 31, ct: 'be', cap: true },
      { k: 'antwerp',  n: '安特卫普', x: 33, y: 30, ct: 'be' },
      { k: 'stockholm',n: '斯德哥尔摩', x: 60, y: 14, ct: 'se', cap: true },
      { k: 'goteborg', n: '哥德堡',   x: 48, y: 18, ct: 'se' },
      { k: 'oslo',     n: '奥斯陆',   x: 45, y: 13, ct: 'no', cap: true },
      { k: 'bergen',   n: '卑尔根',   x: 35, y: 12, ct: 'no' },
      { k: 'copenhagen', n: '哥本哈根', x: 49, y: 22, ct: 'dk', cap: true },
      { k: 'helsinki', n: '赫尔辛基', x: 74, y: 13, ct: 'fi', cap: true },
      { k: 'tallinn',  n: '塔林',     x: 74, y: 14, ct: 'ee', cap: true },
      { k: 'riga',     n: '里加',     x: 72, y: 19, ct: 'lv', cap: true },
      { k: 'kaunas',   n: '考纳斯',   x: 72, y: 23, ct: 'lt', cap: true },
      { k: 'klaipeda', n: '克莱佩达', x: 66, y: 22, ct: 'lt' },
      { k: 'bern',     n: '伯尔尼',   x: 39, y: 39, ct: 'ch', cap: true },
      { k: 'budapest', n: '布达佩斯', x: 62, y: 38, ct: 'hu', cap: true },
      { k: 'bucharest',n: '布加勒斯特', x: 76, y: 44, ct: 'ro', cap: true },
      { k: 'belgrade', n: '贝尔格莱德', x: 65, y: 43, ct: 'yu', cap: true },
      { k: 'zagreb',   n: '萨格勒布', x: 56, y: 41, ct: 'yu' },
      { k: 'sofia',    n: '索菲亚',   x: 71, y: 48, ct: 'bg', cap: true },
      { k: 'varna',    n: '瓦尔纳',   x: 80, y: 47, ct: 'bg' },
      { k: 'athens',   n: '雅典',     x: 71, y: 57, ct: 'gr', cap: true },
      { k: 'salonika', n: '萨洛尼卡', x: 70, y: 52, ct: 'gr' },
      { k: 'istanbul', n: '伊斯坦布尔', x: 82, y: 51, ct: 'tr', cap: true },
      { k: 'ankara',   n: '安卡拉',   x: 90, y: 53, ct: 'tr' },
      { k: 'izmir',    n: '伊兹密尔', x: 78, y: 56, ct: 'tr' },
    ],
  };
})();
