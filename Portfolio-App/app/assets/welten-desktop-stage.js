/**
 * Desktop Stage Scale — nur Desktop (min-width: 1025px), gleiche Grenze wie die bestehende Shell.
 * Referenzbühne: 1920 × 1080
 * scale = min(viewportW / 1920, viewportH / 1080)
 * Nutzt visualViewport wenn verfügbar.
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

  function ensureStructure() {
    if (document.getElementById("desktopViewport")) return;

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

    var slot = document.createElement("div");
    slot.className = "desktop-stage-slot";
    slot.id = "desktopStageSlot";

    var stage = document.createElement("div");
    stage.id = "desktopStage";
    stage.className = "desktop-stage";

    slot.appendChild(stage);
    viewport.appendChild(bg);
    viewport.appendChild(slot);

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
  }

  function applyScale() {
    if (disposed) return;
    ensureStructure();

    root.style.setProperty("--desktop-ref-w", REF_W + "px");
    root.style.setProperty("--desktop-ref-h", REF_H + "px");

    if (!isDesktop()) {
      root.classList.remove("desktop-stage-active");
      root.style.setProperty("--desktop-scale", "1");
      root.setAttribute("data-desktop-scale", "1");
      try {
        window.dispatchEvent(new CustomEvent("mv-desktop-stage-updated", { detail: { scale: 1 } }));
      } catch (eEvtOff) {}
      return;
    }

    var vp = getViewportSize();
    var scale = Math.min(vp.width / REF_W, vp.height / REF_H);
    if (!isFinite(scale) || scale <= 0) scale = 1;
    /* Leichte Rundung gegen Subpixel-Flackern */
    scale = Math.round(scale * 10000) / 10000;

    root.classList.add("desktop-stage-active");
    root.style.setProperty("--desktop-scale", String(scale));
    root.setAttribute("data-desktop-scale", String(scale));

    try {
      window.dispatchEvent(new CustomEvent("mv-desktop-stage-updated", { detail: { scale: scale } }));
    } catch (eEvt) {}
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
    listeners.forEach(function (l) {
      try {
        l.target.removeEventListener(l.type, l.handler, l.opts);
      } catch (e) {}
    });
    listeners = [];
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
          target: mq,
          type: "change",
          handler: scheduleApply,
          opts: undefined,
          legacy: true,
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
          target: { removeEventListener: function () { ro.disconnect(); } },
          type: "ro",
          handler: null,
          opts: undefined,
        });
      } catch (eRo) {}
    }

    /* Screen-/Display-Wechsel (wo unterstützt) */
    try {
      if (window.screen && screen.orientation && screen.orientation.addEventListener) {
        on(screen.orientation, "change", scheduleApply, { passive: true });
      }
    } catch (eOr) {}

    window.__mvDesktopStage = {
      apply: applyScale,
      dispose: dispose,
      getScale: function () {
        return parseFloat(root.getAttribute("data-desktop-scale") || "1") || 1;
      },
      REF_W: REF_W,
      REF_H: REF_H,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
