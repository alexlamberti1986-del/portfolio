/**
 * Early shell SEO boot (sync, no defer) — sets title/description/canonical/H1
 * from pathname before deferred scripts. Does not invent contact/social facts.
 */
(function () {
  "use strict";

  var BASE = "https://www.alexlamberti.ch";

  var WORLD_HOME = {
    general: {
      title: "Alex Lamberti | Webdesign, Marketing & Digitale Strategie",
      description:
        "Alex Lamberti entwickelt individuelle Websites, digitale Marketinglösungen und klare Strategien. Entdecke das Multiversum mit NEXORA, PROFESSIONAL und FREIRAUM.",
      h1: "Alex Lamberti · Multiversum für digitale Welten",
      intro:
        "Digitale Auftritte, die Ideen in Wirkung verwandeln. Webdesign, digitales Marketing und Strategie — im Multiversum mit NEXORA, PROFESSIONAL und FREIRAUM.",
    },
    nexora: {
      title: "NEXORA | Alex Lamberti · Digitale Zukunftswelt",
      description:
        "NEXORA von Alex Lamberti: Raum für neue Möglichkeiten, Systeme und Konzepte jenseits klassischer digitaler Lösungen.",
      h1: "NEXORA · Digitale Zukunftswelt",
      intro:
        "NEXORA ist der Raum für neue Möglichkeiten, technologische Entwicklungen und Konzepte, die über klassische digitale Lösungen hinausdenken.",
    },
    vertex: {
      title: "PROFESSIONAL | Alex Lamberti · Projekte & Zusammenarbeit",
      description:
        "PROFESSIONAL von Alex Lamberti: konkrete Leistungen, ausgewählte Arbeiten und der Weg von der Idee bis zur Umsetzung.",
      h1: "PROFESSIONAL · Projekte & Zusammenarbeit",
      intro:
        "PROFESSIONAL zeigt konkrete Leistungen, ausgewählte Arbeiten und den strukturierten Weg von der ersten Idee bis zur fertigen Umsetzung.",
    },
    freiraum: {
      title: "FREIRAUM | Alex Lamberti · Kreativität & Experimente",
      description:
        "FREIRAUM von Alex Lamberti: kreative Versuche, visuelle Studien und freie Projekte mit Raum für Neugier.",
      h1: "FREIRAUM · Kreativität & Experimente",
      intro:
        "FREIRAUM ist der Ort für kreative Versuche, visuelle Studien und Projekte, bei denen Neugier wichtiger ist als ein festgelegtes Ergebnis.",
    },
  };

  var CHAPTER = {
    projects: {
      title: "Digitale Projekte und ausgewählte Arbeiten | Alex Lamberti",
      description:
        "Ausgewählte Projekte aus Webdesign, digitalem Marketing und Konzeption. Entdecke Aufgaben, Lösungswege und Umsetzungen von Alex Lamberti.",
      h1: "Aus Ideen werden konkrete digitale Lösungen.",
    },
    leistungen: {
      title: "Digitale Leistungen für Unternehmen | Alex Lamberti",
      description:
        "Webdesign, digitales Marketing und strategische Unterstützung aus einer Hand. Entdecke die digitalen Leistungen von Alex Lamberti.",
      h1: "Digitale Leistungen mit einer klaren Richtung.",
    },
    about: {
      title: "Über Alex Lamberti | Kreativität mit digitaler Struktur",
      description:
        "Lerne Alex Lamberti, seine Arbeitsweise und seinen Blick auf Webdesign, digitale Kommunikation und kreative Technologie kennen.",
      h1: "Kreativität mit Struktur und Verantwortung.",
    },
    contact: {
      title: "Kontakt und Projektanfrage | Alex Lamberti",
      description:
        "Du planst eine Website, ein digitales Marketingprojekt oder brauchst strategische Unterstützung? Nimm unverbindlich Kontakt mit Alex Lamberti auf.",
      h1: "Lass uns über dein digitales Vorhaben sprechen.",
    },
    offerte: {
      title: "Projekt besprechen | Alex Lamberti",
      description:
        "Beschreibe kurz dein Vorhaben und erhalte eine erste Einschätzung zu Leistungen und Aufwand von Alex Lamberti.",
      h1: "Projekt besprechen",
    },
  };

  var WORLD_LABEL = {
    general: "Multiversum",
    nexora: "NEXORA",
    vertex: "PROFESSIONAL",
    freiraum: "FREIRAUM",
  };

  var SLUG_TO_KEY = {
    "": "general",
    multiversum: "general",
    nexora: "nexora",
    professional: "vertex",
    freiraum: "freiraum",
  };

  var PATH_CHAPTER = {
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
    "/offerte": "offerte",
  };

  function normalizePath(pathname) {
    var p = String(pathname || "/").split("?")[0].split("#")[0];
    return p.replace(/\/+$/, "") || "/";
  }

  function parseRoute(pathname) {
    var p = normalizePath(pathname);
    if (p === "/multiversum") return { worldKey: "general", chapter: "home" };

    var parts = p === "/" ? [] : p.replace(/^\//, "").split("/");
    var slug = parts[0] || "";
    var rest = parts.length > 1 ? "/" + parts.slice(1).join("/") : "/";

    if (slug && SLUG_TO_KEY[slug] && slug !== "") {
      var chapter = PATH_CHAPTER[rest] || (rest === "/" ? "home" : "home");
      return { worldKey: SLUG_TO_KEY[slug], chapter: chapter };
    }
    if (PATH_CHAPTER[p]) return { worldKey: "general", chapter: PATH_CHAPTER[p] };
    return { worldKey: "general", chapter: "home" };
  }

  function pageMeta(route) {
    var worldKey = route.worldKey || "general";
    var chapter = route.chapter || "home";
    var path = normalizePath(location.pathname);

    if (chapter === "home") {
      var home = WORLD_HOME[worldKey] || WORLD_HOME.general;
      return {
        title: home.title,
        description: home.description,
        h1: home.h1,
        intro: home.intro,
        path: path === "/multiversum" ? "/multiversum" : path,
      };
    }

    var ch = CHAPTER[chapter] || CHAPTER.about;
    var label = WORLD_LABEL[worldKey] || WORLD_LABEL.general;
    if (worldKey === "general") {
      return {
        title: ch.title,
        description: ch.description,
        h1: ch.h1,
        intro: ch.description,
        path: path,
      };
    }
    return {
      title: label + " · " + ch.title,
      description: label + ": " + ch.description,
      h1: label + " · " + ch.h1,
      intro: label + ": " + ch.description,
      path: path,
    };
  }

  function upsertMeta(attr, key, content) {
    var el = document.querySelector("meta[" + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function upsertLink(rel, href) {
    var el = document.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }

  function applyHead(meta) {
    document.title = meta.title;
    upsertMeta("name", "description", meta.description);
    upsertLink("canonical", BASE + (meta.path || "/"));
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:url", BASE + (meta.path || "/"));
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
  }

  function applyBody(meta) {
    var main = document.getElementById("mv-shell-main");
    if (!main) return;
    var h1 = main.querySelector("h1");
    if (h1) h1.textContent = meta.h1;
    var intro = main.querySelector("h1 + p");
    if (intro && meta.intro) intro.textContent = meta.intro;
  }

  var route = parseRoute(location.pathname);
  var meta = pageMeta(route);
  applyHead(meta);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyBody(meta);
    });
  } else {
    applyBody(meta);
  }

  window.__WeltenShellSeoBoot = { route: route, meta: meta };
})();
