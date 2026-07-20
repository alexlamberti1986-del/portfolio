# Lokaler Test — Load / Header / Galaxy / Matrix-Breite

Branch: `fix/load-header-galaxy-width-local`  
**Kein Production-Deploy.**

## Start

```powershell
cd "c:\Users\alexl\Desktop\Dateien für Cursor\Portfolio-App\app"
# Mit gebündeltem Node oder installiertem serve:
npx --yes serve -l 4173
```

Vorschau: http://localhost:4173/

## Erwartet
- Nur ein Header (Kontakt + Weltenzeile)
- Galaxy: voller Hero-Bereich, Ladehinweis zentriert, kein 300×150-Rahmen
- Nexora-Wechsel: Matrix füllt die Overlay-Breite komplett
