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
    clearTimeout(){},addEventListener(){},requestAnimationFrame(fn){frames.push(fn);},setTimeout(fn){timers.push(fn);},
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
// Exercise the purchase command and embarked status through the production UI.
h.run(`UI.game=new Game('axis');UI.game.units=[];UI.busy=false;UI.sel=null;
  {const port=UI.game.cityByKey.dover;
   UI.sel=UI.game.spawnUnit('de','de:inf:0',port.x,port.y,{});}
  showUnitPanel(UI.sel);document.getElementById('pb-ship-0').onclick();`);
assert.equal(h.run('UI.sel.transport'),'transport','purchase button equips selected army');
assert.equal(h.run('UI.game.gold.axis'),95,'purchase button charges correct amount');
h.run(`{const p=UI.game.neighbors(UI.sel.c,UI.sel.r).find(p=>UI.game.ocean(...p));
  UI.game.moveUnit(UI.sel,...p);showUnitPanel(UI.sel);}`);
assert(h.run("document.getElementById('panel-body').innerHTML.includes('航行中')"));
assert(h.run("document.getElementById('panel-body').innerHTML.includes('海上攻击保留20%')"));
assert(!h.run("document.getElementById('panel-body').innerHTML.includes('id=\"pb-dug\"')"),'no sea entrenchment button');
console.log('Render: first-frame timing, delayed movement, camera panning, cache reuse and frame recovery passed.');

// Real harbor icon click, latest offer buttons, launch and subsequent render.
h.run(`UI.game=new Game('axis');UI.game.units=[];UI.game.gold.axis=10000;UI.sel=null;UI.busy=false;
 UI.cam.z=1;{const h=UI.game.harbors.find(h=>h.cityKey==='kiel');centerOn(h.c,h.r);handleClick(...harborScreen(h));}`);
assert(h.run("document.getElementById('panel-body').innerHTML.includes('基尔军港')"));
assert(h.run("document.getElementById('panel-body').innerHTML.includes('德意志级前无畏舰')"));
h.run("document.getElementById('naval-build-1').onclick()");
assert.equal(h.run('UI.sel.eq.cls'),'dd');
assert(h.run('UI.game.isNaval(UI.sel) && UI.game.ocean(UI.sel.c,UI.sel.r)'));
assert(!h.run("document.getElementById('panel-body').innerHTML.includes('id=\"pb-ship-0\"')"));
assert(!h.run("document.getElementById('panel-body').innerHTML.includes('id=\"pb-dug\"')"));
h.run("showHarborPanel(UI.game.harbors.find(h=>h.cityKey==='kiel'))");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('泊位被')"));
const count=h.run('UI.game.units.length');h.run("document.getElementById('naval-build-0').onclick()");
assert.equal(h.run('UI.game.units.length'),count,'stale occupied-berth click cannot duplicate ships');
h.texts.length=0;h.frame(9000);assert(h.texts.includes('⚓'),'harbor marker painted');assert(h.texts.includes('驱'),'naval unit painted');
console.log('Naval UI: harbor click, production, blocked berth, unit panel and markers passed.');

// Named ships expose nation, type, class and personal name in production UI.
h.run(`UI.game=new Game('axis','normal',{initialFleet:false});UI.game.units=[];UI.sel=null;
 const named1=UI.game.spawnUnit('de','de:bb:1',10,1,{});
 const named2=UI.game.spawnUnit('de','de:bb:1',11,1,{});
 showUnitPanel(named2);`);
assert(h.run("document.getElementById('panel-body').innerHTML.includes('德国 · 战列舰 · 俾斯麦级 · 提尔皮茨号')"));
h.run('centerOn(named2.c,named2.r);updateTooltip(...hexToPix(named2.c,named2.r))');
assert(h.run("document.getElementById('tooltip').innerHTML.includes('俾斯麦级 · 提尔皮茨号')"));
h.run("UI.game.turn=16;showHarborPanel(UI.game.harbors.find(h=>h.cityKey==='kiel'))");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('下艘舰名：战列舰1')"));
h.run('UI.cam.z=1.3;centerOn(named2.c,named2.r)');h.texts.length=0;h.frame(10000);
assert(h.texts.includes('提尔皮茨号'),'zoomed map paints personal ship name');
console.log('Naval identity UI: panel, tooltip, next-name preview and map label passed.');

