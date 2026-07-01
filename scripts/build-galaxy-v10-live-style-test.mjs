/**
 * Galaxy V10 Live-Style TEST build (nicht live schalten).
 * Basis: V9 final clean sequence (with-assets HTML aus dem Zip).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceHtml = path.join(
  root,
  "_temp-zip-extract",
  "alexlamberti-live-assets-galaxy-variant-v6-with-assets.html"
);
const outDir = path.join(root, "galaxy-live-style-v10-test");
const assetsSrc = path.join(root, "_temp-zip-extract", "assets");
const assetsOut = path.join(outDir, "assets");

const LIVE_CSS = `
/* =========================================================
   V10 Live-Style — Tokens & Komponenten von alexlamberti.ch
   ========================================================= */
:root {
  --live-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --live-radius-lg: 28px;
  --live-radius-md: 18px;
}

.live-textbox,
.final-textbox {
  width: fit-content !important;
  min-width: min(340px, calc(100vw - 36px)) !important;
  max-width: min(520px, calc(100vw - 36px)) !important;
  padding: clamp(18px, 3vw, 28px) !important;
  border-radius: var(--live-radius-lg) !important;
  backdrop-filter: blur(18px) !important;
  -webkit-backdrop-filter: blur(18px) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45) !important;
}

.world-eyebrow {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 0 18px !important;
  padding: 8px 13px !important;
  border-radius: 999px !important;
  font-size: 0.78rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
}

.world-eyebrow::before {
  content: "" !important;
  width: 7px !important;
  height: 7px !important;
  border-radius: 50% !important;
  flex-shrink: 0 !important;
}

.live-textbox h2,
.final-textbox h2 {
  margin: 0 0 14px !important;
  font-weight: 700 !important;
  letter-spacing: -0.04em !important;
  line-height: 1.08 !important;
  font-size: clamp(1.55rem, 2.5vw, 2.15rem) !important;
  max-width: 14ch !important;
}

.live-lead {
  font-size: clamp(1.02rem, 1.8vw, 1.2rem) !important;
  line-height: 1.45 !important;
  font-weight: 500 !important;
  margin: 0 0 12px !important;
  max-width: 28ch !important;
}

.live-more {
  font-size: 0.98rem !important;
  line-height: 1.75 !important;
  margin: 0 0 14px !important;
  max-width: 40em !important;
}

.live-more--secondary {
  margin-bottom: 22px !important;
}

.live-textbox .cta-row,
.final-textbox .cta-row {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 12px !important;
}

.world-cta {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 48px !important;
  padding: 0 22px !important;
  border-radius: 999px !important;
  font-size: 0.92rem !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  transition: transform 0.25s var(--live-ease), background 0.25s, border-color 0.25s, box-shadow 0.25s !important;
}

.world-cta:hover {
  transform: translateY(-2px) !important;
}

.world-cta--ghost {
  background: rgba(255, 255, 255, 0.04) !important;
}

/* MULTIVERSUM */
.world-panel[data-world="multiversum"] .live-textbox,
.final-textbox {
  background: rgba(18, 32, 56, 0.42) !important;
  border: 1px solid rgba(255, 89, 178, 0.22) !important;
  color: #eef3ff !important;
}
.world-panel[data-world="multiversum"] .world-eyebrow,
.final-textbox .world-eyebrow {
  color: rgba(255, 155, 194, 0.82) !important;
  border: 1px solid rgba(255, 89, 178, 0.22) !important;
  background: rgba(255, 255, 255, 0.035) !important;
}
.world-panel[data-world="multiversum"] .world-eyebrow::before,
.final-textbox .world-eyebrow::before {
  background: linear-gradient(135deg, #5ec4ff, #9b6bff, #ff59b2, #ff9b37) !important;
  box-shadow: 0 0 14px rgba(255, 89, 178, 0.35) !important;
}
.world-panel[data-world="multiversum"] .live-textbox h2,
.final-textbox h2 {
  font-family: "Space Grotesk", Inter, sans-serif !important;
}
.world-panel[data-world="multiversum"] .live-lead,
.final-textbox .live-lead { color: #eef3ff !important; }
.world-panel[data-world="multiversum"] .live-more,
.final-textbox .live-more { color: rgba(170, 181, 207, 0.92) !important; }
.world-panel[data-world="multiversum"] .world-cta {
  color: #eef3ff !important;
  border: 1px solid rgba(255, 89, 178, 0.45) !important;
  background: linear-gradient(135deg, rgba(255, 89, 178, 0.28), rgba(155, 107, 255, 0.12)) !important;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35) !important;
}
.world-panel[data-world="multiversum"] .world-cta--ghost {
  border-color: rgba(255, 89, 178, 0.22) !important;
  color: #eef3ff !important;
}

/* NEXORA */
.world-panel[data-world="nexora"] .live-textbox {
  background: linear-gradient(145deg, rgba(7, 26, 58, 0.62), rgba(2, 9, 22, 0.38)) !important;
  border: 1px solid rgba(101, 217, 255, 0.24) !important;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42), inset 0 0 24px rgba(101, 217, 255, 0.035) !important;
  color: #edfaff !important;
}
.world-panel[data-world="nexora"] .world-eyebrow {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
  letter-spacing: 0.22em !important;
  color: rgba(237, 250, 255, 0.72) !important;
  border-color: rgba(101, 217, 255, 0.24) !important;
  background: rgba(5, 20, 44, 0.35) !important;
}
.world-panel[data-world="nexora"] .world-eyebrow::before {
  background: #65d9ff !important;
  box-shadow: 0 0 14px rgba(0, 200, 255, 0.42) !important;
}
.world-panel[data-world="nexora"] .live-textbox h2 {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
  letter-spacing: -0.06em !important;
  color: #68e7ff !important;
  text-shadow: 0 0 28px rgba(101, 217, 255, 0.28) !important;
  max-width: 16ch !important;
}
.world-panel[data-world="nexora"] .live-lead { color: #edfaff !important; }
.world-panel[data-world="nexora"] .live-more { color: rgba(237, 250, 255, 0.72) !important; }
.world-panel[data-world="nexora"] .world-cta {
  color: #edfaff !important;
  border-color: rgba(101, 217, 255, 0.45) !important;
  background: linear-gradient(135deg, rgba(101, 217, 255, 0.22), rgba(5, 20, 44, 0.2)) !important;
}

/* PROFESSIONAL */
.world-panel[data-world="professional"] .live-textbox {
  background: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08) !important;
  color: #111 !important;
  border-radius: 0 !important;
}
.world-panel[data-world="professional"] .world-eyebrow {
  border-radius: 0 !important;
  background: transparent !important;
  border-color: rgba(0, 0, 0, 0.18) !important;
  color: rgba(17, 17, 17, 0.68) !important;
}
.world-panel[data-world="professional"] .world-eyebrow::before {
  background: #111 !important;
  box-shadow: none !important;
}
.world-panel[data-world="professional"] .live-textbox h2 {
  font-family: Georgia, "Times New Roman", serif !important;
  font-weight: 500 !important;
  color: #5c6370 !important;
  max-width: 16ch !important;
}
.world-panel[data-world="professional"] .live-lead,
.world-panel[data-world="professional"] .live-more { color: rgba(17, 17, 17, 0.72) !important; }
.world-panel[data-world="professional"] .world-cta {
  color: #111 !important;
  border-color: rgba(0, 0, 0, 0.18) !important;
  background: #fff !important;
  border-radius: 0 !important;
}
.world-panel[data-world="professional"] .world-cta--ghost {
  background: transparent !important;
}

/* FREIRAUM */
.world-panel[data-world="freiraum"] .live-textbox {
  background: linear-gradient(145deg, rgba(38, 22, 42, 0.55), rgba(16, 11, 22, 0.38)) !important;
  border: 1px solid rgba(255, 198, 111, 0.2) !important;
  border-radius: 28px 18px 32px 20px !important;
  color: #fff7ec !important;
}
.world-panel[data-world="freiraum"] .world-eyebrow {
  border-radius: 18px 999px 999px 18px !important;
  transform: rotate(-0.6deg) !important;
  background: rgba(255, 255, 255, 0.07) !important;
  border-color: rgba(255, 198, 111, 0.2) !important;
  color: #ffd166 !important;
}
.world-panel[data-world="freiraum"] .world-eyebrow::before {
  background: #ffc66f !important;
  box-shadow: 0 0 14px rgba(255, 138, 108, 0.22) !important;
}
.world-panel[data-world="freiraum"] .live-textbox h2 {
  font-family: "Syne", Inter, sans-serif !important;
  color: #ffd166 !important;
  text-shadow: 0 0 24px rgba(255, 209, 102, 0.28), 0 8px 32px rgba(0, 0, 0, 0.18) !important;
}
.world-panel[data-world="freiraum"] .live-lead { color: #fff7ec !important; }
.world-panel[data-world="freiraum"] .live-more { color: rgba(255, 247, 236, 0.72) !important; }
.world-panel[data-world="freiraum"] .world-cta {
  color: #fff7ec !important;
  border-color: rgba(255, 198, 111, 0.35) !important;
  background: linear-gradient(135deg, rgba(255, 198, 111, 0.2), rgba(255, 139, 189, 0.1)) !important;
}

/* Klickbare Elemente in der Scroll-Schicht */
.content-layer a,
.content-layer button {
  pointer-events: auto !important;
}

.world-sphere-link,
.overview-sphere-link {
  position: relative;
  z-index: 2;
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 999px;
}

.subpage-card {
  pointer-events: auto !important;
  cursor: pointer !important;
  overflow: hidden !important;
  display: grid !important;
  grid-template-rows: auto auto auto !important;
  padding: 0 !important;
  border-radius: var(--live-radius-md) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45) !important;
  transition: transform 0.5s var(--live-ease), border-color 0.35s, box-shadow 0.35s !important;
  will-change: transform, box-shadow;
  z-index: 5 !important;
}

