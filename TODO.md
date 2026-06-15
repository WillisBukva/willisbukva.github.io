# Bukva – Fahrplan

Stand: 11.06.2026

## Erledigt (11.06.2026) — Bug-Fixes
- [x] SRS/Wiederholung: Karten werden jetzt unter ihrem echten Index gespeichert (vorher wurden immer nur die ersten ~5 Karten jeder Sektion wiederholt)
- [x] XP wurde beim Quiz-Abschluss doppelt vergeben — jetzt nur noch pro Frage
- [x] Antwortprüfung: 2-Buchstaben-Raten zählt nicht mehr; stattdessen Tippfehler-Toleranz (Levenshtein ≥ 0.85)
- [x] Mikrofon-Vergleich (Lernen/Quiz/Sprechen): kein lasches `includes` mehr, Ähnlichkeitsprüfung
- [x] Streak: 7-Tage-Deckel entfernt, echter Zähler (bricht bei Pause korrekt auf 1)
- [x] Hören-Quiz: Crash behoben (Karten haben keine `r`/`o`-Felder) — Vorschläge werden generiert, Russisch ODER Deutsch gilt als richtig, Lösung/Hilfe zeigen sinnvolle Inhalte
- [x] Service Worker: relative Pfade + komplette App-Shell precachen (Cache `bukva-v4`) → offline ab erstem Besuch
- [x] manifest.json: Icon-Pfade korrigiert (kein `icons/`-Ordner), `start_url`/`scope` relativ
- [x] 715-KB-Base64-Manifest aus dem `<head>` entfernt → index.html von 1,12 MB auf ~0,4 MB
- [x] Fortschritt: Richtig/Falsch zählt nur korrekte Antworten; Dashboard zeigt Fortschritt gegen den Level-Pool

## Erledigt (12.06.2026) — Roter-Faden-Update
- [x] „▶ Hier weitermachen"-Karte oben im Lernpfad: empfiehlt genau einen nächsten Schritt (fällige Wiederholungen ab 5 → Alphabet bis fertig → erster unfertiger Pfad in Reihenfolge)
- [x] Sanfte Voraussetzungen statt Level-Sperren: Pfade immer anklickbar, bei fehlender Empfehlung gedimmt mit „💡 Tipp: erst X lernen" (SEC_REQS)
- [x] Dashboard in 4 Gruppen: Grundlagen / Wortschatz / Fertigkeiten / Deine Welt
- [x] Level umgedeutet zum „Hilfe-Level" (steuert nur noch Hilfen/Versuche/Rundengröße/XP — keine Freischaltung mehr); Hören & Sprechen damit ab Tag 1 zugänglich
- [x] Tages-Session gebaut (12.06.2026): 🚀-Hauptkarte auf dem Dashboard → Plan-Overlay (Wiederholungen → 1–3 Runden neue Karten je nach dailyMins → rotierende Spiel-Runde), geführte Kette mit Auto-Wiederöffnung nach jedem Schritt, Abschluss-Feier mit Tagesbilanz, danach Erfolgskarte + freies Lernen

## Erledigt (13.06.2026) — Streak-Kalender
- [x] Streak-Box auf dem Dashboard ist antippbar → Streak-Kalender (Monatsansicht mit 🔥 auf jedem Lerntag, blätterbar bis in die Vergangenheit, Zukunft gesperrt)
- [x] Statistik: aktueller Streak / Rekord (längster je) / Lerntage gesamt
- [x] Lerntage werden jetzt dauerhaft gespeichert (vorher nur 14 Tage zurück) — fürs Kalender-Archiv
- [Hinweis] Streak-Zähler ist seit 11.06. unbegrenzt (kein 7-Tage-Deckel mehr); die 7 Kästchen neben der Flamme bleiben Wochen-Vorschau

