/* =========================================================================
 * 《钢铁欧陆 1939》 ui.js —— 渲染 / 交互 / 面板 / 动画 / 音效
 * ========================================================================= */
'use strict';

/* ============================ 音效（WebAudio 合成） ============================ */
const SFX = (() => {
  let ctx = null, on = true;
  function ac() {
    if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, vol, slide) {
    if (!on) return;
    try {
      const c = ac(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), c.currentTime + dur);
      g.gain.value = vol || 0.15;
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + dur);
    } catch (e) {}
  }
  function noise(dur, vol, freq) {
    if (!on) return;
    try {
      const c = ac(); if (!c) return;
      const n = c.createBufferSource();
      const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      n.buffer = buf;
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq || 800;
      const g = c.createGain(); g.gain.value = vol || 0.2;
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      n.connect(f); f.connect(g); g.connect(c.destination);
      n.start();
    } catch (e) {}
  }
  return {
    click: () => tone(700, .06, 'square', .05),
    move: () => tone(300, .09, 'sine', .07, 140),
    shot: () => { tone(150, .16, 'square', .1, -70); noise(.12, .08, 1400); },
    boom: () => noise(.55, .26, 320),
    cap: () => { tone(520, .12, 'triangle', .13); setTimeout(() => tone(700, .22, 'triangle', .13), 110); },
    event: () => { tone(220, .5, 'sawtooth', .07); setTimeout(() => tone(277, .5, 'sawtooth', .07), 140); },
    win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .38, 'triangle', .15), i * 170)),
    lose: () => [392, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, .45, 'sine', .14), i * 210)),
    toggle() { on = !on; return on; },
    isOn: () => on,
  };
})();

/* ============================ 全局 UI 状态 ============================ */
const SAVE_KEY = 'iron-europe-1939-geographic-v7-save';
const UI = {
  game: null,
  sel: null,            // 选中的己方单位
  range: null,          // {cost:Map, prev:Map}
  targets: new Map(),   // enemyId -> 接敌格 [c,r] | null(原地可攻)
  hover: null,
  busy: false,          // 动画/AI 回合中锁输入
  cam: { x: 0, y: 0, z: 1 },
  anims: [],
  moveAnim: null,       // {unit, path, t0}
  pendingAttack: null,
  nextIdx: 0,
  political: true,
  showUnits: true,
};
const cv = document.getElementById('cv');
const cx = cv.getContext('2d');
const SQ3 = HexMath.SQ3;
const BASE_S = 36;

function S() { return BASE_S * UI.cam.z; }
function hexToPix(c, r) {
  const s = S();
  return [s * SQ3 * (c + 0.5 * (r & 1)) + UI.cam.x, s * 1.5 * r + UI.cam.y];
}
function pixToHex(px, py) {
  const s = S();
  const r = py / (1.5 * s);
  const q = px / (SQ3 * s) - r / 2;
  let rx = Math.round(q), rz = Math.round(r), ry = Math.round(-q - r);
  const dx = Math.abs(rx - q), dy = Math.abs(ry - (-q - r)), dz = Math.abs(rz - r);
  if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
  return [rx + Math.floor(rz / 2), rz];
}
function screenToWorld(sx, sy) { return [sx - UI.cam.x, sy - UI.cam.y]; }

/* ============================ 渲染 ============================ */
function resize() {
  const dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(innerWidth * dpr);
  cv.height = Math.round(innerHeight * dpr);
  cv.style.width = innerWidth + 'px';
  cv.style.height = innerHeight + 'px';
}
addEventListener('resize', resize); resize();

function mix(c1, c2, t) {  // 颜色混合 #rrggbb
  const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
  const r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t);
  const g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
  const bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
  return `rgb(${r},${g},${bl})`;
}
function hexPath(x, y, s) {
  cx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i - 30);
    const px = x + s * Math.cos(a), py = y + s * Math.sin(a);
    i ? cx.lineTo(px, py) : cx.moveTo(px, py);
  }
  cx.closePath();
}
/* 同 hexPath，但写入指定 Path2D（批量绘制用） */
function hexPathInto(path, x, y, s) {
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i - 30);
    const px = x + s * Math.cos(a), py = y + s * Math.sin(a);
    i ? path.lineTo(px, py) : path.moveTo(px, py);
  }
  path.closePath();
}

/* ============================ 地形缓存层 ============================
 * 把地形/领土染色/河流/城市画进世界坐标离屏画布，每帧仅一次 drawImage。
 * 失效条件：城市易手、季节切换（立即重建）；缩放变化（防抖重建）。
 * =================================================================== */
const terrainCache = { cv: document.createElement('canvas'), scale: 0, wx: 0, wy: 0, key: '', pend: 0 };
function terrainScale(z) {
  // Limit the full-map texture to roughly 12M pixels, including its margins.
  const maxScale = Math.sqrt(12000000 / ((SQ3 * MAP_W + 4) * (1.5 * MAP_H + 4))) / BASE_S;
  return Math.min(z, 0.69, maxScale);
}

function terrainKey(g) {
  let k = (g.isWinter() ? 'w' : 's') + (UI.political ? 'p' : 't');
  for (const ci of g.cities) k += ci.owner[0];
  return k;
}

