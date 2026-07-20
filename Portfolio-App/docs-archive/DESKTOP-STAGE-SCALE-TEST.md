# Desktop Stage — Testnotiz

Desktop-Grenze: `min-width: 1025px` (Mobile/Tablet unverändert).

## Skalierung
- `scale = viewportHeight / 1080`
- `stageWidth = viewportWidth / scale` (bei Ultrawide breiter als 1920)
- Ergebnis: Viewport voll ausgefüllt, keine leeren Seitenränder
- Einheitliches `transform: scale()` — keine Verzerrung

## Galaxy / Offerte
- Galaxy respektiert `desktop-stage-active` und Hard-Hide bei Weltwechsel
- Offerte liest `?world=` und synct per `alx-preview-sync`
