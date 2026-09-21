/* No server, analytics or automatic submission. Answers remain in this browser. */
(function(){
  'use strict';
  const en=I18N.lang==='en', lang=en?'en':'zh', form=document.getElementById('survey');
  const key='iron-europe-survey-draft-v1';
  const label=(zh,english)=>en?english:zh;
  document.getElementById('heading').textContent=label('钢铁欧陆 1939 · 试玩反馈问卷','Iron Europe 1939 · Playtest Feedback');
  document.getElementById('intro').textContent=label('约需3分钟，所有问题均可跳过，无需填写姓名。草稿仅保存在当前浏览器；网页不会自动上传答案。完成后下载答案，交给邀请你试玩的人。','About 3 minutes. All questions are optional; no name is requested. Drafts stay in this browser and responses are never uploaded automatically. Download your answers and send them to the person who invited you.');
  document.getElementById('back').textContent=label('返回介绍页','Back to Introduction');
  document.getElementById('download').textContent=label('下载答案','Download Answers');
  document.getElementById('print').textContent=label('打印／保存为PDF','Print / Save as PDF');
  let draft={};try{draft=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
  PlaytestQuestions.forEach((q,i)=>{
    const field=document.createElement('fieldset'),legend=document.createElement('legend');
    legend.textContent=(i+1)+'. '+q[lang];field.append(legend);
    if(!q.options.length){
      const input=document.createElement('textarea');input.name=q.id;input.maxLength=5000;input.setAttribute('aria-label',q[lang]);input.value=typeof draft[q.id]==='string'?draft[q.id]:'';field.append(input);
    }else q.options.forEach((option,j)=>{
      const l=document.createElement('label'),input=document.createElement('input');input.type=q.multi?'checkbox':'radio';input.name=q.id;input.value=String(j);input.checked=Array.isArray(draft[q.id])&&draft[q.id].includes(String(j));l.append(input,document.createTextNode(option[lang]));field.append(l);
    });form.append(field);
  });
  function answers(){const data=new FormData(form),out={};PlaytestQuestions.forEach(q=>out[q.id]=q.options.length?data.getAll(q.id):String(data.get(q.id)||''));return out;}
  function save(){try{localStorage.setItem(key,JSON.stringify(answers()));}catch(e){document.getElementById('status').textContent=label('浏览器无法保存草稿，请在离开前下载答案。','Your browser could not save the draft. Download your answers before leaving.');return false;}return true;}
  form.addEventListener('input',save);
  I18N.beforeSwitch=save;
  document.getElementById('download').onclick=()=>{
    const data=answers();const text=['Iron Europe 1939 — Playtest Feedback','',...PlaytestQuestions.flatMap((q,i)=>[(i+1)+'. '+q[lang],q.options.length?data[q.id].map(j=>q.options[+j][lang]).join('; ')||label('未填写','Not answered'):data[q.id]||label('未填写','Not answered'),''])].join('\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='iron-europe-playtest-'+lang+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    document.getElementById('status').textContent=label('答案已准备下载。请自行交给试玩组织者；网页未发送任何反馈。','Your answers are ready to download. Please send the file to the playtest organiser; this page has not submitted anything.');
  };
  document.getElementById('print').onclick=()=>window.print();
})();