function rebuildTerrain(g, z) {
  const cs = terrainScale(z);
  const s2 = 36 * cs;
  const cv2 = terrainCache.cv;
  cv2.width = Math.ceil(Math.sqrt(3) * s2 * MAP_W + s2 * 4);
  cv2.height = Math.ceil(1.5 * s2 * MAP_H + s2 * 4);
  terrainCache.scale = cs;
  terrainCache.wx = -2 * 36;               // 缓存原点的世界坐标（36 系 px，与 z 无关）
  terrainCache.wy = -2 * 36;
  terrainCache.key = ''; // Only publish a valid cache after the complete draw succeeds.
  const c2 = cv2.getContext('2d');
  c2.setTransform(1, 0, 0, 1, 2 * s2, 2 * s2);   // 世界坐标 → 缓存像素（边距 2*s2 缓存px）
  const winter = g.isWinter();
  const fillPaths = new Map();
  for (let r = 0; r < MAP_H; r++) for (let c = 0; c < MAP_W; c++) {
    const t = g.tile(c, r); if (!t) continue;
    let col = t === 'c' ? '#8a8273' : TERRAIN[t].color;
    if (winter && (t === '.' || t === 'f' || t === 'c')) col = mix(col, '#dfe6ea', 0.38);
    let p = fillPaths.get(col);
    if (!p) { p = new Path2D(); fillPaths.set(col, p); }
    hexPathInto(p, s2 * SQ3 * (c + 0.5 * (r & 1)), s2 * 1.5 * r, s2 * 0.985);
  }
  for (const [col, path] of fillPaths) { c2.fillStyle = col; c2.fill(path); }
  c2.strokeStyle = 'rgba(0,0,0,.22)'; c2.lineWidth = Math.max(0.5, s2 * 0.03);
  for (const [, path] of fillPaths) c2.stroke(path);
  const terrPaths = new Map();
  for (let r = 0; r < MAP_H; r++) for (let c = 0; c < MAP_W; c++) {
    const t = g.tile(c, r);
    if (!t || !g.landPassable(c, r)) continue;
    const ct = g.homeCountryOf(c, r);
    const owner = g.territoryOwner(c, r);
    if (!owner || !ct) continue;
    const col = UI.political ? COUNTRIES[ct].color : (FACTION_COLOR[owner] || '#888888');
    let tp = terrPaths.get(col);
    if (!tp) { tp = new Path2D(); terrPaths.set(col, tp); }
    hexPathInto(tp, s2 * SQ3 * (c + 0.5 * (r & 1)), s2 * 1.5 * r, s2 * 0.985);
  }
  for (const [col, path] of terrPaths) { c2.fillStyle = col + (UI.political ? 'c9' : '25'); c2.fill(path); }
  // Borders are fixed to the historical country layer; occupation is shown by flags.
  const pix = (c, r) => [s2 * SQ3 * (c + .5 * (r & 1)), s2 * 1.5 * r];
  function edge(a, b, color, width) {
    const p = pix(...a), q = pix(...b), dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
    const x = (p[0] + q[0]) / 2, y = (p[1] + q[1]) / 2;
    c2.strokeStyle = color; c2.lineWidth = width; c2.beginPath();
    c2.moveTo(x - dy / len * s2 / 2, y + dx / len * s2 / 2);
    c2.lineTo(x + dy / len * s2 / 2, y - dx / len * s2 / 2); c2.stroke();
  }
  for (let r = 0; r < MAP_H; r++) for (let c = 0; c < MAP_W; c++) {
    if (!g.landPassable(c, r)) continue;
    for (const p of g.neighbors(c, r)) {
      if (!g.landPassable(...p)) edge([c, r], p, '#abc2c7', Math.max(.5, s2 * .055));
      else if (r * MAP_W + c < p[1] * MAP_W + p[0] && g.homeCountryOf(c, r) !== g.homeCountryOf(...p)) edge([c, r], p, '#263039', Math.max(.8, s2 * .055));
    }
  }
  for (const k of MAP_META.blockedEdges) {
    const [a, b] = k.split('|').map(v => v.split(',').map(Number));
    edge(a, b, '#68a9d2', Math.max(2, s2 * .17));
  }
  // 河流图层；跨河消耗由引擎中的河流边处理。
  if ((RIVERS || []).length) {
    c2.strokeStyle = 'rgba(70,120,200,.55)';
    c2.lineWidth = Math.max(1, s2 * 0.10);
    c2.lineJoin = 'round'; c2.lineCap = 'round';
    for (const river of RIVERS) {
      c2.beginPath();
      river.path.forEach(([c, r], i) => {
        const x = s2 * SQ3 * (c + (river.geographic ? 0 : 0.5 * (r & 1))), y = s2 * 1.5 * r;
        i ? c2.lineTo(x, y) : c2.moveTo(x, y);
      });
      c2.stroke();
    }
  }
  c2.strokeStyle = '#85b5d999'; c2.lineWidth = Math.max(.6, s2 * .04); c2.setLineDash([s2 * .35, s2 * .25]);
  for (const route of MAP_META.routes) {
    const a = pix(...route.a), b = pix(...route.b);
    c2.beginPath(); c2.moveTo(...a); c2.lineTo(...b); c2.stroke();
  }
  c2.setLineDash([]);
  c2.textAlign = 'center'; c2.fillStyle = '#b9d2df'; c2.font = `${Math.max(10, s2 * .5)}px "Microsoft YaHei",sans-serif`;
  for (const label of MAP_META.labels) {
    c2.fillStyle = label.kind === 'region' ? '#ead6a4' : '#b9d2df';
    c2.fillText(label.name, s2 * SQ3 * label.grid[0], s2 * 1.5 * label.grid[1]);
  }
  if (UI.political) {
    const labelPoints = {de:[10,51.5],uk:[-3.4,54.2],fr:[2,46.7],es:[-3.2,39.6],pt:[-8,39.5],it:[12,43],su:[42,58],pl:[21.5,52.3],se:[16,63],no:[8,62],fi:[27,64],ro:[25,46],hu:[19,47],yu:[19,44],gr:[22,39],tr:[33,39],ie:[-8,53],dk:[9.2,56.3],ee:[25.5,58.6],lv:[25,57],lt:[23.7,55.5],bg:[25,42.5],is:[-19,65]};
    c2.font = `600 ${Math.max(10, s2 * .6)}px "Microsoft YaHei",sans-serif`;
    for (const [ct, p] of Object.entries(labelPoints)) {
      const [x, y] = Geography.geoToGrid(...p);
      const label = COUNTRIES[ct].short || COUNTRIES[ct].name;
      c2.strokeStyle = '#17232add'; c2.lineWidth = 3; c2.strokeText(label, x * s2 * SQ3, y * s2 * 1.5);
      c2.fillStyle = '#faf1d7'; c2.fillText(label, x * s2 * SQ3, y * s2 * 1.5);
    }
  }
  drawCities(c2, g, s2);
  drawCanals(c2, s2);
  terrainCache.key = terrainKey(g) + '@' + cs.toFixed(3);
  terrainCache.pend = 0;
}

function drawCanals(c2, s2) {
  for (const canal of MAP_META.canals || []) {
    c2.save(); c2.setLineDash([]);
    c2.beginPath();
    canal.path.forEach(([col,row],i) => {
      const x=s2*SQ3*col,y=s2*1.5*row;
      i ? c2.lineTo(x,y) : c2.moveTo(x,y);
    });
    c2.strokeStyle='#193748';c2.lineWidth=Math.max(3,s2*.22);c2.stroke();
    c2.strokeStyle='#8ce5ef';c2.lineWidth=Math.max(1.4,s2*.1);c2.stroke();
    const [col,row]=canal.labelAnchor, [dx,dy]=canal.labelOffset;
    const x=s2*SQ3*col,y=s2*1.5*row,lx=x+s2*dx,ly=y+s2*dy;
    c2.beginPath();c2.moveTo(x,y);c2.lineTo(lx,ly+4);
    c2.lineWidth=1;c2.stroke();
    c2.textAlign='center';c2.font=`600 ${Math.max(9,s2*.32)}px "Microsoft YaHei",sans-serif`;
    c2.strokeStyle='#193748';c2.lineWidth=3;c2.strokeText(canal.name,lx,ly);
    c2.fillStyle='#b3f5ff';c2.fillText(canal.name,lx,ly);c2.restore();
  }
}

function drawCities(c2, g, s2) {
  c2.textAlign = 'center';
  for (const ci of g.cities) {
    const x = s2 * SQ3 * (ci.x + 0.5 * (ci.y & 1)), y = s2 * 1.5 * ci.y;
    const fc = FACTION_COLOR[ci.owner] || '#888';
    c2.fillStyle = '#c9c2b4';
    c2.fillRect(x - s2 * 0.42, y - s2 * 0.05, s2 * 0.84, s2 * 0.42);
    c2.fillStyle = '#9c2f26';
    c2.beginPath();
    c2.moveTo(x - s2 * 0.5, y - s2 * 0.05); c2.lineTo(x, y - s2 * 0.4); c2.lineTo(x + s2 * 0.5, y - s2 * 0.05);
    c2.closePath(); c2.fill();
    c2.fillStyle = '#4a4034';
    c2.fillRect(x - s2 * 0.08, y + s2 * 0.12, s2 * 0.16, s2 * 0.25);
    c2.strokeStyle = '#333'; c2.lineWidth = 1.5;
    c2.beginPath(); c2.moveTo(x + s2 * 0.46, y - s2 * 0.05); c2.lineTo(x + s2 * 0.46, y - s2 * 0.55); c2.stroke();
    c2.fillStyle = fc;
    c2.beginPath(); c2.moveTo(x + s2 * 0.46, y - s2 * 0.55); c2.lineTo(x + s2 * 0.78, y - s2 * 0.46); c2.lineTo(x + s2 * 0.46, y - s2 * 0.36); c2.closePath(); c2.fill();
    if (ci.cap) {
      c2.fillStyle = '#ffd75e';
      c2.font = `900 ${Math.max(9, s2 * 0.34)}px sans-serif`;
      c2.fillText('★', x - s2 * 0.28, y - s2 * 0.28);
    }
    if (s2 > 15 || ((ci.cap || ci.major) && s2 > 8)) {
      c2.font = `600 ${Math.max(9, s2 * 0.26)}px "Microsoft YaHei",sans-serif`;
      c2.fillStyle = 'rgba(0,0,0,.55)';
      c2.fillText(ci.mapLabel || ci.n, x + 1, y + s2 * 0.78 + 1);
      c2.fillStyle = ci.cap ? '#ffe9a8' : '#e8e4d8';
      c2.fillText(ci.mapLabel || ci.n, x, y + s2 * 0.78);
    }
  }
}

function blitTerrain(z) {
  const t = terrainCache;
  cx.drawImage(t.cv, t.wx * z + UI.cam.x, t.wy * z + UI.cam.y,
    t.cv.width * z / t.scale, t.cv.height * z / t.scale);
}

