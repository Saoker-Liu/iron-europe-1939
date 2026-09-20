/* =========================================================================
 * Node 侧数据加载器：按依赖顺序加载全部数据模块并装配，导出引擎所需全局。
 * 用法（测试/工具脚本）：const D = require('./load-node.js');
 * ========================================================================= */
'use strict';
const root = globalThis;
root.GameData = root.GameData || { modules: {} };

require('../core/hex.js');
require('../core/geography.js');
require('./map.js');
require('./terrain.js');
require('./nations.js');
require('./economy.js');
require('./military.js');
require('./naval.js');
require('./naval-names.js');
require('./naval-scenario.js');
require('./generals.js');
require('./events.js');
require('../core/assemble.js');
root.GameData.assemble();

module.exports = {
  MAP_W: root.MAP_W,
  MAP_H: root.MAP_H,
  MAP_ROWS: root.MAP_ROWS,
  MAP_META: root.MAP_META,
  HOME_COUNTRIES: root.HOME_COUNTRIES,
  Geography: root.Geography,
  TERRAIN: root.TERRAIN,
  RIVERS: root.RIVERS,
  NAVAL: root.NAVAL,
  CLASSES: root.CLASSES,
  ATK_MOD: root.ATK_MOD,
  FACTION_NAME: root.FACTION_NAME,
  FACTION_COLOR: root.FACTION_COLOR,
  COUNTRIES: root.COUNTRIES,
  CITIES: root.CITIES,
  EQUIP: root.EQUIP,
  GENERALS: root.GENERALS,
  EVENTS: root.EVENTS,
  INITIAL_UNITS: root.INITIAL_UNITS,
  turnOf: root.turnOf,
  START_GOLD: root.START_GOLD,
  ECONOMY: root.ECONOMY,
};
