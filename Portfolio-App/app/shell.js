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
  var loaded = {};
  var soundEnabled = false;
  var lastWorld = "professional";

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
    audio.preload = "auto";
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

  function playWorldSound(world) {
    if (!soundEnabled || world === lastWorld) return;
    var clip = sounds[world];
    if (!clip) return;
    try {
      clip.currentTime = 0;
      var p = clip.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    } catch (e) {}
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", function () {
      soundEnabled = !soundEnabled;
      updateSoundButton();
    });
  }
  updateSoundButton();

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
      [0, 60, 150, 320, 700].forEach(function (ms) {
        setTimeout(function () {
          try {
            frame.contentWindow.postMessage(
              { type: "portfolio-go-chapter", chapter: id },
              "*"
            );
          } catch (e2) {}
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

  function loadFrame(frame, world, cb) {
    var src = frame.getAttribute("data-src");
    if (!src) {
      if (cb) cb();
      return;
    }
    if (loaded[world] && frame.src && frame.src.indexOf("about:blank") === -1) {
      if (cb) cb();
      return;
    }
    function onLoad() {
      frame.removeEventListener("load", onLoad);
      loaded[world] = true;
      if (world === "nexora") injectNexoraNoArrows(frame);
      if (cb) cb();
    }
    frame.addEventListener("load", onLoad);
    frame.src = src;
  }

  function showWorld(world) {
    var prev = frames.find(function (f) {
      return f.classList.contains("is-active");
    });
    if (prev) {
      var ch = readChapter(prev);
      if (ch) sharedChapter = ch;
    }

    frames.forEach(function (f) {
      f.classList.toggle("is-active", f.getAttribute("data-world") === world);
    });
    buttons.forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-world") === world);
    });
    setMasterWorld(world);

    var target = frames.find(function (f) {
      return f.getAttribute("data-world") === world;
    });
    if (!target) return;

    loadFrame(target, world, function () {
      applyChapter(target, sharedChapter);
    });

    playWorldSound(world);
    lastWorld = world;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showWorld(btn.getAttribute("data-world"));
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

  frames.forEach(function (frame) {
    var world = frame.getAttribute("data-world");
    if (frame.classList.contains("is-active")) {
      loadFrame(frame, world, function () {
        applyChapter(frame, sharedChapter);
      });
    } else {
      frame.src = "about:blank";
    }
  });

  setMasterWorld("professional");
  lastWorld = "professional";
})();
