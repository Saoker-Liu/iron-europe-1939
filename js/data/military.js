/* =========================================================================
 * ④b 军事：兵种定义、克制表、各国装备树、初始单位部署
 * ========================================================================= */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  root.GameData = root.GameData || { modules: {} };

  root.GameData.modules.military = {
    /* 兵种：glyph 为纯文本标签（地图上已改用矢量侧影图标，图形见 js/ui/unit-icons.js）；
       ranged+baseRange 远程（无反击）；fly 空军（无视地形/ZOC） */
    CLASSES: {
      inf:  { name: '步兵', glyph: '步' },
      art:  { name: '炮兵', glyph: '炮', ranged: true, baseRange: 2, neverCounters: true },
      tank: { name: '装甲', glyph: '坦' },
      air:  { name: '空军', glyph: '轰', fly: true, ignoresZOC: true, ignoresTerrainDef: true },
    },

    /* 克制表 ATK_MOD[攻击方兵种][防御方兵种] */
    ATK_MOD: {
      inf:  { inf: 1.00, art: 1.30, tank: 0.65, air: 0.50 },
      art:  { inf: 1.00, art: 1.10, tank: 1.15, air: 0.60 },
      tank: { inf: 1.15, art: 1.40, tank: 1.00, air: 0.40 },
      air:  { inf: 1.15, art: 1.30, tank: 1.10, air: 1.00 },
    },

    /* 各国装备树：yr = 解锁年份。装备 key 约定 "国家:兵种:序号" */
    EQUIP: {
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
      us: { /* 美军装备：1942 年起可在伦敦招募，诺曼底登陆时登场 */
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
      /* 中立国家通用老式装备 */
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
    },

    /* 初始部署：ct 国家 / eq "国家:兵种:序号" / gen 将领 / xy 六边形坐标
     * 注意：勿与己方招募城市重叠；勿放在海洋格（test_logic 有断言守护） */
    INITIAL_UNITS: [
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
      { ct: 'uk', eq: 'uk:inf:0',  x: 23, y: 30 },            // 伦敦以西
      { ct: 'uk', eq: 'uk:inf:0',  x: 25, y: 31 },            // 肯特
      { ct: 'uk', eq: 'uk:tank:0', x: 25, y: 30, gen: 'montgomery', yr0: 1940 },
      { ct: 'uk', eq: 'uk:art:0',  x: 24, y: 31 },
      { ct: 'uk', eq: 'uk:inf:0',  x: 19, y: 26 },            // 曼彻斯特
      { ct: 'uk', eq: 'uk:inf:0',  x: 21, y: 28 },            // 伯明翰
      { ct: 'uk', eq: 'uk:inf:0',  x: 16, y: 22 },            // 格拉斯哥
      { ct: 'uk', eq: 'uk:inf:0',  x: 17, y: 21 },            // 爱丁堡
      { ct: 'uk', eq: 'uk:inf:0',  x: 12, y: 24 },            // 贝尔法斯特驻军
      // 苏联：25
      { ct: 'su', eq: 'su:inf:0',  x: 87, y: 14 },            // 列宁格勒州
      { ct: 'su', eq: 'su:inf:0',  x: 86, y: 14 },
      { ct: 'su', eq: 'su:inf:0',  x: 82, y: 15 },            // 爱沙尼亚边境
      { ct: 'su', eq: 'su:inf:0',  x: 78, y: 26 },            // 明斯克以西
      { ct: 'su', eq: 'su:inf:0',  x: 80, y: 26 },
      { ct: 'su', eq: 'su:inf:0',  x: 84, y: 33 },            // 基辅
      { ct: 'su', eq: 'su:inf:0',  x: 86, y: 33 },
      { ct: 'su', eq: 'su:inf:0',  x: 84, y: 41 },            // 敖德萨
      { ct: 'su', eq: 'su:inf:0',  x: 92, y: 45 },            // 克里米亚
      { ct: 'su', eq: 'su:inf:0',  x: 98, y: 23 },            // 莫斯科
      { ct: 'su', eq: 'su:inf:0',  x: 95, y: 34 },            // 哈尔科夫
      { ct: 'su', eq: 'su:inf:0',  x: 112, y: 37 },           // 斯大林格勒
      { ct: 'su', eq: 'su:inf:0',  x: 104, y: 40 },           // 罗斯托夫
      { ct: 'su', eq: 'su:inf:0',  x: 111, y: 21 },           // 高尔基
      { ct: 'su', eq: 'su:inf:0',  x: 76, y: 20 },            // 波罗的海边境
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
      { ct: 'it', eq: 'it:inf:0',  x: 48, y: 50 },            // 罗马以北
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
    ],
  };
})();
