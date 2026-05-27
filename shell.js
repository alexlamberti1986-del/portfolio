(function () {
  "use strict";

  var CHAPTERS = [
    "home", "about", "profile", "values", "strengths", "projects",
    "experience", "workstyle", "why", "faq", "contact",
  ];

  var sharedChapter = "home";
  var bar = document.querySelector(".world-bar");
  var frames = Array.from(document.querySelectorAll(".world-frame"));
  var buttons = Array.from(document.querySelectorAll(".world-bar button[data-world]"));
  var soundBtn = document.getElementById("sound-toggle");
  var loaded = { professional: false };
  var preloading = {};
  var soundEnabled = false;
  var lastSoundWorld = "professional";
  var switching = false;

  var SOUND_FILES = {
    nexora: "assets/audio/Nexora sound.mp3",
    professional: "assets/audio/Professional sound.mp3",
    freiraum: "assets/audio/Freiraum sound.mp3",
  };

  var sounds = {};
  Object.keys(SOUND_FILES).forEach(function (key) {
    var src = SOUND_FILES[key];
    try {
      src = encodeURI(src).replace(/#/g, "%23");
    } catch (e) {}
    var audio = new Audio(src);
    audio.preload = "none";
    audio.volume = 0.55;
    sounds[key] = audio;
  });

  var NEXORA_ARROW_CSS =
    'body[data-world="nexora"] .dna-arrow,' +
    'body[data-world="nexora"] .dna-nav-arrow,' +
    'body[data-world="nexora"] .dna-control,' +
    'body[data-world="nexora"] .dna-controls,' +
    'body[data-world="nexora"] .orbit-arrow,' +
    'body[data-world="nexora"] .orbit-control,' +
    'body[data-world="nexora"] .orbit-controls,' +
    'body[data-world="nexora"] .hero-arrow,' +
    'body[data-world="nexora"] .hero-arrows,' +
    'body[data-world="nexora"] .carousel-arrow,' +
    'body[data-world="nexora"] .carousel-controls,' +
    'body[data-world="nexora"] .spiral-arrow,' +
    'body[data-world="nexora"] .spiral-controls,' +
    'body[data-world="nexora"] button[aria-label*="Weiter"],' +
    'body[data-world="nexora"] button[aria-label*="Zurück"],' +
    'body[data-world="nexora"] button[aria-label*="Next"],' +
    'body[data-world="nexora"] button[aria-label*="Previous"]{' +
    "display:none!important;visibility:hidden!important;pointer-events:none!important;}";

  function setBarHeight() {
    if (!bar) return;
    var h = Math.ceil(bar.getBoundingClientRect().height);
    if (h < 48) h = 56;
    document.documentElement.style.setProperty("--bar-h", h + "px");
  }

  function cleanupShellState() {
    if (typeof window.cleanupWorldTransition === "function") {
      window.cleanupWorldTransition(document);
    }

    frames.forEach(function (f) {
      postFrame(f, { type: "portfolio-cleanup-transition" });
    });
  }

  function isTouchShell() {
    if (window.WeltenTouchEnv && typeof window.WeltenTouchEnv.isTouch === "function") {
      return window.WeltenTouchEnv.isTouch();
    }
    return !!(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 1280px)").matches
    );
  }

  function unlockShell(activeWorld) {
    switching = false;
    window.__worldTransitionRunning = false;
    document.documentElement.style.pointerEvents = "";
    document.body.style.pointerEvents = "";

    buttons.forEach(function (b) {
      b.disabled = false;
      b.style.pointerEvents = "";
    });
    if (bar) bar.style.pointerEvents = "";

    var activeCount = 0;
    frames.forEach(function (f) {
      var w = f.getAttribute("data-world");
      var on = w === activeWorld;
      f.classList.remove("is-leaving");
      f.classList.toggle("is-active", on);
      f.style.pointerEvents = on ? "auto" : "none";
      if (on) {
        activeCount += 1;
        f.classList.remove("is-paused");
        f.classList.add("is-ready");
      } else {
        f.classList.add("is-paused");
        f.classList.remove("is-ready");
      }
    });

    if (!activeCount && activeWorld) {
      var fallback = frameByWorld(activeWorld);
      if (fallback) {
        fallback.classList.add("is-active", "is-ready");
        fallback.classList.remove("is-paused", "is-leaving");
        fallback.style.pointerEvents = "auto";
      }
    }

    setBarHeight();
  }

  window.addEventListener("resize", setBarHeight, { passive: true });
  setBarHeight();
  if (bar && typeof ResizeObserver !== "undefined") {
    new ResizeObserver(setBarHeight).observe(bar);
  }

  function getActiveWorld() {
    var active = frames.find(function (f) {
      return f.classList.contains("is-active") && !f.classList.contains("is-leaving");
    });
    return active ? active.getAttribute("data-world") : null;
  }

  function setMasterWorld(world) {
    var key = world === "professional" ? "professional" : world;
    document.body.setAttribute("data-master-world", key);
  }

  function updateSoundButton() {
    if (!soundBtn) return;
    soundBtn.textContent = soundEnabled ? "Sound On" : "Sound Off";
    soundBtn.classList.toggle("is-on", soundEnabled);
    soundBtn.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
  }

  function soundKeyFromWorld(world) {
    return world === "professional" ? "professional" : world;
  }

  function playWorldSwitchSound(world) {
    var key = soundKeyFromWorld(world);
    if (!soundEnabled || key === lastSoundWorld) return;
    var clip = sounds[key];
    if (!clip) return;
    try {
      clip.currentTime = 0;
      var p = clip.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    } catch (e) {}
    lastSoundWorld = key;
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      updateSoundButton();
    });
  }
  updateSoundButton();

  function postFrame(frame, data) {
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(data, "*");
    } catch (e) {}
  }

  function setFramePaused(frame, paused) {
    if (!frame) return;
    frame.classList.toggle("is-paused", paused);
    postFrame(frame, { type: "portfolio-world-pause", paused: paused });
  }

  function readChapter(frame) {
    try {
      var d = frame.contentDocument;
      if (!d || !d.body) return null;
      var b = d.body.getAttribute("data-current-slide");
      if (b && CHAPTERS.indexOf(b) >= 0) return b;
      var a = d.querySelector(".slide.active[data-slide]");
      if (a) {
        var id = a.getAttribute("data-slide");
        if (id && CHAPTERS.indexOf(id) >= 0) return id;
      }
    } catch (e) {}
    return null;
  }

  function applyChapter(frame, chapterId) {
    var id = CHAPTERS.indexOf(chapterId) >= 0 ? chapterId : "home";
    if (frame.getAttribute("data-world") === "nexora" && isTouchShell()) {
      postFrame(frame, { type: "portfolio-go-chapter", chapter: id });
      return;
    }
    try {
      var d = frame.contentDocument;
      if (d) {
        var link = d.querySelector('.menu-links a[data-go="' + id + '"]');
        if (link) {
          link.click();
          return;
        }
      }
    } catch (e1) {}
    if (frame.contentWindow) {
      postFrame(frame, { type: "portfolio-go-chapter", chapter: id });
    }
  }

  function injectNexoraNoArrows(frame) {
    try {
      var d = frame.contentDocument;
      if (!d || d.getElementById("nexora-remove-arrow-controls")) return;
      var st = d.createElement("style");
      st.id = "nexora-remove-arrow-controls";
      st.textContent = NEXORA_ARROW_CSS;
      (d.head || d.documentElement).appendChild(st);
    } catch (e) {}
  }

  function frameByWorld(world) {
    return frames.find(function (f) {
      return f.getAttribute("data-world") === world;
    });
  }

  function loadFrame(frame, world) {
    if (!frame) return Promise.resolve(null);
    var src = frame.getAttribute("data-src");
    if (!src) return Promise.resolve(frame);
    if (loaded[world] && frame.src && frame.src.indexOf("about:blank") === -1) {
      frame.classList.add("is-ready");
      return Promise.resolve(frame);
    }
    if (preloading[world]) return preloading[world];

    preloading[world] = new Promise(function (resolve) {
      function onLoad() {
        frame.removeEventListener("load", onLoad);
        loaded[world] = true;
        delete preloading[world];
        if (world === "nexora") injectNexoraNoArrows(frame);
        frame.classList.add("is-ready");
        resolve(frame);
      }
      frame.addEventListener("load", onLoad);
      if (!frame.src || frame.src.indexOf("about:blank") !== -1) {
        frame.src = src;
      } else if (frame.contentDocument && frame.contentDocument.readyState === "complete") {
        onLoad();
      }
    });
    return preloading[world];
  }

  function preloadWorld(world) {
    var current = getActiveWorld();
    if (world === current) return;
    loadFrame(frameByWorld(world), world);
  }

  function showWorld(world, prev) {
    var target = frameByWorld(world);
    if (!target) return;

    if (prev && prev !== target) {
      postFrame(prev, { type: "portfolio-cleanup-transition" });
      prev.classList.remove("is-active", "is-ready");
      prev.classList.add("is-leaving");
      setFramePaused(prev, true);
      setTimeout(function () {
        prev.classList.remove("is-leaving");
      }, 0);
    }

    frames.forEach(function (f) {
      var on = f === target;
      f.classList.toggle("is-active", on);
      if (on) {
        f.classList.remove("is-leaving", "is-paused");
        f.classList.add("is-ready");
        setFramePaused(f, false);
      } else if (f !== prev) {
        f.classList.remove("is-active", "is-ready", "is-leaving");
        setFramePaused(f, true);
      }
    });

    buttons.forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-world") === world);
    });
    setMasterWorld(world);
    postFrame(target, { type: "portfolio-world-enter", world: world });
    if (world === "nexora" && isTouchShell()) {
      setTimeout(function () {
        applyChapter(target, sharedChapter);
      }, 200);
    } else {
      applyChapter(target, sharedChapter);
    }
    unlockShell(world);
  }

  function switchToWorldInternal(world) {
    var current = getActiveWorld();
    if (current === world) {
      unlockShell(world);
      return Promise.resolve();
    }

    switching = true;
    var prev = frameByWorld(current);
    var target = frameByWorld(world);

    if (prev) setFramePaused(prev, true);

    buttons.forEach(function (b) {
      b.disabled = true;
      b.classList.toggle("is-active", b.getAttribute("data-world") === world);
    });
    setMasterWorld(world);

    if (prev) {
      var ch = readChapter(prev);
      if (ch) sharedChapter = ch;
    }

    if (prev && prev.getAttribute("data-world") !== world) {
      playWorldSwitchSound(world);
    }

    if (loaded[world] && target && target.src && target.src.indexOf("about:blank") === -1) {
      showWorld(world, prev);
      return Promise.resolve();
    }

    return loadFrame(target, world).then(function () {
      showWorld(world, prev);
    });
  }

  function handleWorldSwitch(world) {
    if (!world) return Promise.resolve();
    if (window.__worldTransitionRunning) {
      unlockShell(getActiveWorld() || world);
      window.__worldTransitionRunning = false;
    }

    window.__worldTransitionRunning = true;
    cleanupShellState();

    var play =
      typeof window.playWorldTransition === "function"
        ? window.playWorldTransition(world)
        : Promise.resolve();

    var safetyMs = isTouchShell() ? 3500 : 10000;
    var safety = setTimeout(function () {
      unlockShell(world);
    }, safetyMs);

    return Promise.resolve(play)
      .then(function () {
        return switchToWorldInternal(world);
      })
      .catch(function (err) {
        console.error(err);
        unlockShell(world);
        return switchToWorldInternal(world);
      })
      .finally(function () {
        clearTimeout(safety);
        cleanupShellState();
        unlockShell(world);
        window.__worldTransitionRunning = false;
      });
  }

  function switchToWorld(world) {
    if (switching && !window.__worldTransitionRunning) {
      unlockShell(getActiveWorld() || world);
    }
    return handleWorldSwitch(world);
  }

  function bootProfessional() {
    document.documentElement.classList.add("shell-ready");
    var pro = frameByWorld("professional");
    frames.forEach(function (f) {
      if (f !== pro) {
        f.removeAttribute("src");
        f.classList.remove("is-active", "is-ready");
        setFramePaused(f, true);
      }
    });
    if (!pro) return;

    pro.classList.add("is-active", "is-ready");
    setMasterWorld("professional");
    buttons.forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-world") === "professional");
    });

    function markReady() {
      loaded.professional = true;
      setFramePaused(pro, false);
      pro.classList.add("is-ready");
    }

    if (pro.src && pro.src.indexOf("PROFESSIONAL") !== -1) {
      if (pro.contentDocument && pro.contentDocument.readyState === "complete") {
        markReady();
      } else {
        pro.addEventListener("load", markReady, { once: true });
      }
      return;
    }

    var src = pro.getAttribute("data-src") || "PROFESSIONAL.html";
    pro.addEventListener("load", markReady, { once: true });
    pro.src = src;
  }

  buttons.forEach(function (btn) {
    var world = btn.getAttribute("data-world");
    btn.addEventListener("mouseenter", function () {
      preloadWorld(world);
    });
    btn.addEventListener("touchstart", function () {
      preloadWorld(world);
    }, { passive: true });
    btn.addEventListener("focus", function () {
      preloadWorld(world);
    });
    btn.addEventListener("click", function () {
      switchToWorld(world);
    });
  });

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "portfolio-chapter") return;
    if (
      typeof e.data.chapter === "string" &&
      CHAPTERS.indexOf(e.data.chapter) >= 0
    ) {
      sharedChapter = e.data.chapter;
    }
  });

  window.switchToWorld = switchToWorld;
  window.handleWorldSwitch = handleWorldSwitch;
  bootProfessional();
  if (typeof window.cleanupWorldTransition === "function") {
    window.cleanupWorldTransition(document);
  }
  cleanupShellState();
})();
