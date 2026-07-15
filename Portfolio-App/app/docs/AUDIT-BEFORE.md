# AUDIT-BEFORE — alexlamberti.ch (Phase 1 Ist-Stand)

**Audit date:** 2026-07-15  
**Source of truth (brief):** `Vollständiger Optimierungsauftrag für alexlamberti.ch.pdf` (user-provided; analyzed previously — Phase 1 = documentation + foundation)  
**Code root:** `Portfolio-App/app/`  
**Production host:** `https://www.alexlamberti.ch` (canonicals / sitemap / OG use `www`)  
**Deploy:** Vercel → `origin/main` (static files from `Portfolio-App/app/`, config in `vercel.json`)

> **Lighthouse / CWV:** Not executed in this session (no reliable local Lighthouse run against live or production preview). Scores are **TODO — do not invent**. Measure in a follow-up against production or a Vercel preview URL.

---

## 1. Stack

| Layer | Finding |
| --- | --- |
| Framework | **No Next.js / React SPA.** Static HTML + vanilla JS/CSS. Optional Electron packaging exists in parent `Portfolio-App/package.json` (desktop build only; not the live site). |
| Shell | Live entry is `3-Welten-Master-iframe.html` (rewritten from `/` and all clean URLs). Near-duplicate `index.html` mirrors the shell for local/direct open. |
| Worlds | Four iframes: `MULTIVERSUM.html`, `NEXORA.html`, `PROFESSIONAL.html`, `FREIRAUM.html` (lazy `data-lazy-src`, only active world loads on boot). |
| Routing | Client: `assets/welten-shell-router.js` + path rewrites in `vercel.json`. Chapters: home / projekte / leistungen / ueber-mich / kontakt / offerte. World slugs: `/`, `/nexora`, `/professional`, `/freiraum` (+ `/multiversum` alias). |
| i18n | DE / EN / FR / IT via `welten-translations.js` + shell/i18n bridges. SEO meta for FR/IT often falls back toward EN/DE patterns in shell SEO. |
| Analytics | **No** Google Analytics / GTM / Plausible / Hotjar scripts found in shell or world HTML. |
| Backend | None in-repo. Contact = mailto/tel. Offerte form is embedded iframe (`assets/preview/alx-offerte-form-v5.html`) still branded **Digital Plus** with `client_id=digitalplus-gmbh-leadformular` — submission path needs product verification (CONTENT TODO). |

---

## 2. Routes / worlds / chapters currently live

### Clean URLs (Vercel rewrite → shell)

| Path pattern | World | Chapter |
| --- | --- | --- |
| `/` | Multiversum (`general`) | home |
| `/multiversum` | Multiversum | home |
| `/nexora`, `/professional`, `/freiraum` | respective | home |
| `/projekte`, `/leistungen`, `/ueber-mich`, `/kontakt`, `/offerte` | Multiversum default | chapters |
| `/{nexora\|professional\|freiraum}/{projekte\|leistungen\|ueber-mich\|kontakt\|offerte}` | world-scoped chapters | yes |

Legacy redirects: `/home`→`/`, `/projects`→`/projekte`, `/contact`→`/kontakt`, `/about`→`/ueber-mich`, plus several old chapter aliases → `ueber-mich` or `leistungen`.  
Hard HTML filenames redirect: `/3-Welten-Master-iframe.html` → `/` (301).

### Worlds (iframe documents)

| World key | File | Public slug | UI name |
| --- | --- | --- | --- |
| `general` | `MULTIVERSUM.html` | `/` | MULTIVERSUM |
| `nexora` | `NEXORA.html` | `/nexora` | NEXORA |
| `vertex` | `PROFESSIONAL.html` | `/professional` | PROFESSIONAL |
| `freiraum` | `FREIRAUM.html` | `/freiraum` | FREIRAUM |

### Chapters (shared IA)

`home` → home H1 + DNA/nav · `projects` · `leistungen` · `about` · `contact` · `offerte`

---

## 3. Architecture notes (respect recent live work)

Documented constraints from current code (do not regress):

- **Galaxy Walk** only when `(min-width: 1280px) and (min-height: 700px)` — `welten-galaxy-gang-hero.js`.
- World-switch isolation; Multiversum iframe must **not** be blanked on switch (Galaxy Walk reload risk).
- No Multiversum chrome/header flash (`mv-shell-booting`, wait for `mv-hero-ready` / `portfolio-world-ready`).
- Galaxy home nav sits below walk chrome (`al-galaxy-home-chrome`).

---

## 4. Animations / motion

- World-switch effects + FX toggle (`mv-effects-on`, shell “Effekte” button).
- Parallax / video heroes / Multiversum hero boot stack (`welten-multiversum-parallax-*`, `welten-video-hero-*`).
- FREIRAUM brush transition (`welten-world-switch-freiraum-brush-v3.js`).
- Galaxy Gang nested HTML experience (large asset) on Multiversum desktop home.
- `prefers-reduced-motion` respected in multiple CSS/JS governors (`welten-effects-governor.js`, world pages).
- World BGM (`assets/audio/worlds/*.mp3`) gated by effects preference.

