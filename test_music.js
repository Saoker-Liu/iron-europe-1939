'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const listeners={},docListeners={};let player,denied=true;
class Audio {
  constructor(){player=this;this.paused=true;this.ended=false;this.calls=0;}
  set src(value){this.url=value;this.ended=false;}
  pause(){this.paused=true;}
  play(){this.calls++;if(denied)return Promise.reject(Error('Autoplay blocked'));this.paused=false;return Promise.resolve();}
}
const ctx={Audio,document:{hidden:false,addEventListener:(k,fn)=>docListeners[k]=fn},addEventListener:(k,fn)=>listeners[k]=fn};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/ui/music.js','utf8'),ctx);
const flush=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
  ctx.Music.play('lobby');await flush();assert(player.paused);
  denied=false;listeners.pointerdown();await flush();assert(!player.paused);assert.equal(player.volume,.22);
  const calls=player.calls;ctx.Music.play('lobby');assert.equal(player.calls,calls);
  ctx.Music.setEnabled(false);ctx.Music.play('battle');assert(player.paused);assert.equal(player.url,'music/battle.mp3');
  ctx.Music.setEnabled(true);await flush();assert(!player.paused);assert(player.loop);
  ctx.document.hidden=true;docListeners.visibilitychange();assert(player.paused);
  ctx.document.hidden=false;docListeners.visibilitychange();await flush();assert(!player.paused);
  ctx.Music.play('victory',false);await flush();assert(!player.loop);
  player.ended=true;player.paused=true;const endedCalls=player.calls;listeners.keydown();assert.equal(player.calls,endedCalls);
  ctx.Music.play('defeat',false);await flush();assert.equal(player.url,'music/defeat.mp3');assert(!player.loop);
  for(const slot of ['menu','lobby','battle','victory','defeat']){
    const data=fs.readFileSync('music/'+slot+'.mp3');assert(data.length>100000);assert(data.subarray(0,3).toString()==='ID3'||data[0]===255);
  }
  console.log('Music: autoplay retry, one player, mute across scenes, background pause, non-looping endings and packaged assets passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
