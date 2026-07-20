/**
 * Desktop/Laptop — voller Home-Hero oben auf jeder Unterseite (≥1025px).
 * Handy/Tablet: Hero deaktiviert (welten-mobile-hero-off).
 */
(function () {
  "use strict";

  var VER = "20260720headerGap1";
  var bootTimer = null;
  var realignTimers = [];
  var CHAPTERS = ["home", "projects", "leistungen", "about", "contact", "offerte"];
  var mqDesktop = window.matchMedia("(min-width: 1025px)");
  var mqGalaxy = window.matchMedia("(min-width: 1025px) and (min-height: 640px)");

  function isDesktop() {
    return mqDesktop.matches;
  }

  function currentChapter() {
    var slide =
      document.body.getAttribute("data-current-slide") ||
      (document.querySelector(".slide.active[data-slide]") &&
        document.querySelector(".slide.active[data-slide]").getAttribute("data-slide"));
    if (CHAPTERS.indexOf(slide) >= 0) return slide;
    return "home";
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
      de: { home: "Home", projects: "Projekte", leistungen: "Leistungen", about: "Über mich", contact: "Kontakt", offerte: "Offerte" },
      en: { home: "Home", projects: "Projects", leistungen: "Services", about: "About", contact: "Contact", offerte: "Offer" },
      fr: { home: "Accueil", projects: "Projets", leistungen: "Services", about: "À propos", contact: "Contact", offerte: "Offre" },
      it: { home: "Home", projects: "Progetti", leistungen: "Servizi", about: "Chi sono", contact: "Contatto", offerte: "Offerta" },
    };
    if (window.WeltenPreviewI18n && window.WeltenPreviewI18n.NAV) {
      return (
        (window.WeltenTranslations &&
          window.WeltenTranslations.langPack(window.WeltenPreviewI18n.NAV, lang)) ||
        window.WeltenPreviewI18n.NAV[lang] ||
        window.WeltenPreviewI18n.NAV.de
      );
    }
    return fallback[lang] || fallback.de;
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

  function isHeroElementVisible(el) {
    if (!el) return false;
    try {
      var cs = window.getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      if (parseFloat(cs.opacity) < 0.05) return false;
    } catch (e) {}
    return true;
  }

  function hasDnaHomeHero() {
    var dna =
      document.getElementById("dnaStage") ||
      document.querySelector("#slide-home .home-hero-experience");
    if (!dna) return false;
    var world = document.body.getAttribute("data-world") || "general";
    if (world === "general") return isHeroElementVisible(dna);
    return true;
  }

  function getDnaHeroEl() {
    return (
      document.getElementById("dnaStage") ||
      document.querySelector(".home-hero-experience.welten-desktop-relocated-hero") ||
      document.querySelector("#slide-home .home-hero-experience")
    );
  }

  function getGeneralHeroEl() {
    var relocatedVideo = document.querySelector(
      ".welten-desktop-relocated-hero#alWorldVideoHero, #alWorldVideoHero.welten-desktop-relocated-hero"
    );
    if (relocatedVideo) return relocatedVideo;
    /* Galaxy Walk Home (nur ~13″+): Kapitel-Nav bleibt auf #slide-home — nicht als Unterseiten-Hero */
    var galaxyChrome = document.getElementById("alGalaxyHomeChrome");
    if (
      galaxyChrome &&
      document.getElementById("alGalaxyGangHero") &&
      document.body.getAttribute("data-welten-galaxy-hero") === "1" &&
      mqGalaxy.matches
    ) {
      return galaxyChrome;
    }
    var sub = document.querySelector(
      ".slide.active .mv-static-hero.welten-desktop-subpage-mv-hero:not(#alGalaxyHomeChrome):not(.al-galaxy-home-chrome)"
    );
    if (sub) return sub;
    var videoHome = document.getElementById("alWorldVideoHero");
    if (videoHome && videoHome.classList.contains("al-world-video-hero--with-chrome")) return videoHome;
    var staticHome = document.getElementById("mvStaticHero");
    if (staticHome) return staticHome;
    return document.getElementById("mvParallaxHero");
  }

  function getHomeHeroEl() {
    if (hasDnaHomeHero()) return getDnaHeroEl();
    var world = document.body.getAttribute("data-world") || "general";
    if (world === "general") return getGeneralHeroEl();
    return getDnaHeroEl();
  }

  function getSlideMount(chapter) {
    if (chapter === "home") {
      return document.querySelector("#slide-home .slide-inner");
    }
    var slide = document.getElementById("slide-" + chapter);
    return slide ? slide.querySelector(".slide-inner") || slide : null;
  }

  function ensureHeroHost(mount) {
    if (!mount) return null;
    var host = mount.querySelector(":scope > .welten-desktop-hero-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "welten-desktop-hero-host";
      mount.insertBefore(host, mount.firstChild);
    } else if (mount.firstElementChild !== host) {
      mount.insertBefore(host, mount.firstChild);
    }
    return host;
  }

  function ensureHomePlaceholder(homeInner, hero) {
    if (!homeInner || !hero) return null;
    var ph = document.getElementById("welten-hero-home-slot");
    if (!ph) {
      ph = document.createElement("div");
      ph.id = "welten-hero-home-slot";
      ph.setAttribute("aria-hidden", "true");
      ph.hidden = true;
      homeInner.insertBefore(ph, hero);
    }
    return ph;
  }

  function markActive(root, active) {
    if (!root) return;
    root.querySelectorAll("[data-go]").forEach(function (btn) {
      var go = btn.getAttribute("data-go");
      var on = go === active;
      btn.classList.toggle("is-active", on);
      btn.classList.toggle("is-hero-primary", on);
      btn.setAttribute("aria-current", on ? "page" : "false");
    });
  }

  function syncNexoraOrbit(active) {
    if (document.body.getAttribute("data-world") !== "nexora") return;

    function applyOrbitActive(chapterId) {
      var hero = getDnaHeroEl();
      if (!hero) return;
      var buttons = hero.querySelectorAll(".nexora-orbit-button");
      if (!buttons.length) return;

      buttons.forEach(function (btn) {
        var on = btn.getAttribute("data-go") === chapterId;
        btn.classList.toggle("is-active", on);
        btn.classList.toggle("is-hero-primary", on);
        btn.setAttribute("aria-current", on ? "page" : "false");
      });
    }

    if (window.NexoraOrbitUI && typeof window.NexoraOrbitUI.snapToChapter === "function") {
      window.NexoraOrbitUI.snapToChapter(active);
    }
    applyOrbitActive(active);

    setTimeout(function () {
      if (window.NexoraOrbitUI && typeof window.NexoraOrbitUI.snapToChapter === "function") {
        window.NexoraOrbitUI.snapToChapter(active);
      }
      applyOrbitActive(active);
    }, 120);
    setTimeout(function () {
      applyOrbitActive(active);
    }, 480);
  }

  function syncHeroNav(active) {
    var world = document.body.getAttribute("data-world") || "general";
    var hero = getHomeHeroEl();

    if (world === "nexora") {
      syncNexoraOrbit(active);
      return;
    }

    if (hero) markActive(hero, active);
  }

  function bindHeroNavClicks(hero) {
    if (!hero || hero.getAttribute("data-welten-hero-nav-bound") === "1") return;
    hero.setAttribute("data-welten-hero-nav-bound", "1");
    hero.addEventListener(
      "click",
      function (e) {
        var btn = e.target.closest && e.target.closest("[data-go]");
        if (!btn || !hero.contains(btn)) return;
        var id = btn.getAttribute("data-go");
        if (!id || id === currentChapter()) return;
        e.preventDefault();
        e.stopPropagation();
        goChapter(id);
      },
      true
    );
  }

  function buildMvSubpageHero(host) {
    if (!host) return null;
    var existing = host.querySelector(".mv-static-hero.welten-desktop-subpage-mv-hero");
    if (existing) return existing;

    var labels = chapterLabels();
    var navHtml = CHAPTERS.map(function (id) {
      return (
        '<button type="button" class="mv-static-hero__nav-btn mv-form-btn" data-go="' +
        id +
        '">' +
        (labels[id] || id) +
        "</button>"
      );
    }).join("");

    var hero = document.createElement("div");
    hero.className = "mv-static-hero welten-desktop-relocated-hero welten-desktop-subpage-mv-hero";
    hero.setAttribute("aria-label", "MULTIVERSUM");
    hero.innerHTML =
      '<div class="mv-static-hero__inner">' +
      '<p class="mv-static-hero__eyebrow">Alex Lamberti · Portfolio</p>' +
      '<h1 class="mv-static-hero__title">MULTIVERSUM</h1>' +
      '<p class="mv-static-hero__tag" data-i18n="home.tag">' +
      '<span class="mv-tag-blue">Vier Welten.</span> <span class="mv-tag-white">Ein Ziel.</span> <span class="mv-tag-warm">Deine Vision.</span></p>' +
      '<nav class="mv-static-hero__nav" aria-label="Kapitel">' +
      navHtml +
      "</nav></div>";

    host.appendChild(hero);
    bindHeroNavClicks(hero);
    return hero;
  }

  function removeMvSubpageHeroes() {
    document.querySelectorAll(".welten-desktop-subpage-mv-hero").forEach(function (el) {
      /* Multiversum-Home Galaxy-Nav darf nicht mit Unterseiten-Klonen entfernt werden */
      if (el.id === "alGalaxyHomeChrome" || el.classList.contains("al-galaxy-home-chrome")) return;
      el.remove();
    });
  }

  function removeLegacyCompactHeroes() {
    document.querySelectorAll("[data-desktop-chapter-hero]").forEach(function (el) {
      el.remove();
    });
  }

  function removeEmptyHeroHosts() {
    document.querySelectorAll(".welten-desktop-hero-host").forEach(function (host) {
      if (!host.children.length) host.remove();
    });
  }

  function restoreElementToHome(hero, homeInner) {
    if (!hero || !homeInner) return;
    hero.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
    var ph = document.getElementById("welten-hero-home-slot");
    if (ph && ph.parentNode && hero !== ph) {
      ph.parentNode.insertBefore(hero, ph);
      ph.remove();
    } else if (hero.parentNode !== homeInner) {
      homeInner.insertBefore(hero, homeInner.firstChild);
    } else if (homeInner.firstElementChild !== hero) {
      homeInner.insertBefore(hero, homeInner.firstChild);
    }
  }

  function restoreHeroToHome() {
    removeMvSubpageHeroes();
    removeEmptyHeroHosts();

    var homeInner = document.querySelector("#slide-home .slide-inner");
    if (!homeInner) return;

    var dna = getDnaHeroEl();
    if (dna) {
      restoreElementToHome(dna, homeInner);
      stripRelocatedHeroInlineStyles(dna);
      dna.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
      dna.style.removeProperty("margin-top");
    }

    var world = document.body.getAttribute("data-world") || "general";
    if (world === "general") {
      var videoHero = document.getElementById("alWorldVideoHero");
      var staticHome = document.getElementById("mvStaticHero");
      var parallax = document.getElementById("mvParallaxHero");
      if (videoHero) {
        restoreElementToHome(videoHero, homeInner);
        videoHero.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
        videoHero.style.removeProperty("margin-top");
      }
      if (staticHome) {
        restoreElementToHome(staticHome, homeInner);
        staticHome.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
      }
      if (parallax) restoreElementToHome(parallax, homeInner);
    }
  }

  function stripNexoraDnaStrand(hero) {
    /* Kein DOM-Strip mehr: Unterseiten-Hero muss optisch dem Home-Hero entsprechen. */
    return;
  }

  function stripRelocatedHeroInlineStyles(hero) {
    if (!hero) return;
    hero.querySelectorAll(
      ".dna-slide, .nexora-orbit-button, .dna-ring, .nexora-orbit-ring, .dna-orbit-group, .nexora-orbit-buttons, .dna-unified-scene"
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
        "flex-wrap",
        "justify-content",
      ].forEach(function (prop) {
        el.style.removeProperty(prop);
      });
      el.classList.remove("hero-button", "hero-buttons-grid", "welten-mobile-hero-grid");
    });
    ["height", "min-height", "max-height", "overflow", "touch-action"].forEach(function (prop) {
      hero.style.removeProperty(prop);
    });
  }

  function suppressSubpageHeaderClutter(mount) {
    if (!mount || !isDesktop()) return;
    mount.querySelectorAll(
      "[data-chapter-hero], :scope > .welten-page-hero, :scope > .chapter-label, :scope > .section-title"
    ).forEach(function (el) {
      el.hidden = true;
      el.style.display = "none";
    });
  }

  function scheduleSubpageCleanup(mount) {
    if (!mount) return;
    [120, 400, 900, 1600].forEach(function (ms) {
      setTimeout(function () {
        if (currentChapter() === "home" || !isDesktop()) return;
        var activeMount = getSlideMount(currentChapter());
        suppressSubpageHeaderClutter(activeMount || mount);
      }, ms);
    });
  }

  function relocateGeneralHero(active, mount) {
    var host = ensureHeroHost(mount);
    if (!host) return null;

    if (active === "home") {
      removeMvSubpageHeroes();
      return getGeneralHeroEl();
    }

    var homeInner = document.querySelector("#slide-home .slide-inner");
    var videoHero = document.getElementById("alWorldVideoHero");
    var staticHome = document.getElementById("mvStaticHero");
    var parallax = document.getElementById("mvParallaxHero");

    /* Gleiche Home-Bühne: Video-Chrome (Titel + Nav + Media), nicht Tall-Static/Parallax */
    if (
      videoHero &&
      (videoHero.classList.contains("al-world-video-hero--with-chrome") ||
        videoHero.classList.contains("al-world-video-hero--multiversum") ||
        videoHero.querySelector(".al-world-video-hero__chrome"))
    ) {
      ensureHomePlaceholder(homeInner, videoHero);
      if (staticHome) {
        staticHome.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
      }
      if (parallax) {
        parallax.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
      }
      videoHero.classList.add(
        "welten-desktop-relocated-hero",
        "is-subpage-hero",
        "al-world-video-hero--with-chrome"
      );
      host.appendChild(videoHero);
      try {
        videoHero.querySelectorAll("video").forEach(function (v) {
          v.pause();
        });
      } catch (e) {}
      bindHeroNavClicks(videoHero);
      removeMvSubpageHeroes();
      return videoHero;
    }

    if (staticHome) {
      ensureHomePlaceholder(homeInner, staticHome);
      staticHome.classList.add("welten-desktop-relocated-hero", "is-subpage-hero");
      host.appendChild(staticHome);
      bindHeroNavClicks(staticHome);
      removeMvSubpageHeroes();
      return staticHome;
    }

    removeMvSubpageHeroes();
    return buildMvSubpageHero(host);
  }

  function clearRealignTimers() {
    realignTimers.forEach(function (id) {
      clearTimeout(id);
    });
    realignTimers = [];
  }

  function resetSlideScroll() {
    try {
      var root = document.getElementById("slidesRoot") || document.querySelector("main.slides-root");
      if (root) root.scrollTop = 0;
    } catch (e1) {}
    try {
      var home = document.getElementById("slide-home");
      if (home) home.scrollTop = 0;
    } catch (e2) {}
    try {
      var active = document.querySelector(".slide.active");
      if (active) active.scrollTop = 0;
    } catch (e3) {}
    try {
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      window.scrollTo(0, 0);
    } catch (e4) {}
  }

  function forceLayoutWake() {
    try {
      var root = document.documentElement;
      var body = document.body;
      var slides = document.getElementById("slidesRoot") || document.querySelector("main.slides-root");
      var hero = getDnaHeroEl();
      /* Layout wie nach Hard-Refresh erzwingen */
      void root.offsetHeight;
      if (body) void body.offsetHeight;
      if (slides) {
        slides.style.height = "calc(100% + 1px)";
        void slides.offsetHeight;
        slides.style.height = "";
      }
      if (hero) {
        hero.style.transform = "translateZ(0)";
        void hero.offsetHeight;
        hero.style.removeProperty("transform");
      }
      window.dispatchEvent(new Event("resize"));
      try {
        window.dispatchEvent(new Event("orientationchange"));
      } catch (eOr) {}
    } catch (e) {}
  }

  function clearPinnedHeroOffset(el) {
    if (!el) return;
    try {
      el.style.removeProperty("margin-top");
      el.style.removeProperty("padding-top");
      el.style.removeProperty("top");
      el.style.removeProperty("transform");
      el.style.removeProperty("height");
      el.style.removeProperty("min-height");
      el.style.removeProperty("max-height");
    } catch (e) {}
  }

  function pinDnaHeroTopParity() {
    if (!isDesktop()) return;
    var world = document.body.getAttribute("data-world") || "general";
    if (world === "general") return;
    var hero = getDnaHeroEl();
    if (!hero) return;
    var host = hero.closest(".welten-desktop-hero-host");
    clearPinnedHeroOffset(hero);
    clearPinnedHeroOffset(host);
  }

  function relocateDnaHero(active, mount, homeInner) {
    var hero = getDnaHeroEl();
    if (!hero || !mount || !homeInner) return null;

    if (active === "home") {
      restoreHeroToHome();
      return hero;
    }

    var host = ensureHeroHost(mount);
    if (!host) return null;

    if (hero.parentElement === host && hero.classList.contains("welten-desktop-relocated-hero")) {
      bindHeroNavClicks(hero);
      if (document.body.getAttribute("data-world") === "nexora") {
        setTimeout(function () {
          if (window.NexoraOrbitUI && typeof window.NexoraOrbitUI.snapToChapter === "function") {
            window.NexoraOrbitUI.snapToChapter(active);
          }
        }, 0);
      }
      requestAnimationFrame(pinDnaHeroTopParity);
      return hero;
    }

    ensureHomePlaceholder(homeInner, hero);
    stripRelocatedHeroInlineStyles(hero);
    stripNexoraDnaStrand(hero);
    hero.classList.add("welten-desktop-relocated-hero", "is-subpage-hero");
    host.appendChild(hero);
    bindHeroNavClicks(hero);
    if (document.body.getAttribute("data-world") === "nexora") {
      setTimeout(function () {
        if (window.NexoraOrbitUI && typeof window.NexoraOrbitUI.snapToChapter === "function") {
          window.NexoraOrbitUI.snapToChapter(active);
        }
      }, 60);
    }
    return hero;
  }

  function relocateHero() {
    removeLegacyCompactHeroes();

    if (
      document.body.getAttribute("data-world") === "general" &&
      currentChapter() === "home" &&
      !document.body.classList.contains("mv-home-ready")
    ) {
      return;
    }

    if (!isDesktop()) {
      document.body.classList.remove("welten-desktop-subpage-hero--on");
      restoreHeroToHome();
      return;
    }

    var active = currentChapter();
    var mount = getSlideMount(active);
    var homeInner = document.querySelector("#slide-home .slide-inner");
    var world = document.body.getAttribute("data-world") || "general";
    var hero = null;

    document.body.classList.toggle("welten-desktop-subpage-hero--on", active !== "home");
    document.body.classList.toggle("is-desktop-subpage-hero", active !== "home");

    if (active === "home") {
      restoreHeroToHome();
      hero = getHomeHeroEl();
    } else if (!mount || !homeInner) {
      setTimeout(boot, 120);
      return;
    } else if (hasDnaHomeHero() || world !== "general") {
      hero = relocateDnaHero(active, mount, homeInner);
    } else {
      hero = relocateGeneralHero(active, mount);
    }

    if (!hero && active !== "home") {
      setTimeout(boot, 120);
      return;
    }

    if (world === "nexora" && active !== "home") {
      stripNexoraDnaStrand(getDnaHeroEl());
    }

    syncHeroNav(active);

    resetSlideScroll();

    requestAnimationFrame(function () {
      pinDnaHeroTopParity();
      setTimeout(pinDnaHeroTopParity, 60);
      setTimeout(pinDnaHeroTopParity, 180);
    });

    if (active !== "home") {
      suppressSubpageHeaderClutter(mount);
      scheduleSubpageCleanup(mount);
    }
  }

  function ensureStylesheet() {
    var id = "welten-desktop-chapter-hero-css";
    var existing = document.getElementById(id);
    if (existing) {
      if (existing.getAttribute("data-ver") !== VER) {
        existing.href = "/assets/welten-desktop-chapter-hero.css?v=" + VER;
        existing.setAttribute("data-ver", VER);
      }
      return;
    }
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "/assets/welten-desktop-chapter-hero.css?v=" + VER;
    link.setAttribute("data-ver", VER);
    document.head.appendChild(link);
  }

  function boot() {
    clearTimeout(bootTimer);
    bootTimer = setTimeout(function () {
      ensureStylesheet();
      relocateHero();
    }, 48);
  }

  function scheduleWorldRevealRealign() {
    /* Nach Weltenwechsel: Relayout + Hero wie nach Hard-Refresh */
    clearRealignTimers();
    forceLayoutWake();
    resetSlideScroll();
    boot();
    [40, 160, 420].forEach(function (ms) {
      realignTimers.push(
        setTimeout(function () {
          forceLayoutWake();
          ensureStylesheet();
          relocateHero();
          resetSlideScroll();
          pinDnaHeroTopParity();
        }, ms)
      );
    });
  }

  if (mqDesktop.addEventListener) {
    mqDesktop.addEventListener("change", boot);
  } else if (mqDesktop.addListener) {
    mqDesktop.addListener(boot);
  }

  document.addEventListener("welten-chapter-change", function () {
    setTimeout(boot, 24);
  });
  document.addEventListener("welten-lang-change", function () {
    setTimeout(boot, 24);
    if (document.body.getAttribute("data-world") === "nexora") {
      syncHeroNav(currentChapter());
    }
  });
  document.addEventListener("mv-restore-hero", function () {
    setTimeout(boot, 80);
  });
  document.addEventListener("welten-video-hero-mounted", function () {
    /* Multiversum: nach Video-Mount erneut die gleiche Home-Bühne auf Unterseiten setzen */
    setTimeout(boot, 40);
  });

  try {
    new MutationObserver(function () {
      if (!isDesktop()) return;
      setTimeout(boot, 20);
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-current-slide", "data-world", "class"],
    });
  } catch (e) {}

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-preview-lang") {
      setTimeout(boot, 24);
      return;
    }
    /* Cleanup im inaktiven 0×0-Iframe verdreht die Messungen — absichtlich kein boot */
    if (e.data.type === "portfolio-cleanup-transition" || e.data.type === "portfolio-world-pause") {
      return;
    }
    if (e.data.type === "portfolio-world-reveal") {
      scheduleWorldRevealRealign();
      return;
    }
    if (e.data.type === "portfolio-world-enter") {
      /* Soft: Kapitel sync vor dem Cover-Ende; Reveal macht die harte Neuausrichtung */
      setTimeout(boot, 120);
    }
  });

  window.addEventListener("load", boot);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  if (document.body && document.body.getAttribute("data-world") === "general") {
    try {
      new MutationObserver(function (_muts, obs) {
        if (document.body.classList.contains("mv-home-ready")) {
          obs.disconnect();
          boot();
        }
      }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    } catch (eObs) {}
  }

  window.WeltenDesktopChapterHero = {
    refresh: boot,
    realign: scheduleWorldRevealRealign,
  };
})();