.world-subpages {
  pointer-events: none !important;
  z-index: 4 !important;
}

.world-subpages .subpage-card {
  pointer-events: auto !important;
}

.world-panel .world-main-visual {
  z-index: 2 !important;
}

.world-panel[data-world="multiversum"] .subpage-card {
  border: 1px solid rgba(142, 197, 255, 0.18) !important;
  background: rgba(12, 20, 38, 0.78) !important;
}
.world-panel[data-world="nexora"] .subpage-card {
  border: 1px solid rgba(101, 217, 255, 0.24) !important;
  background: linear-gradient(145deg, rgba(7, 26, 58, 0.62), rgba(2, 9, 22, 0.38)) !important;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42), inset 0 0 24px rgba(101, 217, 255, 0.035) !important;
}
.world-panel[data-world="professional"] .subpage-card {
  border-radius: 0 !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  background: rgba(255, 255, 255, 0.92) !important;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08) !important;
}
.world-panel[data-world="professional"] .subpage-card span,
.world-panel[data-world="professional"] .subpage-card small {
  color: #111 !important;
}
.world-panel[data-world="freiraum"] .subpage-card {
  border-radius: 28px 18px 32px 20px !important;
  border: 1px solid rgba(255, 209, 102, 0.26) !important;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.035)) !important;
}

.subpage-card__media {
  position: relative !important;
  overflow: hidden !important;
  width: 100% !important;
  aspect-ratio: 1.62 !important;
  background: rgba(0, 0, 0, 0.18) !important;
}

.subpage-card__media::after {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 2 !important;
  pointer-events: none !important;
  background: linear-gradient(180deg, rgba(5, 7, 13, 0.08) 0%, rgba(5, 7, 13, 0.52) 100%) !important;
  opacity: 0.72 !important;
  transition: opacity 0.35s var(--live-ease) !important;
}

.subpage-card:hover .subpage-card__media::after {
  opacity: 0.14 !important;
}

.subpage-card__media img,
.subpage-card > img {
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  display: block !important;
  object-fit: cover !important;
  opacity: 1 !important;
  transform: scale(1) !important;
  transform-origin: center center !important;
  transition: transform 0.62s var(--live-ease), filter 0.45s var(--live-ease) !important;
  will-change: transform !important;
}

.world-panel .subpage-card {
  transform: translate(-50%, -50%) !important;
}
.world-panel .subpage-card:hover {
  transform: translate(-50%, -50%) translateY(-8px) scale(1.02) !important;
  border-color: rgba(255, 255, 255, 0.34) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.42), 0 0 56px rgba(120, 185, 255, 0.18) !important;
}

/* Einheitlicher Bild-Zoom für alle Unterseiten */
.world-panel .subpage-card:hover .subpage-card__media img,
.world-panel .subpage-card:hover > img {
  transform: scale(1.18) !important;
  filter: brightness(1.12) saturate(1.08) !important;
}

.world-panel[data-world="nexora"] .subpage-card:hover {
  border-color: rgba(101, 217, 255, 0.45) !important;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42), 0 0 48px rgba(101, 217, 255, 0.22) !important;
}
.world-panel[data-world="nexora"] .subpage-card:hover .subpage-card__media img,
.world-panel[data-world="nexora"] .subpage-card:hover > img {
  filter: brightness(1.14) saturate(1.12) !important;
}
.world-panel[data-world="professional"] .subpage-card:hover {
  border-color: rgba(0, 0, 0, 0.22) !important;
  box-shadow: 0 22px 56px rgba(0, 0, 0, 0.14), 0 0 36px rgba(126, 190, 255, 0.12) !important;
}
.world-panel[data-world="professional"] .subpage-card:hover .subpage-card__media img,
.world-panel[data-world="professional"] .subpage-card:hover > img {
  filter: brightness(1.06) contrast(1.04) !important;
}
.world-panel[data-world="freiraum"] .subpage-card:hover {
  border-color: rgba(255, 209, 102, 0.42) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.38), 0 0 40px rgba(255, 155, 55, 0.18) !important;
}
.world-panel[data-world="freiraum"] .subpage-card:hover .subpage-card__media img,
.world-panel[data-world="freiraum"] .subpage-card:hover > img {
  filter: brightness(1.16) saturate(1.14) !important;
}
.world-panel[data-world="multiversum"] .subpage-card:hover {
  border-color: rgba(255, 89, 178, 0.38) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.42), 0 0 48px rgba(255, 89, 178, 0.16) !important;
}
.world-panel[data-world="multiversum"] .subpage-card:hover .subpage-card__media img,
.world-panel[data-world="multiversum"] .subpage-card:hover > img {
  filter: brightness(1.14) saturate(1.1) !important;
}

/* Bildfokus: Landscape (Projekte-Referenz) */
.world-panel .subpage-card.subpage-2 .subpage-card__media img,
.world-panel .subpage-card.subpage-3 .subpage-card__media img,
.world-panel .subpage-card.subpage-4 .subpage-card__media img,
.world-panel .subpage-card.subpage-2 > img,
.world-panel .subpage-card.subpage-3 > img,
.world-panel .subpage-card.subpage-4 > img,
.world-panel[data-world="multiversum"] .subpage-card.subpage-1 .subpage-card__media img,
.world-panel[data-world="multiversum"] .subpage-card.subpage-1 > img {
  object-position: center center !important;
  transform-origin: center center !important;
}

/* Bildfokus: Portrait (Über-mich-Referenz) */
.world-panel .subpage-card.subpage-1:not([data-world="multiversum"]) .subpage-card__media img,
.world-panel .subpage-card.subpage-1:not([data-world="multiversum"]) > img {
  object-position: center 18% !important;
  transform-origin: center 18% !important;
}

.world-panel .subpage-card.subpage-1:not([data-world="multiversum"]):hover .subpage-card__media img,
.world-panel .subpage-card.subpage-1:not([data-world="multiversum"]):hover > img {
  transform: scale(1.14) !important;
}
.subpage-card span {
  position: relative !important;
  z-index: 2 !important;
  font-family: Inter, system-ui, sans-serif !important;
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  color: #e8eef8 !important;
}
.subpage-card small {
  position: relative !important;
  z-index: 2 !important;
  color: rgba(232, 238, 248, 0.68) !important;
  font-size: 0.68rem !important;
}

.world-panel .world-detail-label {
  font-size: clamp(16px, 1.6vw, 24px) !important;
  font-weight: 900 !important;
  letter-spacing: 0.16em !important;
}

/* Multiversum — Farbverlauf wie Live-Seite (Brand-Mark) */
.overview-card[data-world="multiversum"] .overview-label strong,
.world-panel[data-world="multiversum"] .world-detail-label,
.final-buttons a[href*="MULTIVERSUM"] span,
.final-textbox h2 {
  background: linear-gradient(90deg, #5ec4ff, #9b6bff 22%, #ff59b2 48%, #ff9b37 72%, #ffd86a) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: none !important;
  filter: drop-shadow(0 0 16px rgba(255, 89, 178, 0.18)) drop-shadow(0 0 28px rgba(94, 196, 255, 0.12)) !important;
}

.world-panel[data-world="multiversum"] .world-explainer-textbox h2 {
  color: #eef3ff !important;
  text-shadow: 0 0 24px rgba(255, 89, 178, 0.14) !important;
  filter: none !important;
  background: none !important;
  -webkit-text-fill-color: #eef3ff !important;
}

.overview-card[data-world="nexora"] .overview-label strong,
.world-panel[data-world="nexora"] .world-detail-label,
.final-buttons a[href*="NEXORA"] span {
  color: #68e7ff !important;
  text-shadow: 0 0 18px rgba(101, 217, 255, 0.42), 0 0 34px rgba(0, 168, 255, 0.24) !important;
}

.overview-card[data-world="professional"] .overview-label strong,
.world-panel[data-world="professional"] .world-detail-label,
.final-buttons a[href*="PROFESSIONAL"] span {
  color: #c5cdd8 !important;
  text-shadow: 0 0 18px rgba(207, 213, 223, 0.28), 0 0 30px rgba(126, 190, 255, 0.12) !important;
}

.overview-card[data-world="freiraum"] .overview-label strong,
.world-panel[data-world="freiraum"] .world-detail-label,
.final-buttons a[href*="FREIRAUM"] span {
  color: #ffd166 !important;
  text-shadow: 0 0 18px rgba(255, 209, 102, 0.38), 0 0 34px rgba(255, 155, 55, 0.22) !important;
}

.next-final-buttons {
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: 7px !important;
  perspective: 900px !important;
}

.next-final-buttons a.dock-card {
  position: relative !important;
  flex: 0 0 auto !important;
  min-height: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  border-radius: 14px !important;
  border: 1px solid rgba(142, 197, 255, 0.12) !important;
  background: rgba(12, 20, 38, 0.78) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  text-decoration: none !important;
  color: #e8eef8 !important;
  text-align: center !important;
  line-height: 1.25 !important;
  transform: translateZ(-30px) rotateX(12deg) scale(0.92) !important;
  transform-style: preserve-3d !important;
  opacity: 0.88 !important;
  transition: transform 0.5s var(--live-ease), opacity 0.45s, border-color 0.35s, box-shadow 0.35s !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45) !important;
  display: block !important;
}

.next-final-buttons a.dock-card::before {
  display: none !important;
}

