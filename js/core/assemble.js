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

    /* 1. Reproducible geographic grid and fixed 1939 national borders. */
    root.MAP_ROWS = map.rows.slice();
    root.MAP_W = map.width;
    root.MAP_H = map.height;
    root.RIVERS = map.rivers || ter.rivers || [];
    root.MAP_META = map;
    root.HOME_COUNTRIES = map.homes;

    /* 2. 地形类型定义 */
    root.TERRAIN = ter.TERRAIN;

    /* 3. 国家与城市（城市几何来自 nations，收入由 economy 合并） */
    root.COUNTRIES = M.nations.COUNTRIES;
    root.FACTION_NAME = M.nations.FACTION_NAME;
    root.FACTION_COLOR = M.nations.FACTION_COLOR;
    root.CITIES = M.nations.CITIES.map(ci => Object.assign({}, ci, {
      x: map.cityLocations[ci.k][0], y: map.cityLocations[ci.k][1],
      inc: (M.economy.income && M.economy.income[ci.k]) || 0,
    }));

    /* 4. 经济 */
    root.START_GOLD = M.economy.startGold;
    root.ECONOMY = M.economy;

    /* 5. 军事 */
    root.CLASSES = M.military.CLASSES;
    root.ATK_MOD = M.military.ATK_MOD;
    root.EQUIP = M.military.EQUIP;
    root.INITIAL_UNITS = map.deployments.map(u => Object.assign({}, u));

    /* 6. 将领与历史事件 */
    root.GENERALS = M.generals.GENERALS;
    root.EVENTS = M.events.EVENTS;
    root.turnOf = M.events.turnOf;

    return root;
  };
})();
