/**
 * Shared shell routing — world + chapter paths for alexlamberti.ch
 */
(function (root) {
  "use strict";

  var WORLD_KEYS = ["general", "nexora", "vertex", "freiraum"];
  var WORLD_SLUGS = ["", "nexora", "professional", "freiraum"];
  var CHAPTERS = ["home", "projects", "leistungen", "about", "contact"];

  var CHAPTER_PATH = {
    home: "",
    projects: "/projekte",
    leistungen: "/leistungen",
    about: "/ueber-mich",
    contact: "/kontakt",
  };

  var PATH_CHAPTER = {
    "/": "home",
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
  };

  var SLUG_TO_IDX = {
    "": 0,
    multiversum: 0,
    nexora: 1,
    professional: 2,
    freiraum: 3,
  };

  var KEY_TO_IDX = {
    general: 0,
    multiversum: 0,
    nexora: 1,
    vertex: 2,
    professional: 2,
    freiraum: 3,
  };

  function normalizePath(pathname) {
    var p = String(pathname || "/").split("?")[0].split("#")[0];
    p = p.replace(/\/+$/, "") || "/";
    return p;
  }

  function worldIdxFromKey(key) {
    var idx = KEY_TO_IDX[String(key || "").toLowerCase()];
    return typeof idx === "number" ? idx : 0;
  }

  function worldKeyFromIdx(idx) {
    return WORLD_KEYS[idx] || "general";
  }

  function worldSlugFromIdx(idx) {
    return WORLD_SLUGS[idx] || "";
  }

  function chapterPath(chapter) {
    return CHAPTER_PATH[chapter] || "";
  }

  function buildPath(worldIdxOrKey, chapter) {
    var idx =
      typeof worldIdxOrKey === "number" ? worldIdxOrKey : worldIdxFromKey(worldIdxOrKey);
    if (idx < 0 || idx > 3) idx = 0;
    chapter = CHAPTERS.indexOf(chapter) >= 0 ? chapter : "home";
    var slug = worldSlugFromIdx(idx);
    var ch = chapterPath(chapter);
    if (!slug && !ch) return "/";
    if (!slug) return ch || "/";
    if (!ch) return "/" + slug;
    return "/" + slug + ch;
  }

  function parsePath(pathname) {
    var p = normalizePath(pathname);

    if (p === "/multiversum") {
      return { worldIdx: 0, worldKey: "general", chapter: "home", known: true };
    }

    var parts = p === "/" ? [] : p.replace(/^\//, "").split("/");
    var slug = parts[0] || "";
    var restParts = parts.slice(1);
    var rest = restParts.length ? "/" + restParts.join("/") : "/";

    if (slug && SLUG_TO_IDX.hasOwnProperty(slug) && slug !== "") {
      var idx = SLUG_TO_IDX[slug];
      var chapter = PATH_CHAPTER[rest] || (rest === "/" ? "home" : null);
      if (chapter) {
        return {
          worldIdx: idx,
          worldKey: worldKeyFromIdx(idx),
          chapter: chapter,
          known: true,
        };
      }
      return { worldIdx: idx, worldKey: worldKeyFromIdx(idx), chapter: "home", known: false };
    }

    if (PATH_CHAPTER[p]) {
      return {
        worldIdx: 0,
        worldKey: "general",
        chapter: PATH_CHAPTER[p],
        known: true,
      };
    }

    return { worldIdx: 0, worldKey: "general", chapter: "home", known: false };
  }

  function isKnownRoute(pathname) {
    var parsed = parsePath(pathname);
    if (!parsed.known) return false;
    var p = normalizePath(pathname);
    if (p === "/multiversum") return true;
    if (PATH_CHAPTER[p]) return true;
    var parts = p === "/" ? [] : p.replace(/^\//, "").split("/");
    if (!parts.length) return true;
    if (!SLUG_TO_IDX.hasOwnProperty(parts[0])) return false;
    if (parts.length === 1) return true;
    return !!PATH_CHAPTER["/" + parts.slice(1).join("/")];
  }

  root.WeltenShellRouter = {
    WORLD_KEYS: WORLD_KEYS,
    WORLD_SLUGS: WORLD_SLUGS,
    CHAPTERS: CHAPTERS,
    CHAPTER_PATH: CHAPTER_PATH,
    PATH_CHAPTER: PATH_CHAPTER,
    normalizePath: normalizePath,
    buildPath: buildPath,
    parsePath: parsePath,
    isKnownRoute: isKnownRoute,
    worldIdxFromKey: worldIdxFromKey,
    worldKeyFromIdx: worldKeyFromIdx,
    worldSlugFromIdx: worldSlugFromIdx,
    chapterPath: chapterPath,
  };
})(typeof window !== "undefined" ? window : this);
