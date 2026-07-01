/**
 * MULTIVERSUM Home — Galaxy V10 Embed (Desktop)
 */
(function () {
  "use strict";

  function isDesktop() {
    try {
      return window.matchMedia("(min-width: 1100px)").matches;
    } catch (e) {
      return window.innerWidth >= 1100;
    }
  }

  function mountGalaxy() {
    if (document.body.getAttribute("data-world") !== "general") return;
    if (!isDesktop()) return;
    if (document.getElementById("galaxyV10HomeHost")) return;

    var stage = document.getElementById("dnaStage");
    if (!stage) return;

    window.__galaxyV10HomeActive = true;

    var host = document.createElement("div");
    host.className = "galaxy-v10-home-host";
    host.id = "galaxyV10HomeHost";

    var frame = document.createElement("iframe");
    frame.className = "galaxy-v10-home-frame";
    frame.title = "Reise durch das Multiversum";
    frame.src = "galaxy-v10/embed.html";
    frame.loading = "eager";

    host.appendChild(frame);
    stage.parentNode.insertBefore(host, stage);
    stage.classList.add("mv-dna-hidden");
    stage.setAttribute("hidden", "hidden");
  }

  function onReleaseScroll() {
    var slideHome = document.getElementById("slide-home");
    if (!slideHome) return;
    var target = slideHome.querySelector(".home-main-block");
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    slideHome.scrollTo({ top: slideHome.scrollHeight, behavior: "smooth" });
  }

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "galaxy-v10:release-scroll") return;
    onReleaseScroll();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountGalaxy);
  } else {
    mountGalaxy();
  }
})();
