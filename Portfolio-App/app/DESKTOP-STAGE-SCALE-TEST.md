# Desktop Stage Scale v2 — Testnotiz

Branch-Arbeit vor Live. Desktop-Grenze: `min-width: 1025px`. Referenz: 1920×1080.
Formel: `scale = Math.min(vw/1920, vh/1080)` via `visualViewport`.

## Lokal

```powershell
cd "c:\Users\alexl\Desktop\Dateien für Cursor\Portfolio-App\app"
npx --yes serve -l 4173
```

Console:
- `document.documentElement.dataset.desktopScale`
- `window.__mvDesktopStage.audit()`

Mobile/Tablet: Breite ≤1024 → keine Klasse `desktop-stage-active`.
