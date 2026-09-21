const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const D=require('./js/data/load-node');
function context(lang){const ctx={...structuredClone(Object.fromEntries(Object.entries(D).filter(([k,v])=>k!=='Geography'&&typeof v!=='function'))),turnOf:D.turnOf,Geography:D.Geography,HexMath:globalThis.HexMath,console,document:{readyState:'loading',addEventListener(){}},localStorage:{getItem:()=>lang,setItem(){}}};ctx.window=ctx;vm.createContext(ctx);for(const f of ['ui/i18n','ui/i18n-en','ui/i18n-en-geo','ui/i18n-en-mil','ui/i18n-en-updates','engine/game','engine/diplomacy','engine/tutorial'])vm.runInContext(fs.readFileSync('js/'+f+'.js','utf8'),ctx,{filename:f});vm.runInContext('I18N.translateData()',ctx);return {ctx,run:code=>vm.runInContext(code,ctx)};}
const zh=context('zh'),en=context('en');
zh.run("g=new Game('sov'); saved=g.serialize()");en.ctx.saved=zh.ctx.saved;
en.run('g=Game.deserialize(saved)');
assert.equal(en.run('g.units.length'),zh.run('g.units.length'));
assert.equal(en.run('g.units.filter(u=>g.isNaval(u)).map(u=>u.shipName).join()'),zh.run('g.units.filter(u=>g.isNaval(u)).map(u=>u.shipName).join()'));
assert(!/[\u3400-\u9fff]/.test(en.run('g.units.map(u=>g.isNaval(u)?g.navalIdentity(u):u.eq.n).join()')),'English unit names, historical ships and equipment');
en.run("g.beginLocalWar('fi');g.turn=2;g.processEvents()");assert(!/[\u3400-\u9fff]/.test(en.run('g.neutralityConsequence("ro","sov")')),'Neutral-war warning is English');
for(const object of en.run('[...CITIES,...Object.values(COUNTRIES),...EVENTS,...GENERALS,...MAP_META.labels,...Object.values(EQUIP).flatMap(c=>Object.values(c).flat())]'))for(const field of ['n','name','title','text','bio','nt','note','region','role','className'])if(typeof object[field]==='string')assert(!/[\u3400-\u9fff]/.test(object[field]),field+': '+object[field]);
zh.ctx.englishSave=en.run('g.serialize()');zh.run('restored=Game.deserialize(englishSave)');assert.equal(zh.run('restored.units.length'),en.run('g.units.length'));
assert.equal(en.run('JSON.stringify(g.usedShipNames.size)'),zh.run('JSON.stringify(restored.usedShipNames.size)'));
en.run('tutorial=new TutorialGame()');assert.equal(en.run('tutorial.cities[0].n'),'Training Camp');
console.log('Bilingual campaign: canonical ship identities, cross-language saves, current diplomacy, all display data and tutorial passed.');