## Aktuell in Arbeit
- [ ] Alle Lernpfade gemeinsam durchgehen und verbessern
  - [x] Alphabet: didaktische Lern-Reihenfolge (Wie im Deutschen → Falsche Freunde → Neue Formen → Besonderheiten), Kleinbuchstaben auf Karten, Buchstaben-Auswahlmenü zum Wiederholen einzelner gelernter Buchstaben (ohne Fortschritts-Verfälschung)
  - [x] Alphabet: Lese-Belohnung (49 Wörter, schalten sich mit gelernten Buchstaben frei, mit Audio) + Verwechsler-Training (6 Paare, 10 Schnellfragen, 3 Fragetypen, +2 XP pro Treffer)
  - [x] Alphabet: 66 Alternativ-Lückensätze (s3/s4) — Wiederholungen rotieren jetzt die Satz-Paare; Ы-Satzfehler korrigiert ("собаки" endete auf и)
  - [x] Alphabet: aktives Lese-Quiz (hören→Wort / Wort→Bedeutung, 10 Fragen), Handschrift-Vorschau auf Lernkarte (kursiv), Meisterschafts-Sterne pro Buchstabe (1=gelernt, 2=wiederholt, 3=≥85% Trefferquote)
  - [x] Tracing/Nachzeichnen bewusst gestrichen (Entscheidung 12.06.2026)
  - [x] Vokabeln Bugfixes (12.06.2026): Themen-Wörter verdrängten die Grundlagen aus dem Anfänger-Pool (jetzt nach den 10 Kern-Basics eingefügt, richtige Reihenfolge); Themen-Karten ohne Antwortoptionen (werden jetzt generiert); Lernkarte zeigte Kategorie als „Aussprache" (jetzt echte Transliteration); Hilfe zeigt Aussprache wenn keine Eselsbrücke da
  - [x] Vokabeln: Themen-Menü gebaut (12.06.2026) — alle 7 Bereiche wählbar (Grundwortschatz 47 + Urlaub 25, Beruf 20, Familie 19, Kultur 16, Studium 12, Alltag 14 = 153 Karten), eigener Fortschritt pro Thema, Onboarding-Ziel als „⭐ Dein Ziel" markiert, alte 10-Wörter-Einmischung entfernt
  - [x] Vokabeln Groß-Ausbau (12.06.2026): 520 Top-Frequenz-Wörter in 6 Paketen (Pipeline: tools/top500.json + inject_top500.js); Wort-Paare-Spiel (3 Runden à 5 Paare); Beispielsätze antippbar mit Audio (alle ctx vertont); Richtungs-SRS (RU→DE/DE→RU getrennt); 4 fehlende Themen-Erfolge + 2 Top-100-Erfolge; Lern-Timer mit Tagesbilanz (Onboarding-Zeit läuft beim Lernen, Chip unten rechts, Bilanz-Popup bei Ablauf). Audio gesamt: 1.345 Clips / 19 MB
  - [x] Inhalt ausgebaut (13.06.2026): Lesen 3→16 Karten, Mini-Geschichten 3→15, Beispielsätze für alle Top-100-Wörter (vocab_top1). Audio gesamt 1.578 Clips / 23 MB. Pipeline-Skripte: add_reading_stories.js, add_top100_sentences.js
  - [x] Beispielsätze komplettiert (15.06.2026): alle Top-Wörter 101–520 (top2–top6, 420 Sätze) UND alle 106 Themen-Karten (urlaub/beruf/familie/kultur/studium/allgemein) haben jetzt einen vertonten Beispielsatz. ctx-Sätze gesamt: 928. Alle Wort-Pfade zu 100 % mit Kontext. Pipeline: tools/add_top_ctx.js + ctx_topN.json, tools/add_theme_ctx.js + ctx_themes.json
  - [x] ё/е-Toleranz (15.06.2026): getippte Antworten werten ё und е als gleich (checkAns, checkListen, checkDiktat, checkRetry) — „зеленый" gilt für „зелёный". Standard-Nachsicht, da ё im Russischen meist als е geschrieben wird.
  - [ ] Vokabeln später: mehr Dialoge (DLG 12→20+) fürs Sprechen; Betonungszeichen; SRS-fällige Karten automatisch in neue Runden mischen

