# CONTENT-TODOS — alexlamberti.ch

Central backlog for **real data / copy decisions**. Do not invent missing facts in code until the owner confirms.

Status: `open` | `confirmed` | `wontfix`

---

## Identity & contact (verify before schema / footer finalization)

| ID | Item | Current in code | Owner action | Status |
| --- | --- | --- | --- | --- |
| C-01 | Phone | `+41796678211` / displayed `079 667 82 11` in shell, worlds, translations, schema | Confirm public phone still correct | open |
| C-02 | Email | `alex.lamberti@hotmail.ch` | Confirm public email (hotmail vs business domain?) | open |
| C-03 | Postal address | `Schulweg 603`, `5324 Full-Reuenthal`, CH — in `welten-seo.js` LocalBusiness | Confirm publish address on site + schema | open |
| C-04 | Geo coordinates | `47.599`, `8.204` in LocalBusiness | Confirm or replace with accurate geo | open |
| C-05 | jobTitle | `Digital Marketing Spezialist` in JSON-LD | Confirm preferred DE/EN title(s) | open |
| C-06 | Organization name | “Alex Lamberti” / Multiversum vs personal brand | Confirm legal trade name if any | open |
| C-07 | Social / sameAs | `sameAs: []` empty | Provide LinkedIn, Instagram, etc. URLs or mark won’t publish | open |

---

## Branding leftovers / conversion

| ID | Item | Finding | Owner action | Status |
| --- | --- | --- | --- | --- |
| C-10 | Offerte form brand | Still “Digital Plus” / `digitalplus-gmbh-leadformular` | Confirm rebrand to Alex Lamberti wording | open |
| C-11 | Offerte submit | `dataset.submissionMode='local-only'` — **no real send**; success UI now honest (local-only + mailto). Still needs real endpoint | Decide endpoint (email API, Formspree, custom) + privacy | open — deferred |
| C-12 | Guide prices in form | Copied Digital Plus price logic | Confirm which prices (if any) may appear publicly | open |
| C-13 | Success copy | Honest local-only / mailto (was “Digital Plus meldet sich…”) | Replace again once brand + endpoint confirmed | partially fixed |
| C-14 | Analytics vendor | None installed | Choose tool + consent copy (CH/DSG) | open |

---

## Copy quality (exists — needs cleanup, not invention)

| ID | Item | Finding | Status |
| --- | --- | --- | --- |
| C-20 | FREIRAUM H1 / body encoding | Mojibake fixed Phase 2 (`Kreativität`, `Persönlichkeit`, `Atmosphäre`, …) | done |
| C-21 | PROFESSIONAL body encoding | Mojibake fixed Phase 2 (`verlässlich`, `glaubwürdig`, `ästhetisch`, `überzeugen`, `Kundenbedürfnisse`, …) | done |
| C-22 | PROFESSIONAL world-intro “BUSINESS” | UI kicker + related CSS/JS now PROFESSIONAL | done |
| C-23 | Shell SEO “drei Welten” vs “vier Welten” | Aligned to vier/four/quatre/quattro in shell static + translations + SEO fallbacks | done |
| C-24 | Testimonials / logos / stats | Do not invent — list only if owner supplies real quotes | open |

---

## SEO / IA content decisions (later phases)

| ID | Item | Notes | Status |
| --- | --- | --- | --- |
| C-30 | hreflang strategy | FR/IT UI exist; no hreflang links | open |
| C-31 | World-scoped chapter uniqueness | Phase 4: world-specific Leistungen/Projekte/Kontakt packs in `welten-brief-content.js`; about world notes retained | done |
| C-32 | Indexing policy for world × chapter URLs | All rewritten; sitemap expanded Phase 1 — confirm intended index set | open |
| C-33 | Privacy / Impressum pages | Minimal `/impressum` + `/datenschutz` stubs live (email only). Full CH legal block waits on C-01/C-03 | partial |
| C-34 | Dedicated Leistungs-URLs §8 | `/webdesign` `/digital-marketing` `/digitale-strategie` live Phase 4 | done |

---

## Confirmed (fill when owner answers)

_None yet in Phase 1._
