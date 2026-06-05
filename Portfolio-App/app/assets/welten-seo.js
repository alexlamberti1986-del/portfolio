/**
 * Welten SEO — Meta, Open Graph, JSON-LD pro Kapitel
 */
(function () {
  "use strict";

  var BASE = "https://www.alexlamberti.ch";
  var OG_IMAGE = BASE + "/assets/og-image.jpg";

  var PAGES = {
    home: {
      title: "Alex Lamberti | Branding, Webseiten & digitale Erlebnisse",
      description:
        "Alex Lamberti gestaltet Branding, Webseiten, digitale Erlebnisse und Strategie — als hochwertige digitale Markenwelt in drei Welten.",
      path: "/",
    },
    projects: {
      title: "Projekte | Alex Lamberti — Webseiten, Leadformulare & Visitenkarten",
      description:
        "Ausgewählte Projekte von Alex Lamberti: Webseiten, Leadformulare und digitale Visitenkarten mit klarer Handschrift.",
      path: "/projekte",
    },
    leistungen: {
      title: "Leistungen | Alex Lamberti — Branding, Webdesign & Marketing",
      description:
        "Leistungen von Alex Lamberti: Branding, Webdesign, Marketing, Strategie, Content und Webseiten-Optimierung.",
      path: "/leistungen",
    },
    about: {
      title: "Über mich | Alex Lamberti — Digital Marketing Spezialist",
      description:
        "Wer ist Alex Lamberti? Werdegang, Arbeitsweise, Werte und Kompetenzen im Digital Marketing.",
      path: "/ueber-mich",
    },
    contact: {
      title: "Kontakt | Alex Lamberti — Telefon, E-Mail & Standort",
      description:
        "Kontakt zu Alex Lamberti: Telefon 079 667 82 11, E-Mail alex.lamberti@hotmail.ch, Standort Full-Reuenthal.",
      path: "/kontakt",
    },
  };

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
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+41796678211",
            contactType: "customer service",
            email: "alex.lamberti@hotmail.ch",
            areaServed: "CH",
            availableLanguage: ["de"],
          },
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

  function apply(chapter) {
    var page = PAGES[chapter] || PAGES.home;
    document.title = page.title;
    upsertMeta("name", "description", page.description);
    upsertLink("canonical", BASE + page.path);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", "de_CH");
    upsertMeta("property", "og:site_name", "Alex Lamberti");
    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("property", "og:url", BASE + page.path);
    upsertMeta("property", "og:image", OG_IMAGE);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:image:alt", "Alex Lamberti — Branding, Webseiten und digitale Erlebnisse");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    upsertMeta("name", "twitter:image", OG_IMAGE);
  }

  injectSchema();
  apply("home");

  document.addEventListener("welten-chapter-change", function (e) {
    if (e.detail && e.detail.chapter) apply(e.detail.chapter);
  });

  window.WeltenSEO = { apply: apply, PAGES: PAGES };
})();
