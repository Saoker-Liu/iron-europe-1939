/* =========================================================================
 * unit-icons.js —— 兵种图标（矢量图形，零外部资源、零依赖）
 *
 * 用可辨识的"侧影"替代原先的兵种汉字（步/炮/坦/轰）：
 *   步兵 = 钢盔士兵侧影  ·  炮兵 = 野战炮侧影
 *   装甲 = 坦克侧影      ·  空军 = 俯视轰炸机
 * 收益：任何缩放级别下都能一眼分辨兵种，同时省掉每帧的中文描边文本开销
 * （DEVELOPMENT.md §6.3 已记录 CJK strokeText/fillText 是贵操作）。
 *
 * ── 关键约定（改图形前必读） ───────────────────────────────────────────
 * 1. 每张图是一段 SVG path 的 d 字符串，坐标盒固定为 -50..50（边长 100）。
 *    同一份 d 同时供两条渲染路径使用，Canvas 与 DOM 表现必然一致：
 *      · Canvas：new Path2D(d) → 在归一化坐标系里 scale 后 fill
 *      · DOM   ：<svg viewBox="-50 -50 100 100"><path d="…"/></svg>
 *
 * 2. **环绕方向由 normalizeWinding() 统一**。Canvas 默认 nonzero 填充规则
 *    下，两个方向相反的子路径在重叠处会互相抵消"挖洞"（真实事故：步兵握枪
 *    的手臂与躯干反向，躯干上出现一条透明裂口）。因此：
 *      · 纯多边形子路径：书写时**不必**关心点的顺逆时针，加载时统一为正向；
 *      · 含弧线/曲线的子路径（circle / ring / track）：由生成函数保证方向，
 *        归一化函数会跳过它们。
 *    新增图形时不要用 H/V 简写（只有单个数字，归一化无法解析）。
 *
 * 3. 绘制顺序 = 深色外描边（stroke）→ 白色主体（fill）→ 深色细节层（仅高倍速）。
 *    stroke 的线宽一半落在形状内部，被随后的白色主体完全盖住，于是：
 *      · 只留下一条均匀的外轮廓线；
 *      · 各子路径之间的接缝（炮塔与车体的交界等）也被白色覆盖，不会出现脏线。
 *    **不要改成"把同一路径放大 1.12 倍再填一遍"来描边**：同一个 Path2D 用两个
 *    不同 transform 绘制会让 Chrome 无法复用光栅化缓存，实测从 6.6µs 暴涨到
 *    62µs/单位（同屏 200 单位 = 10.6ms/帧，直接击穿 §6.3 的性能红线）。
 *    此外 stroke+fill 同 transform 也优于"离屏位图 + drawImage"（实测 44.9µs）。
 *
 * 4. 视口剔除、低倍速降级由调用方（ui.js）负责，这里只做绘制。
 * ========================================================================= */
'use strict';