.next-final-buttons a.dock-card img {
  width: 100% !important;
  aspect-ratio: 1.62 !important;
  object-fit: cover !important;
  display: block !important;
  opacity: 0.88 !important;
}

.next-final-buttons a.dock-card strong {
  display: block !important;
  padding: 9px 8px 2px !important;
  font-family: Inter, system-ui, sans-serif !important;
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  letter-spacing: -0.01em !important;
  text-transform: none !important;
  color: #e8eef8 !important;
}

.next-final-buttons a.dock-card small {
  display: block !important;
  padding: 0 8px 9px !important;
  font-size: 0.62rem !important;
  color: rgba(232, 238, 248, 0.68) !important;
  line-height: 1.25 !important;
}

.next-final-buttons a.dock-card:hover {
  opacity: 1 !important;
  transform: translateZ(26px) rotateX(4deg) scale(1.06) !important;
  border-color: rgba(142, 197, 255, 0.55) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 24px rgba(120, 185, 255, 0.22) !important;
}

@media (max-width: 860px) {
  .next-final-buttons {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

.final-buttons a {
  border-radius: var(--live-radius-md) !important;
  border: 1px solid rgba(142, 197, 255, 0.18) !important;
  background: rgba(12, 20, 38, 0.78) !important;
  backdrop-filter: blur(14px) !important;
}

.preview-badge {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 9998;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(8, 12, 24, 0.72);
  border: 1px solid rgba(142, 197, 255, 0.22);
  backdrop-filter: blur(12px);
  pointer-events: none;
}

/* Textboxen: vollständiger Inhalt, über Unterseiten-Karten */
.live-textbox {
  z-index: 5 !important;
  max-height: none !important;
  overflow: visible !important;
}

.live-textbox h2,
.final-textbox h2 {
  max-width: 22ch !important;
}

.world-panel[data-world="nexora"] {
  --box-x: 72% !important;
  --box-y: 66% !important;
}

.world-panel[data-world="professional"] {
  --box-x: 29% !important;
  --box-y: 58% !important;
}

.world-panel[data-world="multiversum"] {
  --box-y: 30% !important;
}

.world-panel[data-world="freiraum"] {
  --box-y: 40% !important;
}

.subpage-card {
  z-index: 3 !important;
}

/* Finale 4 Unterseiten-Buttons höher im Viewport */
.final-layer.is-next-active {
  top: 48% !important;
  transform: translate(-50%, -50%) translateY(-4vh) !important;
}

.final-layer.is-next-active .final-textbox,
.final-layer.is-next-active .final-buttons {
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
}

@media (max-width: 860px) {
  .final-layer.is-next-active {
    top: 44% !important;
    transform: translate(-50%, -50%) translateY(-2vh) !important;
  }

  .live-textbox {
    top: 76% !important;
    max-width: min(480px, calc(100vw - 28px)) !important;
  }

  .world-panel[data-world="professional"] .live-textbox,
  .world-panel[data-world="professional"] .world-explainer-textbox {
    top: 72% !important;
  }

  .world-panel[data-world="freiraum"] .live-textbox,
  .world-panel[data-world="freiraum"] .world-explainer-textbox {
    top: 44% !important;
  }

  .overview-center-textbox {
    top: 47% !important;
    max-width: min(460px, calc(100vw - 28px)) !important;
  }
}

/* Übersicht: PROFESSIONAL exakt über FREIRAUM */
.overview-card[data-world="professional"] {
  left: 75% !important;
}

@media (max-width: 860px) {
  .overview-card[data-world="professional"] {
    left: 70% !important;
  }
}

/* Gestaffelte Text-Einblendung wie Live-Parallax */
[data-reveal] {
  opacity: 0;
  will-change: opacity, transform;
}

.overview-intro-textbox {
  background: rgba(18, 32, 56, 0.42) !important;
  border: 1px solid rgba(255, 89, 178, 0.22) !important;
  color: #eef3ff !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45) !important;
}

.overview-intro-textbox h2 {
  background: linear-gradient(90deg, #5ec4ff, #9b6bff 22%, #ff59b2 48%, #ff9b37 72%, #ffd86a) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: none !important;
  filter: drop-shadow(0 0 16px rgba(255, 89, 178, 0.18)) drop-shadow(0 0 28px rgba(94, 196, 255, 0.12)) !important;
  max-width: 16ch !important;
  margin: 0 0 14px !important;
}

.overview-intro-body {
  color: rgba(170, 181, 207, 0.95) !important;
  margin: 0 !important;
  max-width: 36em !important;
}

.world-explainer-textbox h2 {
  max-width: 18ch !important;
}

.live-more--diff {
  margin-bottom: 0 !important;
}

.overview-center-textbox {
  position: absolute !important;
  left: 50% !important;
  top: 46% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 4 !important;
  pointer-events: none !important;
  margin: 0 !important;
}

/* Live-Shell + Site-Chrome + Scroll-Ausstieg */
html.galaxy-v10-page {
  height: 100%;
  scroll-behavior: smooth;
}

body.galaxy-v10-page {
  --galaxy-bar-h: 56px;
  --site-header-h: 90px;
  --galaxy-chrome-h: calc(var(--galaxy-bar-h) + var(--site-header-h));
  --navy-0: #050810;
  --ice: #8ec5ff;
  --ice-dim: rgba(142, 197, 255, 0.45);
  --text: #e8eef8;
  --glass: rgba(18, 32, 56, 0.42);
  --glass-border: rgba(142, 197, 255, 0.18);
  --radius-lg: 28px;
  --header-air-top: 22px;
  --header-air-bottom: 16px;
  --header-inner-row: 52px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}

body.galaxy-v10-page:not(.galaxy-released) {
  overflow: hidden !important;
  position: fixed !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  touch-action: none;
}

body.galaxy-v10-page .mv4-bar {
  position: fixed;
  top: 0;
  z-index: 2147483000;
}

body.galaxy-v10-page .site-header {
  position: fixed;
  top: var(--galaxy-bar-h, 56px);
  left: 0;
  right: 0;
  z-index: 2147482900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-sizing: border-box;
  padding-top: calc(env(safe-area-inset-top, 0px) + var(--header-air-top));
  padding-bottom: var(--header-air-bottom);
  padding-left: max(clamp(12px, 3vw, 32px), env(safe-area-inset-left));
  padding-right: max(clamp(8px, 2.2vw, 22px), env(safe-area-inset-right));
  pointer-events: none;
}

body.galaxy-v10-page .site-header > * {
  pointer-events: auto;
}

body.galaxy-v10-page .header-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: clamp(24px, 3.5vw, 32px);
  row-gap: 10px;
  min-width: 0;
  flex: 1;
}

body.galaxy-v10-page .brand-mark,
body.galaxy-v10-page .header-meta {
  font-weight: 700;
  letter-spacing: -0.03em;
  font-size: clamp(0.82rem, 2vw, 0.92rem);
  line-height: 1.25;
  color: var(--text);
  flex-shrink: 0;
  text-decoration: none;
}

body.galaxy-v10-page .brand-mark span {
  background: linear-gradient(90deg, #5ec4ff, #9b6bff 22%, #ff59b2 48%, #ff9b37 72%, #ffd86a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent !important;
  font-weight: 600;
}

body.galaxy-v10-page .header-meta {
  white-space: nowrap;
  transition: color 0.2s;
}

body.galaxy-v10-page .header-meta:hover,
body.galaxy-v10-page .header-meta:focus-visible {
  color: #ff59b2;
}

body.galaxy-v10-page .btn-menu {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  font-weight: 600;
  font-size: clamp(0.84rem, 2vw, 0.92rem);
  flex-shrink: 0;
  margin-right: 4px;
  color: var(--text);
  cursor: pointer;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}

body.galaxy-v10-page .btn-menu:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 89, 178, 0.48);
  box-shadow: 0 14px 28px rgba(255, 89, 178, 0.14);
}

body.galaxy-v10-page .btn-menu-lines {
  display: grid;
  gap: 4px;
  width: 19px;
}

body.galaxy-v10-page .btn-menu-lines span {
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  opacity: 0.85;
}

body.galaxy-v10-page .menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483100;
  background: rgba(4, 8, 14, 0.72);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  display: grid;
  align-content: center;
  justify-items: center;
  padding: 32px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.45s var(--ease), visibility 0.45s;
}

body.galaxy-v10-page .menu-overlay.open {
  opacity: 1;
  visibility: visible;
}

body.galaxy-v10-page .menu-panel {
  width: min(520px, 100%);
  border-radius: 28px 14px 34px 20px / 26px 18px 30px 22px;
  border: 1px solid rgba(255, 89, 178, 0.16);
  background: rgba(10, 14, 24, 0.92);
  padding: clamp(28px, 5vw, 40px);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.55);
  transform: translateY(16px) scale(0.98);
  transition: transform 0.5s var(--ease);
}

body.galaxy-v10-page .menu-overlay.open .menu-panel {
  transform: translateY(0) scale(1);
}

body.galaxy-v10-page .menu-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}

body.galaxy-v10-page .menu-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
}

body.galaxy-v10-page .btn-close {
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--text);
  background: transparent;
  cursor: pointer;
}

body.galaxy-v10-page .btn-close:hover {
  background: rgba(255, 255, 255, 0.06);
}

body.galaxy-v10-page .menu-links {
  display: grid;
  gap: 4px;
}

body.galaxy-v10-page .menu-links a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #aab5cf;
  text-decoration: none;
  transition: color 0.2s, padding-left 0.25s var(--ease);
}

body.galaxy-v10-page .menu-links a::after {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5ec4ff, #9b6bff, #ff59b2, #ff9b37, #ffd86a);
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.2s, transform 0.25s var(--ease);
}