function render(now) {
  // Keep exceptions visible, but a failed frame must not stop the animation loop.
  try {
    cx.save();
    try { drawFrame(now); } finally { cx.restore(); }
  } finally {
    requestAnimationFrame(render);
  }
}

function drawFrame(now) {
  const g = UI.game;
  const dpr = window.devicePixelRatio || 1;
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);   // 逻辑坐标 = CSS 像素，物理分辨率输出
  cx.fillStyle = '#1b2836';
  cx.fillRect(0, 0, innerWidth, innerHeight);
  if (!g) return;
  const s = S();
  const z = s / 36;

  // ---- 地形缓存层：离屏画布，每帧一次 blit ----
  const tKey = terrainKey(g) + '@' + terrainScale(z).toFixed(3);
  if (terrainCache.key !== tKey) {
    const baseNow = tKey.split('@')[0], baseOld = terrainCache.key.split('@')[0];
    if (terrainCache.key === '' || baseNow !== baseOld) rebuildTerrain(g, z);      // 领土易手/季节切换：立即重建
    else {
      if (!terrainCache.pend) terrainCache.pend = now;                             // 缩放变化：防抖 140ms 重建
      if (now - terrainCache.pend > 140) rebuildTerrain(g, z);
    }
  } else terrainCache.pend = 0;
  blitTerrain(z);

  // ---- 移动范围（批量单路径）----
  if (UI.sel && UI.range && !UI.sel.attacked) {
    const rp = new Path2D();
    for (const k of UI.range.cost.keys()) {
      const [c, r] = k.split(',').map(Number);
      const [x, y] = hexToPix(c, r);
      if (x < -s * 2 || x > innerWidth + s * 2 || y < -s * 2 || y > innerHeight + s * 2) continue;
      hexPathInto(rp, x, y, s * 0.9);
    }
    cx.fillStyle = 'rgba(110,180,255,.20)'; cx.fill(rp);
    cx.strokeStyle = 'rgba(140,200,255,.55)'; cx.lineWidth = 1.2; cx.stroke(rp);
  }

  // ---- 可攻击目标 ----
  if (UI.sel && !UI.sel.attacked) {
    const pulse = 0.5 + 0.5 * Math.sin(now / 220);
    for (const [id] of UI.targets) {
      const e = g.units.find(u => u.id === id);
      if (!e) continue;
      const [x, y] = hexToPix(e.c, e.r);
      hexPath(x, y, s * 0.96);
      cx.fillStyle = `rgba(255,60,40,${0.10 + 0.10 * pulse})`; cx.fill();
      cx.strokeStyle = `rgba(255,90,60,${0.55 + 0.4 * pulse})`; cx.lineWidth = 2.2; cx.stroke();
    }
  }

  // ---- 单位（视口剔除 + 低倍速简化）----
  const uM = s * 2;
  const simple = s < 11;
  for (const u of g.units) {
    if (!UI.showUnits) continue;
    const isSel = u === UI.sel;
    let [x, y] = hexToPix(u.c, u.r);
    const animating = UI.moveAnim && UI.moveAnim.unit === u && UI.moveAnim.path.length > 0;
    if (!isSel && !animating &&
        (x < -uM || x > innerWidth + uM || y < -uM || y > innerHeight + uM)) continue;
    if (animating) {
      const p = UI.moveAnim;
      // rAF's frame timestamp can precede performance.now() at creation.
      const elapsed = Math.max(0, now - p.t0);
      const seg = Math.min(p.path.length - 1, Math.floor(elapsed / 95));
      const t = Math.min(1, (elapsed - seg * 95) / 95);
      const [x1, y1] = hexToPix(...(seg > 0 ? p.path[seg - 1] : p.start));
      const [x2, y2] = hexToPix(...p.path[seg]);
      x = x1 + (x2 - x1) * t; y = y1 + (y2 - y1) * t;
    }
    const done = u.moved && u.attacked;
    const f = g.unitFaction(u);
    const cc = COUNTRIES[u.ct].color;
    cx.globalAlpha = done && !isSel ? 0.55 : 1;
    // 底影
    cx.beginPath(); cx.arc(x, y + s * 0.30, s * 0.5, 0, 7); cx.fillStyle = 'rgba(0,0,0,.25)'; cx.fill();
    // 主体
    cx.beginPath(); cx.arc(x, y, s * 0.52, 0, 7);
    cx.fillStyle = cc; cx.fill();
    cx.lineWidth = 2.5; cx.strokeStyle = FACTION_COLOR[f] || '#999'; cx.stroke();
    if (u.gen) { cx.lineWidth = 1.6; cx.strokeStyle = '#ffd75e'; cx.beginPath(); cx.arc(x, y, s * 0.62, 0, 7); cx.stroke(); }
    if (!simple) {
      // 兵种字（显式居中：主画布不再有城市循环预设 textAlign）
      cx.textAlign = 'center';
      cx.font = `900 ${s * 0.44}px "Microsoft YaHei",sans-serif`;
      cx.fillStyle = '#fff'; cx.strokeStyle = 'rgba(0,0,0,.6)'; cx.lineWidth = 3;
      cx.strokeText(CLASSES[u.eq.cls].glyph, x, y + s * 0.16);
      cx.fillText(CLASSES[u.eq.cls].glyph, x, y + s * 0.16);
      // 将领星
      if (u.gen) {
        cx.font = `900 ${s * 0.34}px sans-serif`; cx.fillStyle = '#ffd75e';
        cx.fillText('★', x - s * 0.52, y - s * 0.42);
      }
      // 老练度
      if (u.vet > 0) {
        cx.font = `900 ${s * 0.28}px sans-serif`; cx.fillStyle = '#9fe066';
        cx.fillText('❭'.repeat(u.vet), x + s * 0.5, y + s * 0.5);
      }
      // 驻防标记
      if (u.dug) {
        cx.font = `700 ${s * 0.26}px "Microsoft YaHei",sans-serif`;
        cx.fillStyle = '#7ec8ff'; cx.fillText('守', x + s * 0.52, y - s * 0.4);
      }
    }
    // 血条
    const bw = s * 1.04, bh = 4.5;
    const hpr = Math.max(0, u.hp / 100);
    cx.fillStyle = 'rgba(0,0,0,.7)'; cx.fillRect(x - bw / 2, y + s * 0.62, bw, bh);
    cx.fillStyle = hpr > 0.6 ? '#67d13d' : hpr > 0.3 ? '#e8c33a' : '#e05338';
    cx.fillRect(x - bw / 2 + 0.5, y + s * 0.62 + 0.5, (bw - 1) * hpr, bh - 1);
    cx.globalAlpha = 1;
    // 选中环
    if (isSel) {
      cx.save();
      cx.translate(x, y); cx.rotate(now / 900);
      cx.strokeStyle = '#ffe9a8'; cx.lineWidth = 2.5; cx.setLineDash([s * 0.3, s * 0.18]);
      cx.beginPath(); cx.arc(0, 0, s * 0.78, 0, 7); cx.stroke();
      cx.restore();
    }
  }

  // ---- 悬停 ----
  if (UI.hover) {
    const [c, r] = UI.hover;
    if (g.inMap(c, r)) {
      const [x, y] = hexToPix(c, r);
      hexPath(x, y, s * 0.97);
      cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 1.6; cx.stroke();
    }
  }

  // ---- 动画 ----
  drawAnims(now);

  // FPS 统计（控制台可查 window.__fps）
  render._fn = (render._fn || 0) + 1;
  if (!render._t0) render._t0 = now;
  if (now - render._t0 >= 1000) {
    window.__fps = Math.round(render._fn * 1000 / (now - render._t0));
    render._fn = 0; render._t0 = now;
  }

}

