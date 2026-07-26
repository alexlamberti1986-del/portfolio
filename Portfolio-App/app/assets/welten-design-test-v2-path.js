/**
 * Design-Test V2 path helper.
 *
 * Live default: V2 is the production site (no /design-test-v2 URL prefix).
 * World iframe HTML still lives under /design-test-v2/worlds/* (static content).
 *
 * Override:
 *   window.__WORLD_DEFAULT_V2 = false  → fall back to classic live worlds
 *   data-world-default-v2="0" on <html>
 */
(function (root) {
  "use strict";

  var CONTENT_PREFIX = "/design-test-v2";
  var LEGACY_CHAPTERS = {
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
    "/offerte": "offerte",
    "/werke": "projects",
    "/cases": "projects",
    "/referenzen": "projects",
    "/collage": "projects",
    "/nexus": "leistungen",
    "/module": "leistungen",
    "/mandate": "leistungen",
    "/disziplinen": "leistungen",
    "/profil": "about",
    "/core": "about",
    "/haltung": "about",
    "/portrait": "about",
    "/signal": "contact",
    "/uplink": "contact",
    "/gespraech": "contact",
    "/impuls": "contact",
  };

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

  /** V2 is the live site unless explicitly disabled. */
  function isLiveDefaultV2() {
    try {
      if (root.__WORLD_DEFAULT_V2 === false) return false;
      if (root.__WORLD_DEFAULT_V2 === true) return true;
      var doc = root.document;
      if (doc && doc.documentElement) {
        var flag = doc.documentElement.getAttribute("data-world-default-v2");
        if (flag === "0") return false;
        if (flag === "1") return true;
      }
      return true;
    } catch (e) {
      return true;
    }
  }

  function isFeatureFlagOn() {
    try {
      if (root.__ENABLE_WORLD_DESIGN_V2 === false) return false;
      if (root.__ENABLE_WORLD_DESIGN_V2 === true) return true;
      if (root.localStorage && root.localStorage.getItem("WORLD_DESIGN_V2") === "1") {
        return true;
      }
      return true;
    } catch (e) {
      return true;
    }
  }

  function isDesignTestV2Allowed() {
    if (!isFeatureFlagOn()) return false;
    if (isLiveDefaultV2()) return true;
    if (isProductionHost()) return false;
    if (!isPreviewHost()) return false;
    return true;
  }

  /** Public URL prefix for world/nav links (empty when V2 is live default). */
  function publicPrefix() {
    if (isLiveDefaultV2()) return "";
    return CONTENT_PREFIX;
  }

  function normalize(pathname) {
    var p = String(pathname || "/").split("?")[0].split("#")[0];
    p = p.replace(/\/+$/, "") || "/";
    return p;
  }

  function isWorldShellPath(p) {
    if (p === "/multiversum" || p.indexOf("/multiversum/") === 0) return true;
    if (p === "/nexora" || p.indexOf("/nexora/") === 0) return true;
    if (p === "/professional" || p.indexOf("/professional/") === 0) return true;
    if (p === "/freiraum" || p.indexOf("/freiraum/") === 0) return true;
    if (Object.prototype.hasOwnProperty.call(LEGACY_CHAPTERS, p)) return true;
    return false;
  }

  function parse(pathname) {
    var p = normalize(pathname);
    var allowed = isDesignTestV2Allowed();
    var liveDefault = isLiveDefaultV2();
    var underContent = p === CONTENT_PREFIX || p.indexOf(CONTENT_PREFIX + "/") === 0;
    var isHub = false;
    var isDesignTestV2 = false;
    var routePath = p;

    if (!allowed) {
      return {
        isLocal: false,
        isDesignTestV2: false,
        isHub: false,
        isLiveDefault: liveDefault,
        rawPath: p,
        routePath: p,
        PREFIX: publicPrefix(),
        CONTENT_PREFIX: CONTENT_PREFIX,
      };
    }

    if (liveDefault) {
      /* / = welcome hub (static). Shell only for world/chapter paths. */
      isHub = p === "/" || p === CONTENT_PREFIX;
      if (underContent && p !== CONTENT_PREFIX) {
        routePath = normalize(p.slice(CONTENT_PREFIX.length) || "/");
        isDesignTestV2 = isWorldShellPath(routePath) || routePath === "/";
        if (routePath === "/") {
          isHub = true;
          isDesignTestV2 = false;
        }
      } else if (isWorldShellPath(p)) {
        isDesignTestV2 = true;
        routePath = p;
      } else {
        isDesignTestV2 = false;
        routePath = p;
      }
    } else {
      isHub = p === CONTENT_PREFIX;
      isDesignTestV2 = underContent;
      if (isDesignTestV2 && !isHub) {
        routePath = normalize(p.slice(CONTENT_PREFIX.length) || "/");
      }
    }

    return {
      isLocal: allowed,
      isDesignTestV2: !!isDesignTestV2,
      isHub: !!isHub,
      isLiveDefault: liveDefault,
      rawPath: p,
      routePath: routePath,
      PREFIX: publicPrefix(),
      CONTENT_PREFIX: CONTENT_PREFIX,
    };
  }

  function applyDocumentFlags(doc) {
    doc = doc || root.document;
    if (!doc || !doc.documentElement) return parse(root.location.pathname);
    var info = parse(root.location.pathname);
    if (info.isLiveDefault) {
      doc.documentElement.setAttribute("data-world-default-v2", "1");
    }
    if (info.isDesignTestV2 || (info.isLiveDefault && info.isDesignTestV2)) {
      doc.documentElement.setAttribute("data-design-test-v2", "1");
      doc.documentElement.setAttribute("data-design-test-v2-local", info.isLiveDefault ? "0" : "1");
      doc.documentElement.classList.add("dt-v2-pure-templates");
      root.__ENABLE_WORLD_DESIGN_V2 = true;
    } else if (info.isLiveDefault && !info.isHub) {
      /* keep flags clear on welcome/legal pages */
      doc.documentElement.removeAttribute("data-design-test-v2");
    } else if (!info.isDesignTestV2) {
      doc.documentElement.removeAttribute("data-design-test-v2");
      doc.documentElement.removeAttribute("data-design-test-v2-local");
      doc.documentElement.classList.remove("dt-v2-pure-templates");
    }
    if (info.isDesignTestV2) {
      doc.documentElement.setAttribute("data-design-test-v2", "1");
      doc.documentElement.classList.add("dt-v2-pure-templates");
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

  function worldHref(slug, chapterPath) {
    var base = publicPrefix();
    var s = String(slug || "multiversum").toLowerCase();
    if (s === "general" || s === "vertex") s = s === "vertex" ? "professional" : "multiversum";
    var path = (base || "") + "/" + s;
    if (chapterPath) path += String(chapterPath).charAt(0) === "/" ? chapterPath : "/" + chapterPath;
    return path;
  }

  function hubHref() {
    return publicPrefix() ? publicPrefix() + "/" : "/";
  }

  root.WeltenDesignTestV2Path = {
    PREFIX: CONTENT_PREFIX,
    CONTENT_PREFIX: CONTENT_PREFIX,
    publicPrefix: publicPrefix,
    isLiveDefaultV2: isLiveDefaultV2,
    isDesignTestV2Allowed: isDesignTestV2Allowed,
    isProductionHost: isProductionHost,
    isFeatureFlagOn: isFeatureFlagOn,
    parse: parse,
    applyDocumentFlags: applyDocumentFlags,
    worldKeyFromRoutePath: worldKeyFromRoutePath,
    worldHref: worldHref,
    hubHref: hubHref,
    normalize: normalize,
  };

  try {
    if (typeof root.__WORLD_DEFAULT_V2 === "undefined") {
      root.__WORLD_DEFAULT_V2 = true;
    }
    applyDocumentFlags();
  } catch (eApply) {}
})(typeof window !== "undefined" ? window : this);
