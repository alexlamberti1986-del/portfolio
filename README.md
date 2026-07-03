# Alex Lamberti Portfolio — alexlamberti.ch

## Live-Website (Vercel)

Quellcode: **`Portfolio-App/app/`**

| Datei | Zweck |
|---|---|
| `index.html` / `3-Welten-Master-iframe.html` | Shell (Welt-Leiste, Iframes) |
| `MULTIVERSUM.html`, `NEXORA.html`, `PROFESSIONAL.html`, `FREIRAUM.html` | Welten |
| `assets/` | CSS, JS, Bilder, Audio |
| `vercel.json` | Routing & Caching |

Nach Änderungen: in `Portfolio-App/app/` bearbeiten, testen, dann committen & pushen.

## Lokal testen (vor Deploy)

1. **Live-Vorschau:** `Portfolio-App/app/index.html` im Browser öffnen (oder statischen Server in `Portfolio-App/app/`)
2. **Boot/Splash-Test:** `Portfolio-App/app/local-dev-preview.html` (nur Entwicklung, nicht indexieren)

## Desktop-App (optional)

```bash
cd Portfolio-App
npm install
npm start
```

Build: `npm run build:all` → `dist/`
