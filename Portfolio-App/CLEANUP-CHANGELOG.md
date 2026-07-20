# CLEANUP-CHANGELOG — cleanup-live-parity

## Zusammenfassung

Sichere Bereinigung des lokalen Projekts auf Branch `cleanup-live-parity` ohne Production-Deploy. Fokus: Deploy-Root `app/`, kanonischer Shell-Einstieg, Electron/Test/Orphan-Removals. Keine CSS/JS-Grosskonsolidierung, keine Inhalts-/Design-Änderungen.

## Projektgrösse

| | Vorher | Nachher |
|--|--------|---------|
| Portfolio-App Dateien | 351 | 324 |
| Portfolio-App Bytes | 229 863 187 (~219.21 MB) | 217 373 780 (~207.3 MB) |
| app/ Dateien | 335 | 311 |
| app/ Bytes | 229 834 408 (~219.19 MB) | 217 299 725 (~207.2 MB) |

## Entfernte Hauptgruppen

- Electron Desktop-App (main/preload/builder/build/docs)
- Einmalige Root-`scripts/`
- Interne Docs/Tests aus `app/` → `docs-archive/`
- Orphan OG-/Doppelendungs-Bilder, unreferenzierte CSS/JS
- Alte Audio-Dateien mit Leerzeichen (nach Pfad-Update auf `audio/worlds/`)

## Konsolidierung CSS/JS

- **Nicht** zusammengeführt (Paritätsrisiko). Siehe `KEPT-LEGACY-FILES.md`.

## Geänderte HTML / Config

- `app/vercel.json` — Rewrites → `/index.html`
- `app/3-Welten-Master-iframe.html` — Redirect-Stub
- `app/assets/welten-world-switch-preview.js` — Switch-Sound → `worlds/MULTIVERSUM.mp3`
- `app/assets/welten-world-audio-test.js` — Regex angepasst
- `Portfolio-App/package.json` — nur `serve`
- `Portfolio-App/README.md` — neu kurz

## Vercel

- Rewrites und Redirects für Hauptrouten beibehalten
- Einstieg vereinheitlicht auf `index.html`
- Cache-Header unverändert belassen (immutable Medien beachten)

## Getestete Routen / Checks (lokal)

- `/`, `/nexora` (Rewrite)
- `/assets/og-image.jpg` 200, `.png` 404
- Spot-Check UI: Multiversum, Welten-Nav, Sprachen, Effekte

## Bekannte verbleibende Altlasten

- Override-CSS/JS-Ketten
- Grosse Inline-Welt-HTML
- Lange Profilbild-Dateinamen / mögliche Duplikate
- Gemischte `?v=`-Cache-Parameter
- Kapitel- vs. Preview-Bildordner

## Ergebnis Konsole / Netzwerk

- Spot-Check ohne fehlendes `og-image.jpg`
- Vollständige Console-/404-Suite und Viewport-Screenshot-Vergleich: **noch manuell empfohlen**

## Funktionsbestätigung (Spot-Check)

- Vier Welten in Navigation: ja
- Sprachen / Effekte Controls: ja
- Musik: Pfad korrigiert; manuell Ein/Aus prüfen
- Kein Live-Deploy ausgeführt
