/**
 * Shell SEO — Meta, Canonical, OG für 3-Welten-Master (Produktion)
 */
(function () {
  "use strict";

  if (!document.body || document.body.getAttribute("data-live-shell") !== "1") return;

  var BASE = "https://www.alexlamberti.ch";
  var OG_IMAGE = BASE + "/assets/og-image.jpg";

  var PATHS = {
    home: "/",
    projects: "/projekte",
    leistungen: "/leistungen",
    about: "/ueber-mich",
    contact: "/kontakt",
  };

  var ROUTE_CHAPTER = {
    "/": "home",
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
  };

  function getLang() {
    return window.WeltenTranslations ? window.WeltenTranslations.getLang() : "de";
  }

  function pageMeta(chapter, lang) {
    if (window.WeltenTranslations) {
      var seo = window.WeltenTranslations.pack("seo." + chapter, lang);
      if (seo && seo.title) {
        return {
          title: seo.title,
          description: seo.description,
          path: PATHS[chapter] || PATHS.home,
        };
      }
    }
    return {
      title: "Alex Lamberti Multiversum für digitale Welten",
      description:
        "Entdecke das Multiversum von Alex Lamberti mit NEXORA, PROFESSIONAL und FREIRAUM. Drei digitale Welten für Ideen, Projekte, Webdesign und Digital Marketing.",
      path: PATHS[chapter] || PATHS.home,
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
    var data = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": BASE + "/#person",
          name: "Alex Lamberti",
          jobTitle: "Digital Marketing Spezialist",
          email: "alex.lamberti@hotmail.ch",
          telephone: "+41796678211",
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

  function chapterFromPath() {
    var p = (window.location.pathname || "/").replace(/\/$/, "") || "/";
    return ROUTE_CHAPTER[p] || "home";
  }

  function apply(chapter, lang) {
    chapter = chapter || chapterFromPath();
    lang = window.WeltenTranslations ? window.WeltenTranslations.normalizeLang(lang || getLang()) : "de";
    var page = pageMeta(chapter, lang);
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
  apply(chapterFromPath());

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-chapter") return;
    if (typeof e.data.chapter === "string") apply(e.data.chapter);
  });

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-preview-lang") return;
    if (e.data.lang) apply(chapterFromPath(), e.data.lang);
  });

  window.WeltenShellSEO = { apply: apply, chapterFromPath: chapterFromPath };
})();
