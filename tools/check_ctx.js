// Prüft: kein ctx-Satz ist leer; zählt Gesamt.
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {}; const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';if(typeof registerVocabThemes==="function"){try{registerVocabThemes();}catch(e){}}globalThis.X=C;', sb);
let bad = [], total = 0;
for (const k in sb.X) (sb.X[k] || []).forEach(it => (it.ctx || []).forEach(s => {
  total++;
  if (!s.ru || !s.de || !String(s.ru).trim() || !String(s.de).trim()) bad.push(k + ':' + it.m);
}));
console.log('ctx geprüft:', total, '| leer/fehlerhaft:', bad.length);
if (bad.length) console.log(bad.slice(0, 20).join(', '));