function drawAnims(now) {
  const s = S();
  UI.anims = UI.anims.filter(a => now - a.t0 < a.dur);
  for (const a of UI.anims) {
    const t = Math.max(0, Math.min(1, (now - a.t0) / a.dur));
    if (a.kind === 'dmg') {
      const [x, y] = hexToPix(a.c, a.r);
      cx.font = `900 ${Math.max(14, s * 0.5)}px sans-serif`;
      cx.textAlign = 'center';
      cx.globalAlpha = 1 - t;
      cx.strokeStyle = '#000'; cx.lineWidth = 3;
      cx.strokeText(a.text, x, y - s * 0.5 - t * 26);
      cx.fillStyle = a.color || '#ff6a4d';
      cx.fillText(a.text, x, y - s * 0.5 - t * 26);
      cx.globalAlpha = 1;
    } else if (a.kind === 'flash') {
      const [x1, y1] = hexToPix(a.c1, a.r1), [x2, y2] = hexToPix(a.c2, a.r2);
      cx.strokeStyle = `rgba(255,230,140,${1 - t})`; cx.lineWidth = 3;
      cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2, y2); cx.stroke();
    } else if (a.kind === 'boom') {
      const [x, y] = hexToPix(a.c, a.r);
      cx.strokeStyle = `rgba(255,${Math.round(160 - 120 * t)},60,${1 - t})`;
      cx.lineWidth = 4;
      cx.beginPath(); cx.arc(x, y, s * (0.3 + 0.85 * t), 0, 7); cx.stroke();
      cx.fillStyle = `rgba(255,200,80,${0.35 * (1 - t)})`;
      cx.beginPath(); cx.arc(x, y, s * (0.25 + 0.6 * t), 0, 7); cx.fill();
    } else if (a.kind === 'cap') {
      const [x, y] = hexToPix(a.c, a.r);
      cx.strokeStyle = `rgba(255,215,94,${1 - t})`; cx.lineWidth = 5;
      hexPath(x, y, s * (0.5 + 0.8 * t)); cx.stroke();
    }
  }
}

/* ============================ 交互 ============================ */
let drag = null;
cv.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  drag = { sx: e.clientX, sy: e.clientY, cx: UI.cam.x, cy: UI.cam.y, moved: false };
});
addEventListener('mousemove', e => {
  const g = UI.game;
  if (drag) {
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
    if (drag.moved) { UI.cam.x = drag.cx + dx; UI.cam.y = drag.cy + dy; }
  }
  if (!g) return;
  const [wx, wy] = screenToWorld(e.clientX, e.clientY);
  const hex = pixToHex(wx, wy);
  UI.hover = g.inMap(hex[0], hex[1]) ? hex : null;
  updateTooltip(e.clientX, e.clientY, e.target);
});
addEventListener('mouseup', e => {
  if (e.button === 0 && drag) {
    if (!drag.moved && !UI.busy && !modalOpen()) handleClick(e.clientX, e.clientY);
    drag = null;
  }
});
cv.addEventListener('contextmenu', e => { e.preventDefault(); deselect(); updatePanel(); });
cv.addEventListener('wheel', e => {
  e.preventDefault();
  const old = S();
  const [wx, wy] = screenToWorld(e.clientX, e.clientY);
  UI.cam.z = Math.min(2.2, Math.max(0.07, UI.cam.z * (e.deltaY < 0 ? 1.12 : 0.89)));
  const ns = S();
  UI.cam.x = e.clientX - wx * (ns / old);
  UI.cam.y = e.clientY - wy * (ns / old);
}, { passive: false });

addEventListener('keydown', e => {
  const g = UI.game; if (!g || modalOpen()) return;
  if (e.key === 'Escape') { deselect(); updatePanel(); }
  else if (e.key === 'n' || e.key === 'N') nextUnit();
  else if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
    e.preventDefault();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    endTurnFlow();
  }
  else if (e.key === 'g' || e.key === 'G') showGenerals();
  else if (e.key === 'h' || e.key === 'H') showHelp();
  else if (e.key === 'm' || e.key === 'M') toggleSound();
}, true);

function handleClick(sx, sy) {
  const g = UI.game;
  const [wx, wy] = screenToWorld(sx, sy);
  const [c, r] = pixToHex(wx, wy);
  if (!g.inMap(c, r)) return;
  const u = g.unitAt(c, r);
  const city = g.cityAt(c, r);
  const myF = g.playerFaction;

  // 1) 选中部队攻击敌人
  if (UI.sel && u && g.unitFaction(u) !== myF && g.atWar(myF, g.unitFaction(u))) {
    if (UI.targets.has(u.id)) { doAttack(u); return; }
  }
  // 2) 选中部队移动
  if (UI.sel && !UI.sel.attacked && !u && UI.range && UI.range.cost.has(c + ',' + r)) {
    doMove(c, r); return;
  }
  // 3) 选择己方单位
  if (u && g.unitFaction(u) === myF) { select(u); return; }
  // 4) 查看敌人
  if (u) { UI.sel = null; UI.range = null; UI.targets.clear(); showUnitInfo(u); return; }
  // 5) 城市信息；只有己方空城可以招募。
  if (city) { deselect(); showCityPanel(city); return; }
  deselect(); updatePanel();
}

function select(u) {
  const g = UI.game;
  UI.sel = u;
  SFX.click();
  if (!u.moved) UI.range = g.moveRange(u); else UI.range = null;
  computeTargets();
  updatePanel();
}
function deselect() { UI.sel = null; UI.range = null; UI.targets.clear(); }

/* 计算可攻击目标（含移动接敌方案）：enemyId -> null(原地可攻) | [c,r](接敌格) */
function computeTargets() {
  const g = UI.game, u = UI.sel;
  UI.targets.clear();
  if (!u || u.attacked) return;
  const rng = u.eq.cls === 'art' ? g.rangeOf(u) : 1;
  const spots = [{ c: u.c, r: u.r, plan: null, score: 99 }];
  if (UI.range) for (const [k, cost] of UI.range.cost) {
    const [c, r] = k.split(',').map(Number);
    if (u.eq.cls !== 'air' && g.ferryDestinations(u.c, u.r).some(p => p[0] === c && p[1] === r)) continue;
    spots.push({ c, r, plan: [c, r], score: g.terrainDefBonus(c, r) - cost * 0.01 });
  }
  for (const e of g.units) {
    if (!g.atWar(g.playerFaction, g.unitFaction(e))) continue;
    let chosen;                    // undefined=不可及; null=原地可攻
    let bs = -1;
    for (const sp of spots) {
      if (u.eq.cls !== 'air' && u.eq.cls !== 'art' && g.blockedEdges.has(g.edgeKey([sp.c, sp.r], [e.c, e.r]))) continue;
      if (hexDist(sp.c, sp.r, e.c, e.r) <= rng) {
        if (sp.plan === null) { chosen = null; break; }
        if (sp.score > bs) { bs = sp.score; chosen = sp.plan; }
      }
    }
    if (chosen !== undefined) UI.targets.set(e.id, chosen);
  }
}

/* 移动（带路径动画） */
function doMove(c, r) {
  const g = UI.game, u = UI.sel;
  const path = g.pathTo(u, c + ',' + r);
  if (!path || !path.length) return;
  UI.busy = true; SFX.move();
  UI.moveAnim = { unit: u, path, t0: performance.now(), start: [u.c, u.r] };
  const total = path.length * 95 + 60;
  setTimeout(() => {
    UI.moveAnim = null;
    g.moveUnit(u, c, r);
    UI.range = null;
    UI.busy = false;
    // 城市占领特效
    const city = g.cityAt(c, r);
    if (city && city.owner === g.playerFaction) {
      UI.anims.push({ kind: 'cap', c, r, t0: performance.now(), dur: 900 });
      SFX.cap();
    }
    if (UI.pendingAttack) {
      const e = UI.pendingAttack; UI.pendingAttack = null;
      if (g.units.includes(e) && !u.attacked) { computeTargets(); if (UI.targets.has(e.id)) { doAttack(e); return; } }
    }
    if (!u.moved) UI.range = g.moveRange(u);        // 不会发生（moveUnit 已置 moved）
    computeTargets();
    updatePanel(); updateTopbar();
  }, total);
}