---

## 5. Fonts

- Google Fonts (async/print-onload): **Space Grotesk**, **Orbitron**, **Manrope**, **Syne** — shell + Multiversum.
- Token map: `assets/welten-font-system.css` (`--font-main`, `--font-nexora`, etc.).
- Offerte embed loads **Plus Jakarta Sans** separately.
- Fallback stacks still include system-ui / Segoe / Roboto in large inlined world CSS (legacy from monolith HTML).

---

## 6. Images / video / audio

| Type | Location / notes |
| --- | --- |
| OG | `/assets/og-image.jpg` (+ `.webp` / `.png` variants present) |
| Hero video | `assets/videos/{multiversum,nexora,professional,freiraum}-hero.mp4` + posters |
| Portraits / chapter art | `assets/images/4welten-preview/`, `assets/images/chapters/` |
| Multiversum V4 art | `assets/multiversum-v4/`, parallax orbs |
| Galaxy | `assets/galaxy-gang/alexlamberti-galaxy-gang-v37-…html` (self-contained) |
| Project demos | Leadformulare + Visitenkarten under `assets/projects/` (nested iframes) |
| Audio | World MP3s under `assets/audio/worlds/` |
| Cache | `vercel.json` sets long-cache `immutable` on `/assets/*` |

---

## 7. Analytics

**None detected** in production shell/world entrypoints. Adding analytics later needs consent / privacy copy (CONTENT TODO) — do not invent vendor choice here.

---

## 8. SEO bits (shell = indexed document)

Primary crawlable document is the **shell**, not the iframe HTML (iframes are secondary).

### Static shell head (`3-Welten-Master-iframe.html` / `index.html`)

| Field | Value (static HTML) |
| --- | --- |
| `lang` | `de-CH` |
| `<title>` | Alex Lamberti Multiversum für digitale Welten |
| `meta description` | Entdecke das Multiversum… vier digitalen Welten |
| `canonical` | `https://www.alexlamberti.ch/` (updated at runtime by JS) |
| `robots` | **not set** on shell (defaults to index) |
| OG / Twitter | type, locale `de_CH`, site_name, title, description, url, image 1200×630, twitter card |
| H1 (sr-only SEO block) | Alex Lamberti · Multiversum für digitale Welten |
| `hreflang` | **absent** |

### Runtime SEO (`assets/welten-shell-seo.js`)

Updates title, description, canonical, OG/Twitter on route + chapter messages. World-home packs for general / nexora / vertex / freiraum (DE + EN). Chapter SEO from `welten-translations.js` → `seo.*`. World-scoped chapters prefix label + chapter meta.

### World iframe static meta (if crawled directly)

| File | Title | Description notes |
| --- | --- | --- |
| `MULTIVERSUM.html` | Alex Lamberti Multiversum… | Close to shell |
| `NEXORA.html` | NEXORA · Virtuelle Welt | Unique |
| `PROFESSIONAL.html` | **BUSINESS · Business Welt** (stale naming) | Generic duplicate + typo `professionale` |
| `FREIRAUM.html` | FREIRAUM · Kreative Welt | Same generic portfolio blurb as PROFESSIONAL |

Visible H1s (home):

| World | H1 |
| --- | --- |
| Multiversum | Digitale Welten. Ein Portfolio. Unendliche Möglichkeiten. |
| NEXORA | Digital Marketing zwischen Strategie, Technologie und Zukunft. |
| PROFESSIONAL | Digital Marketing mit Klarheit, Verantwortung und Wirkung. |
| FREIRAUM | Digital Marketing mit Kreativitt, Persnlichkeit… (**encoding corruption** in source) |

### robots.txt

```
User-agent: *
Allow: /
Disallow: /*-test.html
Disallow: /MULTIVERSUM-flight*
Sitemap: https://www.alexlamberti.ch/sitemap.xml
```

Points at **www** — consistent with canonicals.

### sitemap.xml (pre–Phase-1 hygiene)

Included: `/`, world homes, global chapters (`projekte`, `leistungen`, `ueber-mich`, `kontakt`), and `*/projekte` per world.  
**Gaps vs live rewrites:** `/offerte`, world-scoped leistungen/ueber-mich/kontakt/offerte, `/multiversum` (optional alias). Expanded in Phase 1 hygiene if logged.

### Structured data

- Shell: Person + WebSite JSON-LD (`welten-shell-seo.js`) — includes telephone, email, jobTitle.
- Worlds (when `welten-seo.js` runs): Person + Organization (`sameAs: []`) + WebSite + **LocalBusiness** with postal address + geo.
- Invisible SEO `<main class="mv-shell-seo">` in shell provides text + nav for non-JS / assistive / simple bots.

### 404

`404.html`: noindex, follow; title/description set; canonical points to `/404` (odd — worth revisiting).

---

## 9. Forms / conversion

