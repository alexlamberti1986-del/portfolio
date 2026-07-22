/**
 * Chapter sync: live DE menu paths → page mode + scroll.
 * Subpages = template inner-page mode; Home = full scroll landing.
 */
(function () {
  "use strict";

  var MAP = {
    home: "home",
    leistungen: "leistungen",
    services: "leistungen",
    projects: "projekte",
    projekte: "projekte",
    about: "about",
    "ueber-mich": "about",
    contact: "kontakt",
    kontakt: "kontakt",
    offerte: "offerte",
    offer: "offerte",
  };

  var TITLES = {
    home: "Home",
    leistungen: "Leistungen",
    projekte: "Projekte",
    about: "Über mich",
    kontakt: "Kontakt",
    offerte: "Offerte",
  };

  var last = "";

  function chapterFromParent() {
    try {
      var p = String(parent.location.pathname || "").toLowerCase();
      var parts = p.split("/").filter(Boolean);
      var lastPart = parts[parts.length - 1] || "home";
      if (
        lastPart === "multiversum" ||
        lastPart === "nexora" ||
        lastPart === "professional" ||
        lastPart === "freiraum" ||
        lastPart === "design-test"
      ) {
        return "home";
      }
      return MAP[lastPart] || "home";
    } catch (e) {
      return "home";
    }
  }

  function apply() {
    var chapter = chapterFromParent();
    if (chapter === last && document.body.getAttribute("data-chapter") === chapter) {
      return;
    }
    last = chapter;
    document.body.setAttribute("data-chapter", chapter);

    document.querySelectorAll("main > .section[id]").forEach(function (sec) {
      sec.classList.toggle("is-chapter-active", sec.id === chapter);
    });

    var title = document.querySelector("[data-page-title]");
    if (title) title.textContent = TITLES[chapter] || chapter;

    document.querySelectorAll(".tpl-nav a[data-chapter]").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-chapter") === chapter);
    });

    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (e2) {}

    /* Home: optional soft-scroll to hash if present */
    if (chapter === "home" && location.hash) {
      var el = document.querySelector(location.hash);
      if (el) {
        setTimeout(function () {
          try {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          } catch (e3) {}
        }, 40);
      }
    }
  }

  function bindNav() {
    document.querySelectorAll(".tpl-nav a[data-chapter], .tpl-btn[data-chapter], a[data-chapter]").forEach(function (a) {
      if (a.__dtBound) return;
      a.__dtBound = true;
      a.addEventListener("click", function () {
        setTimeout(apply, 30);
      });
    });
  }

  function boot() {
    bindNav();
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("hashchange", apply);
  setInterval(apply, 700);
})();
