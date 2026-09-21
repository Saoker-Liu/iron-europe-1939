'use strict';
/* i18n：字典查找、槽位重排、数据就地翻译（保留 _zh）、静态 DOM 替换、语言持久化 */
const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const SRC = fs.readFileSync('js/ui/i18n.js', 'utf8');
const els = [];
function fakeEl(attrs) {
  return { attrs, textContent: '', innerHTML: '', title: '', aria: null, handler: null,
    getAttribute(k) { return attrs[k] ?? null; },
    setAttribute(k, v) { this.aria = [k, v]; },
    set onclick(fn) { this.handler = fn; } };
}
const langBtn = fakeEl({ id: 'btn-lang' });
function makeDoc(mode) {
  return {
    readyState: 'complete', title: '钢铁欧陆 1939 · 二战六边形战棋',
    querySelectorAll(sel) {
      if (sel === '[data-i18n]') return els;
      return [];                    // html/title/aria 集合为空即可
    },
    getElementById(id) { return id === 'btn-lang' ? langBtn : null; },
    addEventListener() {},
  };
}
function boot(store) {
  const ctx = { localStorage: { getItem: () => store, setItem: () => {} } };
  ctx.window = ctx; ctx.document = makeDoc(store);
  vm.createContext(ctx);
  vm.runInContext(SRC, ctx);
  return ctx;
}

/* ---- 持久化语言 + 未命中透传（渐进翻译，绝不白屏） ---- */
const c1 = boot('en');
const I18N = vm.runInContext('I18N', c1);
assert.equal(I18N.lang, 'en');
assert.equal(I18N.t('步兵'), '步兵');
I18N.add({ '步兵': 'Infantry', '伦敦': 'London', '{0}占领{1}': '{1} was occupied by {0}',
  '钢铁欧陆 1939 · 二战六边形战棋': 'Iron Europe 1939 · WW2 Hex Wargame' });
assert.equal(I18N.t('步兵'), 'Infantry');
assert.equal(I18N.t('未收录词条'), '未收录词条');
assert.equal(I18N.f('{0}占领{1}', '德军', '伦敦'), '伦敦 was occupied by 德军', '槽位可重排');
assert.equal(I18N.f('第{0}回合', 3), '第3回合', '未翻译模板照常填槽');

/* ---- tr：就地翻译并保留原中文供搜索回退；重复调用不覆盖 _zh ---- */
const city = { n: '伦敦' };
I18N.tr(city, 'n');
assert.equal(city.n, 'London');
assert.equal(city._zhn, '伦敦');
city._zhn = 'KEEP';
I18N.tr(city, 'n');
assert.equal(city._zhn, 'KEEP', '已有的 _zh 不得覆盖');
const missing = { n: '没收录' };
I18N.tr(missing, 'n');
assert.equal(missing.n, '没收录', '字典外的值保持原样');

/* ---- onData + translateData：只对注册域生效 ---- */
let ran = 0;
I18N.onData(() => { ran++; });
I18N.translateData();
assert.equal(ran, 1);

/* ---- applyStatic：EN 改写 data-i18n 与标题，ZH 不动；refresh 幂等 ---- */
const chrome = fakeEl({ 'data-i18n': '步兵' });
els.push(chrome);
const c2 = boot('zh');
vm.runInContext('I18N', c2);
assert.equal(chrome.textContent, '', 'zh 模式不改写静态 DOM');
assert.equal(langBtn.textContent, 'EN', '按钮显示可切换到的语言');
const c3 = boot('en');
const I18N3 = vm.runInContext('I18N', c3);
I18N3.add({ '步兵': 'Infantry', '钢铁欧陆 1939 · 二战六边形战棋': 'Iron Europe 1939 · WW2 Hex Wargame' });
I18N3.refresh();
assert.equal(chrome.textContent, 'Infantry');
assert.equal(c3.document.title, 'Iron Europe 1939 · WW2 Hex Wargame');
assert.equal(langBtn.textContent, '中文');
assert.equal(typeof langBtn.handler, 'function', '语言按钮已绑定切换');

/* ---- setLang：写回 localStorage 并刷新 ---- */
let saved = null, reloaded = false;
c3.localStorage.setItem = (k, v) => { saved = [k, v]; };
c3.window.location = { reload: () => { reloaded = true; } };
I18N3.setLang('zh');
assert.deepEqual(saved, ['iron-europe-lang', 'zh']);
assert(reloaded, '切换语言必须整页刷新');
console.log('i18n: dict lookup, passthrough, slot reorder, tr() keeps _zh, onData, static DOM, lang persistence passed');
