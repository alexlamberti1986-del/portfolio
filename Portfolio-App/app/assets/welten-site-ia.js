/**
 * Welten Site IA — 5 Hauptseiten, URL-Routing, Content-Merge
 */
(function () {
  "use strict";

  var ROUTES = {
    "/": "home",
    "/projekte": "projects",
    "/leistungen": "leistungen",
    "/ueber-mich": "about",
    "/kontakt": "contact",
  };

  var PATH_BY_CHAPTER = {
    home: "/",
    projects: "/projekte",
    leistungen: "/leistungen",
    about: "/ueber-mich",
    contact: "/kontakt",
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
    { title: "Branding", desc: "Markenauftritte mit klarer Positionierung und Wiedererkennung." },
    { title: "Webdesign", desc: "Websites mit Nutzerführung, Struktur und Conversion-Fokus." },
    { title: "Marketing", desc: "Digitale Kampagnen, Content und Sichtbarkeit." },
    { title: "Strategie", desc: "Vom Ziel zur Umsetzung — durchdacht und messbar." },
    { title: "Content", desc: "SEO-orientierte Inhalte, die gefunden und verstanden werden." },
    { title: "Optimierung", desc: "Performance, SEO und Conversion kontinuierlich verbessern." },
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
    var btn = document.querySelector('[data-go="' + id + '"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }

  function syncUrl(chapter) {
    chapter = resolveChapter(chapter);
    var path = PATH_BY_CHAPTER[chapter] || "/";
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
    /* Home endet nach Hero + 2 Buttons — keine Zusatzsektionen */
  }

  function injectLeistungenGrid() {
    var slide = document.querySelector("#slide-leistungen .slide-inner");
    if (!slide || slide.querySelector(".welten-leistungen-grid")) return;

    var grid = document.createElement("div");
    grid.className = "welten-leistungen-grid";
    SERVICES.forEach(function (s) {
      var card = document.createElement("article");
      card.className = "welten-leistung-card glass-card";
      card.innerHTML = "<h3>" + s.title + "</h3><p>" + s.desc + "</p>";
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

  function enhanceContact() {
    /* Kontakt aus FINAL HTML — kein Map-Embed */
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
    var obs = new MutationObserver(function () {
      var ch = document.body.getAttribute("data-current-slide");
      if (ch) syncUrl(ch);
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
    ROUTES: ROUTES,
  };
})();
