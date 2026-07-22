# Entwicklungs-Workflow (ab 22.07.2026)

Diese Webseite ist **statisch** (HTML/CSS/JS). Produktion läuft über **Vercel** mit Root `app/`.

## Stabile Referenz

| Element | Wert |
|--------|------|
| Git-Tag | `stable-reference-2026-07-22` |
| Commit | `Stable Website Reference - 22.07.2026` |
| Live-Branch | `main` |

Zurück zur stabilen Version:

```bash
git fetch --tags
git checkout stable-reference-2026-07-22
```

## Branch-Struktur

| Branch | Zweck |
|--------|--------|
| `main` | **Live-Produktion** — nur nach ausdrücklicher Freigabe |
| `development` | Sammel-Branch für lokale Tests |
| `feature/*` | Einzelne Änderungen (z. B. `feature/responsive-optimierung`) |

Neue Arbeit **immer** vom stabilen Stand oder von `development` starten:

```bash
git checkout development
git pull origin development
git checkout -b feature/mein-thema
```

## Ablauf für neue Änderungen

1. Feature-Branch erstellen (von `development` oder stabilem Tag)
2. Änderung lokal umsetzen
3. Lokal starten und prüfen (`npm run serve` → http://localhost:4173)
4. Responsiveness und Unterseiten testen
5. Branch auf GitHub pushen → **Vercel Preview-Deployment** (automatisch für Nicht-`main`-Branches)
6. Preview-URL prüfen
7. **Erst nach deiner Freigabe:** Merge in `main`
8. **Erst danach** geht die Änderung live auf alexlamberti.ch

## Wichtige Regeln

- **Niemals** direkt auf `main` pushen ohne Freigabe
- Keine Secrets in Git (nur `.env.example` als Vorlage)
- Cache-Bust bei Asset-Änderungen (`?v=YYYYMMDD…` in HTML-Links)
- Temporäre Dateien (`_*.txt`, `_*.json` im Repo-Root) nicht committen

## Lokale Befehle

```bash
cd Portfolio-App
npm run serve
```

Es gibt **keinen separaten Produktions-Build** — Vercel liefert die Dateien aus `app/` direkt aus.

## Vercel Preview

- Production: Branch `main` → alexlamberti.ch
- Preview: jeder andere Branch / Pull Request → eigene `*.vercel.app`-URL
- Vercel Root Directory: `app`
