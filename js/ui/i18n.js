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
  const dict = Object.create(null);
  const mutators = [];

  function add(map) { Object.assign(dict, map); }
  function T(s) {
    if (lang !== 'en') return s;
    const v = dict[s];
    return v === undefined ? s : v;
  }
  function F(tpl, ...args) {
    return T(tpl).replace(/\{(\d+)\}/g, (m, i) => args[+i] === undefined ? m : String(args[+i]));
  }
  function setLang(l) {
    try { localStorage.setItem(STORE, l); } catch (e) { /* 忽略 */ }
    window.location.reload();
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
    if (lang !== 'en') return;                   // 中文模式下 DOM 本就是原文
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = T(el.getAttribute('data-i18n-html')); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = T(el.getAttribute('data-i18n-title')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', T(el.getAttribute('data-i18n-aria'))); });
    if (dict[document.title] !== undefined) document.title = T(document.title);
  }

  const api = {
    get lang() { return lang; },
    t: T, f: F, add, onData, tr, translateData, setLang, toggle, refresh: applyStatic,
    _setLangForTests(l) { lang = l; },     // 测试专用：不触发刷新
  };
  window.I18N = api;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyStatic);
  else applyStatic();
})();
