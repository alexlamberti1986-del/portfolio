/**
 * Desktop Stage Scale v2 — nur Desktop (min-width: 1025px).
 * Referenz: 1920 × 1080
 * Viewport-füllend ohne Letterbox links/rechts:
 * scale = viewportH / 1080
 * stageWidth = viewportW / scale  (mind. Design bleibt proportional, Bühne wird bei Ultrawide breiter)
 * Einheitliches scale() — keine Verzerrung.
 * visualViewport bevorzugt; Fallback innerWidth/innerHeight.
 * Mobile/Tablet: vollständig deaktiviert (gleiche Grenze wie Shell).
 */
(function () {
  var REF_W = 1920;
  var REF_H = 1080;
  var DESKTOP_MQ = "(min-width: 1025px)";
  var root = document.documentElement;
  var mq = null;
  var raf = 0;
  var disposed = false;
  var listeners = [];
  var lastScale = null;
  var worldObserver = null;

  function getViewportSize() {
    var vv = window.visualViewport;
    if (vv && vv.width > 0 && vv.height > 0) {
      return { width: vv.width, height: vv.height };
    }
    return {
      width: window.innerWidth || root.clientWidth || REF_W,
      height: window.innerHeight || root.clientHeight || REF_H,
    };
  }

  function isDesktop() {
    try {
      if (!mq) mq = window.matchMedia(DESKTOP_MQ);
      return !!mq.matches;
    } catch (e) {
      return (window.innerWidth || 0) >= 1025;
    }
  }

  function syncBackgroundWorld() {
    var bg = document.querySelector(".desktop-background");
    if (!bg || !document.body) return;
    var world = document.body.getAttribute("data-master-world") || "general";
    bg.setAttribute("data-world", world);
  }

  function ensureStructure() {
    if (document.getElementById("desktopViewport")) {
      syncBackgroundWorld();
      return;
    }

    var body = document.body;
    if (!body) return;

    var chrome = document.getElementById("mv4ShellChrome");
    var frames = Array.prototype.slice.call(document.querySelectorAll("iframe.mv4-frame"));
    if (!chrome && !frames.length) return;

    var viewport = document.createElement("div");
    viewport.id = "desktopViewport";
    viewport.className = "desktop-viewport";

    var bg = document.createElement("div");
    bg.className = "desktop-background";
    bg.setAttribute("aria-hidden", "true");

    var stage = document.createElement("div");
    stage.id = "desktopStage";
    stage.className = "desktop-stage";
    stage.setAttribute("data-desktop-safe-area", "1");

    viewport.appendChild(bg);
    viewport.appendChild(stage);

    var insertBefore = null;
    if (chrome && chrome.parentNode === body) {
      insertBefore = chrome;
    } else if (frames[0] && frames[0].parentNode === body) {
      insertBefore = frames[0];
    }

    if (insertBefore) {
      body.insertBefore(viewport, insertBefore);
    } else {
      body.appendChild(viewport);
    }

    if (chrome) stage.appendChild(chrome);
    frames.forEach(function (f) {
      stage.appendChild(f);
    });

    syncBackgroundWorld();
  }

  function calculateDesktopScale() {
    var vp = getViewportSize();
    /* Höhe füllt den Viewport; Breite der Bühne passt sich an → keine Seitenränder. */
    var scale = vp.height / REF_H;
    if (!isFinite(scale) || scale <= 0) scale = 1;
    scale = Math.round(scale * 10000) / 10000;
    var stageW = vp.width / scale;
    if (!isFinite(stageW) || stageW < 1025) stageW = REF_W;
    stageW = Math.round(stageW * 100) / 100;
    root.style.setProperty("--desktop-ref-w", stageW + "px");
    root.style.setProperty("--desktop-ref-h", REF_H + "px");
    root.setAttribute("data-desktop-stage-w", String(Math.round(stageW)));
    return scale;
  }

  function applyScale() {
    if (disposed) return;
    ensureStructure();
    syncBackgroundWorld();

    root.style.setProperty("--desktop-ref-h", REF_H + "px");

    if (!isDesktop()) {
      root.style.setProperty("--desktop-ref-w", REF_W + "px");
      if (lastScale !== 1 || root.classList.contains("desktop-stage-active")) {
        root.classList.remove("desktop-stage-active");
        root.style.setProperty("--desktop-scale", "1");
        root.setAttribute("data-desktop-scale", "1");
        lastScale = 1;
        try {
          window.dispatchEvent(new CustomEvent("mv-desktop-stage-updated", { detail: { scale: 1 } }));
        } catch (eEvtOff) {}
      }
      return;
    }

    var scale = calculateDesktopScale();
    var changed = lastScale !== scale || !root.classList.contains("desktop-stage-active");

    root.classList.add("desktop-stage-active");
    root.style.setProperty("--desktop-scale", String(scale));
    root.setAttribute("data-desktop-scale", String(scale));
    lastScale = scale;

    if (changed) {
      try {
        window.dispatchEvent(new CustomEvent("mv-desktop-stage-updated", { detail: { scale: scale } }));
      } catch (eEvt) {}
    }
  }

  function scheduleApply() {
    if (disposed) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      raf = 0;
      applyScale();
    });
  }

  function on(target, type, handler, opts) {
    if (!target || !target.addEventListener) return;
    target.addEventListener(type, handler, opts);
    listeners.push({ target: target, type: type, handler: handler, opts: opts });
  }

  function dispose() {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (worldObserver) {
      try {
        worldObserver.disconnect();
      } catch (eObs) {}
      worldObserver = null;
    }
    listeners.forEach(function (l) {
      try {
        if (l.type === "ro" && l.target && l.target.removeEventListener) {
          l.target.removeEventListener();
        } else {
          l.target.removeEventListener(l.type, l.handler, l.opts);
        }
      } catch (e) {}
    });
    listeners = [];
  }

  function runVisibilityAudit() {
    if (!root.classList.contains("desktop-stage-active")) {
      return { active: false };
    }
    var vp = getViewportSize();
    var critical = document.querySelectorAll("[data-viewport-critical]");
    var clipped = [];
    var tol = 2;
    for (var i = 0; i < critical.length; i++) {
      var el = critical[i];
      var rect = el.getBoundingClientRect();
      var ok =
        rect.left >= -tol &&
        rect.top >= -tol &&
        rect.right <= vp.width + tol &&
        rect.bottom <= vp.height + tol;
      if (!ok) {
        clipped.push({
          el: el,
          rect: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          },
        });
      }
    }
    return {
      active: true,
      scale: lastScale,
      viewport: vp,
      scrollOk:
        document.documentElement.scrollWidth <= vp.width + 1 &&
        document.documentElement.scrollHeight <= vp.height + 1,
      clipped: clipped,
    };
  }

  function boot() {
    ensureStructure();
    applyScale();

    try {
      mq = window.matchMedia(DESKTOP_MQ);
      if (mq.addEventListener) {
        on(mq, "change", scheduleApply);
      } else if (mq.addListener) {
        mq.addListener(scheduleApply);
        listeners.push({
          target: {
            removeEventListener: function () {
              try {
                mq.removeListener(scheduleApply);
              } catch (eRm) {}
            },
          },
          type: "ro",
          handler: null,
          opts: undefined,
        });
      }
    } catch (eMq) {}

    on(window, "resize", scheduleApply, { passive: true });
    on(window, "orientationchange", scheduleApply, { passive: true });
    on(window, "fullscreenchange", scheduleApply, { passive: true });
    on(document, "fullscreenchange", scheduleApply, { passive: true });

    var vv = window.visualViewport;
    if (vv) {
      on(vv, "resize", scheduleApply, { passive: true });
      on(vv, "scroll", scheduleApply, { passive: true });
    }

    if (typeof ResizeObserver !== "undefined") {
      try {
        var ro = new ResizeObserver(scheduleApply);
        ro.observe(root);
        if (document.body) ro.observe(document.body);
        listeners.push({
          target: {
            removeEventListener: function () {
              ro.disconnect();
            },
          },
          type: "ro",
          handler: null,
          opts: undefined,
        });
      } catch (eRo) {}
    }

    try {
      if (window.screen && screen.orientation && screen.orientation.addEventListener) {
        on(screen.orientation, "change", scheduleApply, { passive: true });
      }
    } catch (eOr) {}

    if (document.body && typeof MutationObserver !== "undefined") {
      try {
        worldObserver = new MutationObserver(function () {
          syncBackgroundWorld();
        });
        worldObserver.observe(document.body, {
          attributes: true,
          attributeFilter: ["data-master-world"],
        });
      } catch (eMo) {}
    }

    /* Shell-Chrome als kritische Viewport-Elemente markieren */
    try {
      var chromeEl = document.getElementById("mv4ShellChrome");
      if (chromeEl && !chromeEl.hasAttribute("data-viewport-critical")) {
        chromeEl.setAttribute("data-viewport-critical", "1");
      }
    } catch (eCrit) {}

    window.__mvDesktopStage = {
      apply: applyScale,
      dispose: dispose,
      audit: runVisibilityAudit,
      getScale: function () {
        return parseFloat(root.getAttribute("data-desktop-scale") || "1") || 1;
      },
      getViewportSize: getViewportSize,
      REF_W: REF_W,
      REF_H: REF_H,
      DESKTOP_MQ: DESKTOP_MQ,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