const UnitIcons = (() => {
  const VB = 50;            // 坐标盒半径：x,y ∈ [-50,50]
  const BOX_RATIO = 0.85;   // 图标外接盒 / 六边形格宽 s 的推荐比例

  /* ---------------------- 子路径环绕方向归一化 ---------------------- */
  /* 纯多边形子路径统一为正向（鞋带公式面积 > 0）；含弧线的子路径原样保留。 */
  function normalizeWinding(d) {
    const subs = d.match(/[Mm][^Mm]*/g) || [];
    return subs.map(sub => {
      if (/[AaCcQqSs]/.test(sub)) return sub;              // 弧/曲线：由生成函数负责方向
      const nums = sub.match(/-?\d*\.?\d+/g);
      if (!nums || nums.length < 6) return sub;            // 少于 3 点，填不出面
      const pts = [];
      for (let i = 0; i + 1 < nums.length; i += 2) pts.push([+nums[i], +nums[i + 1]]);
      let area = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        area += a[0] * b[1] - b[0] * a[1];
      }
      if (area > 0) return sub;                            // 已是目标方向
      const rev = pts.slice().reverse();
      return 'M ' + rev.map(p => p[0] + ' ' + p[1]).join(' L ') + ' Z';
    }).join(' ');
  }

  /* ----------------------------- 图形基元 ----------------------------- */
  /* 整圆（约定：顺时针，作为实心子路径） */
  const circle = (cx, cy, r) =>
    `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
  /* 圆环：外圈顺时针 + 内圈逆时针 → 中心挖孔（车轮/轮毂用） */
  const ring = (cx, cy, r, ri) => circle(cx, cy, r) + circle(cx, cy, ri).replace(/0 1 0/g, '0 1 1');
  /* 细长条：从 (x1,y1) 到 (x2,y2)、半宽 w 的四边形（画轮辐/枪管等直线构件） */
  function bar(x1, y1, x2, y2, w) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const px = -dy / L * w, py = dx / L * w;
    return `M ${x1 + px} ${y1 + py} L ${x2 + px} ${y2 + py} L ${x2 - px} ${y2 - py} L ${x1 - px} ${y1 - py} Z`;
  }

  /* ---------------------------- 主体侧影 ---------------------------- */

  /* 装甲：车体 + 炮塔 + 炮管 + 履带（侧视，朝右） */
  const TANK = [
    'M -40 -7 L 26 -7 L 38 6 L -40 6 Z',                    // 车体（首上装甲前倾）
    'M -19 -7 L -13 -27 L 9 -27 L 15 -7 Z',                 // 炮塔
    'M 6 -24 L 48 -24 L 48 -17 L 6 -17 Z',                  // 炮管
    'M -34 6 L 32 6 A 9 9 0 0 1 41 15 A 9 9 0 0 1 32 24 ' +
    'L -34 24 A 9 9 0 0 1 -43 15 A 9 9 0 0 1 -34 6 Z',      // 履带（圆角）
  ].join(' ');

  /* 炮兵：炮管 + 炮闩 + 防盾 + 大轮 + 大架（侧视，炮口指向右上） */
  const ART = [
    'M -6 -16 L 46 -32 L 49 -25 L -3 -9 Z',                 // 炮管（长对角线，主特征）
    'M -22 -17 L -2 -17 L -2 1 L -22 1 Z',                  // 炮闩/摇架
    'M -16 -10 L 2 -10 L 7 6 L -20 6 Z',                    // 防盾
    ring(1, 15, 16, 5.5),                                   // 大轮（挖孔作轮毂）
    'M -4 19 L -46 34 L -46 41 L 2 27 Z',                   // 大架（向后下方撑地）
  ].join(' ');

  /* 步兵：钢盔 + 躯干 + 斜持步枪 + 行进双腿（侧视，朝右） */
  const INF = [
    'M -15 -27 A 14 13 0 0 1 11 -27 Z',                     // 钢盔盔顶
    'M 9 -30 L 20 -26 L 9 -21 Z',                           // 盔檐
    'M -8 -30 L 3 -30 L 3 -20 L -8 -20 Z',                  // 头颈
    'M -13 -22 L 12 -22 L 15 -2 L 12 8 L -11 8 L -13 -2 Z', // 躯干
    'M -9.4 -4.4 L 35.4 -28.4 L 32.6 -23.6 L -6.6 0.4 Z',   // 步枪（斜持）
    'M 0 6 L 10 6 L 17 41 L 6 43 Z',                        // 前腿（前迈）
    'M -11 6 L -2 6 L -9 41 L -20 39 Z',                    // 后腿（后蹬）
    'M 5 40 L 18 40 L 19 46 L 5 46 Z',                      // 前靴
    'M -21 38 L -8 38 L -7 44 L -21 44 Z',                  // 后靴
  ].join(' ');

  /* 空军：俯视轰炸机（圆钝机头 + 后掠翼 + 平尾），机头朝上 */
  const AIR = [
    'M -9 -16 C -9 -34 -6 -46 0 -46 C 6 -46 9 -34 9 -16 ' +
    'L 9 20 L 13 34 L 4 44 L -4 44 L -13 34 L -9 20 Z',     // 机身
    'M -9 -6 L -48 16 L -48 23 L -9 10 Z',                  // 左翼
    'M 9 -6 L 48 16 L 48 23 L 9 10 Z',                      // 右翼
    'M -7 26 L -25 37 L -25 42 L -7 33 Z',                  // 左平尾
    'M 7 26 L 25 37 L 25 42 L 7 33 Z',                      // 右平尾
  ].join(' ');

  const SHAPES = {
    inf: normalizeWinding(INF),
    art: normalizeWinding(ART),
    tank: normalizeWinding(TANK),
    air: normalizeWinding(AIR),
  };

  /* ------------------------------ 细节层 ------------------------------ */
  /* 只在格宽够大时绘制；低倍速略过（否则糊成一团，反而更乱） */

  /* 装甲：5 个负重轮 */
  const TANK_DETAIL = [-30, -15, 0, 15, 30].map(x => circle(x, 15, 6)).join(' ');
  /* 炮兵：3 根轮辐 + 炮口制退器 */
  const ART_DETAIL = [20, 140, 260].map(a => {
    const r = a * Math.PI / 180;
    return bar(1, 15, 1 + Math.cos(r) * 16, 15 + Math.sin(r) * 16, 1.8);
  }).join(' ') + ' ' + bar(43, -30, 49, -28.5, 4.5);
  /* 步兵：钢盔下沿 + 腰带 */
  const INF_DETAIL = 'M -13 -24 L 10 -24 L 10 -21 L -13 -21 Z ' +
    'M -12 0 L 14 0 L 14 3 L -12 3 Z';
  /* 空军：驾驶舱 + 每侧 2 台发动机短舱（共 4 发，重型轰炸机配置） */
  const AIR_DETAIL = circle(0, -28, 5) +
    [15, 31].map(x => circle(x, 2.5 + (x - 10) * 0.45, 4.5)).join(' ') +
    [15, 31].map(x => circle(-x, 2.5 + (x - 10) * 0.45, 4.5)).join(' ');

  const DETAILS = { tank: TANK_DETAIL, art: ART_DETAIL, inf: INF_DETAIL, air: AIR_DETAIL };

  /* ------------------------ 懒加载的 Path2D 缓存 ------------------------ */
  const cShape = {}, cDetail = {};
  function shape(cls) {
    const d = SHAPES[cls] || SHAPES.inf;
    if (!cShape[d]) cShape[d] = new Path2D(d);
    return cShape[d];
  }
  function detailPath(cls) {
    const d = DETAILS[cls];
    if (!d) return null;
    if (!cDetail[d]) cDetail[d] = new Path2D(d);
    return cDetail[d];
  }

  /* ------------------------------- 绘制 ------------------------------- */
  const OUTLINE = 7;   // 外描边线宽（归一化单位，随图标等比缩放；可见宽度约为一半）
  const MIN_OUTLINE_BOX = 9;  // 小于此像素尺寸时省掉描边（此时图标只是个小色块）

  /**
   * 在 (x,y) 处画一枚兵种图标。
   * @param {CanvasRenderingContext2D} cx
   * @param {string} cls   兵种键：inf / art / tank / air
   * @param {number} x,y   屏幕坐标（图标中心）
   * @param {number} box   图标外接盒边长（像素）
   * @param {object} [o]   { detail:boolean 画细节层, dark:string 描边与细节色 }
   */
  function draw(cx, cls, x, y, box, o) {
    const opt = o || {};
    const k = (box * (opt.scale || 1)) / (VB * 2);      // 归一化坐标 → 像素
    const p = shape(cls);
    cx.save();
    cx.translate(x, y);
    cx.scale(k, k);
    // 1) 深色外描边 —— 必须与主体共用同一个 transform（见文件头 §3）
    if (box >= MIN_OUTLINE_BOX) {
      cx.lineJoin = 'round';
      cx.lineWidth = OUTLINE;
      cx.strokeStyle = opt.dark || 'rgba(18,22,28,.92)';
      cx.stroke(p);
    }
    // 2) 白色主体：盖住线宽内半与全部子路径接缝
    cx.fillStyle = '#fff';
    cx.fill(p);
    // 3) 细节层
    if (opt.detail) {
      const d = detailPath(cls);
      if (d) { cx.fillStyle = opt.darkDetail || 'rgba(18,22,28,.5)'; cx.fill(d); }
    }
    cx.restore();
  }

  /* 内联 SVG 版：DOM 场合（招募面板等）用，与 Canvas 同源同形 */
  function svg(cls, size, fill) {
    const d = SHAPES[cls] || SHAPES.inf;
    return `<svg class="u-icon" width="${size}" height="${size}" viewBox="${-VB} ${-VB} ${VB * 2} ${VB * 2}" ` +
      `aria-hidden="true"><path d="${d}" fill="${fill || 'currentColor'}"/></svg>`;
  }

  return { VB, BOX_RATIO, SHAPES, DETAILS, shape, detailPath, draw, svg };
})();

if (typeof window !== 'undefined') window.UnitIcons = UnitIcons;
