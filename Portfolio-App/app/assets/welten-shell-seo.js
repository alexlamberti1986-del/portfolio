/**
 * Shell SEO — Meta, Canonical, OG für Welt + Kapitel (Produktion)
 */
(function () {
  "use strict";

  if (!document.body || document.body.getAttribute("data-live-shell") !== "1") return;

  var BASE = "https://www.alexlamberti.ch";
  var OG_IMAGE = BASE + "/assets/og-image.jpg";
  var Router = window.WeltenShellRouter;

  var WORLD_HOME = {
    general: {
      de: {
        title: "Alex Lamberti | Webdesign, Marketing & Digitale Strategie",
        description:
          "Alex Lamberti entwickelt individuelle Websites, digitale Marketinglösungen und klare Strategien. Entdecke das Multiversum mit NEXORA, PROFESSIONAL und FREIRAUM.",
      },
      en: {
        title: "Alex Lamberti | Web design, marketing & digital strategy",
        description:
          "Alex Lamberti builds individual websites, digital marketing solutions and clear strategies across the Multiverse with NEXORA, PROFESSIONAL and FREIRAUM.",
      },
    },
    nexora: {
      de: {
        title: "NEXORA | Alex Lamberti · Digitale Zukunftswelt",
        description:
          "NEXORA von Alex Lamberti: Raum für neue Möglichkeiten, Systeme und Konzepte jenseits klassischer digitaler Lösungen.",
      },
      en: {
        title: "NEXORA | Alex Lamberti · Digital future world",
        description:
          "NEXORA by Alex Lamberti: space for new possibilities, systems and concepts beyond classic digital solutions.",
      },
    },
    vertex: {
      de: {
        title: "PROFESSIONAL | Alex Lamberti · Projekte & Zusammenarbeit",
        description:
          "PROFESSIONAL von Alex Lamberti: konkrete Leistungen, ausgewählte Arbeiten und der Weg von der Idee bis zur Umsetzung.",
      },
      en: {
        title: "PROFESSIONAL | Alex Lamberti · Projects & collaboration",
        description:
          "PROFESSIONAL by Alex Lamberti: concrete services, selected work and the path from idea to delivery.",
      },
    },
    freiraum: {
      de: {
        title: "FREIRAUM | Alex Lamberti · Kreativität & Experimente",
        description:
          "FREIRAUM von Alex Lamberti: kreative Versuche, visuelle Studien und freie Projekte mit Raum für Neugier.",
      },
      en: {
        title: "FREIRAUM | Alex Lamberti · Creativity & experiments",
        description:
          "FREIRAUM by Alex Lamberti: creative experiments, visual studies and free projects driven by curiosity.",
      },
    },
  };

  var WORLD_LABEL = {
    general: { de: "Multiversum", en: "Multiverse" },
    nexora: { de: "NEXORA", en: "NEXORA" },
    vertex: { de: "PROFESSIONAL", en: "PROFESSIONAL" },
    freiraum: { de: "FREIRAUM", en: "FREIRAUM" },
  };

  function getLang() {
    return window.WeltenTranslations ? window.WeltenTranslations.getLang() : "de";
  }

  function normalizeLang(lang) {
    if (window.WeltenTranslations) return window.WeltenTranslations.normalizeLang(lang || getLang());
    lang = String(lang || "de").toLowerCase();
    return lang === "en" || lang === "fr" || lang === "it" ? lang : "de";
  }

  function worldKeyFromIdx(idx) {
    if (Router) return Router.worldKeyFromIdx(idx);
    return ["general", "nexora", "vertex", "freiraum"][idx] || "general";
  }

  function pathFor(worldIdx, chapter) {
    if (Router) return Router.buildPath(worldIdx, chapter);
    return chapter === "home" ? "/" : "/" + chapter;
  }

  function chapterMeta(chapter, lang) {
    if (window.WeltenTranslations) {
      var seo = window.WeltenTranslations.pack("seo." + chapter, lang);
      if (seo && seo.title) {
        return { title: seo.title, description: seo.description };
      }
    }
    return {
      title: "Alex Lamberti Multiversum für digitale Welten",
      description:
        "Entdecke das Multiversum von Alex Lamberti mit NEXORA, PROFESSIONAL und FREIRAUM. Digital Marketing, Webdesign und Strategie in vier digitalen Welten.",
    };
  }

  function worldHomeMeta(worldKey, lang) {
    var pack = WORLD_HOME[worldKey] || WORLD_HOME.general;
    return pack[lang] || pack.en || pack.de;
  }

  function pageMeta(chapter, worldIdx, lang) {
    lang = normalizeLang(lang);
    worldIdx = typeof worldIdx === "number" ? worldIdx : 0;
    chapter = chapter || "home";
    var worldKey = worldKeyFromIdx(worldIdx);
    var path = pathFor(worldIdx, chapter);

    if (chapter === "home") {
      var home = worldHomeMeta(worldKey, lang === "de" ? "de" : "en");
      return { title: home.title, description: home.description, path: path };
    }

    var base = chapterMeta(chapter, lang);
    if (worldIdx === 0) {
      return { title: base.title, description: base.description, path: path };
    }

    var label = (WORLD_LABEL[worldKey] || WORLD_LABEL.general)[lang === "de" ? "de" : "en"];
    return {
      title: label + " · " + base.title,
      description: label + ": " + base.description,
      path: path,
    };
  }

  function upsertMeta(attr, key, content) {
    var sel = "meta[" + attr + '="' + key + '"]';
    var el = document.querySelector(sel);
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

  function injectSchema() {
    if (document.getElementById("welten-shell-schema-jsonld")) return;
    /* Only confirmed-safe fields — phone/address/jobTitle/sameAs deferred (CONTENT-TODOS) */
    var data = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": BASE + "/#person",
          name: "Alex Lamberti",
          url: BASE,
        },
        {
          "@type": "WebSite",
          "@id": BASE + "/#website",
          url: BASE,
          name: "Alex Lamberti Multiversum",
          inLanguage: "de-CH",
          publisher: { "@id": BASE + "/#person" },
        },
      ],
    };
    var script = document.createElement("script");
    script.id = "welten-shell-schema-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function routeFromLocation() {
    if (Router) return Router.parsePath(window.location.pathname || "/");
    return { worldIdx: 0, worldKey: "general", chapter: "home", known: true };
  }

  function chapterFromPath() {
    return routeFromLocation().chapter || "home";
  }

  function apply(chapter, lang, worldIdx) {
    var route = routeFromLocation();
    if (typeof worldIdx !== "number") worldIdx = route.worldIdx;
    chapter = chapter || route.chapter || "home";
    lang = normalizeLang(lang);
    var page = pageMeta(chapter, worldIdx, lang);
    document.title = page.title;
    upsertMeta("name", "description", page.description);
    upsertLink("canonical", BASE + page.path);

    var ogLocale = window.WeltenTranslations ? window.WeltenTranslations.OG_LOCALE[lang] || "de_CH" : "de_CH";

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", ogLocale);
    upsertMeta("property", "og:site_name", "Alex Lamberti");
    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("property", "og:url", BASE + page.path);
    upsertMeta("property", "og:image", OG_IMAGE);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    upsertMeta("name", "twitter:image", OG_IMAGE);
  }

  injectSchema();
  apply();

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-chapter") return;
    if (typeof e.data.chapter !== "string") return;
    var worldIdx =
      typeof e.data.worldIdx === "number"
        ? e.data.worldIdx
        : routeFromLocation().worldIdx;
    apply(e.data.chapter, getLang(), worldIdx);
  });

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-preview-lang") return;
    if (e.data.lang) apply(chapterFromPath(), e.data.lang);
  });

  window.WeltenShellSEO = {
    apply: apply,
    chapterFromPath: chapterFromPath,
    pageMeta: pageMeta,
    routeFromLocation: routeFromLocation,
  };
})();
