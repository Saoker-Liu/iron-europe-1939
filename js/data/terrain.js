/* Terrain rules. Geographic cells and river paths are generated in map.js. */
(function(){const root=typeof window!=='undefined'?window:globalThis;root.GameData=root.GameData||{modules:{}};root.GameData.modules.terrain={TERRAIN:{
  "~": {
    "name": "海洋",
    "pass": false,
    "cost": null,
    "def": 0,
    "color": "#26415e"
  },
  "l": {
    "name": "湖泊",
    "pass": false,
    "cost": null,
    "def": 0,
    "color": "#3b6c86"
  },
  "x": {
    "name": "战区外陆地",
    "pass": false,
    "cost": null,
    "def": 0,
    "color": "#8b897c"
  },
  ".": {
    "name": "平原",
    "pass": true,
    "cost": {
      "inf": 1,
      "tank": 1,
      "art": 1,
      "air": 1
    },
    "def": 0,
    "color": "#7d9059"
  },
  "f": {
    "name": "森林",
    "pass": true,
    "cost": {
      "inf": 2,
      "tank": 2,
      "art": 2,
      "air": 1
    },
    "def": 0.3,
    "color": "#4c7040"
  },
  "h": {
    "name": "丘陵",
    "pass": true,
    "cost": {
      "inf": 2,
      "tank": 2,
      "art": 2,
      "air": 1
    },
    "def": 0.4,
    "color": "#8c8154"
  },
  "m": {
    "name": "山地",
    "pass": true,
    "cost": {
      "inf": 3,
      "tank": 3,
      "art": 3,
      "air": 1
    },
    "def": 0.6,
    "color": "#8f867d"
  },
  "c": {
    "name": "城市",
    "pass": true,
    "cost": {
      "inf": 1,
      "tank": 1,
      "art": 1,
      "air": 1
    },
    "def": 0.4,
    "color": "#8a8273"
  }
}};})();
