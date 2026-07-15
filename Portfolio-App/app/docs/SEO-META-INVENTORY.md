# SEO-META-INVENTORY — alexlamberti.ch

Inventory of **existing** title/description sources. Runtime values come from `assets/welten-shell-seo.js` + `assets/welten-translations.js` (`seo.*`). Base URL: `https://www.alexlamberti.ch`.

---

## A. Shell static HTML (`3-Welten-Master-iframe.html` / `index.html`)

| Field | DE (static) |
| --- | --- |
| title | Alex Lamberti Multiversum für digitale Welten |
| description | Entdecke das Multiversum von Alex Lamberti mit NEXORA, PROFESSIONAL und FREIRAUM. Digital Marketing, Webdesign und Strategie in vier digitalen Welten. |
| og:description | Same as meta description (vier Welten) — Phase 2 aligned |
| canonical | https://www.alexlamberti.ch/ |
| robots | (unset) |
| og:image | https://www.alexlamberti.ch/assets/og-image.jpg |
| early boot | `assets/welten-shell-seo-boot.js` sets title/description/canonical/OG + SEO H1 from pathname before deferred scripts |

---

## B. Shell runtime — world homes (`WeltenShellSEO.WORLD_HOME`)

| World key | Title DE | Description DE |
| --- | --- | --- |
| general | Alex Lamberti Multiversum für digitale Welten | Entdecke… vier digitalen Welten. |
| nexora | NEXORA \| Alex Lamberti · Digitale Zukunftswelt | NEXORA von Alex Lamberti: digitale Zukunft, Systeme, Visionen… |
| vertex | PROFESSIONAL \| Alex Lamberti · Projekte & Zusammenarbeit | PROFESSIONAL von Alex Lamberti: Projekte, Referenzen, Leistungen… |
| freiraum | FREIRAUM \| Alex Lamberti · Kreativität & Experimente | FREIRAUM von Alex Lamberti: persönliche Ideen, kreative Experimente… |

EN packs exist in the same object for each world.

---

## C. Shell runtime — chapter meta (`welten-translations.js` → `seo`)

### Deutsch

| Chapter | Title | Description |
| --- | --- | --- |
| home | Alex Lamberti Multiversum für digitale Welten | …vier digitalen Welten. |
| projects | Projekte \| Alex Lamberti · Websites, Leadformulare & Visitenkarten | Ausgewählte Projekte… |
| leistungen | Leistungen \| Alex Lamberti · Branding, Webdesign & Marketing | Leistungen von Alex Lamberti… |
| about | Über mich \| Alex Lamberti · Digital Marketing Spezialist | Wer ist Alex Lamberti?… |
| contact | Kontakt \| Alex Lamberti · Telefon, E-Mail & Standort | …079 667 82 11… Full-Reuenthal. |
| offerte | Offerte \| Alex Lamberti · Leistungen & Preisanfrage | Offerte anfragen… |

World-scoped chapters (non-home): title/description = `{WORLD_LABEL} · {chapter title}` / `{label}: {chapter description}`.

### English / FR / IT

Parallel `seo` blocks exist in `welten-translations.js` (EN full; FR/IT present). Shell `worldHomeMeta` uses DE or EN only for world homes (`lang === "de" ? "de" : "en"`).

---

## D. Iframe document static head (secondary)

| File | Title (after Phase 1 hygiene) | Description |
| --- | --- | --- |
| MULTIVERSUM.html | Alex Lamberti Multiversum für digitale Welten | Multiversum + NEXORA/PROFESSIONAL/FREIRAUM… |
| NEXORA.html | Alex Lamberti \| NEXORA · Virtuelle Welt | NEXORA · Zukunftswelt… |
| PROFESSIONAL.html | Alex Lamberti \| PROFESSIONAL · Projekte & Zusammenarbeit | PROFESSIONAL-specific (was BUSINESS + generic) |
| FREIRAUM.html | Alex Lamberti \| FREIRAUM · Kreative Welt | FREIRAUM-specific (was generic duplicate) |

Visible home H1s remain world-specific; FREIRAUM H1 encoding fixed in Phase 2 (was C-20).

---

## E. robots / sitemap

| Asset | Points to |
| --- | --- |
| robots.txt Sitemap | https://www.alexlamberti.ch/sitemap.xml |
| sitemap locs | www.alexlamberti.ch (expanded Phase 1 — see IMPLEMENTATION-LOG) |

---

## F. Structured data summary

| Source | Types | Notes |
| --- | --- | --- |
| welten-shell-seo.js | Person, WebSite | phone + email + jobTitle |
| welten-seo.js | Person, Organization, WebSite, LocalBusiness | address + geo; `sameAs: []` |

Do not expand schema fields without CONTENT-TODO confirmation.
