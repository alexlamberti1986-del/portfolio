# Alex Lamberti Portfolio — Desktop App

Premium Electron desktop version of the 3-Welten portfolio (NEXORA · PROFESSIONAL · FREIRAUM).

## Quick start

```bash
cd Portfolio-App
npm install
npm start
```

## Build Windows executable

```bash
npm run build:all
```

Outputs in `dist/`:

- `AlexLamberti-Portfolio-Portable.exe` — portable, no installer
- `AlexLamberti-Portfolio-Setup.exe` — NSIS installer

## Structure

- `main.js` — Electron main process (window, security, GPU)
- `preload.js` — safe bridge to renderer
- `app/index.html` — shell (world bar, lazy iframes, audio toggle)
- `app/shell.js` — world switching logic
- `app/NEXORA.html`, `PROFESSIONAL.html`, `FREIRAUM.html`
- `app/assets/` — charts, images, audio

## Development vs production

- **Dev** (`npm start`, unpackaged): DevTools allowed
- **Production build**: DevTools, reload shortcuts, and context menu disabled

## Icons

Add `build/icon.ico` and `build/icon.icns` (see `build/ICONS.txt`).

## Audio

Copy MP3 files to `app/assets/audio/` (see `app/assets/audio/README.txt`).
