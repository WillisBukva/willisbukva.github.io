// Listet Wörter eines Pakets/Themas, das noch keine ctx-Beispielsätze hat.
// Aufruf: node tools/list_words.js vocab_top2
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const key = process.argv[2];
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {}; const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';if(typeof registerVocabThemes==="function"){try{registerVocabThemes();}catch(e){}}globalThis.X=C;', sb);
const a = (sb.X[key] || []);
console.log(key + ' (' + a.length + '), ohne ctx: ' + a.filter(x => !x.ctx || !x.ctx.length).length);
console.log(a.map(x => x.m + ' = ' + x.t).join('\n'));