// City defense must be visible both with and without a garrison.
for(const [cityKey,bonus] of [['berlin',60],['hamburg',40]]){
 h.run(`UI.game.units=[];UI.sel=null;const ci_${cityKey}=UI.game.cityByKey.${cityKey};showCityPanel(ci_${cityKey});`);
 assert(h.run(`document.getElementById('panel-body').innerHTML.includes('防御+${bonus}%')`));
 h.run(`centerOn(ci_${cityKey}.x,ci_${cityKey}.y);updateTooltip(...hexToPix(ci_${cityKey}.x,ci_${cityKey}.y))`);
 assert(h.run(`document.getElementById('tooltip').innerHTML.includes('防御+${bonus}%')`));
 h.run(`UI.sel=UI.game.spawnUnit('de','de:inf:0',ci_${cityKey}.x,ci_${cityKey}.y,{});showUnitPanel(UI.sel);updateTooltip(...hexToPix(UI.sel.c,UI.sel.r));`);
 assert(h.run(`document.getElementById('panel-body').innerHTML.includes('防御+${bonus}%')`));
 assert(h.run(`document.getElementById('tooltip').innerHTML.includes('防御+${bonus}%')`));
}
console.log('City defense UI: ordinary/capital cities and garrisons expose terrain bonuses.');

// Airport access remains available with a ground garrison, and aircraft use an independent layer.
h.run(`UI.game=new Game('axis','normal',{initialFleet:false});UI.game.units=[];UI.sel=null;UI.busy=false;UI.cam.z=1;UI.game.gold.axis=10000;
 const airCity=UI.game.cityByKey.berlin;const garrison=UI.game.spawnUnit('de','de:inf:0',airCity.x,airCity.y,{});
 showCityPanel(airCity);`);
assert(h.run("document.getElementById('panel-body').innerHTML.includes('打开机场 · 组建空军')"));
h.run("document.getElementById('city-airfield').onclick()");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('柏林机场')"));
h.run("document.getElementById('air-build-0').onclick()");
assert(h.run("UI.game.isAir(UI.sel)&&UI.sel.airbase==='berlin'&&UI.sel.attacked"));
assert(h.run("UI.game.unitAt(airCity.x,airCity.y)===garrison"));
assert(h.run("document.getElementById('panel-body').innerHTML.includes('作战半径 6格')"));
assert(!h.run("document.getElementById('panel-body').innerHTML.includes('pb-dug')"));
h.run("UI.game.startTurnFor('axis');select(UI.sel);centerOn(airCity.x,airCity.y)");
h.texts.length=0;h.run('drawAirfields(UI.game)');assert(h.texts.includes('✈'));
h.run('handleClick(...airfieldScreen(airCity))');assert(h.run("document.getElementById('panel-body').innerHTML.includes('驻扎 1支空军')"));
h.run("document.getElementById('airfield-unit-0').onclick()");assert(h.run('UI.game.isAir(UI.sel)'));
h.run(`const transferCity=UI.game.airfields.find(ci=>ci.owner==='axis'&&ci.k!=='berlin'&&UI.game.moveRange(UI.sel).cost.has(ci.x+','+ci.y));showAirfieldPanel(transferCity);document.getElementById('airfield-transfer').onclick();`);
assert(h.run('UI.sel.airbase===transferCity.k&&UI.sel.moved&&UI.sel.attacked'));
h.run("showUnitPanel(garrison);document.getElementById('garrison-airfield').onclick()");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('柏林机场')"));
console.log('Airport UI: occupied-city entry, map icon, purchase, aircraft selection, radius display and transfer passed.');

// Seven-class shop and live special-mission controls use authoritative engine validation.
h.run(`UI.game=new Game('axis','normal',{initialFleet:false});UI.game.units=[];UI.sel=null;UI.busy=false;UI.game.gold.axis=10000;
 const missionBase=UI.game.cityByKey.berlin;showAirfieldPanel(missionBase);`);
