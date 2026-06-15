// Fügt Karten in THEME_VOCAB einen Beispielsatz (ctx) hinzu, gematcht über m.
// Format dort: {m:"W",t:"...",s:"...",e:"..."} (unquoted keys).
// Aufruf: node tools/add_theme_ctx.js ctx_theme.json  (idempotent)
const fs = require('fs'); const path = require('path');
const S = JSON.parse(fs.readFileSync(path.join(__dirname, process.argv[2]), 'utf8'));
const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const THEME_VOCAB={');
const e = html.indexOf('};', s);
if (s < 0 || e < 0) { console.error('THEME_VOCAB nicht gefunden'); process.exit(1); }
let block = html.substring(s, e);
let count = 0, missing = [];
for (const w in S) {
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(\\{m:"' + esc + '",[^}]*?)(,ctx:\\[[^\\]]*\\])?(\\})');
  if (!re.test(block)) { missing.push(w); continue; }
  block = block.replace(re, function (full, body, oldctx, brace) {
    const j = x => x.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return body + ',ctx:[{ru:"' + j(S[w][0]) + '",de:"' + j(S[w][1]) + '"}]' + brace;
  });
  count++;
}
fs.writeFileSync(file, html.substring(0, s) + block + html.substring(e), 'utf8');
console.log(process.argv[2] + ': ' + count + ' Beispielsätze ergänzt.');
if (missing.length) console.log('NICHT gefunden (' + missing.length + '): ' + missing.join(', '));
