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
    var home = document.querySelector("#slide-home .home-main-block");
    if (!home || home.querySelector(".welten-home-extras")) return;

    var wrap = document.createElement("div");
    wrap.className = "welten-home-extras";
    wrap.innerHTML =
      '<section class="welten-home-highlights" aria-label="Projekt-Highlights">' +
      '<h2>Ausgewählte Projekte</h2>' +
      '<div class="welten-highlights"></div>' +
      '<div class="welten-home-cta">' +
      '<button type="button" class="btn btn-primary" data-go="projects">Alle Projekte ansehen</button>' +
      "</div></section>" +
      '<section class="welten-home-services" aria-label="Leistungsübersicht">' +
      "<h2>Leistungen im Überblick</h2>" +
      '<div class="welten-services-teaser"></div>' +
      '<div class="welten-home-cta">' +
      '<button type="button" class="btn" data-go="leistungen">Leistungen entdecken</button>' +
      '<button type="button" class="btn btn-primary" data-go="contact">Kontakt aufnehmen</button>' +
      "</div></section>";

    var hl = wrap.querySelector(".welten-highlights");
    HIGHLIGHTS.forEach(function (h) {
      var card = document.createElement("article");
      card.className = "welten-highlight-card glass-card";
      card.innerHTML =
        '<span class="wh-kicker">' + h.kicker + " · " + h.cat + "</span>" +
        "<h3>" + h.title + "</h3>" +
        '<p class="prose" style="margin:0;font-size:.9rem;">Klicken für alle Projekte.</p>';
      card.style.cursor = "pointer";
      card.addEventListener("click", function () {
        navigateToChapter(h.go);
      });
      hl.appendChild(card);
    });

    var pills = wrap.querySelector(".welten-services-teaser");
    SERVICES.forEach(function (s) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "welten-service-pill";
      pill.textContent = s.title;
      pill.addEventListener("click", function () {
        navigateToChapter("leistungen");
      });
      pills.appendChild(pill);
    });

    home.appendChild(wrap);
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
    var slide = document.querySelector("#slide-contact .glass-card");
    if (!slide || slide.querySelector(".welten-contact-cards")) return;

    var cards = document.createElement("div");
    cards.className = "welten-contact-cards";
    cards.innerHTML =
      '<a class="welten-contact-card glass-card" href="tel:+41796678211">' +
      '<span class="cc-label">Telefon</span><span class="cc-value">079 667 82 11</span>' +
      '<span class="cc-hint">Direktanruf auf Mobilgeräten</span></a>' +
      '<a class="welten-contact-card glass-card" href="mailto:alex.lamberti@hotmail.ch">' +
      '<span class="cc-label">E-Mail</span><span class="cc-value">alex.lamberti@hotmail.ch</span>' +
      '<span class="cc-hint">Schnell &amp; unkompliziert</span></a>' +
      '<a class="welten-contact-card glass-card" href="https://www.google.com/maps/search/?api=1&query=Schulweg%20603%2C%205324%20Full-Reuenthal%2C%20Schweiz" target="_blank" rel="noopener noreferrer">' +
      '<span class="cc-label">Standort</span><span class="cc-value">Full-Reuenthal, CH</span>' +
      '<span class="cc-hint">Google Maps öffnen</span></a>';

    var actions = slide.querySelector(".contact-actions");
    if (actions) {
      actions.parentNode.insertBefore(cards, actions);
    } else {
      slide.appendChild(cards);
    }

    if (!slide.querySelector(".contact-map-embed")) {
      var map = document.createElement("div");
      map.className = "contact-map-embed";
      map.innerHTML =
        '<iframe title="Standort Alex Lamberti" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
        'src="https://maps.google.com/maps?q=Schulweg+603,+5324+Full-Reuenthal,+Schweiz&output=embed"></iframe>';
      slide.appendChild(map);
    }

    if (!slide.querySelector(".welten-contact-actions-row")) {
      var row = document.createElement("div");
      row.className = "welten-contact-actions-row";
      row.innerHTML =
        '<a class="btn btn-primary" href="tel:+41796678211">Anrufen</a>' +
        '<a class="btn" href="mailto:alex.lamberti@hotmail.ch">E-Mail senden</a>';
      slide.appendChild(row);
    }
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

  function onParentChapterMessage(e) {
    if (!e.data || e.data.type !== "portfolio-go-chapter") return;
    navigateToChapter(e.data.chapter);
  }

  function apply() {
    injectHomeExtras();
    injectLeistungenGrid();
    mergeAboutContent();
    enhanceContact();
    patchNavigationClicks();
    watchChapterChanges();
    window.addEventListener("message", onParentChapterMessage);
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
    syncUrl: syncUrl,
    ROUTES: ROUTES,
  };
})();
