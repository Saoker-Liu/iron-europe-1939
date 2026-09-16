'use strict';
const { Game } = require('./game.js');
const g = new Game('sov', 'normal');   // 玩家苏联：观察 axis vs west AI 自动互殴
for (let t = 0; t < 12; t++) {
  const { actions } = g.endTurn();
  const battles = actions.filter(a => a.type === 'battle');
  const moves = actions.filter(a => a.type === 'move');
  console.log(`T${g.turn} ${g.dateLabel()} battles=${battles.length} moves=${moves.length} units=${g.units.length} kills=${JSON.stringify(g.stats.kills)}`);
  if (battles.length === 0 && t > 2) {
    // 打印轴心国前沿单位与敌距离，定位为何不打
    const front = g.units.filter(u => g.cf[u.ct] === 'axis').slice(0, 8);
    for (const u of front) {
      let nearest = null, nd = 99;
      for (const e of g.units) {
        if (!g.atWar('axis', g.cf[e.ct])) continue;
        const d = Math.max(Math.abs(u.c-e.c), Math.abs(u.r-e.r));
        if (d < nd) { nd = d; nearest = e; }
      }
      console.log(`  ${u.eq.n}@(${u.c},${u.r}) 最近敌 ${nd} 格 ${nearest ? nearest.eq.n + '@(' + nearest.c + ',' + nearest.r + ')' : '-'} attacked=${u.attacked}`);
    }
    break;
  }
}
