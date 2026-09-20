/* =========================================================================
 * unit-icons.js —— 兵种图标（矢量图形，零外部资源、零依赖）
 *
 * 用可辨识的"侧影"替代原先的兵种汉字（步/炮/坦/轰 + 舰种字）：
 *   步兵 = 钢盔士兵侧影  ·  炮兵 = 野战炮侧影
 *   装甲 = 坦克侧影      ·  空军 = 俯视机群（通用形 + air.js 七机种角色各一形）
 *   海军 = 八舰种侧影（sub 潜艇 · dd 驱逐舰 · cl/ca 巡洋舰 · bc/bb 主力舰 ·
 *          cve/cv 航母）  ·  海运陆军 = 运输船侧影
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

  /* ---- 空军：俯视侧影，机头朝上 ----
   * 通用形（air，兜底用）+ air.js 七个机种角色各一形。图标只表达"机型类别"，
   * 具体型号（Bf 109 / 飓风 / 零战……）在面板里点名——这正是设计取舍：
   * 同一角色下各国机型轮廓相似（单发制空机就是单发制空机），画型号必然画不准；
   * 而角色之间的差异（单发/双发/四发、鸥翼、鱼雷、双垂尾）是俯视轮廓上一眼可辨的。
   * 每个角色一个一眼可辨的主特征：
   *   fighter 轻型战斗机=小翼展单发  · heavy 重型战斗机=双发短舱前伸+双垂尾
   *   cas 近地支援机=鸥翼折角+翼炮吊舱 · naval 海军轰炸机=鱼雷前伸过机头
   *   tactical 战术轰炸机=宽玻璃机头双发 · strategic 战略轰炸机=四发全图最宽
   *   transport 运输机=等弦长直翼+粗钝机身 */
  const AIR = [
    'M -9 -16 C -9 -34 -6 -46 0 -46 C 6 -46 9 -34 9 -16 ' +
    'L 9 20 L 13 34 L 4 44 L -4 44 L -13 34 L -9 20 Z',     // 机身
    'M -9 -6 L -48 16 L -48 23 L -9 10 Z',                  // 左翼
    'M 9 -6 L 48 16 L 48 23 L 9 10 Z',                      // 右翼
    'M -7 26 L -25 37 L -25 42 L -7 33 Z',                  // 左平尾
    'M 7 26 L 25 37 L 25 42 L 7 33 Z',                      // 右平尾
  ].join(' ');

  /* 轻型战斗机：全图最小翼展（Bf 109／飓风／零战的原型学——单发、纤细、灵巧） */
  const AIR_FIGHTER = [
    'M 0 -45 L 3.5 -40 L 5 -30 L 5 -8 L 4 12 L 2.5 30 L 1 40 L 0 44 ' +
    'L -1 40 L -2.5 30 L -4 12 L -5 -8 L -5 -30 L -3.5 -40 Z',  // 机身（细长锥尾）
    'M -2 -12 L -33 -3 L -35 6 L -2 10 Z',                  // 左翼（梯形，略后掠）
    'M 2 -12 L 33 -3 L 35 6 L 2 10 Z',                      // 右翼
    'M -1.5 28 L -19 35 L -19 40 L -1.5 34 Z',              // 左平尾
    'M 1.5 28 L 19 35 L 19 40 L 1.5 34 Z',                  // 右平尾
  ].join(' ');

  /* 重型战斗机：双发短舱大幅前伸 + 平尾双垂尾（Bf 110／英俊战士的原型学） */
  const AIR_HEAVY = [
    'M 0 -44 L 4.5 -38 L 5 -18 L 4 4 L 2.5 24 L 1.5 42 L 0 45 ' +
    'L -1.5 42 L -2.5 24 L -4 4 L -5 -18 L -4.5 -38 Z',     // 机身（比轻型机略粗）
    'M -3 -6 L -36 1 L -38 9 L -3 13 Z',                    // 左翼
    'M 3 -6 L 36 1 L 38 9 L 3 13 Z',                        // 右翼
    'M -12 -28 L -23 -23 L -26 6 L -15 9 Z',                // 左短舱（前伸出翼前缘，主特征）
    'M 12 -28 L 23 -23 L 26 6 L 15 9 Z',                    // 右短舱
    'M -2 28 L -17 35 L -17 40 L -2 33 Z',                  // 左平尾
    'M 2 28 L 17 35 L 17 40 L 2 33 Z',                      // 右平尾
    'M -13 36 L -18 46 L -13 48 L -10 40 Z',                // 双垂尾（主特征）左
    'M 13 36 L 18 46 L 13 48 L 10 40 Z',                    // 右
  ].join(' ');

  /* 近地支援机：鸥翼折角 + 翼炮吊舱（Ju 87 斯图卡／Il-2 的原型学——对地攻击的视觉符号） */
  const AIR_CAS = [
    'M 0 -46 L 5.5 -40 L 6 -34 L 6.5 -20 L 5 10 L 3 26 L 1.5 40 L 0 44 ' +
    'L -1.5 40 L -3 26 L -5 10 L -6.5 -20 L -6 -34 L -5.5 -40 Z',  // 机身（宽机鼻散热器）
    'M -3 -18 L -17 -8 L -18 3 L -3 7 Z',                   // 左内翼（上反，前缘前伸）
    'M 3 -18 L 17 -8 L 18 3 L 3 7 Z',                       // 右内翼
    'M -17 -5 L -37 1 L -38 9 L -18 9 Z',                   // 左外翼（下反，方翼尖）
    'M 17 -5 L 37 1 L 38 9 L 18 9 Z',                       // 右外翼
    'M -19 -9 L -25 -6 L -24 -1 L -18 -2 Z',                // 左翼炮吊舱（前伸过前缘，主特征）
    'M 19 -9 L 25 -6 L 24 -1 L 18 -2 Z',                    // 右翼炮吊舱
    'M -1.5 30 L -18 37 L -18 42 L -1.5 35 Z',              // 左平尾
    'M 1.5 30 L 18 37 L 18 42 L 1.5 35 Z',                  // 右平尾
  ].join(' ');

  /* 海军轰炸机：鱼雷挂在机腹、前伸超出机头（剑鱼／复仇者／SM.79 的原型学） */
  const AIR_NAVAL = [
    'M 0 -42 L 5 -36 L 6 -14 L 4.5 12 L 3 28 L 1.5 42 L 0 45 ' +
    'L -1.5 42 L -3 28 L -4.5 12 L -6 -14 L -5 -36 Z',      // 机身
    bar(0, -45, 0, -16, 4) + ' ' + circle(0, -45, 4),       // 鱼雷（主特征：圆头前伸过机头）
    'M -3 -10 L -38 -2 L -41 9 L -3 12 Z',                  // 左翼（宽翼展，圆钝翼形）
    'M 3 -10 L 38 -2 L 41 9 L 3 12 Z',                      // 右翼
    'M -1.5 30 L -19 37 L -19 42 L -1.5 35 Z',              // 左平尾
    'M 1.5 30 L 19 37 L 19 42 L 1.5 35 Z',                  // 右平尾
  ].join(' ');

  /* 战术轰炸机：宽玻璃机头 + 两台半埋短舱（He 111／B-25／Pe-2 的原型学） */
  const AIR_TACTICAL = [
    'M 0 -44 L 6 -38 L 7.5 -24 L 6.5 6 L 4 26 L 2 40 L 0 45 ' +
    'L -2 40 L -4 26 L -6.5 6 L -7.5 -24 L -6 -38 Z',       // 机身（比重型机粗，机头宽=玻璃机鼻）
    'M -4 -8 L -41 0 L -43 9 L -4 13 Z',                    // 左翼
    'M 4 -8 L 41 0 L 43 9 L 4 13 Z',                        // 右翼
    'M -12 -22 L -21 -18 L -23 6 L -14 8 Z',                // 左短舱（半埋，前伸少于重型机）
    'M 12 -22 L 21 -18 L 23 6 L 14 8 Z',                    // 右短舱
    'M -2 28 L -19 35 L -19 40 L -2 33 Z',                  // 左平尾
    'M 2 28 L 19 35 L 19 40 L 2 33 Z',                      // 右平尾
  ].join(' ');

  /* 战略轰炸机：四发、全图最宽翼展（B-17／兰开斯特／He 177 的原型学） */
  const AIR_STRATEGIC = [
    'M 0 -46 L 6.5 -40 L 8 -22 L 7 8 L 4.5 30 L 2 44 L 0 47 ' +
    'L -2 44 L -4.5 30 L -7 8 L -8 -22 L -6.5 -40 Z',       // 机身（全图最长）
    'M -5 -10 L -47 -1 L -49 10 L -5 14 Z',                 // 左翼（±49：顶满坐标盒）
    'M 5 -10 L 47 -1 L 49 10 L 5 14 Z',                     // 右翼
    'M -9 -30 L -19 -26 L -21 4 L -11 6 Z',                 // 左内短舱
    'M 9 -30 L 19 -26 L 21 4 L 11 6 Z',                     // 右内短舱
    'M -29 -22 L -38 -19 L -40 8 L -31 10 Z',               // 左外短舱（四发＝主特征）
    'M 29 -22 L 38 -19 L 40 8 L 31 10 Z',                   // 右外短舱
    'M -2 32 L -22 39 L -22 44 L -2 37 Z',                  // 左平尾（宽）
    'M 2 32 L 22 39 L 22 44 L 2 37 Z',                      // 右平尾
  ].join(' ');

  /* 运输机：等弦长直翼 + 粗钝机身（Ju 52／C-47／Li-2 的原型学——货机的方盒子气质） */
  const AIR_TRANSPORT = [
    'M 0 -42 L 7 -35 L 8.5 -18 L 8 10 L 6 28 L 3 42 L 0 46 ' +
    'L -3 42 L -6 28 L -8 10 L -8.5 -18 L -7 -35 Z',        // 机身（全机种最粗）
    'M -4 -14 L -44 -9 L -45 7 L -4 10 Z',                  // 左翼（等弦长直翼：前缘后缘平行）
    'M 4 -14 L 44 -9 L 45 7 L 4 10 Z',                      // 右翼
    'M -12 -26 L -22 -23 L -23 8 L -13 9 Z',                // 左短舱
    'M 12 -26 L 22 -23 L 23 8 L 13 9 Z',                    // 右短舱
    'M -2 30 L -22 37 L -22 43 L -2 36 Z',                  // 左平尾（大）
    'M 2 30 L 22 37 L 22 43 L 2 36 Z',                      // 右平尾
  ].join(' ');

  /* ---- 独立海军（naval.js 八舰种）+ 海运陆军（economy.transports） ----
   * 舰体侧视，舰艏朝右，与坦克／火炮的朝向一致。设计语言：
   *   · 舰体低矮、上层建筑向上伸展——圆形国徽棋子上"下重上轻"才像船；
   *   · 每舰种一个一眼可辨的主特征，保证 15px 面板图标与低倍速地图格仍可区分：
   *     潜艇=低矮指挥塔+潜望镜  驱逐舰=单烟囱小舰体  轻巡=双烟囱+单桅
   *     重巡=单粗烟囱+三炮塔   战巡=细长舰体+两座高烟囱  战列舰=高塔楼+深舰体
   *     航母=全通甲板+大岛式舰桥  护航航母=小舰体+窄甲板+小舰岛
   * 与陆军图标相同：相邻子路径必须重叠 1—2 个坐标单位，让白色主体盖住接缝。 */
  const NAVAL_SUB = [
    'M -46 9 L -40 -2 L -6 -6 L 26 -4 L 45 2 L 40 9 L -38 12 Z',  // 耐压壳（雪茄形）
    'M -14 -4 L 6 -4 L 4 -20 L -12 -20 Z',                        // 指挥塔
    'M -6 -18 L -4 -33 L -2 -33 L 0 -18 Z',                       // 潜望镜
    'M -46 3 L -33 -1 L -33 5 L -46 8 Z',                         // 尾舵
    'M 30 -5 L 42 -10 L 43 -5 L 31 -1 Z',                         // 艏升降舵
  ].join(' ');
  const NAVAL_DD = [
    'M -40 7 L -34 -1 L 18 -5 L 42 1 L 44 5 L 37 10 L -34 11 Z',  // 单薄舰体
    'M 4 -3 L 15 -3 L 13 -15 L 5 -15 Z',                          // 舰桥
    'M -8 -3 L 0 -3 L -2 -22 L -10 -22 Z',                        // 单烟囱（主特征）
    'M 22 -3 L 29 -3 L 28 -11 L 23 -11 Z',                        // 前主炮
    'M -26 0 L -15 0 L -16 -10 L -25 -10 Z',                      // 后甲板室
  ].join(' ');
  const NAVAL_CL = [
    'M -46 8 L -40 -1 L 22 -5 L 45 1 L 47 6 L 40 11 L -40 12 Z',
    'M 8 -3 L 19 -3 L 17 -17 L 10 -17 Z',                         // 舰桥
    bar(13, -17, 9, -31, 1.5),                                    // 单桅
    'M -4 -3 L 4 -3 L 2 -20 L -6 -20 Z',                          // 双烟囱（主特征）
    'M -18 -3 L -10 -3 L -12 -19 L -20 -19 Z',
    'M 26 -3 L 34 -3 L 33 -12 L 27 -12 Z',                        // 前主炮
    'M -33 2 L -25 2 L -26 -7 L -32 -7 Z',                        // 尾炮
  ].join(' ');
  const NAVAL_CA = [
    'M -48 9 L -42 -1 L 24 -6 L 47 1 L 49 6 L 42 12 L -42 13 Z',  // 更深的舰体
    'M 10 -4 L 23 -4 L 21 -19 L 12 -19 Z',                        // 块状舰桥
    bar(16, -19, 12, -31, 1.5),
    'M -2 -4 L 8 -4 L 6 -24 L -4 -24 Z',                          // 单粗烟囱（与轻巡区分）
    'M 28 -4 L 38 -4 L 37 -14 L 29 -14 Z',                        // 三座炮塔（主特征）
    'M -14 -1 L -4 -1 L -5 -11 L -13 -11 Z',
    'M -36 2 L -26 2 L -27 -8 L -35 -8 Z',
  ].join(' ');
  const NAVAL_BC = [
    'M -49 8 L -44 -1 L 28 -6 L 48 1 L 50 6 L 43 12 L -44 13 Z',  // 最长的舰体
    'M 12 -4 L 23 -4 L 21 -15 L 14 -15 Z',                        // 低矮舰桥
    'M 0 -4 L 9 -4 L 6 -26 L -3 -26 Z',                           // 两座高烟囱（主特征）
    'M -18 -4 L -9 -4 L -12 -24 L -21 -24 Z',
    'M 30 -4 L 42 -4 L 41 -15 L 31 -15 Z',                        // 前主炮
    'M -39 2 L -28 2 L -29 -9 L -38 -9 Z',                        // 尾主炮
  ].join(' ');
  const NAVAL_BB = [
    'M -49 9 L -44 -1 L 26 -7 L 47 1 L 49 7 L 42 14 L -44 15 Z',  // 最深的舰体
    'M 4 -5 L 22 -5 L 19 -20 L 7 -20 Z',                          // 舯楼
    'M 8 -18 L 18 -18 L 16 -33 L 10 -33 Z',                       // 高塔楼（主特征，全图最高点）
    'M -6 -5 L 2 -5 L 0 -22 L -8 -22 Z',                          // 宽烟囱
    'M 28 -5 L 41 -5 L 40 -17 L 29 -17 Z',                        // 前主炮
    'M -20 -1 L -9 -1 L -10 -12 L -19 -12 Z',                     // 中部后主炮
    'M -40 3 L -30 3 L -31 -7 L -39 -7 Z',                        // 尾主炮
  ].join(' ');
  const NAVAL_CV = [
    'M -48 9 L -44 1 L 32 1 L 47 6 L 43 13 L -44 14 Z',
    'M -49 -9 L 50 -9 L 50 2 L -49 2 Z',                          // 全通飞行甲板（主特征）
    'M 12 -7 L 28 -7 L 26 -21 L 14 -21 Z',                        // 大型岛式舰桥
    bar(20, -21, 17, -30, 1.4),
  ].join(' ');
  const NAVAL_CVE = [
    'M -38 8 L -34 1 L 28 1 L 41 5 L 37 11 L -34 12 Z',           // 小舰体
    'M -42 -6 L 46 -6 L 47 3 L -43 3 Z',                          // 窄长的飞行甲板
    'M 16 -4 L 25 -4 L 24 -13 L 17 -13 Z',                        // 小型舰岛
  ].join(' ');
  const TRANSPORT = [
    'M -47 9 L -42 1 L 30 1 L 46 6 L 42 13 L -42 14 Z',
    'M 0 3 L 14 3 L 12 -14 L 2 -14 Z',                            // 船楼
    'M 4 -12 L 10 -12 L 9 -20 L 5 -20 Z',                         // 烟囱
    'M 20 3 L 30 3 L 29 -6 L 21 -6 Z',                            // 货舱口
    'M 34 3 L 42 3 L 41 -5 L 35 -5 Z',
    'M -24 3 L -14 3 L -15 -6 L -23 -6 Z',
    bar(25, -6, 21, -20, 1.3),                                    // 吊杆桅
    bar(-19, -6, -23, -18, 1.3),
  ].join(' ');

  const SHAPES = {
    inf: normalizeWinding(INF),
    art: normalizeWinding(ART),
    tank: normalizeWinding(TANK),
    air: normalizeWinding(AIR),
    airFighter: normalizeWinding(AIR_FIGHTER),
    airHeavy: normalizeWinding(AIR_HEAVY),
    airCas: normalizeWinding(AIR_CAS),
    airNaval: normalizeWinding(AIR_NAVAL),
    airTactical: normalizeWinding(AIR_TACTICAL),
    airStrategic: normalizeWinding(AIR_STRATEGIC),
    airTransport: normalizeWinding(AIR_TRANSPORT),
    sub: normalizeWinding(NAVAL_SUB),
    dd: normalizeWinding(NAVAL_DD),
    cl: normalizeWinding(NAVAL_CL),
    ca: normalizeWinding(NAVAL_CA),
    bc: normalizeWinding(NAVAL_BC),
    bb: normalizeWinding(NAVAL_BB),
    cve: normalizeWinding(NAVAL_CVE),
    cv: normalizeWinding(NAVAL_CV),
    transport: normalizeWinding(TRANSPORT),
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
  /* 空军（通用兜底形）：驾驶舱 + 每侧 2 台发动机短舱（共 4 发，重型轰炸机配置） */
  const AIR_DETAIL = circle(0, -28, 5) +
    [15, 31].map(x => circle(x, 2.5 + (x - 10) * 0.45, 4.5)).join(' ') +
    [15, 31].map(x => circle(-x, 2.5 + (x - 10) * 0.45, 4.5)).join(' ');
  /* 各机种角色：螺旋桨桨盘 + 座舱盖等（保持轻量，细节只在 s>=18 出现） */
  const AIR_FIGHTER_DETAIL = circle(0, -42, 3) + ' ' + circle(0, -4, 4.5) + ' ' + // 桨盘 + 座舱盖
    bar(-5, -20, 5, -20, 1.2);                                        // 天线桅横杆
  const AIR_HEAVY_DETAIL = circle(-19, -26, 3.5) + ' ' + circle(19, -26, 3.5) + ' ' + // 双桨盘
    bar(-3.5, -8, 3.5, -2, 4.5);                                      // 串列座舱盖
  const AIR_CAS_DETAIL = bar(-4, -26, 4, -14, 4) + ' ' + circle(0, -42, 4) + ' ' +  // 长座舱盖 + 散热器
    bar(-24, -6.5, -19, -5, 1.6) + ' ' + bar(24, -6.5, 19, -5, 1.6);  // 翼炮炮管
  const AIR_NAVAL_DETAIL = bar(-3.5, -20, 3.5, -34, 4) + ' ' + circle(0, -45, 2) + ' ' + // 座舱 + 鱼雷圆头
    circle(0, -37, 3);                                                // 螺旋桨桨盘
  const AIR_TACTICAL_DETAIL = circle(0, -37, 5) + ' ' + bar(-4, -14, 4, -8, 4.5) + ' ' + // 玻璃机鼻 + 座舱
    circle(-17, -20, 3.5) + ' ' + circle(17, -20, 3.5);               // 双桨盘
  const AIR_STRATEGIC_DETAIL = bar(-4, -16, 4, -10, 5) + ' ' +                       // 机头座舱
    circle(-15, -28, 3.5) + ' ' + circle(15, -28, 3.5) + ' ' +       // 内侧桨盘
    circle(-34, -20.5, 3.5) + ' ' + circle(34, -20.5, 3.5) + ' ' +   // 外侧桨盘
    circle(0, 44, 2.5);                                               // 尾炮位
  const AIR_TRANSPORT_DETAIL = bar(-5, -30, 5, -24, 4.5) + ' ' +                     // 座舱
    circle(-17, -25, 3.5) + ' ' + circle(17, -25, 3.5) + ' ' +       // 双桨盘
    bar(-8.5, 0, 8.5, 0, 1.4);                                        // 机身蒙皮分段线
  /* 海军：主炮炮管 / 测距仪 / 甲板中线等（炮管一律指向舰艏方向外侧） */
  const NAVAL_SUB_DETAIL = bar(20, -6, 32, -11, 1.8) + ' ' +          // 甲板炮
    circle(-20, 3, 2) + ' ' + circle(-13, 3, 2);                      // 舷侧通海阀
  const NAVAL_DD_DETAIL = bar(28, -11, 41, -15, 1.4) + ' ' +          // 前主炮炮管
    bar(-20, -10, -33, -14, 1.4) + ' ' +                              // 后炮
    bar(-9, -22, -1, -22, 1.6);                                       // 烟囱帽
  const NAVAL_CL_DETAIL = bar(33, -12, 46, -16, 1.4) + ' ' +          // 前炮管
    bar(-31, -7, -44, -11, 1.4) + ' ' +                               // 尾炮管
    bar(5, -26, 13, -26, 1.2);                                        // 桅横杆
  const NAVAL_CA_DETAIL = bar(37, -14, 50, -18, 1.6) + ' ' +          // 三座炮塔炮管
    bar(-9, -11, -22, -15, 1.6) + ' ' +
    bar(-31, -8, -44, -12, 1.6);
  const NAVAL_BC_DETAIL = bar(41, -14, 50, -18, 1.8) + ' ' +          // 前主炮
    bar(-38, -9, -50, -13, 1.8);                                      // 尾主炮
  const NAVAL_BB_DETAIL = bar(39, -14, 50, -18, 1.6) + ' ' +          // 前主炮
    bar(-19, -11, -32, -15, 1.5) + ' ' + bar(-39, -7, -50, -11, 1.5) + ' ' + // 中部／尾部主炮
    circle(13, -27, 2);                                               // 塔楼测距仪
  const NAVAL_CV_DETAIL = [-36, -14, 4, 22, 38].map(x => bar(x, -5.5, x + 8, -5.5, 1)).join(' '); // 甲板中线
  const NAVAL_CVE_DETAIL = [-30, -10, 6].map(x => bar(x, -3.5, x + 6, -3.5, 1)).join(' ');
  const TRANSPORT_DETAIL = bar(21, -6, 13, -17, 1.1) + ' ' +          // 吊杆
    circle(25, -2.5, 2) + ' ' + circle(38, -2, 1.8) + ' ' + circle(-19, -2.5, 2); // 舱口盖

  const DETAILS = {
    tank: TANK_DETAIL, art: ART_DETAIL, inf: INF_DETAIL, air: AIR_DETAIL,
    airFighter: AIR_FIGHTER_DETAIL, airHeavy: AIR_HEAVY_DETAIL, airCas: AIR_CAS_DETAIL,
    airNaval: AIR_NAVAL_DETAIL, airTactical: AIR_TACTICAL_DETAIL,
    airStrategic: AIR_STRATEGIC_DETAIL, airTransport: AIR_TRANSPORT_DETAIL,
    sub: NAVAL_SUB_DETAIL, dd: NAVAL_DD_DETAIL, cl: NAVAL_CL_DETAIL,
    ca: NAVAL_CA_DETAIL, bc: NAVAL_BC_DETAIL, bb: NAVAL_BB_DETAIL,
    cve: NAVAL_CVE_DETAIL, cv: NAVAL_CV_DETAIL, transport: TRANSPORT_DETAIL,
  };

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
   * @param {string} cls   兵种键：inf/art/tank/air（+ airFighter 等 air.js 七机种）、
   *                       naval.js 八舰种、transport（海运陆军）
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
