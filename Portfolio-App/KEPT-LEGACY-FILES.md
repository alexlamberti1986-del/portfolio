# KEPT-LEGACY-FILES — cleanup-live-parity

Dateien, die **alt wirken**, aber weiterhin produktiv (oder bewusst riskant zu ändern) sind.

## Aktive CSS/JS-Override-Ketten

Diese Dateien sind in den Welt-HTML bzw. der Shell **direkt eingebunden**. Nicht löschen, bis Regel-für-Regel konsolidiert und visuell gegen Live verglichen wurde:

- `welten-final.css` / `.js`, `welten-final-restore.css` / `.js`
- `welten-cleanup.css` / `.js`
- `welten-premium-review.css` / `.js`
- `welten-perf-sprint3/4.css` / `.js`
- `welten-ux-refine.css` / `.js`
- `welten-visual-sprint2.css` / `.js`
- `welten-mobile-overrides.css`, `welten-unified-responsive.css`
- `welten-large-display.css`, `welten-tv-desktop-parity.css`
- Desktop-Stage: `welten-desktop-stage.css` / `.js` (Desktop ≥1025px)

**Später:** schrittweise in `shared` / `shell` / `world-*` / `responsive` überführen (Phase 9), ohne visuelle Diffs.

## Grosse Welt-HTML mit Inline-Code

| Datei | Warum behalten |
|-------|----------------|
| `MULTIVERSUM.html`, `NEXORA.html`, `PROFESSIONAL.html`, `FREIRAUM.html` | Iframe-Welten der Live-Shell; grosse Inline-Blöcke steuern Layout/Animationen. Auslagerung = Phase 10, nur mit Paritäts-Tests. |

## Profilbilder mit langen / Unicode-Namen

Konfigurationen (u. a. `welten-preview-images.js`, `portfolio-images.js`, `welten-multiversum-master.js`, Multiversum-HTML) referenzieren Namen wie:

- `… PROFILBILD für HOME und Kontakt.png`
- `FREIRAUM PROFILBILD für HOME und Kontakt(1).png`

Zusätzlich existieren kurze `profile.png` pro Weltordner unter `4welten-preview/`.

**Empfehlung später:** eine kanonische Datei pro Welt (`profile-*.webp`), alle Refs umstellen, Hashes vergleichen, dann Duplikate entfernen.

## Parallele Bildordner

| Ordner | Abhängigkeit |
|--------|----------------|
| `assets/images/chapters/` | `welten-chapter-visuals.js` |
| `assets/images/4welten-preview/` | Preview, Portfolio, Form-Service, Multiversum-Collage |

Beide werden für unterschiedliche Features genutzt — kein pauschales Zusammenlegen ohne Ref-Update + Kapitel-/Preview-Test.

## QR PNG + WebP

Beide Formate belassen, bis Lesbarkeit von QR nur-WebP freigegeben ist.

## Cache-Query-Mix (`?v=…`)

Viele unterschiedliche Versionsstrings bleiben vorerst. Einheitliche Release-Kennung erst nach gezieltem Asset-Bump (immutable Cache in `vercel.json` beachten).

## Redirect-Stub

`3-Welten-Master-iframe.html` bleibt als Stub + `vercel.json`-Redirect für alte Bookmarks/Indexierung.