/* 攻击（必要时先自动移动接敌） */
function doAttack(enemy) {
  const g = UI.game, u = UI.sel;
  const plan = UI.targets.get(enemy.id);
  if (plan) {  // 先移动到接敌格
    if (plan[0] === u.c && plan[1] === u.r) { execAttack(enemy); return; }
    UI.pendingAttack = enemy;
    doMove(plan[0], plan[1]);
    return;
  }
  execAttack(enemy);
}
function execAttack(enemy) {
  const g = UI.game, u = UI.sel;
  if (!g.targetsOf(u).includes(enemy)) return;
  UI.busy = true;
  const rec = g.attack(u, enemy);
  SFX.shot();
  UI.anims.push({ kind: 'flash', c1: rec.aC, r1: rec.aR, c2: rec.c, r2: rec.r, t0: performance.now(), dur: 300 });
  UI.anims.push({ kind: 'dmg', c: rec.c, r: rec.r, text: '-' + rec.dmg, t0: performance.now(), dur: 1000 });
  setTimeout(() => {
    if (rec.killed || rec.attDied) { SFX.boom(); UI.anims.push({ kind: 'boom', c: rec.c, r: rec.r, t0: performance.now(), dur: 700 }); }
    else if (rec.counter) {
      UI.anims.push({ kind: 'dmg', c: rec.aC, r: rec.aR, text: '-' + rec.counter, color: '#ffb14d', t0: performance.now(), dur: 1000 });
    }
  }, 260);
  setTimeout(() => {
    UI.busy = false;
    if (UI.sel && !g.units.includes(UI.sel)) deselect();
    else { UI.range = null; computeTargets(); }
    updatePanel(); renderLog(); checkEnd();
  }, 620);
}

/* 下一支可行动部队 */
function nextUnit() {
  const g = UI.game;
  const list = g.playerUnits().filter(u => !u.moved || !u.attacked);
  if (!list.length) { banner('本回合行动完毕'); return; }
  UI.nextIdx = (UI.nextIdx + 1) % list.length;
  const u = list[UI.nextIdx];
  select(u);
  centerOn(u.c, u.r);
}
function centerOn(c, r) {
  const [x, y] = [SQ3 * S() * (c + 0.5 * (r & 1)), 1.5 * S() * r];
  UI.cam.x = Math.max(160, (innerWidth - 320) / 2) - x;
  UI.cam.y = innerHeight / 2 - y;
}

/* ============================ 结束回合（含 AI 回放） ============================ */
const sleep = ms => new Promise(res => setTimeout(res, ms));
async function endTurnFlow() {
  const g = UI.game;
  if (!g || UI.busy || g.over) return;
  UI.busy = true;
  deselect(); updatePanel();
  document.getElementById('btn-end').disabled = true;
  banner('敌方行动中…', 900);
  await sleep(350);
  const { actions, victory } = g.endTurn();
  renderLog(); updateTopbar();
  // 回放战斗动画
  const battles = actions.filter(a => a.type === 'battle');
  for (const b of battles.slice(0, 14)) {
    UI.anims.push({ kind: 'flash', c1: b.aC, r1: b.aR, c2: b.c, r2: b.r, t0: performance.now(), dur: 280 });
    UI.anims.push({ kind: 'dmg', c: b.c, r: b.r, text: '-' + b.dmg, t0: performance.now(), dur: 900 });
    if (b.killed || b.attDied) UI.anims.push({ kind: 'boom', c: b.killed ? b.c : b.aC, r: b.killed ? b.r : b.aR, t0: performance.now(), dur: 650 });
    SFX.shot();
    await sleep(240);
  }
  // 历史事件弹窗
  const evs = g.pendingEvents.splice(0);
  for (const ev of evs) {
    SFX.event();
    await showModalAsync(eventModalHTML(ev.title, ev.text));
  }
  UI.busy = false;
  document.getElementById('btn-end').disabled = false;
  autoSave();
  checkEnd();
  nextUnitHint();
}
function nextUnitHint() {
  const g = UI.game;
  const n = g.playerUnits().filter(u => !u.moved || !u.attacked).length;
  if (n) banner(`${n} 支部队待命（N 键切换）`, 1200);
}
function checkEnd() {
  const g = UI.game;
  if (!g.over) return;
  if (g.over === 'victory') { SFX.win(); showEndModal(true); }
  else { SFX.lose(); showEndModal(false); }
}

/* ============================ Tooltip ============================ */
let tipKey = '';
function updateTooltip(sx, sy, target) {
  const g = UI.game, tt = document.getElementById('tooltip');
  if (!g || UI.busy || (target && target !== cv)) { tt.style.display = 'none'; tipKey = ''; return; }
  const [wx, wy] = screenToWorld(sx, sy);
  const [c, r] = pixToHex(wx, wy);
  const u = g.inMap(c, r) && g.unitAt(c, r);
  const city = g.inMap(c, r) && g.cityAt(c, r);
  let html = '';
  if (u) {
    const gen = g.genOf(u);
    html = `<b style="color:${COUNTRIES[u.ct].color === '#b39b45' ? '#ffd75e' : '#fff'}">${u.eq.n}</b><br>
      ${COUNTRIES[u.ct].name} · ${FACTION_NAME[g.unitFaction(u)]} · ${CLASSES[u.eq.cls].name}<br>
      ⚔${u.eq.atk} 🛡${u.eq.def} 👣${g.movOf(u)}${u.eq.cls === 'art' ? ' 🎯' + g.rangeOf(u) : ''} ❤${u.hp}/100<br>
      ${u.dug ? '🔒 已驻防(+30%防御) ' : ''}${u.vet ? `老练度+${u.vet * 8}% ` : ''}${gen ? `<br>🎖 ${gen.name}（${gen.title}）` : ''}`;
  } else if (city) {
    html = `<b>${city.n}</b>${city.cap ? ' ★首都' : ''}<br>${COUNTRIES[city.ct].name} · ${FACTION_NAME[city.owner]}控制<br>收入 ${city.inc} 金/回合${city.note ? '<br>' + city.note : ''}<br><span style="color:#9aa4b0">占领该国首都可令其全境易手</span>`;
  } else if (g.inMap(c, r)) {
    const t = g.tile(c, r);
    const T = TERRAIN[t];
    if (T) {
      let ex = '';
      if (t === 'c') { const ci = g.cityAt(c, r); ex = ci && ci.cap ? '（首都 防御+60%）' : ''; }
      const ct = g.homeCountryOf(c, r);
      const ll = Geography.hexToGeo(c, r);
      html = `${T.name} ${ex}${ct ? '<br>' + COUNTRIES[ct].name : ''}${ct && COUNTRIES[ct].note ? '<br>' + COUNTRIES[ct].note : ''}${T.def ? `<br>防御加成 +${Math.round(T.def * 100)}%` : ''}<br>${Math.abs(ll[0]).toFixed(1)}°${ll[0] >= 0 ? 'E' : 'W'} · ${ll[1].toFixed(1)}°N`;
    }
  }
  if (html) {
    const tk = c + ',' + r + '|' + (u ? u.id : 0);
    if (tk !== tipKey) { tt.innerHTML = html; tipKey = tk; }
    tt.style.display = 'block';
    tt.style.left = Math.min(sx + 16, innerWidth - 280) + 'px';
    tt.style.top = Math.min(sy + 18, innerHeight - 120) + 'px';
  } else { tt.style.display = 'none'; tipKey = ''; }
}

/* ============================ 顶栏 / 面板 ============================ */
function updateTopbar() {
  const g = UI.game; if (!g) return;
  document.getElementById('fac-dot').style.background = FACTION_COLOR[g.playerFaction];
  document.getElementById('fac-name').textContent = FACTION_NAME[g.playerFaction];
  document.getElementById('gold').innerHTML = `💰 ${g.gold[g.playerFaction]} <small>(+${g.factionIncome(g.playerFaction)}/回合)</small>`;
  document.getElementById('date').textContent = `${g.dateLabel()} · 第 ${g.turn + 1} 回合${g.isWinter() ? ' ❄' : ''}`;
}

function updatePanel() {
  const g = UI.game;
  const body = document.getElementById('panel-body');
  if (!g) { body.innerHTML = ''; return; }
  if (UI.sel) { showUnitPanel(UI.sel); return; }
  body.innerHTML = `<div class="p-sub">点击部队下达命令 · 点击空城招募 · N 下一部队 · E 结束回合</div>`;
}

