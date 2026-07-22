# Lokale Design-Testversion (World Templates)

**Branch:** `local/world-design-test`  
**Nicht pushen / nicht deployen** — nur lokal testen.

## Start

```bash
cd Portfolio-App
npm run serve
```

## Test-URLs

| Seite | URL |
|-------|-----|
| Übersicht | http://localhost:4173/design-test/ |
| MULTIVERSUM | http://localhost:4173/design-test/multiversum |
| NEXORA | http://localhost:4173/design-test/nexora |
| PROFESSIONAL | http://localhost:4173/design-test/professional |
| FREIRAUM | http://localhost:4173/design-test/freiraum |

Produktive lokale Vergleichsroute (unverändert): http://localhost:4173/

## Hinweise

- **Master Kit** (Referenz): `reference-templates/alex-lamberti-worlds/Master_Kit/`  
  (Header/Footer/Seiten-JSON, Screenshots, Assets — **kein** WordPress/Elementor-Import)
- Design-Tokens in `app/assets/design-test/world-*.css` folgen dem Kit (Farben, Radii, Header/Footer-Charakter).
- Styles werden nur im lokalen Design-Test-Modus (`/design-test/...`) injiziert.
- Live-Seite `alexlamberti.ch` bleibt unverändert (kein Push, kein Vercel-Deploy von diesem Branch).
