'use strict';
const fs=require('node:fs'),path=require('node:path');
const D=require('./js/data/load-node');
const {Game}=require('./js/engine/game');
const opening=new Game('axis');
const cls={inf:'步兵',art:'炮兵',tank:'装甲',air:'空军'};
function skill(s){
  const scope=s.cls?cls[s.cls]:'所指挥部队';const pct=Math.round((s.m??0)*100);
  return ({atk:()=>`${scope}攻击+${pct}%`,def:()=>`${scope}防御+${pct}%`,mov:()=>`${scope}${s.cls==='air'?'作战半径／转场距离':'移动力'}+${s.n}`,
    rng:()=>`陆上射程+${s.n}`,counter:()=>`普通反击系数+${pct}个百分点`,citydef:()=>`驻城防御+${pct}%`,vs:()=>`对${cls[s.tgt]}有效攻击+${pct}%`,
    aura:()=>`邻格友军攻击+${pct}%（取最强）`,rage:()=>`兵力低于50%时攻击+${Math.round((s.m??.15)*100)}%`,nozoc:()=>`忽略敌方控制区`})[s.k]();
}
function recommend(g){
  const hints={student:'伞兵',dietl:'山地步兵',ringel:'山地步兵',meretskov:'山地步兵／游骑兵',ridgway:'伞兵',gavin:'伞兵',juin:'山地步兵',anders:'山地步兵',sosabowski:'伞兵',siilasvuo:'游骑兵',avramescu:'山地步兵',keyaerts:'游骑兵／骑兵',kocha:'非正规步兵',bor:'非正规步兵／卫戍部队',dowding:'轻／重型战斗机',park:'轻／重型战斗机',harris:'战略轰炸机',spaatz:'战略轰炸机',golovanov:'战略轰炸机',richthofen:'CAS／战术轰炸机',coningham:'CAS／战术轰炸机',montgomery:'步兵／防空炮'};
  return hints[g.id]||[...new Set(g.skills.filter(s=>s.cls).map(s=>cls[s.cls]))].join('／')||'陆军通用';
}
const countries=[...new Set(D.GENERALS.map(g=>g.ct))];
let out=`# 史实将领与技能审阅名录\n\n当前共 **${D.GENERALS.length} 位**，覆盖 **${countries.length} 国**；原有23位，新增93位。数据源为 \\js/data/generals.js\\，本文件由实际游戏数据生成，避免文档与技能数值分离。\n\n## 设计与生效规则\n\n- 人物均取自真实二战时期军政／军事指挥体系；选人参照二战策略游戏常见将领池，自行设计数值，不宣称与《钢铁雄心4》某一版本的名单或特质一一对应。\n- “史实职务”描述人物履历；“设计理由”和所有技能数字都是游戏化方案，不是史实能力评分。相近作战经历可以共享技能组合，不为凑数虚构独特能力。\n- 保留原23位的技能；新增将领通常2项，少数3项。多数攻防加成为10%～25%，光环5%～10%、最多取一个最强值，移动通常+1。\n- 同一指挥官只能指派给一支部队；兵种限定技能仅对对应兵种生效，其它部队不获得该项加成。推荐兵种只是搭配建议，不额外限制指派。\n- 山地／伞兵／游骑兵等特性来自单位本身，将领技能不凭空授予山地适应或伞降能力。对空加成也不会把普通步兵变成区域防空炮。\n- 普通反击技能增加反击系数的百分点，不是最终反击伤害乘以1+百分比；防空拦截使用单独结算。攻击属性的百分比同样不等于最终伤害同比增加。\n- 当前系统为陆空军将领；海军将领指派仍未开放。国家按游戏内服役／阵营归属编码处理，例如帕克、科宁厄姆在英国皇家空军栏内。\n- 沿用现有机制：名单覆盖整个二战，而非严格1939年在任表；不新增解锁年份、死亡或退休事件。国家加入玩家阵营后，其将领进入可指派池。中立国将领并非开局全部可用。\n- 新战役将92位将领部署到现有本国陆空军，保留24位待指派（含美国12位）；不额外生成部队、不增加经济费用。保留原有任命，新增部署优先匹配技能兵种和专长。旧存档不补发任命，原指派、空闲状态和击杀星级保留。\n\n## 国家分布\n\n| 国家 | 人数 |\n|---|---:|\n`;
for(const ct of countries)out+=`| ${D.COUNTRIES[ct].name} | ${D.GENERALS.filter(g=>g.ct===ct).length} |\n`;
out+='\n## 新战役开局任命\n\n仅新战役生效。中立国将领随本国部队部署，不改变国家阵营；美国开局没有可用陆空军，12位将领全部待命。以下地点为初始所在城市或最近城市。\n\n| 国家 | 将领 | 开局部队 | 位置／待命原因 |\n|---|---|---|---|\n';
for(const general of D.GENERALS){
  const unit=opening.units.find(u=>u.gen===general.id);
  const city=unit?opening.cities.filter(c=>c.ct===unit.ct).sort((a,b)=>globalThis.HexMath.hexDist(unit.c,unit.r,a.x,a.y)-globalThis.HexMath.hexDist(unit.c,unit.r,b.x,b.y))[0]:null;
  out+=`| ${D.COUNTRIES[general.ct].name} | ${general.name} | ${unit?unit.eq.n:'待指派'} | ${unit?`${city?.n||city?.k||'本国部署区'}附近（${unit.c}, ${unit.r}）`:general.initialReserve?'预备将领':'开局无适配的本国陆空军'} |\n`;
}
out+='\n## 逐人审阅\n\n每位的“人物资料”是便于继续核对的外文资料入口；本轮对代表人物及少数容易混淆的身份进行了联网核对，并非116人的档案级传记考证。职务只列代表性任职，不表示该职务贯穿整个战争。\n';
for(const ct of countries){
  out+=`\n### ${D.COUNTRIES[ct].name}\n\n| 姓名／ID | 代表性史实职务 | 建议兵种 | 游戏技能 | 设计理由 | 资料入口 |\n|---|---|---|---|---|---|\n`;
  for(const g of D.GENERALS.filter(g=>g.ct===ct))out+=`| ${g.name}<br>${g.en}<br>\`${g.id}\` | ${g.career} | ${recommend(g)} | ${g.skills.map(skill).join('；')} | ${g.design} | [人物资料](${encodeURI(g.reference).replaceAll('(','%28').replaceAll(')','%29')}) |\n`;
}
out+=`\n## 核对资料与审阅重点\n\n以下是本轮查阅的代表性资料。逐人行内链接用于进一步核对身份与经历；技能数字由本游戏设计，不出自这些史料。\n\n- [美国陆军军史中心：布莱德雷](https://history.army.mil/Research/Reference-Topics/5-Star/Gen-Omar-N-Bradley/)：集团军群指挥经历。\n- [英国国家陆军博物馆：奥金莱克](https://www.nam.ac.uk/explore/claude-auchinleck)：中东战区指挥背景。\n- [法国解放勋章博物馆：德·拉特尔](https://www.ordredelaliberation.fr/fr/compagnons/jean-lattre-de-tassigny-de)：法国第1集团军及解放战役。\n- [法国解放勋章博物馆：比尔哈凯姆的柯尼希与拉尔米纳](https://www.ordredelaliberation.fr/fr/collection/630f4d5718d4961067e5d09c)：自由法国防御作战。\n- [曼纳海姆档案主题站：总部](https://mannerheim.fi/10_ylip/e_pmaja.htm)：海因里希斯与艾罗的参谋角色。\n- [罗马尼亚二战将领目录](https://www.worldwar2.ro/generali/)：杜米特雷斯库、阿夫拉梅斯库等人物入口。\n- [荷兰军史研究所：动员](https://www.nimh.nl/militaire-geschiedenis-van-nederland/webthemas/de-meidagen-van-1940/de-strijd-op-nederlands-grondgebied/mobilisatie)：赖因德斯的战前防御筹划。\n- [比利时十八日战役资料：凯亚尔茨部队](https://18daagseveldtocht.be/grote-eenheden/legerkorpsen/groepering-keyaerts/)：猎兵与骑兵部队背景。\n\n建议优先审阅：是否需要按年份解锁将领；空军将领数量是否足够；通用参谋光环是否过多；非主要国家是否应继续扩编；是否为山地／空降／游击专长新增专用技能。目前先使用已生效的技能体系，避免显示了技能却没有实际效果。\n\n## 文档维护\n\n修改将领数据后运行 \\node build_general_catalog.js\\；以 \\node build_general_catalog.js --check\\ 检查本名录与游戏数据一致。\n`;
out=out.replace(/\\([^\\\n]+)\\/g,'`$1`');
const target=path.join(__dirname,'GENERAL_CATALOG.md');
if(process.argv.includes('--check')){
  if(fs.readFileSync(target,'utf8').replaceAll('\r\n','\n')!==out){console.error('General catalog is stale');process.exit(1);}
}else fs.writeFileSync(target,out);
console.log(`General catalog: ${D.GENERALS.length} commanders across ${countries.length} countries`);
