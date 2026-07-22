(function () {
  var isTop = false;
  try {
    isTop = window.parent === window;
  } catch (eTop) {
    isTop = false;
  }

  try {
    if (isTop) {
      document.documentElement.classList.add("welten-standalone");
    } else {
      document.documentElement.classList.add("welten-live-shell", "mv-in-shell");
    }
  } catch (eClass) {}

  /* FOUC: Header standardmässig aus, nur standalone sichtbar */
  try {
    if (!document.getElementById("welten-shell-header-fouc")) {
      var st = document.createElement("style");
      st.id = "welten-shell-header-fouc";
      st.textContent =
        "html:not(.welten-standalone) .site-header," +
        "html:not(.welten-standalone) .welten-skip-link," +
        "html:not(.welten-standalone) body > .mv4-bar," +
        "html:not(.welten-standalone) body > .mv4-global-header," +
        "html:not(.welten-standalone) .mv4-shell-chrome," +
        "html:not(.welten-standalone) #mv4ShellChrome{" +
        "display:none!important;visibility:hidden!important;opacity:0!important;" +
        "height:0!important;min-height:0!important;overflow:hidden!important;" +
        "pointer-events:none!important;margin:0!important;padding:0!important;" +
        "position:absolute!important;left:-9999px!important;width:1px!important}" +
        "html.welten-live-shell,html.mv-in-shell,html:not(.welten-standalone){" +
        "--header-h:0px;--header-air-top:0px;--header-air-bottom:0px}" +
        "html.welten-live-shell main.slides-root,html.welten-live-shell #slidesRoot," +
        "html.mv-in-shell main.slides-root,html.mv-in-shell #slidesRoot," +
        "html:not(.welten-standalone) main.slides-root,html:not(.welten-standalone) #slidesRoot{" +
        "padding-top:0!important}" +
        "html.welten-live-shell .slide,html.welten-live-shell .slide.active," +
        "html.mv-in-shell .slide,html.mv-in-shell .slide.active," +
        "html:not(.welten-standalone) .slide,html:not(.welten-standalone) .slide.active{" +
        "top:0!important;padding-top:0!important;margin-top:0!important}";
      (document.head || document.documentElement).appendChild(st);
    }
  } catch (eStyle) {}

  if (isTop) return;

  function applyParentViewportClasses(w, h, scale) {
    try {
      var root = document.documentElement;
      if (w >= 1025 && h >= 640) root.classList.add("welten-parent-desktop");
      else root.classList.remove("welten-parent-desktop");
      if (w >= 1920) root.classList.add("welten-parent-xl");
      else root.classList.remove("welten-parent-xl");

      var sc = parseFloat(scale);
      if (!isFinite(sc) || sc <= 0) sc = 1;
      root.style.setProperty("--parent-desktop-scale", String(sc));
      if (sc < 0.999) {
        root.setAttribute("data-parent-scale-lt1", "1");
        root.style.setProperty(
          "--welten-content-type",
          String(Math.min(1.35, Math.round((1 / sc) * 1000) / 1000))
        );
      } else {
        root.removeAttribute("data-parent-scale-lt1");
        root.style.setProperty("--welten-content-type", "1.04");
      }
    } catch (eVp) {}
  }

  function syncParentViewport() {
    try {
      var pw = window.parent.innerWidth || 0;
      var ph = window.parent.innerHeight || 0;
      var pScale = 1;
      try {
        var parentRoot = window.parent.document.documentElement;
        if (parentRoot && parentRoot.classList.contains("desktop-stage-active")) {
          var stageW = parseFloat(parentRoot.getAttribute("data-desktop-stage-w") || "1920");
          pw = isFinite(stageW) && stageW > 0 ? stageW : 1920;
          ph = 1080;
          pScale = parseFloat(parentRoot.getAttribute("data-desktop-scale") || "1") || 1;
        }
      } catch (eStage) {}
      if (pw > 0 && ph > 0) applyParentViewportClasses(pw, ph, pScale);
    } catch (eSync) {}
  }

  syncParentViewport();
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "mv-parent-viewport") return;
    applyParentViewportClasses(e.data.width || 0, e.data.height || 0, e.data.scale || 1);
  });
  try {
    window.parent.addEventListener("resize", syncParentViewport);
  } catch (eResize) {}

  var done = false;
  var timer = 0;
  var observer = null;

  function hideEl(el) {
    if (!el) return;
    try {
      el.setAttribute("hidden", "");
      el.setAttribute("aria-hidden", "true");
      el.style.cssText =
        "display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important;margin:0!important;padding:0!important;position:absolute!important;left:-9999px!important";
    } catch (eHide) {}
  }

  function stripIframeChrome() {
    var found = false;
    try {
      document.querySelectorAll(".site-header").forEach(function (el) {
        found = true;
        hideEl(el);
      });
      document
        .querySelectorAll(
          ".welten-skip-link, body > .mv4-bar, body > .mv4-global-header, .mv4-shell-chrome, #mv4ShellChrome"
        )
        .forEach(function (el) {
          found = true;
          try {
            el.remove();
          } catch (eRem) {
            hideEl(el);
          }
        });
    } catch (e2) {}
    if (done) return;
    /* Observer bleibt bis Timeout aktiv — Video-Hero kann Header später wieder einblenden */
  }

  function scheduleStrip() {
    if (done) return;
    if (timer) return;
    timer = window.setTimeout(function () {
      timer = 0;
      stripIframeChrome();
    }, 0);
  }

  stripIframeChrome();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", stripIframeChrome, { once: true });
  }
  window.addEventListener("load", stripIframeChrome, { once: true });
  try {
    observer = new MutationObserver(scheduleStrip);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch (eObs) {}
  window.setTimeout(function () {
    done = true;
    if (observer) {
      try {
        observer.disconnect();
      } catch (eStop) {}
      observer = null;
    }
    stripIframeChrome();
  }, 1500);
  /* Kurze Nachsicherungen für späte Header-Inserts */
  [100, 400, 1200].forEach(function (ms) {
    window.setTimeout(stripIframeChrome, ms);
  });
})();
