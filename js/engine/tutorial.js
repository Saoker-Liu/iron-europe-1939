/* Small fictional training ground. Uses the normal movement/combat/recruitment rules. */
'use strict';
const TutorialBase = typeof module !== 'undefined' && module.exports ? require('./game').Game : Game;
class TutorialGame extends TutorialBase {
  constructor() {
    super('axis','normal',{initialGround:false,initialFleet:false,initialAir:false,initialGenerals:false});
    this.tutorial=true; this.lesson=0; this.width=8; this.height=5;
    this.units=[]; this.nextId=1; this.log=[]; this.pendingEvents=[]; this.over=null;
    this.gold={axis:180,west:0,sov:0}; this.harbors=[]; this.airfields=[]; this.construction=[];
    this.genUnit=Object.fromEntries(Object.keys(this.genUnit).map(k=>[k,null]));
    this.blockedEdges=new Set(); this.riverEdges=new Set(); this.terr={};
    for(let r=0;r<this.height;r++)for(let c=0;c<this.width;c++)this.terr[c+','+r]='.';
    this.terr['1,0']='f';this.terr['2,0']='f';this.terr['6,1']='h';this.terr['6,4']='m';
    this.cities=[{k:'training-base',n:'训练营',ct:'de',x:1,y:2,cap:false,owner:'axis',inc:25},
      {k:'training-town',n:'演习镇',ct:'pl',x:4,y:2,cap:false,owner:'west',inc:15}];
    this.cityByKey=Object.fromEntries(this.cities.map(c=>[c.k,c]));
    for(const c of this.cities)this.terr[c.x+','+c.y]='c';
    this.trainee=this.spawnUnit('de','de:infantry:0',1,2,{silent:true});
    this.target=this.spawnUnit('pl','neutral:militia:0',3,2,{silent:true});this.target.hp=10;
    this.pushLog('新手演习：虚构的8×5格训练场。对手不主动行动；不写入战役存档。','info');
  }
  tile(c,r){return this.tutorial?(this.inMap(c,r)?this.terr[c+','+r]:null):super.tile(c,r);}
  inMap(c,r){return this.tutorial?c>=0&&c<this.width&&r>=0&&r<this.height:super.inMap(c,r);}
  homeCountryOf(c,r){return this.tutorial?(this.inMap(c,r)?(c<3?'de':'pl'):null):super.homeCountryOf(c,r);}
  territoryOwner(c,r){return this.tutorial?(this.inMap(c,r)?this.cities[c<3?0:1].owner:null):super.territoryOwner(c,r);}
  checkVictory(){if(!this.tutorial)return super.checkVictory();this.over=null;return null;}
  expectedMove(){return this.lesson===2?[1,1]:this.lesson===4?[2,2]:this.lesson===7?[4,2]:null;}
  moveRange(u){
    const range=super.moveRange(u);if(!this.tutorial)return range;
    const goal=this.expectedMove(),k=goal?.join(',');
    range.cost=new Map(u===this.trainee&&k&&range.cost.has(k)?[[k,range.cost.get(k)]]:[]);
    return range;
  }
  moveUnit(u,c,r){
    const goal=this.expectedMove();if(!goal||u!==this.trainee||c!==goal[0]||r!==goal[1])return false;
    const ok=super.moveUnit(u,c,r);if(ok)this.lesson++;return ok;
  }
  undoMove(u){const ok=super.undoMove(u);if(ok&&this.lesson===3)this.lesson=4;return ok;}
  canUndoMove(u){return this.lesson===3&&super.canUndoMove(u);}
  canStrikeFrom(u,c,r,target){
    if(this.tutorial&&(![4,5].includes(this.lesson)||u!==this.trainee||target.id!==this.target.id))return false;
    return super.canStrikeFrom(u,c,r,target);
  }
  attack(u,target){
    if(this.lesson!==5||u!==this.trainee||target!==this.target)return null;
    const result=super.attack(u,target);if(result?.killed)this.lesson=6;return result;
  }
  recruit(cityKey,eqKey,faction=this.playerFaction){
    if(this.lesson!==8||cityKey!=='training-base')return null;
    const u=super.recruit(cityKey,eqKey,faction);if(u){this.recruitId=u.id;this.lesson=9;}return u;
  }
  startConstruction(){return false;}
  endTurn(){
    if(![6,9].includes(this.lesson))return {actions:[],victory:null};
    this.turn++;this.startTurnFor(this.playerFaction);this.lesson++;
    this.pushLog(`新回合：行动力恢复，城市收入 +${this.factionIncome(this.playerFaction)} 金。`,'econ');
    return {actions:[],victory:null};
  }
  serialize(){throw new Error('教程不写入正式战役存档');}
}
if(typeof module!=='undefined'&&module.exports)module.exports={TutorialGame};
