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
const SAVE_KEY = 'iron-europe-1939-geographic-v8-save';
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
 * 把地形/领土染色/河流/城市符号画进世界坐标离屏画布；文字独立按镜头层级绘制。
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
    c2.restore();
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
  }
}

const mapLabelCache = {key:'',game:null,items:[]};
function drawMapLabels(g) {
  const cam=UI.cam, level=MapLabels.tier(cam.z,MAP_META);
  const key=[cam.x,cam.y,cam.z,innerWidth,innerHeight].join('|');
  if(mapLabelCache.key!==key||mapLabelCache.game!==g){
    const items=MapLabels.candidates(MAP_META,g.cities,cam.z);
    mapLabelCache.items=MapLabels.layout(items,{...cam,width:innerWidth,height:innerHeight},(text,size)=>{
      cx.font=`600 ${size}px "Microsoft YaHei",sans-serif`;return cx.measureText(text).width;
    });
    mapLabelCache.key=key;mapLabelCache.game=g;
  }
  cx.save();cx.textAlign='center';cx.textBaseline='middle';cx.setLineDash([]);
  for(const label of mapLabelCache.items){
    const color=label.kind==='country'?'#faf1d7':label.kind==='sea'||label.kind==='canal'?'#b9e5f2':label.kind==='city'?(label.capital?'#ffe9a8':'#f0ebdf'):'#ead6a4';
    if(label.leader){
      cx.beginPath();cx.moveTo(label.ax,label.ay);cx.lineTo(label.x,label.y);
      cx.strokeStyle=color;cx.lineWidth=.7;cx.stroke();
    }
    cx.font=`600 ${label.fontSize}px "Microsoft YaHei",sans-serif`;
    cx.strokeStyle='#14222eee';cx.lineWidth=3;cx.lineJoin='round';cx.fillStyle=color;
    label.lines.forEach((line,i)=>{
      const y=label.y+(i-(label.lines.length-1)/2)*(label.fontSize+3);
      cx.strokeText(line,label.x,y);cx.fillText(line,label.x,y);
    });
  }
  cx.restore();
  const status=document.getElementById('map-label-level');
  const title=['国家与主要地区','次级地区与主要城市','局部地区与主次城市','全部城市名称'][level];
  if(status&&status.textContent!==title)status.textContent=title;
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

function unitIconClass(g,u) { return !g.isEmbarked(u)&&Object.hasOwn(UnitIcons.SHAPES,u.eq.cls)?u.eq.cls:null; }
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
  drawConstruction(g);
  drawHarbors(g);
  drawAirfields(g);
  drawFallout(g);

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
    if (!UI.showUnits || g.isAir(u) || u.carrierId) continue;
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
    const iconClass=unitIconClass(g,u);
    if(iconClass)UnitIcons.draw(cx,iconClass,x,y,s*UnitIcons.BOX_RATIO,{detail:s>=18});
    if (!simple) {
      cx.textAlign = 'center';
      if(!iconClass){
        cx.font = `900 ${s * 0.44}px "Microsoft YaHei",sans-serif`;
        cx.fillStyle = '#fff'; cx.strokeStyle = 'rgba(0,0,0,.6)'; cx.lineWidth = 3;
        const glyph=g.isEmbarked(u)?'船':CLASSES[u.eq.cls].glyph;
        cx.strokeText(glyph,x,y+s*.16);cx.fillText(glyph,x,y+s*.16);
      }
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
    if(g.isNaval(u)&&(isSel||UI.cam.z>=1.3)){
      cx.textAlign='center';cx.font='12px "Microsoft YaHei",sans-serif';
      cx.strokeStyle='#102535';cx.lineWidth=3;cx.fillStyle='#e6f5ff';
      cx.strokeText(g.unitName(u),x,y+s*.62+18);cx.fillText(g.unitName(u),x,y+s*.62+18);
    }
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

  drawMapLabels(g);

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

function drawFallout(g) {
  cx.save();
  for(const [k,n]of Object.entries(g.fallout)){
    const [c,r]=k.split(',').map(Number),[x,y]=hexToPix(c,r);
    if(x<-S()*2||x>innerWidth+S()*2||y<-S()*2||y>innerHeight+S()*2)continue;
    hexPath(x,y,S()*.92);cx.fillStyle='rgba(165,190,30,.30)';cx.fill();cx.strokeStyle='#d9dc57';cx.lineWidth=2;cx.stroke();
    if(UI.cam.z>=.4){cx.font='bold 12px sans-serif';cx.textAlign='center';cx.fillStyle='#ffffa0';cx.fillText('☢ '+n,x,y);}
  }
  cx.restore();
}
function beginAirMission(kind) {
  const g=UI.game,u=UI.sel;if(UI.busy||!u||!g.isAir(u)||g.unitFaction(u)!==g.playerFaction)return;
  UI.airMission=kind;banner(kind==='nuclear'?'选择核打击目标格：将显示范围与损失确认':'选择空闲陆格执行伞降',3500);
}
function airMissionTarget(c,r) {
  const g=UI.game,u=UI.sel,kind=UI.airMission;
  const error=kind==='nuclear'?g.nuclearError(u,c,r):g.paradropError(u,c,r);
  if(error){banner(error,2200);return;}
  if(kind==='drop'){
    g.paradrop(u,c,r);UI.airMission=null;select(u);updateTopbar();renderLog();return;
  }
  const victims=g.units.filter(v=>hexDist(c,r,v.c,v.r)<=1),city=g.cityAt(c,r);
  openModal(`<div class="modal"><h1>☢ 确认核打击</h1><p>目标：${city?city.n:'('+c+','+r+')'}。消耗${AIR.nuclear.cost}金。</p><p>中心格所有单位消灭，周围一格损失${AIR.nuclear.splash}兵力，友军同样受影响。范围内共${victims.length}支部队，其中己方${victims.filter(v=>g.unitFaction(v)===g.playerFaction).length}支。</p><p>污染持续${AIR.nuclear.duration}回合，每回合损失${AIR.nuclear.damage}兵力；污染城市收入为0。波及中立／非交战国家将引发参战。</p><button class="btn danger" id="nuclear-confirm">执行核打击</button><button class="btn" id="nuclear-cancel">取消</button></div>`);
  document.getElementById('nuclear-cancel').onclick=()=>{closeModal();UI.airMission=null;};
  document.getElementById('nuclear-confirm').onclick=()=>{
    if(UI.busy)return;
    const result=g.nuclearStrike(u,c,r);closeModal();UI.airMission=null;
    if(result){UI.anims.push({kind:'boom',c,r,t0:performance.now(),dur:1300});SFX.boom();if(g.units.includes(u))select(u);else deselect();updatePanel();updateTopbar();renderLog();checkEnd();}
  };
}
function showFacilityIcons() { return MapLabels.tier(UI.cam.z,MAP_META)>=2; }
function airfieldScreen(ci) {
  const [x,y]=hexToPix(ci.x,ci.y),d=Math.max(14,S()*.7);return [x+d,y+d];
}
function drawAirfields(g) {
  cx.save();
  if(UI.sel&&g.isAir(UI.sel)&&g.airBase(UI.sel)){
    const base=g.airBase(UI.sel),radius=g.airRadius(UI.sel),area=new Path2D();
    for(let r=Math.max(0,base.y-radius);r<=Math.min(MAP_H-1,base.y+radius);r++)for(let c=Math.max(0,base.x-radius);c<=Math.min(MAP_W-1,base.x+radius);c++){
      if(hexDist(base.x,base.y,c,r)>radius)continue;
      const [x,y]=hexToPix(c,r);hexPathInto(area,x,y,S()*.94);
    }
    cx.fillStyle='rgba(100,220,240,.12)';cx.fill(area);cx.strokeStyle='rgba(100,220,240,.3)';cx.lineWidth=1;cx.stroke(area);
  }
  if(showFacilityIcons())for(const ci of g.airfields){
    const [x,y]=airfieldScreen(ci);if(x<-20||x>innerWidth+20||y<-20||y>innerHeight+20)continue;
    cx.fillStyle='#102535';cx.fillRect(x-10,y-10,20,20);
    cx.strokeStyle=UI.sel?.airbase===ci.k?'#ffe285':FACTION_COLOR[ci.owner];cx.lineWidth=2;cx.strokeRect(x-10,y-10,20,20);
    cx.font='16px "Segoe UI Symbol",sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillStyle='#b9efff';cx.fillText('✈',x,y);
    const count=g.airUnitsAt(ci.k).length;
    if(count&&UI.showUnits){cx.font='bold 10px sans-serif';cx.fillStyle='#fff';cx.fillText(String(count),x+12,y-10);}
  }
  cx.restore();
}
function showAirfieldPanel(ci) {
  const g=UI.game,body=document.getElementById('panel-body');
  if(!ci||!g.airfields.includes(ci))return;
  const offers=g.airRoster(ci),units=g.airUnitsAt(ci.k),selected=UI.sel;
  const transfer=selected&&g.isAir(selected)&&g.unitFaction(selected)===g.playerFaction&&g.moveRange(selected).cost.has(ci.x+','+ci.y);
  body.innerHTML=`<div class="p-title"><span>✈ ${ci.n}机场</span><span class="tag">${FACTION_NAME[ci.owner]}</span></div>
    <div class="p-sub">经济 ${g.gold[g.playerFaction]}金 · 驻扎 ${units.length}支空军<br>飞机在机场驻扎，不占陆军格位。每回合从基地半径内选择目标出击一次，出击后留在原机场；转场消耗整回合。新编部队下回合可行动。</div>
    <button class="btn" id="airfield-city">查看所属城市</button>
    ${transfer?`<button class="btn gold" id="airfield-transfer">将选中空军转场至${ci.n}</button>`:''}
    <div class="p-sub">驻扎空军（机场失守时，未撤离的飞机损失）</div>
    ${units.map((u,i)=>`<button class="btn" id="airfield-unit-${i}">${g.airRoleName(u)} · ${u.eq.n} · 兵力${u.hp} · ${u.attacked?'已行动':'可行动'}${selected&&UI.targets.has(u.id)?' · 点击攻击':''}</button>`).join('')||'<div class="p-sub">暂无驻扎空军</div>'}
    <div class="p-sub">组建空军</div>
    ${offers.map((o,i)=>{const error=g.airBuildError(ci.k,o.eqKey);return `<div class="shop-item" style="display:block"><div class="s-name"><span class="ico">${UnitIcons.svg('air',18)}</span>${AIR.roles[o.eq.airRole].name} · ${o.eq.n} · ${o.eq.yr}年</div><div class="p-sub">${o.eq.role}<br>${o.eq.nt||''}</div><div class="s-info">攻击${o.eq.atk} · 防御${o.eq.def} · 作战半径${o.eq.mov}格（约${o.eq.mov*45}公里）</div><button class="btn gold" id="air-build-${i}" ${error||UI.busy?'disabled':''}>${error||'组建'} · ${o.eq.cost}金</button><details class="p-sub"><summary>机型发展与解锁年份</summary>${EQUIP[o.country].air.filter(e=>e.airRole===o.eq.airRole).sort((a,b)=>a.yr-b.yr||a.tier-b.tier).map(e=>`${e.yr}：${e.n} · 攻${e.atk} 防${e.def} 半径${e.mov} · ${e.cost}金${e.nt?' · '+e.nt:''}`).join('<br>')}</details></div>`;}).join('')}`;
  document.getElementById('airfield-city').onclick=()=>showCityPanel(ci);
  const transferButton=document.getElementById('airfield-transfer');if(transferButton)transferButton.onclick=()=>{if(!UI.busy&&g.rebaseAir(selected,ci.k)){select(selected);updateTopbar();renderLog();}};
  units.forEach((u,i)=>{document.getElementById('airfield-unit-'+i).onclick=()=>{if(UI.busy||!g.units.includes(u))return;if(UI.sel&&UI.targets.has(u.id)){doAttack(u);return;}if(g.unitFaction(u)===g.playerFaction)select(u);else showUnitInfo(u);};});
  offers.forEach((o,i)=>{document.getElementById('air-build-'+i).onclick=()=>{if(UI.busy)return;const u=g.recruitAir(ci.k,o.eqKey);if(u){SFX.cap();updateTopbar();select(u);renderLog();}else showAirfieldPanel(ci);};});
}
function harborScreen(h) {
  const [x,y]=hexToPix(h.c,h.r),d=Math.max(12,S()*.6);
  return [x+d,y-d];
}
function drawHarbors(g) {
  cx.save();
  cx.strokeStyle='#81dbe6';cx.lineWidth=2;
  for(const p of NAVAL.passages){
    const a=hexToPix(...p.a),b=hexToPix(...p.b);
    cx.beginPath();cx.moveTo(...a);cx.lineTo(...b);cx.stroke();
  }
  if(showFacilityIcons())for(const h of g.harbors){
    const [x,y]=harborScreen(h);
    if(x<-20||x>innerWidth+20||y<-20||y>innerHeight+20)continue;
    cx.fillStyle='#102535';cx.fillRect(x-9,y-9,18,18);
    cx.strokeStyle=FACTION_COLOR[g.cityByKey[h.cityKey].owner]||'#aaa';cx.lineWidth=2;cx.strokeRect(x-9,y-9,18,18);
    cx.font='16px "Segoe UI Symbol",sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillStyle='#d9f1ff';cx.fillText('⚓',x,y);
  }
  cx.restore();
}
function drawConstruction(g) {
  if(!showFacilityIcons())return;
  cx.save();cx.font='bold 12px sans-serif';cx.textAlign='center';cx.fillStyle='#ffe285';
  for(const ci of g.cities)if(ci.factory){const [x,y]=hexToPix(ci.x,ci.y);cx.fillText('⚒',x-Math.max(14,S()*.7),y+Math.max(14,S()*.7));}
  for(const p of g.construction){
    const ci=g.cityByKey[p.cityKey],[x,y]=hexToPix(p.kind==='harbor'?p.c:ci.x,p.kind==='harbor'?p.r:ci.y);
    if(p.kind==='harbor'){hexPath(x,y,S()*.85);cx.strokeStyle='#ffe285';cx.lineWidth=2;cx.stroke();cx.fillText('⚓施工 '+p.remaining,x,y);}
  }
  cx.restore();
}
function constructionHTML(city) {
  const g=UI.game;
  return `<div class="p-sub">城市设施 · 每种一座；不同设施可同时施工。费用开工时支付，城市易手后设施及工程由新控制方接管。</div>`+
    Object.entries(ECONOMY.construction).map(([kind,rule])=>{
      const job=g.construction.find(p=>p.cityKey===city.k&&p.kind===kind),done=g.hasFacility(city,kind),error=g.constructionError(city.k,kind);
      const state=done?'已建成':job?'建设中 · 剩余'+job.remaining+'回合':error||'可建设';
      return `<div class="p-sub">${rule.name}：${state}${kind==='factory'?' · 可组建炮兵与装甲部队':''}</div>`+
        (!done&&!job&&city.owner===g.playerFaction?`<button class="btn" id="city-build-${kind}" ${error||UI.busy?'disabled':''}>${kind==='harbor'?'选择海格建设港口':'建设'+rule.name} · ${rule.cost}金 · ${rule.turns}回合</button>`:'');
    }).join('');
}
function beginConstruction(city,kind,site=null) {
  const g=UI.game;if(UI.busy)return;
  if(g.startConstruction(city.k,kind,site)){closeModal();SFX.click();updateTopbar();renderLog();showCityPanel(city);autoSave();}
  else {banner(g.constructionError(city.k,kind,site)||'请选择港址',2200);showCityPanel(city);}
}
function chooseHarborSite(city) {
  const g=UI.game,sites=g.harborSites(city),rule=ECONOMY.construction.harbor;
  const [x,y]=hexToPix(city.x,city.y);
  openModal(`<div class="modal"><h1>${city.n} · 选择港址</h1><p>费用${rule.cost}金，工期${rule.turns}回合。选择城市相邻的空闲海格开工；非己方部队占据工地时暂停施工。</p>${sites.map((p,i)=>{
    const [sx,sy]=hexToPix(...p),direction=(sx>x?'东':'西')+(sy<y?'北':sy>y?'南':'');
    return `<button class="btn" id="harbor-site-${i}">在${direction}侧海域建设（${p.join(',')}）</button>`;
  }).join('')||'<p>没有可用的相邻海域。</p>'}<button class="btn" id="harbor-site-cancel">取消</button></div>`);
  sites.forEach((p,i)=>document.getElementById('harbor-site-'+i).onclick=()=>beginConstruction(city,'harbor',p));
  document.getElementById('harbor-site-cancel').onclick=closeModal;
}
function shipNameKind(entry) { return {historical:'史实舰名',planned:'计划舰名／代号',proposed:'游戏拟名',generic:'通用编号'}[entry.kind]||'通用编号'; }
function showHarborPanel(h) {
  if(!h)return;
  const g=UI.game,city=g.cityByKey[h.cityKey],body=document.getElementById('panel-body');
  const offers=g.navalRoster(city),occupant=g.unitAt(h.c,h.r);
  body.innerHTML=`<div class="p-title"><span>⚓ ${city.n}军港</span><span class="tag">${FACTION_NAME[city.owner]}</span></div>
    <div class="p-sub">当前经济：${g.gold[g.playerFaction]}金。点击舰种建造当前最先进型号，舰艇在港口海格下水，下回合可行动。旧舰不会自动升级。</div>
    <div class="p-sub">${occupant?'泊位被'+g.unitName(occupant)+'占用，请先驶离。':'泊位空闲。'} 控制相邻城市即可控制军港；舰艇无法夺取城市。</div>
    <button class="btn" id="harbor-city">查看所属城市</button>
    ${occupant?'<button class="btn" id="harbor-unit">查看泊位舰队／部队</button>':''}
    ${offers.map((o,i)=>{const error=g.navalBuildError(city.k,o.eqKey,g.playerFaction);
      const country=o.country==='neutral'?COUNTRIES[city.ct].name:COUNTRIES[o.country]?.name;
      const list=EQUIP[o.country][o.eq.cls];
      const nextName=g.nextShipName(o.country==='neutral'?city.ct:o.country,o.eqKey);
      return `<div class="shop-item" style="display:block"><div class="s-name">${CLASSES[o.eq.cls].glyph} ${CLASSES[o.eq.cls].name} · ${country}</div>
      <div>${o.eq.n}${o.locked?' · '+o.eq.yr+'年解锁':''}</div><div class="s-info">下艘舰名：${nextName.n} · ${shipNameKind(nextName)}</div>
      <div class="s-info">攻击${o.eq.atk} · 防御${o.eq.def} · 移动${o.eq.mov} · 射程${o.eq.rng}<br>${o.eq.role}<br>${o.eq.nt}</div>
      <button class="btn gold" id="naval-build-${i}" ${error||UI.busy?'disabled':''}>${o.locked?'尚未解锁':error||'建造'} · ${o.eq.cost}金</button>
      <details class="p-sub"><summary>舰型发展（游戏解锁年份）</summary>${list.map(e=>`${e.yr}：${e.n}${e.planned?'【计划／未建成】':''}`).join('<br>')}</details></div>`;
    }).join('')}`;
  document.getElementById('harbor-city').onclick=()=>showCityPanel(city);
  const unitButton=document.getElementById('harbor-unit');
  if(unitButton)unitButton.onclick=()=>{if(occupant&&g.units.includes(occupant)){if(g.unitFaction(occupant)===g.playerFaction)select(occupant);else showUnitInfo(occupant);}};
  offers.forEach((o,i)=>{const b=document.getElementById('naval-build-'+i);if(b)b.onclick=()=>{
    if(UI.busy)return;
    const unit=g.recruitNaval(city.k,o.eqKey);
    if(unit){SFX.cap();updateTopbar();select(unit);}else showHarborPanel(h);
  };});
}
function handleClick(sx, sy) {
  const g = UI.game;
  const [wx, wy] = screenToWorld(sx, sy);
  const [c, r] = pixToHex(wx, wy);
  if (!g.inMap(c, r)) return;
  if(UI.airMission&&UI.sel){airMissionTarget(c,r);return;}
  const airIcon=showFacilityIcons()&&g.airfields.find(ci=>{const [x,y]=airfieldScreen(ci);return Math.abs(sx-x)<=10&&Math.abs(sy-y)<=10;});
  if(airIcon){showAirfieldPanel(airIcon);return;}
  const harborIcon=showFacilityIcons()&&g.harbors.find(h=>{const [x,y]=harborScreen(h);return Math.abs(sx-x)<=10&&Math.abs(sy-y)<=10;});
  if(harborIcon){deselect();showHarborPanel(harborIcon);return;}
  const u = g.unitAt(c, r);
  const city = g.cityAt(c, r);
  const myF = g.playerFaction;

  // 1) 选中部队攻击敌人
  if (UI.sel && u && g.canTargetFaction(UI.sel,u,true)) {
    if (UI.targets.has(u.id)) { doAttack(u); return; }
  }
  // 2) 选中部队移动
  if (UI.sel && !UI.sel.attacked && (!u||g.isAir(UI.sel)) && UI.range && UI.range.cost.has(c + ',' + r)) {
    doMove(c, r); return;
  }
  // 3) 选择己方单位
  if (u && g.unitFaction(u) === myF) { select(u); return; }
  // 4) 查看敌人
  if (u) { UI.sel = null; UI.range = null; UI.targets.clear(); showUnitInfo(u); return; }
  // 5) 城市信息；只有己方空城可以招募。
  if (city) { deselect(); showCityPanel(city); return; }
  const harbor=showFacilityIcons()&&g.harborAt(c,r);
  if(harbor){deselect();showHarborPanel(harbor);return;}
  const work=showFacilityIcons()&&g.construction.find(p=>p.kind==='harbor'&&p.c===c&&p.r===r);
  if(work){deselect();showCityPanel(g.cityByKey[work.cityKey]);return;}
  deselect(); updatePanel();
}

function select(u) {
  const g = UI.game;
  UI.sel = u;UI.airMission=null;
  SFX.click();
  if (!u.moved) UI.range = g.moveRange(u); else UI.range = null;
  computeTargets();
  updatePanel();
}
function deselect() { UI.airMission=null; UI.sel = null; UI.range = null; UI.targets.clear(); }

/* 计算可攻击目标（含移动接敌方案）：enemyId -> null(原地可攻) | [c,r](接敌格) */
function computeTargets() {
  const g = UI.game, u = UI.sel;
  UI.targets.clear();
  if (!u || u.attacked) return;
  const spots = [{ c: u.c, r: u.r, plan: null, score: 99 }];
  if (UI.range) for (const [k, cost] of UI.range.cost) {
    const [c, r] = k.split(',').map(Number);
    if (g.movementEndsTurn(u,c,r)) continue;
    spots.push({ c, r, plan: [c, r], score: g.terrainDefBonus(c, r) - cost * 0.01 });
  }
  for (const e of g.units) {
    if (!g.canTargetFaction(u,e,true)) continue;
    let chosen;                    // undefined=不可及; null=原地可攻
    let bs = -1;
    for (const sp of spots) {
      if (g.canStrikeFrom(u,sp.c,sp.r,e)) {
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
    if (city && city.owner === g.playerFaction && !g.isAir(u)) {
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
  if (!g.targetsOf(u,true).includes(enemy)) return;
  UI.busy = true;
  const rec = g.attack(u, enemy);
  SFX.shot();
  UI.anims.push({ kind: 'flash', c1: rec.aC, r1: rec.aR, c2: rec.c, r2: rec.r, t0: performance.now(), dur: 300 });
  for(const hit of rec.splash||[])UI.anims.push({kind:'dmg',c:hit.c,r:hit.r,text:'-'+hit.dmg,t0:performance.now(),dur:1000});
  UI.anims.push({ kind: 'dmg', c: rec.c, r: rec.r, text: '-' + rec.dmg, t0: performance.now(), dur: 1000 });
  setTimeout(() => {
    if (rec.killed || rec.attDied) { SFX.boom(); UI.anims.push({ kind: 'boom', c: rec.c, r: rec.r, t0: performance.now(), dur: 700 }); }
    if (rec.counter) {
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
    for(const hit of b.splash||[])UI.anims.push({kind:'dmg',c:hit.c,r:hit.r,text:'-'+hit.dmg,t0:performance.now(),dur:900});
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
function cityDefenseText(city) {
  return `${city.cap ? '首都' : '城市'}地形：防御+${Math.round(UI.game.terrainDefBonus(city.x,city.y)*100)}%（炮兵、空军攻击忽略）`;
}
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
    html = `<b style="color:${COUNTRIES[u.ct].color === '#b39b45' ? '#ffd75e' : '#fff'}">${g.unitName(u)}</b><br>
      ${g.isNaval(u)?g.navalIdentity(u):COUNTRIES[u.ct].name+' · '+FACTION_NAME[g.unitFaction(u)]+' · '+CLASSES[u.eq.cls].name}<br>
      ⚔${u.eq.atk} 🛡${u.eq.def} 👣${g.movOf(u)}${u.eq.cls === 'art'||g.isNaval(u) ? ' 🎯' + g.rangeOf(u) : ''} ❤${u.hp}/100<br>
      ${city ? cityDefenseText(city)+'<br>' : ''}${u.dug ? '🔒 已驻防(+30%防御) ' : ''}${u.vet ? `老练度+${u.vet * 8}% ` : ''}${gen ? `<br>🎖 ${gen.name}（${gen.title}）` : ''}`;
  } else if (city) {
    html = `<b>${city.n}</b>${city.cap ? ' ★首都' : ''}<br>${COUNTRIES[city.ct].name} · ${FACTION_NAME[city.owner]}控制<br>${cityDefenseText(city)}<br>收入 ${g.cityIncome(city)} 金/回合${city.note ? '<br>' + city.note : ''}<br><span style="color:#9aa4b0">占领该国首都可令其全境易手</span>`;
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
  const airport=showFacilityIcons()&&g.airfields.find(ci=>{const [x,y]=airfieldScreen(ci);return Math.abs(sx-x)<=10&&Math.abs(sy-y)<=10;});
  if(airport)html=`<b>✈ ${airport.n}机场</b><br>${FACTION_NAME[airport.owner]}控制 · 驻扎${g.airUnitsAt(airport.k).length}支空军<br>点击打开机场 · 组建／选择空军`;
  const harbor=showFacilityIcons()&&g.harbors.find(h=>{const [x,y]=harborScreen(h);return Math.abs(sx-x)<=10&&Math.abs(sy-y)<=10;});
  if(harbor){const ci=g.cityByKey[harbor.cityKey];html=`<b>⚓ ${ci.n}军港</b><br>${FACTION_NAME[ci.owner]}控制 · 点击建造海军<br>泊位需空闲；新舰下回合行动`;}
  if(g.contamination(c,r))html+=`<br>☢ 核污染：剩余${g.contamination(c,r)}回合，每回合-${AIR.nuclear.damage}兵力；城市收入为0，暂停补员。`;
  if (html) {
    const tk = c + ',' + r + '|' + (u ? u.id : 0)+'|'+html;
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
  body.innerHTML = `<div class="p-sub">点击部队下达命令 · 点击空城招募 · 点击 ⚓ 军港建造海军 · N 下一部队 · E 结束回合</div>`;
}

function showUnitPanel(u) {
  const g = UI.game;
  const body = document.getElementById('panel-body');
  const gen = g.genOf(u);
  const my = g.unitFaction(u) === g.playerFaction;
  const idle = my && (!u.moved || !u.attacked);
  const skills = gen ? gen.skills.map(skillText).join('<br>') : '';
  const rank = gen ? Math.min(5, 1 + Math.floor((g.genKills[gen.id] || 0) / 3)) : 0;
  const ship=g.transportOf(u),atSea=g.isEmbarked(u);
  const airborneCargo=g.cargoOf(u),base=g.airBase(u),waitingPara=base?g.unitAt(base.x,base.y):null;
  const transportPanel=my&&!g.isNaval(u)&&u.eq.cls!=='air'?`<div class="p-sub">运输装备：${ship?ship.name:'未配备'} · ${atSea?'航行中':'陆上'}<br>沿海且尚未行动时购买／升级；下海、上岸各耗尽整回合行动。装备保留，升级只补差价。</div><div class="row-btns">${ECONOMY.transports.map((t,i)=>`<button class="btn" id="pb-ship-${i}" title="价格${t.cost}金；海上移动${t.move}，防御${t.defense}，攻击保留${Math.round(t.attackMultiplier*100)}%" ${UI.busy||!g.canEquipTransport(u,t.id)?'disabled':''}>${t.name} · ${t.year>g.year()?t.year+'年解锁':ship&&ship.cost>=t.cost?(ship.id===t.id?'已配备':'已有更高级'):g.transportPrice(u,t.id)+'金'}</button>`).join('')}</div>`:'';
  body.innerHTML = `
    <div class="p-title"><span>${g.unitName(u)}</span><span class="tag" style="border-color:${FACTION_COLOR[g.unitFaction(u)]}">${FACTION_NAME[g.unitFaction(u)]}</span></div>
    <div class="p-sub">${g.isNaval(u)?g.navalIdentity(u):COUNTRIES[u.ct].name+' · '+CLASSES[u.eq.cls].name} · ${u.eq.nt || ''}</div>
    <div class="hpbar"><div style="width:${Math.max(0, u.hp)}%;background:${u.hp > 60 ? '#67d13d' : u.hp > 30 ? '#e8c33a' : '#e05338'}"></div></div>
    <div class="grid2">
      <span>攻击 <b>${atSea?Math.round(u.eq.atk*ship.attackMultiplier):u.eq.atk}</b></span><span>防御 <b>${atSea?ship.defense:u.eq.def}</b></span>
      <span>${g.isAir(u)?'作战半径':'移动力'} <b>${g.movOf(u)}</b></span><span>${(u.eq.cls === 'art'||g.isNaval(u)) ? '射程 <b>' + g.rangeOf(u) + '</b>' : '经验 <b>' + u.xp + '</b>'}</span>
      <span>兵力 <b>${u.hp}/100</b></span><span>老练 <b>+${u.vet * 8}%</b></span>
    </div>
    ${atSea?`<div class="p-sub">🚢 ${ship.name} · 海上攻击保留${Math.round(ship.attackMultiplier*100)}% · 射程1<br>航行移动力固定${ship.move}；海上无法驻防或自动补员。</div>`:''}
    ${g.isNaval(u)?`<div class="p-sub">舰名来源：${shipNameKind(g.shipNameInfo(u))}${g.shipNameInfo(u).note?' · '+g.shipNameInfo(u).note:''}<br>⚓ ${u.eq.role}<br>仅在海上航行；己方军港每回合修复25兵力。射程内可反击，无法占领城市。</div>`:''}
    ${g.cityAt(u.c,u.r)?`<div class="p-sub">🛡 ${cityDefenseText(g.cityAt(u.c,u.r))}<br>与驻防、老练及将领加成共同计入战斗防御。</div>`:''}
    ${g.cityAt(u.c,u.r)?'<button class="btn" id="garrison-city">查看城市 · 建设设施</button>':''}
    ${!g.isAir(u)&&g.airfields.some(ci=>ci.x===u.c&&ci.y===u.r)?'<button class="btn gold" id="garrison-airfield">✈ 打开机场 · 组建空军</button>':''}
    ${g.isAir(u)?`<div class="p-sub">✈ 驻扎机场：${g.airBase(u)?.n||'无'}<br>作战半径 ${g.airRadius(u)}格（约${g.airRadius(u)*45}公里） · 每回合出击一次<br>地图青色格为出击范围，蓝格为可转场的己方机场；转场后本回合不能攻击。空军无法占领城市或驻防。</div><button class="btn" id="unit-airfield">打开驻扎机场</button>`:''}
    ${g.isAir(u)?`<div class="p-sub">机种：${g.airRoleName(u)}<br>${u.eq.role}<br>${u.eq.nt||''}</div>`:''}
    ${my&&g.isAir(u)&&g.airRole(u)==='transport'?`<div class="p-sub">载员：${airborneCargo?airborneCargo.eq.n+' · 兵力'+airborneCargo.hp:'空载'}<br>在同一机场城市组建伞兵，待双方可行动时装载。装载后可立即伞降；卸载、转场和伞降均耗尽本回合行动。</div><button class="btn" id="air-load" ${UI.busy||u.moved||u.attacked||airborneCargo||!waitingPara?.eq.para||waitingPara?.moved||waitingPara?.attacked?'disabled':''}>装载机场伞兵</button><button class="btn" id="air-unload" ${UI.busy||u.moved||u.attacked||!airborneCargo||waitingPara?'disabled':''}>在机场卸载</button><button class="btn gold" id="air-drop" ${UI.busy||u.moved||u.attacked||!airborneCargo?'disabled':''}>执行伞降 · 选择目标</button>`:''}
    ${my&&g.isAir(u)&&g.airRole(u)==='strategic'?`<div class="p-sub">☢ 核打击：${AIR.nuclear.year}年解锁 · 每次${AIR.nuclear.cost}金</div><button class="btn danger" id="air-nuclear" ${UI.busy||g.nuclearError(u,u.c,u.r)?'disabled':''}>核打击 · 选择目标</button>`:''}
    ${transportPanel}
    ${u.dug ? '<div class="tag" style="border-color:#7ec8ff;color:#7ec8ff">已驻防：防御+30%，移动/攻击后解除</div>' : ''}
    ${gen ? `<div class="gen-chip" style="display:flex;gap:8px;align-items:flex-start">
      <div class="gen-portrait" style="background:${COUNTRIES[gen.ct].color};width:40px;height:40px;flex-shrink:0">${genPortrait(gen)}</div>
      <div style="flex:1;min-width:0">
        <span class="gname">🎖 ${gen.name}</span> <span style="color:#9aa4b0">${gen.title} · ${'★'.repeat(rank)}级 · 击杀${g.genKills[gen.id] || 0}</span>
        <div class="skill-list">${skills}</div>
        <div class="gbio">${gen.bio}</div>
      </div>
    </div>` : ''}
    ${my ? `<div class="row-btns">
      ${idle && !u.attacked && !atSea && !g.isNaval(u) && !g.isAir(u) ? '<button class="btn" id="pb-dug">🔒 驻防</button>' : ''}
      ${idle ? '<button class="btn" id="pb-skip">⏭ 待命</button>' : ''}
      ${idle&&!g.isNaval(u) ? '<button class="btn gold" id="pb-gen">🎖 将领</button>' : ''}
      <button class="btn" id="pb-next">⏩ 下一部队</button>
    </div>
    <div class="p-sub" style="margin-top:8px">${u.moved && u.attacked ? '⛔ 本回合已行动完毕' : !u.moved ? g.isAir(u)?'青色格：航程 · 蓝格：机场转场 · 红框：可出击目标':'蓝格：可移动 · 红框敌军：可攻击' : '已移动，仍可攻击红框敌军'}</div>` : `<div class="p-sub">${g.unitFaction(u)==='neutral'?'中立部队（尚未参战）':'敌方部队'}</div>`}`;
  const load=document.getElementById('air-load');if(load)load.onclick=()=>{if(!UI.busy&&g.loadParatrooper(u,waitingPara)){select(u);renderLog();}};
  const unload=document.getElementById('air-unload');if(unload)unload.onclick=()=>{if(!UI.busy&&g.unloadParatrooper(u))select(u);};
  const drop=document.getElementById('air-drop');if(drop)drop.onclick=()=>beginAirMission('drop');
  const nuclear=document.getElementById('air-nuclear');if(nuclear)nuclear.onclick=()=>beginAirMission('nuclear');
  const garrisonCity=document.getElementById('garrison-city');if(garrisonCity)garrisonCity.onclick=()=>showCityPanel(g.cityAt(u.c,u.r));
  const garrisonAirport=document.getElementById('garrison-airfield');if(garrisonAirport)garrisonAirport.onclick=()=>showAirfieldPanel(g.cityAt(u.c,u.r));
  const airportButton=document.getElementById('unit-airfield');if(airportButton)airportButton.onclick=()=>showAirfieldPanel(g.airBase(u));
  ECONOMY.transports.forEach((t,i)=>{const button=document.getElementById('pb-ship-'+i);if(button)button.onclick=()=>{if(!UI.busy&&g.equipTransport(u,t.id)){SFX.click();select(u);updateTopbar();}};});
  const b1 = document.getElementById('pb-dug');
  if (b1) b1.onclick = () => { if(UI.busy||g.isNaval(u)||g.isAir(u)||g.isEmbarked(u)||u.attacked)return; u.dug = true; u.moved = true; u.attacked = true; SFX.click(); UI.range = null; UI.targets.clear(); showUnitPanel(u); };
  const b2 = document.getElementById('pb-skip');
  if (b2) b2.onclick = () => { u.moved = true; u.attacked = true; UI.range = null; UI.targets.clear(); updatePanel(); nextUnit(); };
  const b3 = document.getElementById('pb-gen');
  if (b3) b3.onclick = () => {if(!g.isNaval(u))showGenerals(u);};
  const b4 = document.getElementById('pb-next');
  if (b4) b4.onclick = () => nextUnit();
}

function showUnitInfo(u) { showUnitPanel(u); }

function recruitmentTabsHTML(prefix, labels, selected) {
  return `<div class="recruit-tabs" role="group" aria-label="招募类别">${labels.map((label,i)=>`<button class="btn" id="${prefix}-tab-${i}" aria-pressed="${label===selected}">${label}</button>`).join('')}</div>`;
}
function showFactoryPanel(city) {
  const g=UI.game,body=document.getElementById('panel-body');if(!city.factory)return;
  const groups=['炮兵','装甲部队'];
  const category=groups.includes(UI.factoryCategory)?UI.factoryCategory:groups[0];
  const offers=g.factoryRoster(city).map((o,i)=>({...o,index:i})).filter(o=>o.eq.cls===(category==='炮兵'?'art':'tank')),blocked=city.owner!==g.playerFaction||city.demilitarized||!g.recruitmentSite(city)||UI.busy;
  body.innerHTML=`<div class="p-title">⚒ ${city.n}工厂</div><div class="p-sub">当前经济 ${g.gold[g.playerFaction]}金。炮兵与装甲在工厂组建，仅部署到空闲城市格，新部队当回合不能行动，需在城内停留至下回合。</div>
    <button class="btn" id="factory-city">返回城市</button>
    ${recruitmentTabsHTML('factory',groups,category)}
    ${offers.map(o=>`<div class="shop-item"><div><span class="ico">${UnitIcons.svg(o.eq.cls,18)}</span>${o.eq.n}<div class="s-info">⚔${o.eq.atk} 🛡${o.eq.def} 👣${o.eq.mov} · 射程${o.eq.rng||1}<br>${o.eq.nt||''}</div><button class="btn gold" id="factory-build-${o.index}" ${blocked||o.eq.cost>g.gold[g.playerFaction]?'disabled':''}>组建 · ${o.eq.cost}金</button></div></div>`).join('')}`;
  document.getElementById('factory-city').onclick=()=>showCityPanel(city);
  groups.forEach((label,i)=>document.getElementById('factory-tab-'+i).onclick=()=>{UI.factoryCategory=label;showFactoryPanel(city);});
  offers.forEach(o=>document.getElementById('factory-build-'+o.index).onclick=()=>{if(UI.busy)return;const u=g.recruitFactory(city.k,o.eqKey);if(u){updateTopbar();renderLog();select(u);}else showFactoryPanel(city);});
}
function showCityPanel(city) {
  const g = UI.game;
  const body = document.getElementById('panel-body');
  const canRecruit = !city.demilitarized && city.owner === g.playerFaction && !!g.recruitmentSite(city) && !UI.busy;
  const groups=['民兵','徒步步兵','机动步兵'];
  const category=groups.includes(UI.cityRecruitCategory)?UI.cityRecruitCategory:groups[0];
  const roster = canRecruit ? g.rosterFor(city).filter(it=>it.eq.group===category) : [];
  body.innerHTML = `
    <div class="p-title"><span>${city.n}${city.cap ? ' ★' : ''}</span><span class="tag" style="border-color:${FACTION_COLOR[city.owner]}">${FACTION_NAME[city.owner]}</span></div>
    <div class="p-sub">🛡 ${cityDefenseText(city)}<br>守军自动获得，无需点击驻防；驻防另加30%防御。</div>
    <div class="p-sub">${COUNTRIES[city.ct].name} · 收入 ${g.cityIncome(city)} 金/回合 · 💰当前 ${g.gold[g.playerFaction]}</div>
    ${g.airfields.includes(city)?'<button class="btn gold" id="city-airfield">✈ 打开机场 · 组建空军</button>':''}
    ${g.harbors.some(h=>h.cityKey===city.k)?'<button class="btn gold" id="city-harbor">⚓ 打开军港 · 建造舰艇</button>':''}
    ${city.factory?'<button class="btn gold" id="city-factory">⚒ 打开工厂 · 组建炮兵与装甲</button>':''}
    ${constructionHTML(city)}
    ${city.note ? `<div class="p-sub">${city.note}</div>` : ''}
    <div class="p-sub">${city.demilitarized ? '非军事区港口：禁止本地招募' : canRecruit ? '新部队组建后下回合方可行动' : '仅己方城市且有可用部署格可招募'}</div>
    ${recruitmentTabsHTML('city-recruit',groups,category)}
    ${roster.map(it => `
      <div class="shop-item ${it.locked || it.eq.cost > g.gold[g.playerFaction] ? 'locked' : ''}" data-eq="${it.eqKey}">
        <div><div class="s-name"><span class="ico">${UnitIcons.svg(it.eq.cls,15)}</span>${it.eq.n} · ${it.eq.group||''}${it.locked ? ` 🔒${it.eq.yr}年解锁` : ''}</div>
        <div class="s-info">⚔${it.eq.atk} 🛡${it.eq.def} 👣${it.eq.mov}${it.eq.rng ? ' 🎯' + it.eq.rng : ''} ${it.eq.nt || ''}</div></div>
        <div class="s-cost">${it.eq.cost}金</div>
      </div>`).join('')}`;
  for(const kind of Object.keys(ECONOMY.construction)){const button=document.getElementById('city-build-'+kind);if(button)button.onclick=()=>{if(UI.busy)return;kind==='harbor'?chooseHarborSite(city):beginConstruction(city,kind);};}
  groups.forEach((label,i)=>document.getElementById('city-recruit-tab-'+i).onclick=()=>{UI.cityRecruitCategory=label;showCityPanel(city);});
  const factoryButton=document.getElementById('city-factory');if(factoryButton)factoryButton.onclick=()=>showFactoryPanel(city);
  const airportButton=document.getElementById('city-airfield');if(airportButton)airportButton.onclick=()=>showAirfieldPanel(city);
  const harborButton=document.getElementById('city-harbor');
  if(harborButton)harborButton.onclick=()=>showHarborPanel(g.harbors.find(h=>h.cityKey===city.k));
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
      closeModal(); deselect(); UI.cam.z = MAP_META.labelZooms[2]; centerOn(ci.x, ci.y);
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
  Music.play('lobby');
  const hasSave = (() => { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } })();
  let fac = 'axis', diff = 'normal';
  const FINFO = {
    axis: { name: '轴心国 · 德国', color: '#43484a',
      desc: '拥有最精良的装备与将领，开局即与英法波全面开战。闪击波兰、击溃法国，但 1941 年巴巴罗萨行动将把你拖入双线消耗的深渊。适合喜欢进攻的指挥官。',
      gens: '古德里安 · 隆美尔 · 曼施坦因 · 莫德尔 · 凯塞林 · 龙德施泰特' },
    west: { name: '同盟国 · 英法', color: '#2f5f9e',
      desc: '开局在大陆处于劣势，马奇诺防线能否挡住装甲洪流？守住伦敦与巴黎，等待美国参战与诺曼底登陆的翻盘时刻。适合喜欢防守反击的指挥官。',
      gens: '蒙哥马利 · 巴顿 · 戴高乐 · 艾森豪威尔 · 亚历山大 · 布莱德雷 · 勒克莱尔 · 特德' },
    sov: { name: '苏联', color: '#8f1f16',
      desc: '1941 年 6 月前保持和平，抓紧时间备战。战争爆发后以空间换时间，用钢铁洪流淹没侵略者，最终攻克柏林。适合喜欢大兵团作战的指挥官。',
      gens: '朱可夫 · 罗科索夫斯基 · 科涅夫 · 崔可夫 · 卡图科夫 · 戈沃罗夫' },
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
  Music.play(loaded?.over==='victory'?'victory':loaded?.over==='defeat'?'defeat':'battle',!loaded?.over);
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
      '<br><br>本剧本已部署各国开局舰队；美国大西洋预备舰队将在参战后加入同盟。点击舰艇可查看舰名，点击 ⚓ 可继续造舰。' +
      '<br><br>目标：占领所有敌对阵营的首都（柏林 / 伦敦·巴黎 / 莫斯科）。')).then(() => nextUnitHint());
  }
}

/* ---- 将领面板 ---- */
function skillText(s) {
  const M = {
    atk: m => `攻击力 +${Math.round(m * 100)}%`, def: m => `防御力 +${Math.round(m * 100)}%`,
    mov: (n,s2) => `${s2.cls==='air'?'作战半径／转场距离':'移动力'} +${n}`, nozoc: () => '无视敌方控制区', rng: n => `炮兵射程 +${n}`,
    counter: m => `反击伤害 +${Math.round(m * 100)}%`, citydef: m => `驻守城市防御 +${Math.round(m * 100)}%`,
    vs: (m, s2) => `对${CLASSES[s2.tgt] ? CLASSES[s2.tgt].name : s2.tgt}伤害 +${Math.round(m * 100)}%`,
    aura: m => `相邻友军攻击 +${Math.round(m * 100)}%（光环）`, rage: m => `兵力低于50%时攻击 +${Math.round((m??.15)*100)}%`,
  };
  let cls = s.cls ? CLASSES[s.cls].name : '';
  return `${cls ? cls + '·' : ''}${(M[s.k] || (() => s.k))(s.m !== undefined ? s.m : s.n, s)}`;
}
/* 将领头像：国别底色之上叠一层深色剪影半身像（军帽区分风格），中央单字快速辨认，
   右下角徽记由技能自动推导——兵种限定技能→兵种字，防御系→盾，其余→★ */
function genPortrait(gn) {
  const HAT = 'rgba(13,18,26,.82)', RIM = 'rgba(255,255,255,.25)';
  const f = gn.face || { hat: 'peak' };
  const hats = {
    peak: `<path d="M16.8 16.2 Q16.8 7.5 27 7.5 Q37.2 7.5 37.2 16.2 L37.2 18.4 L16.8 18.4 Z" fill="${HAT}" stroke="${RIM}" stroke-width=".7"/>
           <rect x="16.8" y="15" width="20.4" height="2.6" fill="#0a0e14"/>
           <path d="M15 18.4 Q27 24 39 18.4 L39 20.6 Q27 26.2 15 20.6 Z" fill="${HAT}" stroke="${RIM}" stroke-width=".6"/>`,
    steel: `<path d="M16 15.5 Q16 6.5 27 6.5 Q38 6.5 38 15.5 Q38 19 27 19.6 Q16 19 16 15.5 Z" fill="${HAT}" stroke="${RIM}" stroke-width=".7"/>
            <path d="M14 16.2 Q27 21.8 40 16.2" stroke="${RIM}" stroke-width="2.2" fill="none"/>`,
    beret: `<ellipse cx="26.5" cy="12" rx="11" ry="5.6" transform="rotate(-9 26.5 12)" fill="${HAT}" stroke="${RIM}" stroke-width=".7"/>
            <circle cx="33.5" cy="7.6" r="1.5" fill="${HAT}" stroke="${RIM}" stroke-width=".5"/>
            <path d="M16.5 16.5 Q27 20.5 37.5 15.5" stroke="#0a0e14" stroke-width="2.4" fill="none"/>`,
    pilot: `<path d="M17.5 17.5 Q17 8 27 8 Q37 8 36.5 17.5 Q31.5 20.8 27 20.8 Q22.5 20.8 17.5 17.5 Z" fill="${HAT}" stroke="${RIM}" stroke-width=".7"/>
            <rect x="16.6" y="15" width="4.6" height="7.6" rx="2" fill="${HAT}" stroke="${RIM}" stroke-width=".5"/>
            <rect x="32.8" y="15" width="4.6" height="7.6" rx="2" fill="${HAT}" stroke="${RIM}" stroke-width=".5"/>
            <circle cx="23" cy="14" r="2.9" fill="rgba(160,200,235,.4)" stroke="${RIM}" stroke-width=".8"/>
            <circle cx="31" cy="14" r="2.9" fill="rgba(160,200,235,.4)" stroke="${RIM}" stroke-width=".8"/>
            <line x1="25.9" y1="14" x2="28.1" y2="14" stroke="${RIM}" stroke-width=".9"/>`,
    ushanka: `<path d="M17 14.5 Q17 7 27 7 Q37 7 37 14.5 Z" fill="${HAT}" stroke="${RIM}" stroke-width=".8"/>
            <rect x="15.8" y="13.2" width="5.4" height="9" rx="2.2" fill="${HAT}" stroke="${RIM}" stroke-width=".5"/>
            <rect x="32.8" y="13.2" width="5.4" height="9" rx="2.2" fill="${HAT}" stroke="${RIM}" stroke-width=".5"/>
            <path d="M17 14.5 Q27 18.6 37 14.5 L37 17 L17 17 Z" fill="${HAT}"/>`,
    bush: `<path d="M16.8 17.2 Q27 8.6 37.2 17.2 L37.2 20 L16.8 20 Z" fill="${HAT}" stroke="${RIM}" stroke-width=".7"/>
           <path d="M19.5 13.4 Q27 9 34.5 13.4" stroke="#0a0e14" stroke-width="1.6" fill="none"/>`,
  };
  let acc = '';
  if (f.acc === 'goggles') acc = `<circle cx="22.8" cy="11.6" r="2.7" fill="rgba(160,200,235,.4)" stroke="${RIM}" stroke-width=".8"/>
    <circle cx="31.2" cy="11.6" r="2.7" fill="rgba(160,200,235,.4)" stroke="${RIM}" stroke-width=".8"/>
    <line x1="25.5" y1="11.6" x2="28.5" y2="11.6" stroke="${RIM}" stroke-width=".9"/>`;
  if (f.acc === 'star') acc = `<path d="M27 8.2 l1.06 2.16 2.39.34-1.73 1.68.41 2.37-2.13-1.12-2.13 1.12.41-2.37-1.73-1.68 2.39-.34 Z"
    fill="${gn.ct === 'su' ? '#ff6a52' : '#ffd24a'}" stroke="rgba(0,0,0,.4)" stroke-width=".4"/>`;
  let badge = '★';
  for (const s of gn.skills) if (s.cls) { badge = CLASSES[s.cls].glyph; break; }
  if (badge === '★' && gn.skills.some(s => s.k === 'def' || s.k === 'counter' || s.k === 'citydef')) badge = '盾';
  return `<svg viewBox="0 0 54 54" width="100%" height="100%" style="display:block">
    <path d="M9 54 Q11 39 27 35.5 Q43 39 45 54 Z" fill="rgba(8,12,18,.55)"/>
    <circle cx="27" cy="20.5" r="8.6" fill="rgba(8,12,18,.55)"/>
    <rect x="24.4" y="27.5" width="5.2" height="4.5" fill="rgba(8,12,18,.55)"/>
    ${hats[f.hat] || ''}${acc}
    <text x="27" y="40" text-anchor="middle" font-size="16.5" font-weight="900" fill="#fff"
      stroke="rgba(0,0,0,.6)" stroke-width="2.6" paint-order="stroke" font-family="inherit">${gn.name[0]}</text>
    <circle cx="44.5" cy="44.5" r="7.6" fill="#10141a" stroke="#d8b24a99" stroke-width="1"/>
    <text x="44.5" y="47.8" text-anchor="middle" font-size="8.5" font-weight="700" fill="#d8b24a" font-family="inherit">${badge}</text>
  </svg>`;
}
function filterGeneralRoster(pool,query='',country='') {
  const q=query.trim().toLocaleLowerCase();
  return pool.filter(gn=>(!country||gn.ct===country)&&[gn.name,gn.en||'',gn.title,COUNTRIES[gn.ct].name,gn.skills.map(skillText).join(' ')].join(' ').toLocaleLowerCase().includes(q));
}
function showGenerals(targetUnit) {
  const g = UI.game;
  if(targetUnit&&g.isNaval(targetUnit))targetUnit=null;
  const pool = GENERALS.filter(x => g.cf[x.ct] === g.playerFaction);
  openModal(`
    <div class="modal" style="max-width:720px">
      <h1><span class="zh">🎖 将领名册</span></h1>
      <div class="sub">${FACTION_NAME[g.playerFaction]}阵营 · ${targetUnit ? `指派至：${targetUnit.eq.n}（${targetUnit.c},${targetUnit.r}）` : '在部队面板中点击"将领"可指派'} · 击杀3次晋升一阶（每阶攻防+4%） · 头像右下徽记＝兵种亲和（步/炮/坦/轰 · 盾＝防御系 · ★＝指挥系）</div>
      <div class="row-btns">
        <input id="general-query" aria-label="搜索将领" placeholder="姓名、外文名或技能" style="flex:1;min-width:120px;background:#101820;color:#eee;border:1px solid #637386;padding:8px">
        <select id="general-country" aria-label="将领所属国家" style="background:#101820;color:#eee;padding:8px"><option value="">全部国家</option>${[...new Set(pool.map(gn=>gn.ct))].map(ct=>`<option value="${ct}">${COUNTRIES[ct].name}</option>`).join('')}</select>
      </div><div class="p-sub" id="general-count">显示 ${pool.length} / ${pool.length} 位本阵营将领</div>
      ${pool.map(gn => {
        const uid = g.genUnit[gn.id];
        const unit = uid ? g.units.find(u => u.id === uid) : null;
        const rank = Math.min(5, 1 + Math.floor((g.genKills[gn.id] || 0) / 3));
        return `<div class="gen-row" data-general-row="${gn.id}">
          <div class="gen-portrait" style="background:${COUNTRIES[gn.ct].color}">${genPortrait(gn)}</div>
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
  const query=document.getElementById('general-query'),country=document.getElementById('general-country');
  const filter=()=>{
    const ids=new Set(filterGeneralRoster(pool,query.value||'',country.value||'').map(gn=>gn.id));
    modalRoot.querySelectorAll('[data-general-row]').forEach(row=>{row.style.display=ids.has(row.dataset.generalRow)?'':'none';});
    document.getElementById('general-count').textContent=`显示 ${ids.size} / ${pool.length} 位本阵营将领`;
  };
  query.oninput=filter;country.onchange=filter;
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
        左键选择部队/城市 · 蓝色格子=可移动，红色闪烁敌军=可攻击（点击自动接敌）· 拖拽平移地图，滚轮缩放<br>陆军在沿海购买运输装备，点击相邻海格下海；下海／上岸结束整回合行动，海上按运输船移动力航行。1942、1944年解锁更高级舰艇。<br>
        快捷键：<b>N</b> 下一部队 · <b>E/回车</b> 结束回合 · <b>G</b> 将领 · <b>H</b> 帮助 · <b>M</b> 静音 · <b>Esc/右键</b> 取消
        <h4>■ 回合与经济</h4>
        每回合=1个月。城市每回合产出金币，在己方空城可组建新部队（下回合可行动）。部队在己方城市+25兵力/回合，己方领土+12。
        <h4>■ 战斗规则</h4>
        伤害 ≈ 42 × 攻/(攻+防)。防御方获得地形加成；兵力越低输出越低。<br>
        炮兵/空军无视地形防御加成；步兵/装甲在相邻格反击，海军可在自身射程和目标限制内反击，包括对来袭空军的防空还击。<br>
        进入敌军相邻格会被<b>控制区(ZOC)</b>截停（具有忽略控制区技能的将领与空军除外）。<br>
        <b>驻防</b>+30%防御，移动或攻击后解除。老练度（击杀获取经验）最多+24%攻防。
        <h4>■ 兵种克制（攻击修正）</h4>
        <table><tr><th>攻击方↓</th><th>步兵</th><th>炮兵</th><th>装甲</th><th>空军</th></tr>
        <tr><td>步兵</td><td>100%</td><td>130%</td><td>65%</td><td>50%</td></tr>
        <tr><td>炮兵</td><td>100%</td><td>110%</td><td>115%</td><td>60%</td></tr>
        <tr><td>装甲</td><td>115%</td><td>140%</td><td>100%</td><td>40%</td></tr>
        <tr><td>空军</td><td>115%</td><td>130%</td><td>110%</td><td>—</td></tr></table>
        <h4>■ 地形防御加成</h4>
        森林+30% · 丘陵+40% · 山地+60% · 城市+40% · 首都+60%。陆军购买运输装备后可进入海洋，湖泊仍不可通行；跨河多消耗1点移动力。<br>运输船25金／1939年、两栖运输舰55金／1942年、两栖突击舰90金／1944年；升级补差价。下海与上岸分别耗尽行动，海上移动力固定5，攻击分别保留20%／45%／70%，防御为6／12／18。空军仅在机场组建与驻扎，以机场为中心在作战半径内出击；可攻击海上目标。转场仅限航程内己方机场，并耗尽本回合行动。机场与陆军可以同格。
        <h4>■ 军港与海军</h4>
        点击海格 ⚓ 或城市面板的“打开军港”，建造当前年份最先进舰型；泊位必须空闲。新舰下回合行动，已造旧舰不自动升级。计划舰和游戏解锁年份会在面板中说明。<br>
        八类舰艇仅在海上移动，不能登陆占城。潜艇只能攻击海上目标；驱逐舰、潜艇、航母和空军可以反潜。水面舰可岸轰，航母直接用舰载机远程打击，无需另造机队。己方军港每回合修复25兵力。<br>
        军港随城市控制权转移。青色短线为真实狭窄海峡的通航连接，按格距消耗移动力；基尔运河暂仅为地理标记。<br>
        <h4>■ 胜负</h4>
        <b>占领敌方首都 → 该国全境沦陷</b>（所有城市易手）。击败所有交战敌国首都即获胜利；己方首都全部丢失则战败。<br>
        中立国（西班牙/瑞典/瑞士/土耳其等）可进攻，但会倒向你的敌人！
        <h4>■ 音乐与署名</h4>
        音乐与音效可用顶部🔊按钮或 M 键统一开关。首次点击或按键后开始播放，切到后台时暂停。<br>
        Music: Five Armies, Air Prelude, Impact Moderato, Fanfare for Space, Wounded<br>
        by Kevin MacLeod (<a href="https://incompetech.com/" target="_blank" rel="noopener noreferrer">incompetech.com</a>) — Licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC-BY 4.0</a>.<br>
        <a href="music/credits.txt" target="_blank" rel="noopener">完整音乐署名</a>
        <h4>■ 历史事件</h4>
        意大利参战(1940.6) → 匈牙利罗马尼亚入轴(1940.11) → <b>巴巴罗萨</b>(1941.6) → 美国参战(1941.12) → <b>俄罗斯严冬</b>(每年12-2月，轴心国在苏境-12兵力/回合) → <b>诺曼底登陆</b>(1944.6)
      </div>
      <div class="actions"><button class="btn primary" id="m-close">开始指挥</button></div>
    </div>`);
  document.getElementById('m-close').onclick = closeModal;
}

/* ---- 终局 ---- */
function showEndModal(win) {
  Music.play(win?'victory':'defeat',false);
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
function toggleSound() { const on = SFX.toggle(); Music.setEnabled(on); document.getElementById('btn-sound').textContent = on ? '🔊' : '🔇'; }
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
