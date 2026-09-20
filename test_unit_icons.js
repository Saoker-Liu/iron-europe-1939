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
assert.equal(icons.shape('bb'),null);assert.equal(icons.svg('bb',18),'');
ops.length=0;icons.draw(canvas,'inf',0,0,24);
assert.deepEqual(ops.map(x=>x[0]),['save','translate','scale','stroke','fill','restore'],'outline and fill share one transform');
ops.length=0;icons.draw(canvas,'inf',0,0,5);assert(!ops.some(x=>x[0]==='stroke'),'tiny icons omit outline');
const page=fs.readFileSync('landing/index.html','utf8');assert(page.includes('data-count="116"'));assert(page.includes('href="../index.html"'));
for(const match of page.matchAll(/src="(img\/[^"]+)"/g))assert(fs.existsSync('landing/'+match[1]));
console.log('Artwork: shared SVG/Canvas geometry, cached paths, stable outline transform, tiny icons, naval fallback and landing assets passed');
