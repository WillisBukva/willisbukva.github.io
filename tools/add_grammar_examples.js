// Fügt jeder Grammatik-Regel (5 Sektionen) einen zweiten Beispielsatz hinzu.
// Idempotent: greift nur bei Karten mit genau 1 ctx-Eintrag. Aufruf: node tools/add_grammar_examples.js
const fs = require('fs'); const path = require('path');
const S = {
  // grammar
  'Мужской род': ['Мой брат — студент.', 'Mein Bruder ist Student.'],
  'Женский род': ['Это интересная книга.', 'Das ist ein interessantes Buch.'],
  'Средний род': ['Окно открыто.', 'Das Fenster ist offen.'],
  'Множественное число': ['В комнате три окна.', 'Im Zimmer sind drei Fenster.'],
  "Kein 'ist' im Präsens": ['Москва — большой город.', 'Moskau ist eine große Stadt.'],
  'Свободный порядок слов': ['Маму я люблю.', 'Die Mama liebe ich (besonders).'],
  'У меня есть': ['У тебя есть собака.', 'Du hast einen Hund.'],
  'У меня нет': ['У нас нет молока.', 'Wir haben keine Milch.'],
  'Вопросительные слова': ['Сколько это стоит?', 'Wie viel kostet das?'],
  'Вопрос через интонацию': ['Это твой дом?', 'Ist das dein Haus?'],
  'Сравнительная степень': ['Этот дом больше.', 'Dieses Haus ist größer.'],
  'Степени сравнения прилагательных': ['Это самый лучший день.', 'Das ist der beste Tag.'],
  'Числа и падежи': ['У меня две сестры.', 'Ich habe zwei Schwestern.'],
  'Краткая форма прилагательного': ['Я очень рад.', 'Ich bin sehr froh.'],
  // grammar_faelle
  'Именительный падеж': ['Мама дома.', 'Mama ist zu Hause.'],
  'Родительный падеж': ['У меня нет брата.', 'Ich habe keinen Bruder.'],
  'Дательный падеж': ['Я звоню маме.', 'Ich rufe Mama an.'],
  'Винительный падеж': ['Я люблю музыку.', 'Ich liebe Musik.'],
  'Творительный падеж': ['Я пишу карандашом.', 'Ich schreibe mit dem Bleistift.'],
  'Предложный падеж': ['Книга лежит на столе.', 'Das Buch liegt auf dem Tisch.'],
  'Падежные окончания существительных': ['Я говорю о брате.', 'Ich spreche über den Bruder.'],
  'Склонение прилагательных': ['У меня новая машина.', 'Ich habe ein neues Auto.'],
  'Родительный падеж мн.ч.': ['Здесь нет книг.', 'Hier gibt es keine Bücher.'],
  'Предлоги с падежами': ['Я еду в город. Я живу в городе.', 'Ich fahre in die Stadt. Ich wohne in der Stadt.'],
  'Одушевлённые существительные': ['Я знаю этого человека.', 'Ich kenne diesen Menschen.'],
  // grammar_verben
  'Я читаю / ты читаешь': ['Мы читаем книгу.', 'Wir lesen ein Buch.'],
  'Я говорю / ты говоришь': ['Они говорят по-русски.', 'Sie sprechen Russisch.'],
  'Глагол БЫТЬ': ['Они были на работе.', 'Sie waren bei der Arbeit.'],
  'Глагол ХОТЕТЬ': ['Мы хотим есть.', 'Wir wollen essen.'],
  'Глагол ИДТИ / ХОДИТЬ': ['Я хожу в школу каждый день.', 'Ich gehe jeden Tag zur Schule.'],
  'Глагол ЕХАТЬ / ЕЗДИТЬ': ['Летом я езжу на море.', 'Im Sommer fahre ich ans Meer.'],
  'Прошедшее время': ['Она работала вчера.', 'Sie arbeitete gestern.'],
  'Будущее время': ['Завтра я буду дома.', 'Morgen werde ich zu Hause sein.'],
  'Виды глагола: НСВ и СВ': ['Я прочитал книгу.', 'Ich habe das Buch (zu Ende) gelesen.'],
  'Отрицание: НЕ + глагол': ['Я не хочу спать.', 'Ich will nicht schlafen.'],
  'НЕТ + родительный падеж': ['У него нет времени.', 'Er hat keine Zeit.'],
  'Императив': ['Слушай меня!', 'Hör mir zu!'],
  'Возвратные глаголы на -СЯ/-СЬ': ['Я учусь в университете.', 'Ich studiere an der Universität.'],
  'Модальные слова: можно, нужно, надо': ['Мне нужно работать.', 'Ich muss arbeiten.'],
  'НЕЛЬЗЯ — запрет и невозможность': ['В музее нельзя фотографировать.', 'Im Museum darf man nicht fotografieren.'],
  // grammar_pronomen
  'Личные местоимения': ['Он мой друг.', 'Er ist mein Freund.'],
  'Склонение личных местоимений': ['Он любит меня.', 'Er liebt mich.'],
  'Притяжательные местоимения': ['Где моя книга?', 'Wo ist mein Buch?'],
  'его / её / их — неизменяемые': ['Это её машина.', 'Das ist ihr Auto.'],
  'Указательные местоимения': ['Этот дом большой.', 'Dieses Haus ist groß.'],
  'Вопросительные местоимения': ['Чей это телефон?', 'Wessen Telefon ist das?'],
  'Неопределённые местоимения': ['Кто-то звонит.', 'Jemand ruft an.'],
  'Отрицательные местоимения': ['Здесь никого нет.', 'Hier ist niemand.'],
  'Возвратное местоимение СЕБЯ': ['Он купил себе книгу.', 'Er hat sich ein Buch gekauft.'],
  'Относительное местоимение КОТОРЫЙ': ['Это дом, который я люблю.', 'Das ist das Haus, das ich liebe.'],
  'Местоимение ВЕСЬ / ВСЯ / ВСЁ / ВСЕ': ['Все люди здесь.', 'Alle Menschen sind hier.'],
  'Местоимение ДРУГОЙ / САМИ / САМ': ['Я сам это сделал.', 'Ich habe es selbst gemacht.'],
  // grammar_praepositionen
  'В и НА — место и направление': ['Я в школе.', 'Ich bin in der Schule.'],
  'ИЗ и С — Herkunft': ['Я из Берлина.', 'Ich komme aus Berlin.'],
  'К и ОТ — Annäherung/Entfernung': ['Я еду к бабушке.', 'Ich fahre zu Oma.'],
  'С + творительный — Begleitung': ['Я живу с родителями.', 'Ich wohne bei den Eltern.'],
  'О + предложный — über': ['Мы говорим о погоде.', 'Wir sprechen über das Wetter.'],
  'ДЛЯ + родительный — für': ['Это для мамы.', 'Das ist für Mama.'],
  'ИЗ-ЗА / ИЗ-ПОД — wegen/unter': ['Я опоздал из-за дождя.', 'Ich kam wegen des Regens zu spät.'],
  'ПЕРЕД / ЗА / МЕЖДУ + тв.пад.': ['Машина перед домом.', 'Das Auto steht vor dem Haus.'],
  'ПО + дательный — entlang/gemäß': ['Мы гуляем по городу.', 'Wir spazieren durch die Stadt.'],
  'ПРИ + предложный — bei/zu Zeiten': ['При мне всё было тихо.', 'In meiner Gegenwart war alles still.'],
  'ЧЕРЕЗ + винительный — durch/in': ['Я вернусь через неделю.', 'Ich komme in einer Woche zurück.'],
  'БЕЗ + родительный — ohne': ['Он ушёл без меня.', 'Er ging ohne mich weg.'],
  'ПОСЛЕ и ДО + родительный': ['После урока я иду домой.', 'Nach dem Unterricht gehe ich nach Hause.']
};

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
let count = 0, missing = [];
for (const w in S) {
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // nur Karten mit genau EINEM ctx-Eintrag (idempotent)
  const re = new RegExp('(m:"' + esc + '",[^\\n]*?ctx:\\[\\{ru:"[^"]*",de:"[^"]*"\\})(\\])');
  if (!re.test(html)) { missing.push(w); continue; }
  const j = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  html = html.replace(re, '$1,{ru:"' + j(S[w][0]) + '",de:"' + j(S[w][1]) + '"}$2');
  count++;
}
fs.writeFileSync(file, html, 'utf8');
console.log(count + ' Grammatik-Regeln um 2. Beispielsatz erweitert.');
if (missing.length) console.log('NICHT gefunden (' + missing.length + '): ' + missing.join(' | '));