| Surface | Mechanism |
| --- | --- |
| Contact chapter | mailto + tel links (`welten-contact-final.js`); no native message form |
| Offerte | Nested iframe lead form; UI still “Digital Plus”; prices/copy may not match personal brand |
| Project cards | External live sites + local demo HTML iframes |

---

## 10. Security headers (`vercel.json`)

Present:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- HTML charset Content-Type on `/`, `*.html`, clean routes
- Asset Cache-Control immutable

**Missing (common hardening — not changed in Phase 1):** CSP, `X-Frame-Options` / `frame-ancestors`, HSTS (often at Vercel edge), Permissions-Policy. iframe architecture complicates strict CSP — plan carefully later.

---

## 11. Accessibility (spot findings)

- Skip link → `#mv-shell-main` (main is visually clipped SEO block — verify focus management).
- World switch + menu `aria-*` partially present.
- Iframe titles set per world.
- Large motion/audio surface; reduced-motion paths exist but need UX QA.
- Encoding-broken characters in FREIRAUM (and PROFESSIONAL body copy “verlÄsslich”, “Ästhetisch”, etc.) hurt readability and a11y name calculation.

---

## 12. Duplicate / near-duplicate content

1. **Four world homes** share structural template (intro + lead + more paragraphs + same CTA pattern + portrait). Intentional Multiversum concept, but risk of thin/similar SERP snippets if titles/descriptions drift.
2. Shell SEO text vs iframe H1s diverge by design (shell = Multiversum brand; worlds = chapter storytelling).
3. **PROFESSIONAL vs FREIRAUM** static `meta description` nearly identical generic portfolio sentence.
4. Chapter content largely shared across worlds (projects/leistungen/about), differentiated mainly by theme CSS + some i18n packs — duplicate-content risk if world-scoped URLs are all indexed equally without sharper differentiation.
5. `index.html` ≈ `3-Welten-Master-iframe.html` (redirect of filename; both exist in repo).

---

## 13. Per-route SEO matrix (inspected, not Lighthouse)

Legend: **S** = shell static default · **R** = runtime via `WeltenShellSEO` · **I** = iframe static (secondary)

| Route | Title (expected R) | Desc | H1 primary | Canonical (R) | robots | OG |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Multiversum home DE | unique Multiversum | Shell SEO H1 + iframe H1 | `/` | default | yes |
| `/nexora` | NEXORA \| … | NEXORA pack | NEXORA H1 | `/nexora` | default | yes |
| `/professional` | PROFESSIONAL \| … | PROFESSIONAL pack | PROFESSIONAL H1 | `/professional` | default | yes |
| `/freiraum` | FREIRAUM \| … | FREIRAUM pack | FREIRAUM H1 | `/freiraum` | default | yes |
| `/projekte` (+ world) | Projekte \| … (world prefix if scoped) | from translations | chapter H2 | path-based | default | yes |
| `/leistungen` | Leistungen \| … | translations | chapter | path | default | yes |
| `/ueber-mich` | Über mich \| … | translations | chapter | path | default | yes |
| `/kontakt` | Kontakt \| … | includes phone/email/location | chapter | path | default | yes |
| `/offerte` | Offerte \| … | translations | chapter | path | default | yes |
| `/404` | Seite nicht gefunden | yes | (page) | `/404` | **noindex** | limited |

**Caveats:** Without JS, crawlers that do not execute scripts see shell static meta (always Multiversum home) even on `/nexora` etc. — reliance on JS SEO is a known SPA-like risk on a static shell. Google generally executes JS; other bots may not. SSR is not available without architecture change.

**TODO:** Confirm Google Search Console indexing, rendered title per URL, and CWV (LCP likely driven by fonts + hero video/Galaxy).

---

## 14. Performance risks (qualitative)

- Four world HTML monoliths (thousands of lines CSS/JS each) + nested project iframes.
- Google Fonts request (4 families).
- Hero MP4s + Galaxy self-contained HTML.
- Long-cache assets help repeat visits; first paint depends on active iframe.
- No analytics overhead today (positive for weight).

---

## 15. Top prioritized risks / opportunities (summary)

See parent handoff “Top 10”; mirrored briefly:

1. JS-dependent meta for non-home routes  
2. Stale PROFESSIONAL “BUSINESS” iframe branding + meta duplicate FREIRAUM  
3. Encoding-corrupted visible copy  
4. Offerte form still Digital Plus identity  
5. Sitemap incomplete vs live routes  
6. Empty `sameAs` / social proof gaps  
7. LocalBusiness schema accuracy must be verified (address/phone)  
8. Missing analytics + consent strategy  
9. Security header gaps (CSP etc.)  
10. Galaxy/perf only on large viewports — mobile story separate  

---

## 16. Inventory pointers

- SEO meta inventory → section 8 + `CONTENT-TODOS.md`  
- Content verification TODOs → `docs/CONTENT-TODOS.md`  
- Changes this session → `docs/IMPLEMENTATION-LOG.md`