body.galaxy-v10-page .menu-links a:hover,
body.galaxy-v10-page .menu-links a.active {
  color: #ff59b2;
  padding-left: 6px;
}

body.galaxy-v10-page .menu-links a.active::after {
  opacity: 1;
  transform: scale(1);
}

body.galaxy-v10-page .experience-rail {
  position: fixed;
  right: max(22px, env(safe-area-inset-right));
  top: 50%;
  z-index: 2147482950;
  transform: translateY(-50%);
  display: grid;
  gap: 14px;
  pointer-events: auto;
}

body.galaxy-v10-page .experience-rail::before {
  content: "";
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 11px;
  width: 1px;
  background: rgba(255, 89, 178, 0.18);
}

body.galaxy-v10-page .experience-step {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255, 89, 178, 0.32);
  background: rgba(255, 255, 255, 0.04);
  color: transparent;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  transition: transform 0.35s var(--ease), border-color 0.35s, background 0.35s, box-shadow 0.35s;
}

body.galaxy-v10-page .experience-step::after {
  content: attr(data-label);
  position: absolute;
  right: 34px;
  top: 50%;
  transform: translateY(-50%) translateX(8px);
  color: #eef3ff;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0;
  white-space: nowrap;
  transition: opacity 0.25s, transform 0.35s var(--ease);
  pointer-events: none;
}

body.galaxy-v10-page .experience-step:hover::after,
body.galaxy-v10-page .experience-step.is-active::after {
  opacity: 0.9;
  transform: translateY(-50%) translateX(0);
}

body.galaxy-v10-page .experience-step.is-active {
  transform: scale(1.28);
  border-color: transparent;
  background: linear-gradient(135deg, #5ec4ff, #9b6bff 24%, #ff59b2 50%, #ff9b37 76%, #ffd86a);
  box-shadow: 0 0 24px rgba(255, 89, 178, 0.32);
}

@media (max-width: 1919px) {
  body.galaxy-v10-page .experience-rail {
    display: none !important;
  }
}

@media (max-width: 720px) {
  body.galaxy-v10-page .header-meta {
    display: none;
  }
}

body.galaxy-v10-page .alex-live-galaxy {
  top: var(--galaxy-chrome-h, 146px) !important;
  height: calc(100vh - var(--galaxy-chrome-h, 146px)) !important;
  bottom: auto !important;
}

.galaxy-viewport {
  position: relative;
  width: 100%;
}

body.galaxy-v10-page:not(.galaxy-released) .galaxy-viewport {
  height: calc(100vh - var(--galaxy-chrome-h, 146px));
}

body.galaxy-released {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  position: relative !important;
  inset: auto !important;
  width: 100% !important;
  height: auto !important;
  min-height: 100vh;
  touch-action: auto;
}

body.galaxy-released .galaxy-viewport {
  height: 100vh;
  min-height: calc(100vh - var(--galaxy-chrome-h, 146px));
}

body.galaxy-released .alex-live-galaxy {
  position: fixed !important;
  top: var(--galaxy-chrome-h, 146px) !important;
  left: 0;
  right: 0;
  height: calc(100vh - var(--galaxy-chrome-h, 146px)) !important;
  z-index: 2;
  pointer-events: none;
  opacity: var(--galaxy-exit-opacity, 1);
  transition: opacity 0.35s ease;
}

.galaxy-below-page {
  position: relative;
  z-index: 3;
  background: #040812;
  color: #e8eef8;
}

.galaxy-below-page[hidden] {
  display: none !important;
}

.galaxy-below-inner {
  max-width: min(1180px, calc(100vw - 48px));
  margin: 0 auto;
  padding: clamp(48px, 8vw, 96px) 0 clamp(80px, 12vw, 140px);
}

.galaxy-below-section {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(28px, 5vw, 56px);
  align-items: center;
}

.galaxy-below-copy .world-intro {
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(142, 197, 255, 0.82);
  margin: 0 0 14px;
  font-weight: 700;
}

.galaxy-below-copy h1 {
  margin: 0 0 16px;
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 700;
  max-width: 16ch;
}

.galaxy-below-copy .lead {
  font-size: clamp(1.05rem, 2vw, 1.28rem);
  line-height: 1.45;
  margin: 0 0 14px;
  color: rgba(232, 238, 248, 0.94);
}

.galaxy-below-copy .more {
  font-size: 1rem;
  line-height: 1.72;
  margin: 0 0 12px;
  color: rgba(170, 181, 207, 0.92);
  max-width: 42em;
}

.galaxy-below-copy .prose {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.galaxy-below-copy .prose li {
  position: relative;
  padding-left: 18px;
  color: rgba(198, 208, 228, 0.9);
  line-height: 1.55;
}

.galaxy-below-copy .prose li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5ec4ff, #9b6bff, #ff59b2);
}

.galaxy-below-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.galaxy-below-cta .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  border: 1px solid rgba(142, 197, 255, 0.28);
  background: rgba(255, 255, 255, 0.04);
  color: #e8eef8;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.25s var(--live-ease), border-color 0.25s, background 0.25s;
}

.galaxy-below-cta .btn:hover {
  transform: translateY(-2px);
  border-color: rgba(142, 197, 255, 0.45);
}

.galaxy-below-cta .btn-primary {
  border-color: rgba(255, 89, 178, 0.45);
  background: linear-gradient(135deg, rgba(255, 89, 178, 0.28), rgba(155, 107, 255, 0.12));
}

.galaxy-below-portrait {
  margin: 0;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(142, 197, 255, 0.18);
  background: rgba(12, 22, 40, 0.55);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.45);
}

.galaxy-below-portrait img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center 18%;
}

.galaxy-below-chapters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: clamp(40px, 7vw, 72px);
}

.galaxy-below-chapters a {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 16px;
  border-radius: 18px;
  border: 1px solid rgba(142, 197, 255, 0.14);
  background: rgba(12, 20, 38, 0.72);
  color: #e8eef8;
  text-decoration: none;
  transition: transform 0.25s var(--live-ease), border-color 0.25s;
}

.galaxy-below-chapters a:hover {
  transform: translateY(-3px);
  border-color: rgba(142, 197, 255, 0.32);
}

.galaxy-below-chapters strong {
  font-size: 1rem;
}

.galaxy-below-chapters span {
  font-size: 0.82rem;
  color: rgba(170, 181, 207, 0.88);
}

.galaxy-below-footer {
  margin-top: clamp(36px, 6vw, 64px);
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-wrap: wrap;
  gap: 16px 28px;
  align-items: center;
  justify-content: space-between;
  color: rgba(170, 181, 207, 0.88);
  font-size: 0.92rem;
}

.galaxy-below-footer a {
  color: #8ec5ff;
  text-decoration: none;
}

.galaxy-below-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .galaxy-below-section {
    grid-template-columns: 1fr;
  }
  .galaxy-below-chapters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .galaxy-below-chapters {
    grid-template-columns: 1fr;
  }
}

/* Embed-Modus (Galaxy in MULTIVERSUM-iframe) */
body.galaxy-v10-embed {
  --galaxy-bar-h: 0px !important;
  --site-header-h: 0px !important;
  --galaxy-chrome-h: 0px !important;
}

body.galaxy-v10-embed .mv4-bar,
body.galaxy-v10-embed .site-header,
body.galaxy-v10-embed .experience-rail,
body.galaxy-v10-embed .menu-overlay,
body.galaxy-v10-embed .preview-badge {
  display: none !important;
}

body.galaxy-v10-embed #galaxyBelowPage {
  display: none !important;
}

body.galaxy-v10-embed:not(.galaxy-released) .alex-live-galaxy {
  top: 0 !important;
  height: 100vh !important;
}

