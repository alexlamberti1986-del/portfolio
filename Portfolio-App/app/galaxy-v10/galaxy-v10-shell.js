/**
 * Galaxy V10 — Live-Shell: Welten, Site-Header, Menü, Experience-Rail
 */
(function () {
  "use strict";

  var LANG_KEY = "mv-preview-lang";
  var WORLD_PAGES = {
    general: "../MULTIVERSUM.html",
    nexora: "../NEXORA.html",
    vertex: "../PROFESSIONAL.html",
    freiraum: "../FREIRAUM.html",
  };
  var CHAPTER_LINKS = {
    home: "../MULTIVERSUM.html",
    projects: "../MULTIVERSUM.html#projekte",
    leistungen: "../MULTIVERSUM.html#leistungen",
    about: "../MULTIVERSUM.html#ueber-mich",
    contact: "../MULTIVERSUM.html#kontakt",
  };

  var bar = document.querySelector(".mv4-bar");
  var siteHeader = document.querySelector(".site-header");
  var fxBtn = document.getElementById("mv4-fx");
  var menu = document.getElementById("mainMenu");
  var openBtn = document.getElementById("openMenu");
  var closeBtn = document.getElementById("closeMenu");
  var currentLang = "de";
  var switching = false;

  function setChromeHeight() {
    var barH = bar ? Math.ceil(bar.getBoundingClientRect().height) : 56;
    var siteH = siteHeader ? Math.ceil(siteHeader.getBoundingClientRect().height) : 90;
    document.documentElement.style.setProperty("--galaxy-bar-h", barH + "px");
    document.documentElement.style.setProperty("--site-header-h", siteH + "px");
    document.documentElement.style.setProperty("--galaxy-chrome-h", barH + siteH + "px");
  }

  function loadLang() {
    try {
      var stored = localStorage.getItem(LANG_KEY);
      if (stored) currentLang = stored;
    } catch (e) {}
  }

  function saveLang() {
    try {
      localStorage.setItem(LANG_KEY, currentLang);
    } catch (e) {}
  }

  function updateFlags() {
    document.querySelectorAll(".mv4-flag").forEach(function (btn) {
      var on = (btn.dataset.lang || "de") === currentLang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function updateFxBtn() {
    if (!fxBtn) return;
    var on = fxBtn.getAttribute("aria-pressed") === "true";
    var labels = { de: ["EFFEKTE ON", "EFFEKTE OFF"], en: ["FX ON", "FX OFF"], it: ["EFFETTI ON", "EFFETTI OFF"] };
    var pair = labels[currentLang] || labels.de;
    fxBtn.textContent = on ? pair[0] : pair[1];
    fxBtn.classList.toggle("is-on", on);
  }

  function resumeAudio() {
    if (window.WeltenWorldSwitchPreview && typeof window.WeltenWorldSwitchPreview.resumeAudio === "function") {
      window.WeltenWorldSwitchPreview.resumeAudio();
    }
  }

  function navigateHref(href) {
    if (!href) return;
    if (window.GalaxyV10ExitBridge && typeof window.GalaxyV10ExitBridge.navigateWithTransition === "function") {
      window.GalaxyV10ExitBridge.navigateWithTransition(href);
    } else {
      window.location.assign(href);
    }
  }

  function navigateWorld(worldKey) {
    if (worldKey === "general") return;
    navigateHref(WORLD_PAGES[worldKey]);
  }

  function navigateChapter(go) {
    if (go === "home") {
      if (document.body.classList.contains("galaxy-released")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setExperienceNav("home");
      return;
    }
    navigateHref(CHAPTER_LINKS[go]);
  }

  function setExperienceNav(id) {
    document.querySelectorAll(".experience-step[data-go]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-go") === id);
    });
    document.querySelectorAll(".menu-links a[data-go]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-go") === id);
    });
  }

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    menu.classList.add("open");
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    setTimeout(function () {
      if (!menu.classList.contains("open")) menu.hidden = true;
    }, 450);
  }

  function lockBar() {
    switching = true;
    if (bar) bar.style.pointerEvents = "none";
  }

  function unlockBar() {
    switching = false;
    if (bar) bar.style.pointerEvents = "auto";
  }

  function initWorldButtons() {
    if (!bar) return;
    bar.querySelectorAll(".mv4-worlds [data-world-key]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (switching) return;
        var key = btn.getAttribute("data-world-key") || "general";
        if (key === "general") return;
        lockBar();
        resumeAudio();
        navigateWorld(key);
        setTimeout(unlockBar, 1200);
      });
    });
  }

  function initFx() {
    if (!fxBtn) return;
    fxBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var on = fxBtn.getAttribute("aria-pressed") === "true";
      fxBtn.setAttribute("aria-pressed", on ? "false" : "true");
      updateFxBtn();
      resumeAudio();
    });
  }

  function initLang() {
    document.querySelectorAll(".mv4-flag").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentLang = btn.dataset.lang || "de";
        saveLang();
        updateFlags();
        updateFxBtn();
      });
    });
  }

  function initMenu() {
    if (openBtn) openBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (menu) {
      menu.addEventListener("click", function (e) {
        if (e.target === menu) closeMenu();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  function initChapterNav() {
    document.querySelectorAll(".experience-step[data-go], .menu-links a[data-go]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var go = el.getAttribute("data-go");
        if (!go) return;
        if (go !== "home" || el.tagName === "BUTTON") e.preventDefault();
        closeMenu();
        navigateChapter(go);
      });
    });
  }

  function initBelowLinks() {
    document.querySelectorAll("#galaxyBelowPage [data-go]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var go = el.getAttribute("data-go");
        var href = CHAPTER_LINKS[go];
        if (!href) return;
        e.preventDefault();
        navigateHref(href);
      });
    });
  }

  function init() {
    if (document.body.getAttribute("data-galaxy-v10") === "embed") return;
    document.body.classList.add("galaxy-v10-page");
    document.documentElement.classList.add("galaxy-v10-page");
    loadLang();
    updateFlags();
    updateFxBtn();
    setChromeHeight();
    setExperienceNav("home");
    window.addEventListener("resize", setChromeHeight, { passive: true });
    if (bar && typeof ResizeObserver !== "undefined") {
      new ResizeObserver(setChromeHeight).observe(bar);
    }
    if (siteHeader && typeof ResizeObserver !== "undefined") {
      new ResizeObserver(setChromeHeight).observe(siteHeader);
    }
    initWorldButtons();
    initFx();
    initLang();
    initMenu();
    initChapterNav();
    initBelowLinks();
    document.body.setAttribute("data-master-world", "general");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
