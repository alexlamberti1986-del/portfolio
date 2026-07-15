# AUDIT-AFTER — alexlamberti.ch

**Status:** Phase 1–3 complete (2026-07-15). Full Lighthouse/CWV after-audit still pending real measurement.

## Phase 3 completed (this session)

- Brief-aligned DE copy for Leistungen / Projekte / Über mich / Kontakt + Multiversum world blurbs
- Primary CTA → **Projekt besprechen**; shell SEO crawl block updated
- Schema reduced to Person/WebSite **name + url**
- Reachable Impressum/Datenschutz stubs (no invented address)
- a11y focus / reduced-motion / overflow-wrap; offscreen video pause
- Sitemap + Vercel rewrites for legal pages

## Phase 2 completed

- Encoding/mojibake cleaned in FREIRAUM / PROFESSIONAL (and related worlds); PROFESSIONAL BUSINESS kicker → PROFESSIONAL
- Early shell SEO boot (`welten-shell-seo-boot.js`) for unique title/description/canonical/H1 from path
- Static shell OG/twitter + “vier Welten” consistency
- Offerte success UX no longer claims successful remote send (still local-only; backend deferred)

## Phase 1 completed

- Ist-Audit documented in `AUDIT-BEFORE.md`
- Content verification backlog in `CONTENT-TODOS.md`
- Session log in `IMPLEMENTATION-LOG.md`
- Safe SEO hygiene: sitemap coverage + stale world meta alignment

## Still pending for full after-audit

- [ ] Re-crawl sample of all clean URLs (title/description/canonical after JS)
- [ ] Lighthouse mobile + desktop on production (or preview) — fill scores only from real runs
- [ ] Validate robots/sitemap in Search Console
- [ ] Wire offerte submission path to a real endpoint (currently local-only)
- [ ] Re-check Galaxy Walk ≥1280×700 constraints still hold
- [ ] Owner-confirmed contact/social/schema facts
- [ ] Full impressum postal block after owner confirm
- [ ] Optional dedicated Leistungs-URLs (§8 brief)
