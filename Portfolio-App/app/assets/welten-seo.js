/**
 * Welten SEO · Meta, Open Graph, JSON-LD pro Kapitel
 */
(function () {
  "use strict";

  var BASE = "https://www.alexlamberti.ch";
  var OG_IMAGE = BASE + "/assets/og-image.jpg";

  var PATHS = {
    home: "/",
    projects: "/projekte",
    leistungen: "/leistungen",
    about: "/ueber-mich",
    contact: "/kontakt",
    offerte: "/offerte",
  };

  function getLang() {
    try {
      return localStorage.getItem("mv-preview-lang") || sessionStorage.getItem("mv-preview-lang") || "de";
    } catch (e) {
      return "de";
    }
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
    if (document.getElementById("welten-schema-jsonld")) return;
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
          address: {
            "@type": "PostalAddress",
            streetAddress: "Schulweg 603",
            addressLocality: "Full-Reuenthal",
            postalCode: "5324",
            addressCountry: "CH",
          },
        },
        {
          "@type": "Organization",
          "@id": BASE + "/#organization",
          name: "Alex Lamberti",
          url: BASE,
          logo: OG_IMAGE,
          sameAs: [],
        },
        {
          "@type": "WebSite",
          "@id": BASE + "/#website",
          url: BASE,
          name: "Alex Lamberti Portfolio",
          publisher: { "@id": BASE + "/#organization" },
          inLanguage: "de-CH",
        },
        {
          "@type": "LocalBusiness",
          "@id": BASE + "/#localbusiness",
          name: "Alex Lamberti",
          image: OG_IMAGE,
          url: BASE,
          telephone: "+41796678211",
          email: "alex.lamberti@hotmail.ch",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Schulweg 603",
            addressLocality: "Full-Reuenthal",
            postalCode: "5324",
            addressCountry: "CH",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 47.599,
            longitude: 8.204,
          },
        },
      ],
    };
    var script = document.createElement("script");
    script.id = "welten-schema-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function apply(chapter, lang) {
    chapter = chapter || "home";
    lang = window.WeltenTranslations ? window.WeltenTranslations.normalizeLang(lang || getLang()) : getLang();
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
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:image:alt", "Alex Lamberti · Branding, Websites und digitale Erlebnisse");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    upsertMeta("name", "twitter:image", OG_IMAGE);
  }

  injectSchema();
  apply("home");

  document.addEventListener("welten-chapter-change", function (e) {
    if (e.detail && e.detail.chapter) {
      apply(e.detail.chapter);
      if (window.parent !== window) {
        /* Parent URL/SEO owned by shell via portfolio-chapter from site-ia */
        return;
      }
    }
  });

  document.addEventListener("welten-lang-change", function (e) {
    if (e.detail && e.detail.lang) {
      var ch = "home";
      try {
        if (window.WeltenChapter && window.WeltenChapter.current) ch = window.WeltenChapter.current();
      } catch (err) {}
      apply(ch, e.detail.lang);
    }
  });

  window.WeltenSEO = { apply: apply };
})();
