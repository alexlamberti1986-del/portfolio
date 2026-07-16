/**
 * Welten Site IA · 5 Hauptseiten, URL-Routing, Content-Merge
 */
(function () {
  "use strict";

  var ROUTES = {
    "/": "home",
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
    "/offerte": "offerte",
  };

  var PATH_BY_CHAPTER = {
    home: "/",
    projects: "/projekte",
    leistungen: "/leistungen",
    about: "/ueber-mich",
    contact: "/kontakt",
    offerte: "/offerte",
  };

  var ALIASES = {
    profile: "leistungen",
    values: "about",
    strengths: "leistungen",
    experience: "about",
    workstyle: "about",
    why: "about",
    faq: "about",
  };

  var HIGHLIGHTS = [
    { kicker: "Webseite", title: "genialbau.ch", cat: "Branding & Web", go: "projects" },
    { kicker: "Leadformular", title: "360clean.ch", cat: "Conversion", go: "projects" },
    { kicker: "Visitenkarte", title: "AD-RES", cat: "Digital Brand", go: "projects" },
    { kicker: "Webseite", title: "chesa-cherma.ch", cat: "Hospitality", go: "projects" },
  ];

  var SERVICES = [
    {
      title: "Webdesign",
      href: "/webdesign",
      linkLabel: "Mehr über Webdesign",
      desc:
        "Individuelle Websites mit klarer Nutzerführung, starker visueller Identität und einer technischen Basis, die auf allen relevanten Geräten überzeugt.",
    },
    {
      title: "Digital Marketing",
      href: "/digital-marketing",
      linkLabel: "Mehr über Digital Marketing",
      desc:
        "Durchdachte digitale Massnahmen, die Angebote sichtbar machen, relevante Zielgruppen erreichen und aus Aufmerksamkeit konkrete nächste Schritte entwickeln.",
    },
    {
      title: "Digitale Strategie",
      href: "/digitale-strategie",
      linkLabel: "Mehr über digitale Strategie",
      desc:
        "Struktur für digitale Vorhaben: Ziele schärfen, Möglichkeiten priorisieren und aus einzelnen Ideen einen nachvollziehbaren Plan entwickeln.",
    },
  ];

  var HOME_PROCESS = [
    {
      title: "Verstehen",
      text:
        "Zu Beginn werden Ausgangslage, Zielgruppe, Anforderungen und das gewünschte Ergebnis gemeinsam eingeordnet.",
    },
    {
      title: "Strukturieren",
      text:
        "Aus den Informationen entsteht eine klare Seitenstruktur, Priorisierung und inhaltliche Richtung.",
    },
    {
      title: "Gestalten und umsetzen",
      text:
        "Design, Inhalte, Interaktionen und Technik werden zu einem konsistenten digitalen Auftritt verbunden.",
    },
    {
      title: "Prüfen und veröffentlichen",
      text:
        "Vor dem Start werden Darstellung, Geschwindigkeit, Bedienbarkeit und technische Grundlagen sorgfältig kontrolliert.",
    },
  ];

  var HOME_FAQ = [
    {
      q: "Welche digitalen Leistungen werden angeboten?",
      a:
        "Der Schwerpunkt liegt auf Webdesign, digitalem Marketing und strategischer Begleitung. Je nach Projekt können einzelne Leistungen oder eine zusammenhängende Gesamtlösung umgesetzt werden.",
    },
    {
      q: "Kann auch eine bestehende Website optimiert werden?",
      a:
        "Ja. Bestehende Websites können hinsichtlich Gestaltung, Nutzerführung, Inhalt, Geschwindigkeit und technischer SEO-Grundlagen analysiert und gezielt weiterentwickelt werden.",
    },
    {
      q: "Wie beginnt eine Zusammenarbeit?",
      a:
        "Am Anfang steht ein unverbindliches Gespräch über die Ausgangslage, die Ziele und den gewünschten Umfang. Danach kann eine passende Vorgehensweise definiert werden.",
    },
    {
      q: "Arbeitest du auch mit Unternehmen ausserhalb deiner Region?",
      a:
        "Die Zusammenarbeit kann grundsätzlich digital und ortsunabhängig erfolgen.",
    },
    {
      q: "Was kostet ein digitales Projekt?",
      a:
        "Der Aufwand hängt vom Umfang, den benötigten Funktionen und dem gewünschten Ergebnis ab. Nach einem ersten Austausch kann der Rahmen realistisch eingeschätzt werden.",
    },
  ];

  function resolveChapter(raw) {
    if (!raw) return "home";
    var id = String(raw).toLowerCase().replace(/^#/, "").replace(/^\//, "");
    if (ALIASES[id]) return ALIASES[id];
    if (ROUTES["/" + id]) return ROUTES["/" + id];
    if (PATH_BY_CHAPTER[id]) return id;
    return id;
  }

  function chapterFromPath() {
    var pathname = window.location.pathname || "/";
    try {
      if (window.parent !== window && window.parent.location && window.parent.location.pathname) {
        pathname = window.parent.location.pathname;
      }
    } catch (e) {}
    if (window.WeltenShellRouter && typeof window.WeltenShellRouter.parsePath === "function") {
      return window.WeltenShellRouter.parsePath(pathname).chapter || "home";
    }
    var p = pathname.replace(/\/$/, "") || "/";
    if (ROUTES[p]) return ROUTES[p];
    var hash = (window.location.hash || "").replace(/^#\/?/, "");
    if (hash) return resolveChapter(hash);
    return "home";
  }

  function navigateToChapter(id) {
    id = resolveChapter(id);
    var link = document.querySelector('.menu-links a[data-go="' + id + '"]');
    if (link) {
      link.click();
      return true;
    }
    var step = document.querySelector('.experience-step[data-go="' + id + '"]');
    if (step) {
      step.click();
      return true;
    }
    /* Avoid Galaxy home chrome [data-go] — that can remount Multiversum UI mid-nav */
    var btn = document.querySelector(
      '.mv-static-hero__nav-btn[data-go="' +
        id +
        '"], #alGalaxyChapterNav [data-go="' +
        id +
        '"]'
    );
    if (btn && document.body.getAttribute("data-current-slide") === "home" && id === "home") {
      btn.click();
      return true;
    }
    return false;
  }

  function isEmbedded() {
    try {
      return window.parent && window.parent !== window;
    } catch (e) {
      return true;
    }
  }

  function currentWorldKey() {
    return (document.body && document.body.getAttribute("data-world")) || "general";
  }

  function pathForChapter(chapter) {
    chapter = resolveChapter(chapter);
    if (window.WeltenShellRouter && typeof window.WeltenShellRouter.buildPath === "function") {
      return window.WeltenShellRouter.buildPath(currentWorldKey(), chapter);
    }
    var world = currentWorldKey();
    var slug =
      world === "nexora"
        ? "/nexora"
        : world === "vertex" || world === "professional"
          ? "/professional"
          : world === "freiraum"
            ? "/freiraum"
            : "";
    var ch = PATH_BY_CHAPTER[chapter] || "/";
    if (chapter === "home") return slug || "/";
    if (!slug) return ch;
    return slug + ch;
  }

  function updateNavHrefs() {
    document.querySelectorAll("a[data-go]").forEach(function (a) {
      var go = a.getAttribute("data-go");
      if (!go) return;
      var chapter = resolveChapter(go);
      if (!PATH_BY_CHAPTER[chapter] && chapter !== "home") return;
      a.setAttribute("href", pathForChapter(chapter));
    });
  }

  function syncUrl(chapter) {
    chapter = resolveChapter(chapter);

    if (isEmbedded()) {
      try {
        window.parent.postMessage(
          {
            type: "portfolio-chapter",
            chapter: chapter,
            world: currentWorldKey(),
          },
          "*"
        );
      } catch (ePost) {}
      if (window.WeltenSEO && typeof window.WeltenSEO.apply === "function") {
        window.WeltenSEO.apply(chapter);
      }
      document.dispatchEvent(new CustomEvent("welten-chapter-change", { detail: { chapter: chapter } }));
      return;
    }

    var path = pathForChapter(chapter);
    if (window.location.pathname !== path) {
      try {
        window.history.replaceState({ chapter: chapter }, "", path);
      } catch (e) {}
    }
    if (window.WeltenSEO && typeof window.WeltenSEO.apply === "function") {
      window.WeltenSEO.apply(chapter);
    }
    document.dispatchEvent(new CustomEvent("welten-chapter-change", { detail: { chapter: chapter } }));
  }

  function injectHomeExtras() {
    var slide = document.querySelector("#slide-home .slide-inner");
    if (!slide || slide.querySelector("[data-welten-home-brief='1']")) return;

    /* Mount under home-main-block so Galaxy Walk / hero stays first-viewport clean */
    var mount = document.querySelector("#slide-home .home-main-block") || slide;
    var isMultiversum = (document.body.getAttribute("data-world") || "") === "general";

    var wrap = document.createElement("div");
    wrap.className = "welten-home-brief";
    wrap.setAttribute("data-welten-home-brief", "1");

    var benefit = document.createElement("section");
    benefit.className = "welten-home-brief__section";
    benefit.setAttribute("aria-labelledby", "welten-home-benefit-title");
    if (isMultiversum) {
      benefit.innerHTML =
        '<p class="chapter-label">Nicht nur schön, sondern sinnvoll</p>' +
        '<h2 id="welten-home-benefit-title" class="section-title">Welten entfalten Wirkung, wenn sie Orientierung schaffen.</h2>' +
        '<p class="prose">MULTIVERSUM ist mehr als ein Einstieg. Unter dem Galaxy Walk folgen klare Inhalte: worum es geht, wie Zusammenarbeit funktioniert und welche nächsten Schritte sinnvoll sind. Gestaltung, Botschaft, Nutzerführung und Technik greifen als ein digitales Erlebnis ineinander.</p>' +
        "<ul class=\"prose\">" +
        "<li>Vier Welten unter einem Portfolio-Dach</li>" +
        "<li>Klare Positionierung und verständliche Führung</li>" +
        "<li>Eigenständiges Erscheinungsbild mit System</li>" +
        "<li>Responsives Design auf allen Geräten</li>" +
        "<li>Technisch saubere Umsetzung</li>" +
        "<li>SEO-Grundlagen von Beginn an</li>" +
        "</ul>";
    } else {
      benefit.innerHTML =
        '<p class="chapter-label">Nicht nur schön, sondern sinnvoll</p>' +
        '<h2 id="welten-home-benefit-title" class="section-title">Design erhält erst dann Wert, wenn es Orientierung schafft.</h2>' +
        '<p class="prose">Eine Website soll Besucher nicht mit Möglichkeiten überfordern. Sie soll verständlich zeigen, worum es geht, Vertrauen aufbauen und den nächsten Schritt erleichtern. Deshalb werden Gestaltung, Inhalt, Nutzerführung und Technik nicht getrennt betrachtet, sondern als zusammenhängendes digitales Erlebnis entwickelt.</p>' +
        "<ul class=\"prose\">" +
        "<li>Klare Positionierung</li>" +
        "<li>Verständliche Nutzerführung</li>" +
        "<li>Eigenständiges Erscheinungsbild</li>" +
        "<li>Responsives Design</li>" +
        "<li>Technisch saubere Umsetzung</li>" +
        "<li>SEO-Grundlagen von Beginn an</li>" +
        "</ul>";
    }

    var process = document.createElement("section");
    process.className = "welten-home-brief__section";
    process.setAttribute("aria-labelledby", "welten-home-process-title");
    var processHtml =
      '<p class="chapter-label">Zusammenarbeit</p>' +
      '<h2 id="welten-home-process-title" class="section-title">Von der ersten Idee bis zur digitalen Umsetzung.</h2>' +
      '<p class="prose">' +
      (isMultiversum
        ? "Ob über Galaxy Walk oder direkt im Inhalt: ein klarer Ablauf schafft Sicherheit, reduziert unnötige Korrekturen und hält Gestaltung und Zielsetzung zusammen."
        : "Ein klarer Ablauf schafft Sicherheit, reduziert unnötige Korrekturen und sorgt dafür, dass Gestaltung und Zielsetzung nicht auseinanderdriften.") +
      "</p>" +
      '<ol class="welten-home-brief__steps">';
    HOME_PROCESS.forEach(function (step, i) {
      processHtml +=
        "<li><strong>" +
        (i + 1) +
        ". " +
        step.title +
        "</strong><span>" +
        step.text +
        "</span></li>";
    });
    processHtml += "</ol>";
    process.innerHTML = processHtml;

    var faq = document.createElement("section");
    faq.className = "welten-home-brief__section";
    faq.setAttribute("aria-labelledby", "welten-home-faq-title");
    var faqItems = isMultiversum
      ? [
          {
            q: "Was ist MULTIVERSUM?",
            a:
              "MULTIVERSUM ist das übergeordnete Portfolio: ein Einstieg über Galaxy Walk und darunter strukturierte Inhalte zu Projekten, Leistungen, Über mich und Kontakt — mit vier Welten unter einem Dach.",
          },
          {
            q: "Welche digitalen Leistungen werden angeboten?",
            a:
              "Der Schwerpunkt liegt auf Webdesign, digitalem Marketing und strategischer Begleitung. Je nach Projekt können einzelne Leistungen oder eine zusammenhängende Gesamtlösung umgesetzt werden.",
          },
          {
            q: "Wie beginnt eine Zusammenarbeit?",
            a:
              "Am Anfang steht ein unverbindliches Gespräch über die Ausgangslage, die Ziele und den gewünschten Umfang. Danach kann eine passende Vorgehensweise definiert werden.",
          },
          {
            q: "Kann auch eine bestehende Website optimiert werden?",
            a:
              "Ja. Bestehende Websites können hinsichtlich Gestaltung, Nutzerführung, Inhalt, Geschwindigkeit und technischer SEO-Grundlagen analysiert und gezielt weiterentwickelt werden.",
          },
          {
            q: "Was kostet ein digitales Projekt?",
            a:
              "Der Aufwand hängt vom Umfang, den benötigten Funktionen und dem gewünschten Ergebnis ab. Nach einem ersten Austausch kann der Rahmen realistisch eingeschätzt werden.",
          },
        ]
      : HOME_FAQ;
    var faqHtml =
      '<p class="chapter-label">FAQ</p>' +
      '<h2 id="welten-home-faq-title" class="section-title">Häufige Fragen</h2>' +
      '<div class="welten-home-brief__faq">';
    faqItems.forEach(function (item) {
      faqHtml +=
        '<details class="welten-home-brief__details"><summary>' +
        item.q +
        "</summary><p>" +
        item.a +
        "</p></details>";
    });
    faqHtml += "</div>";
    faq.innerHTML = faqHtml;

    wrap.appendChild(benefit);
    wrap.appendChild(process);
    wrap.appendChild(faq);
    mount.appendChild(wrap);
  }

  function injectLeistungenGrid() {
    var slide = document.querySelector("#slide-leistungen .slide-inner");
    if (!slide) return;

    var existing = slide.querySelector(".welten-leistungen-grid");
    if (existing) {
      if (existing.getAttribute("data-brief") === "4") return;
      existing.remove();
    }

    var grid = document.createElement("div");
    grid.className = "welten-leistungen-grid";
    grid.setAttribute("data-brief", "4");
    SERVICES.forEach(function (s) {
      var card = document.createElement("article");
      card.className = "welten-leistung-card glass-card";
      card.innerHTML =
        "<h3>" +
        s.title +
        "</h3><p>" +
        s.desc +
        '</p><p><a class="welten-leistung-link" href="' +
        s.href +
        '" target="_top" rel="noopener">' +
        s.linkLabel +
        "</a></p>";
      grid.appendChild(card);
    });

    var lanes = slide.querySelector("[data-welten-leistungen-lanes]");
    if (lanes && lanes.parentNode) {
      lanes.parentNode.insertBefore(grid, lanes);
    } else {
      slide.appendChild(grid);
    }
  }

  function mergeAboutContent() {
    var about = document.querySelector("#slide-about .slide-inner");
    if (!about || about.querySelector(".welten-about-merged")) return;

    var mergeIds = ["experience", "workstyle", "values"];
    var wrap = document.createElement("div");
    wrap.className = "welten-about-merged";

    mergeIds.forEach(function (id) {
      var src = document.querySelector('#slide-' + id + " .slide-inner");
      if (!src) return;
      var label = src.querySelector(".chapter-label");
      var title = src.querySelector(".section-title");
      var block = document.createElement("section");
      block.className = "welten-merge-block glass-card";
      if (label) {
        var lk = document.createElement("p");
        lk.className = "chapter-label";
        lk.textContent = label.textContent;
        block.appendChild(lk);
      }
      if (title) {
        var h = document.createElement("h3");
        h.textContent = title.textContent;
        block.appendChild(h);
      }
      var prose = src.querySelectorAll(".prose, .welten-values-zigzag, .card-grid");
      prose.forEach(function (el) {
        block.appendChild(el.cloneNode(true));
      });
      wrap.appendChild(block);
    });

    about.appendChild(wrap);
  }

  function refreshMergedAbout() {
    var merged = document.querySelector(".welten-about-merged");
    if (merged) merged.remove();
    mergeAboutContent();
  }

  function enhanceContact() {
    /* Kontakt aus FINAL HTML · kein Map-Embed */
  }

  function patchNavigationClicks() {
    document.addEventListener(
      "click",
      function (e) {
        var t = e.target.closest("[data-go]");
        if (!t) return;
        var raw = t.getAttribute("data-go");
        var resolved = resolveChapter(raw);
        if (resolved !== raw) {
          e.preventDefault();
          e.stopPropagation();
          navigateToChapter(resolved);
        }
      },
      true
    );
  }

  function watchChapterChanges() {
    var last = "";
    var obs = new MutationObserver(function () {
      var ch = document.body.getAttribute("data-current-slide");
      if (!ch || ch === last) return;
      last = ch;
      syncUrl(ch);
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-current-slide"] });
  }

  function initFromUrl() {
    var target = chapterFromPath();
    if (target !== "home") {
      var tries = 0;
      function attempt() {
        if (navigateToChapter(target) || ++tries > 40) return;
        setTimeout(attempt, 80);
      }
      setTimeout(attempt, 120);
    } else {
      syncUrl("home");
    }
  }

  function scrollToSection(targetHash, goChapter) {
    if (goChapter) navigateToChapter(goChapter);
    if (!targetHash) return;
    var id = String(targetHash).replace(/^#/, "");
    var sectionAliases = {
      "ueber-mich": "slide-about",
      projekte: "slide-projects",
      leistungen: "slide-leistungen",
      kontakt: "slide-contact",
      faq: "slide-about",
      expertise: "slide-about",
      "erfahrung-bildung": "slide-about",
      "werte-arbeitsweise": "slide-about",
      "naechster-schritt": "slide-contact",
      webdesign: "slide-leistungen",
      seo: "slide-leistungen",
      logo: "slide-leistungen",
      "qr-code": "slide-leistungen",
      leadformular: "slide-projects",
      print: "slide-leistungen",
      "layout-3d": "slide-leistungen",
      praesentationen: "slide-projects",
      strategie: "slide-about",
      kreativitaet: "slide-about",
      "business-design": "slide-leistungen",
    };
    var targetId = sectionAliases[id] || id;
    setTimeout(
      function () {
        var el = document.getElementById(targetId);
        if (!el) {
          el =
            document.querySelector('.slide[data-slide="' + id + '"]') ||
            document.getElementById("slide-" + id);
        }
        if (el && el.closest && el.closest(".mv-collage-anchors") && sectionAliases[id]) {
          el = document.getElementById(sectionAliases[id]);
        }
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },
      goChapter ? 380 : 120
    );
  }

  function onParentChapterMessage(e) {
    if (!e.data || e.data.type !== "portfolio-go-chapter") return;
    navigateToChapter(e.data.chapter);
  }

  function onAlexScrollMessage(e) {
    if (!e.data || e.data.type !== "alex:scroll-to-section") return;
    scrollToSection(e.data.targetHash, e.data.go);
  }

  function apply() {
    injectHomeExtras();
    injectLeistungenGrid();
    mergeAboutContent();
    enhanceContact();
    updateNavHrefs();
    patchNavigationClicks();
    watchChapterChanges();
    window.addEventListener("message", onParentChapterMessage);
    window.addEventListener("message", onAlexScrollMessage);
    initFromUrl();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  window.WeltenSiteIA = {
    resolveChapter: resolveChapter,
    navigateToChapter: navigateToChapter,
    scrollToSection: scrollToSection,
    syncUrl: syncUrl,
    updateNavHrefs: updateNavHrefs,
    pathForChapter: pathForChapter,
    refreshMergedAbout: refreshMergedAbout,
    ROUTES: ROUTES,
  };
})();