body.galaxy-v10-embed:not(.galaxy-released) .galaxy-viewport {
  height: 100vh !important;
}
`;

const SUBPAGE_LABELS = ["Über mich", "Leistungen", "Projekte", "Kontakt"];
const SUBPAGE_SLOTS = ["subpage-1", "subpage-2", "subpage-3", "subpage-4"];

/** Kapitel-IDs (data-go) → URL-Hash wie auf alexlamberti.ch */
const CHAPTER_HASH = {
  about: "#ueber-mich",
  leistungen: "#leistungen",
  projects: "#projekte",
  contact: "#kontakt",
};

function chapterHref(page, goChapter) {
  const hash = CHAPTER_HASH[goChapter] || "";
  return hash ? `${page}${hash}` : page;
}

const WORLDS = {
  multiversum: {
    page: "../MULTIVERSUM.html",
    label: "MULTIVERSUM",
    lead: "Was ist MULTIVERSUM?",
    body: "Die Übersichtswelt und das verbindende Portfolio-Universum. Hier sehen Sie das Gesamtbild, bevor die Reise in die einzelnen Spezialwelten geht.",
    purpose: "Als Meta-Ebene: Strategie, Persönlichkeit und die passende Wirkung je nach Projekt — analytisch, klar oder emotional.",
    difference: "Nicht eine Spezialwelt wie NEXORA, PROFESSIONAL oder FREIRAUM, sondern das übergeordnete System, das alle drei vereint.",
    images: [
      "multiversum-ueber-mich.png",
      "multiversum-leistungen.webp",
      "multiversum-projekte.webp",
      "multiversum-kontakt.webp",
    ],
    chapters: ["about", "leistungen", "projects", "contact"],
  },
  nexora: {
    page: "../NEXORA.html",
    label: "NEXORA",
    lead: "Was ist NEXORA?",
    body: "Die Technologie-Welt für Systeme, Performance und smarte digitale Lösungen — Web, Automatisierung und technische Klarheit.",
    purpose: "Wenn Projekte technisch anspruchsvoll sind: skalierbare Strukturen, präzise Umsetzung und messbare digitale Wirkung.",
    difference: "Im Gegensatz zu PROFESSIONAL (Business-Klarheit) und FREIRAUM (Kreativität) fokussiert NEXORA auf Technologie, Logik und Systemdenken.",
    images: [
      "nexora-ueber-mich.png",
      "nexora-leistungen.webp",
      "nexora-projekte.webp",
      "nexora-kontakt.webp",
    ],
    chapters: ["about", "leistungen", "projects", "contact"],
  },
  professional: {
    page: "../PROFESSIONAL.html",
    label: "PROFESSIONAL",
    lead: "Was ist PROFESSIONAL?",
    body: "Die Business-Welt für Auftritt, Vertrauen und professionelle Markenführung — strukturiert, seriös und überzeugend.",
    purpose: "Für Unternehmen und Persönlichkeiten, die Klarheit, Glaubwürdigkeit und einen hochwertigen professionellen Eindruck brauchen.",
    difference: "Weniger technisch als NEXORA, weniger expressiv als FREIRAUM — hier steht Präzision, Ordnung und Business-Wirkung im Vordergrund.",
    images: [
      "professional-ueber-mich.png",
      "professional-leistungen.webp",
      "professional-projekte.webp",
      "professional-kontakt.webp",
    ],
    chapters: ["about", "leistungen", "projects", "contact"],
  },
  freiraum: {
    page: "../FREIRAUM.html",
    label: "FREIRAUM",
    lead: "Was ist FREIRAUM?",
    body: "Die Kreativ-Welt für Identität, Emotion und visuelle Freiheit — Design, Kampagnen und Inhalte mit Charakter.",
    purpose: "Wenn Marken und Projekte Persönlichkeit, Tiefe und ein unverwechselbares Gefühl brauchen — mutig, expressiv, menschlich.",
    difference: "Im Unterschied zu NEXORA (Technik) und PROFESSIONAL (Struktur) lebt FREIRAUM von Kreativität, Farbe und emotionaler Erzählung.",
    images: [
      "freiraum-ueber-mich.png",
      "freiraum-leistungen.webp",
      "freiraum-projekte.webp",
      "freiraum-kontakt.webp",
    ],
    chapters: ["about", "leistungen", "projects", "contact"],
  },
};

const SUBPAGE_SMALL = [
  "Persönlichkeit & Kompetenz",
  "Was ich anbiete",
  "Arbeit aus allen Welten",
  "Nächster Schritt",
];

const FINAL = {
  eyebrow: "MULTIVERSUM · Mix · Strategie · Begeisterung",
  title: "Digitale Welten. Ein Portfolio. Unendliche Möglichkeiten.",
  lead: "NEXORA, PROFESSIONAL und FREIRAUM vereint · ein Auftritt für jede Situation.",
  more: "Von hier aus öffnen sich alle vier Bereiche — wähle eine Welt oder gehe direkt zu Projekten, Leistungen, Über mich oder Kontakt.",
  more2: "",
  worldLinks: {
    multiversum: "../MULTIVERSUM.html",
    nexora: "../NEXORA.html",
    professional: "../PROFESSIONAL.html",
    freiraum: "../FREIRAUM.html",
  },
  nextLinks: {
    projekte: "../MULTIVERSUM.html#projekte",
    leistungen: "../MULTIVERSUM.html#leistungen",
    ueber: "../MULTIVERSUM.html#ueber-mich",
    kontakt: "../MULTIVERSUM.html#kontakt",
  },
};

const OVERVIEW_CENTER = {
  title: "Reise durch das Multiversum",
  body: "Scrollen startet den Flug durch ein digitales Universum. Unterwegs taucht jede Welt einzeln auf — mit Erklärung, Rolle und Unterschied zu den anderen Welten.",
};

function buildOverviewCenterTextbox() {
  return `<div class="overview-center-textbox overview-intro-textbox live-textbox" aria-label="Vier Welten Übersicht">
            <h2 data-reveal="title">${OVERVIEW_CENTER.title}</h2>
            <p class="live-more overview-intro-body" data-reveal="body">${OVERVIEW_CENTER.body}</p>
          </div>`;
}

function patchOverviewCenter(html) {
  const newBox = buildOverviewCenterTextbox();
  if (html.includes('aria-label="Vier Welten Übersicht"')) {
    return html.replace(
      /<div class="overview-center-textbox[\s\S]*?<\/div>\s*(?=<article class="overview-card")/,
      `${newBox}\n        `
    );
  }
  return html.replace(
    /<div class="overview-layer" id="overviewLayer">\s*/,
    `<div class="overview-layer" id="overviewLayer">\n        ${newBox}\n        `
  );
}

function buildTextbox(w, options = {}) {
  const { key = "", isFinal = false } = options;
  const page = isFinal ? "../MULTIVERSUM.html" : w.page;

  if (isFinal) {
    const more2 = w.more2 ? `<p class="live-more live-more--secondary">${w.more2}</p>` : "";
    return `<div class="final-textbox">
            <p class="world-eyebrow">${w.eyebrow}</p>
            <h2>${w.title}</h2>
            <p class="live-lead">${w.lead}</p>
            <p class="live-more">${w.more}</p>
            ${more2}
          </div>`;
  }

  const showWorldOpen = key && key !== "multiversum";
  const ctaRow = showWorldOpen
    ? `<div class="cta-row" data-reveal="cta">
              <a class="world-cta world-cta--primary" href="${page}">Welt öffnen</a>
            </div>`
    : "";

  return `<div class="live-textbox world-explainer-textbox">
            <p class="world-eyebrow" data-reveal="eyebrow">${w.label}</p>
            <h2 data-reveal="lead">${w.lead}</h2>
            <p class="live-more" data-reveal="what">${w.body}</p>
            <p class="live-more live-more--secondary" data-reveal="purpose">${w.purpose}</p>
            <p class="live-more live-more--diff" data-reveal="diff">${w.difference}</p>
            ${ctaRow}
          </div>`;
}

function patchSubpageMediaWrap(html) {
  return html.replace(
    /(<a class="subpage-card[^>]*>)\s*<img([^>]+)>\s*(<span>)/g,
    '$1<div class="subpage-card__media"><img$2></div>$3'
  );
}

function buildSubpagesHtml(w, key) {
  const worldName = key.toUpperCase();
  const cards = w.chapters.map((chapter, i) => {
    const href = chapterHref(w.page, chapter);
    const target = CHAPTER_HASH[chapter] || "";
    return `
            <a class="subpage-card ${SUBPAGE_SLOTS[i]}" href="${href}" data-world="${key}" data-world-link="${key}" data-go="${chapter}" data-target="${target}" data-chapter="${chapter}">
              <div class="subpage-card__media">
                <img src="assets/${w.images[i]}" alt="${worldName} ${SUBPAGE_LABELS[i]}">
              </div>
              <span>${SUBPAGE_LABELS[i]}</span>
              <small>${SUBPAGE_SMALL[i]}</small>
            </a>`;
  });
  return `<div class="world-subpages">${cards.join("\n")}
          </div>`;
}

function buildNextFinalButtons() {
  const items = [
    { title: "Projekte", small: "Arbeit aus allen Welten", img: "multiversum-projekte.webp", href: FINAL.nextLinks.projekte, go: "projects", target: "#projekte" },
    { title: "Leistungen", small: "Was ich anbiete", img: "multiversum-leistungen.webp", href: FINAL.nextLinks.leistungen, go: "leistungen", target: "#leistungen" },
    { title: "Über mich", small: "Persönlichkeit & Kompetenz", img: "multiversum-ueber-mich.png", href: FINAL.nextLinks.ueber, go: "about", target: "#ueber-mich" },
    { title: "Kontakt", small: "Nächster Schritt", img: "multiversum-kontakt.webp", href: FINAL.nextLinks.kontakt, go: "contact", target: "#kontakt" },
  ];
  const cards = items.map(
    (item) => `
          <a class="dock-card" href="${item.href}" data-world="multiversum" data-world-link="multiversum" data-go="${item.go}" data-target="${item.target}">
            <img src="assets/${item.img}" alt="${item.title}">
            <strong>${item.title}</strong>
            <small>${item.small}</small>
          </a>`
  );
  return `<nav class="next-final-buttons" aria-label="Nächste Schritte Navigation">${cards.join("\n")}
        </nav>`;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function patchWorldPanel(html, key) {
  const w = WORLDS[key];
  const panelToken = `article class="world-panel" data-world="${key}"`;
  const start = html.indexOf(panelToken);
  if (start === -1) return html;

  const panelEnd = html.indexOf("</article>", start) + 10;
  let panel = html.slice(start, panelEnd);

  panel = panel.replace(/<div class="world-subpages">[\s\S]*?<\/div>\s*(?=<div class="live-textbox">)/, buildSubpagesHtml(w, key));

  const newTextbox = buildTextbox(w, { key });
  panel = panel.replace(
    /<div class="live-textbox">[\s\S]*?(?:<div class="cta-row">[\s\S]*?<\/div>\s*)?<\/div>(?=\s*<\/article>)/,
    newTextbox
  );

  if (!panel.includes("world-sphere-link")) {
    panel = panel.replace(
      /(<div class="world-main-visual">\s*)<img class="world-sphere-img"/,
      `$1<a class="world-sphere-link" href="${w.page}" aria-label="${key.toUpperCase()} Startseite"><img class="world-sphere-img"`
    );
    panel = panel.replace(
      /(<img class="world-sphere-img"[^>]*>)(\s*<div class="world-detail-label">)/,
      `$1</a>$2`
    );
  }

  return html.slice(0, start) + panel + html.slice(panelEnd);
}

function patchOverviewSpheres(html) {
  for (const [key, w] of Object.entries(WORLDS)) {
    const re = new RegExp(
      `(overview-card" data-world="${key}"[\\s\\S]*?<div class="overview-glow"></div>\\s*)<img`,
      "m"
    );
    html = html.replace(
      re,
      `$1<a class="overview-sphere-link" href="${w.page}" aria-label="${key.toUpperCase()} Startseite"><img`
    );
    const closeRe = new RegExp(
      `(overview-card" data-world="${key}"[\\s\\S]*?<img[^>]*>)(\\s*<div class="overview-label">)`,
      "m"
    );
    html = html.replace(closeRe, `$1</a>$2`);
  }
  return html;
}

