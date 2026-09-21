/* =========================================================================
 * ⑥ 历史事件：t = 触发回合（turnOf(年, 月) 换算，1939年9月 = 回合 0）
 * kind: log 纯叙事 / italy 意大利入轴 / axismin 匈罗入轴 / barbarossa 对苏宣战+动员
 *       usa 美国参战 / dday 诺曼底登陆（效果分支见 game.js processEvents）
 * ========================================================================= */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  root.GameData = root.GameData || { modules: {} };

  function turnOf(year, month1) { return (year - 1939) * 12 + (month1 - 9); }

  root.GameData.modules.events = {
    turnOf,
    EVENTS: [
      { t: turnOf(1939,11),kind:'winterwar',title:'苏芬冬季战争',text:'苏联与芬兰爆发局部战争，不牵涉英法等国。芬兰夺取列宁格勒可迫使停战；苏联夺取赫尔辛基后以芬兰割让卡累利阿换取停战，芬兰保留独立。' },
      { t: turnOf(1940,6),kind:'baltic',title:'苏联向波罗的海三国发出最后通牒',text:'苏联吞并仍独立且未加入大国阵营的爱沙尼亚、拉脱维亚和立陶宛，接收全部领土，三国军事单位解散。月回合将最后通牒与随后吞并合并结算。' },
      { t: turnOf(1940,6),kind:'bessarabia',title:'苏联要求割让比萨拉比亚',text:'罗马尼亚向苏联割让基希讷乌及其比萨拉比亚附属地区，当地罗马尼亚部队撤回本国。' },
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
    ],
  };
})();
