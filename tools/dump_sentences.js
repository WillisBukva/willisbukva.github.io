const fs = require('fs'); const path = require('path'); const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {}; const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';globalThis.X=C.sentences;', sb);
console.log('sentences:', sb.X.length);
sb.X.forEach((x, i) => console.log(i + ' | ' + x.m + ' = ' + x.t + '  [' + (x.s || '') + ']  Wörter:' + x.m.split(' ').length));
