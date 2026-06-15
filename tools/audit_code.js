// Audit: ungenutzte Funktionen (Dead Code) + verwaiste ID-Referenzen
const fs = require('fs'); const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = (html.match(/<script>([\s\S]*?)<\/script>/g) || []).join('\n');

// 1. Funktionsdeklarationen finden
const fnRe = /function\s+([A-Za-z_$][\w$]*)\s*\(/g; let mm;
const fns = [];
while ((mm = fnRe.exec(script)) !== null) fns.push(mm[1]);

console.log('=== Funktionen gesamt: ' + fns.length + ' ===');
console.log('\n=== Möglicherweise ungenutzt (nur 1 Vorkommen = nur Definition) ===');
let dead = 0;
fns.forEach(name => {
  // alle Vorkommen des Namens im ganzen Dokument (inkl. HTML-onclick)
  const re = new RegExp('\\b' + name.replace(/\$/g, '\\$') + '\\b', 'g');
  const inHtml = (html.match(re) || []).length;
  if (inHtml <= 1) { console.log('  ' + name + ' (' + inHtml + 'x)'); dead++; }
});
if (!dead) console.log('  keine');

// 2. onclick/id-Referenzen auf nicht existierende Funktionen
console.log('\n=== onclick-Aufrufe auf undefinierte Funktionen ===');
const onclickRe = /on\w+="([a-zA-Z_$][\w$]*)\(/g; const called = new Set(); let oc;
while ((oc = onclickRe.exec(html)) !== null) called.add(oc[1]);
const known = new Set(fns);
// auch const x=function / x=()=> Zuweisungen sammeln
const assignRe = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:function|\()/g; let as;
while ((as = assignRe.exec(script)) !== null) known.add(as[1]);
let missing = 0;
called.forEach(fn => { if (!known.has(fn)) { console.log('  ' + fn + ' — nicht definiert!'); missing++; } });
if (!missing) console.log('  keine');
