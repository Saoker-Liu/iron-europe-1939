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
c3.URL = URL; c3.window.location = { href:'file:///game/index.html?play=1', assign: url => { assert.equal(new URL(url).searchParams.get('lang'),'zh'); reloaded = true; } };
I18N3.setLang('zh');
assert.deepEqual(saved, ['iron-europe-lang', 'zh']);
assert(reloaded, '切换语言必须整页刷新');
/* ---- i18n-en-geo.js：assemble 后的就地数据翻译（EN 模式） ---- */
const geoCtx = { localStorage: { getItem: () => 'en', setItem: () => {} } };
geoCtx.window = geoCtx;
geoCtx.document = makeDoc('en');
geoCtx.TERRAIN = { '.': { name: '平原' } };
geoCtx.COUNTRIES = { de: { name: '德国', note: '1939年德国附庸国' } };
geoCtx.FACTION_NAME = { axis: '轴心国' };
geoCtx.CITIES = [{ k: 'london', n: '伦敦', region: '英格兰南部', note: '大西洋运输港口与西部航道司令部所在地' }];
geoCtx.RIVERS = [{ name: '莱茵河' }];
geoCtx.MAP_META = { labels: [{ name: '北海' }], canals: [{ name: '基尔运河', historicName: '威廉皇帝运河' }] };
geoCtx.COUNTRIES.al = { name: '阿尔巴尼亚公国', short: '阿尔巴尼亚' };
geoCtx.CITIES[0].mapLabel = '伦讷·博恩霍尔姆';
vm.createContext(geoCtx);
for (const f of ['js/ui/i18n.js', 'js/ui/i18n-en-geo.js'])
  vm.runInContext(fs.readFileSync(f, 'utf8'), geoCtx, { filename: f });
vm.runInContext('I18N.translateData()', geoCtx);
assert.equal(geoCtx.TERRAIN['.'].name, 'Plains');
assert.equal(geoCtx.TERRAIN['.']['_zhname'], '平原');
assert.equal(geoCtx.COUNTRIES.de.name, 'Germany');
assert.equal(geoCtx.FACTION_NAME.axis, 'Axis');
assert.equal(geoCtx.CITIES[0].n, 'London');
assert.equal(geoCtx.CITIES[0]._zhn, '伦敦');
assert.equal(geoCtx.CITIES[0].region, 'southern England');
assert.equal(geoCtx.CITIES[0].note, 'Atlantic convoy port and home of Western Approaches Command');
assert.equal(geoCtx.RIVERS[0].name, 'Rhine');
assert.equal(geoCtx.MAP_META.labels[0].name, 'North Sea');
assert.equal(geoCtx.MAP_META.canals[0].name, 'Kiel Canal');
assert.equal(geoCtx.MAP_META.canals[0].historicName, 'Kaiser Wilhelm Canal');
assert.equal(geoCtx.COUNTRIES.al.short, 'Albania');
assert.equal(geoCtx.CITIES[0].mapLabel, 'Rønne · Bornholm');
/* ---- i18n-en-mil.js：军事域就地翻译（含舰名分国映射与编号规则） ---- */
const milCtx = { localStorage: { getItem: () => 'en', setItem: () => {} } };
milCtx.window = milCtx;
milCtx.document = makeDoc('en');
milCtx.CLASSES = { inf: { name: '步兵', glyph: '步' }, bb: { name: '战列舰' } };
milCtx.EQUIP = { de: { infantry: [{ n: '1939型普通步兵师', nt: '' }], bb: [{ n: '俾斯麦级', nt: '俾斯麦、提尔皮茨' }] } };
milCtx.AIR = { roles: { fighter: { name: '轻型战斗机', role: '更远航程、更强火力与防护的制空机型' } } };
milCtx.NAVAL = {
  names: {
    'de:bb:1': [{ n: '俾斯麦号' }, { n: '提尔皮茨号' }],
    'de:sub:0': [{ n: 'U-29号' }],
    'su:sub:0': [{ n: 'Щ-301号' }],
    'fr:sub:0': [{ n: '可畏号' }],
    'uk:cv:1': [{ n: '光辉号' }, { n: '胜利号' }, { n: '可畏号' }],
  },
  passages: [{ name: '直布罗陀海峡' }],
  models: { de: { sub: [['VII型', 1939, '通用游戏型号，无对应史实舰级']] },
    neutral: { bb: [['基础型', 1939, '通用游戏型号，无对应史实舰级']] } },
};
milCtx.GENERALS = [{ name: '古德里安', title: '装甲兵之父', bio: '二战时期任装甲集群及装甲集团军指挥官。' }];
milCtx.EVENTS = [{ t: 8, title: '西线闪击战', text: '1940年5月10日，德军发起"黄色方案"，装甲集群穿越阿登森林，法兰西战役爆发。' }];
milCtx.ECONOMY = { construction: { factory: { name: '工厂' } }, transports: [{ name: '运输船' }] };
vm.createContext(milCtx);
for (const f of ['js/ui/i18n.js', 'js/ui/i18n-en-mil.js'])
  vm.runInContext(fs.readFileSync(f, 'utf8'), milCtx, { filename: f });
vm.runInContext('I18N.translateData()', milCtx);
assert.equal(milCtx.CLASSES.inf.name, 'Infantry');
assert.equal(milCtx.CLASSES.inf.glyph, 'I'); // English class badges must also be readable
assert.equal(milCtx.EQUIP.de.infantry[0].n, '1939 Infantry Division');
assert.equal(milCtx.EQUIP.de.bb[0].nt, 'Bismarck, Tirpitz');
assert.equal(milCtx.AIR.roles.fighter.name, 'Light Fighter');
assert.equal(milCtx.NAVAL.names['de:bb:1'][0].n, '俾斯麦号', 'ship names remain canonical for cross-language saves');
assert.equal(milCtx.NAVAL.names['de:bb:1'][0].en, 'Bismarck');
assert.equal(milCtx.NAVAL.names['de:sub:0'][0].en, 'U-29');       // 舷号规则去“号”
assert.equal(milCtx.NAVAL.names['su:sub:0'][0].en, 'Shch-301');   // 西里尔舷号转写
assert.equal(milCtx.NAVAL.names['fr:sub:0'][0].en, 'Redoutable'); // 同名舰分国映射
assert.equal(milCtx.NAVAL.names['uk:cv:1'][2].en, 'Formidable');
assert.equal(milCtx.NAVAL.passages[0].name, 'Strait of Gibraltar');
assert.equal(milCtx.NAVAL.models.de.sub[0][0], 'Type VII');
assert.equal(milCtx.NAVAL.models.de.sub[0][2], 'Generic game type, no historical class');
assert.equal(milCtx.NAVAL.models.neutral.bb[0][0], 'Basic'); // 年份槽（[1]）是数字，不翻译
assert.equal(milCtx.GENERALS[0].name, 'Heinz Guderian');
assert.equal(milCtx.GENERALS[0].title, 'Father of the Panzer Troops');
assert.equal(milCtx.GENERALS[0].bio, 'Served in WWII as panzer group and panzer army commander.');
assert.equal(milCtx.GENERALS[0]._zhname, '古德里安'); // 双语检索原始值
assert.equal(milCtx.EVENTS[0].title, 'Blitzkrieg in the West');
assert.equal(milCtx.ECONOMY.construction.factory.name, 'Factory'); // 局部映射，不受 UI 片段 ' Factory' 影响
assert.equal(milCtx.ECONOMY.transports[0].name, 'Transport Ship');

console.log('i18n: dict lookup, passthrough, slot reorder, tr() keeps _zh, onData, static DOM, lang persistence passed');
