/* =========================================================================
 * i18n：极简中英双语层。中文是唯一数据源，英文只发生在显示层。
 *   T(s)          字典查找；未命中或中文模式原样返回（渐进翻译，永不白屏）。
 *   F(tpl, ...)   {0}{1} 槽位填充，槽位可重排（英汉语序不同）。
 *   setLang(l)    写 localStorage 后整页刷新——零依赖游戏里最稳的切换方式。
 *   onData(fn)    注册数据翻译器；EN 模式下 loader 在 assemble 后统一执行，
 *                 把国家/城市/装备等名称就地换成英文，原中文存 _zh 供搜索回退。
 * 静态 HTML 用 data-i18n / data-i18n-html / data-i18n-title / data-i18n-aria
 * 标记，脚本加载后一次性替换。
 * ========================================================================= */
(function () {
  'use strict';
  const STORE = 'iron-europe-lang';
  let lang = 'zh';
  try { lang = localStorage.getItem(STORE) === 'en' ? 'en' : 'zh'; } catch (e) { /* 隐私模式等 */ }
  try { const requested = new URL(window.location.href).searchParams.get('lang'); if (['zh','en'].includes(requested)) { lang=requested; localStorage.setItem(STORE,lang); } } catch(e) {}
  const dict = Object.create(null);
  const mutators = [];
  const messages = new Map();
  const reverse = new Map();
  let legacyPatterns = null;
  function remember(text, message) {
    if (messages.size > 2000) messages.delete(messages.keys().next().value);
    messages.set(text, message);
    return text;
  }

  function add(map) { Object.assign(dict, map); for(const [key,value] of Object.entries(map)) reverse.set(value,key); legacyPatterns = null; }
  function T(s) {
    if (lang !== 'en') return s;
    const v = dict[s];
    return v === undefined ? s : v;
  }
  function F(tpl, ...args) {
    const text = T(tpl).replace(/\{(\d+)\}/g, (m, i) => args[+i] === undefined ? m : String(args[+i]));
    const canonical = value => messages.get(value) || reverse.get(value) || value;
    return remember(text, {key:tpl,args:args.map(canonical)});
  }
  function messageText(message) {
    if (!message || typeof message !== 'object' || typeof message.key !== 'string') return T(message);
    return T(message.key).replace(/\{(\d+)\}/g,(m,i)=>{
      const a=message.args?.[+i];return a === undefined ? m : typeof a==='object' ? messageText(a) : T(a);
    });
  }
  // Old saves contain rendered Chinese dispatches. Match known templates without
  // modifying the saved message or any gameplay state.
  function legacyText(text, depth=0) {
    if (lang !== 'en' || typeof text !== 'string' || !/[\u3400-\u9fff]/.test(text)) return text;
    if (dict[text] !== undefined) return dict[text];
    if (depth > 6) return text;
    if (!legacyPatterns) legacyPatterns=Object.entries(dict).filter(([k])=>/\{\d+\}/.test(k)).map(([key,value])=>{
      const slots=[];const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const pattern=escaped.replace(/\\\{(\d+)\\\}/g,(_,i)=>{slots.push(+i);return '([\\s\\S]*?)';});
      return {re:new RegExp('^'+pattern+'$'),value,slots,weight:key.replace(/\{\d+\}/g,'').length};
    }).sort((a,b)=>b.weight-a.weight);
    for(const p of legacyPatterns){const m=text.match(p.re);if(m){const a=[];p.slots.forEach((s,i)=>a[s]=legacyText(m[i+1],depth+1));return p.value.replace(/\{(\d+)\}/g,(_,i)=>a[+i]??_);}}
    for(const [key,value] of Object.entries(dict).filter(([k])=>/[\u3400-\u9fff]/.test(k)&&!/[{}<>]/.test(k)).sort((a,b)=>b[0].length-a[0].length))text=text.split(key).join(value);
    return text;
  }
  function setLang(l) {
    if (api.beforeSwitch && api.beforeSwitch() === false) return;
    try { localStorage.setItem(STORE, l); } catch (e) { /* 忽略 */ }
    const url = new URL(window.location.href); url.searchParams.set('lang',l); window.location.assign(url.href);
  }
  function toggle() { setLang(lang === 'en' ? 'zh' : 'en'); }
  function onData(fn) { mutators.push(fn); }
  function translateData() {
    if (lang !== 'en') return;
    for (const fn of mutators) fn();
  }
  /* 就地翻译 obj[prop]；原值只存一次（_zh），供搜索同时匹配中英 */
  function tr(obj, prop) {
    const v = obj[prop];
    if (typeof v !== 'string' || !v || dict[v] === undefined || dict[v] === v) return;
    if (obj['_zh' + prop] === undefined) obj['_zh' + prop] = v;
    obj[prop] = dict[v];
  }
  function applyStatic() {
    const btn = document.getElementById('btn-lang');
    if (btn) {
      btn.textContent = lang === 'en' ? '中文' : 'EN';
      btn.onclick = toggle;                      // 覆盖式绑定：refresh() 幂等
    }
    if (document.documentElement) { document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'; document.documentElement.classList.toggle('lang-en',lang === 'en'); }
    document.querySelectorAll('a[href]').forEach(el => { try { const url=new URL(el.getAttribute('href'),window.location.href); if ((url.protocol==='file:' || url.origin===window.location.origin) && /\.html$/.test(url.pathname)) { url.searchParams.set('lang',lang); el.href=url.href; } } catch(e) {} });
    if (lang === 'en') document.querySelectorAll('a[href]').forEach(el => { const raw=el.getAttribute('href'); if (/\b(README|DIPLOMACY)\.md$/.test(raw)) el.setAttribute('href',raw.replace(/\.md$/,'.en.md')); });
    if (lang !== 'en') return;                   // 中文模式下 DOM 本就是原文
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = T(el.getAttribute('data-i18n-html')); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = T(el.getAttribute('data-i18n-title')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', T(el.getAttribute('data-i18n-aria'))); });
    for (const attr of ['alt','placeholder','aria-label']) document.querySelectorAll('[data-i18n-'+attr+']').forEach(el => el.setAttribute(attr,T(el.getAttribute('data-i18n-'+attr))));
    if (dict[document.title] !== undefined) document.title = T(document.title);
  }

  const api = {
    get lang() { return lang; },
    t: T, f: F, add, onData, tr, translateData, setLang, toggle, refresh: applyStatic,
    describe: text => messages.get(text) || {key:reverse.get(text)||text,args:[]},
    messageText, legacyText,
    _setLangForTests(l) { lang = l; },     // 测试专用：不触发刷新
  };
  window.I18N = api;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyStatic);
  else applyStatic();
})();
