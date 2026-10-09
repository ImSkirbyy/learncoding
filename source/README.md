# LearnCoding

Eine Lern-App im Duolingo-Stil zum Programmieren lernen – für Android und iOS (Expo / React Native, TypeScript).

- **6 Sprachen:** Python, JavaScript, Luau (Roblox), Java, C++ und Arduino (für den Arduino Uno)
- **58 Lektionen, 331 Aufgaben** in 5 Einheiten pro Sprache: Erste Schritte, Variablen, Entscheidungen, Schleifen, Funktionen
- **Aufgabentypen:** Erklär-Karten, Multiple Choice, Lückentext, Code-Bausteine sortieren
- **Anfängerfreundlich:** jede neue Idee wird erst erklärt, Tipps auf Knopfdruck, Erklärung nach jeder Antwort, falsche Aufgaben kommen am Ende nochmal, Herzen kostenlos auffüllbar
- **Motivation:** XP, Tagesziel, Streak, Erfolge, Wochen-Statistik
- **Maskottchen "Bit"** und alle Icons sind selbst gezeichnet (SVG im Code)
- Fortschritt wird auf dem Gerät gespeichert

## Fertige App installieren

**Android (z. B. Samsung):** `LearnCoding.apk` aufs Handy laden und antippen. Beim ersten Mal fragt Android, ob die App (z. B. „Eigene Dateien“ oder der Browser) unbekannte Apps installieren darf – einmal erlauben, dann „Installieren“. Die App braucht kein Internet.

Die APK ist eine kleine Android-Hülle (`android-wrapper/`), in der die Web-Version der App steckt. Neu bauen (Ubuntu, ohne Android Studio):

```bash
npx expo export --platform web
python3 tools/build_webapp.py . webapp <ordner-mit-icons>
android-wrapper/build.sh webapp LearnCoding.apk
```

`android-wrapper/learncoding.keystore` gut aufheben: Nur mit demselben Schlüssel lassen sich Updates über die alte App installieren.

**iPad / iPhone:** Apple erlaubt Apps nur über den App Store. Ohne App Store geht es als Web-App: Die Seite in Safari öffnen → Teilen-Knopf → „Zum Home-Bildschirm“. Danach startet sie wie eine App und funktioniert auch offline. Dafür muss der Ordner `webapp` auf einer https-Seite liegen (z. B. kostenlos über GitHub Pages).

## Auf dem Handy testen (ohne Android Studio / Xcode)

1. Node.js (Version 20 oder neuer) installieren: https://nodejs.org
2. Die App **Expo Go** aus dem Play Store / App Store aufs Handy laden.
3. Im Ordner dieses Projekts:
   ```bash
   npm install
   npx expo start
   ```
4. Den QR-Code mit Expo Go (Android) bzw. der Kamera (iOS) scannen. Handy und PC müssen im selben WLAN sein.

Im Browser: `npx expo start --web`

## Als echte App bauen (APK / App Store)

```bash
npx eas-cli@latest build -p android --profile preview   # APK zum Installieren
npx eas-cli@latest build -p ios                         # braucht einen Apple-Developer-Account
```

## Aufbau

| Pfad | Inhalt |
|---|---|
| `App.tsx` | Einstieg, Navigation zwischen den Screens |
| `src/courses/*.ts` | Lerninhalte pro Sprache – hier neue Lektionen ergänzen |
| `src/types.ts` | Datenformat der Lektionen und Aufgaben |
| `src/screens/` | Start, Lernpfad, Lektion, Ergebnis, Sprachen, Profil |
| `src/components/` | Maskottchen, Icons, Buttons, Code-Anzeige |
| `src/progress.tsx` | XP, Streak, Herzen, gespeicherter Fortschritt |

Eine neue Sprache hinzufügen: Datei in `src/courses/` anlegen (wie `python.ts`), in `src/courses/index.ts` eintragen, in `src/types.ts` die `CourseId` erweitern und in `src/components/Icons.tsx` ein Abzeichen zeichnen.
