const fs = require('fs'); const path = require('path'); const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {}; const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';globalThis.X=C;', sb);
['listening', 'speaking', 'sentences'].forEach(function (k) {
  const a = sb.X[k] || [];
  console.log('\n===== ' + k + ' (' + a.length + ') =====');
  a.slice(0, 12).forEach(function (x, i) { console.log(i + ' | m="' + x.m + '" t="' + x.t + '" s="' + (x.s || '') + '" e="' + (x.e || '') + '" d=' + (x.d || '-') + ' o=' + (x.o ? x.o.length : 0) + ' r=' + (x.r ? x.r.length : 0)); });
  // Längen-Statistik (Wort vs. Satz)
  const withSpace = a.filter(x => x.m && x.m.indexOf(' ') > 0).length;
  console.log('... davon mit Leerzeichen (Sätze):', withSpace, '/ ' + a.length);
});
