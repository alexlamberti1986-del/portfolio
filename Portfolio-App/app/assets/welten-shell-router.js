/**
 * Shared shell routing — world + chapter paths for alexlamberti.ch
 */
(function (root) {
  "use strict";

  var WORLD_KEYS = ["general", "nexora", "vertex", "freiraum"];
  var WORLD_SLUGS = ["", "nexora", "professional", "freiraum"];
  var CHAPTERS = ["home", "projects", "leistungen", "about", "contact", "offerte"];

  var CHAPTER_PATH = {
    home: "",
    projects: "/projekte",
    leistungen: "/leistungen",
    about: "/ueber-mich",
    contact: "/kontakt",
    offerte: "/offerte",
  };

  var PATH_CHAPTER = {
    "/": "home",
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
    "/offerte": "offerte",
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

  function isLocalDev() {
    try {
      if (
        root.WeltenDesignTestV2Path &&
        typeof root.WeltenDesignTestV2Path.isDesignTestV2Allowed === "function" &&
        root.WeltenDesignTestV2Path.isDesignTestV2Allowed()
      ) {
        /* preview hosts also allow design-test-v2 routing helpers */
      }
      if (
        root.WeltenDesignTestPath &&
        typeof root.WeltenDesignTestPath.isDesignTestAllowed === "function"
      ) {
        return root.WeltenDesignTestPath.isDesignTestAllowed();
      }
      var h = String(
        root.location && root.location.hostname ? root.location.hostname : ""
      ).toLowerCase();
      if (
        h === "alexlamberti.ch" ||
        h === "www.alexlamberti.ch" ||
        h.slice(-16) === ".alexlamberti.ch"
      ) {
        return false;
      }
      return (
        h === "localhost" ||
        h === "127.0.0.1" ||
        h === "[::1]" ||
        h === "" ||
        h.indexOf(".vercel.app") !== -1
      );
    } catch (e) {
      return false;
    }
  }

  var DESIGN_TEST_PREFIX = "/design-test";
  var DESIGN_TEST_V2_PREFIX = "/design-test-v2";

  function stripDesignTestPrefix(pathname) {
    var p = normalizePath(pathname);
    if (!isLocalDev()) {
      return {
        path: p,
        isDesignTest: false,
        isDesignTestV2: false,
        isHub: false,
      };
    }
    if (p === DESIGN_TEST_V2_PREFIX) {
      return {
        path: "/",
        isDesignTest: false,
        isDesignTestV2: true,
        isHub: true,
      };
    }
    if (p.indexOf(DESIGN_TEST_V2_PREFIX + "/") === 0) {
      return {
        path: normalizePath(p.slice(DESIGN_TEST_V2_PREFIX.length) || "/"),
        isDesignTest: false,
        isDesignTestV2: true,
        isHub: false,
      };
    }
    if (p === DESIGN_TEST_PREFIX) {
      return {
        path: "/",
        isDesignTest: true,
        isDesignTestV2: false,
        isHub: true,
      };
    }
    if (p.indexOf(DESIGN_TEST_PREFIX + "/") === 0) {
      return {
        path: normalizePath(p.slice(DESIGN_TEST_PREFIX.length) || "/"),
        isDesignTest: true,
        isDesignTestV2: false,
        isHub: false,
      };
    }
    return {
      path: p,
      isDesignTest: false,
      isDesignTestV2: false,
      isHub: false,
    };
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

  function buildPath(worldIdxOrKey, chapter, opts) {
    opts = opts || {};
    var idx =
      typeof worldIdxOrKey === "number" ? worldIdxOrKey : worldIdxFromKey(worldIdxOrKey);
    if (idx < 0 || idx > 3) idx = 0;
    chapter = CHAPTERS.indexOf(chapter) >= 0 ? chapter : "home";
    var slug = worldSlugFromIdx(idx);
    var ch = chapterPath(chapter);
    var out;
    if (!slug && !ch) out = "/";
    else if (!slug) out = ch || "/";
    else if (!ch) out = "/" + slug;
    else out = "/" + slug + ch;
    if (opts.designTestV2 && isLocalDev()) {
      out =
        out === "/" ? DESIGN_TEST_V2_PREFIX : DESIGN_TEST_V2_PREFIX + out;
    } else if (opts.designTest && isLocalDev()) {
      out = out === "/" ? DESIGN_TEST_PREFIX : DESIGN_TEST_PREFIX + out;
    }
    return out;
  }

  function parsePath(pathname) {
    var dt = stripDesignTestPrefix(pathname);
    var p = dt.path;

    if (p === "/multiversum") {
      return {
        worldIdx: 0,
        worldKey: "general",
        chapter: "home",
        known: true,
        isDesignTest: dt.isDesignTest,
        isDesignTestV2: !!dt.isDesignTestV2,
        isDesignTestHub: dt.isHub,
      };
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
          isDesignTest: dt.isDesignTest,
          isDesignTestV2: !!dt.isDesignTestV2,
          isDesignTestHub: dt.isHub,
        };
      }
      return {
        worldIdx: idx,
        worldKey: worldKeyFromIdx(idx),
        chapter: "home",
        known: false,
        isDesignTest: dt.isDesignTest,
        isDesignTestV2: !!dt.isDesignTestV2,
        isDesignTestHub: dt.isHub,
      };
    }

    if (PATH_CHAPTER[p]) {
      return {
        worldIdx: 0,
        worldKey: "general",
        chapter: PATH_CHAPTER[p],
        known: true,
        isDesignTest: dt.isDesignTest,
        isDesignTestV2: !!dt.isDesignTestV2,
        isDesignTestHub: dt.isHub,
      };
    }

    return {
      worldIdx: 0,
      worldKey: "general",
      chapter: "home",
      known: false,
      isDesignTest: dt.isDesignTest,
      isDesignTestV2: !!dt.isDesignTestV2,
      isDesignTestHub: dt.isHub,
    };
  }

  function isKnownRoute(pathname) {
    var dt = stripDesignTestPrefix(pathname);
    if (dt.isHub) return isLocalDev();
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
    DESIGN_TEST_PREFIX: DESIGN_TEST_PREFIX,
    DESIGN_TEST_V2_PREFIX: DESIGN_TEST_V2_PREFIX,
    normalizePath: normalizePath,
    buildPath: buildPath,
    parsePath: parsePath,
    isKnownRoute: isKnownRoute,
    isLocalDev: isLocalDev,
    isDesignTestPath: function (pathname) {
      return stripDesignTestPrefix(pathname).isDesignTest;
    },
    isDesignTestV2Path: function (pathname) {
      return !!stripDesignTestPrefix(pathname).isDesignTestV2;
    },
    worldIdxFromKey: worldIdxFromKey,
    worldKeyFromIdx: worldKeyFromIdx,
    worldSlugFromIdx: worldSlugFromIdx,
    chapterPath: chapterPath,
  };
})(typeof window !== "undefined" ? window : this);
