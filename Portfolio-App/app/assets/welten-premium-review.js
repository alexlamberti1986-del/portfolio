/**
 * Premium Review — Welten-Persönlichkeit, einheitliche Touch-Ziele
 */
(function () {
  "use strict";

  var MAP = {
    general: "general",
    nexora: "nexora",
    vertex: "vertex",
    professional: "vertex",
    freiraum: "freiraum",
  };

  function applyPersonality() {
    var world = document.body.getAttribute("data-world") || "";
    Object.keys(MAP).forEach(function (k) {
      document.body.classList.remove("welten-personality--" + MAP[k]);
    });
    var cls = MAP[world];
    if (cls) document.body.classList.add("welten-personality--" + cls);
  }

  applyPersonality();
  try {
    new MutationObserver(applyPersonality).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-world"],
    });
  } catch (e) {}
})();
