// Generischer Injektor: fügt Karten im TOP500-Block (vocab_top1..6) einen
// Beispielsatz (ctx) hinzu, gematcht über das russische Wort (m).
// Die Sätze stehen in tools/ctx_<name>.json als { "<wort>": ["ru","de"], ... }.
// Aufruf: node tools/add_top_ctx.js ctx_top2.json   (idempotent)
const fs = require('fs'); const path = require('path');
const mapFile = process.argv[2];
if (!mapFile) { console.error('Bitte Map-Datei angeben, z. B. ctx_top2.json'); process.exit(1); }
const S = JSON.parse(fs.readFileSync(path.join(__dirname, mapFile), 'utf8'));

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('// __TOP500_START__'); const e = html.indexOf('// __TOP500_END__');
if (s < 0 || e < 0) { console.error('TOP500-Block nicht gefunden'); process.exit(1); }
let block = html.substring(s, e);
let count = 0, missing = [];
for (const w in S) {
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // nur Karten ohne ctx (idempotent)
  const re = new RegExp('(\\{"m":"' + esc + '","t":[^}]*?)(,"ctx":\\[[^\\]]*\\])?(\\})');
  if (!re.test(block)) { missing.push(w); continue; }
  block = block.replace(re, function (full, body, oldctx, brace) {
    const j = x => x.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return body + ',"ctx":[{"ru":"' + j(S[w][0]) + '","de":"' + j(S[w][1]) + '"}]' + brace;
  });
  count++;
}
fs.writeFileSync(file, html.substring(0, s) + block + html.substring(e), 'utf8');
console.log(mapFile + ': ' + count + ' Beispielsätze ergänzt.');
if (missing.length) console.log('NICHT gefunden (' + missing.length + '): ' + missing.join(', '));
