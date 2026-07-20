# REMOVED-FILES — cleanup-live-parity

Entfernte oder aus dem Deploy-Root verschobene Dateien. Prüfung: Referenz-Scan (`docs-archive/CLEANUP-SCAN-RESULTS.txt`) + Grep auf `app/`.

## Electron / Desktop (Root)

| Pfad | Grund | Prüfung | Ersatz |
|------|--------|---------|--------|
| `Portfolio-App/main.js` | Kein Vercel-/Web-Bezug | Nur Electron-Entry | — |
| `Portfolio-App/preload.js` | Electron Bridge | Nicht von `app/` referenziert | — |
| `Portfolio-App/electron-builder.json` | Desktop-Build | Nicht Vercel | — |
| `Portfolio-App/BUILD.md` | Electron-Build-Doku | — | `README.md` |
| `Portfolio-App/build/` | Icons/Build-Hinweise Electron | — | — |
| Electron-Deps/Scripts in `package.json` | Desktop-App | Vercel nutzt `app/` | `npm run serve` |

## Einmalige Root-Scripts

| Pfad | Grund | Prüfung |
|------|--------|---------|
| `scripts/capture-mobile-hero-screenshots.mjs` | Einmalig / nicht in package.json | Kein Deploy-Aufruf |
| `scripts/extract-nexora-images.mjs` | Einmalig | Alte Extraktion |
| `scripts/extract-portfolio-images.mjs` | Einmalig | Alte Extraktion |
| `scripts/finalize-pass.mjs` | Einmalig | Abgeschlossener Pass |
| `scripts/generate-favicons.ps1` | Einmalig | Favicons vorhanden |
| `scripts/patch-projects-accordion.ps1` | Einmal-Patch | — |
| `scripts/sync-app-from-source.ps1` | Alter Sync | Quellordner-Workflow obsolet |
| `scripts/sync-performance-pass.mjs` | Einmalig | — |

(`cleanup-scan.ps1` → `docs-archive/`)

## Aus Deploy-Root verschoben (`docs-archive/`)

| Früherer Pfad | Grund |
|---------------|--------|
| `app/docs/AUDIT-*.md`, `CONTENT-TODOS.md`, `IMPLEMENTATION-LOG.md`, `SEO-META-INVENTORY.md` | Interne Audits, nicht öffentlich nötig |
| `app/DESKTOP-STAGE-SCALE-TEST.md` | Testbericht |
| `app/LOAD-FIX-LOCAL-TEST.md` | Testbericht |
| `app/CLEANUP-BASELINE.txt`, `CLEANUP-SCAN-RESULTS.txt` | Cleanup-Artefakte |
| Leerer `app/scripts/` | Leer |

## Orphan Media / Assets

| Pfad | Größe (ca.) | Grund | Prüfung | Ersatz |
|------|-------------|--------|---------|--------|
| `app/assets/og-image.png` | — | Ungenutzt | Meta nutzt `.jpg` | `og-image.jpg` |
| `app/assets/og-image.webp` | — | Ungenutzt | Keine Refs | `og-image.jpg` |
| `app/assets/freiraum-art.png.png` | — | Doppelte Endung, unreferenziert | Scan | — |
| `app/assets/nexora-ai.png.png` | — | unreferenziert | Scan | — |
| `app/assets/professional-alex.jpg.png` | — | unreferenziert | Scan | — |
| `app/assets/alex-business.webp.webp` | — | unreferenziert | Scan | — |
| `app/assets/DNA Strang beispiel.webp` | — | unreferenziert | Scan | — |
| `app/assets/audio/Multiversum sound.mp3` | = worlds Hash | Duplikat | Hash = `worlds/MULTIVERSUM.mp3`; Pfad in Switch-JS aktualisiert | `audio/worlds/MULTIVERSUM.mp3` |
| `app/assets/audio/Freiraum sound.mp3` | — | Nur README | Keine Code-Refs | `worlds/FREIRAUM.mp3` |
| `app/assets/audio/Nexora sound.mp3` | — | Nur README | Keine Code-Refs | `worlds/NEXORA.mp3` |
| `app/assets/audio/Professional sound.mp3` | — | Nur README | Keine Code-Refs | `worlds/PROFESSIONAL.mp3` |
| `app/assets/audio/README.txt` | — | Veraltet | — | — |

## Orphan CSS/JS

| Pfad | Grund | Prüfung | Ersatz |
|------|--------|---------|--------|
| `welten-multiversum-preview.css` | Nicht gelinkt | Scan | neuere Preview-CSS |
| `welten-multiversum-scene-config.js` | Nicht gelinkt | Scan | `…-scene-config-v4.js` |
| `welten-multiversum-transition.js` | Nicht gelinkt | Scan | aktuelle Transition/Switch-JS |
| `welten-nexora-touch.css` | Nicht gelinkt | Scan | — |
| `welten-live-shell-responsive.css` | Nicht gelinkt | Scan | aktuelle responsive CSS |

## Shell-Duplikat

| Pfad | Änderung |
|------|----------|
| `app/3-Welten-Master-iframe.html` | Inhalt ersetzt durch Redirect-Stub (Datei behalten wegen Legacy-URLs); Rewrites → `index.html` |
