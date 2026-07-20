# IMPLEMENTATION-LOG — alexlamberti.ch optimization

Session log for the Multiversum static site. Append newest entries at the top.

---

## 2026-07-15 — Phase 4 (service routes + world×chapter depth + home brief + 404 + perf/a11y leftovers)

Owner-free pass continuing from Phase 3 (`d1f478c`). Galaxy Walk ≥1280×700 and world-switch isolation preserved.

### Dedicated service routes (brief §8)

1. **`webdesign.html` / `digital-marketing.html` / `digitale-strategie.html`** — standalone indexable pages with unique title/description/H1 + §7–§8 copy (no invented case studies/prices).
2. **`assets/welten-service-pages.css`** — shared dark Multiversum-adjacent styling, skip-link, 44px targets.
3. **`vercel.json`** — rewrites + charset headers for the three paths.
4. **`sitemap.xml`** — adds the three service locs.
5. **Shell SEO nav** (`3-Welten-Master-iframe.html` / `index.html`) — crawlable links to service pages.
6. **`welten-site-ia.js`** — Leistungen cards link to service detail pages (`target="_top"`, grid `data-brief="4"`).

### World × chapter differentiation (C-31)

1. **`welten-brief-content.js`** — world-specific packs for Leistungen / Projekte / Kontakt intros (NEXORA / PROFESSIONAL / FREIRAUM / MULTIVERSUM); about keeps shared biografisch brief text + world notes. No fake testimonials or metrics.

### Homepage structure (without breaking Galaxy)

1. Shell SEO `<main>` — benefit (§6.4), process (§6.6), FAQ (§6.9) for crawlability.
2. **`injectHomeExtras`** — injects benefit/process/FAQ into `#slide-home` for non-Galaxy contexts; **skipped** when `data-welten-galaxy-hero=1` at ≥1280×700 (also CSS hard-hide).
3. Styles in `welten-site-ia.css`.

### 404 (brief §22)

1. **`404.html`** — copy aligned to brief (“Diese Welt wurde nicht gefunden…”), primary CTA Startseite, secondary “Projekte entdecken”, main nav, `noindex`, skip-link. Vercel serves root `404.html` with HTTP 404 for unmatched paths.

### Accessibility leftovers

1. **`welten-shell-accessibility.css`** — 44×44 min targets for shell menu / effects / flags / world links / FAQ buttons.

### Performance leftovers

1. **`welten-video-hero-boot.js`** — no video `<link rel=preload>` on mobile; play path uses `preload="metadata"` (not `auto`).
2. World HTML poster preloads — `media="(min-width: 1025px)"`.
3. **`welten-mobile-performance.js`** — strips video/poster preload links in mobile context.
4. Fonts — Google CSS already `&display=swap`; documented in `welten-font-system.css`.
5. **`welten-phase2-loader.js`** — bumped site-ia / mobile-perf versions; skip re-inject if script already present.

### Docs

- This log; `CONTENT-TODOS` C-31/C-33 notes; `AUDIT-AFTER` Phase 4.

### Explicitly deferred (owner / measurement)

- C-01–C-07 contact/social/jobTitle/schema expansions
- C-10–C-13 Digital Plus rebrand, prices, real offerte backend
- C-14 analytics + consent product choice
- C-24 testimonials/stats
- C-30 hreflang
- Full impressum postal block
- Lighthouse/CWV measurement this session

---

## 2026-07-15 — Phase 3 (brief copy + SEO + a11y + legal stubs + perf)

Owner-free pass from the PDF brief. Multiversum / Galaxy Walk identity preserved.

### Content uniqueness

1. **`assets/welten-brief-content.js`** (new) — applies brief DE templates to chapter titles/intros (Leistungen, Projekte, Über mich, Kontakt), world-toned Multiversum notes, home CTAs (`Projekt besprechen` primary → contact; `Projekte ansehen` secondary), Offerte H2 rename.
2. **`welten-site-ia.js`** — Leistungen cards reduced to brief’s three disciplines (Webdesign, Digital Marketing, Digitale Strategie) with full brief descriptions; grid versioned `data-brief="3"`.
3. **`welten-final-restore.js`** — Kontakt rebuild uses brief H2/intro + primary CTA button.
4. **`welten-translations.js` + shell SEO boot/runtime** — meta title/description + shellMain Multiversum world blurbs aligned to brief; contact meta no longer forces phone into description.
5. **MULTIVERSUM.html** — remaining mojibake (`Markenverständnis`, `überzeugt`, `Unterstützung`, `tragfähige`, projects intro).

### SEO / crawlability

1. Shell static head + SEO `<main>` (`3-Welten-Master-iframe.html` / `index.html`) — unique home title/description; crawlable Multiversum explanations; legal links; primary CTA wording.
2. Schema in `welten-shell-seo.js` + `welten-seo.js` — **name + url only** (phone/jobTitle/address/LocalBusiness/sameAs omitted pending owner confirm).
3. **`impressum.html` / `datenschutz.html`** — reachable minimal pages (email only; address/phone deferred in copy).
4. **`vercel.json`** rewrites + charset headers; **`sitemap.xml`** adds impressum/datenschutz.

### Accessibility / mobile / perf

1. **`welten-shell-accessibility.css`** — skip-link focus-visible, world-nav focus, reduced-motion, overflow-wrap / header meta ellipsis.
2. Chip/title overflow-wrap in `welten-visual-sprint2.css`.
3. **`welten-mobile-performance.js`** — pause offscreen / hidden `<video>` via IntersectionObserver.
4. Escape-to-close shell menu already present (confirmed).

