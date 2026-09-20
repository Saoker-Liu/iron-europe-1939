/* Main European scenario: representative fleets, not a literal 1939 order of battle.
 * Spawn outside port berths; no ships or names are injected when loading a save. */
(function(){
 'use strict';
 const root=typeof window!=='undefined'?window:globalThis,N=root.GameData.modules.naval;
 const fleets=[];
 const add=(ct,base,types)=>{for(const [cls,count]of Object.entries(types))for(let i=0;i<count;i++)fleets.push({ct,base,eq:`${ct in N.equipment?ct:'neutral'}:${cls}:0`});};
 add('uk','scapaflow',{bb:2,bc:1,cl:1,ca:1,dd:1,sub:1});
 add('uk','plymouth',{bb:1,bc:1,cl:1,ca:1,dd:1,cv:1});
 add('uk','portsmouth',{bb:1,cl:1,ca:1,dd:1,sub:1});
 add('uk','valletta',{bb:1,dd:1});
 // North Atlantic reserve: no American land territory or fictitious shipyard.
 add('us',[7,50],{bb:3,cv:2,ca:2,cl:2,dd:3,sub:2});
 add('us',[10,60],{dd:2});
 add('fr','brest',{bb:1,bc:2,cv:1,dd:1,sub:1});
 add('fr','toulon',{bb:2,ca:2,cl:1,dd:1});
 add('it','taranto',{bb:2,ca:1,dd:1,sub:1});
 add('it','genoa',{ca:1,cl:1,dd:1,sub:1});
 add('it','venice',{cl:1});
 add('de','wilhelmshaven',{bc:2,dd:1,sub:2});
 add('de','kiel',{bb:1,ca:1,cl:1,sub:1});
 add('su','leningrad',{bb:1,ca:1,dd:1,sub:1});
 add('su','sevast',{bb:1,cl:1,sub:1});
 for(const [ct,base,types]of [
  ['es','cartagena',{cl:1,dd:1}],['nl','rotterdam',{dd:1,sub:1}],
  ['se','stockholm',{cl:1,dd:1}],['no','bergen',{dd:1}],['dk','copenhagen',{dd:1}],
  ['fi','helsinki',{sub:1}],['pl','gdynia',{dd:1,sub:1}],['pt','lisbon',{dd:1}],
  ['tr','istanbul',{bc:1,dd:1}],['gr','athens',{dd:1}],['ro','constanta',{dd:1}],['yu','split',{dd:1}],
 ])add(ct,base,types);
 N.initialFleets=fleets;
})();
