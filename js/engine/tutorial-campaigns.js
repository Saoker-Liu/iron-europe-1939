/* Independent small-map checkpoints using the production combat/economy rules. */
(function(root){
'use strict';
const Base=typeof module!=='undefined'&&module.exports?require('./game').Game:root.Game;
const courses=typeof module!=='undefined'&&module.exports?require('../data/tutorial-courses'):root.TutorialCourses;
const local=v=>typeof I18N!=='undefined'&&I18N.lang==='en'?v[1]:v[0];
class TutorialCampaign extends Base {
  constructor(courseId,lesson=0){
    if(!courses[courseId]||!courses[courseId].steps[lesson])throw Error('Unknown training checkpoint');
    super(courseId==='politics'&&lesson===5?'sov':'axis','normal',{initialGround:false,initialFleet:false,initialAir:false,initialGenerals:false});
    this.tutorial=true;this.courseId=courseId;this.lesson=lesson;this.width=10;this.height=7;
    this.units=[];this.nextId=1;this.log=[];this.pendingEvents=[];this.over=null;this.lastMove=null;
    this.airfields=[];this.harbors=[];this.construction=[];this.fallout={};this.usaIn=false;
    this.gold={axis:1200,west:0,sov:1200};this.genUnit=Object.fromEntries(Object.keys(this.genUnit).map(k=>[k,null]));
    this.wars=new Set(['axis|west']);this.blockedEdges=new Set();this.riverEdges=new Set();
    this.terr={};this.trainingHomes={};this.history=[];this.inspected=[];this.tabs=[];this.highlights=[];this.trainingReady=false;
    const id=this.checkpoint().id,neutral=id==='neutral',own=neutral?'su':'de',other=neutral?'fi':'pl';
    for(let r=0;r<this.height;r++)for(let c=0;c<this.width;c++){
      this.terr[c+','+r]='.';this.trainingHomes[c+','+r]=c<4?own:other;
    }
    this.cf[own]=this.playerFaction;this.cf[other]=neutral?'neutral':'west';
    const city=(k,n,x,y,ct,options={})=>({k,n:local(n),x,y,ct,controlCt:ct,owner:this.cf[ct],cap:false,inc:25,...options});
    this.cities=[city('training-base',['训练营','Training Camp'],1,2,own),city('training-town',['演习镇','Practice Town'],7,2,other)];
    const town=this.cities[1],base=this.cities[0];
    const sea=['shipyard','antisub','embark','landing'].includes(id);
    if(sea){for(let r=0;r<this.height;r++)for(let c=3;c<=5;c++){this.terr[c+','+r]='~';this.trainingHomes[c+','+r]=null;}base.x=2;this.harbors=[{cityKey:base.k,c:3,r:2}];}
    if(['occupation','cession','surrender'].includes(id)){
      town.x=4;town.cap=id==='surrender';
      this.cities.push(city('rear',['后方城','Rear Town'],8,4,other,{cap:id!=='surrender'}));
    }
    if(['artillery','armor'].includes(id))base.factory=true;
    if(['airbuild','sortie','rebase','airdrop','nuclear'].includes(id))this.airfields=[base];
    if(id==='rebase'){
      this.cities.push(city('forward',['前线机场','Forward Airfield'],4,2,own));this.airfields.push(this.cities[2]);
      for(let r=0;r<this.height;r++)for(let c=0;c<=4;c++)this.trainingHomes[c+','+r]=own;
    }
    if(id==='nuclear'){this.turn=(1945-1939)*12-8;this.gold.axis=5000;town.x=5;town.inc=60;}
    this.cityByKey=Object.fromEntries(this.cities.map(ci=>[ci.k,ci]));
    for(const ci of this.cities){this.terr[ci.x+','+ci.y]='c';this.trainingHomes[ci.x+','+ci.y]=ci.ct;}
    this.initTerritory();
    const add=(tag,ct,category,role,c,r,opts={})=>{
      const eq=this.trainingEquipment(ct,category,role);const u=this.spawnUnit(ct,eq,c,r,{silent:true});Object.assign(u,opts,{trainingTag:tag});return u;
    };
    const inf=(tag,c,r,ct=own,role='infantry',opts={})=>add(tag,ct,'inf',role,c,r,opts);
    if(id==='terrain'){
      for(let r=0;r<7;r++){this.terr['3,'+r]='m';this.terr['4,'+r]='f';this.terr['5,'+r]='h';}
      inf('regular',2,1);inf('mountain',2,3,own,'mountain');add('tank',own,'tank','medium',2,5);
    }else if(id==='river'){
      inf('actor',2,2);this.riverEdges.add(this.edgeKey([2,2],[3,2]));this.highlights=[[3,2]];
    }else if(id==='counter'){inf('actor',2,2);inf('target',3,2,other);}
    else if(id==='general'){add('actor',own,'tank','medium',2,2);inf('target',3,2,other);}
    else if(id==='support'){add('gun',own,'art','field',2,2);inf('actor',3,3);inf('target',4,2,other);}
    else if(id==='antisub'){add('actor',own,'dd',null,3,2);add('target','uk','sub',null,4,2);}
    else if(id==='embark'){inf('actor',2,2);this.highlights=[[3,2]];}
    else if(id==='landing'){inf('actor',3,2,own,'marine',{transport:'transport',embarked:true});this.highlights=[[5,2],[6,2]];}
    else if(id==='sortie'){add('actor',own,'air','cas',1,2);inf('target',4,2,other);}
    else if(id==='rebase'){add('actor',own,'air','fighter',1,2);this.highlights=[[4,2]];}
    else if(id==='airdrop'){add('actor',own,'air','transport',1,2);inf('para',1,2,own,'airborne');this.highlights=[[5,2]];}
    else if(id==='nuclear'){add('actor',own,'air','strategic',1,2);inf('target',5,2,other);inf('splash',6,2,other);this.highlights=[[5,2]];}
    else if(id==='occupation'||id==='surrender'){inf('actor',3,2);inf('remote',8,4,other);this.highlights=[[4,2]];}
    else if(id==='cession'){inf('donor',4,2,other);this.highlights=[[4,2],[8,4]];}
    else if(id==='neutral'){inf('actor',3,2);this.highlights=[[4,2]];}
    if(!this.highlights.length)this.highlights=this.units.length?this.units.map(u=>[u.c,u.r]):[[base.x,base.y]];
    this.initialGold=this.gold[this.playerFaction];this.initialIncome=this.factionIncome(this.playerFaction);
    this.trainingReady=true;
  }
  checkpoint(){return courses[this.courseId].steps[this.lesson];}
  trainingEquipment(ct,cls,role){
    const options=[];for(const [group,list]of Object.entries(EQUIP[ct]||EQUIP.neutral))for(let i=0;i<list.length;i++){
      const eq=list[i];if(eq.cls===cls&&(!role||[eq.infRole,eq.artRole,eq.armorRole,eq.airRole].includes(role))&&eq.yr<=this.year())options.push({key:`${ct}:${group}:${i}`,eq});
    }
    options.sort((a,b)=>b.eq.yr-a.eq.yr);if(!options.length)throw Error(`No training equipment: ${ct}/${cls}/${role}`);return options[0].key;
  }
  tile(c,r){return this.courseId?(this.inMap(c,r)?this.terr[c+','+r]:null):super.tile(c,r);}
  inMap(c,r){return this.courseId?Number.isInteger(c)&&Number.isInteger(r)&&c>=0&&r>=0&&c<this.width&&r<this.height:super.inMap(c,r);}
  legalCountry(c,r){return this.courseId?(this.inMap(c,r)?this.landTransfers?.[c+','+r]||this.trainingHomes[c+','+r]:null):super.legalCountry(c,r);}
  homeCountryOf(c,r){return this.courseId?this.legalCountry(c,r):super.homeCountryOf(c,r);}
  territoryCountry(c,r){
    if(!this.courseId)return super.territoryCountry(c,r);
    if(!this.inMap(c,r))return null;
    const home=this.legalCountry(c,r),deps=this.dependencies?.[r*MAP_W+c]||[],holders=deps.map(i=>this.controllingCountry(this.cities[i]));
    return holders.length&&holders.every(ct=>ct===holders[0])?holders[0]:home;
  }
  territoryOwner(c,r){return this.courseId?this.cf[this.territoryCountry(c,r)]||null:super.territoryOwner(c,r);}
  checkVictory(){if(!this.courseId)return super.checkVictory();this.over=null;return null;}
  record(kind,details={}){if(this.trainingReady)this.history.push({kind,...details});}
  inspect(u){if(u&&!this.inspected.includes(u.trainingTag))this.inspected.push(u.trainingTag);}
  inspectCity(city){if(city)this.record('city',{key:city.k});}
  inspectTab(category){if(!this.tabs.includes(category))this.tabs.push(category);}
  moveUnit(u,c,r){const cost=this.moveRange(u).cost.get(c+','+r),ok=super.moveUnit(u,c,r);if(ok)this.record('move',{tag:u.trainingTag,c,r,cost,embarked:!!u.embarked});return ok;}
  attack(u,target){const before=[u.hp,target.hp],result=super.attack(u,target);if(result)this.record('attack',{tag:u.trainingTag,target:target.trainingTag,general:u.gen,loss:before[0]-u.hp,damage:before[1]-target.hp});return result;}
  recruit(...args){const u=super.recruit(...args);if(u)this.record('recruit',{id:u.id,cls:u.eq.cls});return u;}
  recruitFactory(...args){const u=super.recruitFactory(...args);if(u)this.record('factory',{id:u.id,cls:u.eq.cls});return u;}
  recruitNaval(...args){const u=super.recruitNaval(...args);if(u)this.record('naval',{id:u.id,cls:u.eq.cls});return u;}
  recruitAir(...args){const u=super.recruitAir(...args);if(u)this.record('air',{id:u.id,role:u.eq.airRole});return u;}
  rebaseAir(u,key){const ok=super.rebaseAir(u,key);if(ok)this.record('rebase',{tag:u.trainingTag,key});return ok;}
  paradrop(u,c,r){const ok=super.paradrop(u,c,r);if(ok)this.record('drop',{c,r});return ok;}
  nuclearStrike(u,c,r){const ok=super.nuclearStrike(u,c,r);if(ok)this.record('nuclear',{c,r});return ok;}
  lessonTreaty(){if(this.checkpoint().id!=='cession'||this.history.some(x=>x.kind==='treaty'))return false;
    const ok=this.cedeTerritory('pl','de',['training-town']);if(ok)this.record('treaty');return ok;}
  endTurn(){
    this.applyFalloutDamage();this.turn++;this.advanceConstruction();this.startTurnFor(this.playerFaction);this.ageFallout();
    this.record('turn',{gold:this.gold[this.playerFaction],income:this.factionIncome(this.playerFaction)});
    this.pushLog(local(['演习回合结束：领取城市收入并恢复行动。','Training turn ended: city income collected and actions restored.']),'econ');
    return {actions:[],victory:null};
  }
  objectiveMet(){
    const h=this.history,id=this.checkpoint().id,has=(kind,p=()=>true)=>h.some(x=>x.kind===kind&&p(x));
    switch(id){
      case 'terrain':return ['regular','mountain','tank'].every(t=>this.inspected.includes(t));
      case 'river':return has('move',x=>x.tag==='actor'&&x.c===3&&x.r===2);
      case 'counter':return has('attack',x=>x.tag==='actor'&&x.target==='target');
      case 'general':return has('attack',x=>x.tag==='actor'&&x.general==='guderian');
      case 'infantry':return ['民兵','徒步步兵','机动步兵'].every(t=>this.tabs.includes(t))&&has('recruit');
      case 'artillery':return has('factory',x=>x.cls==='art');
      case 'armor':return has('factory',x=>x.cls==='tank'&&this.units.some(u=>u.id===x.id&&!u.moved&&!u.attacked));
      case 'support':{const i=h.findIndex(x=>x.kind==='attack'&&x.tag==='gun');return i>=0&&h.slice(i+1).some(x=>x.kind==='attack'&&x.tag==='actor');}
      case 'shipyard':return has('naval',x=>x.cls==='dd');
      case 'antisub':return has('attack',x=>x.tag==='actor'&&x.target==='target');
      case 'embark':return has('move',x=>x.embarked&&x.c===3&&x.r===2);
      case 'landing':return has('move',x=>x.embarked&&x.c===5&&x.r===2)&&has('move',x=>!x.embarked&&x.c===6&&x.r===2);
      case 'airbuild':return has('air',x=>x.role==='fighter');
      case 'sortie':return has('attack',x=>x.tag==='actor'&&x.target==='target');
      case 'rebase':return has('rebase',x=>x.key==='forward');
      case 'airdrop':return has('drop',x=>x.c===5&&x.r===2);
      case 'nuclear':return this.contamination(5,2)>0&&this.cityIncome(this.cityByKey['training-town'])===0;
      case 'income':return has('city')&&has('turn');
      case 'construction':return !!this.cityByKey['training-base'].factory;
      case 'occupation':return this.cityByKey['training-town'].owner==='axis'&&!this.annexed.pl;
      case 'cession':return has('treaty')&&this.cityByKey['training-town'].ct==='de';
      case 'surrender':return !!this.annexed.pl&&!this.units.some(u=>u.ct==='pl');
      case 'neutral':return this.atWar('sov','local:fi')&&has('move',x=>x.c===4&&x.r===2)&&!this.atWar('sov','west');
      default:return false;
    }
  }
  serialize(){throw Error(local(['教程不写入正式战役存档','Tutorials never overwrite campaign saves']));}
}
root.TutorialCampaign=TutorialCampaign;
if(typeof module!=='undefined'&&module.exports)module.exports={TutorialCampaign};
})(typeof window!=='undefined'?window:globalThis);
