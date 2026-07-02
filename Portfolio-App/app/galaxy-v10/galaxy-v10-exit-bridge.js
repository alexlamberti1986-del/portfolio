/**

 * Galaxy V10 — Ausstieg mit Live-Weltwechsel (Animation + Sound) wie alexlamberti.ch

 */

(function () {

  "use strict";



  var WORLD_PAGES = {

    multiversum: "../MULTIVERSUM.html",

    nexora: "../NEXORA.html",

    professional: "../PROFESSIONAL.html",

    freiraum: "../FREIRAUM.html",

  };



  var WORLD_SWITCH_KEY = {

    multiversum: "general",

    nexora: "nexora",

    professional: "vertex",

    freiraum: "freiraum",

  };



  var WORLD_INDEX = {

    multiversum: 0,

    nexora: 1,

    professional: 2,

    freiraum: 3,

  };



  /** Live-Hashes wie MVWorldCollage / welten-multiversum-parallax-hero-v4.js */

  var CHAPTER_HASH = {

    home: "",

    projects: "projekte",

    leistungen: "leistungen",

    about: "ueber-mich",

    contact: "kontakt",

  };



  var CHAPTER_ALIASES = {

    "slide-about": "ueber-mich",

    about: "ueber-mich",

    "ueber-mich": "ueber-mich",

    "slide-projects": "projekte",

    projects: "projekte",

    projekte: "projekte",

    "slide-leistungen": "leistungen",

    leistungen: "leistungen",

    "slide-contact": "kontakt",

    contact: "kontakt",

    kontakt: "kontakt",

    home: "",

  };

  var pendingHref = null;

  function isEmbed() {
    return document.body.getAttribute("data-galaxy-v10") === "embed";
  }

  function assignLocation(href) {
    var targetHref = normalizeHref(href);
    var abs = targetHref;
    try {
      abs = new URL(targetHref, window.location.href).href;
    } catch (e) {}

    if (isEmbed()) {
      try {
        if (window.top && window.top !== window) {
          var world = worldFromHref(abs);
          var hash = "";
          try {
            hash = new URL(abs).hash || "";
          } catch (e2) {}
          window.top.postMessage(
            {
              type: "alex:switch-world",
              world: world,
              href: abs,
              targetHash: hash,
              go: hash.replace(/^#/, "") || "home",
            },
            "*"
          );
          return;
        }
      } catch (e3) {}
      try {
        window.parent.location.assign(abs);
        return;
      } catch (e4) {}
    }
    window.location.assign(targetHref);
  }



  function worldFromHref(href) {

    if (!href) return "multiversum";

    var h = href.toLowerCase();

    if (h.indexOf("nexora") >= 0) return "nexora";

    if (h.indexOf("professional") >= 0) return "professional";

    if (h.indexOf("freiraum") >= 0) return "freiraum";

    return "multiversum";

  }



  function normalizeHref(href) {

    if (!href) return href;

    try {

      var url = new URL(href, window.location.href);

      var hash = (url.hash || "").replace(/^#/, "");

      if (hash && CHAPTER_ALIASES[hash] !== undefined) {

        var liveHash = CHAPTER_ALIASES[hash];

        url.hash = liveHash ? "#" + liveHash : "";

        return url.href;

      }

      return url.href;

    } catch (e) {

      return href;

    }

  }



  function hrefFromLink(a) {

    var raw = a.getAttribute("href") || "";

    if (!raw || raw === "#") return "";

    var target = a.getAttribute("data-target") || "";

    var go = a.getAttribute("data-go") || "";

    if (target) {

      try {

        var url = new URL(raw, window.location.href);

        url.hash = target.charAt(0) === "#" ? target : "#" + target;

        return url.href;

      } catch (e2) {}

    }

    if (go && CHAPTER_HASH[go]) {

      try {

        var url2 = new URL(raw, window.location.href);

        url2.hash = "#" + CHAPTER_HASH[go];

        return url2.href;

      } catch (e3) {}

    }

    return normalizeHref(raw.startsWith("http") ? raw : new URL(raw, window.location.href).href);

  }



  function isExitLink(a) {

    if (!a || !a.href) return false;

    if (a.getAttribute("href") === "#" || a.getAttribute("href") === "") return false;

    if (a.classList.contains("galaxy-stay")) return false;

    var href = a.getAttribute("href") || "";

    if (href.charAt(0) === "#") return false;

    return (

      href.indexOf("MULTIVERSUM") >= 0 ||

      href.indexOf("multiversum") >= 0 ||

      href.indexOf("NEXORA") >= 0 ||

      href.indexOf("nexora") >= 0 ||

      href.indexOf("PROFESSIONAL") >= 0 ||

      href.indexOf("professional") >= 0 ||

      href.indexOf("FREIRAUM") >= 0 ||

      href.indexOf("freiraum") >= 0

    );

  }



  function navigateWithTransition(href) {

    var world = worldFromHref(href);

    var switchKey = WORLD_SWITCH_KEY[world] || "general";

    var idx = WORLD_INDEX[world] || 0;

    var preview = window.WeltenWorldSwitchPreview;

    var targetHref = normalizeHref(href);



    pendingHref = targetHref;



    if (!preview || typeof preview.playSwitch !== "function") {
      assignLocation(targetHref);
      return;
    }

    if (typeof preview.isEffectsEnabled === "function" && !preview.isEffectsEnabled()) {
      assignLocation(targetHref);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      assignLocation(targetHref);
      return;
    }



    preview.playSwitch(switchKey, idx);

  }



  window.switchToWorldIndex = function () {
    if (pendingHref) {
      assignLocation(pendingHref);
    }
    return Promise.resolve();
  };



  function onClick(e) {

    var a = e.target.closest("a[href]");

    if (!a || !isExitLink(a)) return;

    e.preventDefault();

    e.stopPropagation();

    navigateWithTransition(hrefFromLink(a));

  }



  function init() {

    document.addEventListener("click", onClick, true);

  }



  if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", init);

  } else {

    init();

  }



  window.GalaxyV10ExitBridge = {

    worldPages: WORLD_PAGES,

    navigateWithTransition: navigateWithTransition,

    normalizeHref: normalizeHref,

    chapterHash: CHAPTER_HASH,

  };

})();