function showUnitPanel(u) {
  const g = UI.game;
  const body = document.getElementById('panel-body');
  const gen = g.genOf(u);
  const my = g.unitFaction(u) === g.playerFaction;
  const idle = my && (!u.moved || !u.attacked);
  const skills = gen ? gen.skills.map(skillText).join('<br>') : '';
  const rank = gen ? Math.min(5, 1 + Math.floor((g.genKills[gen.id] || 0) / 3)) : 0;
  body.innerHTML = `
    <div class="p-title"><span>${u.eq.n}</span><span class="tag" style="border-color:${FACTION_COLOR[g.unitFaction(u)]}">${FACTION_NAME[g.unitFaction(u)]}</span></div>
    <div class="p-sub">${COUNTRIES[u.ct].name} · ${CLASSES[u.eq.cls].name} · ${u.eq.nt || ''}</div>
    <div class="hpbar"><div style="width:${Math.max(0, u.hp)}%;background:${u.hp > 60 ? '#67d13d' : u.hp > 30 ? '#e8c33a' : '#e05338'}"></div></div>
    <div class="grid2">
      <span>攻击 <b>${u.eq.atk}</b></span><span>防御 <b>${u.eq.def}</b></span>
      <span>移动力 <b>${g.movOf(u)}</b></span><span>${u.eq.cls === 'art' ? '射程 <b>' + g.rangeOf(u) + '</b>' : '经验 <b>' + u.xp + '</b>'}</span>
      <span>兵力 <b>${u.hp}/100</b></span><span>老练 <b>+${u.vet * 8}%</b></span>
    </div>
    ${u.dug ? '<div class="tag" style="border-color:#7ec8ff;color:#7ec8ff">已驻防：防御+30%，移动/攻击后解除</div>' : ''}
    ${gen ? `<div class="gen-chip">
      <span class="gname">🎖 ${gen.name}</span> <span style="color:#9aa4b0">${gen.title} · ${'★'.repeat(rank)}级 · 击杀${g.genKills[gen.id] || 0}</span>
      <div class="skill-list">${skills}</div>
      <div class="gbio">${gen.bio}</div>
    </div>` : ''}
    ${my ? `<div class="row-btns">
      ${idle && !u.attacked ? '<button class="btn" id="pb-dug">🔒 驻防</button>' : ''}
      ${idle ? '<button class="btn" id="pb-skip">⏭ 待命</button>' : ''}
      ${idle ? '<button class="btn gold" id="pb-gen">🎖 将领</button>' : ''}
      <button class="btn" id="pb-next">⏩ 下一部队</button>
    </div>
    <div class="p-sub" style="margin-top:8px">${u.moved && u.attacked ? '⛔ 本回合已行动完毕' : !u.moved ? '蓝格：可移动 · 红框敌军：可攻击' : '已移动，仍可攻击红框敌军'}</div>` : '<div class="p-sub">敌方部队</div>'}`;
  const b1 = document.getElementById('pb-dug');
  if (b1) b1.onclick = () => { u.dug = true; u.moved = true; u.attacked = true; SFX.click(); UI.range = null; UI.targets.clear(); showUnitPanel(u); };
  const b2 = document.getElementById('pb-skip');
  if (b2) b2.onclick = () => { u.moved = true; u.attacked = true; UI.range = null; UI.targets.clear(); updatePanel(); nextUnit(); };
  const b3 = document.getElementById('pb-gen');
  if (b3) b3.onclick = () => showGenerals(u);
  const b4 = document.getElementById('pb-next');
  if (b4) b4.onclick = () => nextUnit();
}

function showUnitInfo(u) { showUnitPanel(u); }

function showCityPanel(city) {
  const g = UI.game;
  const body = document.getElementById('panel-body');
  const canRecruit = !city.demilitarized && city.owner === g.playerFaction && !g.unitAt(city.x, city.y) && !UI.busy;
  const roster = canRecruit ? g.rosterFor(city) : [];
  body.innerHTML = `
    <div class="p-title"><span>${city.n}${city.cap ? ' ★' : ''}</span><span class="tag" style="border-color:${FACTION_COLOR[city.owner]}">${FACTION_NAME[city.owner]}</span></div>
    <div class="p-sub">${COUNTRIES[city.ct].name} · 收入 ${city.inc} 金/回合 · 💰当前 ${g.gold[g.playerFaction]}</div>
    ${city.note ? `<div class="p-sub">${city.note}</div>` : ''}
    <div class="p-sub">${city.demilitarized ? '非军事区港口：禁止本地招募' : canRecruit ? '新部队组建后下回合方可行动' : '仅己方未驻军的城市可招募'}</div>
    ${roster.map(it => `
      <div class="shop-item ${it.locked || it.eq.cost > g.gold[g.playerFaction] ? 'locked' : ''}" data-eq="${it.eqKey}">
        <div><div class="s-name">${CLASSES[it.eq.cls].glyph}·${it.eq.n}${it.locked ? ` 🔒${it.eq.yr}年解锁` : ''}</div>
        <div class="s-info">⚔${it.eq.atk} 🛡${it.eq.def} 👣${it.eq.mov}${it.eq.rng ? ' 🎯' + it.eq.rng : ''} ${it.eq.nt || ''}</div></div>
        <div class="s-cost">${it.eq.cost}金</div>
      </div>`).join('')}`;
  body.querySelectorAll('.shop-item').forEach(el => {
    el.onclick = () => {
      if (UI.busy || city.owner !== g.playerFaction) return;
      const eqKey = el.dataset.eq;
      const u = g.recruit(city.k, eqKey);
      if (u) { SFX.cap(); updateTopbar(); showUnitPanel(u); }
      else SFX.click();
    };
  });
}

/* ============================ 模态 ============================ */
const modalRoot = document.getElementById('modal-root');
function modalOpen() { return modalRoot.style.display === 'flex'; }
function openModal(html) { modalRoot.innerHTML = html; modalRoot.style.display = 'flex'; }
function closeModal() { modalRoot.innerHTML = ''; modalRoot.style.display = 'none'; }
function showCitySearch() {
  const g = UI.game; if (!g || UI.busy) return;
  openModal(`<div class="modal" style="width:680px;max-width:100%">
    <h1>查找城市 <small style="font-size:14px;color:#9aa4b0">${g.cities.length} 座</small></h1>
    <p class="sub">输入城市、国家或地区；点击结果定位。诺曼底可查到卡昂、瑟堡等城市。</p>
    <input id="city-query" aria-label="搜索城市、国家或地区" placeholder="例如：热那亚、扎拉、利物浦、诺曼底" style="width:100%;padding:12px;background:#101820;color:#eee;border:1px solid #637386;border-radius:4px;font:inherit">
    <div id="city-results" style="max-height:48vh;overflow:auto;margin:12px 0"></div>
    <button class="btn" id="city-close">关闭</button></div>`);
  const input = document.getElementById('city-query'), results = document.getElementById('city-results');
  function update() {
    const q = input.value.trim().toLowerCase();
    const list = g.cities.filter(ci => [ci.n,ci.k,ci.region || '',ci.note || '',COUNTRIES[ci.ct].name].join(' ').toLowerCase().includes(q));
    results.innerHTML = list.map(ci => `<button class="shop-item" style="width:100%;color:inherit;font:inherit;text-align:left" data-city="${ci.k}"><span><b>${ci.n}${ci.cap ? ' ★' : ''}</b><br><small>${COUNTRIES[ci.ct].name}${ci.region ? ' · ' + ci.region : ''}</small></span><span>定位 →</span></button>`).join('') || '<p class="p-sub">没有匹配的城市</p>';
    results.querySelectorAll('[data-city]').forEach(el => el.onclick = () => {
      const ci = g.cityByKey[el.dataset.city];
      closeModal(); deselect(); UI.cam.z = 1; centerOn(ci.x, ci.y);
      terrainCache.key = ''; showCityPanel(ci);
      UI.anims.push({kind:'cap',c:ci.x,r:ci.y,t0:performance.now(),dur:1200});
    });
  }
  input.oninput = update;
  input.onkeydown = e => { if (e.key === 'Escape') closeModal(); };
  document.getElementById('city-close').onclick = closeModal;
  update(); input.focus();
}
function showModalAsync(html) {
  return new Promise(res => {
    openModal(html + `<div class="actions"><button class="btn primary" id="m-ok">继 续</button></div>`);
    document.getElementById('m-ok').onclick = () => { closeModal(); res(); };
  });
}
function eventModalHTML(title, text) {
  return `<div class="modal" style="max-width:560px">
    <h1><span class="zh">📜 ${title}</span></h1>
    <div class="sub">历史事件 · 命运的齿轮开始转动</div>
    <p style="font-size:14px;line-height:1.9;color:#c9d1da">${text}</p>
  </div>`;
}

