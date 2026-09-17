/* =========================================================================
 * ④a 经济：各城市收入（按城市 key）、阵营开局资金、事件收入修正
 * ========================================================================= */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  root.GameData = root.GameData || { modules: {} };

  root.GameData.modules.economy = {
    /* 各阵营开局金币 */
    startGold: { axis: 120, west: 120, sov: 120 },
    /* 美国参战后同盟国每回合额外收入 */
    usaIncomeBonus: 40,
    /* 城市收入（金/回合）——按城市 key 索引，与 nations.js 的 CITIES 对应 */
    income: {
      // 英国（+北爱尔兰）与爱尔兰
      london: 45, birm: 12, manch: 20, glasgow: 15, edinburgh: 12, belfast: 8, dublin: 12,
      // 法国
      paris: 45, lille: 15, strasburg: 15, brest: 15, bordeaux: 15, lyon: 15, marseille: 20,
      // 德国
      berlin: 45, hamburg: 25, stettin: 12, cologne: 25, frankfurt: 15, munich: 15,
      breslau: 15, vienna: 20, prague: 20, konigsberg: 15,
      // 波兰
      warsaw: 30, danzig: 15, poznan: 12, krakow: 15, lwow: 15, wilno: 10,
      // 意大利
      rome: 40, milan: 25, turin: 15, naples: 15, palermo: 15,
      // 苏联
      moscow: 45, leningrad: 30, gorky: 10, minsk: 20, smolensk: 12, kiev: 25,
      odessa: 15, sevast: 15, kharkov: 20, staling: 25, rostov: 15,
      // 中立国
      madrid: 25, barca: 15, seville: 12, lisbon: 12, porto: 10,
      amsterdam: 15, rotterdam: 12, brussels: 15, antwerp: 12,
      stockholm: 15, goteborg: 12, oslo: 15, bergen: 12, copenhagen: 12, helsinki: 12,
      tallinn: 10, riga: 12, kaunas: 10, klaipeda: 8,
      bern: 10, budapest: 20, bucharest: 25, belgrade: 15, zagreb: 12,
      sofia: 15, varna: 10, athens: 15, salonika: 12,
      istanbul: 15, ankara: 20, izmir: 12,
    },
  };
})();
