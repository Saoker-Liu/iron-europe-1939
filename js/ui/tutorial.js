/* Guided practice runs in the normal map UI; no campaign save writes. */
'use strict';
/* 双语层：i18n.js 仅在浏览器加载；测试沙箱保持中文原样 */
var T = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t : (s => s);
var F = (typeof I18N !== 'undefined' && I18N.f) ? I18N.f : ((tpl, ...a) => tpl.replace(/\{(\d+)\}/g, (m, i) => a[+i] === undefined ? m : String(a[+i])));
const LESSONS=[
 [T('认识地图'),T('按住地图空白处拖动；滚轮缩放。右侧查看单位，顶栏查看经济与回合。试一试后点击“开始练习”。')],
 [T('选择部队'),T('点击训练营上的己方步兵棋子（黄色圈）。右侧显示攻击、防御、兵力和移动力。')],
 [T('移动与自动待命'),T('点击训练营右上方的黄色目标格。移动后没有有效攻击目标，部队自动待命，不必再点击待命。')],
 [T('撤销移动'),T('点击右侧部队面板的“撤销移动”，返回训练营并恢复行动力。占领、开战、投降或触发事件的移动不能撤销；攻击后、其它部队有效移动或攻击后也不能撤销；此时只选择其它部队不会影响撤销。')],
 [T('重新选择路线'),T('再次点击黄色目标格，向敌方民兵移动。此次移动后有攻击目标，因此仍可攻击。')],
 [T('攻击演习对手'),T('点击黄色圈中的敌方民兵。敌军仅剩10兵力，足以一击击败。移动后仍可攻击，但攻击后不能再移动。')],
 [T('结束回合'),T('点击顶栏“结束回合”，或按 E / 回车。下一回合恢复行动力、获得城市收入；演习对手不会主动行动。')],
 [T('占领城镇'),T('再次选中步兵，点击黄色圈中的演习镇。陆军进入无人驻守的敌城即可占领，城市将为你提供收入。')],
 [T('招募援军'),T('点击左侧空闲的训练营，选择“徒步步兵”栏，再点击普通步兵进行招募。必须有足够经济，且城市格没有陆军占用。')],
 [T('等待新兵就绪'),T('新招募的部队本回合不能移动或攻击。再次点击“结束回合”，查看它们恢复行动力和经济增长。')],
 [T('演习完成'),T('你已掌握选中、移动、攻击、占城、招募和回合结算。主战役还包含工厂、机场、军港与将领，可随时打开玩法说明。')]
];
function tutorialMode(on){
  document.body?.classList.toggle('tutorial-mode',on);
  document.body?.classList.remove('tutorial-course');
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
  if(UI.game?.courseId){const w=Math.max(240,innerWidth-350),h=Math.max(180,innerHeight-390);UI.cam.z=Math.min(1.3,w/(36*SQ3*11),h/(36*1.5*8));UI.cam.x=60;UI.cam.y=100;return;}
  const w=Math.max(260,innerWidth-340),h=Math.max(140,innerHeight-310);
  UI.cam.z=Math.min(1.3,w/(36*SQ3*9),h/(36*1.5*6));
  UI.cam.x=(w-7.5*SQ3*S())/2;UI.cam.y=80+(h-6*S())/2;
}
function updateTutorial(){
  const g=UI.game;if(!g?.tutorial)return;
  if(g.courseId){updateCourseCoach();return;}
  const box=document.getElementById('tutorial-coach'),step=g.lesson;
  if(box.dataset?.step!==String(step)){
    box.dataset.step=String(step);
    box.innerHTML=`<div class="tutorial-heading">${F("新手演习 · {0} / 10", Math.min(step+1,10))} <span>${T("8×5 局部地图")}</span></div>
      <h3>${LESSONS[step][0]}</h3><p>${LESSONS[step][1]}</p>
      <div class="row-btns">${step===0?T('<button class="btn gold" id="tutorial-begin">开始练习</button>'):''}
      ${step===10?T('<button class="btn gold" id="tutorial-campaign">选择阵营 · 开始战役</button>'):''}
      <button class="btn" id="tutorial-locate">${T("定位目标")}</button><button class="btn" id="tutorial-retry">${T("重新练习")}</button><button class="btn" id="tutorial-exit">${T("退出教程")}</button></div>`;
    const begin=document.getElementById('tutorial-begin');if(begin)begin.onclick=()=>{g.lesson=1;updateTutorial();};
    const campaign=document.getElementById('tutorial-campaign');if(campaign){campaign.textContent=courseText('完成基础 · 选择下一课程','Basic Complete · Choose Another Course');campaign.onclick=showTutorialMenu;}
    document.getElementById('tutorial-locate').onclick=fitTutorial;
    document.getElementById('tutorial-retry').onclick=()=>{if(!UI.busy){box.dataset.step='';startTutorial();}};
    document.getElementById('tutorial-exit').onclick=exitTutorial;
  }
  document.getElementById('btn-end').disabled=UI.busy||![6,9].includes(step);
  for(const id of ['tutorial-retry','tutorial-exit','tutorial-campaign']){const b=document.getElementById(id);if(b)b.disabled=UI.busy;}
}
function drawTutorial(){
  const g=UI.game;updateTutorial();
  if(g.courseId){cx.save();cx.strokeStyle='#ffdf70';cx.lineWidth=3;for(const p of g.highlights){const [x,y]=hexToPix(...p);hexPath(x,y,S()*.94);cx.stroke();}cx.restore();return;}
  const target=({1:[1,2],2:[1,1],4:[2,2],5:[3,2],7:[4,2],8:[1,2]})[g.lesson];
  if(!target)return;
  const [x,y]=hexToPix(...target);cx.save();cx.strokeStyle='#ffdf70';cx.lineWidth=4;
  hexPath(x,y,S()*.94);cx.stroke();cx.restore();
}
function courseText(zh,en){return typeof I18N!=='undefined'&&I18N.lang==='en'?en:zh;}
function showTutorialMenu(){
  if(UI.busy)return;
  openModal(`<div class="modal"><h1>${courseText('欢迎来到指挥学院','Welcome to Command School')}</h1><p>${courseText('初次游玩？建议先完成基础操作，再选择各系统的独立演习。每节使用全新的局部地图，可以反复练习，不会覆盖战役存档。','New here? Start with Basic Operations, then explore each system in a separate exercise. Every checkpoint starts on a fresh small map. Practise freely without overwriting your campaign save.')}</p>
  <div class="tutorial-catalog"><button class="btn gold" id="course-basic">${courseText('基础操作','Basic Operations')}<small>${courseText('选择、移动、撤销、攻击、占城与招募','Selection, movement, undo, combat, capture and recruitment')}</small></button>${Object.entries(TutorialCourses).map(([id,c])=>`<button class="btn" data-course="${id}">${lessonText(c.title)}<small>${c.steps.map(s=>lessonText(s.title)).join(' · ')}</small></button>`).join('')}</div>
  <div class="actions"><button class="btn" id="course-skip">${courseText('已了解规则 · 跳过教程，开始战役','Already know the rules? Skip tutorials and start a campaign')}</button></div></div>`);
  document.getElementById('course-basic').onclick=startTutorial;
  document.querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>startCourse(b.dataset.course));
  document.getElementById('course-skip').onclick=()=>{tutorialMode(false);UI.game=null;closeModal();showStart();};
}
function startCourse(id,step=0){
  if(UI.busy)return;
  closeModal();startGame(id==='politics'&&step===5?'sov':'axis','normal',new TutorialCampaign(id,step));
  tutorialMode(true);document.body.classList.add('tutorial-course');
  document.getElementById('tutorial-coach').dataset.step='';
  UI.political=id==='politics';UI.cityRecruitCategory='民兵';UI.factoryCategory='炮兵';UI.airMission=null;
  terrainCache.key='';fitTutorial();updateCourseCoach();
}
function updateCourseCoach(){
  const g=UI.game,course=TutorialCourses[g.courseId],s=g.checkpoint(),box=document.getElementById('tutorial-coach');
  const stamp=g.courseId+':'+g.lesson;
  if(box.dataset.step!==stamp){
    box.dataset.step=stamp;
    box.innerHTML=`<div class="tutorial-heading">${lessonText(course.title)} · ${g.lesson+1}/${course.steps.length}</div><h3>${lessonText(s.title)}</h3><p>${lessonText(s.body)}</p><p><strong>${courseText('目标：','Goal: ')}${lessonText(s.goal)}</strong></p><p id="course-result"></p><div class="row-btns">${s.id==='cession'?`<button class="btn gold" id="course-treaty">${courseText('执行演示割让条约','Execute Training Cession Treaty')}</button>`:''}<button class="btn gold" id="course-next"></button><button class="btn" id="course-retry">${courseText('重练本节','Restart Checkpoint')}</button><button class="btn" id="course-menu">${courseText('课程目录','Course Menu')}</button><button class="btn" id="course-locate">${courseText('查看全图','Fit Map')}</button></div>`;
    document.getElementById('course-next').onclick=()=>{if(!UI.busy&&g.objectiveMet()){if(g.lesson+1<course.steps.length)startCourse(g.courseId,g.lesson+1);else showTutorialMenu();}};
    document.getElementById('course-retry').onclick=()=>startCourse(g.courseId,g.lesson);
    document.getElementById('course-menu').onclick=showTutorialMenu;
    document.getElementById('course-locate').onclick=fitTutorial;
    const treaty=document.getElementById('course-treaty');if(treaty)treaty.onclick=()=>{if(!UI.busy&&g.lessonTreaty()){terrainCache.key='';updateTopbar();renderLog();updatePanel();}};
  }
  const met=g.objectiveMet(),next=document.getElementById('course-next');next.disabled=UI.busy||!met;
  next.textContent=g.lesson+1<course.steps.length?courseText('下一节 · 全新布置','Next Checkpoint · Fresh Setup'):courseText('完成课程','Complete Course');
  const last=g.history.filter(x=>x.kind==='attack'||x.kind==='move').at(-1);
  document.getElementById('course-result').textContent=(met?courseText('✓ 目标已完成。','✓ Objective complete.'):courseText('按照目标操作后可进入下一节。','Complete the objective to continue.'))+(last?.kind==='attack'?courseText(` 本次造成${last.damage}伤害，受到${last.loss}反击伤害。`,` Dealt ${last.damage} damage; received ${last.loss} counterattack damage.`):last?.kind==='move'?courseText(` 本次移动路径消耗：${last.cost}。`,` Movement path cost: ${last.cost}.`):'');
  document.getElementById('btn-end').disabled=UI.busy;
  for(const id of ['course-menu','course-retry','course-treaty']){const b=document.getElementById(id);if(b)b.disabled=UI.busy;}
}
