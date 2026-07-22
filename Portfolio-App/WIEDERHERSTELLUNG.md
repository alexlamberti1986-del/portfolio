# Wiederherstellung — Alex Lamberti Portfolio (Stand 22.07.2026)

Diese Anleitung beschreibt, wie die Webseite **auf einem neuen Computer** oder **aus dem Backup** vollständig wiederhergestellt und lokal getestet wird.

---

## 1. Voraussetzungen

| Tool | Version / Hinweis |
|------|-------------------|
| **Node.js** | LTS **20.x** oder **22.x** empfohlen ([nodejs.org](https://nodejs.org)) |
| **npm** | Mit Node.js mitgeliefert |
| **Git** | Für Versionskontrolle und GitHub-Anbindung |
| **Optional** | GitHub-Konto, Vercel-Konto für Deployment |

Die Webseite ist **statisch** — es wird **kein** Datenbank-Server benötigt.

---

## 2. Projekt aus ZIP wiederherstellen

1. ZIP-Datei entpacken:
   ```
   alexlamberti-website-stable-reference-2026-07-22.zip
   ```
2. Zielordner (Beispiel):
   ```
   C:\Projekte\alexlamberti-website-stable-reference-2026-07-22
   ```
3. Im entpackten Ordner liegt das Git-Repository mit `Portfolio-App/` als Website-Projekt.

---

## 3. Projekt aus GitHub wiederherstellen

```bash
git clone https://github.com/alexlamberti1986-del/portfolio.git
cd portfolio
git fetch --tags
git checkout stable-reference-2026-07-22
```

Zum Live-Stand auf `main`:

```bash
git checkout main
git pull origin main
```

---

## 4. Installation

```bash
cd Portfolio-App
npm install
```

> Hinweis: `package.json` enthält nur ein Hilfs-Skript (`serve`). Es werden keine schweren Build-Abhängigkeiten benötigt. Falls `npm install` nichts installiert, ist das normal — `npx serve` lädt den Dev-Server bei Bedarf nach.

---

## 5. Lokale Entwicklung starten

```bash
cd Portfolio-App
npm run serve
```

Alternativ:

```bash
npx --yes serve app -l 4173
```

Browser öffnen: **http://localhost:4173**

### Wichtige lokale URLs zum Testen

| URL | Inhalt |
|-----|--------|
| `/` | Multiversum-Shell (Start) |
| `/nexora` | NEXORA-Welt |
| `/professional` | PROFESSIONAL-Welt |
| `/freiraum` | FREIRAUM-Welt |
| `/multiversum` | Multiversum |
| `/impressum` | Impressum |
| `/datenschutz` | Datenschutz |

---

## 6. Produktions-Build

Es gibt **keinen klassischen Build-Schritt** (kein Webpack/Vite-Bundle).  
Produktion = statische Dateien aus `Portfolio-App/app/`.

**Prüfung vor Live-Gang:**

1. Lokalen Server starten (`npm run serve`)
2. Alle Welten und Unterseiten durchklicken
3. Bilder, Videos, Sounds und Schriftarten laden prüfen (DevTools → Network)
4. Responsiveness (Desktop / Tablet / Mobile) prüfen
5. Optional: `LIVE-FILE-MANIFEST.json` als Datei-Inventar nutzen

---

## 7. GitHub-Verbindung

Repository: `https://github.com/alexlamberti1986-del/portfolio.git`

```bash
git remote -v
git remote add origin https://github.com/alexlamberti1986-del/portfolio.git   # falls noch nicht gesetzt
git fetch origin
```

---

## 8. Vercel-Deployment

| Einstellung | Wert |
|-------------|------|
| **Root Directory** | `app` |
| **Production Branch** | `main` |
| **Framework** | Other (Static) |
| **Build Command** | *(leer)* |
| **Output Directory** | *(leer — Root ist bereits `app`)* |

### Preview vor Live

1. Feature-Branch pushen (z. B. `feature/...` oder `development`)
2. Vercel erstellt automatisch eine **Preview-URL**
3. Nach Freigabe: Merge in `main` → Production Deploy auf alexlamberti.ch

Routing/Redirects: `Portfolio-App/app/vercel.json`

---

## 9. Umgebungsvariablen

Für die **aktuelle statische Version** sind **keine** Umgebungsvariablen nötig.

Vorlage für spätere Erweiterungen: `Portfolio-App/.env.example`  
**Niemals** echte Passwörter oder Tokens in Git committen.

---

## 10. Wichtige Asset-Pfade

| Inhalt | Pfad |
|--------|------|
| HTML-Einstieg (Live) | `Portfolio-App/app/index.html` |
| Welten-Seiten | `Portfolio-App/app/MULTIVERSUM.html`, `NEXORA.html`, `PROFESSIONAL.html`, `FREIRAUM.html` |
| CSS / JS | `Portfolio-App/app/assets/` |
| Bilder | `Portfolio-App/app/assets/images/` |
| Videos | `Portfolio-App/app/assets/videos/` |
| Sounds / Audio | `Portfolio-App/app/assets/audio/` |
| Schriftarten | `Portfolio-App/app/assets/` (Font-CSS in `welten-font-system.css`) |
| Favicon | `Portfolio-App/app/assets/favicon/` |
| Rechtliche Seiten | `Portfolio-App/app/impressum.html`, `datenschutz.html`, `agb.html` |
| Routing | `Portfolio-App/app/vercel.json` |
| Übersetzungen | `Portfolio-App/app/assets/welten-translations.js`, `welten-shell-i18n.js` |
| Datei-Inventar | `Portfolio-App/LIVE-FILE-MANIFEST.json` |

---

## 11. Zum stabilen Git-Stand zurückwechseln

```bash
git fetch --tags
git checkout stable-reference-2026-07-22
```

Oder nur ansehen ohne Branch-Wechsel:

```bash
git show stable-reference-2026-07-22
git log stable-reference-2026-07-22 -1
```

---

## 12. Entwicklungs-Workflow (ab Referenzstand)

- **`main`** = Live-Produktion
- **`development`** = Entwicklungs-Branch für lokale Tests
- **`feature/*`** = einzelne Änderungen

Details: `Portfolio-App/DEVELOPMENT-WORKFLOW.md`

---

## 13. Bekannte Hinweise

- **Node.js** muss installiert sein, damit `npm run serve` funktioniert.
- **`node_modules`** ist nicht im Backup enthalten — nach dem Entpacken `npm install` ausführen (optional, da minimal).
- Temporäre Hilfsdateien im Repo-Root (`_*.txt`, `_*.json`) gehören **nicht** zur Webseite.
- Externe Formular-Links (z. B. Offerte) verweisen auf externe URLs und sind absichtlich nicht lokal gehostet.

---

*Erstellt: 22.07.2026 — Stabile Referenz `stable-reference-2026-07-22`*
