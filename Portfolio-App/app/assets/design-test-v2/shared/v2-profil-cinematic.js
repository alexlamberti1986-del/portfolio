/**
 * Design-Test V2 — cinematic profile portraits.
 * Short muted loops over the static Profilbild (poster).
 * Plays when visible; slightly intensifies on hover.
 */
(function () {
  "use strict";

  var VER = "20260730cine1";
  var BASE = "/assets/videos/profil/";

  var WORLD_SRC = {
    multiversum: BASE + "multiversum-profil.mp4?v=" + VER,
    nexora: BASE + "nexora-profil.mp4?v=" + VER,
    professional: BASE + "professional-profil.mp4?v=" + VER,
    freiraum: BASE + "freiraum-profil.mp4?v=" + VER,
  };

  var SELECTORS = {
    multiversum: [".mv-hero__portrait", ".mv-alex__portrait"],
    nexora: [".nx-hero__portrait"],
    professional: [".pro-hero__media"],
    freiraum: [".fr-hero__figure"],
  };

  function reducedMotion() {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    } catch (e) {}
    var html = document.documentElement;
    var body = document.body;
    if (html && html.getAttribute("data-reduced-motion") === "1") return true;
    if (html && html.getAttribute("data-effects") === "off") return true;
    if (body && body.getAttribute("data-v2-effects") === "off") return true;
    return false;
  }

  function detectWorld() {
    var html = document.documentElement;
    var body = document.body;
    var attr =
      (html && html.getAttribute("data-world")) ||
      (body && body.getAttribute("data-world")) ||
      "";
    if (attr && WORLD_SRC[attr]) return attr;
    if (body && body.classList.contains("pro-world")) return "professional";
    var path = String(location.pathname || "").toLowerCase();
    if (path.indexOf("/nexora") !== -1) return "nexora";
    if (path.indexOf("/professional") !== -1) return "professional";
    if (path.indexOf("/freiraum") !== -1) return "freiraum";
    if (path.indexOf("/multiversum") !== -1) return "multiversum";
    if (document.querySelector(".mv-hero__portrait")) return "multiversum";
    if (document.querySelector(".nx-hero__portrait")) return "nexora";
    if (document.querySelector(".pro-hero__media")) return "professional";
    if (document.querySelector(".fr-hero__figure")) return "freiraum";
    return "";
  }

  function safePlay(video) {
    if (!video) return;
    var p = video.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }

  function enhance(figure, src) {
    if (!figure || figure.getAttribute("data-v2-profil-cine") === "1") return;
    var img = figure.querySelector("img");
    if (!img) return;

    figure.setAttribute("data-v2-profil-cine", "1");
    figure.classList.add("v2-profil-cine");

    var video = document.createElement("video");
    video.className = "v2-profil-cine__video";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("loop", "");
    video.setAttribute("preload", "auto");
    video.setAttribute("aria-hidden", "true");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.tabIndex = -1;
    if (img.currentSrc || img.src) video.setAttribute("poster", img.currentSrc || img.src);
    video.src = src;

    /* Insert after img so captions stay after video in DOM for stacking */
    if (img.nextSibling) figure.insertBefore(video, img.nextSibling);
    else figure.appendChild(video);

    var visible = false;
    var hover = false;

    function sync() {
      if (reducedMotion()) {
        video.pause();
        figure.classList.remove("is-playing", "is-hover", "is-ready");
        return;
      }
      if (hover) figure.classList.add("is-hover");
      else figure.classList.remove("is-hover");

      if (visible || hover) {
        safePlay(video);
        figure.classList.add("is-playing");
      } else {
        video.pause();
        figure.classList.remove("is-playing");
      }
    }

    video.addEventListener("loadeddata", function () {
      figure.classList.add("is-ready");
      sync();
    });
    video.addEventListener("canplay", function () {
      figure.classList.add("is-ready");
      sync();
    });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      figure.addEventListener("pointerenter", function () {
        hover = true;
        /* Warm decode a bit earlier on hover intent */
        if (video.readyState < 2) video.load();
        sync();
      });
      figure.addEventListener("pointerleave", function () {
        hover = false;
        sync();
      });
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            visible = !!(entry.isIntersecting && entry.intersectionRatio >= 0.28);
            sync();
          });
        },
        { threshold: [0, 0.28, 0.55], rootMargin: "40px 0px" }
      );
      io.observe(figure);
    } else {
      visible = true;
      sync();
    }

    /* Pause when tab hidden */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        video.pause();
        figure.classList.remove("is-playing");
      } else {
        sync();
      }
    });
  }

  function run() {
    if (reducedMotion()) return;
    var world = detectWorld();
    var src = WORLD_SRC[world];
    var sels = SELECTORS[world];
    if (!src || !sels) return;
    sels.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        enhance(el, src);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
