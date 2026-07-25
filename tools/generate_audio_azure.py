# Generiert MP3-Audio mit AZURE SPEECH (kommerziell lizenziert) -> audio/<hash>.mp3
# Gleiche Stimme + gleiche Dateinamen wie generate_audio.py (edge-tts), nur LIZENZIERT
# fuer den Verkauf. Ueberschreibt ALLE Clips (die alten edge-tts-Clips werden ersetzt).
#
# Voraussetzung: Azure "Speech"-Ressource (Tarif F0 oder S0). Nur Standardbibliothek (kein pip noetig).
#
# Aufruf in git-bash (Schluessel bleibt bei dir, nicht committen!):
#   export AZURE_SPEECH_KEY=DEIN_KEY_1
#   export AZURE_SPEECH_REGION=northeurope
#   python tools/generate_audio_azure.py
#
# F0 (gratis) hat ein Rate-Limit -> Standard-Pause 3 s/Clip (dauert ~2 h fuer alle).
# Auf S0 kannst du es beschleunigen:  export AZURE_DELAY=0
#
# NUR FEHLENDE Clips nachziehen (nach neuen Texten in index.html):
#   export AZURE_ONLY_MISSING=1
import os
import sys
import json
import time
import urllib.request
import urllib.error
from xml.sax.saxutils import escape

VOICE = "ru-RU-SvetlanaNeural"
RATE = "-10%"  # identisch zu generate_audio.py
OUTFMT = "audio-24khz-48kbitrate-mono-mp3"

KEY = os.environ.get("AZURE_SPEECH_KEY")
REGION = os.environ.get("AZURE_SPEECH_REGION", "northeurope")
DELAY = float(os.environ.get("AZURE_DELAY", "3.0"))  # Sekunden Pause zwischen Clips (F0-Limit)
ONLY_MISSING = os.environ.get("AZURE_ONLY_MISSING", "") not in ("", "0")

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(HERE, "..", "audio")
ENDPOINT = "https://%s.tts.speech.microsoft.com/cognitiveservices/v1" % REGION


def fnv1a(text):
    """FNV-1a 32-Bit ueber UTF-8-Bytes -- identisch zu audioKey() in index.html."""
    h = 0x811C9DC5
    for b in text.encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return format(h, "08x")


def speakable(text):
    """Schraegstrich-Varianten ('он / она') als Aufzaehlung sprechen -- wie generate_audio.py."""
    return text.replace(" / ", ", ").replace("/", ", ")


def synth(text):
    ssml = ("<speak version='1.0' xml:lang='ru-RU'><voice name='%s'>"
            "<prosody rate='%s'>%s</prosody></voice></speak>") % (VOICE, RATE, escape(speakable(text)))
    req = urllib.request.Request(
        ENDPOINT,
        data=ssml.encode("utf-8"),
        headers={
            "Ocp-Apim-Subscription-Key": KEY,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": OUTFMT,
            "User-Agent": "bukva-audio",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def main():
    if not KEY:
        print("FEHLER: Umgebungsvariable AZURE_SPEECH_KEY fehlt. Bitte setzen.")
        sys.exit(1)
    with open(os.path.join(HERE, "texts.json"), encoding="utf-8") as f:
        texts = [t.strip() for t in json.load(f) if t.strip()]
    os.makedirs(AUDIO_DIR, exist_ok=True)

    # Manifest deckt IMMER alle Texte ab; erzeugt wird ggf. nur, was fehlt.
    alle = texts
    if ONLY_MISSING:
        texts = [t for t in texts
                 if not os.path.exists(os.path.join(AUDIO_DIR, fnv1a(t) + ".mp3"))]
        print("Nur fehlende Clips: %d von %d." % (len(texts), len(alle)))
        if not texts:
            print("Nichts zu tun - alle Clips sind vorhanden.")
            return

    ok = 0
    fail = 0
    errs = []
    total = len(texts)
    print("Erzeuge %d Clips ueber Azure (%s, Stimme %s) ..." % (total, REGION, VOICE))
    for i, t in enumerate(texts):
        out = os.path.join(AUDIO_DIR, fnv1a(t) + ".mp3")
        for attempt in range(4):
            try:
                data = synth(t)
                if not data:
                    raise RuntimeError("leere Antwort")
                with open(out, "wb") as f:
                    f.write(data)
                ok += 1
                break
            except urllib.error.HTTPError as e:
                # 429 = Rate-Limit -> laenger warten (Retry-After beachten)
                wait = int(e.headers.get("Retry-After", 0) or 0) or (5 * (attempt + 1))
                if attempt == 3:
                    fail += 1
                    errs.append((t, "HTTP %s" % e.code))
                else:
                    time.sleep(wait)
            except Exception as e:
                if attempt == 3:
                    fail += 1
                    errs.append((t, str(e)))
                else:
                    time.sleep(3 * (attempt + 1))
        if (i + 1) % 50 == 0:
            print("  %d/%d ..." % (i + 1, total), flush=True)
        if DELAY:
            time.sleep(DELAY)

    # Manifest fuer den Offline-Download neu schreiben (gleiche Hashes wie vorher)
    with open(os.path.join(AUDIO_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump([fnv1a(t) + ".mp3" for t in alle], f, indent=0)

    print("\nFertig: %d erzeugt, %d fehlgeschlagen (Region %s)." % (ok, fail, REGION))
    for t, e in errs[:10]:
        print("  FEHLER '%s': %s" % (t, e))
    size = sum(os.path.getsize(os.path.join(AUDIO_DIR, x)) for x in os.listdir(AUDIO_DIR) if x.endswith(".mp3"))
    print("audio/ gesamt: %.1f MB" % (size / 1024 / 1024))


if __name__ == "__main__":
    main()
