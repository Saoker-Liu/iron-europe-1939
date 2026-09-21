'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let paths=0;const ctx={Path2D:class{constructor(d){assert(d);this.d=d;paths++;}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/ui/unit-icons.js','utf8'),ctx);
const icons=vm.runInContext('UnitIcons',ctx);
const ops=[];const canvas=new Proxy({}, {get:(_,k)=>(...args)=>ops.push([k,...args]),set:()=>true});
for(const cls of ['inf','art','tank','air']){
  const p=icons.shape(cls);assert.equal(icons.shape(cls),p);
  assert(icons.svg(cls,18).includes(p.d));
  icons.draw(canvas,cls,20,20,24,{detail:true});
}
const first=paths;
for(let i=0;i<1000;i++)icons.draw(canvas,['inf','art','tank','air'][i%4],20,20,24,{detail:true});
assert.equal(paths,first,'rendering repeatedly must reuse Path2D objects');
const EXPECTED=['inf','art','tank','air',
  'tankCar','tankLight','tankHeavy','tankSuperheavy','artAa','artAt','artField','artRocket',
  'infCavalry','infMotorized','infMechanized',
  'airFighter','airHeavy','airCas','airNaval','airTactical','airStrategic','airTransport',
  'sub','dd','cl','ca','bc','bb','cve','cv','transport'];
assert.deepEqual(Object.keys(icons.SHAPES).sort(),[...EXPECTED].sort(),'icon set must cover every unit class and air role');
for(const cls of EXPECTED){assert(icons.shape(cls),cls+' must have a shape');assert(icons.svg(cls,18).includes('<path d='),cls+' must have inline SVG');}
assert.equal(icons.shape('no-such-class'),null);assert.equal(icons.svg('no-such-class',18),'','unknown classes fall back to caller-supplied glyphs');
ops.length=0;icons.draw(canvas,'inf',0,0,24);
assert.deepEqual(ops.map(x=>x[0]),['save','translate','scale','stroke','fill','restore'],'outline and fill share one transform');
ops.length=0;icons.draw(canvas,'inf',0,0,5);assert(!ops.some(x=>x[0]==='stroke'),'tiny icons omit outline');
const page=fs.readFileSync('landing/index.html','utf8');assert(page.includes('data-count="116"'));assert(page.includes('href="../index.html?play=1"'));
for(const match of page.matchAll(/src="(img\/[^"]+)"/g))assert(fs.existsSync('landing/'+match[1]));
console.log('Artwork: shared SVG/Canvas geometry, cached paths, stable outline transform, tiny icons, full class/air-role/naval coverage and landing assets passed');
