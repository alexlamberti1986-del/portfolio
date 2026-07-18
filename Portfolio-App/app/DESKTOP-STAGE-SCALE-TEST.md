# Desktop Stage Scale — lokaler Test (Branch test/desktop-stage-scale)

Keine Live-Deployment. Branch nicht mergen/pushen ohne Freigabe.

## Start lokal

```powershell
cd "c:\Users\alexl\Desktop\Dateien für Cursor\Portfolio-App\app"
npx --yes serve -l 4173
```

Dann öffnen: http://localhost:4173/

DevTools → Console: `document.documentElement.dataset.desktopScale` und Klasse `desktop-stage-active`.

## Erwartete Skalen (Referenz 1920×1080)

| CSS-Viewport | scale ≈ |
|---|---|
| 1920×1080 | 1.00 |
| 1600×900 | 0.833 |
| 1536×864 | 0.80 |
| 1440×900 | 0.75 |
| 1366×768 | 0.711 |
| 1280×800 | 0.667 |
| 1280×720 | 0.667 |
| 2560×1440 | 1.333 |
| 3440×1440 | 1.333 |
| 3840×2160 | 2.00 |

Formel: `min(vw/1920, vh/1080)`

DevTools Device Toolbar: CSS-Viewport setzen (nicht Device-Pixel-Ratio verwechseln).

Mobile/Tablet: Breite ≤1024px → keine `desktop-stage-active`, Layout unverändert.
