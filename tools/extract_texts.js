// Extrahiert alle gesprochenen russischen Texte aus index.html → tools/texts.json
// Aufruf: node tools/extract_texts.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('Kein Script-Block gefunden!'); process.exit(1); }

// Minimale Browser-Stubs, damit der App-Code im Sandbox-Kontext lädt
const noop = () => {};
const fakeEl = new Proxy({}, { get: (t, p) => (p === 'style' ? {} : noop), set: () => true });
const sandbox = {
  window: { addEventListener: noop },
  document: { addEventListener: noop, getElementById: () => fakeEl, querySelectorAll: () => [], querySelector: () => fakeEl, createElement: () => fakeEl, body: { appendChild: noop } },
  navigator: { onLine: true },
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  speechSynthesis: undefined,
  alert: noop, confirm: () => false, console,
  setTimeout: noop, setInterval: noop, Audio: function(){ return { play: noop }; },
};
sandbox.window.speechSynthesis = undefined;
vm.createContext(sandbox);
// const/let im Script werden nicht global — Daten am Ende explizit exportieren
const exportCode = ';if(typeof registerVocabThemes==="function"){try{registerVocabThemes();}catch(e){}}' +
  'var __nums=[];if(typeof ruNumber==="function"){for(var __i=1;__i<=100;__i++)__nums.push(ruNumber(__i));for(var __h=1;__h<=9;__h++)__nums.push(ruNumber(__h*100));__nums.push(ruNumber(1000));}' +
  ';globalThis.__EXPORT={C:typeof C!=="undefined"?C:{},GAP_DATA:typeof GAP_DATA!=="undefined"?GAP_DATA:{},AQ_EX:typeof AQ_EX!=="undefined"?AQ_EX:{},STORIES:typeof STORIES!=="undefined"?STORIES:[],DLG:typeof DLG!=="undefined"?DLG:[],THEME_VOCAB:typeof THEME_VOCAB!=="undefined"?THEME_VOCAB:{},READ_WORDS:typeof READ_WORDS!=="undefined"?READ_WORDS:[],NUMS:__nums,GDRILL:typeof GRAMMAR_DRILL!=="undefined"?GRAMMAR_DRILL:[]};';
vm.runInContext(m[1] + exportCode, sandbox);
const X = sandbox.__EXPORT || {};

const texts = new Set();
const C = X.C || {};
for (const sec in C) (C[sec] || []).forEach(it => {
  if (it.m) texts.add(it.m.trim());
  // Beispielsätze (ctx) sind antippbar → brauchen Audio.
  // Alphabet zeigt jetzt Beispielwörter (AQ_EX) statt Sätzen → ctx hier überspringen.
  if (sec !== 'alphabet') (it.ctx || []).forEach(s => { if (s.ru) texts.add(s.ru.trim()); });
});
// Alphabet-Beispielwörter (antippbar auf der Buchstabenkarte)
const AQEX = X.AQ_EX || {};
for (const l in AQEX) { if (AQEX[l] && AQEX[l].w) texts.add(AQEX[l].w.trim()); }
const GAP = X.GAP_DATA || {};
for (const l in GAP) ['s1', 's2', 's3', 's4'].forEach(k => { if (GAP[l][k] && GAP[l][k].full) texts.add(GAP[l][k].full.trim()); });
(X.STORIES || []).forEach(st => texts.add(st.text.map(p => p.ru).join('').trim()));
(X.DLG || []).forEach(d => { if (d.ai) texts.add(d.ai.trim()); if (d.h) texts.add(d.h.trim()); });
const TV = X.THEME_VOCAB || {};
for (const t in TV) TV[t].forEach(it => { if (it.m) texts.add(it.m.trim()); });
// Grammatik-Trainer: vollständige Sätze (Lücke mit richtiger Antwort gefüllt) werden vorgesprochen
(X.GDRILL || []).forEach(it => { if (it.q && it.answer) texts.add(it.q.replace('___', it.answer).trim()); });
(X.READ_WORDS || []).forEach(w => { if (w.w) texts.add(w.w.trim()); });
// Zahlen 1–100, Hunderter und 1000 für den Zahlen-Trainer
(X.NUMS || []).forEach(n => { if (n) texts.add(n.trim()); });

const arr = [...texts].filter(t => t.length > 0);
fs.writeFileSync(path.join(__dirname, 'texts.json'), JSON.stringify(arr, null, 1), 'utf8');
console.log(arr.length + ' Texte extrahiert → tools/texts.json');
