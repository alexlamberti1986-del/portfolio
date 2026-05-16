# Build-Anleitung (Windows)

## Voraussetzung

Node.js LTS installieren (inkl. npm): https://nodejs.org/

Prüfen:

```powershell
node -v
npm -v
```

## App lokal starten

```powershell
cd "C:\Users\alexl\Desktop\Dateien für Cursor\Portfolio-App"
npm install
npm start
```

## .exe bauen

```powershell
npm run build:all
```

Ergebnis in `dist\`:

| Datei | Typ |
|-------|-----|
| `AlexLamberti-Portfolio-Portable.exe` | Portable (ohne Installation) |
| `AlexLamberti-Portfolio-Setup.exe` | Installer (NSIS) |

## Welten aktualisieren

Nach Änderungen an `NEXORA.html`, `PROFESSIONAL.html`, `FREIRAUM.html` oder `assets\` im übergeordneten Ordner:

```powershell
Copy-Item "..\NEXORA.html","..\PROFESSIONAL.html","..\FREIRAUM.html" -Destination ".\app\" -Force
Copy-Item "..\assets\*" -Destination ".\app\assets\" -Recurse -Force
```

Dann erneut `npm run build:all`.

## Audio

MP3-Dateien nach `app\assets\audio\`:

- `switch-nexora.mp3`
- `switch-professional.mp3`
- `switch-freiraum.mp3`

## Icon

`build\icon.ico` und `build\icon.icns` hinzufügen, dann in `electron-builder.json` unter `win.icon` / `mac.icon` eintragen.