/* ---- 开始界面 ---- */
function showStart() {
  const hasSave = (() => { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } })();
  let fac = 'axis', diff = 'normal';
  const FINFO = {
    axis: { name: '轴心国 · 德国', color: '#43484a',
      desc: '拥有最精良的装备与将领，开局即与英法波全面开战。闪击波兰、击溃法国，但 1941 年巴巴罗萨行动将把你拖入双线消耗的深渊。适合喜欢进攻的指挥官。',
      gens: '古德里安 · 隆美尔 · 曼施坦因 · 莫德尔 · 凯塞林' },
    west: { name: '同盟国 · 英法', color: '#2f5f9e',
      desc: '开局在大陆处于劣势，马奇诺防线能否挡住装甲洪流？守住伦敦与巴黎，等待美国参战与诺曼底登陆的翻盘时刻。适合喜欢防守反击的指挥官。',
      gens: '蒙哥马利 · 巴顿 · 戴高乐 · 艾森豪威尔 · 亚历山大' },
    sov: { name: '苏联', color: '#8f1f16',
      desc: '1941 年 6 月前保持和平，抓紧时间备战。战争爆发后以空间换时间，用钢铁洪流淹没侵略者，最终攻克柏林。适合喜欢大兵团作战的指挥官。',
      gens: '朱可夫 · 罗科索夫斯基 · 科涅夫 · 崔可夫' },
  };
  openModal(`
    <div class="modal" style="max-width:860px">
      <h1><span class="zh">钢铁欧陆 1939</span> <span style="font-size:14px;color:#9aa4b0">IRON EUROPE 1939-1945</span></h1>
      <div class="sub">六边形回合制二战战棋 · 仿《欧陆战争》《将军的荣耀》《世界征服者》<br>
      选择你的阵营，改写 1939-1945 年的欧洲命运。占领敌方首都即可令其全国崩溃！</div>
      <div class="fac-cards">${['axis', 'west', 'sov'].map(f => `
        <div class="fac-card ${f === fac ? 'sel' : ''}" data-f="${f}">
          <h3><span class="fac-dot" style="background:${FINFO[f].color}"></span> ${FINFO[f].name}</h3>
          <p>${FINFO[f].desc}</p>
          <div class="gens">🎖 ${FINFO[f].gens}</div>
        </div>`).join('')}</div>
      <div class="diff-row">${[['easy', '军校实习（AI -12%）'], ['normal', '前线指挥（标准）'], ['hard', '总参谋部（AI +12%，收入+20%）']].map(([d, t]) =>
        `<div class="diff-opt ${d === diff ? 'sel' : ''}" data-d="${d}">${t}</div>`).join('')}</div>
      <div class="actions">
        <button class="btn primary" id="m-start" style="font-size:16px;padding:10px 34px">开 始 战 役</button>
        ${hasSave ? '<button class="btn gold" id="m-continue">继续上次战役</button>' : ''}
        <button class="btn" id="m-help2">玩法说明</button>
        <button class="btn gold" id="m-atlas">浏览1939地图</button>
      </div>
    </div>`);
  modalRoot.querySelectorAll('.fac-card').forEach(el => el.onclick = () => {
    fac = el.dataset.f;
    modalRoot.querySelectorAll('.fac-card').forEach(x => x.classList.toggle('sel', x === el));
    SFX.click();
  });
  modalRoot.querySelectorAll('.diff-opt').forEach(el => el.onclick = () => {
    diff = el.dataset.d;
    modalRoot.querySelectorAll('.diff-opt').forEach(x => x.classList.toggle('sel', x === el));
    SFX.click();
  });
  document.getElementById('m-start').onclick = () => { closeModal(); startGame(fac, diff); };
  document.getElementById('m-atlas').onclick = () => {
    closeModal(); UI.game = new Game('axis', 'normal'); UI.showUnits = false;
    document.getElementById('btn-units').textContent = '显示部队';
    updateTopbar(); updatePanel(); renderLog(); fitMap();
  };
  const c = document.getElementById('m-continue');
  if (c) c.onclick = () => {
    try {
      const g = Game.deserialize(localStorage.getItem(SAVE_KEY));
      closeModal(); startGame(null, null, g);
    } catch (e) { alert('存档损坏：' + e.message); }
  };
  const h2 = document.getElementById('m-help2');
  if (h2) h2.onclick = showHelp;
}

function startGame(fac, diff, loaded) {
  UI.showUnits = true; document.getElementById('btn-units').textContent = '隐藏部队';
  UI.game = loaded || new Game(fac, diff);
  UI.sel = null; UI.range = null; UI.targets.clear(); UI.anims = []; UI.nextIdx = -1;
  const cap = { axis: 'berlin', west: 'london', sov: 'moscow' }[UI.game.playerFaction];
  const ci = UI.game.cityByKey[cap];
  UI.cam.z = 0.9;
  if (ci) centerOn(ci.x, ci.y);
  updateTopbar(); updatePanel(); renderLog();
  banner(`${FACTION_NAME[UI.game.playerFaction]} · 战役开始`, 1600);
  if (!loaded) {
    autoSave();
    showModalAsync(eventModalHTML('第二次世界大战爆发',
      '1939年9月1日，德国入侵波兰；9月3日，英法对德宣战。<br><br>指挥官，你的每一个决定都将改写历史。' +
      '<br><br>目标：占领所有敌对阵营的首都（柏林 / 伦敦·巴黎 / 莫斯科）。')).then(() => nextUnitHint());
  }
}

/* ---- 将领面板 ---- */
function skillText(s) {
  const M = {
    atk: m => `攻击力 +${Math.round(m * 100)}%`, def: m => `防御力 +${Math.round(m * 100)}%`,
    mov: n => `移动力 +${n}`, nozoc: () => '无视敌方控制区', rng: n => `炮兵射程 +${n}`,
    counter: m => `反击伤害 +${Math.round(m * 100)}%`, citydef: m => `驻守城市防御 +${Math.round(m * 100)}%`,
    vs: (m, s2) => `对${CLASSES[s2.tgt] ? CLASSES[s2.tgt].name : s2.tgt}伤害 +${Math.round(m * 100)}%`,
    aura: m => `相邻友军攻击 +${Math.round(m * 100)}%（光环）`, rage: () => `兵力低于50%时攻击 +15%`,
  };
  let cls = s.cls ? CLASSES[s.cls].name : '';
  return `${cls ? cls + '·' : ''}${(M[s.k] || (() => s.k))(s.m !== undefined ? s.m : s.n, s)}`;
}
function showGenerals(targetUnit) {
  const g = UI.game;
  const pool = GENERALS.filter(x => g.cf[x.ct] === g.playerFaction);
  openModal(`
    <div class="modal" style="max-width:720px">
      <h1><span class="zh">🎖 将领名册</span></h1>
      <div class="sub">${FACTION_NAME[g.playerFaction]}阵营 · ${targetUnit ? `指派至：${targetUnit.eq.n}（${targetUnit.c},${targetUnit.r}）` : '在部队面板中点击"将领"可指派'} · 击杀3次晋升一阶（每阶攻防+4%）</div>
      ${pool.map(gn => {
        const uid = g.genUnit[gn.id];
        const unit = uid ? g.units.find(u => u.id === uid) : null;
        const rank = Math.min(5, 1 + Math.floor((g.genKills[gn.id] || 0) / 3));
        return `<div class="gen-row">
          <div class="gen-portrait" style="background:${COUNTRIES[gn.ct].color}">${gn.name[0]}</div>
          <div class="gen-info">
            <span class="gtitle">${gn.name}</span> <span style="color:#9aa4b0">${gn.title} · ${COUNTRIES[gn.ct].name}</span>
            ${'★'.repeat(rank)}<span style="color:#666">${'★'.repeat(5 - rank)}</span>
            <div class="gstat">${gn.skills.map(skillText).join(' ｜ ')}</div>
            <div class="gbio2">${gn.bio}</div>
            <div style="margin-top:4px;color:${unit ? '#9fc06a' : '#d8b24a'};font-size:12px">
              ${unit ? `▸ 指挥：${unit.eq.n}（${unit.hp}兵力）` : '▸ 空闲，可指派'}</div>
          </div>
          ${targetUnit && !uid ? `<div><button class="btn gold" data-g="${gn.id}">指派</button></div>` : ''}
        </div>`;
      }).join('')}
      <div class="actions"><button class="btn" id="m-close">关 闭</button></div>
    </div>`);
  document.getElementById('m-close').onclick = closeModal;
  modalRoot.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
    g.assignGeneral(b.dataset.g, targetUnit);
    SFX.cap(); closeModal();
    if (UI.sel) showUnitPanel(UI.sel);
  });
}

