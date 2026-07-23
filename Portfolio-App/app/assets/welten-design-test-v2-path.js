/**
 * Design-test V2 path helper — /design-test-v2 for localhost + Vercel Preview only.
 * Feature gate: path + preview host. Production alexlamberti.ch never activates.
 * Optional explicit flag: window.__ENABLE_WORLD_DESIGN_V2 or localStorage WORLD_DESIGN_V2=1
 * (maps to NEXT_PUBLIC_ENABLE_WORLD_DESIGN_V2 for static preview deploys).
 */
(function (root) {
  "use strict";

  var PREFIX = "/design-test-v2";

  function hostname() {
    try {
      return String(
        root.location && root.location.hostname ? root.location.hostname : ""
      ).toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function isProductionHost() {
    var h = hostname();
    return (
      h === "alexlamberti.ch" ||
      h === "www.alexlamberti.ch" ||
      h.slice(-16) === ".alexlamberti.ch"
    );
  }

  function isPreviewHost() {
    var h = hostname();
    if (!h) return true;
    if (h === "localhost" || h === "127.0.0.1" || h === "[::1]") return true;
    if (h.indexOf(".vercel.app") !== -1) return true;
    return false;
  }

  /** Explicit feature flag — default OFF unless preview path context or override */
  function isFeatureFlagOn() {
    try {
      if (root.__ENABLE_WORLD_DESIGN_V2 === false) return false;
      if (root.__ENABLE_WORLD_DESIGN_V2 === true) return true;
      if (root.localStorage && root.localStorage.getItem("WORLD_DESIGN_V2") === "1") {
        return true;
      }
      /* Static equivalent of NEXT_PUBLIC_ENABLE_WORLD_DESIGN_V2:
         on preview/local, visiting /design-test-v2 enables the surface. */
      return true;
    } catch (e) {
      return true;
    }
  }

  function isDesignTestV2Allowed() {
    if (isProductionHost()) return false;
    if (!isPreviewHost()) return false;
    return isFeatureFlagOn();
  }

  function normalize(pathname) {
    var p = String(pathname || "/").split("?")[0].split("#")[0];
    p = p.replace(/\/+$/, "") || "/";
    return p;
  }

  function parse(pathname) {
    var p = normalize(pathname);
    var allowed = isDesignTestV2Allowed();
    var isHub = allowed && p === PREFIX;
    var isDesignTestV2 =
      allowed && (isHub || p.indexOf(PREFIX + "/") === 0 || p === PREFIX);
    var routePath = p;

    if (isDesignTestV2 && !isHub) {
      routePath = p === PREFIX ? "/" : p.slice(PREFIX.length) || "/";
      routePath = normalize(routePath);
    }

    return {
      isLocal: allowed,
      isDesignTestV2: isDesignTestV2,
      isHub: isHub,
      rawPath: p,
      routePath: routePath,
      PREFIX: PREFIX,
    };
  }

  function applyDocumentFlags(doc) {
    doc = doc || root.document;
    if (!doc || !doc.documentElement) return parse(root.location.pathname);
    var info = parse(root.location.pathname);
    if (info.isDesignTestV2) {
      doc.documentElement.setAttribute("data-design-test-v2", "1");
      doc.documentElement.setAttribute("data-design-test-v2-local", "1");
      doc.documentElement.classList.add("dt-v2-pure-templates");
    } else {
      doc.documentElement.removeAttribute("data-design-test-v2");
      doc.documentElement.removeAttribute("data-design-test-v2-local");
      doc.documentElement.classList.remove("dt-v2-pure-templates");
    }
    return info;
  }

  function worldKeyFromRoutePath(routePath) {
    var p = normalize(routePath);
    if (p.indexOf("/nexora") === 0) return "nexora";
    if (p.indexOf("/professional") === 0) return "vertex";
    if (p.indexOf("/freiraum") === 0) return "freiraum";
    return "general";
  }

  root.WeltenDesignTestV2Path = {
    PREFIX: PREFIX,
    isDesignTestV2Allowed: isDesignTestV2Allowed,
    isProductionHost: isProductionHost,
    isFeatureFlagOn: isFeatureFlagOn,
    parse: parse,
    applyDocumentFlags: applyDocumentFlags,
    worldKeyFromRoutePath: worldKeyFromRoutePath,
    normalize: normalize,
  };

  try {
    applyDocumentFlags();
  } catch (eApply) {}
})(typeof window !== "undefined" ? window : this);
