/**
 * Desktop Stage v3 — nur Desktop ≥1025px.
 * Shell-Chrome bleibt AUSSERHALB der Stage (Viewport-Ebene) → kein Doppel-Header
 * durch transform-Containing-Blocks. Nur Welt-Iframes werden proportional skaliert.
 *
 * scale = availH / refContentH
 * stageW = availW / scale  → volle Breite, keine Seitenränder
 */
(function () {
  var REF_W = 1920;
  var REF_H = 1080;
  var REF_HEADER = 120;
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

  function measureBarH() {
    try {
      var chrome = document.getElementById("mv4ShellChrome");
      if (chrome) {
        var h = chrome.getBoundingClientRect().height;
        if (h > 40 && h < 280) return Math.round(h);
      }
    } catch (e) {}
    var css =
      parseFloat(getComputedStyle(root).getPropertyValue("--bar-h")) ||
      parseFloat(getComputedStyle(root).getPropertyValue("--total-header-h")) ||
      REF_HEADER;
    return css > 40 ? css : REF_HEADER;
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
    if (!frames.length) return;

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

    /* Chrome bleibt auf body (Viewport-Ebene) — nicht in die Stage. */
    var insertBefore = frames[0] && frames[0].parentNode === body ? frames[0] : null;
    if (chrome && chrome.parentNode === body) {
      /* Viewport nach Chrome einfügen */
      if (chrome.nextSibling) body.insertBefore(viewport, chrome.nextSibling);
      else body.appendChild(viewport);
    } else if (insertBefore) {
      body.insertBefore(viewport, insertBefore);
    } else {
      body.appendChild(viewport);
    }

    frames.forEach(function (f) {
      stage.appendChild(f);
    });

    syncBackgroundWorld();
  }

  function calculateDesktopScale() {
    var vp = getViewportSize();
    var barH = measureBarH();
    var availW = Math.max(1, vp.width);
    var availH = Math.max(1, vp.height - barH);
    var refContentH = Math.max(1, REF_H - REF_HEADER);

    root.style.setProperty("--desktop-bar-h", barH + "px");

    /* Verfügbaren Bereich unter dem Header voll ausfüllen */
    var scale = availH / refContentH;
    if (!isFinite(scale) || scale <= 0) scale = 1;
    scale = Math.round(scale * 10000) / 10000;

    var stageW = availW / scale;
    if (!isFinite(stageW) || stageW < 1025) stageW = REF_W;
    stageW = Math.round(stageW * 100) / 100;

    root.style.setProperty("--desktop-ref-w", stageW + "px");
    root.style.setProperty("--desktop-ref-h", refContentH + "px");
    root.setAttribute("data-desktop-stage-w", String(Math.round(stageW)));
    root.setAttribute("data-desktop-bar-h", String(barH));
    return scale;
  }

  function applyScale() {
    if (disposed) return;
    ensureStructure();
    syncBackgroundWorld();

    if (!isDesktop()) {
      root.style.setProperty("--desktop-ref-w", REF_W + "px");
      root.style.setProperty("--desktop-ref-h", REF_H - REF_HEADER + "px");
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

  function boot() {
    ensureStructure();
    applyScale();

    try {
      mq = window.matchMedia(DESKTOP_MQ);
      if (mq.addEventListener) on(mq, "change", scheduleApply);
      else if (mq.addListener) {
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
        var chrome = document.getElementById("mv4ShellChrome");
        if (chrome) ro.observe(chrome);
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

    window.__mvDesktopStage = {
      apply: applyScale,
      dispose: dispose,
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
