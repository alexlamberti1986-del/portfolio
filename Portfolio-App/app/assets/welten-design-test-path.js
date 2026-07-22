/**
 * Design-test path helper — /design-test for localhost + Vercel Preview only.
 * Never activates on production alexlamberti.ch.
 */
(function (root) {
  "use strict";

  var PREFIX = "/design-test";

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
    /* Vercel Preview / branch deployments — not production domain */
    if (h.indexOf(".vercel.app") !== -1) return true;
    return false;
  }

  /** Design-test allowed: local or preview, never production */
  function isDesignTestAllowed() {
    if (isProductionHost()) return false;
    return isPreviewHost();
  }

  function isLocalHost() {
    return isDesignTestAllowed();
  }

  function normalize(pathname) {
    var p = String(pathname || "/").split("?")[0].split("#")[0];
    p = p.replace(/\/+$/, "") || "/";
    return p;
  }

  function parse(pathname) {
    var p = normalize(pathname);
    var allowed = isDesignTestAllowed();
    var isHub = allowed && p === PREFIX;
    var isDesignTest =
      allowed && (isHub || p.indexOf(PREFIX + "/") === 0 || p === PREFIX);
    var routePath = p;

    if (isDesignTest && !isHub) {
      routePath = p === PREFIX ? "/" : p.slice(PREFIX.length) || "/";
      routePath = normalize(routePath);
    }

    return {
      isLocal: allowed,
      isDesignTest: isDesignTest,
      isHub: isHub,
      rawPath: p,
      routePath: routePath,
    };
  }

  function applyDocumentFlags(doc) {
    doc = doc || root.document;
    if (!doc || !doc.documentElement) return parse(root.location.pathname);
    var info = parse(root.location.pathname);
    if (info.isDesignTest) {
      doc.documentElement.setAttribute("data-design-test", "1");
      doc.documentElement.setAttribute("data-design-test-local", "1");
    } else {
      doc.documentElement.removeAttribute("data-design-test");
      doc.documentElement.removeAttribute("data-design-test-local");
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

  root.WeltenDesignTestPath = {
    PREFIX: PREFIX,
    isLocalHost: isLocalHost,
    isDesignTestAllowed: isDesignTestAllowed,
    isProductionHost: isProductionHost,
    parse: parse,
    applyDocumentFlags: applyDocumentFlags,
    worldKeyFromRoutePath: worldKeyFromRoutePath,
    normalize: normalize,
  };

  try {
    applyDocumentFlags();
  } catch (eApply) {}
})(typeof window !== "undefined" ? window : this);
