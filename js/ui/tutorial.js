/* Guided practice runs in the normal map UI; no campaign save writes. */
'use strict';
const LESSONS=[
 ['认识地图','按住地图空白处拖动；滚轮缩放。右侧查看单位，顶栏查看经济与回合。试一试后点击“开始练习”。'],
 ['选择部队','点击训练营上的己方步兵棋子（黄色圈）。右侧显示攻击、防御、兵力和移动力。'],
 ['移动到前沿','点击黄色圈中的蓝色格，将步兵移动一格。蓝色表示可移动范围；本步骤只开放目标格。'],
 ['攻击演习对手','点击黄色圈中的敌方民兵。敌军仅剩10兵力，足以一击击败。移动后仍可攻击，但攻击后不能再移动。'],
 ['结束回合','点击顶栏“结束回合”，或按 E / 回车。下一回合恢复行动力、获得城市收入；演习对手不会主动行动。'],
 ['占领城镇','再次选中步兵，点击黄色圈中的演习镇。陆军进入无人驻守的敌城即可占领，城市将为你提供收入。'],
 ['招募援军','点击左侧空闲的训练营，选择“徒步步兵”栏，再点击普通步兵进行招募。必须有足够经济，且城市格没有陆军占用。'],
 ['等待新兵就绪','新招募的部队本回合不能移动或攻击。再次点击“结束回合”，查看它们恢复行动力和经济增长。'],
 ['演习完成','你已掌握选中、移动、攻击、占城、招募和回合结算。主战役还包含工厂、机场、军港与将领，可随时打开玩法说明。']
];
function tutorialMode(on){
  document.body?.classList.toggle('tutorial-mode',on);
  document.getElementById('tutorial-coach').style.display=on?'block':'none';
  if(!on)document.getElementById('btn-end').disabled=false;
}
function startTutorial(){
  if(UI.busy)return;
  closeModal();startGame('axis','normal',new TutorialGame());
  tutorialMode(true);document.getElementById('tutorial-coach').dataset.step='';
  UI.political=false;UI.cityRecruitCategory='徒步步兵';
  terrainCache.key='';fitTutorial();updateTutorial();
}
function exitTutorial(){
  if(UI.busy)return;
  tutorialMode(false);UI.game=null;deselect();UI.anims=[];terrainCache.key='';
  closeModal();showStart();
}
function fitTutorial(){
  const w=Math.max(260,innerWidth-340),h=Math.max(140,innerHeight-310);
  UI.cam.z=Math.min(1.3,w/(36*SQ3*9),h/(36*1.5*6));
  UI.cam.x=(w-7.5*SQ3*S())/2;UI.cam.y=80+(h-6*S())/2;
}
function updateTutorial(){
  const g=UI.game;if(!g?.tutorial)return;
  const box=document.getElementById('tutorial-coach'),step=g.lesson;
  if(box.dataset?.step!==String(step)){
    box.dataset.step=String(step);
    box.innerHTML=`<div class="tutorial-heading">新手演习 · ${Math.min(step+1,8)} / 8 <span>8×5 局部地图</span></div>
      <h3>${LESSONS[step][0]}</h3><p>${LESSONS[step][1]}</p>
      <div class="row-btns">${step===0?'<button class="btn gold" id="tutorial-begin">开始练习</button>':''}
      ${step===8?'<button class="btn gold" id="tutorial-campaign">选择阵营 · 开始战役</button>':''}
      <button class="btn" id="tutorial-locate">定位目标</button><button class="btn" id="tutorial-retry">重新练习</button><button class="btn" id="tutorial-exit">退出教程</button></div>`;
    const begin=document.getElementById('tutorial-begin');if(begin)begin.onclick=()=>{g.lesson=1;updateTutorial();};
    const campaign=document.getElementById('tutorial-campaign');if(campaign)campaign.onclick=exitTutorial;
    document.getElementById('tutorial-locate').onclick=fitTutorial;
    document.getElementById('tutorial-retry').onclick=()=>{if(!UI.busy){box.dataset.step='';startTutorial();}};
    document.getElementById('tutorial-exit').onclick=exitTutorial;
  }
  document.getElementById('btn-end').disabled=UI.busy||![4,7].includes(step);
  for(const id of ['tutorial-retry','tutorial-exit','tutorial-campaign']){const b=document.getElementById(id);if(b)b.disabled=UI.busy;}
}
function drawTutorial(){
  const g=UI.game;updateTutorial();
  const target=({1:[1,2],2:[2,2],3:[3,2],5:[4,2],6:[1,2]})[g.lesson];
  if(!target)return;
  const [x,y]=hexToPix(...target);cx.save();cx.strokeStyle='#ffdf70';cx.lineWidth=4;
  hexPath(x,y,S()*.94);cx.stroke();cx.restore();
}
