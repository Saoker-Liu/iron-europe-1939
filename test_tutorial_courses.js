const assert=require('node:assert/strict');
const {TutorialCampaign:C}=require('./js/engine/tutorial-campaigns');
const courses=require('./js/data/tutorial-courses');
for(const [id,c]of Object.entries(courses))for(let i=0;i<c.steps.length;i++){
 const g=new C(id,i),a=g.units.find(u=>u.trainingTag==='actor'),t=g.units.find(u=>u.trainingTag==='target'),base=g.cities[0];
 assert(!g.objectiveMet(),id+': fresh objective');
 switch(c.steps[i].id){
 case 'terrain':g.units.forEach(u=>g.inspect(u));break;
 case 'river':assert(g.moveRange(a).cost.get('3,2')>g.moveRange(a).cost.get('2,1'));assert(g.moveUnit(a,3,2));break;
 case 'counter':case 'antisub':case 'sortie':assert(g.attack(a,t));break;
 case 'general':assert(g.assignGeneral('guderian',a));assert(g.attack(a,t));break;
 case 'infantry':['民兵','徒步步兵','机动步兵'].forEach(v=>g.inspectTab(v));assert(g.recruit(base.k,g.rosterFor(base).find(o=>!o.locked).eqKey));break;
 case 'artillery':case 'armor':{const cls=c.steps[i].id==='armor'?'tank':'art';assert(g.recruitFactory(base.k,g.factoryRoster(base).find(o=>!o.locked&&o.eq.cls===cls).eqKey));g.endTurn();break;}
 case 'support':assert(g.attack(g.units.find(u=>u.trainingTag==='gun'),t));assert(g.attack(a,t));break;
 case 'shipyard':assert(g.recruitNaval(base.k,g.navalRoster(base).find(o=>o.eq.cls==='dd'&&!o.locked).eqKey));break;
 case 'embark':assert(g.equipTransport(a,'transport'));assert(g.moveUnit(a,3,2));break;
 case 'landing':assert(g.moveUnit(a,5,2));g.endTurn();assert(g.moveUnit(a,6,2));break;
 case 'airbuild':assert(g.recruitAir(base.k,g.airRoster(base).find(o=>o.eq.airRole==='fighter').eqKey));break;
 case 'rebase':assert(g.rebaseAir(a,'forward'));break;
 case 'airdrop':assert(g.loadParatrooper(a,g.units.find(u=>u.trainingTag==='para')));assert(g.paradrop(a,5,2));break;
 case 'nuclear':assert(g.nuclearStrike(a,5,2));break;
 case 'income':g.inspectCity(base);g.endTurn();assert.equal(g.gold.axis,g.initialGold+g.initialIncome);break;
 case 'construction':assert(g.startConstruction(base.k,'factory'));for(let n=0;n<3;n++)g.endTurn();break;
 case 'occupation':case 'surrender':case 'neutral':assert(g.moveUnit(a,4,2));break;
 case 'cession':assert(g.lessonTreaty());assert(g.units.find(u=>u.trainingTag==='donor').c!==4);break;
 }
 assert(g.objectiveMet(),id+': '+c.steps[i].id+' completed');assert.throws(()=>g.serialize());assert.equal(g.over,null);console.log(id,c.steps[i].id,'passed');
}
