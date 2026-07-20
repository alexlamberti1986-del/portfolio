# CLEANUP-AUDIT — alexlamberti.ch / Portfolio-App

**Branch:** `cleanup-live-parity`  
**Datum:** 2026-07-19  
**Scope:** Lokal only — kein Production Deploy, kein Push ohne Freigabe

## Phase 1 — Live-Referenz (Kurz)

Live unter https://www.alexlamberti.ch/ bestätigt als funktionale/visuelle Referenz:

- Shell mit Welten MULTIVERSUM / NEXORA / PROFESSIONAL / FREIRAUM
- Header: Name, E-Mail, Telefon, Menü
- Weltennavigation, Kapitel (Projekte, Leistungen, Über mich, Kontakt, Offerte)
- Sprachen DE / EN / FR / IT, Effekte Ein/Aus, Audio
- Galaxy Walk (Multiversum), Weltenwechsel-Animationen
- Service-/Legal-Seiten: Webdesign, Digital Marketing, Digitale Strategie, Impressum, Datenschutz
- Responsive: Mobile-Menü, Tablet, Desktop, grosse Displays

Lokale Vorschau nach Cleanup: `http://localhost:4173/` — Shell und Multiversum-Hero laden; Welten-Switcher und Sprachen sichtbar.

## Phase 2 — Deployment-Aufbau (Ergebnis)

| Frage | Ergebnis |
|--------|----------|
| Vercel Root Directory | **`Portfolio-App/app`** (inhaltlich durch `app/vercel.json` und Deploy-Struktur belegt) |
| Ist der Hauptordner Teil des Vercel Deploys? | **Nein** — Electron/`package.json` am Root war Desktop-App, nicht Vercel |
| Einstieg früher | Rewrites auf `/3-Welten-Master-iframe.html` |
| Einstieg nach Cleanup | Rewrites auf **`/index.html`** |
| `app/index.html` | **Kanonischer Shell-Einstieg** |
| `app/3-Welten-Master-iframe.html` | Nur noch Redirect-Stub → `/` (+ permanenter Redirect in `vercel.json`) |
| Externe Root-Setting | Nicht im Repo; Deploy-Root ist faktisch `app/` |
| GitHub Workflows | Keine produktiven Deploy-Workflows für diese Site im Cleanup-Scope gefunden |

## Grössen

| | Vorher (Baseline) | Nachher |
|--|-------------------|---------|
| `Portfolio-App` Dateien | 351 | 324 (inkl. `docs-archive/`) |
| `Portfolio-App` Grösse | ~219.21 MB | ~207.3 MB (`217 373 780` Bytes) |
| `app/` Dateien (Deploy-Root) | 335 | **311** |
| `app/` Grösse | ~219.19 MB | ~207.2 MB (`217 299 725` Bytes) |

Ersparnis Deploy-Root: **24 Dateien**, ca. **12 MB**.

## Was bewusst NICHT konsolidiert wurde (Phase 9–10)

Aktive Override-Ketten (`welten-final*`, `cleanup`, `premium-review`, `perf-sprint*`, `ux-refine`, `visual-sprint2`, mobile/large/tv CSS/JS) sind **live eingebunden**. Eine Grosskonsolidierung oder Inline-Auslagerung der Welt-HTML (~6–9k Zeilen) wurde **nicht** durchgeführt — Paritätsrisiko zu hoch. Dokumentiert in `KEPT-LEGACY-FILES.md`.

## Profilbilder / Kapitelbilder (Phase 8 Teil)

Lange Profilnamen und parallele Ordner `images/chapters` + `images/4welten-preview` sind **referenziert** → belassen, Umbenennung auf spätere Freigabe verschoben.

## Tests (lokal)

| Check | Ergebnis |
|--------|----------|
| `/` → Shell 200 | OK |
| `/nexora` Rewrite → Shell 200 | OK |
| `og-image.jpg` 200 | OK |
| `og-image.png` 404 (entfernt) | erwartet |
| Browser Snapshot Multiversum | Header, Welten, Sprachen, Effekte, Galaxy-Hero sichtbar |
| Console/Network Vollsuite | Teilweise; manuelle Freigabe-Tests empfohlen |
| Alle Viewport-Screenshots Vorher/Nachher | Nicht vollautomatisiert in dieser Session — lokal manuell nachziehen |

## Bestätigung Funktionskern (lokal, Spot-Check)

- Vier Welten in der Shell-Navigation vorhanden
- Sprachen DE/EN/FR/IT vorhanden
- Effekte-Toggle vorhanden
- Multiversum-Startansicht lädt

**Warten auf ausdrückliche Freigabe** vor Merge/Live.