function patchScrollReveal(html) {
  const revealJs = `function easeInOutSine(t) {
        return 0.5 - Math.cos(Math.PI * clamp(t, 0, 1)) / 2;
      }

      function stageLocalProgress(stageIndex, p) {
        const s = stages[stageIndex];
        if (!s) return 0;
        return clamp((p - s.start) / Math.max(s.end - s.start, 0.0001), 0, 1);
      }

      function revealStep(t, start, span, amount) {
        return easeInOutSine(clamp((t - start) / span, 0, 1)) * amount;
      }

      function resetReveal(copyEl) {
        if (!copyEl) return;
        copyEl.querySelectorAll("[data-reveal]").forEach((el) => {
          el.style.opacity = "";
          el.style.transform = "";
        });
      }

      function worldRevealTimeline(local) {
        return clamp(local / 0.52, 0, 1);
      }

      function worldCopyHoldOpacity(stageIndex, p) {
        const local = stageLocalProgress(stageIndex, p);
        const holdUntil = 0.8;
        if (local <= holdUntil) return 1;
        return 1 - smoother(clamp((local - holdUntil) / (1 - holdUntil), 0, 1));
      }

      function applyIntroReveal(copyEl, textLocal, copyOpacity) {
        if (!copyEl) return;
        const title = copyEl.querySelector('[data-reveal="title"]');
        const body = copyEl.querySelector('[data-reveal="body"]');
        if (title) {
          const op = revealStep(textLocal, 0, 0.12, copyOpacity);
          title.style.opacity = String(op);
          title.style.transform = "translateY(" + lerp(14, 0, op / Math.max(copyOpacity, 0.001)) + "px)";
        }
        if (body) {
          const op = revealStep(textLocal, 0.14, 0.16, copyOpacity);
          body.style.opacity = String(op);
          body.style.transform = "translateY(" + lerp(14, 0, op / Math.max(copyOpacity, 0.001)) + "px)";
        }
      }

      function applyWorldReveal(copyEl, stageIndex, p) {
        if (!copyEl) return;
        const local = stageLocalProgress(stageIndex, p);
        const timeline = worldRevealTimeline(local);
        const hold = worldCopyHoldOpacity(stageIndex, p);
        const parts = {
          eyebrow: [0, 0.1, 0],
          lead: [0.05, 0.11, 12],
          what: [0.17, 0.12, 14],
          purpose: [0.32, 0.12, 14],
          diff: [0.47, 0.12, 14],
          cta: [0.62, 0.14, 10],
        };
        Object.keys(parts).forEach((key) => {
          const el = copyEl.querySelector('[data-reveal="' + key + '"]');
          if (!el) return;
          const [start, span, shift] = parts[key];
          const op = revealStep(timeline, start, span, 1) * hold;
          el.style.opacity = String(op);
          if (shift) el.style.transform = "translateY(" + lerp(shift, 0, op / Math.max(hold, 0.001)) + "px)";
        });
      }

      const worldStageByKey = { multiversum: 2, nexora: 3, professional: 4, freiraum: 5 };`;

  if (html.includes("function applyIntroReveal(")) {
    html = html.replace(
      /function easeInOutSine\(t\) \{[\s\S]*?const worldStageByKey = \{ multiversum: 2, nexora: 3, professional: 4, freiraum: 5 \};/,
      revealJs
    );
    html = html.replace(
      /applyWorldReveal\(box, stageLocalProgress\(si, p\), stageWeight\(si, p, 0\.95\)\)/g,
      "applyWorldReveal(box, si, p)"
    );
  } else {
    html = html.replace(/function updateUI\(p\) \{/, revealJs + "\n\n      function updateUI(p) {");
    html = html.replace(
      /ui\.panels\.forEach\(panel => \{\s*const isActive = activeWorld && panel\.dataset\.world === activeWorld\.key;\s*panel\.classList\.toggle\("is-active", !!isActive\);\s*\}\);/,
      `ui.panels.forEach(panel => {
          const isActive = activeWorld && panel.dataset.world === activeWorld.key;
          panel.classList.toggle("is-active", !!isActive);
          const box = panel.querySelector(".world-explainer-textbox");
          if (box && isActive) {
            const si = worldStageByKey[panel.dataset.world];
            applyWorldReveal(box, si, p);
          } else if (box) {
            resetReveal(box);
          }
        });

        const overviewCopy = document.querySelector(".overview-center-textbox");
        if (overviewCopy) {
          applyIntroReveal(overviewCopy, stageLocalProgress(1, p), overviewOpacity);
        } else {
          resetReveal(overviewCopy);
        }`
    );
  }

  return html;
}

function patchWorldStages(html) {
  return html.replace(
    /const stages = \[[\s\S]*?\{ name: "final"[\s\S]*?\}\s*\];/,
    `const stages = [
        { name: "intro", start: 0.00, end: 0.12, camera: { x: .50, y: .50, z: 1.34 } },
        { name: "overview", start: 0.12, end: 0.24, camera: { x: .50, y: .50, z: 1.12 } },
        { name: "multiversum", start: 0.24, end: 0.40, world: 0, camera: worlds[0].route },
        { name: "nexora", start: 0.40, end: 0.56, world: 1, camera: worlds[1].route },
        { name: "professional", start: 0.56, end: 0.72, world: 2, camera: worlds[2].route },
        { name: "freiraum", start: 0.72, end: 0.88, world: 3, camera: worlds[3].route },
        { name: "final", start: 0.88, end: 1.00, camera: { x: .50, y: .50, z: 1.62 } }
      ];`
  );
}

function buildPageChrome() {
  return `${buildMv4Bar()}
  <header class="site-header">
    <div class="header-left">
      <a href="${FINAL.worldLinks.multiversum}" class="brand-mark galaxy-stay" data-go="home" aria-label="Zur Startseite">Alex <span>Lamberti</span></a>
      <a href="mailto:alex.lamberti@hotmail.ch" class="header-meta galaxy-stay">E-Mail: alex.lamberti@hotmail.ch</a>
      <a href="tel:+41796678211" class="header-meta galaxy-stay">Tel: 079 667 82 11</a>
    </div>
    <button type="button" class="btn-menu" id="openMenu" aria-expanded="false" aria-controls="mainMenu">
      <span>Menü</span>
      <span class="btn-menu-lines" aria-hidden="true"><span></span><span></span></span>
    </button>
  </header>
  <nav class="experience-rail" aria-label="Hauptnavigation">
    <button type="button" class="experience-step is-active" data-go="home" data-label="Home">Home</button>
    <button type="button" class="experience-step" data-go="projects" data-label="Projekte">Projekte</button>
    <button type="button" class="experience-step" data-go="leistungen" data-label="Leistungen">Leistungen</button>
    <button type="button" class="experience-step" data-go="about" data-label="Über mich">Über mich</button>
    <button type="button" class="experience-step" data-go="contact" data-label="Kontakt">Kontakt</button>
  </nav>
  <div class="menu-overlay" id="mainMenu" role="dialog" aria-modal="true" aria-label="Hauptmenü" hidden>
    <div class="menu-panel">
      <div class="menu-head">
        <div><p class="menu-title">Menü</p></div>
        <button type="button" class="btn-close" id="closeMenu">Schliessen</button>
      </div>
      <nav class="menu-links" aria-label="Hauptnavigation">
        <a href="${FINAL.worldLinks.multiversum}" class="active galaxy-stay" data-go="home">Home</a>
        <a href="${FINAL.nextLinks.projekte}" data-go="projects">Projekte</a>
        <a href="${FINAL.nextLinks.leistungen}" data-go="leistungen">Leistungen</a>
        <a href="${FINAL.nextLinks.ueber}" data-go="about">Über mich</a>
        <a href="${FINAL.nextLinks.kontakt}" data-go="contact">Kontakt</a>
      </nav>
    </div>
  </div>`;
}

function buildMv4Bar() {
  return `<header class="mv4-bar" role="group" aria-label="Welten &amp; Steuerung">
    <nav class="mv4-worlds" aria-label="Welten wechseln">
      <button type="button" class="is-active" data-world-key="general">MULTIVERSUM</button>
      <button type="button" data-world-key="nexora">NEXORA</button>
      <button type="button" data-world-key="vertex">PROFESSIONAL</button>
      <button type="button" data-world-key="freiraum">FREIRAUM</button>
    </nav>
    <div class="mv4-actions">
      <button type="button" class="mv4-fx is-on" id="mv4-fx" aria-pressed="true" title="Weltwechsel-Effekte &amp; Sound">EFFEKTE ON</button>
      <div class="mv4-flags" aria-label="Sprache">
        <button type="button" class="mv4-flag is-active" data-lang="de" title="Deutsch" aria-label="Deutsch" aria-pressed="true">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEzLjMzMyIgZmlsbD0iIzAwMCIvPjxyZWN0IHk9IjEzLjMzMyIgd2lkdGg9IjYwIiBoZWlnaHQ9IjEzLjMzNCIgZmlsbD0iI2RkMDAwMCIvPjxyZWN0IHk9IjI2LjY2NyIgd2lkdGg9IjYwIiBoZWlnaHQ9IjEzLjMzMyIgZmlsbD0iI2ZmY2UwMCIvPjwvc3ZnPg==" alt="" />
        </button>
        <button type="button" class="mv4-flag" data-lang="en" title="English" aria-label="English" aria-pressed="false">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDEyMTY5Ii8+PHBhdGggZD0iTTAgMGw2MCA0ME02MCAwTDAgNDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI4Ii8+PHBhdGggZD0iTTAgMGw2MCA0ME02MCAwTDAgNDAiIHN0cm9rZT0iI0M4MTAyRSIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTMwIDB2NDBNMCAyMGg2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjE0Ii8+PHBhdGggZD0iTTMwIDB2NDBNMCAyMGg2MCIgc3Ryb2tlPSIjQzgxMDJFIiBzdHJva2Utd2lkdGg9IjgiLz48L3N2Zz4=" alt="" />
        </button>
        <button type="button" class="mv4-flag" data-lang="it" title="Italiano" aria-label="Italiano" aria-pressed="false">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA0MCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDA5MjQ2Ii8+PHJlY3QgeD0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNjZTJiMzciLz48L3N2Zz4=" alt="" />
        </button>
      </div>
    </div>
  </header>`;
}

function buildBelowPage() {
  const bullets = [
    "Digitale Markenauftritte mit klarer Positionierung",
    "Websites mit Fokus auf Nutzerführung, Struktur und Conversion",
    "SEO-orientierte Inhalte, die gefunden und verstanden werden",
    "Kampagnen, die Strategie, Design und Umsetzung verbinden",
  ];
  return `<div id="galaxyBelowPage" class="galaxy-below-page" hidden>
    <div class="galaxy-below-inner">
      <section class="galaxy-below-section" aria-label="Portfolio Startseite">
        <div class="galaxy-below-copy">
          <p class="world-intro">${FINAL.eyebrow}</p>
          <h1>${FINAL.title}</h1>
          <p class="lead">${FINAL.lead}</p>
          <p class="more">MULTIVERSUM ist mein übergeordnetes Portfolio: analytisch wie NEXORA, klar wie PROFESSIONAL, emotional wie FREIRAUM — je nach Projekt die passende Wirkung.</p>
          <p class="more">Ich verbinde Strategie, Technologie, Design und Umsetzung in einem System, das Marken sichtbar macht und Menschen zur richtigen Entscheidung führt.</p>
          <ul class="prose">${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
          <div class="galaxy-below-cta">
            <a class="btn btn-primary" href="${FINAL.nextLinks.projekte}" data-go="projects">Projekte ansehen</a>
            <a class="btn" href="${FINAL.nextLinks.ueber}" data-go="about">Über mich</a>
          </div>
        </div>
        <figure class="galaxy-below-portrait" aria-label="Alex Lamberti">
          <img src="assets/multiversum-ueber-mich.png" alt="Alex Lamberti" width="800" height="1000" decoding="async" />
        </figure>
      </section>
      <nav class="galaxy-below-chapters" aria-label="Kapitel">
        <a href="${FINAL.nextLinks.projekte}" data-go="projects"><strong>Projekte</strong><span>Arbeit aus allen Welten</span></a>
        <a href="${FINAL.nextLinks.leistungen}" data-go="leistungen"><strong>Leistungen</strong><span>Was ich anbiete</span></a>
        <a href="${FINAL.nextLinks.ueber}" data-go="about"><strong>Über mich</strong><span>Persönlichkeit &amp; Kompetenz</span></a>
        <a href="${FINAL.nextLinks.kontakt}" data-go="contact"><strong>Kontakt</strong><span>Nächster Schritt</span></a>
      </nav>
      <div class="galaxy-below-footer">
        <span>Weiter auf der vollständigen MULTIVERSUM-Seite</span>
        <a href="${FINAL.worldLinks.multiversum}">MULTIVERSUM.html öffnen</a>
      </div>
    </div>
  </div>`;
}

function patchSourceWorldBoxVars(html) {
  html = html.replace(
    /(\.world-panel\[data-world="professional"\] \{[\s\S]*?)--box-y: 70% !important;/,
    "$1--box-y: 58% !important;"
  );
  html = html.replace(
    /(\.world-panel\[data-world="freiraum"\] \{[\s\S]*?)--box-y: 34% !important;/,
    "$1--box-y: 40% !important;"
  );
  return html;
}

function patchGalaxyStructure(html) {
  if (!html.includes('id="galaxyViewport"')) {
    html = html.replace(/<main class="alex-live-galaxy">/, '<div class="galaxy-viewport" id="galaxyViewport">\n  <main class="alex-live-galaxy" id="galaxyRoot">');
    html = html.replace(/<\/main>\s*<script>/, `</main>\n  </div>\n  ${buildBelowPage()}\n  <script>`);
  }
  return html;
}

function patchFinalSequenceTiming(html) {
  return html.replace(
    /const centerFinalIn = smoother\(clamp\(\(p - [^)]+\) \/ [^)]+\)\);\s*const centerFinalOut = 1 - smoother\(clamp\(\(p - [^)]+\) \/ [^)]+\)\);\s*const centerFinalOpacity = clamp\(centerFinalIn \* centerFinalOut\);\s*const nextButtonsIn = smoother\(clamp\(\(p - [^)]+\) \/ [^)]+\)\);\s*const nextButtonsOut = 1 - smoother\(clamp\(\(p - [^)]+\) \/ [^)]+\)\);\s*const nextButtonsOpacity = clamp\(nextButtonsIn \* nextButtonsOut\);/,
    `const centerFinalIn = smoother(clamp((p - 0.835) / 0.035));
        const centerFinalOut = 1 - smoother(clamp((p - 0.895) / 0.048));
        const centerFinalOpacity = clamp(centerFinalIn * centerFinalOut);

        const nextButtonsIn = smoother(clamp((p - 0.958) / 0.020));
        const nextButtonsOut = 1 - smoother(clamp((p - 0.988) / 0.012));
        const nextButtonsRaw = clamp(nextButtonsIn * nextButtonsOut);
        const nextButtonsOpacity = centerFinalOpacity > 0.03 ? 0 : nextButtonsRaw;`
  );
}

