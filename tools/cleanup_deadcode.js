// Entfernt verifizierten toten Code: scGap-Cluster (JS+HTML) + 5 verwaiste Funktionen.
// Aufruf: node tools/cleanup_deadcode.js
const fs = require('fs'); const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const before = html.length;

// Funktion per Klammer-Zählung entfernen (String-/Kommentar-sicher)
function removeFunction(src, name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) { console.log('  (nicht gefunden: ' + name + ')'); return src; }
  let i = src.indexOf('{', start), depth = 0, q = null, inLine = false, inBlock = false;
  for (; i < src.length; i++) {
    const c = src[i], p = src[i - 1];
    if (inLine) { if (c === '\n') inLine = false; continue; }
    if (inBlock) { if (c === '*' && src[i + 1] === '/') { inBlock = false; i++; } continue; }
    if (q) { if (c === q && p !== '\\') q = null; continue; }
    if (c === '/' && src[i + 1] === '/') { inLine = true; i++; continue; }
    if (c === '/' && src[i + 1] === '*') { inBlock = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  // umgebende Leerzeile mitnehmen
  let end = i; while (src[end] === '\n' || src[end] === ' ') end++;
  let s2 = start; while (s2 > 0 && (src[s2 - 1] === '\n' || src[s2 - 1] === ' ')) s2--;
  return src.substring(0, s2) + '\n' + src.substring(end);
}

// 1. scGap-JS-Cluster (von der State-Zeile bis vor window load)
const clStart = html.indexOf("let gapLetter=null,gapStep=0,gapFrom='learn';");
const clEnd = html.indexOf("window.addEventListener('load'", clStart);
if (clStart > 0 && clEnd > clStart) {
  html = html.substring(0, clStart) + html.substring(clEnd);
  console.log('scGap-JS-Cluster entfernt');
} else console.log('!! scGap-Cluster-Grenzen nicht gefunden');

// 2. scGap-HTML-Block
const hStart = html.indexOf('<!-- GAP SENTENCE SCREEN -->');
const hEnd = html.indexOf('<div id="scAlphaQuiz"');
if (hStart > 0 && hEnd > hStart) {
  html = html.substring(0, hStart) + html.substring(hEnd);
  console.log('scGap-HTML-Block entfernt');
} else console.log('!! scGap-HTML-Grenzen nicht gefunden');

// 3. checkGapChoice (Einzeiler)
html = html.replace(/\n?function checkGapChoice\(chosen\)\{gapPickChoice\(chosen\);\}\n?/, '\n');
console.log('checkGapChoice entfernt');

// 4. übrige verwaiste Funktionen
['showAchievementsScreen', 'checkOnboarding', 'getSRSDueCount', 'getSRSDueItems'].forEach(function (n) {
  html = removeFunction(html, n);
  console.log(n + ' entfernt');
});

fs.writeFileSync(file, html, 'utf8');
console.log('\nGröße: ' + before + ' → ' + html.length + ' (' + (before - html.length) + ' Zeichen entfernt)');
