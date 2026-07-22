/**
 * Sync parent /design-test/.../chapter paths to in-page section anchors.
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

  function chapterFromParent() {
    try {
      var p = String(parent.location.pathname || "").toLowerCase();
      var parts = p.split("/").filter(Boolean);
      var last = parts[parts.length - 1] || "home";
      if (last === "multiversum" || last === "nexora" || last === "professional" || last === "freiraum" || last === "design-test") {
        return "home";
      }
      return MAP[last] || "home";
    } catch (e) {
      return "home";
    }
  }

  function go() {
    var id = chapterFromParent();
    var el = document.getElementById(id);
    if (el) {
      try {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e2) {
        el.scrollIntoView(true);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(go, 80);
    });
  } else {
    setTimeout(go, 80);
  }
  window.addEventListener("hashchange", go);
  setInterval(go, 1500);
})();
