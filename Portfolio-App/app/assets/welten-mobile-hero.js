/**
 * Mobile Hero — DOM + Stylesheet (NEXORA · PROFESSIONAL · FREIRAUM)
 */
(function () {
  "use strict";

  var HERO_VER = "20260706freiraum-hero";

  function heroRoot() {
    return (
      document.querySelector(".welten-mobile-relocated-hero") ||
      document.getElementById("dnaStage") ||
      document.getElementById("mvStaticHero") ||
      document.querySelector("#slide-home .home-hero-experience")
    );
  }

  function queryInHero(selector) {
    var root = heroRoot();
    if (root) {
      var scoped = root.querySelectorAll(selector);
      if (scoped.length) return scoped;
    }
    return document.querySelectorAll("#slide-home " + selector);
  }

  function isHeroElementVisible(el) {
    if (!el) return false;
    try {
      var cs = window.getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      if (parseFloat(cs.opacity) < 0.05) return false;
    } catch (e) {}
    return true;
  }

  function getMobileHomeHero() {
    var relocated = document.querySelector(".welten-mobile-relocated-hero");
    if (relocated) return relocated;

    var world = document.body.getAttribute("data-world") || "general";
    var dna =
      document.getElementById("dnaStage") ||
      document.querySelector("#slide-home .home-hero-experience");
    if (dna && (world !== "general" || isHeroElementVisible(dna))) return dna;

    if (world === "general") {
      return document.getElementById("mvStaticHero") || document.getElementById("mvParallaxHero");
    }

    return dna;
  }

  function getSlideMount(chapter) {
    if (chapter === "home") {
      return document.querySelector("#slide-home .slide-inner");
    }
    var slide = document.getElementById("slide-" + chapter);
    return slide ? slide.querySelector(".slide-inner") || slide : null;
  }

  function ensureMobileHeroHost(mount) {
    if (!mount) return null;
    var host = mount.querySelector(":scope > .welten-mobile-hero-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "welten-mobile-hero-host";
      mount.insertBefore(host, mount.firstChild);
    } else if (mount.firstElementChild !== host) {
      mount.insertBefore(host, mount.firstChild);
    }
    return host;
  }

  function ensureMobileHomePlaceholder(homeInner, hero) {
    if (!homeInner || !hero) return null;
    var ph = document.getElementById("welten-mobile-hero-home-slot");
    if (!ph) {
      ph = document.createElement("div");
      ph.id = "welten-mobile-hero-home-slot";
      ph.hidden = true;
      ph.setAttribute("aria-hidden", "true");
      homeInner.insertBefore(ph, hero);
    }
    return ph;
  }

  function restoreMobileHeroToHome() {
    var hero = document.querySelector(".welten-mobile-relocated-hero") || getMobileHomeHero();
    var homeInner = document.querySelector("#slide-home .slide-inner");
    if (!hero || !homeInner) return;
    hero.classList.remove("welten-mobile-relocated-hero");
    ["display", "visibility", "pointer-events", "height", "overflow", "width", "max-width"].forEach(function (prop) {
      hero.style.removeProperty(prop);
    });
    var ph = document.getElementById("welten-mobile-hero-home-slot");
    if (ph && ph.parentNode) {
      ph.parentNode.insertBefore(hero, ph);
      ph.remove();
    } else if (hero.parentNode !== homeInner) {
      homeInner.insertBefore(hero, homeInner.firstChild);
    }
    document.querySelectorAll(".welten-mobile-hero-host").forEach(function (host) {
      if (!host.children.length) host.remove();
    });
  }

  function stripRelocatedHeroInlineStyles(hero) {
    if (!hero) return;
    hero.querySelectorAll(
      ".dna-slide, .nexora-orbit-button, .dna-ring, .nexora-orbit-ring, .dna-orbit-group, .nexora-orbit-buttons"
    ).forEach(function (el) {
      [
        "display",
        "visibility",
        "position",
        "transform",
        "opacity",
        "left",
        "top",
        "right",
        "bottom",
        "height",
        "min-height",
        "max-height",
        "width",
        "max-width",
        "overflow",
        "touch-action",
        "pointer-events",
        "grid-template-columns",
        "gap",
      ].forEach(function (prop) {
        el.style.removeProperty(prop);
      });
      el.classList.remove("hero-button", "hero-buttons-grid", "welten-mobile-hero-grid");
    });
  }

  function relocateMobileHero() {
    document.querySelectorAll("[data-mobile-chapter-hero]").forEach(function (el) {
      el.remove();
    });

    if (!isHeroMobile()) {
      restoreMobileHeroToHome();
      document.body.classList.remove("welten-mobile-subpage-hero--on");
      return;
    }

    var active = currentChapter();
    var hero = getMobileHomeHero();
    var homeInner = document.querySelector("#slide-home .slide-inner");

    if (!hero || !homeInner) return;

    if (active === "home") {
      restoreMobileHeroToHome();
      document.body.classList.remove("welten-mobile-subpage-hero--on");
      markPrimaryButtons(hero, active);
      return;
    }

    var mount = getSlideMount(active);
    if (!mount) return;

    var host = ensureMobileHeroHost(mount);
    ensureMobileHomePlaceholder(homeInner, hero);
    hero.classList.add("welten-mobile-relocated-hero");
    stripRelocatedHeroInlineStyles(hero);
    host.appendChild(hero);
    suppressSubpageHeaderClutter(mount);
    scheduleSubpageCleanup(mount);
    document.body.classList.add("welten-mobile-subpage-hero--on");
    markPrimaryButtons(hero, active);
  }

  var WORLDS = {
    general: {
      title: "MULTIVERSUM",
      keywords: "VIER WELTEN · EIN ZIEL · DEINE VISION",
    },
    nexora: {
      title: "NEXORA",
      keywords: "STRATEGIE · TECHNOLOGIE · ZUKUNFT",
    },
    freiraum: {
      title: "FREIRAUM",
      keywords: "KREATIVITÄT · IDEEN · BEGEISTERUNG",
    },
    vertex: {
      title: "PROFESSIONAL",
      keywords: "STRATEGIE · STRUKTUR · WIRKUNG",
    },
  };

  /** Mobile/Tablet: aktives Kapitel oben (groß), danach 2×2 */
  var HERO_CHAPTERS = ["home", "projects", "leistungen", "about", "contact"];
  var HERO_GRID_ORDER = HERO_CHAPTERS.slice();

  var nexoraHeroRetryTimer = null;
  var mqHero = window.matchMedia("(max-width: 1024px)");
  var mqTabletLandscape = window.matchMedia(
    "(min-width: 769px) and (max-width: 1024px) and (orientation: landscape)"
  );

  function isHeroMobile() {
    return mqHero.matches;
  }

  function isHeroTitleVisible() {
    return isHeroMobile();
  }

  function removeHeroTitleDom() {
    document
      .querySelectorAll("#slide-home .welten-mobile-hero-title, #slide-home .welten-mobile-hero-meta")
      .forEach(function (el) {
        el.remove();
      });
  }

  function currentChapter() {
    var slide =
      document.body.getAttribute("data-current-slide") ||
      (document.querySelector(".slide.active[data-slide]") &&
        document.querySelector(".slide.active[data-slide]").getAttribute("data-slide"));
    if (HERO_CHAPTERS.indexOf(slide) >= 0) return slide;
    return "home";
  }

  function isHomeChapter() {
    return currentChapter() === "home";
  }

  function gridOrder(active) {
    active = active || currentChapter();
    if (HERO_CHAPTERS.indexOf(active) < 0) active = "home";
    var rest = HERO_CHAPTERS.filter(function (id) {
      return id !== active;
    });
    return [active].concat(rest);
  }

  function chapterLabels() {
    var lang = "de";
    try {
      lang =
        localStorage.getItem("mv-preview-lang") ||
        sessionStorage.getItem("mv-preview-lang") ||
        "de";
    } catch (e) {}
    var fallback = {
      de: { home: "Home", projects: "Projekte", leistungen: "Leistungen", about: "Über mich", contact: "Kontakt" },
      en: { home: "Home", projects: "Projects", leistungen: "Services", about: "About", contact: "Contact" },
      fr: { home: "Accueil", projects: "Projets", leistungen: "Services", about: "À propos", contact: "Contact" },
      it: { home: "Home", projects: "Progetti", leistungen: "Servizi", about: "Chi sono", contact: "Contatto" },
    };
    if (window.WeltenPreviewI18n && window.WeltenPreviewI18n.NAV) {
      var pack =
        (window.WeltenTranslations &&
          window.WeltenTranslations.langPack(window.WeltenPreviewI18n.NAV, lang)) ||
        window.WeltenPreviewI18n.NAV[lang] ||
        window.WeltenPreviewI18n.NAV.de;
      return pack;
    }
    return fallback[lang] || fallback.de;
  }

  function worldConfig() {
    var w = document.body.getAttribute("data-world") || "general";
    return WORLDS[w] || WORLDS.general;
  }

  function goChapter(id) {
    if (window.WeltenSiteIA && typeof window.WeltenSiteIA.navigateToChapter === "function") {
      window.WeltenSiteIA.navigateToChapter(id);
      return;
    }
    var step = document.querySelector('.experience-step[data-go="' + id + '"]');
    if (step) {
      step.click();
      return;
    }
    var link = document.querySelector('.menu-links a[data-go="' + id + '"]');
    if (link) link.click();
  }

  function releaseHeroPointerCapture() {
    document.querySelectorAll("#dnaStage, .home-hero-experience").forEach(function (hero) {
      hero.classList.remove("is-dragging");
      hero.style.touchAction = "pan-y";
      if (typeof hero.releasePointerCapture !== "function") return;
      try {
        if (typeof hero.hasPointerCapture === "function") {
          for (var i = 0; i < 20; i++) {
            if (hero.hasPointerCapture(i)) hero.releasePointerCapture(i);
          }
        }
      } catch (e) {}
    });
  }

  function ensureStylesheetLock() {
    if (!isHeroMobile()) return;
    if (document.getElementById("welten-mobile-hero-stylesheet")) return;
    var id = "welten-mobile-hero-stylesheet-lock";
    if (document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "assets/welten-mobile-hero.css?v=" + HERO_VER;
    document.body.appendChild(link);
  }

  function metaHtml(keywords) {
    return (
      '<div class="welten-mobile-hero-line" aria-hidden="true">' +
      "<span></span><span></span><span></span></div>" +
      '<p class="welten-mobile-hero-keywords">' +
      keywords +
      "</p>"
    );
  }

  function ensureTitle(container, title) {
    if (!container) return null;
    var el = container.querySelector(":scope > .welten-mobile-hero-title");
    if (!el) {
      el = document.createElement("div");
      el.className = "welten-mobile-hero-title";
      el.textContent = title;
      container.insertBefore(el, container.firstChild);
    } else {
      el.textContent = title;
    }
    return el;
  }

  function ensureMeta(container, keywords) {
    if (!container) return null;
    var meta = container.querySelector(":scope > .welten-mobile-hero-meta");
    if (!meta) {
      meta = document.createElement("div");
      meta.className = "welten-mobile-hero-meta";
      meta.innerHTML = metaHtml(keywords);
      var title = container.querySelector(":scope > .welten-mobile-hero-title");
      if (title && title.nextSibling) {
        container.insertBefore(meta, title.nextSibling);
      } else {
        var buttons =
          container.querySelector(":scope > .nexora-orbit-buttons") ||
          container.querySelector(":scope > .dna-orbit-group");
        if (buttons) {
          container.insertBefore(meta, buttons);
        } else {
          container.appendChild(meta);
        }
      }
    } else {
      var kw = meta.querySelector(".welten-mobile-hero-keywords");
      if (kw) kw.textContent = keywords;
    }
    return meta;
  }

  /** Titel → Meta → Buttons — DOM-Reihenfolge erzwingen */
  function pinOrderedChildren(parent, selectors) {
    if (!parent) return;
    var nodes = selectors
      .map(function (sel) {
        return parent.querySelector(sel);
      })
      .filter(Boolean);
    if (!nodes.length) return;
    var insertAt = parent.firstChild;
    nodes.forEach(function (el) {
      parent.insertBefore(el, insertAt);
      insertAt = el.nextSibling;
    });
  }

  function pinHomeHeroStack(container) {
    if (!container) return;
    pinOrderedChildren(container, [
      ":scope > .welten-mobile-hero-title",
      ":scope > .welten-mobile-hero-meta",
      ":scope > .nexora-orbit-buttons",
      ":scope > .dna-orbit-group",
    ]);
  }

  function pinChapterHeroStack(hero) {
    if (!hero) return;
    pinOrderedChildren(hero, [
      ".welten-mobile-hero-title",
      ".welten-mobile-hero-meta",
      ".welten-mobile-hero-grid",
    ]);
  }

  function pinGeneralHeroStack(inner) {
    if (!inner) return;
    pinOrderedChildren(inner, [
      ".mv-static-hero__title",
      ".mv-static-hero__tag",
      ".mv-static-hero__nav",
    ]);
    var eyebrow = inner.querySelector(".mv-static-hero__eyebrow");
    if (eyebrow) eyebrow.setAttribute("hidden", "");
  }

  function suppressSubpageHeaderClutter(inner) {
    if (!inner || !isHeroMobile()) return;
    inner.querySelectorAll(
      "[data-chapter-hero], :scope > .welten-page-hero, :scope > .chapter-label, :scope > .section-title"
    ).forEach(function (el) {
      el.hidden = true;
      el.style.display = "none";
    });
  }

  function scheduleSubpageCleanup(inner) {
    if (!inner) return;
    [120, 400, 900, 1600].forEach(function (ms) {
      setTimeout(function () {
        if (!isHeroMobile() || currentChapter() === "home") return;
        var mount = getSlideMount(currentChapter());
        suppressSubpageHeaderClutter(mount || inner);
      }, ms);
    });
  }

  function mountChapterHeroFirst(inner, hero) {
    if (!inner || !hero) return;
    var host = inner.querySelector(":scope > .welten-desktop-hero-host");
    if (host && isHeroMobile()) {
      inner.appendChild(host);
    }
    inner.insertBefore(hero, inner.firstChild);
    suppressSubpageHeaderClutter(inner);
    pinChapterHeroStack(hero);
  }

  function getHeroButtonContext() {
    var world = document.body.getAttribute("data-world");
    var scope = heroRoot() || document.querySelector("#slide-home");
    if (world === "general") {
      if (scope.querySelector(".dna-ring, .dna-slide")) {
        var dnaGroup = scope.querySelector(".dna-orbit-group");
        return {
          shell: dnaGroup || scope,
          ring: scope.querySelector(".dna-ring"),
          selector: ".dna-slide",
        };
      }
      var inner = scope.querySelector(".mv-static-hero__inner") || scope;
      var nav = inner.querySelector(".mv-static-hero__nav");
      return {
        shell: inner,
        ring: nav,
        selector: ".mv-static-hero__nav-btn",
      };
    }
    if (world === "nexora") {
      var shell = scope.querySelector(".nexora-orbit-buttons") || scope;
      return {
        shell: shell,
        ring: shell ? shell.querySelector(".nexora-orbit-ring") : null,
        selector: ".nexora-orbit-button",
      };
    }
    var group = scope.querySelector(".dna-orbit-group");
    return {
      shell: group || scope,
      ring: scope.querySelector(".dna-ring"),
      selector: ".dna-slide",
    };
  }

  function ensureContactRow(shell) {
    if (!shell) return null;
    var row = shell.querySelector(":scope > .hero-contact-button-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "hero-contact-button-row";
      shell.appendChild(row);
    }
    return row;
  }

  function markPrimaryButtons(root, active) {
    if (!root) return;
    root.querySelectorAll("[data-go]").forEach(function (btn) {
      var go = btn.getAttribute("data-go");
      var on = go === active;
      btn.classList.toggle("is-active", on);
      btn.classList.toggle("is-hero-primary", on);
      btn.setAttribute("aria-current", on ? "page" : "false");
    });
  }

  function orderButtonsInRing(ring, selector, active) {
    if (!ring) return;
    var buttons = Array.from(ring.querySelectorAll(selector));
    if (!buttons.length) {
      buttons = Array.from(document.querySelectorAll(selector));
    }
    if (!buttons.length) return;

    var byGo = {};
    buttons.forEach(function (btn) {
      var go = btn.getAttribute("data-go");
      if (!go || byGo[go]) {
        if (byGo[go] && btn !== byGo[go]) btn.remove();
        return;
      }
      byGo[go] = btn;
      btn.classList.add("hero-button");
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
      btn.style.setProperty("left", "auto", "important");
      btn.style.setProperty("top", "auto", "important");
      btn.style.setProperty("right", "auto", "important");
      btn.style.setProperty("bottom", "auto", "important");
    });

    gridOrder(active).forEach(function (go) {
      var btn = byGo[go];
      if (btn) ring.appendChild(btn);
    });

    markPrimaryButtons(ring, active);
    ring.classList.add("hero-buttons-grid", "welten-mobile-hero-grid");
    ring.style.setProperty("display", "grid", "important");
    ring.style.setProperty("transform", "none", "important");

    var heroRoot =
      ring.closest("[data-mobile-chapter-hero]") ||
      ring.closest("#dnaStage") ||
      ring.closest(".dna-unified-scene") ||
      ring.closest(".mv-static-hero__inner");
    if (heroRoot && heroRoot.hasAttribute("data-mobile-chapter-hero")) {
      pinChapterHeroStack(heroRoot);
    } else if (heroRoot) {
      pinHomeHeroStack(heroRoot);
    }
  }

  function restructureHeroButtons() {
    if (!isHeroMobile()) return;

    var active = currentChapter();
    var ctx = getHeroButtonContext();
    if (ctx.shell && ctx.ring) {
      var contactRow = ctx.shell.querySelector(":scope > .hero-contact-button-row");
      if (contactRow) {
        var rowContact = contactRow.querySelector("[data-go='contact']");
        if (rowContact) ctx.ring.appendChild(rowContact);
        contactRow.remove();
      }
      ctx.shell.classList.add("hero-buttons-shell");
      orderButtonsInRing(ctx.ring, ctx.selector, active);
    }

    /* MULTIVERSUM Static Hero */
    var mvHero = heroRoot();
    var staticNav = mvHero && mvHero.querySelector(".mv-static-hero__nav");
    if (staticNav) {
      staticNav.classList.add("hero-buttons-grid", "welten-mobile-hero-grid");
      orderButtonsInRing(staticNav, ".mv-static-hero__nav-btn", active);
    }
  }

  function ensureChapterHeroes() {
    if (!isHeroMobile()) {
      document.querySelectorAll("[data-mobile-chapter-hero]").forEach(function (el) {
        el.remove();
      });
    }
  }

  function buildGeneralHero() {
    if (!isHeroMobile() || document.body.getAttribute("data-world") !== "general") return;
    var dna =
      document.getElementById("dnaStage") ||
      document.querySelector("#slide-home .home-hero-experience");
    if (dna && isHeroElementVisible(dna)) {
      buildGeneralDnaHero();
      return;
    }
    var staticHero = document.getElementById("mvStaticHero");
    if (!staticHero) return;
    var inner = staticHero.querySelector(".mv-static-hero__inner");
    if (!inner) return;
    var titleEl = inner.querySelector(".mv-static-hero__title");
    if (titleEl && isHeroTitleVisible()) {
      titleEl.classList.add("welten-mobile-hero-title");
    }
    pinGeneralHeroStack(inner);
  }

  function buildGeneralDnaHero() {
    var stage =
      document.getElementById("dnaStage") ||
      document.querySelector("#slide-home .home-hero-experience");
    if (!stage) return;
    var scene = stage.querySelector(".dna-unified-scene");
    if (!scene) return;
    var cfg = WORLDS.general;
    if (isHeroTitleVisible()) {
      ensureTitle(scene, cfg.title);
      ensureMeta(scene, cfg.keywords);
    } else {
      removeHeroTitleDom();
    }
    flattenProButtons();
    restructureHeroButtons();
    pinHomeHeroStack(scene);
  }

  function resetHeroButtonDom() {
    document
      .querySelectorAll(
        ".hero-buttons-shell, .hero-buttons-grid, .hero-button, .hero-contact-button-row, .welten-mobile-hero-grid"
      )
      .forEach(function (el) {
        el.classList.remove(
          "hero-buttons-shell",
          "hero-buttons-grid",
          "hero-button",
          "welten-mobile-hero-grid"
        );
      });

    document
      .querySelectorAll(
        "#slide-home .nexora-orbit-button, #slide-home .dna-slide, " +
          "#slide-home .nexora-orbit-ring, #slide-home .dna-ring, " +
          "#slide-home .home-hero-experience, #slide-home #dnaStage, " +
          "#slide-home .nexora-orbit-buttons, #slide-home .dna-orbit-group, " +
          "#slide-home .neuro-core, #slide-home .nexora-orbit-nav"
      )
      .forEach(function (el) {
        [
          "display",
          "visibility",
          "position",
          "transform",
          "opacity",
          "left",
          "top",
          "right",
          "bottom",
          "height",
          "min-height",
          "max-height",
          "overflow",
          "touch-action",
          "pointer-events",
        ].forEach(function (prop) {
          el.style.removeProperty(prop);
        });
      });

    document.documentElement.classList.remove("welten-nexora-list", "welten-nexora-scroll-ready");

    var row = document.querySelector("#slide-home .hero-contact-button-row");
    if (!row) return;
    var contact = row.querySelector("[data-go='contact']");
    var ring =
      heroRoot() && heroRoot().querySelector(".nexora-orbit-ring, .dna-ring");
    if (contact && ring) ring.appendChild(contact);
    row.remove();
  }

  function hideMobileSideNav() {
    if (!isHeroMobile()) return;
    document
      .querySelectorAll(
        ".experience-rail, .experience-step, .side-nav, .chapter-nav, .dot-nav, .vertical-nav, .right-nav, .chapter-dots, .welten-desktop-hero-host, .welten-desktop-subpage-mv-hero"
      )
      .forEach(function (el) {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("pointer-events", "none", "important");
        el.style.setProperty("height", "0", "important");
        el.style.setProperty("overflow", "hidden", "important");
      });
  }

  function hideSubpageHomeHeroLeak() {
    /* replaced by relocateMobileHero */
  }

  function restoreHomeHeroOnMobile() {
    /* replaced by restoreMobileHeroToHome */
  }

  function disableNexoraOrbitOnMobile() {
    if (!isHeroMobile() || document.body.getAttribute("data-world") !== "nexora") return;
    document.querySelectorAll(".welten-mobile-relocated-hero .nexora-orbit-nav, #slide-home .nexora-orbit-nav").forEach(function (nav) {
      nav.style.setProperty("display", "none", "important");
      nav.style.setProperty("pointer-events", "none", "important");
    });
    var hero = heroRoot();
    if (hero) {
      hero.classList.remove("is-dragging");
      hero.style.touchAction = "pan-y";
      hero.style.overflow = "visible";
      hero.style.pointerEvents = "";
      hero.style.height = "auto";
      hero.style.minHeight = "auto";
    }
    document.querySelectorAll(".welten-mobile-relocated-hero .neuro-core, .welten-mobile-relocated-hero .nexora-orbit-nav, #slide-home .neuro-core, #slide-home .nexora-orbit-nav").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("pointer-events", "none", "important");
    });
    queryInHero(".nexora-orbit-button").forEach(function (btn) {
      btn.style.setProperty("touch-action", "pan-y", "important");
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
    });
    releaseHeroPointerCapture();
    if (window.WeltenNexoraMobileFix && typeof window.WeltenNexoraMobileFix.unlockHeroScroll === "function") {
      window.WeltenNexoraMobileFix.unlockHeroScroll();
    }
  }

  function buildNexoraHero() {
    if (!isHeroMobile() || document.body.getAttribute("data-world") !== "nexora") return;
    var stage = document.getElementById("dnaStage");
    if (!stage) return;
    var cfg = WORLDS.nexora;
    if (isHeroTitleVisible()) {
      ensureTitle(stage, cfg.title);
      ensureMeta(stage, cfg.keywords);
    } else {
      removeHeroTitleDom();
    }
    flattenNexoraButtons();
    restructureHeroButtons();
    pinHomeHeroStack(stage);
    disableNexoraOrbitOnMobile();
  }

  function scheduleNexoraHeroRetry() {
    clearTimeout(nexoraHeroRetryTimer);
    nexoraHeroRetryTimer = setTimeout(function () {
      if (!isHeroMobile() || document.body.getAttribute("data-world") !== "nexora") return;
      if (queryInHero(".nexora-orbit-button").length) {
        restructureHeroButtons();
        return;
      }
      buildNexoraHero();
    }, 200);
  }

  function buildFreiraumHero() {
    var scene = heroRoot() && heroRoot().querySelector(".dna-unified-scene");
    if (!scene) return;
    var cfg = WORLDS.freiraum;
    if (isHeroTitleVisible()) {
      ensureTitle(scene, cfg.title);
      ensureMeta(scene, cfg.keywords);
    } else {
      removeHeroTitleDom();
    }
    flattenFreiraumButtons();
    restructureHeroButtons();
    pinHomeHeroStack(scene);
  }

  function buildProfessionalHero() {
    var scene = heroRoot() && heroRoot().querySelector(".dna-unified-scene");
    if (!scene) return;
    var cfg = WORLDS.vertex;
    if (isHeroTitleVisible()) {
      ensureTitle(scene, cfg.title);
      ensureMeta(scene, cfg.keywords);
    } else {
      removeHeroTitleDom();
    }
    flattenProButtons();
    restructureHeroButtons();
    pinHomeHeroStack(scene);
  }

  function markHeroGrid(ring) {
    if (ring) ring.classList.add("welten-mobile-hero-grid");
  }

  function flattenNexoraButtons() {
    var ring = heroRoot() && heroRoot().querySelector(".nexora-orbit-ring");
    markHeroGrid(ring);
    if (ring) {
      ring.style.setProperty("display", "grid", "important");
      ring.style.setProperty("transform", "none", "important");
    }
    queryInHero(".nexora-orbit-button").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
    });
  }

  function flattenFreiraumButtons() {
    var ring = heroRoot() && heroRoot().querySelector(".dna-ring");
    markHeroGrid(ring);
    if (ring) {
      ring.style.setProperty("display", "grid", "important");
      ring.style.setProperty("transform", "none", "important");
    }
    queryInHero(".dna-slide").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("left", "auto", "important");
      btn.style.setProperty("top", "auto", "important");
      btn.style.setProperty("transform", "none", "important");
      btn.style.setProperty("opacity", "1", "important");
    });
  }

  function flattenProButtons() {
    var ring = heroRoot() && heroRoot().querySelector(".dna-ring");
    markHeroGrid(ring);
    if (ring) {
      ring.style.setProperty("display", "grid", "important");
      ring.style.setProperty("transform", "none", "important");
    }
    queryInHero(".dna-slide").forEach(function (btn) {
      btn.style.setProperty("position", "relative", "important");
      btn.style.setProperty("transform", "none", "important");
    });
  }

  function buildMobileHeroDom() {
    if (!isHeroMobile()) {
      document.body.classList.remove("welten-mobile-hero-active");
      document.documentElement.classList.remove("welten-mobile-hero");
      restoreMobileHeroToHome();
      document.body.classList.remove("welten-mobile-subpage-hero--on");
      removeHeroTitleDom();
      resetHeroButtonDom();
      document.querySelectorAll("[data-mobile-chapter-hero]").forEach(function (el) {
        el.remove();
      });
      return;
    }
    if (!isHeroTitleVisible()) {
      removeHeroTitleDom();
    }
    document.body.classList.add("welten-mobile-hero-active");
    document.documentElement.classList.add("welten-mobile-hero");
    ensureStylesheetLock();

    var world = document.body.getAttribute("data-world");
    if (world === "nexora") {
      buildNexoraHero();
      scheduleNexoraHeroRetry();
    }
    if (world === "freiraum") buildFreiraumHero();
    if (world === "vertex") buildProfessionalHero();
    if (world === "general") buildGeneralHero();

    ensureChapterHeroes();
    relocateMobileHero();
    restructureHeroButtons();
    hideMobileSideNav();

    document.querySelectorAll("[data-mobile-chapter-hero]:not([hidden])").forEach(function (hero) {
      var inner = hero.parentElement;
      if (inner) mountChapterHeroFirst(inner, hero);
    });
  }

  function boot() {
    buildMobileHeroDom();
  }

  function afterNavigation() {
    releaseHeroPointerCapture();
    disableNexoraOrbitOnMobile();
    hideMobileSideNav();
    if (window.WeltenMobilePerf && typeof window.WeltenMobilePerf.cleanup === "function") {
      window.WeltenMobilePerf.cleanup();
    }
    setTimeout(boot, 40);
  }

  document.addEventListener(
    "click",
    function (e) {
      if (!isHeroMobile()) return;
      if (e.target.closest('[data-go], .nexora-orbit-button, .dna-slide')) {
        afterNavigation();
      }
    },
    true
  );

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "portfolio-world-enter") {
      requestAnimationFrame(boot);
    }
    if (e.data && e.data.type === "portfolio-cleanup-transition") {
      afterNavigation();
    }
  });

  window.addEventListener("load", boot);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  function onViewportChange() {
    boot();
  }

  if (mqHero.addEventListener) {
    mqHero.addEventListener("change", onViewportChange);
  } else {
    mqHero.addListener(onViewportChange);
  }

  if (mqTabletLandscape.addEventListener) {
    mqTabletLandscape.addEventListener("change", onViewportChange);
  } else if (mqTabletLandscape.addListener) {
    mqTabletLandscape.addListener(onViewportChange);
  }

  window.addEventListener("orientationchange", function () {
    setTimeout(boot, 120);
  });

  document.addEventListener(
    "click",
    function (e) {
      if (!isHeroMobile()) return;
      var btn = e.target.closest("[data-go], #mvStaticHero [data-go], .welten-mobile-relocated-hero [data-go], #slide-home .hero-button[data-go], #slide-home .nexora-orbit-button[data-go], #slide-home .dna-slide[data-go]");
      if (!btn) return;
      if (btn.closest("[data-mobile-chapter-hero]")) return;
      var id = btn.getAttribute("data-go");
      if (!id || id === currentChapter()) return;
      e.preventDefault();
      goChapter(id);
    },
    true
  );

  document.addEventListener("welten-chapter-change", function () {
    setTimeout(boot, 30);
  });

  document.addEventListener("welten-lang-change", function () {
    setTimeout(boot, 30);
  });

  document.addEventListener("mv-restore-hero", function () {
    setTimeout(boot, 60);
  });

  try {
    new MutationObserver(function () {
      if (!isHeroMobile()) return;
      setTimeout(boot, 30);
    }).observe(document.body, { attributes: true, attributeFilter: ["data-current-slide", "data-world", "class"] });
  } catch (e) {}

  window.WeltenMobileHero = { refresh: boot, version: HERO_VER };
})();
