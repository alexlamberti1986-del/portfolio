# KORREKTUR-BERICHT — alexlamberti.ch Bereinigung

**Datum:** 31. Mai 2026

---

## 1. Kontaktseite

**Geändert:**
- Komplett neu als Premium-Layout (`welten-cleanup.js`)
- Hero: Titel „Kontakt“ + Lead-Satz
- Telefon und E-Mail als große klickbare Links (keine Boxen)
- Google Maps responsiv mit Schatten/Radien je Welt
- Abschluss: „Ich freue mich auf deine Anfrage.“
- Kein Formular, keine Social Links

---

## 2. NEXORA Projekte

**Korrigiert:**
- Orbit-Navigation von 10 alten Punkten auf 5 Hauptkapitel reduziert
- `navigateTo()` löst jetzt `welten-chapter-change` und `welten-init-projects-accordion` aus
- Alias-Mapping für Legacy-IDs (profile → leistungen, etc.)
- CSS: `pointer-events: auto` auf Projekte-Accordion und Karten
- Accordion-Init wird bei Kapitelwechsel zu Projekte erzwungen

**Ergebnis:** Gleiche Bedienlogik wie Professional/Freiraum — Kategorien öffnen, Karten klickbar.

---

## 3. Entfernte alte Buttons (NEXORA Hero)

Entfernt aus Orbit-Navigation:
- Profil, Werte, Stärken, Erfahrung, Arbeit, Motivation, FAQ

**Verbleibend (5 Punkte):**
Home · Projekte · Leistungen · Über mich · Kontakt

---

## 4. Navigation angepasst

| System | Status |
|--------|--------|
| Hauptmenü | 5 Kapitel, „Über mich“ korrekt |
| Seitliche Navigation | 5 Kapitel |
| NEXORA Orbit (Desktop/Mobile) | 5 Kapitel |
| DNA-Ring | 5 Kapitel |
| Mobile-Menü | 5 Kapitel + Tel/E-Mail |

---

## 5. Footer

**Entscheidung:** Footer komplett entfernt (bevorzugte Variante).

- `injectFooter()` deaktiviert in `welten-ux-refine.js`
- CSS blendet bestehende Footer aus
- Kontakt: Header + Mobile-Menü + Kontaktseite

---

## 6. Leistungstexte ergänzt

6 Leistungen professionell ausgearbeitet:
- Branding, Webdesign, Webseiten-Optimierung, Marketing, Strategie, Content

Jeweils: Kurzbeschreibung, Kundennutzen, 5 Bulletpoints, Ergebnis-Zeile.

---

## 7. FAQ eingefügt

- Auf Seite **Leistungen** als Accordion
- 7 Fragen (Projektablauf, Zielgruppe, Dauer, Optimierung, Mobile, SEO, Kontakt)
- FAQPage JSON-LD Schema für SEO
- Barrierearm: `aria-expanded`, `aria-controls`

---

## 8. Mobile-/Tablet-Fixes

- Menü-Links: min. 48px Touch-Höhe, keine Textüberläufe
- NEXORA-Orbit-Buttons: responsive Schrift, Ellipsis
- CTA-Buttons: flex-wrap, min-height 48px
- Kontakt-Links: skalierte Schriftgrößen
- Kein horizontales Scrollen (`overflow-x: clip`)

---

## 9. SEO-Maßnahmen

- Home-Story-H2: „Digitale Marken, Webseiten und Erlebnisse mit Charakter“
- FAQ Schema (FAQPage)
- Bestehende Meta, OG, Canonical, Sitemap unverändert aktiv
- Leistungen: H2/H3-Struktur durch reiche Karten
- Kontakt: klare H2-Hierarchie

---

## Neue Dateien

- `assets/welten-cleanup.js` / `.css`
- `scripts/add-cleanup-assets.ps1`
- `KORREKTUR-BERICHT.md`