### Explicitly deferred (owner / measurement)

- C-01–C-07 contact/social/jobTitle/schema expansions
- C-10–C-13 Digital Plus rebrand, prices, real offerte backend
- C-14 analytics + consent
- C-24 testimonials/stats
- C-30 hreflang; C-31 deeper world×chapter differentiation beyond tone notes
- Full impressum legal block (postal address after C-03)
- Lighthouse/CWV (not measured this session)
- Dedicated `/webdesign` `/digital-marketing` `/digitale-strategie` routes (brief §8 — optional later)

---

## 2026-07-15 — Phase 2 (encoding + SEO boot + offerte honesty)

### Encoding / mojibake

1. **FREIRAUM.html / PROFESSIONAL.html / NEXORA.html / MULTIVERSUM.html** — bulk fix of corrupted German umlauts (`Kreativitt`→`Kreativität`, `Persnlichkeit`→`Persönlichkeit`, `verstÄndlich`→`verständlich`, `verlÄsslich`→`verlässlich`, `KundenbedÜrfnisse`→`Kundenbedürfnisse`, `Atmosphre`→`Atmosphäre`, etc.) plus follow-up cleanup of accidental double-umlauts (`üüberzeugend` / `Üüübernehmen`).
2. **PROFESSIONAL world kicker** — visible `BUSINESS · Klar · …` → `PROFESSIONAL · Klar · …`; CSS `content:"BUSINESS"` → `PROFESSIONAL`; JS intro/label leftovers updated (also in NEXORA/MULTIVERSUM/FREIRAUM JS packs + `welten-final-restore.js`).
3. **NEXORA.html** — targeted `?`-mojibake in visible project/persona copy (`?bersichtlich`, `?berzeugt`, `vertrauensw?rdig`, `Loyalit?t`, …).

### SEO hygiene (SSR-less, no invented contact)

1. **`assets/welten-shell-seo-boot.js`** (new) — sync path→title/description/canonical/OG/Twitter + SEO-block H1/intro before deferred scripts (deep-link shells no longer all look identical in static HTML once JS runs early).
2. **`3-Welten-Master-iframe.html` + `index.html`** — aligned `og:description` / twitter title+description with “vier Welten”; SEO intro “Drei”→“Vier”; boot script linked.
3. **`welten-shell-seo.js`** — chapter-meta fallback “Drei”→“Vier”.
4. **`welten-translations.js`** — DE/EN/FR/IT shellMain intro world-count aligned (vier / four / quatre / quattro).
5. **`welten-seo.js`** — description “Drei digitale Welten für”→“Vier digitale Welten für”.

### Offerte form (no fake backend)

1. **`assets/preview/alx-offerte-form-v5.html`** — still `data-submission-mode="local-only"` (no real endpoint). Removed false “successfully sent / Digital Plus meldet sich” success UX; honest DE/EN/IT copy that local-only checks ran and asks mailto to existing `alex.lamberti@hotmail.ch`.

### Docs

- This log entry; `AUDIT-AFTER.md` phase-2 notes; `CONTENT-TODOS.md` statuses for C-20–C-23 / C-11; SEO inventory note on early boot.

### Explicitly deferred

- Owner confirmation of phone/email/address/social (C-01–C-07)
- Real offerte submit endpoint + rebrand/prices (C-10–C-13) — **backend still missing**
- World-scoped chapter body differentiation beyond home intros (C-31) — no brief template application this session
- Homepage IA / Galaxy Walk redesign
- hreflang, Privacy/Impressum routes, analytics
- Lighthouse / CWV measurement

---

## 2026-07-15 — Phase 1 (audit + safe SEO hygiene)

### Docs created

- `docs/AUDIT-BEFORE.md` — full Ist-Audit (stack, routes, SEO, a11y, security, duplicates; no invented Lighthouse scores)
- `docs/AUDIT-AFTER.md` — stub (Phase 1 only)
- `docs/CONTENT-TODOS.md` — central content verification backlog (no invented business facts)
- `docs/SEO-META-INVENTORY.md` — per-surface title/description inventory
- `docs/IMPLEMENTATION-LOG.md` — this file

### Code / SEO hygiene (non-destructive)

1. **`sitemap.xml`** — expanded to cover live rewrite routes still missing (global `/offerte`; world-scoped leistungen / ueber-mich / kontakt / offerte; `/multiversum` alias). Locs remain `https://www.alexlamberti.ch/…` (aligned with robots + canonicals).
2. **`robots.txt`** — confirmed Sitemap → `https://www.alexlamberti.ch/sitemap.xml`; added Disallow for `_tmp` / `_tmp-*` paths so accidental deploy stubs are less crawlable.
3. **`PROFESSIONAL.html` head** — title corrected from stale “BUSINESS · Business Welt” → “PROFESSIONAL · Projekte & Zusammenarbeit”; unique description aligned with shell `WeltenShellSEO` world pack (typo `professionale` removed).
4. **`FREIRAUM.html` head** — replaced generic shared portfolio description with FREIRAUM-specific description matching shell SEO pack (dedupe vs PROFESSIONAL).

### Explicitly not done (per Phase 1 guardrails)

- Homepage rewrite / IA nav redesign / Galaxy Walk behavior changes
- Mass world-copy rewrite
- Inventing testimonials, prices, social URLs, or new phone/address
- Wired offerte form API (still `submissionMode=local-only` — content/tech TODO)
- Commit/push handled after docs + hygiene in same session

---
