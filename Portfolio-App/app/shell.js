(function () {
  "use strict";

  var CHAPTERS = [
    "home", "about", "profile", "values", "strengths", "projects",
    "experience", "workstyle", "why", "faq", "contact",
  ];

  var CROSSFADE_MS = 550;
  var sharedChapter = "home";
  var bar = document.querySelector(".world-bar");
  var frames = Array.from(document.querySelectorAll(".world-frame"));
  var buttons = Array.from(document.querySelectorAll(".world-bar button[data-world]"));
  var soundBtn = document.getElementById("sound-toggle");
  var loaded = { professional: false };
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
    var h = bar ? bar.offsetHeight : 56;
    document.documentElement.style.setProperty("--bar-h", h + "px");
  }

  window.addEventListener("resize", setBarHeight, { passive: true });
  setBarHeight();

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
      [0, 60, 150, 320].forEach(function (ms) {
        setTimeout(function () {
          postFrame(frame, { type: "portfolio-go-chapter", chapter: id });
        }, ms);
      });
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

  function loadFrame(frame, world) {
    var src = frame.getAttribute("data-src");
    if (!src) return Promise.resolve(frame);
    if (loaded[world] && frame.src && frame.src.indexOf("about:blank") === -1) {
      return Promise.resolve(frame);
    }
    return new Promise(function (resolve) {
      function onLoad() {
        frame.removeEventListener("load", onLoad);
        loaded[world] = true;
        if (world === "nexora") injectNexoraNoArrows(frame);
        frame.classList.add("is-ready");
        resolve(frame);
      }
      frame.addEventListener("load", onLoad);
      frame.src = src;
    });
  }

  function crossfadeToWorld(world, prev) {
    var target = frames.find(function (f) {
      return f.getAttribute("data-world") === world;
    });
    if (!target) return Promise.resolve();

    return loadFrame(target, world).then(function () {
      if (prev && prev !== target) {
        prev.classList.add("is-leaving");
        prev.classList.remove("is-active");
        setFramePaused(prev, true);
      }

      frames.forEach(function (f) {
        var on = f === target;
        f.classList.toggle("is-active", on);
        if (on) {
          f.classList.remove("is-leaving");
          f.classList.add("is-ready");
          setFramePaused(f, false);
        }
      });

      buttons.forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-world") === world);
      });
      setMasterWorld(world);
      applyChapter(target, sharedChapter);

      return new Promise(function (resolve) {
        setTimeout(function () {
          if (prev && prev !== target) {
            prev.classList.remove("is-leaving");
          }
          resolve();
        }, CROSSFADE_MS);
      });
    });
  }

  function runTransition(world) {
    if (typeof window.playWorldTransition === "function") {
      return window.playWorldTransition(world);
    }
    return Promise.resolve();
  }

  function switchToWorld(world) {
    if (!world || switching) return Promise.resolve();
    var current = getActiveWorld();
    if (current === world) return Promise.resolve();

    switching = true;
    var prev = frames.find(function (f) {
      return f.getAttribute("data-world") === current;
    });

    buttons.forEach(function (b) {
      b.disabled = true;
      b.classList.toggle("is-active", b.getAttribute("data-world") === world);
    });
    setMasterWorld(world);

    if (prev && prev.getAttribute("data-world") !== world) {
      playWorldSwitchSound(world);
    }

    var preloadPromise = loadFrame(
      frames.find(function (f) {
        return f.getAttribute("data-world") === world;
      }),
      world
    );

    return Promise.all([runTransition(world), preloadPromise])
      .then(function () {
        return crossfadeToWorld(world, prev);
      })
      .finally(function () {
        switching = false;
        buttons.forEach(function (b) {
          b.disabled = false;
        });
      });
  }

  function bootProfessional() {
    document.documentElement.classList.add("shell-booting");
    var pro = frames.find(function (f) {
      return f.getAttribute("data-world") === "professional";
    });
    frames.forEach(function (f) {
      if (f !== pro) {
        f.removeAttribute("src");
        f.classList.remove("is-active", "is-ready");
        setFramePaused(f, true);
      }
    });
    if (!pro) return;
    pro.classList.add("is-active");
    setMasterWorld("professional");
    buttons.forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-world") === "professional");
    });

    function reveal() {
      pro.classList.add("is-ready");
      loaded.professional = true;
      setFramePaused(pro, false);
      requestAnimationFrame(function () {
        document.documentElement.classList.remove("shell-booting");
        document.documentElement.classList.add("shell-ready");
      });
    }

    if (pro.src && pro.src.indexOf("PROFESSIONAL") !== -1) {
      if (pro.contentDocument && pro.contentDocument.readyState === "complete") {
        reveal();
      } else {
        pro.addEventListener("load", reveal, { once: true });
      }
      return;
    }

    var src = pro.getAttribute("data-src") || "PROFESSIONAL.html";
    pro.addEventListener("load", reveal, { once: true });
    pro.src = src;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchToWorld(btn.getAttribute("data-world"));
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
  bootProfessional();
})();