/* ---- 帮助 ---- */
function showHelp() {
  openModal(`
    <div class="modal" style="max-width:760px">
      <h1><span class="zh">❓ 玩法手册</span></h1>
      <div class="help-body">
        <h4>■ 基本操作</h4>
        左键选择部队/城市 · 蓝色格子=可移动，红色闪烁敌军=可攻击（点击自动接敌）· 拖拽平移地图，滚轮缩放<br>
        快捷键：<b>N</b> 下一部队 · <b>E/回车</b> 结束回合 · <b>G</b> 将领 · <b>H</b> 帮助 · <b>M</b> 静音 · <b>Esc/右键</b> 取消
        <h4>■ 回合与经济</h4>
        每回合=1个月。城市每回合产出金币，在己方空城可组建新部队（下回合可行动）。部队在己方城市+25兵力/回合，己方领土+12。
        <h4>■ 战斗规则</h4>
        伤害 ≈ 42 × 攻/(攻+防)。防御方获得地形加成；兵力越低输出越低。<br>
        <b>炮兵/空军攻击不受反击</b>，且无视地形防御加成；近战攻击会遭受反击（步兵/装甲才反击）。<br>
        进入敌军相邻格会被<b>控制区(ZOC)</b>截停（古德里安、巴顿、空军除外）。<br>
        <b>驻防</b>+30%防御，移动或攻击后解除。老练度（击杀获取经验）最多+24%攻防。
        <h4>■ 兵种克制（攻击修正）</h4>
        <table><tr><th>攻击方↓</th><th>步兵</th><th>炮兵</th><th>装甲</th><th>空军</th></tr>
        <tr><td>步兵</td><td>100%</td><td>130%</td><td>65%</td><td>50%</td></tr>
        <tr><td>炮兵</td><td>100%</td><td>110%</td><td>115%</td><td>60%</td></tr>
        <tr><td>装甲</td><td>115%</td><td>140%</td><td>100%</td><td>40%</td></tr>
        <tr><td>空军</td><td>115%</td><td>130%</td><td>110%</td><td>—</td></tr></table>
        <h4>■ 地形防御加成</h4>
        森林+30% · 丘陵+40% · 山地+60% · 城市+40% · 首都+60%。海洋与湖泊不可供陆军通行；跨河多消耗1点移动力。<br>蓝色虚线为抽象海运航线：从己方港口到空置目的地花费25金，并耗尽本回合行动。空军可飞越水面，但必须在陆地结束移动。
        <h4>■ 胜负</h4>
        <b>占领敌方首都 → 该国全境沦陷</b>（所有城市易手）。击败所有交战敌国首都即获胜利；己方首都全部丢失则战败。<br>
        中立国（西班牙/瑞典/瑞士/土耳其等）可进攻，但会倒向你的敌人！
        <h4>■ 历史事件</h4>
        意大利参战(1940.6) → 匈牙利罗马尼亚入轴(1940.11) → <b>巴巴罗萨</b>(1941.6) → 美国参战(1941.12) → <b>俄罗斯严冬</b>(每年12-2月，轴心国在苏境-12兵力/回合) → <b>诺曼底登陆</b>(1944.6)
      </div>
      <div class="actions"><button class="btn primary" id="m-close">开始指挥</button></div>
    </div>`);
  document.getElementById('m-close').onclick = closeModal;
}

/* ---- 终局 ---- */
function showEndModal(win) {
  const g = UI.game;
  const myCaps = g.capitalsOf(g.playerFaction).length;
  const cities = g.factionCityCount(g.playerFaction);
  openModal(`
    <div class="modal" style="max-width:560px;text-align:center">
      <h1 class="zh" style="font-size:38px;${win ? 'color:#ffd75e' : 'color:#e06a55'}">${win ? '🏆 胜 利' : '⚔ 战 败'}</h1>
      <div class="sub">${win ? '欧洲的版图已被你重新描绘，历史将铭记你的名字。' : '旗帜陨落，但战争从未真正结束……'}</div>
      <div class="help-body" style="display:inline-block;text-align:left">
        终战日期：<b>${g.dateLabel()}</b>（第 ${g.turn + 1} 回合）<br>
        控制城市：<b>${cities}</b> 座 · 首都 <b>${myCaps}</b> 座<br>
        全阵营击杀：${Object.entries(g.stats.kills).map(([f, k]) => `${FACTION_NAME[f]} ${k}`).join(' / ')}
      </div>
      <div class="actions">
        <button class="btn primary" id="m-restart">新的战役</button>
      </div>
    </div>`);
  document.getElementById('m-restart').onclick = () => { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} showStart(); };
}

/* ---- 横幅 ---- */
function banner(text, dur) {
  const b = document.getElementById('banner');
  b.textContent = text;
  b.style.opacity = 1;
  clearTimeout(b._t);
  b._t = setTimeout(() => { b.style.opacity = 0; }, dur || 1200);
}

/* ---- 日志 ---- */
function renderLog() {
  const g = UI.game; if (!g) return;
  const body = document.getElementById('log-body');
  body.innerHTML = g.log.slice(-60).map(l => `<div class="lg-${l.kind}"><span style="color:#5a6a7a">${l.t}</span> ${l.text}</div>`).join('');
  body.scrollTop = body.scrollHeight;
}
document.getElementById('log-head').onclick = () => document.getElementById('log-body').classList.toggle('collapsed');

/* ---- 顶栏按钮 ---- */
function fitMap() {
  UI.cam.z = Math.max(.025, Math.min((innerWidth - 330) / (BASE_S * SQ3 * MAP_W), (innerHeight - 100) / (BASE_S * 1.5 * MAP_H)));
  UI.cam.x = 20; UI.cam.y = 70;
  document.getElementById('log-body').classList.add('collapsed');
  deselect(); terrainCache.key = '';
}
document.getElementById('btn-atlas').onclick = () => UI.game && fitMap();
document.getElementById('btn-cities').onclick = showCitySearch;
document.getElementById('btn-mapmode').onclick = () => { UI.political = !UI.political; terrainCache.key = ''; };
document.getElementById('btn-units').onclick = () => { UI.showUnits = !UI.showUnits; document.getElementById('btn-units').textContent = UI.showUnits ? '隐藏部队' : '显示部队'; };
document.getElementById('btn-end').onclick = endTurnFlow;
document.getElementById('btn-gen').onclick = () => UI.game && showGenerals();
document.getElementById('btn-help').onclick = showHelp;
document.getElementById('btn-save').onclick = () => { if (autoSave()) banner('已保存'); };
function toggleSound() { const on = SFX.toggle(); document.getElementById('btn-sound').textContent = on ? '🔊' : '🔇'; }
document.getElementById('btn-sound').onclick = toggleSound;
function autoSave() {
  if (!UI.game) return false;
  try { localStorage.setItem(SAVE_KEY, UI.game.serialize()); return true; } catch (e) { return false; }
}

/* ---- 启动（由 js/loader.js 在全部模块加载完成后调用）---- */
window.BootUI = function () {
  resize();
  requestAnimationFrame(render);
  showStart();
};
