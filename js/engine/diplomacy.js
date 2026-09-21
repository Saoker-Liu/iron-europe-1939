/* National territory and limited wars, independent of the three playable coalitions. */
(function(root){
'use strict';
const T = s => typeof I18N !== 'undefined' ? I18N.t(s) : s;
const F = (s,...a) => typeof I18N !== 'undefined' ? I18N.f(s,...a) : s.replace(/\{(\d+)\}/g,(_,i)=>a[+i]??_);
function install(Game){Object.assign(Game.prototype,{
  politicalState(){return {landTransfers:this.landTransfers,annexed:this.annexed,events:this.diplomacyEvents,winterWar:this.winterWar,
    cities:this.cities.map(c=>({ct:c.ct,controlCt:c.controlCt||c.ct,cap:!!c.cap}))};},
  restorePoliticalState(p){
    this.landTransfers={...p.landTransfers};this.annexed={...p.annexed};this.diplomacyEvents={...p.events};this.winterWar=p.winterWar;
    p.cities.forEach((c,i)=>{if(!COUNTRIES[c.ct]||!COUNTRIES[c.controlCt])throw Error(T('无效的领土国家'));Object.assign(this.cities[i],c);});this.rebuildDependencies();
  },
  initTerritory(){
    this.landTransfers={};this.annexed={};this.diplomacyEvents={};this.winterWar=null;this.politicalRevision=0;
    for(const ci of this.cities){ci.originalCt=ci.ct;ci.originalCap=!!ci.cap;ci.controlCt=ci.ct;}
    this.rebuildDependencies();
  },
  legalCountry(c,r){return this.landTransfers?.[c+','+r]||HOME_COUNTRIES[r]?.[c]||null;},
  rebuildDependencies(){
    const groups={};for(let i=0;i<this.cities.length;i++)(groups[this.cities[i].ct]||=[]).push(i);
    this.dependencies=new Array(MAP_W*MAP_H);this.provinces=new Int16Array(MAP_W*MAP_H).fill(-1);
    for(let r=0;r<MAP_H;r++)for(let c=0;c<MAP_W;c++){
      const list=groups[this.legalCountry(c,r)]||[];let best=Infinity,near=[];
      for(const i of list){const ci=this.cities[i],d=HexMath.hexDist(c,r,ci.x,ci.y);if(d<best){best=d;near=[i];}else if(d===best)near.push(i);}
      this.dependencies[r*MAP_W+c]=near;if(near.length)this.provinces[r*MAP_W+c]=near[0];
    }
    this.politicalRevision=(this.politicalRevision||0)+1;this.terrDirty=true;
  },
  controllingCountry(city){
    if(city.controlCt&&this.cf[city.controlCt]===city.owner)return city.controlCt;
    if(this.cf[city.ct]===city.owner)return city.ct;
    return this.countryForFaction(city.owner)||city.ct;
  },
  countryForFaction(f){return {axis:'de',west:'uk',sov:'su'}[f]||(f?.startsWith('local:')?f.slice(6):null);},
  territoryCountry(c,r){
    if(!this.inMap(c,r))return null;
    if(this.tutorial)return this.homeCountryOf(c,r);
    const ct=this.legalCountry(c,r),list=this.dependencies?.[r*MAP_W+c]||[];
    if(!list.length)return ct;
    const holders=list.map(i=>this.controllingCountry(this.cities[i]));
    return holders.every(x=>x===holders[0])?holders[0]:ct;
  },
  canEnterNationalTerritory(u,c,r){
    if(this.tutorial||this.isSeagoing(u))return true;
    const f=this.unitFaction(u),owner=this.territoryOwner(c,r);
    if(f?.startsWith('local:'))return owner===f||this.atWar(f,owner);
    if(f==='sov'&&this.turn<turnOf(1941,6))return !owner||owner==='sov'||owner==='neutral'||this.atWar(f,owner);
    return true;
  },
  neutralEntryCountry(u,c,r){
    if(this.isAir(u)||!this.landPassable(c,r))return null;
    const ct=this.homeCountryOf(c,r);
    return ct&&!COUNTRIES[ct].context&&!COUNTRIES[ct].controller&&this.cf[ct]==='neutral'&&this.unitFaction(u)!=='neutral'?ct:null;
  },
  neutralMoveCountries(u,path){return [...new Set((path||[]).map(p=>this.neutralEntryCountry(u,...p)).filter(Boolean))];},
  neutralityConsequence(ct,f){
    if(f==='sov'&&this.turn<turnOf(1941,6)&&!this.atWar('axis','sov'))return F("{0}将与苏联爆发局部战争，其他国家不参战。", COUNTRIES[ct].name);
    const foes=['axis','west','sov'].filter(x=>x!==f&&this.atWar(f,x));
    const target=(foes.length?foes:['axis','west','sov'].filter(x=>x!==f)).sort((a,b)=>this.factionIncome(b)-this.factionIncome(a))[0];
    return F("{0}将加入{1}并与你交战。{2}", COUNTRIES[ct].name, this.factionName(target), this.atWar(f,target)?'':T('这也会使你与该阵营开战。'));
  },
  activeFactions(){return ['axis','west','sov',...new Set(Object.values(this.cf).filter(f=>f?.startsWith('local:')))];},
  registerLocalFactions(){for(const ct of Object.keys(COUNTRIES)){
    const f='local:'+ct;FACTION_NAME[f]=COUNTRIES[ct].name+T('（局部战争）');FACTION_COLOR[f]=COUNTRIES[ct].color;
  }},
  beginLocalWar(ct){
    if(this.annexed[ct]||this.annexed.su||ct==='su')return false;
    const f='local:'+ct;this.registerLocalFactions();this.cf[ct]=f;this.gold[f]??=150;
    this.stats.kills[f]??=0;
    for(const ci of this.cities)if(ci.ct===ct&&this.controllingCountry(ci)===ct){ci.owner=f;ci.controlCt=ct;}
    this.wars.add(['sov',f].sort().join('|'));this.politicalRevision++;this.terrDirty=true;
    if(ct==='fi'&&!this.winterWar)this.winterWar={status:'active'};
    this.pushLog(F("苏联与{0}爆发局部战争，其他国家不参战。", COUNTRIES[ct].name),'war');return true;
  },
  relocateNationalUnits(ct,units){
    // A cession evacuates the donor's units to nearest remaining national controlled land/base/coast.
    const excluded=new Set(units.map(u=>u.id));
    const occupied=new Set(this.units.filter(u=>!excluded.has(u.id)&&!this.isAir(u)&&!u.carrierId).map(u=>u.c+','+u.r));
    const land=[];for(let r=0;r<MAP_H;r++)for(let c=0;c<MAP_W;c++)if(this.landPassable(c,r)&&this.legalCountry(c,r)===ct&&this.territoryCountry(c,r)===ct)land.push([c,r]);
    for(const u of units){
      if(!this.units.includes(u)||u.carrierId)continue;
      let candidates;
      if(this.isAir(u))candidates=this.airfields.filter(ci=>ci.ct===ct&&this.controllingCountry(ci)===ct).map(ci=>[ci.x,ci.y,ci.k]);
      else if(this.isNaval(u)){
        const seen=new Set();candidates=[];for(const p of land)for(const q of this.neighbors(...p))if(this.ocean(...q)&&!seen.has(q.join(','))){seen.add(q.join(','));candidates.push(q);}
      }else candidates=land;
      candidates=candidates.filter(p=>this.isAir(u)||!occupied.has(p[0]+','+p[1])).sort((a,b)=>HexMath.hexDist(u.c,u.r,...a)-HexMath.hexDist(u.c,u.r,...b)||a[1]-b[1]||a[0]-b[0]);
      const p=candidates[0];
      if(!p){
        // Exceptional loss of all homeland/base destinations: keep the unit in reserve rather than delete it.
        u.evacuated=true;u.c=-1;u.r=-1;u.moved=true;u.attacked=true;
        const cargo=this.cargoOf(u);if(cargo){cargo.c=-1;cargo.r=-1;}continue;
      }
      u.c=p[0];u.r=p[1];u.dug=false;u.moved=true;u.attacked=true;delete u.evacuated;
      if(this.isAir(u))u.airbase=p[2];else if(!this.isNaval(u))u.embarked=false;
      if(!this.isAir(u))occupied.add(p[0]+','+p[1]);
      const cargo=this.cargoOf(u);if(cargo){cargo.c=u.c;cargo.r=u.r;}
    }
  },
  cedeTerritory(from,to,cityKeys){
    const selected=new Set(cityKeys.filter(k=>this.cityByKey[k]?.ct===from));if(!selected.size||this.annexed[to])return false;
    const cells=new Set();for(let r=0;r<MAP_H;r++)for(let c=0;c<MAP_W;c++){
      if(this.legalCountry(c,r)!==from)continue;
      const deps=this.dependencies[r*MAP_W+c]||[];
      if(deps.length&&deps.every(i=>selected.has(this.cities[i].k)))cells.add(c+','+r);
    }
    const evacuate=this.units.filter(u=>u.ct===from&&(cells.has(u.c+','+u.r)||this.isNaval(u)&&this.harbors.some(h=>h.c===u.c&&h.r===u.r&&selected.has(h.cityKey))));
    for(const k of cells)this.landTransfers[k]=to;
    for(const k of selected){const ci=this.cityByKey[k];ci.ct=to;ci.controlCt=to;ci.owner=this.cf[to];ci.cap=false;}
    this.rebuildDependencies();this.relocateNationalUnits(from,evacuate);this.lastMove=null;
    this.pushLog(F("{0}向{1}割让{2}及附属领土，原国家部队撤回本国。", COUNTRIES[from].name, COUNTRIES[to].name, [...selected].map(k=>this.cityByKey[k].n).join('、')),'event');return true;
  },
  annexCountry(from,to){
    if(from===to||this.annexed[from]||this.annexed[to])return false;
    const nations=new Set([from,...Object.keys(COUNTRIES).filter(ct=>COUNTRIES[ct].controller===from&&!this.annexed[ct])]);
    const holdings=this.cities.filter(ci=>nations.has(ci.ct)||nations.has(this.controllingCountry(ci)));
    const cells=[];for(let r=0;r<MAP_H;r++)for(let c=0;c<MAP_W;c++)if(nations.has(this.legalCountry(c,r))||nations.has(this.territoryCountry(c,r)))cells.push(c+','+r);
    for(const k of cells)this.landTransfers[k]=to;
    // Other nations' armies survive even when stationed inside the transferred territory.
    for(const u of [...this.units])if(nations.has(u.ct))this.killUnit(u);
    for(const ci of holdings){ci.ct=to;ci.controlCt=to;ci.owner=this.cf[to];ci.cap=false;}
    for(const ct of nations){
      this.annexed[ct]=to;
      for(const war of [...this.wars])if(war.split('|').includes('local:'+ct))this.wars.delete(war);
    }
    if(nations.has('fi')&&this.winterWar?.status==='active')this.winterWar={status:'peace',outcome:'finland-annexed'};
    this.lastMove=null;this.rebuildDependencies();
    this.pushLog(F("{0}吞并{1}，其全部领土移交，原国家军事单位解散。", COUNTRIES[to].name, COUNTRIES[from].name),'war');return true;
  },
  finishWinterWar(sovietVictory){
    if(this.winterWar?.status!=='active')return;
    // Return temporary occupations first; the treaty then transfers only Finnish Karelia.
    for(const ci of this.cities)if((ci.ct==='fi'&&this.controllingCountry(ci)==='su')||(ci.ct==='su'&&this.controllingCountry(ci)==='fi')){ci.controlCt=ci.ct;ci.owner=this.cf[ci.ct];}
    this.wars.delete(['local:fi','sov'].sort().join('|'));
    this.cf.fi='neutral';for(const ci of this.cities)if(ci.ct==='fi'){ci.owner='neutral';ci.controlCt='fi';}
    this.winterWar={status:'peace',outcome:sovietVictory?'karelia-ceded':'leningrad-armistice'};
    if(sovietVictory)this.cedeTerritory('fi','su',['viipuri']);
    for(const ct of ['su','fi'])this.relocateNationalUnits(ct,this.units.filter(u=>u.ct===ct&&this.legalCountry(u.c,u.r)!==ct&&!this.isNaval(u)));
    this.politicalRevision++;this.terrDirty=true;this.lastMove=null;
    const title=sovietVictory?T('冬季战争停战：割让卡累利阿'):T('冬季战争停战：列宁格勒失守');
    const text=sovietVictory?T('芬兰保留独立，向苏联割让维堡及其卡累利阿附属地区；双方部队撤回本国。'):T('芬兰夺取列宁格勒，迫使苏联停战。双方归还临时占领区，部队撤回本国。');
    this.pendingEvents.push({title,text});this.pushLog(title+'。'+text,'event');
  },
  partitionPoland(){
    if(this.diplomacyEvents.poland||this.annexed.pl!=='de'||this.turn>=turnOf(1941,6)||this.atWar('axis','sov')||this.annexed.su)return;
    this.diplomacyEvents.poland=true;
    this.cedeTerritory('de','su',['lwow','wilno','brestlitovsk','grodno','bialystok','luck','rowno','pinsk','tarnopol']);
    const ev={title:T('莫洛托夫·里宾特洛甫条约：瓜分波兰'),text:T('德国迫使波兰投降后，按约定将波兰东部地区割让给苏联，德军撤出割让区。边界按现有城市附属领土概化。')};
    this.pendingEvents.push(ev);this.pushLog(ev.title,'event');
  },
  diplomaticEvent(ev){
    if(this.diplomacyEvents[ev.kind])return;
    this.diplomacyEvents[ev.kind]=true;if(this.annexed.su)return;
    let happened=false;
    if(ev.kind==='winterwar'&&!this.annexed.fi&&!this.winterWar&&this.cf.fi==='neutral')happened=this.beginLocalWar('fi');
    if(ev.kind==='baltic')for(const ct of ['ee','lv','lt'])if(!this.annexed[ct]&&(this.cf[ct]==='neutral'||this.cf[ct]==='local:'+ct)){happened=this.annexCountry(ct,'su')||happened;this.wars.delete(['sov','local:'+ct].sort().join('|'));}
    if(ev.kind==='bessarabia'&&!this.annexed.ro&&!this.atWar('axis','sov'))happened=this.cedeTerritory('ro','su',['chisinau']);
    if(happened){this.pendingEvents.push(ev);this.pushLog(`【${ev.title}】${ev.text}`,'event');}
  }
});}
if(typeof module!=='undefined'&&module.exports)module.exports=install;else install(root.Game);
})(typeof window!=='undefined'?window:globalThis);
