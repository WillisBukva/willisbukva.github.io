// Audit: Duplikate (innerhalb & quer), ctx-Satz-Duplikate, Sortierung
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const noop = () => {}; const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sb = { window: { addEventListener: noop }, document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } }, navigator: { onLine: true }, localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, speechSynthesis: undefined, alert: noop, confirm: () => false, console, setTimeout: noop, setInterval: noop, Audio: function () { return { play: noop }; } };
vm.createContext(sb);
vm.runInContext(m[1] + ';if(typeof registerVocabThemes==="function"){try{registerVocabThemes();}catch(e){}}globalThis.X=C;', sb);
const C = sb.X;

// 1. Duplikate innerhalb jeder Sektion
console.log('=== Duplikate INNERHALB einer Sektion (kritisch) ===');
let anyInner = false;
for (const k in C) {
  const seen = {}, dup = [];
  (C[k] || []).forEach(x => { if (!x.m) return; if (seen[x.m]) dup.push(x.m); seen[x.m] = 1; });
  if (dup.length) { console.log('  ' + k + ': ' + dup.join(', ')); anyInner = true; }
}
if (!anyInner) console.log('  keine');

// 2. Überschneidung der VOKABEL-Sektionen (würde im Üben doppelt auftauchen, wenn man mehrere macht)
const vocabSecs = Object.keys(C).filter(k => k === 'vocabulary' || k.indexOf('vocab_') === 0);
console.log('\n=== Wort-Überschneidungen zwischen Vokabel-Sektionen ===');
const where = {};
vocabSecs.forEach(k => (C[k] || []).forEach(x => { if (!x.m) return; (where[x.m] = where[x.m] || []).push(k); }));
const over = Object.entries(where).filter(([w, ks]) => ks.length > 1);
console.log('  ' + over.length + ' Wörter in mehreren Sektionen' + (over.length ? ':' : ''));
over.slice(0, 25).forEach(([w, ks]) => console.log('   "' + w + '" in ' + ks.join(', ')));

// 3. Doppelte ctx-Sätze (gleicher ru-Satz an mehreren Stellen)
console.log('\n=== Doppelte Beispielsätze (ctx ru) ===');
const ctxSeen = {}, ctxDup = {};
for (const k in C) (C[k] || []).forEach(x => (x.ctx || []).forEach(s => {
  if (!s.ru) return; const key = s.ru.trim();
  if (ctxSeen[key]) ctxDup[key] = (ctxDup[key] || 1) + 1; ctxSeen[key] = 1;
}));
const ctxDupKeys = Object.keys(ctxDup);
console.log('  ' + ctxDupKeys.length + ' mehrfach verwendete Sätze' + (ctxDupKeys.length ? ':' : ''));
ctxDupKeys.slice(0, 15).forEach(k => console.log('   "' + k + '" ×' + (ctxDup[k])));

// 4. sentences-Pfad: doppelte Sätze
console.log('\n=== sentences-Pfad: doppelte m ===');
const sSeen = {}, sDup = [];
(C.sentences || []).forEach(x => { if (sSeen[x.m]) sDup.push(x.m); sSeen[x.m] = 1; });
console.log('  ' + (sDup.length ? sDup.join(', ') : 'keine'));
