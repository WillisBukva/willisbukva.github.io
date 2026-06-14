// Stockt den Sätze-Pfad von 25 auf 50 auf. Antwortoptionen (o/r) werden aus
// dem gesamten Satz-Pool als Distraktoren generiert. Idempotent über Marker.
// Aufruf: node tools/add_sentences.js
const fs = require('fs'); const path = require('path');

// neue Sätze (grob leicht → schwer), [russisch, deutsch, kategorie]
const NEW = [
  ['Доброе утро!', 'Guten Morgen!', 'Begrüßung'],
  ['Меня зовут Иван.', 'Ich heiße Iwan.', 'Vorstellung'],
  ['Где туалет?', 'Wo ist die Toilette?', 'Frage'],
  ['Я не понимаю.', 'Ich verstehe nicht.', 'Alltag'],
  ['Повторите, пожалуйста.', 'Wiederholen Sie bitte.', 'Höflichkeit'],
  ['Я хочу есть.', 'Ich habe Hunger.', 'Bedürfnis'],
  ['Это очень вкусно.', 'Das ist sehr lecker.', 'Essen'],
  ['Сколько тебе лет?', 'Wie alt bist du?', 'Frage'],
  ['Извините, я опоздал.', 'Entschuldigung, ich habe mich verspätet.', 'Höflichkeit'],
  ['Я ищу аптеку.', 'Ich suche eine Apotheke.', 'Unterwegs'],
  ['Помогите мне, пожалуйста.', 'Helfen Sie mir bitte.', 'Notfall'],
  ['У меня болит голова.', 'Ich habe Kopfschmerzen.', 'Gesundheit'],
  ['Сколько сейчас времени?', 'Wie spät ist es jetzt?', 'Zeit'],
  ['Можно меню, пожалуйста?', 'Kann ich die Karte haben, bitte?', 'Restaurant'],
  ['Дайте мне воды, пожалуйста.', 'Geben Sie mir bitte Wasser.', 'Restaurant'],
  ['Моя семья живёт в Берлине.', 'Meine Familie wohnt in Berlin.', 'Familie'],
  ['Я работаю каждый день.', 'Ich arbeite jeden Tag.', 'Alltag'],
  ['На улице идёт дождь.', 'Draußen regnet es.', 'Wetter'],
  ['Завтра я поеду домой.', 'Morgen fahre ich nach Hause.', 'Reise'],
  ['Мой брат старше меня.', 'Mein Bruder ist älter als ich.', 'Familie'],
  ['Вчера мы были в театре.', 'Gestern waren wir im Theater.', 'Vergangenheit'],
  ['Я изучаю русский язык два года.', 'Ich lerne seit zwei Jahren Russisch.', 'Lernen'],
  ['Когда отправляется следующий поезд?', 'Wann fährt der nächste Zug ab?', 'Reise'],
  ['Я никогда не был в России.', 'Ich war noch nie in Russland.', 'Erfahrung'],
  ['Здесь можно фотографировать?', 'Darf man hier fotografieren?', 'Frage']
];

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// alten Block entfernen (Idempotenz)
html = html.replace(/\/\*__SENT_EXTRA__\*\/[\s\S]*?\/\*__SENT_EXTRA_END__\*\//, '');

// vorhandene Sätze (m,t) für Distraktoren sammeln
const start = html.indexOf('sentences:[');
const end = html.indexOf('\n],', start);
const block = html.substring(start, end);
const existing = [];
const re = /\{m:"([^"]+)",t:"([^"]+)"/g; let mt;
while ((mt = re.exec(block)) !== null) existing.push({ m: mt[1], t: mt[2] });
const all = existing.concat(NEW.map(n => ({ m: n[0], t: n[1] })));

function distract(field, correct) {
  const pool = all.filter(x => x[field] !== correct).map(x => x[field]);
  const out = [];
  while (out.length < 3 && pool.length) { const i = Math.floor(Math.random() * pool.length); out.push(pool.splice(i, 1)[0]); }
  return out;
}
const j = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const cards = NEW.map(n => {
  const o = [n[1]].concat(distract('t', n[1]));
  const r = [n[0]].concat(distract('m', n[0]));
  return '  {m:"' + j(n[0]) + '",t:"' + j(n[1]) + '",s:"' + j(n[2]) + '",e:"' + j(n[0]) + '",o:["' + o.map(j).join('","') + '"],r:["' + r.map(j).join('","') + '"]}';
}).join(',\n');

const insert = ',\n/*__SENT_EXTRA__*/\n' + cards + '\n/*__SENT_EXTRA_END__*/';
const newEnd = html.indexOf('\n],', html.indexOf('sentences:['));
// evtl. vorhandenes Schlusskomma vor dem Array-Ende abstreifen → kein Doppelkomma
const pre = html.substring(0, newEnd).replace(/,\s*$/, '');
html = pre + insert + html.substring(newEnd);

// DIFF_RANGES für sentences aufweiten, damit die 50 über die Level verteilt sind
html = html.replace(/sentences:\{anfaenger:\[0,5\],standard:\[0,12\],fort:\[0,20\],profi:\[0,999\]\}/,
  'sentences:{anfaenger:[0,10],standard:[0,28],fort:[0,42],profi:[0,999]}');

fs.writeFileSync(file, html, 'utf8');
console.log(NEW.length + ' neue Sätze ergänzt (gesamt ' + all.length + ').');
