/* Feature flag note for static preview (NEXT_PUBLIC_ENABLE_WORLD_DESIGN_V2)
 *
 * This project is static HTML (not Next.js). Equivalent gate:
 * - Host must be localhost / 127.0.0.1 / *.vercel.app (never alexlamberti.ch)
 * - Path must be /design-test-v2*
 * - Optional overrides: window.__ENABLE_WORLD_DESIGN_V2 = true|false
 *   or localStorage WORLD_DESIGN_V2=1
 *
 * Default on production domain: OFF (hard block in welten-design-test-v2-path.js)
 * On preview branch: visiting /design-test-v2 enables the surface.
 */
window.__WORLD_DESIGN_V2_FLAG_DOC__ = true;