for(const label of ['轻型战斗机','重型战斗机','近地支援机','海军轰炸机','战术轰炸机','战略轰炸机','运输机','机型发展与解锁年份'])
 assert(h.run(`document.getElementById('panel-body').innerHTML.includes('${label}')`));
h.run(`const transportKey=UI.game.airRoster(missionBase).find(o=>o.eq.airRole==='transport').eqKey;
 const carrier=UI.game.spawnUnit('de',transportKey,missionBase.x,missionBase.y,{});
 const parachutist=UI.game.spawnUnit('de','de:para:0',missionBase.x,missionBase.y,{});
 select(carrier);document.getElementById('air-load').onclick();`);
assert(h.run('UI.game.cargoOf(carrier)===parachutist'));
h.run("document.getElementById('air-drop').onclick()");assert.equal(h.run('UI.airMission'),'drop');
h.run(`const dropSpot=UI.game.landNeighbors(missionBase.x,missionBase.y)[0];centerOn(...dropSpot);handleClick(...hexToPix(...dropSpot));`);
assert(h.run('!parachutist.carrierId&&parachutist.c===dropSpot[0]&&carrier.attacked'));
h.run(`UI.game.turn=64;const strategicKey=UI.game.airRoster(missionBase).find(o=>o.eq.airRole==='strategic').eqKey;
 const nukePlane=UI.game.spawnUnit('de',strategicKey,missionBase.x,missionBase.y,{});
 select(nukePlane);document.getElementById('air-nuclear').onclick();const blastCity=UI.game.cityByKey.hamburg;airMissionTarget(blastCity.x,blastCity.y);`);
assert(h.run("document.getElementById('modal-root').innerHTML.includes('确认核打击')"));
h.run("document.getElementById('nuclear-cancel').onclick()");assert(h.run('Object.keys(UI.game.fallout).length===0&&!nukePlane.attacked'));
h.run("document.getElementById('air-nuclear').onclick();airMissionTarget(blastCity.x,blastCity.y);document.getElementById('nuclear-confirm').onclick()");
assert(h.run('UI.game.contamination(blastCity.x,blastCity.y)===6&&nukePlane.attacked&&UI.game.gold.axis===8000'));
h.run('showCityPanel(blastCity)');assert(h.run("document.getElementById('panel-body').innerHTML.includes('收入 0 金/回合')"));
h.run('centerOn(blastCity.x,blastCity.y)');h.texts.length=0;h.run('drawFallout(UI.game)');assert(h.texts.includes('☢ 6'));
console.log('Aircraft missions UI: seven roles, cargo loading, map paradrop, nuclear cancel/confirm, zero income and pollution overlay passed.');
// City construction uses the production panels and event handlers.
h.run(`UI.game=new Game('axis','normal',{initialFleet:false});UI.game.units=[];UI.game.gold.axis=10000;UI.sel=null;UI.busy=false;
 globalThis.localStorage={setItem(){}};
 const buildCity=UI.game.cities.find(c=>c.owner==='axis'&&!UI.game.airfields.includes(c)&&!c.demilitarized);
 const buildGuard=UI.game.spawnUnit('de','de:inf:0',buildCity.x,buildCity.y,{});
 showUnitPanel(buildGuard);document.getElementById('garrison-city').onclick();`);
assert(h.run("document.getElementById('panel-body').innerHTML.includes('建设机场 · 120金 · 2回合')"));
h.run("document.getElementById('city-build-airfield').onclick()");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('建设中 · 剩余2回合')"));
assert.equal(h.run('UI.game.gold.axis'),9880);
h.run("UI.game.advanceConstruction();UI.game.advanceConstruction();showCityPanel(buildCity)");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('打开机场 · 组建空军')"));
h.run("document.getElementById('city-build-factory').onclick();UI.game.advanceConstruction();UI.game.advanceConstruction();UI.game.advanceConstruction();showCityPanel(buildCity);drawConstruction(UI.game)");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('工厂：已建成')"));
h.run(`const buildCoast=UI.game.cities.find(c=>c.owner==='axis'&&!c.demilitarized&&!UI.game.harbors.some(h=>h.cityKey===c.k)&&UI.game.harborSites(c).length);
 showCityPanel(buildCoast);document.getElementById('city-build-harbor').onclick();`);