## Geprüft & verworfen (15.06.2026) — Befunde aus externer Code-Review, alle False Positives
- speechSynthesis-„Endlosrekursion": getViews() löst voiceschanged NICHT aus (empirisch: 10 Aufrufe → 0 Events). Kein Bug. ({once:true} wäre sogar schädlich.)
- gapKyr() „ID-Tippfehler": HTML-ID und JS sind beide `gapKyrKeys`; das behauptete `gapKeys` existiert nicht. Kein Bug.
- Verbesserungs-Vorschläge: Fortschrittsanzeige, grüner Flash, Tastatur-Tap-Feedback (.kkey:active), Session-Konzept — alle bereits vorhanden.
  - [x] Grammatik überarbeitet (13.06.2026): (1) Grammatik-Trainer mit 36 Anwendungs-Aufgaben (Lückentext: richtige Fallendung/Verbform/Possessiv wählen, mit Erklärung bei Fehler) — behebt das „Übersetze-die-Regel"-Problem; in Tages-Session-Rotation. (2) Deklinations-Tabelle (стол/книга/окно mit hervorgehobenen Endungen) auf allen 6 Fall-Karten. (3) Jede der 65 Regeln hat jetzt 2 Beispielsätze (130 total), alle vertont. Audio gesamt 1.663 / 24,3 MB
  - [x] Hören überarbeitet (14.06.2026): (1) Audio-first-Lernkarte — russischer Text versteckt (🎧), spielt automatisch, „👁 Text zeigen" löst auf. (2) 🐢 Langsam-Button (0,6× via playbackRate, ohne neue Audios). (3) Hörverständnis-Quiz: Satz hören → Bedeutung aus 4 wählen. (4) Hören-Menü: Hören&Tippen / Hörverständnis / Diktat. In Tages-Session-Rotation.
  - [x] Sprechen überarbeitet (14.06.2026): (1) Dialog-Modus aktiviert die toten DLG-Daten (5→12 Dialoge mit dt. Übersetzung): App fragt per Audio, du antwortest per Mikro oder lässt die Musterantwort zeigen/vorsprechen. (2) 🐢 Langsam-Button auf der Sprechkarte. (3) Sprechen-Menü: Aussprache üben / Dialog. Dialog in Tages-Session-Rotation (nur online+Mikro). Punkt „Kein-Mikro-Fallback" verworfen — Handy-App hat immer Mikro; echtes Offline-Sprechen kommt nativ via Capacitor.
  - [x] Sätze überarbeitet (14.06.2026): (1) Sätze-Menü mit Modus-Wahl — Satzpuzzle / Richtig oder Falsch / Übersetzungs-Quiz, statt Zufall (_sentMode; Tages-Session bleibt zufällig). (2) Von 25 auf 50 Sätze aufgestockt (gestaffelt, DIFF_RANGES geweitet: A1 0–10, A2 0–28, B1 0–42), Antwortoptionen aus Pool generiert, alle vertont. Pipeline: add_sentences.js
  - [ ] Lesen (nur 3 Texte!) & Mini-Geschichten (nur 3) — Inhalt ausbauen
  - [x] Zahlen komplett überarbeitet (12.06.2026): Zahlen-Menü mit Zahlen-Trainer (🔊 hören→Ziffernfeld + Ziffer→Wort, Level-abhängig bis 20/100/1000, Audio für alle Zahlen 1–100 + Hunderter, zusammengesetzte >100 aus Teil-Clips), Hör-Verwechsler (12/20…19/90), Level-Bereiche neu (Uhrzeit/Geld nicht mehr Profi-exklusiv), Eselsbrücken fürs -надцать-Muster, Doppelkarte четвёртый/пятый getrennt
  - [x] Farben komplett überarbeitet (12.06.2026): Farben-Trainer mit echten Farbfeldern (Feld→Wort + Hören→Feld), голубой ergänzt (zwei Blaus!), светло-/тёмно--Präfixe, alle 3 Genus-Formen auf Lernkarten, 15 Beispielsätze mit Audio, Level-Bereiche angepasst
  - [x] Wochentage & Monate (13.06.2026): Menü mit Reihenfolge-Trainer (nach/vor für Tage & Monate, mit Wraparound) + „Heute"-Übung (echtes Datum: heutiger Tag/Monat/morgen) + Karten lernen; Beispielsätze (ctx) für alle 23 Karten mit Audio; Locativ-Phrase mit Übersetzung auf Lernkarte (в понедельник = am Montag); „≈ wie im Deutschen"-Hinweis bei Monaten; in Tages-Session-Spielrotation aufgenommen
  - [x] Eigene Listen überarbeitet (14.06.2026): (1) ???-Platzhalter-Bug behoben — echte Distraktoren aus eigenen Karten + Grundwortschatz beim Quiz-Start. (2) Karten bearbeiten (nicht nur löschen/anlegen) + Anhören-Button in der Liste; Typo „Eselsbridge"→„Eselsbrücke". (3) NEU Fehler-Liste (Idee Nutzer): Dashboard-„Fehler"-Box ist antippbar → Liste aller falsch beantworteten Karten (anhörbar, einzeln entfernbar, „Alle wiederholen", „Liste leeren"). Export/Backup bewusst verschoben → später Konto-Cloud-Sync.

## Erledigt (11.06.2026) — Offline-Audio
- [x] Vorlese-Stimme: 556 MP3-Clips (8 MB) mit Edge-TTS vorproduziert (ru-RU-SvetlanaNeural, −10 % Tempo) → `audio/`
  - Pipeline: `node tools/extract_texts.js` → `python tools/generate_audio.py` (inkrementell, bei neuen Inhalten einfach erneut laufen lassen)
  - `spk()` spielt Audio-Datei (Hash-Lookup FNV-1a), System-Stimme nur noch Fallback (z. B. eigene Vokabeln)
  - Alle Audios werden im Hintergrund in den SW-Cache geladen → Vorlesen komplett offline
  - Service Worker: Cache-first für Audio/Icons, Network-first für App-Shell
- [x] Spracherkennung: Hinweis wenn offline (alle 3 Mikrofon-Stellen)

## Demnächst (Offline)
- [ ] Spracherkennung nativ/offline → kommt mit Capacitor in der Play-Store-Phase (Android SpeechRecognizer + Offline-Sprachpaket)

## Später (Play Store, kostenpflichtig)
- [ ] Backup/Export des Fortschritts (localStorage geht beim Cache-Leeren verloren — 1-Sterne-Risiko!)
- [ ] Passwörter nicht im Klartext speichern (oder Login-Konzept vereinfachen)
- [ ] Weg wählen: TWA (Bubblewrap) oder Capacitor
- [ ] Google-Play-Developer-Konto, Datenschutzerklärung, Store-Eintrag, Screenshots
