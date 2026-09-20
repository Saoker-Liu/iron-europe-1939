'use strict';
// Exercise the production UI with deterministic frame/timer clocks and a minimal
// Canvas/DOM adapter. This tests scheduling/coordinates, not browser rasterisation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const D = require('./js/data/load-node');
const { Game, hexDist } = require('./js/engine/game');
function harness() {
  const frames = [], timers = [], blits = [], arcs = [], texts = [], elements = new Map();
  let resizes = 0, failBlit = false;
  const context = new Proxy({
    measureText(text) { return {width:text.length*12}; },
    fillText(text,x,y) { assert([x,y].every(Number.isFinite),'valid label coordinates');texts.push(text); },
    arc(x,y,r) { assert(r >= 0 && [x,y,r].every(Number.isFinite), 'valid canvas arc'); arcs.push([x,y,r]); },
    drawImage(...args) { if (failBlit) { failBlit = false; throw Error('transient canvas failure'); } blits.push(args); },
  }, {get: (o,k) => k in o ? o[k] : () => {}});
  function element(canvas = false) {
    return {style:{},classList:{add(){},toggle(){}},addEventListener(){},querySelectorAll(){return [];},getContext(){return context;},
      set width(v){this._width=v;if(canvas)resizes++;}, get width(){return this._width;},height:0};
  }
  const sandbox = {...D, MapLabels:require('./js/ui/map-labels'), Game, hexDist, HexMath:globalThis.HexMath, console,
    innerWidth:1280,innerHeight:900,performance:{now:()=>1005},
    document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},createElement:()=>element(true)},
    addEventListener(){},requestAnimationFrame(fn){frames.push(fn);},setTimeout(fn){timers.push(fn);},
    Path2D:class {moveTo(){} lineTo(){} closePath(){}},
  };
  sandbox.window=sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('js/ui/ui.js','utf8'),sandbox);
  const run = code => vm.runInContext(code,sandbox);
  run(`UI.game = new Game('axis'); UI.cam = {x:0,y:0,z:1};
    UI.game.units = []; const ci=UI.game.cityByKey.berlin;
    UI.sel = UI.game.spawnUnit('de','de:inf:0',ci.x,ci.y,{});
    const destination=UI.game.landNeighbors(ci.x,ci.y)[0];
    centerOn(ci.x,ci.y); doMove(...destination);`);
  return {run,frames,timers,blits,arcs,texts,get resizes(){return resizes;},failNextBlit(){failBlit=true;},
    frame(now){assert.equal(frames.length,1,'exactly one next frame'); frames.shift()(now);}};
}

// Browser frame timestamps can precede performance.now() at animation creation.
const h=harness();
assert.doesNotThrow(()=>h.run('render(1000)'), 'movement first frame must not access path[-1]');
assert.equal(h.frames.length,1);
// Use the actual UI painter and camera: labels must change even while the
// texture remains capped and is reused. These regions fit a normal viewport.
function labelsAt(z,lon,lat){
  h.run(`{ UI.cam.z=${z}; const labelPoint=Geography.geoToGrid(${lon},${lat});
    UI.cam.x=640-labelPoint[0]*S()*SQ3; UI.cam.y=450-labelPoint[1]*S()*1.5; }`);
  h.texts.length=0;h.run('drawMapLabels(UI.game)');return new Set(h.texts);
}
const overview=labelsAt(.12,35,48);
assert(overview.has('苏联')&&overview.has('乌克兰')&&!overview.has('巴库'));
const regional=labelsAt(.4,43,43);
assert(regional.has('格鲁吉亚')&&regional.has('巴库')&&!regional.has('苏联')&&!regional.has('阿布哈兹地区'));
const local=labelsAt(1,41,43);
assert(local.has('阿布哈兹地区')&&local.has('索契')&&!local.has('格鲁吉亚'));
assert(labelsAt(1,9.7,54.2).has('基尔运河'));
assert(labelsAt(.4,22.4,58.4).has('萨列马岛'));
const max=labelsAt(1.3,36.3,45.3);
assert(max.has('刻赤')&&!max.has('刻赤半岛'));
h.run('UI.cam.z=1; centerOn(UI.game.cityByKey.berlin.x,UI.game.cityByKey.berlin.y)');
const start=h.arcs[0].slice(0,2);
h.run('UI.cam.x += 80; UI.cam.y += 40'); h.arcs.length=0;
h.frame(1000);
assert.deepEqual(h.arcs[0].slice(0,2),[start[0]+80,start[1]+40],'moving unit follows camera');
h.frame(1050);h.frame(5000); // Delayed timer / returning from a background tab.
h.timers.shift()();
assert.equal(h.run('UI.moveAnim'),null);
assert.equal(h.run('UI.busy'),false);
assert.equal(h.run('UI.sel.moved'),true);
h.frame(5016);
const before=h.blits.at(-1).slice(1,3);
h.run('UI.cam.x += 120; UI.cam.y -= 30');h.frame(5032);
assert.deepEqual(h.blits.at(-1).slice(1,3),[before[0]+120,before[1]-30],'post-move map paints panning');
h.run(`UI.anims=['dmg','flash','boom','cap'].map(kind=>({kind,t0:5100,dur:100,
  c:1,r:1,c1:0,r1:0,c2:1,r2:1,text:'-10'}))`);
assert.doesNotThrow(()=>h.frame(5050),'new combat effects tolerate earlier frame timestamps');
h.frame(5150);h.frame(5200);
assert.equal(h.run('UI.anims.length'),0,'effects expire after their duration');

// Above the texture scale cap, a stationary camera must not rebuild every 140ms.
const initial=h.resizes;
for(let t=5200;t<6800;t+=200)h.frame(t);
assert.equal(h.resizes,initial,'unchanged zoom reuses terrain cache');
assert(h.run('terrainCache.cv.width * terrainCache.cv.height') < 12010000,'map texture respects pixel budget');
h.run('UI.cam.z=2');h.frame(7000);h.frame(7200);
assert.equal(h.resizes,initial,'zoom above cap reuses same texture');
h.run('UI.cam.z=2.2;centerOn(UI.game.cityByKey.berlin.x,UI.game.cityByKey.berlin.y)');
h.texts.length=0;h.frame(7240);
assert(h.texts.includes('柏林'),'maximum zoom paints all city names through drawFrame');
assert.equal(h.resizes,initial,'label tier switch does not rebuild capped terrain');
h.run('UI.cam.z=2.19');h.texts.length=0;h.frame(7280);
assert(h.texts.includes('柏林'),'major city remains visible below maximum zoom');
h.run('UI.cam.z=1;centerOn(UI.game.cityByKey.berlin.x,UI.game.cityByKey.berlin.y)');
h.texts.length=0;h.frame(7300);
assert(h.texts.includes('柏林'),'major city remains visible with secondary cities');

h.run('UI.cam.z=.2');h.frame(7400);h.frame(7600);
assert.equal(h.resizes,initial+1,'zoom below cap rebuilds once');
h.run("UI.game.cityByKey.berlin.owner='west'");h.frame(7800);
assert.equal(h.resizes,initial+2,'ownership change still rebuilds immediately');

// An unexpected drawing error remains observable but cannot kill frame scheduling.
h.failNextBlit();assert.throws(()=>h.frame(8000),/transient canvas failure/);
assert.equal(h.frames.length,1,'frame scheduled even after an exception');
assert.doesNotThrow(()=>h.frame(8016));
h.run('UI.game=null');h.frame(8032);
assert.equal(h.frames.length,1,'no-game screen has a single animation loop');
console.log('Render: first-frame timing, delayed movement, camera panning, cache reuse and frame recovery passed.');