assert(h.run("modalRoot.innerHTML.includes('选择港址')"));
h.run("document.getElementById('harbor-site-0').onclick();drawConstruction(UI.game)");
assert.equal(h.run("UI.game.construction.filter(p=>p.kind==='harbor').length"),1);
h.run("UI.game.advanceConstruction();UI.game.advanceConstruction();UI.game.advanceConstruction();showCityPanel(buildCoast);document.getElementById('city-harbor').onclick()");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('点击舰种建造')"));
console.log('Construction UI: garrison access, cost, progress, completion, port selection and facility panels passed.');
// New-campaign airports expose the actual national opening formations.
h.run("UI.game=new Game('axis');UI.sel=null;UI.busy=false;UI.cam.z=1;centerOn(UI.game.cityByKey.berlin.x,UI.game.cityByKey.berlin.y);drawAirfields(UI.game);showAirfieldPanel(UI.game.cityByKey.berlin)");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('Bf 109 E')"));
assert(h.run("document.getElementById('panel-body').innerHTML.includes('Ju 52/3m')"));
assert.equal(h.run("UI.game.airUnitsAt('berlin').length"),5);
h.run("document.getElementById('airfield-unit-0').onclick()");
assert(h.run("UI.game.isAir(UI.sel)&&UI.sel.ct==='de'&&UI.sel.airbase==='berlin'"));
console.log('Initial air UI: deployed aircraft display, airport roster and selection passed.');
h.run("UI.game=new Game('axis');UI.game.units=[];UI.game.gold.axis=10000;UI.sel=null;UI.busy=false;showCityPanel(UI.game.cityByKey.berlin)");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('1939型武装党卫军师')"));
assert(!h.run("document.getElementById('panel-body').innerHTML.includes('data-eq=\"de:art:')"));
assert(!h.run("document.getElementById('panel-body').innerHTML.includes('data-eq=\"de:tank:')"));
h.run("UI.game.cityByKey.berlin.factory=true;showCityPanel(UI.game.cityByKey.berlin);document.getElementById('city-factory').onclick()");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('炮兵与装甲在工厂组建')"));
h.run("document.getElementById('factory-build-0').onclick()");
assert(h.run("UI.sel.eq.cls==='art'&&UI.sel.moved&&UI.sel.attacked"));
console.log('Infantry UI: latest infantry/unique roster, city separation and factory production passed.');
h.run("UI.game=new Game('axis');UI.game.units=[];UI.game.gold.axis=10000;UI.game.cityByKey.berlin.factory=true;UI.sel=null;UI.busy=false;showFactoryPanel(UI.game.cityByKey.berlin)");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('88mm防空炮')"));
assert(h.run("document.getElementById('panel-body').innerHTML.includes('射程3')"));
assert(h.run("document.getElementById('panel-body').innerHTML.includes('40%溅射')"));
h.run("document.getElementById('factory-build-1').onclick()");
assert(h.run("UI.sel.eq.artRole==='aa'"));
console.log('Artillery UI: factory roles, national AA, range and special descriptions passed.');
h.run("UI.game=new Game('axis');UI.game.units=[];UI.game.gold.axis=10000;UI.game.cityByKey.berlin.factory=true;UI.sel=null;UI.busy=false;showFactoryPanel(UI.game.cityByKey.berlin)");
assert(h.run("document.getElementById('panel-body').innerHTML.includes('1939型虎式坦克')"));
assert(h.run("document.getElementById('panel-body').innerHTML.includes('超重型坦克')"));
h.run("document.getElementById('factory-build-8').onclick()");
assert(h.run("UI.sel.eq.armorRole==='heavy'&&UI.sel.eq.counterMultiplier===.8"));
console.log('Armor UI: five factory categories, Tiger replacement and recruitment passed.');
