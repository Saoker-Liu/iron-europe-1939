/* landing 页 data-i18n 键与词典一致性：HTML 改文案而忘改词典时立刻报错。 */
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('landing/index.html', 'utf8');
const attrs = [...html.matchAll(/data-i18n(?:-html|-aria|-title)?="([^"]+)"/g)].map(m => m[1].replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));

let dict = {};
const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} } };
ctx.window = ctx;
ctx.I18N = { add: m => { dict = Object.assign(dict, m); }, onData() {} };
vm.createContext(ctx);
for(const name of ['i18n-en','i18n-en-geo','i18n-en-mil','i18n-en-landing','i18n-en-updates']) vm.runInContext(fs.readFileSync('js/ui/'+name+'.js', 'utf8'),ctx);

for (const k of attrs) assert.ok(dict[k] !== undefined, 'dict 缺键: ' + k);
for (const [k, v] of Object.entries(dict)) {
  assert.ok(typeof v === 'string' && v.length > 0, 'EN 值为空: ' + k);
  assert.ok(!/[一-龥]/.test(v), 'EN 值残留中文: ' + k + ' -> ' + v);
}
assert.ok(dict['钢铁欧陆 1939 · IRON EUROPE 1939-1945 — 六边形回合制二战战棋'], 'document.title 键缺失');
console.log('i18n-landing: ' + attrs.length + ' data-i18n occurrences, ' + Object.keys(dict).length + ' dict entries, all matched');
