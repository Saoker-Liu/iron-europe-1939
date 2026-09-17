/* =========================================================================
 * 六边形数学核心（环境无关：浏览器 window / Node globalThis 均可使用）
 * 由 loader / load-node 最先加载，暴露全局 HexMath。
 * ========================================================================= */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  const SQ3 = Math.sqrt(3);
  const key = (c, r) => c + ',' + r;
  /* 偏移坐标 → 立方坐标（用于距离计算） */
  const cubeOf = (c, r) => {
    const q = c - ((r - (r & 1)) >> 1);
    return [q, r, -q - r];
  };
  /* 两格六边形距离（立方坐标分量差最大值） */
  const hexDist = (c1, r1, c2, r2) => {
    const a = cubeOf(c1, r1), b = cubeOf(c2, r2);
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
  };
  root.HexMath = { SQ3, key, cubeOf, hexDist };
})();
