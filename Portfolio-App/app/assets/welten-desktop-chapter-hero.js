/**
 * Desktop/Laptop — voller Home-Hero oben auf jeder Unterseite (≥1025px).
 * Handy/Tablet: unverändert (welten-mobile-hero.js).
 */
(function () {
  "use strict";

  var VER = "20260706hero-live";
  var CHAPTERS = ["home", "projects", "leistungen", "about", "contact"];
  var mqDesktop = window.matchMedia("(min-width: 1025px)");

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
      de: { home: "Home", projects: "Projekte", leistungen: "Leistungen", about: "Über mich", contact: "Kontakt" },
      en: { home: "Home", projects: "Projects", leistungen: "Services", about: "About", contact: "Contact" },
      fr: { home: "Accueil", projects: "Projets", leistungen: "Services", about: "À propos", contact: "Contact" },
      it: { home: "Home", projects: "Progetti", leistungen: "Servizi", about: "Chi sono", contact: "Contatto" },
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

  function getDnaHeroEl() {
    return (
      document.getElementById("dnaStage") ||
      document.querySelector(".home-hero-experience.welten-desktop-relocated-hero") ||
      document.querySelector("#slide-home .home-hero-experience")
    );
  }

  function getGeneralHeroEl() {
    var sub = document.querySelector(".slide.active .mv-static-hero.welten-desktop-subpage-mv-hero");
    if (sub) return sub;
    var staticHome = document.getElementById("mvStaticHero");
    if (staticHome) return staticHome;
    return document.getElementById("mvParallaxHero");
  }

  function getHomeHeroEl() {
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

  function restoreHeroToHome() {
    removeMvSubpageHeroes();
    removeEmptyHeroHosts();

    var world = document.body.getAttribute("data-world") || "general";
    if (world === "general") {
      var parallax = document.getElementById("mvParallaxHero");
      if (parallax) {
        parallax.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
      }
      return;
    }

    var hero = getDnaHeroEl();
    var homeInner = document.querySelector("#slide-home .slide-inner");
    if (!hero || !homeInner) return;

    hero.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");

    var ph = document.getElementById("welten-hero-home-slot");
    if (ph && ph.parentNode) {
      ph.parentNode.insertBefore(hero, ph);
      ph.remove();
    } else if (hero.parentNode !== homeInner || homeInner.firstElementChild !== hero) {
      homeInner.insertBefore(hero, homeInner.firstChild);
    }
  }

  function relocateGeneralHero(active, mount) {
    var host = ensureHeroHost(mount);
    if (!host) return null;

    if (active === "home") {
      removeMvSubpageHeroes();
      return getGeneralHeroEl();
    }

    var parallax = document.getElementById("mvParallaxHero");
    var staticHome = document.getElementById("mvStaticHero");

    if (staticHome) {
      ensureHomePlaceholder(document.querySelector("#slide-home .slide-inner"), staticHome);
      staticHome.classList.add("welten-desktop-relocated-hero", "is-subpage-hero");
      host.appendChild(staticHome);
      bindHeroNavClicks(staticHome);
      if (parallax) {
        parallax.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
      }
      removeMvSubpageHeroes();
      return staticHome;
    }

    removeMvSubpageHeroes();
    var subHero = buildMvSubpageHero(host);
    if (parallax) {
      parallax.classList.remove("welten-desktop-relocated-hero", "is-subpage-hero");
    }
    return subHero;
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

    ensureHomePlaceholder(homeInner, hero);
    hero.classList.add("welten-desktop-relocated-hero");
    host.appendChild(hero);
    bindHeroNavClicks(hero);
    return hero;
  }

  function relocateHero() {
    removeLegacyCompactHeroes();

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
      setTimeout(boot, 320);
      return;
    } else if (world === "general") {
      hero = relocateGeneralHero(active, mount);
    } else {
      hero = relocateDnaHero(active, mount, homeInner);
    }

    if (!hero && active !== "home") {
      setTimeout(boot, 320);
      return;
    }

    syncHeroNav(active);

    if (active !== "home") {
      var slideEl = document.getElementById("slide-" + active);
      if (slideEl) slideEl.scrollTop = 0;
    }
  }

  function ensureStylesheet() {
    var id = "welten-desktop-chapter-hero-css";
    var existing = document.getElementById(id);
    if (existing) {
      if (existing.getAttribute("data-ver") !== VER) {
        existing.href = "assets/welten-desktop-chapter-hero.css?v=" + VER;
        existing.setAttribute("data-ver", VER);
      }
      return;
    }
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "assets/welten-desktop-chapter-hero.css?v=" + VER;
    link.setAttribute("data-ver", VER);
    document.head.appendChild(link);
  }

  function boot() {
    ensureStylesheet();
    relocateHero();
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

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "portfolio-preview-lang") {
      setTimeout(boot, 24);
    }
  });

  window.addEventListener("load", function () {
    boot();
    setTimeout(boot, 600);
    setTimeout(boot, 1800);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.WeltenDesktopChapterHero = { refresh: boot };
})();
