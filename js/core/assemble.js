/* =========================================================================
 * 数据装配器：把各数据模块合成为引擎所需的扁平全局结构。
 * - 由 loader 在全部数据模块加载完成后调用 GameData.assemble()
 * - 合成结果同时挂到根对象（window/globalThis）上，供 game.js / ui.js 使用
 * ========================================================================= */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  root.GameData = root.GameData || { modules: {} };

  root.GameData.assemble = function () {
    const M = root.GameData.modules;
    const map = M.map, ter = M.terrain;

    /* 1. 地形网格 = 地图骨架（陆/海/浅滩） ⊕ 地形细节（f/h/m 覆盖） */
    const grid = [];
    for (let r = 0; r < map.height; r++) {
      const row = new Array(map.width).fill('~');
      for (const seg of (map.land[r] || [])) {
        for (let c = seg[0]; c <= Math.min(seg[1], map.width - 1); c++) row[c] = '.';
      }
      grid.push(row);
    }
    for (const [c, r] of map.shallows) {
      if (grid[r] && grid[r][c] !== undefined && grid[r][c] !== '~') grid[r][c] = '=';
      else if (grid[r]) grid[r][c] = '=';
    }
    for (let r = 0; r < ter.detail.length; r++) {
      for (const [a, b, ch] of ter.detail[r]) {
        for (let c = a; c <= Math.min(b, map.width - 1); c++) {
          if (grid[r][c] !== '~' && grid[r][c] !== '=') grid[r][c] = ch;
        }
      }
    }
    root.MAP_ROWS = grid.map(row => row.join(''));
    root.MAP_W = map.width;
    root.MAP_H = map.height;
    root.RIVERS = ter.rivers || [];

    /* 2. 地形类型定义 */
    root.TERRAIN = ter.TERRAIN;

    /* 3. 国家与城市（城市几何来自 nations，收入由 economy 合并） */
    root.COUNTRIES = M.nations.COUNTRIES;
    root.FACTION_NAME = M.nations.FACTION_NAME;
    root.FACTION_COLOR = M.nations.FACTION_COLOR;
    root.CITIES = M.nations.CITIES.map(ci => Object.assign({}, ci, {
      inc: (M.economy.income && M.economy.income[ci.k]) || 0,
    }));

    /* 4. 经济 */
    root.START_GOLD = M.economy.startGold;
    root.ECONOMY = M.economy;

    /* 5. 军事 */
    root.CLASSES = M.military.CLASSES;
    root.ATK_MOD = M.military.ATK_MOD;
    root.EQUIP = M.military.EQUIP;
    root.INITIAL_UNITS = M.military.INITIAL_UNITS.map(u => Object.assign({}, u));

    /* 6. 将领与历史事件 */
    root.GENERALS = M.generals.GENERALS;
    root.EVENTS = M.events.EVENTS;
    root.turnOf = M.events.turnOf;

    return root;
  };
})();
