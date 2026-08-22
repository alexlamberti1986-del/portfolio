/**
 * NEXORA world — Design Test V2
 * Mobile drawer, case filters, reveal-on-scroll, HUD scroll state.
 * Respects prefers-reduced-motion + html[data-effects=off].
 * Year: [data-nx-year] locally; [data-v2-year] also via v2-bridge.
 */
(function () {
  "use strict";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function reduced() {
    return (
      document.documentElement.getAttribute("data-reduced-motion") === "1" ||
      document.documentElement.getAttribute("data-effects") === "off" ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    );
  }

  function initYear() {
    var y = String(new Date().getFullYear());
    qsa("[data-nx-year]").forEach(function (el) {
      el.textContent = y;
    });
  }

  function initDrawer() {
    var btn = qs("[data-nx-menu]");
    var drawer = qs("#nx-drawer");
    if (!btn || !drawer) return;

    function setOpen(open) {
      if (open) {
        drawer.hidden = false;
        drawer.classList.add("is-open");
      } else {
        drawer.classList.remove("is-open");
        drawer.hidden = true;
      }
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Menü schliessen" : "Menü öffnen");
      document.body.classList.toggle("nx-drawer-open", open);
    }

    btn.addEventListener("click", function () {
      setOpen(drawer.hidden || !drawer.classList.contains("is-open"));
    });

    qsa("a", drawer).forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initFilters() {
    var root = qs("[data-nx-filters]");
    var cases = qs("[data-nx-cases]");
    if (!root || !cases) return;

    var tabs = qsa("[data-filter]", root);
    var items = qsa(".nx-case", cases);

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var filter = tab.getAttribute("data-filter") || "all";
        tabs.forEach(function (t) {
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        items.forEach(function (item) {
          var cat = item.getAttribute("data-cat") || "";
          var show = filter === "all" || cat === filter;
          item.hidden = !show;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  function revealAll() {
    qsa("[data-reveal]").forEach(function (n) {
      n.classList.add("is-in");
    });
  }

  function initReveal() {
    var nodes = qsa("[data-reveal]");
    if (!nodes.length) return;

    if (reduced()) {
      revealAll();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initSmoothAnchors() {
    qsa('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var target = qs(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: reduced() ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }

  function watchEffects() {
    if (!window.MutationObserver) return;
    var obs = new MutationObserver(function () {
      if (reduced()) revealAll();
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-effects", "data-reduced-motion"],
    });
  }

  function initHudScroll() {
    var hud = qs(".nx-hud");
    if (!hud) return;
    var onScroll = function () {
      hud.classList.toggle("is-scrolled", window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /** 3D orbit menu around brain — drag / nudge like live alexlamberti.ch */
  function initOrbit() {
    var stage = qs("[data-nx-orbit]");
    var ring = qs("[data-nx-orbit-ring]");
    if (!stage || !ring) return;
    if (stage.dataset.nxOrbitReady === "1") return;

    var buttons = qsa(".nx-menu-hero__btn", ring);
    var n = buttons.length;
    if (!n) return;

    var mqMobile = window.matchMedia("(max-width: 720px)");
    var STEP = 360 / n;
    var spring = 0.14;
    var orbitAngle = 0;
    var orbitTarget = 0;
    var orbitVelocity = 0;
    var orbitSpringing = false;
    var orbitSpringTarget = 0;
    var orbitDragging = false;
    var orbitStartX = 0;
    var orbitStartTarget = 0;
    var orbitLastX = 0;
    var orbitLastT = 0;
    var orbitMoved = false;
    var orbitPointerId = null;
    var orbitTouchPending = null;
    var suppressClickUntil = 0;
    var dragSens = 0.135;
    var rafId = 0;
    var running = false;

    ring.style.setProperty("--nexora-orbit-step", STEP.toFixed(4) + "deg");

    function eventEl(ev) {
      var t = ev.target;
      if (!t) return null;
      return t.nodeType === 3 ? t.parentElement : t;
    }

    function shortestDelta(to, from) {
      return ((to - from + 540) % 360) - 180;
    }

    function norm(v) {
      return ((v % 360) + 360) % 360;
    }

    function snapOrbitStep(v) {
      return Math.round(v / STEP) * STEP;
    }

    function bumpOrbit(dir) {
      if (mqMobile.matches) return;
      orbitSpringing = false;
      orbitVelocity = 0;
      orbitTarget = snapOrbitStep(orbitAngle);
      orbitAngle = orbitTarget;
      orbitSpringTarget = orbitTarget + STEP * dir;
      orbitSpringing = true;
      ensureRunning();
    }

    function updateButtons(currentAngle) {
      if (mqMobile.matches) {
        buttons.forEach(function (btn) {
          btn.classList.remove("is-front");
          btn.style.removeProperty("--helix-x");
          btn.style.removeProperty("--helix-y");
          btn.style.removeProperty("--orbit-radius");
          btn.style.removeProperty("--card-opacity");
          btn.style.removeProperty("--card-scale");
          btn.style.removeProperty("--card-blur");
          btn.style.removeProperty("--card-z");
        });
        ring.style.setProperty("--nexora-orbit-rot", "0deg");
        return;
      }

      ring.style.setProperty("--nexora-orbit-rot", currentAngle.toFixed(3) + "deg");
      ring.style.setProperty("--nexora-orbit-step", STEP.toFixed(4) + "deg");

      var frontIndex = 0;
      var minDist = Infinity;
      var i;
      for (i = 0; i < n; i++) {
        var offF = norm(currentAngle + i * STEP);
        var distF = Math.min(offF, 360 - offF);
        if (distF < minDist) {
          minDist = distF;
          frontIndex = i;
        }
      }

      var helixAmp = Math.min(132, 36 + n * 14);
      var baseRadius = Math.min(560, Math.max(340, stage.clientWidth * 0.44));

      for (i = 0; i < n; i++) {
        var btn = buttons[i];
        var off = norm(currentAngle + i * STEP);
        var dist = Math.min(off, 360 - off);
        var rad = (off * Math.PI) / 180;
        var depth = Math.cos(rad);
        var side = Math.sin(rad);
        var helixY = -side * helixAmp;
        var helixX = side * 36;
        var radius = baseRadius + depth * 72;
        var isFront = i === frontIndex;
        btn.classList.toggle("is-front", isFront);
        btn.style.setProperty("--i", String(i));
        var blurPx = isFront ? 0 : Math.min(2.2, 0.3 + dist * 0.01);
        var op = isFront ? 1 : Math.max(0.32, 0.36 + 0.54 * Math.max(0, depth));
        var sc = isFront ? 1.05 : Math.max(0.8, 0.82 + 0.12 * Math.max(0, depth));
        btn.style.setProperty("--helix-x", helixX.toFixed(2) + "px");
        btn.style.setProperty("--helix-y", helixY.toFixed(2) + "px");
        btn.style.setProperty("--orbit-radius", radius.toFixed(1) + "px");
        btn.style.setProperty("--card-opacity", Math.min(1, op).toFixed(3));
        btn.style.setProperty("--card-scale", sc.toFixed(3));
        btn.style.setProperty("--card-blur", blurPx.toFixed(2) + "px");
        btn.style.setProperty("--card-z", String(Math.round(90 + depth * 108 + (isFront ? 22 : 0))));
      }
    }

    function frame() {
      if (mqMobile.matches) {
        running = false;
        rafId = 0;
        updateButtons(0);
        return;
      }
      if (!reduced()) {
        if (Math.abs(orbitVelocity) > 0.002) {
          orbitTarget += orbitVelocity;
          orbitVelocity *= 0.956;
        } else if (orbitSpringing) {
          var d = shortestDelta(orbitSpringTarget, orbitTarget);
          orbitTarget += d * spring;
          if (Math.abs(d) < 0.14) {
            orbitTarget = orbitSpringTarget;
            orbitAngle = orbitSpringTarget;
            orbitSpringing = false;
            orbitVelocity = 0;
          }
        }
      }
      var angleLerp = orbitSpringing ? 0.11 : 0.064;
      orbitAngle += shortestDelta(orbitTarget, orbitAngle) * angleLerp;
      updateButtons(orbitAngle);
      rafId = requestAnimationFrame(frame);
    }

    function ensureRunning() {
      if (running || mqMobile.matches) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    }

    function orbitStartDrag(e) {
      if (mqMobile.matches) return;
      var el = eventEl(e);
      if (el && el.closest && el.closest(".nx-menu-hero__btn")) return;
      if (el && el.closest && el.closest(".nx-menu-hero__nudge")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        orbitTouchPending = { id: e.pointerId, x: e.clientX, y: e.clientY };
        return;
      }
      orbitDragging = true;
      orbitMoved = false;
      orbitSpringing = false;
      orbitStartX = e.clientX;
      orbitStartTarget = orbitTarget;
      orbitLastX = e.clientX;
      orbitLastT = performance.now();
      orbitVelocity = 0;
      orbitPointerId = e.pointerId;
      stage.classList.add("is-dragging");
      try {
        stage.setPointerCapture(e.pointerId);
      } catch (err) {}
      ensureRunning();
    }

    function orbitMoveDrag(e) {
      if (orbitTouchPending && e.pointerId === orbitTouchPending.id) {
        var tdx = e.clientX - orbitTouchPending.x;
        var tdy = e.clientY - orbitTouchPending.y;
        if (Math.abs(tdy) > Math.abs(tdx) + 10) {
          orbitTouchPending = null;
          return;
        }
        if (Math.abs(tdx) > 14 && Math.abs(tdx) > Math.abs(tdy) * 1.15) {
          orbitDragging = true;
          orbitMoved = false;
          orbitSpringing = false;
          orbitStartX = orbitTouchPending.x;
          orbitStartTarget = orbitTarget;
          orbitLastX = e.clientX;
          orbitLastT = performance.now();
          orbitVelocity = 0;
          orbitPointerId = e.pointerId;
          orbitTouchPending = null;
          stage.classList.add("is-dragging");
          try {
            stage.setPointerCapture(e.pointerId);
          } catch (err) {}
          ensureRunning();
        } else {
          return;
        }
      }
      if (!orbitDragging || e.pointerId !== orbitPointerId) return;
      var dx = e.clientX - orbitStartX;
      if (Math.abs(dx) > 10) orbitMoved = true;
      var now = performance.now();
      var dt = Math.max(16, now - orbitLastT);
      var dragV = -((e.clientX - orbitLastX) * dragSens) * (16 / dt);
      orbitVelocity = orbitVelocity * 0.72 + dragV * 0.28;
      orbitTarget = orbitStartTarget - dx * dragSens;
      orbitLastX = e.clientX;
      orbitLastT = now;
      orbitAngle += shortestDelta(orbitTarget, orbitAngle) * 0.14;
      updateButtons(orbitAngle);
    }

    function orbitEndDrag(e) {
      if (orbitTouchPending && e.pointerId === orbitTouchPending.id) {
        orbitTouchPending = null;
      }
      if (!orbitDragging || e.pointerId !== orbitPointerId) return;
      orbitDragging = false;
      orbitPointerId = null;
      stage.classList.remove("is-dragging");
      if (orbitMoved) suppressClickUntil = performance.now() + 280;
      if (reduced()) {
        orbitTarget = snapOrbitStep(orbitTarget);
        orbitAngle = orbitTarget;
        updateButtons(orbitAngle);
      } else {
        orbitTarget += orbitVelocity * 6;
        orbitSpringTarget = snapOrbitStep(orbitTarget);
        orbitSpringing = true;
        ensureRunning();
      }
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch (err2) {}
    }

    stage.addEventListener("pointerdown", orbitStartDrag, true);
    stage.addEventListener("pointermove", orbitMoveDrag);
    stage.addEventListener("pointerup", orbitEndDrag);
    stage.addEventListener("pointercancel", orbitEndDrag);

    qsa("[data-nx-orbit-nudge]", stage).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var dir = parseInt(btn.getAttribute("data-nx-orbit-nudge"), 10) || 0;
        if (dir) bumpOrbit(dir);
      });
    });

    ring.addEventListener(
      "click",
      function (e) {
        if (performance.now() < suppressClickUntil) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    function onMq() {
      if (mqMobile.matches) {
        if (rafId) cancelAnimationFrame(rafId);
        running = false;
        rafId = 0;
        stage.classList.remove("is-dragging");
        updateButtons(0);
      } else {
        updateButtons(orbitAngle);
        ensureRunning();
      }
    }

    if (mqMobile.addEventListener) mqMobile.addEventListener("change", onMq);
    else if (mqMobile.addListener) mqMobile.addListener(onMq);

    stage.dataset.nxOrbitReady = "1";
    updateButtons(0);
    ensureRunning();
  }

  function refreshRevealInViewport() {
    if (reduced()) {
      revealAll();
      return;
    }
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    qsa("[data-reveal]:not(.is-in)").forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) n.classList.add("is-in");
    });
  }

  window.addEventListener("v2-world-visible", refreshRevealInViewport);

  function init() {
    initYear();
    initDrawer();
    initFilters();
    initReveal();
    initSmoothAnchors();
    watchEffects();
    initHudScroll();
    initOrbit();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
