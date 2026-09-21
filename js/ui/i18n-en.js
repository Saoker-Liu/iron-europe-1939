/* =========================================================================
 * 英语词典：界面骨架 + 加载器。键 = 原中文字符串（与代码字面量逐字一致）。
 * 后续词典按域追加在 i18n-en-geo.js / i18n-en-mil.js（由 loader 先行加载）。
 * ========================================================================= */
(function () {
  'use strict';
  I18N.add({
    /* ---- 页面骨架 / 顶栏 ---- */
    '钢铁欧陆 1939 · 二战六边形战棋': 'Iron Europe 1939 · WW2 Hex Wargame',
    '钢铁欧陆 1939': 'Iron Europe 1939',
    '正在初始化…': 'Initializing…',
    '地图全览': 'Atlas',
    '查找城市': 'Find City',
    '政区 / 地形': 'Regions / Terrain',
    '隐藏部队': 'Hide Units',
    '🎖 将领': '🎖 Generals',
    '❓ 帮助': '❓ Help',
    '音乐与音效开关（M）': 'Toggle music & sound (M)',
    '音乐与音效开关': 'Toggle music & sound',
    '💾 存档': '💾 Save',
    '⌂ 主菜单': '⌂ Menu',
    '保存当前战役并返回主菜单': 'Save the campaign and return to the main menu',
    '结束回合 ⏎': 'End Turn ⏎',
    /* ---- 战报 / 图例 ---- */
    '📜 战报（点击折叠）': '📜 Dispatches (click to fold)',
    '文字层级：': 'Label tier: ',
    '滚轮缩放切换层级；继续放大即可显示全部城市名。': 'Scroll to switch tiers; zoom in further to reveal every city name.',
    '国家与主要地区': 'Countries & major regions',
    '次级地区与主要城市': 'Secondary regions & major cities',
    '局部地区与主次城市': 'Local areas & cities',
    '全部城市名称': 'All city names',
    '欧洲 · 1939 年开战前夕': 'Europe · Eve of War, 1939',
    '国界基准：1939.08.31　|　★ 首都': 'Borders as of 1939-08-31　|　★ Capital',
    '蓝色实线：河流　|　船字棋子：海上运输部队': 'Blue lines: rivers　|　Ship token: units moving by sea',
    '⚓ 点击海上军港建造舰艇；新舰下回合行动': '⚓ Click a naval port to build ships; new ships act next turn',
    '沿海购买运输舰艇；下海／上岸耗尽行动': 'Buy transports on the coast; embarking / disembarking ends the move',
    '海上移动力固定 5；渡河额外消耗 1 移动力': 'Naval movement is fixed at 5; river crossings cost 1 extra MP',
    '地形：浅绿平原 · 深绿森林 · 褐色丘陵 · 灰色山地': 'Terrain: light-green plains · dark-green forest · brown hills · grey mountains',
    /* ---- 加载器 ---- */
    '加载语言包': 'Loading language pack',
    '加载六边形地图': 'Loading hex map',
    '加载地形与河流': 'Loading terrain & rivers',
    '加载国家与城市': 'Loading countries & cities',
    '加载经济与军事部署': 'Loading economy & order of battle',
    '加载将领与历史事件': 'Loading generals & historical events',
    '装配地图与数据': 'Assembling map & data',
    '初始化引擎': 'Initializing engine',
    '初始化界面': 'Initializing UI',
    '完成': 'Done',
    '资源加载失败: ': 'Failed to load: ',
    'BootUI 未定义（ui.js 加载异常）': 'BootUI is undefined (ui.js failed to load)',
    '加载失败：': 'Load failed: ',
    /* ---- 通用片段 ---- */
    '取消': 'Cancel',
    '关闭': 'Close',
    '继 续': 'Continue',
    '关 闭': 'Close',
    '回合': 'turns',
    '金': ' gold',
    '已行动': 'Done',
    '可行动': 'Ready',
  });
})();
