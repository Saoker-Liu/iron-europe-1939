/* One local audio player shared by all game scenes; no network service required. */
(function(root){
  'use strict';
  const slots=new Set(['menu','lobby','battle','victory','defeat']);
  const audio=typeof root.Audio==='function'?new root.Audio():null;
  let current=null,enabled=true,pending=false,generation=0;
  if(audio){audio.volume=.22;audio.preload='none';}
  function resume(){
    if(!audio||!enabled||!current||pending||!audio.paused||audio.ended||root.document?.hidden)return;
    pending=true;const attempt=generation;
    try{Promise.resolve(audio.play()).catch(()=>{}).finally(()=>{if(attempt===generation)pending=false;});}
    catch(e){pending=false;}
  }
  root.Music={
    play(slot,loop=true){
      if(!slots.has(slot))return;
      if(current!==slot){
        current=slot;generation++;pending=false;
        if(audio){audio.pause();audio.src='music/'+slot+'.mp3';audio.loop=loop;}
      }
      resume();
    },
    setEnabled(on){enabled=!!on;if(!enabled&&audio){generation++;pending=false;audio.pause();}else resume();},
    get current(){return current;},
    get enabled(){return enabled;}
  };
  root.addEventListener?.('pointerdown',resume);
  root.addEventListener?.('keydown',resume);
  root.document?.addEventListener?.('visibilitychange',()=>{
    if(root.document.hidden){generation++;pending=false;audio?.pause();}else resume();
  });
})(typeof window!=='undefined'?window:globalThis);