function patchScrollRelease(html) {
  html = patchFinalSequenceTiming(html);
  const releaseJs = `
      let galaxyReleased = false;
      let postReleaseBuffer = 0;
      const POST_RELEASE_STEPS = 2.6;

      function updateGalaxyExitOpacity() {
        if (!galaxyReleased) return;
        const viewport = document.getElementById("galaxyViewport");
        const vh = viewport ? viewport.offsetHeight : window.innerHeight;
        const fade = clamp(window.scrollY / Math.max(vh * 0.55, 1), 0, 1);
        document.documentElement.style.setProperty("--galaxy-exit-opacity", String(1 - fade * 0.92));
      }

      function releaseToPage() {
        if (galaxyReleased) return;
        galaxyReleased = true;
        document.body.classList.add("galaxy-released");
        document.documentElement.classList.add("galaxy-released");
        const below = document.getElementById("galaxyBelowPage");
        if (below) below.removeAttribute("hidden");
        requestAnimationFrame(function () {
          const viewport = document.getElementById("galaxyViewport");
          const top = viewport ? viewport.offsetTop : 0;
          window.scrollTo({ top: top, behavior: "auto" });
          updateGalaxyExitOpacity();
        });
      }`;

  if (!html.includes("function releaseToPage()")) {
    html = html.replace(/function move\(delta\) \{/, releaseJs + "\n\n      function move(delta) {");
  }

  html = html.replace(
    /function move\(delta\) \{\s*target = clamp\(target \+ delta, 0, 1\);\s*\}/,
    `function move(delta) {
        if (galaxyReleased) return;
        const next = target + delta;
        if (next > 1 && target < 1) {
          target = 1;
          return;
        }
        if (target >= 1) {
          if (delta > 0) {
            postReleaseBuffer += Math.max(Math.abs(delta), 0.22);
            if (postReleaseBuffer >= POST_RELEASE_STEPS) releaseToPage();
          } else {
            postReleaseBuffer = Math.max(0, postReleaseBuffer + delta);
          }
          return;
        }
        target = clamp(next, 0, 1);
      }`
  );

  html = html.replace(
    /addEventListener\("wheel", \(event\) => \{\s*event\.preventDefault\(\);\s*const direction = Math\.sign\(event\.deltaY\);\s*const strength = Math\.min\(Math\.max\(Math\.abs\(event\.deltaY\) \/ 100, \.18\), 1\.0\);\s*move\(direction \* WHEEL_STEP \* strength\);\s*\}, \{ passive: false \}\);/,
    `addEventListener("wheel", (event) => {
        if (galaxyReleased) return;
        event.preventDefault();
        const direction = Math.sign(event.deltaY);
        const strength = Math.min(Math.max(Math.abs(event.deltaY) / 100, .18), 1.0);
        move(direction * WHEEL_STEP * strength);
      }, { passive: false });

      addEventListener("scroll", () => {
        updateGalaxyExitOpacity();
      }, { passive: true });`
  );

  html = html.replace(
    /addEventListener\("keydown", \(event\) => \{\s*if \(\["ArrowDown", "PageDown", " "\]\.includes\(event\.key\)\) \{\s*event\.preventDefault\(\);\s*move\(\.010\);\s*\}/,
    `addEventListener("keydown", (event) => {
        if (galaxyReleased) return;
        if (["ArrowDown", "PageDown", " "].includes(event.key)) {
          event.preventDefault();
          move(.010);
        }`
  );

  html = html.replace(
    /addEventListener\("touchmove", \(event\) => \{\s*event\.preventDefault\(\);/,
    `addEventListener("touchmove", (event) => {
        if (galaxyReleased) return;
        event.preventDefault();`
  );

  return html;
}

function patchEmbedScrollRelease(html) {
  return html.replace(
    /function releaseToPage\(\) \{\s*if \(galaxyReleased\) return;/,
    `function releaseToPage() {
        if (galaxyReleased) return;
        if (document.body.getAttribute("data-galaxy-v10") === "embed") {
          try {
            window.parent.postMessage({ type: "galaxy-v10:release-scroll" }, "*");
          } catch (e1) {}
          return;
        }`
  );
}

function patchHtml(html, options = {}) {
  const { embed = false } = options;
  html = html.replace(
    /<title>[^<]*<\/title>/,
    embed
      ? "<title>Alex Lamberti · MULTIVERSUM Galaxy</title>"
      : "<title>Alex Lamberti · Galaxy Reise Vorschau</title>"
  );

  const headInject = embed
    ? `
  <link rel="stylesheet" href="../assets/welten-world-switch-preview.css" />
  <script src="../assets/welten-world-switch-freiraum-brush-v3.js" defer></script>
  <script src="../assets/welten-world-switch-preview.js" defer></script>
  <script src="galaxy-v10-exit-bridge.js" defer></script>`
    : `
  <link rel="stylesheet" href="../assets/welten-multiversum-master.css" />
  <link rel="stylesheet" href="../assets/welten-world-switch-preview.css" />
  <script src="../assets/welten-world-switch-freiraum-brush-v3.js" defer></script>
  <script src="../assets/welten-world-switch-preview.js" defer></script>
  <script src="galaxy-v10-exit-bridge.js" defer></script>
  <script src="galaxy-v10-shell.js" defer></script>`;
  html = html.replace("</head>", `${headInject}\n</head>`);

  html = html.replace("</style>", `${LIVE_CSS}\n  </style>`);

  html = patchOverviewSpheres(html);
  html = patchOverviewCenter(html);

  for (const key of Object.keys(WORLDS)) {
    html = patchWorldPanel(html, key);
  }

  const finalBlock = buildTextbox(FINAL, { isFinal: true });
  html = html.replace(
    /<div class="final-textbox">[\s\S]*?(?:<div class="cta-row">[\s\S]*?<\/div>\s*)?<\/div>(?=\s*<nav class="final-buttons")/,
    finalBlock
  );

  html = html.replace(/<nav class="next-final-buttons"[\s\S]*?<\/nav>/, buildNextFinalButtons());

  html = html.replace(
    /<a href="#multiversum"([^>]*>[\s\S]*?<span>MULTIVERSUM<\/span>\s*<\/a>)/,
    `<a href="${FINAL.worldLinks.multiversum}"$1`
  );
  html = html.replace(
    /<a href="#nexora"([^>]*>[\s\S]*?<span>NEXORA<\/span>\s*<\/a>)/,
    `<a href="${FINAL.worldLinks.nexora}"$1`
  );
  html = html.replace(
    /<a href="#professional"([^>]*>[\s\S]*?<span>PROFESSIONAL<\/span>\s*<\/a>)/,
    `<a href="${FINAL.worldLinks.professional}"$1`
  );
  html = html.replace(
    /<a href="#freiraum"([^>]*>[\s\S]*?<span>FREIRAUM<\/span>\s*<\/a>)/,
    `<a href="${FINAL.worldLinks.freiraum}"$1`
  );

  html = html.replace(
    /<a href="#projekte"([^>]*>\s*<strong>Projekte<\/strong>)/,
    `<a href="${FINAL.nextLinks.projekte}"$1`
  );
  html = html.replace(
    /<a href="#leistungen"([^>]*>\s*<strong>Leistungen<\/strong>)/,
    `<a href="${FINAL.nextLinks.leistungen}"$1`
  );
  html = html.replace(
    /<a href="#ueber-mich"([^>]*>\s*<strong>Über mich<\/strong>)/,
    `<a href="${FINAL.nextLinks.ueber}"$1`
  );
  html = html.replace(
    /<a href="#kontakt"([^>]*>\s*<strong>Kontakt<\/strong>)/,
    `<a href="${FINAL.nextLinks.kontakt}"$1`
  );

  for (const [key, w] of Object.entries(WORLDS)) {
    const combined = `${w.body} ${w.purpose}`;
    html = html.replace(
      new RegExp(`"key": "${key}"[\\s\\S]*?"eyebrow": "[^"]*", "title": "[^"]*", "text": "[^"]*", "buttonText": "[^"]*"`),
      (match) =>
        match.replace(
          /"eyebrow": "[^"]*", "title": "[^"]*", "text": "[^"]*", "buttonText": "[^"]*"/,
          `"eyebrow": ${JSON.stringify(w.label)}, "title": ${JSON.stringify(w.lead)}, "text": ${JSON.stringify(combined)}, "buttonText": ${JSON.stringify(key === "multiversum" ? "Zur Übersicht" : "Welt öffnen")}`
        )
    );
  }

  html = html.replace(
    "<body>",
    embed
      ? `<body class="galaxy-v10-page galaxy-v10-embed mv-world-general" data-galaxy-v10="embed" data-master-world="general" data-world="general">`
      : `<body class="galaxy-v10-page mv-world-general" data-galaxy-v10="1" data-master-world="general" data-world="general">
  ${buildPageChrome()}`
  );

  html = patchSourceWorldBoxVars(html);
  html = patchSubpageMediaWrap(html);
  html = patchGalaxyStructure(html);
  html = patchScrollReveal(html);
  html = patchWorldStages(html);
  html = patchScrollRelease(html);
  if (embed) html = patchEmbedScrollRelease(html);

  return html;
}

function mimeFor(file) {
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".webp")) return "image/webp";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function embedAssets(html, assetsDir) {
  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    const full = path.join(assetsDir, file);
    const b64 = fs.readFileSync(full).toString("base64");
    const dataUri = `data:${mimeFor(file)};base64,${b64}`;
    html = html.split(`assets/${file}`).join(dataUri);
  }
  return html;
}

function main() {
  if (!fs.existsSync(sourceHtml)) {
    console.error("Quelle fehlt:", sourceHtml);
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });
  copyDir(assetsSrc, assetsOut);

  let html = fs.readFileSync(sourceHtml, "utf8");
  html = patchHtml(html, { embed: false });

  const withAssetsPath = path.join(outDir, "alexlamberti-galaxy-v10-live-style-TEST-with-assets.html");
  fs.writeFileSync(withAssetsPath, html, "utf8");

  const selfContained = embedAssets(html, assetsOut);
  const selfPath = path.join(outDir, "alexlamberti-galaxy-v10-live-style-TEST-SELF-CONTAINED.html");
  fs.writeFileSync(selfPath, selfContained, "utf8");

  // Production (live auf alexlamberti.ch/galaxy-v10/)
  const prodDir = path.join(root, "galaxy-v10");
  fs.mkdirSync(prodDir, { recursive: true });
  copyDir(assetsOut, path.join(prodDir, "assets"));
  for (const file of ["galaxy-v10-exit-bridge.js", "galaxy-v10-shell.js"]) {
    const src = path.join(outDir, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(prodDir, file));
  }
  const sourceRaw = fs.readFileSync(sourceHtml, "utf8");
  fs.writeFileSync(path.join(prodDir, "embed.html"), patchHtml(sourceRaw, { embed: true }), "utf8");
  fs.writeFileSync(path.join(prodDir, "index.html"), patchHtml(sourceRaw, { embed: false }), "utf8");
  console.log("OK:", path.join(prodDir, "embed.html"));
  console.log("OK:", path.join(prodDir, "index.html"));

  const readme = `# Galaxy V10 Live-Style — Vorschau (nicht live)

Erstellt aus V9 Final Clean Sequence + Live-Inhalte/Styles von alexlamberti.ch.

## Öffnen

1. **Empfohlen:** \`alexlamberti-galaxy-v10-live-style-TEST-SELF-CONTAINED.html\` (alle Bilder eingebettet)
2. Alternativ: \`alexlamberti-galaxy-v10-live-style-TEST-with-assets.html\` + Ordner \`assets/\`

**Wichtig:** Aus dem Projektroot öffnen (nicht per Doppelklick isoliert), damit Weltwechsel-CSS/JS und Links zu MULTIVERSUM.html etc. funktionieren.

## Enthalten

- Live-Textboxen pro Welt (Farben, Typo, Eyebrow-Pill, zwei CTAs)
- Live-Shell-Header: Weltenwechsel, Sprache, Effekte (wie alexlamberti.ch)
- Korrekte Links: Kugeln → Welt-Startseite, Unterseiten → jeweilige Welt-Sektion
- Weltwechsel-Animation + Sound beim Verlassen (wie Live-Seite)
- Scroll-Ausstieg: nach den 4 Buttons noch ~2–3 Scroll-Schritte, dann normaler Seiteninhalt darunter
- V9-Sequenz unverändert

## Neu bauen

\`\`\`bash
node scripts/build-galaxy-v10-live-style-test.mjs
\`\`\`
`;
  fs.writeFileSync(path.join(outDir, "README.md"), readme, "utf8");

  console.log("OK:", withAssetsPath);
  console.log("OK:", selfPath);
}

main();
