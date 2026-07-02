/**
 * MULTIVERSUM Scroll Story V5 — Welt-Collage / Mindmap-Hover, 6 Kapitel.
 */
(function () {
  "use strict";

  var WORLD_KEYS = ["multiversum", "nexora", "professional", "freiraum"];
  var WORLD_INDEX = { multiversum: 0, nexora: 1, professional: 2, freiraum: 3 };
  var WORLD_SHELL_KEY = { multiversum: "general", nexora: "nexora", professional: "vertex", freiraum: "freiraum" };
  var BASE = "assets/multiversum-v4/";
  var V = "?v=20260629mv-v4live";

  var ASSETS = {
    bg: {
      multiverse: BASE + "backgrounds/webp/background_deep_space_neutral.webp",
      nexora: BASE + "backgrounds/webp/background_v4_neutral_blue_plum.webp",
      professional: BASE + "backgrounds/webp/background_v4_professional_silver.webp",
      freiraum: BASE + "backgrounds/webp/background_v4_freiraum_plum_magenta.webp",
      overview: BASE + "backgrounds/webp/background_multiverse_three_worlds.webp",
    },
    orbs: {
      multiversum: "assets/multiversum-parallax-v4/orbs/Multiversum.png",
      nexora: "assets/multiversum-parallax-v4/orbs/Nexora.png",
      professional: "assets/multiversum-parallax-v4/orbs/Professional_new_new.png",
      freiraum: "assets/multiversum-parallax-v4/orbs/Freiraum.png",
    },
    accents: {
      nexora: [
        BASE + "cards/webp/cards_nexora_floating_data_panels.webp",
        BASE + "particles/webp/particles_nexora_network.webp",
        BASE + "trails/webp/trail_nexora_blue_data_flow.webp",
      ],
      professional: [
        BASE + "cards/webp/cards_professional_precision_panels.webp",
        BASE + "particles/webp/particles_professional_silver.webp",
        BASE + "trails/webp/trail_professional_silver_precision.webp",
      ],
      freiraum: [
        BASE + "cards/webp/cards_freiraum_creative_panels.webp",
        BASE + "particles/webp/particles_freiraum_magenta.webp",
        BASE + "trails/webp/trail_freiraum_magenta_orange_flow.webp",
      ],
    },
    glows: {
      nexora: BASE + "overlays/webp/overlay_nexora_blue_glow.webp",
      professional: BASE + "overlays/webp/overlay_professional_silver_glow.webp",
      freiraum: BASE + "overlays/webp/overlay_freiraum_magenta_orange_glow.webp",
      merge: BASE + "overlays/webp/overlay_multiverse_connection_glow.webp",
    },
    transitionTrail: BASE + "trails/webp/trail_multiverse_connection.webp",
    deco: {
      nexora: {
        orbit: BASE + "orbits/webp/orbit_nexora_blue_double.webp",
        orbit2: BASE + "orbits/webp/orbit_nexora_blue_double.webp",
        particles: BASE + "particles/webp/particles_nexora_network.webp",
        light: BASE + "overlays/webp/overlay_nexora_blue_glow.webp",
        line: BASE + "trails/webp/trail_nexora_blue_data_flow.webp",
      },
      professional: {
        orbit: BASE + "orbits/webp/orbit_professional_silver_double.webp",
        orbit2: BASE + "orbits/webp/orbit_professional_silver_double.webp",
        particles: BASE + "particles/webp/particles_professional_silver.webp",
        light: BASE + "overlays/webp/overlay_professional_silver_glow.webp",
        line: BASE + "trails/webp/trail_professional_silver_precision.webp",
      },
      freiraum: {
        orbit: BASE + "orbits/webp/orbit_freiraum_magenta_orange.webp",
        orbit2: BASE + "orbits/webp/orbit_freiraum_magenta_orange.webp",
        particles: BASE + "particles/webp/particles_freiraum_magenta.webp",
        light: BASE + "overlays/webp/overlay_freiraum_magenta_orange_glow.webp",
        line: BASE + "trails/webp/trail_freiraum_magenta_orange_flow.webp",
      },
      multiverse: {
        orbit: BASE + "orbits/webp/orbit_nexora_blue_double.webp",
        orbit2: BASE + "orbits/webp/orbit_freiraum_magenta_orange.webp",
        particles: BASE + "particles/webp/particles_multiverse_mix.webp",
        light: BASE + "overlays/webp/overlay_multiverse_connection_glow.webp",
        line: BASE + "trails/webp/trail_multiverse_connection.webp",
      },
      multiversum: {
        orbit: BASE + "orbits/webp/orbit_nexora_blue_double.webp",
        orbit2: BASE + "orbits/webp/orbit_freiraum_magenta_orange.webp",
        particles: BASE + "particles/webp/particles_multiverse_mix.webp",
        light: BASE + "overlays/webp/overlay_multiverse_connection_glow.webp",
        line: BASE + "trails/webp/trail_multiverse_connection.webp",
      },
    },
    scrollCue: BASE + "particles/webp/particles_multiverse_mix.webp",
  };

  var PORTFOLIO_CARDS = [
    { go: "projects", label: "Projekte", sub: "Arbeit aus allen Welten" },
    { go: "leistungen", label: "Leistungen", sub: "Was ich anbiete" },
    { go: "about", label: "Über mich", sub: "Persönlichkeit & Kompetenz" },
    { go: "contact", label: "Kontakt", sub: "Nächster Schritt" },
  ];

  var rafId = 0;
  var scrollRoot = null;
  var heroEl = null;
  var dom = {};
  var config = null;
  var mobileLayout = false;
  var tabletLayout = false;
  var reducedMotion = false;
  var animProgress = 0;
  var mouseParallax = { x: 0, y: 0 };
  var portfolioHoldScrolls = 0;
  var portfolioHoldUnlocked = false;
  var PORTFOLIO_HOLD_SCROLLS = 3;
  var onScrollHandler = null;
  var bootPaintDone = false;

  function asset(path) {
    if (!path || typeof path !== "string") return path;
    if (path.indexOf("?") !== -1) return path;
    return path + V;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function deepLerp(a, b, t) {
    if (a == null) return b;
    if (b == null) return a;
    if (typeof a === "number" && typeof b === "number") return lerp(a, b, t);
    if (typeof a === "object" && !Array.isArray(a)) {
      var out = {};
      var keys = Object.keys(a);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        out[k] = deepLerp(a[k], b[k], t);
      }
      return out;
    }
    return t < 0.5 ? a : b;
  }

  function segmentBlendT(local, holdPortion) {
    holdPortion = holdPortion !== undefined ? holdPortion : config.segmentHold || 0.72;
    var trans = (1 - holdPortion) / 2;
    if (trans <= 0.001) return clamp(local, 0, 1);
    if (local >= 1 - trans) {
      return easeInOutCubic((local - (1 - trans)) / trans);
    }
    return 0;
  }

  function getState(p) {
    var bounds = config.bounds;
    var kf = config.keyframes;
    var hold = config.segmentHold || 0.72;
    for (var i = 0; i < bounds.length - 1; i++) {
      if (p <= bounds[i + 1]) {
        var local = segmentProgress(p, bounds[i], bounds[i + 1]);
        var t = segmentBlendT(local, hold);
        var state = deepLerp(kf[i], kf[Math.min(i + 1, kf.length - 1)], t);
        state.backgrounds = exclusiveBackgroundWeights(state.backgrounds);
        return state;
      }
    }
    var finalState = kf[kf.length - 1];
    finalState.backgrounds = exclusiveBackgroundWeights(finalState.backgrounds);
    return finalState;
  }

  function exclusiveBackgroundWeights(bgs) {
    var keys = ["multiverse", "nexora", "professional", "freiraum"];
    var ranked = keys
      .map(function (k) {
        return { k: k, v: (bgs && bgs[k]) || 0 };
      })
      .sort(function (a, b) {
        return b.v - a.v;
      });
    var out = { multiverse: 0, nexora: 0, professional: 0, freiraum: 0 };
    if (!ranked[0] || ranked[0].v < 0.01) return out;
    var top = ranked[0];
    var second = ranked[1];
    if (!second || second.v < 0.04) {
      out[top.k] = top.v;
      return out;
    }
    var sum = top.v + second.v;
    if (sum < 0.01) return out;
    out[top.k] = top.v / sum;
    out[second.k] = second.v / sum;
    return out;
  }

  function bookendBackgroundForLayout(layoutMode) {
    if (layoutMode === "intro" || layoutMode === "finale" || layoutMode === "portfolio") {
      return { multiverse: 1, nexora: 0, professional: 0, freiraum: 0 };
    }
    return null;
  }

  function slideKind(index) {
    var slide = config.slides[index];
    return slide ? slide.sceneKind || "intro" : "intro";
  }

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function sceneEnvelope(local, slideIndex) {
    var timing = (config && config.timing) || {};
    var enter = timing.enter || 0.12;
    var exit = timing.exit || 0.1;
    var enterT = easeInOutSine(clamp(local / enter, 0, 1));
    var exitT = local > 1 - exit ? easeInOutSine(clamp((local - (1 - exit)) / exit, 0, 1)) : 0;
    var hold = enterT * (1 - exitT);
    if (slideIndex === 0 && local < 0.04) {
      hold = easeOutQuart(clamp(local / 0.04, 0, 1));
    }
    return hold;
  }

  function slideVisibility(p, start, end, fade) {
    if (p < start || p > end) return { opacity: 0, y: 28, active: false };
    var seg = Math.max(end - start, 0.001);
    var timing = (config && config.timing) || {};
    var f = seg * (timing.fade || fade || 0.08);
    var opacity = 1;
    var y = 0;
    if (p < start + f) {
      var t = easeInOutSine(clamp((p - start) / f, 0, 1));
      opacity = t;
      y = lerp(18, 0, t);
    } else if (p > end - f) {
      var t2 = easeInOutSine(clamp((p - (end - f)) / f, 0, 1));
      opacity = 1 - t2;
      y = lerp(0, -18, t2);
    }
    return { opacity: opacity, y: y, active: opacity > 0.06 };
  }

  function chapterHash(goChapter, targetHash) {
    var hashMap = {
      home: "#home",
      projects: "#projekte",
      leistungen: "#leistungen",
      about: "#ueber-mich",
      contact: "#kontakt",
    };
    if (targetHash) {
      var raw = String(targetHash).trim();
      if (!raw) return hashMap[goChapter] || "#home";
      return raw.charAt(0) === "#" ? raw : "#" + raw;
    }
    return hashMap[goChapter] || "#home";
  }

  function worldHref(world, goChapter, targetHash) {
    var pages = (window.MVWorldCollage && window.MVWorldCollage.pages) || {};
    var page = pages[world] || "";
    if (!page) return "#";
    var hash = chapterHash(goChapter, targetHash);
    return hash === "#home" ? page : page + hash;
  }

  function requestWorldSwitch(worldKey, targetHash, goChapter) {
    if (!worldKey) return;
    var shellKey = WORLD_SHELL_KEY[worldKey];
    if (!shellKey) return;
    var go = goChapter || "home";
    var hash = chapterHash(go, targetHash);
    var href = worldHref(worldKey, go, targetHash);

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "alex:switch-world",
            world: worldKey,
            targetHash: hash === "#home" ? "" : hash,
            go: go,
            href: href,
          },
          "*"
        );
        return;
      }
    } catch (e) {}

    if (href && href !== "#") {
      window.location.assign(href);
      return;
    }

    var btn = document.querySelector('.mv4-worlds [data-world-key="' + shellKey + '"]');
    if (btn) {
      btn.click();
    } else {
      switchWorldIndex(worldKey);
    }

    if (hash !== "#home" || go !== "home") {
      setTimeout(function () {
        scrollSectionInFrame(hash, go);
      }, 480);
    }
  }

  function switchWorldIndex(worldKey) {
    var idx = WORLD_INDEX[worldKey];
    if (idx === undefined) return;
    if (typeof window.switchToWorldIndex === "function") {
      window.switchToWorldIndex(idx);
      return;
    }
    try {
      if (window.parent && window.parent !== window && typeof window.parent.switchToWorldIndex === "function") {
        window.parent.switchToWorldIndex(idx);
      }
    } catch (e2) {}
  }

  function scrollSectionInFrame(targetHash, goChapter) {
    if (window.WeltenSiteIA && typeof window.WeltenSiteIA.scrollToSection === "function") {
      window.WeltenSiteIA.scrollToSection(targetHash, goChapter);
      return;
    }
    if (goChapter && window.WeltenSiteIA && typeof window.WeltenSiteIA.navigateToChapter === "function") {
      window.WeltenSiteIA.navigateToChapter(goChapter);
    }
    var hash = targetHash || "";
    if (!hash) return;
    setTimeout(function () {
      var id = hash.replace(/^#/, "");
      var el =
        document.getElementById(id) ||
        document.getElementById("slide-" + id) ||
        document.querySelector('[data-slide="' + id + '"]');
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (window.WeltenSiteIA && typeof window.WeltenSiteIA.navigateToChapter === "function") {
        window.WeltenSiteIA.navigateToChapter(id);
      }
    }, 160);
  }

  function switchWorld(key, targetHash, goChapter) {
    requestWorldSwitch(key, targetHash, goChapter);
  }

  function isEmbeddedFrame() {
    try {
      return !!(window.parent && window.parent !== window);
    } catch (e) {
      return false;
    }
  }

  function navigateWorldLink(world, targetHash, goChapter, href) {
    var go = goChapter || "home";
    var hash = chapterHash(go, targetHash);
    if (isEmbeddedFrame()) {
      requestWorldSwitch(world, hash, go);
      return;
    }
    var dest = href && href !== "#" ? href : worldHref(world, go, targetHash);
    if (dest && dest !== "#") {
      window.location.assign(dest);
      return;
    }
    requestWorldSwitch(world, hash, go);
  }

  function bindPressFeedback(root) {
    root.querySelectorAll(".world-core, .world-card").forEach(function (el) {
      function clearPressed() {
        el.classList.remove("is-pressed");
      }
      el.addEventListener("mousedown", function () {
        el.classList.add("is-pressed");
      });
      el.addEventListener("mouseup", clearPressed);
      el.addEventListener("mouseleave", clearPressed);
      el.addEventListener(
        "touchstart",
        function () {
          el.classList.add("is-pressed");
        },
        { passive: true }
      );
      el.addEventListener("touchend", clearPressed);
      el.addEventListener("touchcancel", clearPressed);
    });
  }

  function bindWorldCoreLinks(root) {
    root.querySelectorAll("a.world-core[data-world]").forEach(function (core) {
      core.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        navigateWorldLink(core.getAttribute("data-world"), "", "home", core.getAttribute("href"));
      });
    });
  }

  function bindWorldNavigation(root) {
    root.addEventListener(
      "click",
      function (e) {
        var core = e.target.closest("a.world-core[data-world]");
        if (core) {
          e.preventDefault();
          e.stopPropagation();
          navigateWorldLink(core.getAttribute("data-world"), "", "home", core.getAttribute("href"));
          return;
        }
        var card = e.target.closest("a.world-card[data-world]");
        if (!card) return;
        e.preventDefault();
        e.stopPropagation();
        navigateWorldLink(
          card.getAttribute("data-world"),
          card.getAttribute("data-target"),
          card.getAttribute("data-go"),
          card.getAttribute("href")
        );
      },
      true
    );
    bindPressFeedback(root);
    bindWorldCoreLinks(root);
  }

  function bindGoButtons(root, goChapter) {
    root.querySelectorAll(".mv-scroll-portfolio [data-go]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof goChapter === "function") goChapter(btn.getAttribute("data-go"));
      });
    });
    root.querySelectorAll("[data-world-enter]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var world = btn.getAttribute("data-world-enter");
        navigateWorldLink(world, "", "home", worldPageHref(world));
      });
    });
    bindWorldNavigation(root);
  }

  function segmentProgress(p, start, end) {
    if (end <= start) return 0;
    return clamp((p - start) / (end - start), 0, 1);
  }

  function isWorldSlide(index) {
    return slideKind(index) === "world";
  }

  function worldChapterIndex(world) {
    var map = { multiversum: 0, nexora: 1, professional: 2, freiraum: 3 };
    return map[world];
  }

  function collageFocusForScene(sceneIndex) {
    var kind = slideKind(sceneIndex);
    if (kind === "world") {
      var slide = config.slides[sceneIndex];
      return slide && slide.worldType ? slide.worldType : "all";
    }
    if (kind === "reveal") return "reveal";
    if (kind === "merge") return "all";
    return "none";
  }

  function revealedWorldsForScene(sceneIndex) {
    var slide = config.slides[sceneIndex];
    if (!slide) return [];
    if (slide.revealedWorlds && slide.revealedWorlds.length) return slide.revealedWorlds;
    if (slide.sceneKind === "world" && slide.worldType) return [slide.worldType];
    if (slide.sceneKind === "merge") return WORLD_KEYS;
    return [];
  }

  function slideVisibilityRange(slideIndex) {
    var slide = config.slides[slideIndex];
    var ch = config.chapters || {};
    if (!slide) return [0, 0];
    if (slide.visibility) return slide.visibility;
    var kind = slide.sceneKind || "intro";
    if (kind === "intro") return [0, (ch.introToMultiversum && ch.introToMultiversum[1]) || (ch.introToNexora && ch.introToNexora[1]) || 0.18];
    if (kind === "world" && slide.worldType === "multiversum") {
      return [ch.multiversumFocus[0], ch.multiversumToNexora[1]];
    }
    if (kind === "world" && slide.worldType === "nexora") {
      return [ch.nexoraFocus[0], ch.nexoraToProfessional[1]];
    }
    if (kind === "world" && slide.worldType === "professional") {
      return [ch.professionalFocus[0], ch.professionalToFreiraum[1]];
    }
    if (kind === "world" && slide.worldType === "freiraum") {
      return [ch.freiraumFocus[0], ch.freiraumFocus[1]];
    }
    if (kind === "merge") return [0, 0];
    if (kind === "finale") return ch.finaleCopyOnly || [0.86, 0.91];
    return [config.bounds[slideIndex], config.bounds[slideIndex + 1]];
  }

  function chapterRange(name, fallback) {
    var ch = (config && config.chapters) || {};
    return ch[name] || fallback;
  }

  function freiraumChapterEnd() {
    return chapterRange("freiraumFocus", [0.7, 0.8])[1];
  }

  function introChapterEnd() {
    var ch = (config && config.chapters) || {};
    return (ch.introToMultiversum && ch.introToMultiversum[1]) || (ch.intro && ch.intro[1]) || 0.18;
  }

  function isPostWorldPhase(phaseP, layoutMode) {
    if (layoutMode === "finale" || layoutMode === "portfolio") return true;
    return phaseP >= freiraumChapterEnd();
  }

  function worldsContentVisible(phaseP, layoutMode) {
    return !isPostWorldPhase(phaseP, layoutMode) && layoutMode === "split-world";
  }

  function layoutModeForProgress(p, activeSlide) {
    var finCopy = chapterRange("finaleCopyOnly", [0.86, 0.91]);
    var port = chapterRange("portfolioButtons", [0.93, 0.97]);
    if (p >= port[0]) return "portfolio";
    if (p >= finCopy[0]) return "finale";
    if (p >= freiraumChapterEnd()) return "finale";
    return layoutModeForScene(activeSlide);
  }

  function slideIndexForWorld(worldType) {
    if (!config || !config.slides) return -1;
    for (var i = 0; i < config.slides.length; i++) {
      var slide = config.slides[i];
      if (slide && slide.sceneKind === "world" && slide.worldType === worldType) return i;
    }
    return -1;
  }

  function slideIndexForProgress(p) {
    if (!config || !config.slides) return 0;
    var finIdx = -1;
    for (var i = 0; i < config.slides.length; i++) {
      if (slideKind(i) === "finale") finIdx = i;
      var range = slideVisibilityRange(i);
      if (range[1] <= range[0]) continue;
      if (p >= range[0] && p < range[1]) return i;
    }
    if (p >= freiraumChapterEnd() && finIdx >= 0) return finIdx;
    return 0;
  }

  function boundSegmentForProgress(p) {
    var bounds = config.bounds || [];
    if (bounds.length < 2) return 0;
    for (var s = 0; s < bounds.length - 1; s++) {
      if (p >= bounds[s] && p < bounds[s + 1]) return s;
    }
    return bounds.length - 2;
  }

  function worldBuildProgress(p, worldType) {
    if (!config || !config.chapters) return 0;
    var key =
      worldType === "multiversum"
        ? "multiversumFocus"
        : worldType === "nexora"
        ? "nexoraFocus"
        : worldType === "professional"
        ? "professionalFocus"
        : worldType === "freiraum"
        ? "freiraumFocus"
        : "";
    var range = key ? config.chapters[key] : null;
    if (!range) return 0;
    return sceneEnvelope(segmentProgress(p, range[0], range[1]), 0);
  }

  function worldScenePhases(local, slideIndex) {
    var kind = slideKind(slideIndex);
    if (kind === "world") {
      var chapter = worldChapterPhases(local);
      return {
        orb: chapter.worldOpacity,
        copy: chapter.textOpacity,
        cards: chapter.worldIn,
        hint: 0,
        trail: 0,
        env: chapter.worldOpacity,
        chapter: chapter,
      };
    }
    var env = sceneEnvelope(local, slideIndex);
    if (kind === "finale") {
      var copyOut = local > 0.55 ? easeInOutSine(clamp((local - 0.55) / 0.2, 0, 1)) : 0;
      return {
        orb: env,
        copy: env * (1 - copyOut),
        cards: env,
        hint: 0,
        trail: 0,
        env: env,
      };
    }
    return {
      orb: env,
      copy: env,
      cards: env,
      hint: 0,
      trail: 0,
      env: env,
    };
  }

  function layoutModeForScene(sceneIndex) {
    var kind = slideKind(sceneIndex);
    if (kind === "intro") return "intro";
    if (kind === "reveal" || kind === "merge") return "overview";
    if (kind === "world") return "split-world";
    if (kind === "finale") return "finale";
    return "intro";
  }

  function worldStageOpacity(activeSlide, p, phases, slideLocal) {
    if (p >= freiraumChapterEnd()) return 0;
    var kind = slideKind(activeSlide);
    if (kind === "intro") return lerp(0.9, 1, easeInOutSine(slideLocal || 0));
    if (kind === "finale") return 0;
    if (kind === "world") return phases.orb || 0;
    if (kind === "merge") return 0;
    return 0;
  }

  function cardOrbitForZone(kind, world, hasCards, isFocus, isRevealFocus) {
    if (kind === "world" && isFocus) return "38cqmin";
    if (kind === "reveal" && isRevealFocus) return "32cqmin";
    if (kind === "reveal" && hasCards) return "28cqmin";
    if (kind === "merge" && hasCards) return "36cqmin";
    return "28cqmin";
  }

  function topicVisibilityForWorld() {
    return { opacity: 0, build: 0 };
  }

  function layerShift(p, factor, par) {
    return -p * factor * 28 * par;
  }

  var WORLD_CHAPTER = {
    worldEnterEnd: 0.2,
    textStart: 0.22,
    holdEnd: 0.87,
    fadeEnd: 1,
  };

  function worldChapterPhases(focusLocal) {
    var worldIn = easeInOutSine(clamp(focusLocal / WORLD_CHAPTER.worldEnterEnd, 0, 1));
    var fadeOut =
      focusLocal > WORLD_CHAPTER.holdEnd
        ? easeInOutSine(clamp((focusLocal - WORLD_CHAPTER.holdEnd) / (WORLD_CHAPTER.fadeEnd - WORLD_CHAPTER.holdEnd), 0, 1))
        : 0;
    var worldOpacity = worldIn * (1 - fadeOut);
    var showText = focusLocal >= WORLD_CHAPTER.textStart && fadeOut < 0.98;
    var textLocal = 0;
    if (showText) {
      textLocal =
        focusLocal >= WORLD_CHAPTER.holdEnd
          ? 1
          : clamp((focusLocal - WORLD_CHAPTER.textStart) / (WORLD_CHAPTER.holdEnd - WORLD_CHAPTER.textStart), 0, 1);
    }
    return {
      worldIn: worldIn,
      worldOpacity: worldOpacity,
      textOpacity: showText ? worldOpacity : 0,
      textLocal: textLocal,
      showText: showText,
      hold: 1 - fadeOut,
      fadeOut: fadeOut,
    };
  }

  function worldChapterHold(slideLocal) {
    return worldChapterPhases(slideLocal).hold;
  }

  function applyWorldExplainTexts(copyEl, textLocal, copyOpacity) {
    if (!copyEl) return;
    var eyebrowEl = copyEl.querySelector(".mv-scroll-slide__eyebrow");
    var leadEl = copyEl.querySelector(".mv-scroll-slide__lead");
    var whatEl = copyEl.querySelector(".mv-scroll-slide__what");
    var purposeEl = copyEl.querySelector(".mv-scroll-slide__purpose");
    var diffEl = copyEl.querySelector(".mv-scroll-slide__diff");
    var enterBtn = copyEl.querySelector(".mv-scroll-slide__enter");
    var t = textLocal;
    function step(start, span) {
      return easeInOutSine(clamp((t - start) / span, 0, 1)) * copyOpacity;
    }
    if (eyebrowEl) {
      var eyebrowOp = step(0, 0.1);
      eyebrowEl.style.opacity = String(eyebrowOp);
    }
    if (leadEl) {
      leadEl.style.opacity = String(step(0.04, 0.1));
      leadEl.style.transform = "translateY(" + lerp(12, 0, step(0.04, 0.1) / Math.max(copyOpacity, 0.001)) + "px)";
    }
    if (whatEl) {
      whatEl.style.opacity = String(step(0.16, 0.12));
      whatEl.style.transform = "translateY(" + lerp(14, 0, step(0.16, 0.12) / Math.max(copyOpacity, 0.001)) + "px)";
    }
    if (purposeEl) {
      purposeEl.style.opacity = String(step(0.32, 0.12));
      purposeEl.style.transform = "translateY(" + lerp(14, 0, step(0.32, 0.12) / Math.max(copyOpacity, 0.001)) + "px)";
    }
    if (diffEl) {
      diffEl.style.opacity = String(step(0.48, 0.12));
      diffEl.style.transform = "translateY(" + lerp(14, 0, step(0.48, 0.12) / Math.max(copyOpacity, 0.001)) + "px)";
    }
    if (enterBtn) {
      enterBtn.style.opacity = String(step(0.62, 0.12));
    }
  }

  function resetWorldExplainTexts(copyEl) {
    if (!copyEl) return;
    copyEl.querySelectorAll(".mv-scroll-slide__eyebrow, .mv-scroll-slide__lead, .mv-scroll-slide__what, .mv-scroll-slide__purpose, .mv-scroll-slide__diff, .mv-scroll-slide__enter").forEach(function (el) {
      el.style.opacity = "";
      el.style.transform = "";
    });
  }

  function topicCardsMarkup(world, items) {
    var cards = items
      .map(function (item, i) {
        return (
          '<article class="mv-topic-card"><span class="mv-topic-card__kicker">0' +
          (i + 1) +
          "</span>" +
          '<h3>' +
          item.title +
          "</h3><p>" +
          item.body +
          "</p></article>"
        );
      })
      .join("");
    return (
      '<div class="mv-topic-wrap mv-topic-wrap--' +
      world +
      '" data-topic-world="' +
      world +
      '">' +
      '<div class="mv-topic-grid mv-topic-grid--' +
      world +
      '">' +
      cards +
      "</div></div>"
    );
  }

  function atmosphereMarkup() {
    return (
      '<div class="mv-atmo mv-atmo--nexora" data-atmo="nexora">' +
      '<div class="mv-hud"><span class="mv-hud__corner mv-hud__corner--tl"></span><span class="mv-hud__corner mv-hud__corner--tr"></span>' +
      '<span class="mv-hud__corner mv-hud__corner--bl"></span><span class="mv-hud__corner mv-hud__corner--br"></span>' +
      '<span class="mv-hud__scan"></span><span class="mv-hud__label">SYS · NEXORA</span></div>' +
      '<div class="mv-data-stream"></div></div>' +
      '<div class="mv-atmo mv-atmo--professional" data-atmo="professional">' +
      '<div class="mv-glass-panel mv-glass-panel--a"></div><div class="mv-glass-panel mv-glass-panel--b"></div>' +
      '<div class="mv-glass-panel mv-glass-panel--c"></div></div>' +
      '<div class="mv-atmo mv-atmo--freiraum" data-atmo="freiraum">' +
      '<div class="mv-organic mv-organic--a"></div><div class="mv-organic mv-organic--b"></div>' +
      '<div class="mv-organic mv-organic--c"></div></div>'
    );
  }

  function decoSetMarkup(theme) {
    var d = ASSETS.deco[theme];
    return (
      '<div class="mv-scroll-deco-set" data-deco-theme="' +
      theme +
      '">' +
      '<img data-d="orbit" src="' +
      asset(d.orbit) +
      '" alt="" loading="lazy" decoding="async" />' +
      '<img data-d="orbit2" src="' +
      asset(d.orbit2) +
      '" alt="" loading="lazy" decoding="async" />' +
      '<img data-d="light" src="' +
      asset(d.light) +
      '" alt="" loading="lazy" decoding="async" />' +
      '<img data-d="line" src="' +
      asset(d.line) +
      '" alt="" loading="lazy" decoding="async" />' +
      "</div>"
    );
  }

  function worldAccentMarkup() {
    return "";
  }

  function getCollageCards(world) {
    var cfg = window.MVWorldCollage;
    if (!cfg) return [];
    var all = cfg.dedupeCards ? cfg.dedupeCards(cfg.worldCards[world] || cfg.cards[world] || []) : cfg.worldCards[world] || cfg.cards[world] || [];
    var limit = cfg.getCardLimit ? cfg.getCardLimit(window.innerWidth) : 8;
    return all.slice(0, limit);
  }

  function worldPageHref(world) {
    var pages = (window.MVWorldCollage && window.MVWorldCollage.pages) || {};
    return pages[world] || "#";
  }

  function cardOrbitAngle(index, total) {
    return -90 + index * (360 / Math.max(total, 1));
  }

  function worldZoneMarkup(world, label) {
    var cards = getCollageCards(world);
    var cardsHtml = cards
      .map(function (c, i) {
        var angle = cardOrbitAngle(i, cards.length);
        return (
          '<a class="world-card" href="' +
          (c.href || "#") +
          '" data-world="' +
          world +
          '" data-go="' +
          (c.go || "") +
          '" data-target="' +
          (c.target || "") +
          '" data-card-index="' +
          i +
          '" data-card="' +
          (c.cardSlug || c.go || "home") +
          '" style="--card-angle:' +
          angle +
          'deg" aria-label="' +
          label +
          " " +
          c.label +
          ' öffnen"><div class="world-card__image"><img src="' +
          asset(c.image) +
          '" alt="' +
          c.label +
          '" loading="lazy" decoding="async" /></div><div class="world-card__label">' +
          c.label +
          "</div></a>"
        );
      })
      .join("");
    return (
      '<section class="mv-scroll-orb mv-scroll-orb--' +
      world +
      ' world-zone world-zone--' +
      world +
      '" data-world-zone="' +
      world +
      '" data-world="' +
      world +
      '" data-orb="' +
      world +
      '">' +
      '<a class="world-core" href="' +
      worldPageHref(world) +
      '" data-world="' +
      world +
      '" data-go="home" data-target="" title="' +
      label +
      ' Home öffnen" aria-label="' +
      label +
      ' Home öffnen">' +
      '<img class="mv-orb-bubble__standalone" src="' +
      asset(ASSETS.orbs[world]) +
      '" alt="' +
      label +
      '" loading="eager" decoding="async" fetchpriority="high" />' +
      '<span class="mv-orb-bubble__label world-name">' +
      label +
      "</span></a>" +
      '<div class="world-collage" data-world-collage="' +
      world +
      '">' +
      cardsHtml +
      '<button type="button" class="world-cards-more mv-form-btn" data-world-more="' +
      world +
      '">Alle Bereiche ansehen</button>' +
      "</div></section>"
    );
  }

  function slidesMarkup() {
    return config.slides
      .map(function (s, i) {
        var copyPos = s.copyPos || "";
        var kind = s.sceneKind || "intro";
        var isWorld = kind === "world";
        var isReveal = kind === "reveal";
        var stepClass = "world-step world-step--center";
        if (isWorld) {
          stepClass =
            s.worldSide === "left"
              ? "world-step world-step--split"
              : "world-step world-step--split world-step--visual-right";
        }
        var worldBtn =
          isWorld && s.worldType
            ? '<button type="button" class="mv-scroll-slide__enter mv-form-btn" data-world-enter="' +
              s.worldType +
              '">Welt öffnen</button>'
            : "";
        var copyInner = "";
        if (isReveal) {
          copyInner = "";
        } else if (isWorld) {
          copyInner =
            '<div class="scene-copy scene-copy--world-explainer">' +
            (s.label ? '<p class="mv-scroll-slide__eyebrow">' + s.label + "</p>" : "") +
            (s.lead ? '<p class="mv-scroll-slide__lead"><strong>' + s.lead + "</strong></p>" : "") +
            (s.body ? '<p class="mv-scroll-slide__what">' + s.body + "</p>" : "") +
            (s.purpose ? '<p class="mv-scroll-slide__purpose">' + s.purpose + "</p>" : "") +
            (s.difference ? '<p class="mv-scroll-slide__diff">' + s.difference + "</p>" : "") +
            worldBtn +
            "</div>";
        } else {
          copyInner =
            '<div class="scene-copy' +
            (kind === "finale" ? " final-copy" : "") +
            '">' +
            (s.eyebrow ? '<p class="mv-scroll-slide__eyebrow">' + s.eyebrow + "</p>" : "") +
            (s.title ? "<h2>" + s.title + "</h2>" : "") +
            (s.body ? '<p class="mv-scroll-slide__body">' + s.body + "</p>" : "") +
            "</div>";
        }
        return (
          '<article class="mv-scroll-slide ' +
          (s.worldType ? " mv-scroll-slide--" + s.worldType : "") +
          (isWorld ? " mv-scroll-slide--world" : "") +
          (isReveal ? " mv-scroll-slide--reveal" : "") +
          (kind === "finale" ? " mv-scroll-slide--finale" : "") +
          '" data-slide="' +
          i +
          '" data-scene-kind="' +
          kind +
          '">' +
          '<div class="' +
          stepClass +
          '">' +
          '<div class="world-visual" aria-hidden="true"></div>' +
          '<div class="world-copy ' +
          copyPos +
          '">' +
          copyInner +
          "</div></div>" +
          "</article>"
        );
      })
      .join("");
  }

  function portfolioHref(go) {
    var hashMap = {
      projects: "#projekte",
      leistungen: "#leistungen",
      about: "#ueber-mich",
      contact: "#kontakt",
    };
    var hash = hashMap[go] || "#home";
    return hash === "#home" ? "MULTIVERSUM.html" : "MULTIVERSUM.html" + hash;
  }

  function portfolioMarkup() {
    return PORTFOLIO_CARDS.map(function (c) {
      return (
        '<a href="' +
        portfolioHref(c.go) +
        '" class="mv-scroll-card mv-form-btn" data-go="' +
        c.go +
        '" aria-label="' +
        c.label +
        ' öffnen"><span class="mv-scroll-card__label">' +
        c.label +
        '</span><span class="mv-scroll-card__sub">' +
        c.sub +
        "</span></a>"
      );
    }).join("");
  }

  function orbSrc(world) {
    return asset(ASSETS.orbs[world]);
  }

  function heroMarkup() {
    return (
      '<div class="mv-scroll-story mv-scroll-story--v6" id="mvParallaxHero" aria-label="MULTIVERSUM Scroll-Präsentation">' +
      '<div class="mv-scroll-sticky">' +
      '<div class="mv-film-grain" aria-hidden="true"></div>' +
      '<div class="mv-world-tint" data-world-tint aria-hidden="true"></div>' +
      '<div class="mv-layer mv-layer--1" data-parallax-layer="1">' +
      '<div class="mv-scroll-bg" data-bg="multiverse"><img src="' +
      asset(ASSETS.bg.multiverse) +
      '" alt="" loading="eager" decoding="async" /></div>' +
      '<div class="mv-scroll-bg" data-bg="nexora"><img src="' +
      asset(ASSETS.bg.nexora) +
      '" alt="" loading="lazy" decoding="async" /></div>' +
      '<div class="mv-scroll-bg" data-bg="professional"><img src="' +
      asset(ASSETS.bg.professional) +
      '" alt="" loading="lazy" decoding="async" /></div>' +
      '<div class="mv-scroll-bg" data-bg="freiraum"><img src="' +
      asset(ASSETS.bg.freiraum) +
      '" alt="" loading="lazy" decoding="async" /></div>' +
      '<div class="mv-scroll-bg" data-bg="overview"><img src="' +
      asset(ASSETS.bg.overview) +
      '" alt="" loading="lazy" decoding="async" /></div>' +
      '<div class="mv-scroll-stars" data-layer="stars"></div>' +
      '<div class="mv-scroll-vignette" data-layer="vignette"></div>' +
      "</div>" +
      '<div class="mv-layer mv-layer--2" data-parallax-layer="2">' +
      decoSetMarkup("multiverse") +
      decoSetMarkup("multiversum") +
      decoSetMarkup("nexora") +
      decoSetMarkup("professional") +
      decoSetMarkup("freiraum") +
      '<img class="mv-transition-trail" data-transition-trail src="' +
      asset(ASSETS.transitionTrail) +
      '" alt="" aria-hidden="true" />' +
      "</div>" +
      '<div class="mv-layer mv-layer--3" data-parallax-layer="3">' +
      '<div class="mv-particle-field" data-particle-field="multiverse"></div>' +
      '<div class="mv-particle-field" data-particle-field="multiversum"></div>' +
      '<div class="mv-particle-field" data-particle-field="nexora"></div>' +
      '<div class="mv-particle-field" data-particle-field="professional"></div>' +
      '<div class="mv-particle-field" data-particle-field="freiraum"></div>' +
      "</div>" +
      '<div class="mv-layer mv-layer--4" data-parallax-layer="4">' +
      atmosphereMarkup() +
      '<div class="mv-world-accents" data-world-accents aria-hidden="true"></div>' +
      '<div class="mv-world-stage" data-world-stage>' +
      '<div class="mv-world-stage__glow" data-world-glow aria-hidden="true"></div>' +
      '<img class="mv-world-stage__radial mv-world-stage__radial--multiversum" data-radial-glow="multiversum" src="' +
      asset(ASSETS.glows.merge) +
      '" alt="" aria-hidden="true" />' +
      '<img class="mv-world-stage__radial mv-world-stage__radial--nexora" data-radial-glow="nexora" src="' +
      asset(ASSETS.glows.nexora) +
      '" alt="" aria-hidden="true" />' +
      '<img class="mv-world-stage__radial mv-world-stage__radial--professional" data-radial-glow="professional" src="' +
      asset(ASSETS.glows.professional) +
      '" alt="" aria-hidden="true" />' +
      '<img class="mv-world-stage__radial mv-world-stage__radial--freiraum" data-radial-glow="freiraum" src="' +
      asset(ASSETS.glows.freiraum) +
      '" alt="" aria-hidden="true" />' +
      '<img class="mv-world-stage__overlay mv-world-stage__overlay--merge" data-overlay-glow="merge" src="' +
      asset(ASSETS.glows.merge) +
      '" alt="" aria-hidden="true" />' +
      '<div class="mv-world-stage__ring" data-world-ring aria-hidden="true"></div>' +
      '<div class="mv-scroll-orbs mv-world-zones" data-layer="orbs">' +
      worldZoneMarkup("multiversum", "MULTIVERSUM") +
      worldZoneMarkup("nexora", "NEXORA") +
      worldZoneMarkup("professional", "PROFESSIONAL") +
      worldZoneMarkup("freiraum", "FREIRAUM") +
      "</div></div></div>" +
      '<div class="mv-layer mv-layer--5" data-parallax-layer="5"></div>' +
      '<div class="mv-layer mv-layer--6" data-parallax-layer="6">' +
      '<div class="mv-scroll-slides" data-layer="slides">' +
      slidesMarkup() +
      "</div></div>" +
      '<div class="mv-layer mv-layer--7" data-parallax-layer="7">' +
      '<div class="mv-scroll-portfolio final-cta-group" data-layer="portfolio">' +
      portfolioMarkup() +
      "</div>" +
      '<p class="mv-scroll-cue" aria-hidden="true"><span>Scroll</span></p>' +
      "</div></div></div>"
    );
  }

  function cacheDom() {
    if (!heroEl) return;
    dom.layers = {};
    heroEl.querySelectorAll("[data-parallax-layer]").forEach(function (el) {
      dom.layers[el.getAttribute("data-parallax-layer")] = el;
    });
    dom.bgs = {};
    heroEl.querySelectorAll("[data-bg]").forEach(function (el) {
      dom.bgs[el.getAttribute("data-bg")] = el;
    });
    dom.stars = heroEl.querySelector('[data-layer="stars"]');
    dom.vignette = heroEl.querySelector('[data-layer="vignette"]');
    dom.decoSets = {};
    heroEl.querySelectorAll("[data-deco-theme]").forEach(function (set) {
      dom.decoSets[set.getAttribute("data-deco-theme")] = {
        root: set,
        orbit: set.querySelector('[data-d="orbit"]'),
        orbit2: set.querySelector('[data-d="orbit2"]'),
        light: set.querySelector('[data-d="light"]'),
        line: set.querySelector('[data-d="line"]'),
      };
    });
    dom.particleFields = {};
    heroEl.querySelectorAll("[data-particle-field]").forEach(function (el) {
      dom.particleFields[el.getAttribute("data-particle-field")] = el;
    });
    dom.atmo = {};
    heroEl.querySelectorAll("[data-atmo]").forEach(function (el) {
      dom.atmo[el.getAttribute("data-atmo")] = el;
    });
    dom.topicGrids = {};
    heroEl.querySelectorAll("[data-topic-world]").forEach(function (el) {
      dom.topicGrids[el.getAttribute("data-topic-world")] = el;
    });
    dom.orbs = {
      multiversum: heroEl.querySelector('[data-orb="multiversum"]'),
      nexora: heroEl.querySelector('[data-orb="nexora"]'),
      professional: heroEl.querySelector('[data-orb="professional"]'),
      freiraum: heroEl.querySelector('[data-orb="freiraum"]'),
    };
    dom.worldZones = dom.orbs;
    dom.slides = heroEl.querySelectorAll(".mv-scroll-slide");
    dom.portfolio = heroEl.querySelector('[data-layer="portfolio"]');
    dom.cue = heroEl.querySelector(".mv-scroll-cue");
    dom.worldStage = heroEl.querySelector("[data-world-stage]");
    dom.worldGlow = heroEl.querySelector("[data-world-glow]");
    dom.worldRing = heroEl.querySelector("[data-world-ring]");
    dom.radialGlows = {};
    heroEl.querySelectorAll("[data-radial-glow]").forEach(function (el) {
      dom.radialGlows[el.getAttribute("data-radial-glow")] = el;
    });
    dom.overlayGlow = heroEl.querySelector("[data-overlay-glow]");
    dom.transitionTrail = heroEl.querySelector("[data-transition-trail]");
    dom.worldAccents = {};
    heroEl.querySelectorAll("[data-accent-world]").forEach(function (el) {
      dom.worldAccents[el.getAttribute("data-accent-world")] = el;
    });
  }

  function getProgress() {
    if (!scrollRoot || !heroEl) return 0;
    var max = heroEl.offsetHeight - scrollRoot.clientHeight;
    if (max <= 0) return 0;
    return clamp(scrollRoot.scrollTop / max, 0, 1);
  }

  function dominantOrbKey(state) {
    var orbs = state.orbs || {};
    var best = "";
    var bestOp = 0;
    WORLD_KEYS.forEach(function (key) {
      var op = (orbs[key] && orbs[key].opacity) || 0;
      if (op > bestOp) {
        bestOp = op;
        best = key;
      }
    });
    return bestOp > 0.45 ? best : "";
  }

  function orbFlyCfg(cfg, fly) {
    if (!cfg) return cfg;
    var f = easeOutExpo(clamp(fly, 0, 1));
    return {
      x: cfg.x || 0,
      y: (cfg.y || 0) + lerp(12, 0, f),
      scale: lerp(0.78, 1, f),
      opacity: cfg.opacity || 0,
      blur: lerp(3.2, cfg.blur || 0, f),
      z: cfg.z || 0,
    };
  }

  function applyOrb(el, cfg, parallax, entrance, dominant) {
    if (!el || !cfg) return;
    var blur = cfg.blur || 0;
    var ent = entrance !== undefined ? entrance : 1;
    var scale = cfg.scale * lerp(0.68, 1, easeOutExpo(ent));
    var yShift = clamp((cfg.y || 0) - parallax * 6, -5, 12);
    el.style.transform =
      "translate3d(calc(-50% + " +
      cfg.x +
      "vw), calc(-50% + " +
      yShift +
      "vh), " +
      (cfg.z || 0) +
      "px) scale(" +
      scale +
      ")";
    el.style.opacity = String((cfg.opacity || 0) * ent);
    el.style.filter = blur > 0.1 ? "blur(" + blur + "px)" : "";
    el.style.zIndex = String(Math.round(cfg.z || 0));
    var shown = (cfg.opacity || 0) * ent > 0.03;
    el.style.display = shown ? "" : "none";
    el.style.visibility = shown ? "visible" : "hidden";
    el.style.pointerEvents = shown ? "auto" : "none";
    el.classList.toggle("is-dominant", !!dominant && cfg.opacity > 0.42);
    el.classList.toggle("is-labeled", cfg.opacity > 0.34);
  }

  function applyWorldAccents() {
    return;
  }

  function stateActiveWorldMatches(world, activeSlide) {
    var slide = config.slides[activeSlide];
    return !!(slide && slide.sceneKind === "world" && slide.worldType === world);
  }

  function visibleWorldsForScene(activeScene) {
    var kind = slideKind(activeScene);
    if (kind === "intro") return WORLD_KEYS.slice();
    if (kind === "finale") return [];
    if (kind === "world") {
      var slide = config.slides[activeScene];
      return slide && slide.worldType ? [slide.worldType] : [];
    }
    if (kind === "reveal" || kind === "merge") {
      return WORLD_KEYS;
    }
    return [];
  }

  function setVisibleWorlds(worlds) {
    if (!dom.worldZones) return;
    WORLD_KEYS.forEach(function (world) {
      var zone = dom.worldZones[world];
      if (!zone) return;
      zone.classList.toggle("is-visible", worlds.indexOf(world) >= 0);
    });
  }

  function forceHideAllWorldZones() {
    if (!dom.worldZones) return;
    WORLD_KEYS.forEach(function (world) {
      var zone = dom.worldZones[world];
      if (!zone) return;
      zone.style.opacity = "0";
      zone.style.visibility = "hidden";
      zone.style.pointerEvents = "none";
      zone.style.display = "none";
      zone.style.transform = "";
      zone.style.filter = "";
      zone.classList.remove(
        "is-focus",
        "is-visible",
        "is-scene-active",
        "is-scroll-active",
        "is-reveal-active",
        "is-reveal-focus",
        "is-merge-active",
        "is-active",
        "is-hover",
        "is-expanded",
        "is-dimmed",
        "is-background",
        "is-dominant",
        "is-labeled"
      );
      var collage = zone.querySelector(".world-collage");
      if (collage) {
        collage.style.opacity = "0";
        collage.style.visibility = "hidden";
        collage.style.pointerEvents = "none";
        collage.style.display = "none";
        collage.querySelectorAll(".world-card").forEach(function (cardEl) {
          cardEl.style.opacity = "0";
          cardEl.style.visibility = "hidden";
          cardEl.style.display = "none";
        });
      }
      var core = zone.querySelector(".world-core");
      if (core) {
        core.style.opacity = "0";
        core.style.visibility = "hidden";
        core.style.display = "none";
      }
    });
    if (dom.worldStage) {
      dom.worldStage.style.display = "none";
      dom.worldStage.style.opacity = "0";
      dom.worldStage.style.visibility = "hidden";
      dom.worldStage.style.pointerEvents = "none";
    }
  }

  function resetWorldZoneInlineStyles() {
    if (!dom.worldZones) return;
    if (dom.worldStage) {
      dom.worldStage.style.display = "";
      dom.worldStage.style.opacity = "";
      dom.worldStage.style.visibility = "";
      dom.worldStage.style.pointerEvents = "";
    }
    WORLD_KEYS.forEach(function (world) {
      var zone = dom.worldZones[world];
      if (!zone) return;
      zone.style.opacity = "";
      zone.style.visibility = "";
      zone.style.pointerEvents = "";
      zone.style.display = "";
      zone.style.transform = "";
      zone.style.filter = "";
      var collage = zone.querySelector(".world-collage");
      if (collage) {
        collage.style.opacity = "";
        collage.style.visibility = "";
        collage.style.pointerEvents = "";
        collage.style.display = "";
        collage.querySelectorAll(".world-card").forEach(function (cardEl) {
          cardEl.style.opacity = "";
          cardEl.style.visibility = "";
          cardEl.style.display = "";
          cardEl.style.pointerEvents = "";
        });
      }
      var core = zone.querySelector(".world-core");
      if (core) {
        core.style.opacity = "";
        core.style.visibility = "";
        core.style.display = "";
        core.style.pointerEvents = "";
        core.style.zIndex = "";
      }
    });
  }

  function clearOrbPresentationLocks() {
    if (!dom.orbs) return;
    WORLD_KEYS.forEach(function (world) {
      var zone = dom.orbs[world];
      if (!zone) return;
      zone.style.removeProperty("display");
      zone.style.removeProperty("visibility");
      zone.style.removeProperty("pointer-events");
      var core = zone.querySelector(".world-core");
      if (core) {
        core.style.removeProperty("display");
        core.style.removeProperty("visibility");
        core.style.removeProperty("pointer-events");
      }
    });
  }

  function syncWorldZoneOrbs(state, layoutMode, activeSlide, phases, stageOp, postWorld, worldHold) {
    if (postWorld) {
      forceHideAllWorldZones();
      return;
    }
    if (dom.worldStage) dom.worldStage.style.display = "";

    if (layoutMode === "split-world") {
      var slide = config.slides[activeSlide];
      var focusWorld = slide && slide.worldType ? slide.worldType : "";
      var hold = worldHold !== undefined ? worldHold : 1;
      var chapter = phases && phases.chapter;
      var worldIn = chapter ? chapter.worldIn : easeOutExpo(clamp((phases && phases.orb) || stageOp, 0, 1));
      var unitOp = chapter ? chapter.worldOpacity * hold : easeOutExpo(clamp((phases && phases.orb) || stageOp, 0, 1)) * hold;
      var fly = worldIn;
      WORLD_KEYS.forEach(function (world) {
        var zone = dom.orbs[world];
        if (!zone) return;
        var isFocus = focusWorld === world;
        if (!isFocus || unitOp < 0.03) {
          zone.style.opacity = "0";
          zone.style.visibility = "hidden";
          zone.style.pointerEvents = "none";
          zone.style.display = "none";
          return;
        }
        zone.style.display = "";
        zone.style.visibility = fly > 0.04 ? "visible" : "hidden";
        zone.style.pointerEvents = fly > 0.2 ? "auto" : "none";
        var cfg = state.orbs[world] || { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, z: 50 };
        var flyCfg = {
          x: 0,
          y: lerp(6, 0, fly),
          scale: lerp(0.88, 1, easeInOutSine(fly)),
          opacity: unitOp,
          blur: lerp(1.5, 0, fly),
          z: cfg.z || 50,
        };
        applyOrb(zone, flyCfg, 0, 1, true);
      });
      return;
    }

    var dominant = dominantOrbKey(state);
    var orbPhase =
      layoutMode === "overview"
        ? 0.85
        : layoutMode === "intro"
        ? 1
        : 0;
    var orbEntrance = layoutMode === "intro" ? orbPhase : orbPhase * stageOp;

    clearOrbPresentationLocks();

    function orbWithPhase(cfg) {
      if (!cfg) return cfg;
      var next = {};
      Object.keys(cfg).forEach(function (k) {
        next[k] = cfg[k];
      });
      next.opacity = (cfg.opacity || 0) * orbPhase;
      return next;
    }

    applyOrb(dom.orbs.multiversum, orbFlyCfg(orbWithPhase(state.orbs.multiversum), orbEntrance), 0, orbEntrance, dominant === "multiversum");
    applyOrb(dom.orbs.nexora, orbFlyCfg(orbWithPhase(state.orbs.nexora), orbEntrance), 0, orbEntrance, dominant === "nexora");
    applyOrb(dom.orbs.professional, orbFlyCfg(orbWithPhase(state.orbs.professional), orbEntrance), 0, orbEntrance, dominant === "professional");
    applyOrb(dom.orbs.freiraum, orbFlyCfg(orbWithPhase(state.orbs.freiraum), orbEntrance), 0, orbEntrance, dominant === "freiraum");
  }

  function worldFocusSide(activeScene) {
    var slide = config.slides[activeScene];
    if (!slide || slide.sceneKind !== "world") return "";
    return slide.worldSide === "left" ? "left" : slide.worldSide === "right" ? "right" : "";
  }

  function applyWorldZoneStates(activeScene, phases, worldHold) {
    if (!dom.worldZones) return;
    var slide = config.slides[activeScene];
    var kind = slideKind(activeScene);
    var revealed = revealedWorldsForScene(activeScene);
    var highlight = (slide && slide.highlightWorld) || "";
    var focusWorld = kind === "world" && slide ? slide.worldType : "";

    setVisibleWorlds(visibleWorldsForScene(activeScene));
    var focusSide = worldFocusSide(activeScene);
    var hold = worldHold !== undefined ? worldHold : 1;
    var chapter = phases && phases.chapter;
    var env = (phases.env !== undefined ? phases.env : 1) * (kind === "world" ? hold : 1);
    var cardFlyBase = kind === "world" && chapter ? chapter.worldIn : 1;

    WORLD_KEYS.forEach(function (world) {
      var zone = dom.worldZones[world];
      if (!zone) return;

      var hasCards = revealed.indexOf(world) >= 0;
      var isWorldFocus = focusWorld === world;
      var isReveal = kind === "reveal";
      var isRevealFocus = isReveal && highlight === world;
      var isMerge = kind === "merge";

      var showCollage = hasCards && (isReveal || isWorldFocus || isMerge);
      var isSoftBg = isReveal && !hasCards;

      zone.classList.toggle("is-focus", isWorldFocus);
      zone.classList.toggle("is-reveal-active", isReveal && hasCards);
      zone.classList.toggle("is-reveal-focus", isRevealFocus);
      zone.classList.toggle("is-scene-active", showCollage || isWorldFocus || isMerge);
      zone.classList.toggle("is-scroll-active", isWorldFocus || isRevealFocus);
      zone.classList.toggle("is-background", isSoftBg);
      zone.classList.toggle("is-merge-active", isMerge && hasCards);
      zone.classList.toggle("is-dimmed", isReveal && hasCards && !isRevealFocus);
      zone.classList.toggle("world-zone--left-focus", isWorldFocus && focusSide === "left");
      zone.classList.toggle("world-zone--right-focus", isWorldFocus && focusSide === "right");

      var zoneEnv = isWorldFocus ? env : isRevealFocus ? env : hasCards ? Math.max(0.72, env * 0.88) : isSoftBg ? 0.55 : 0;
      zone.style.setProperty("--scene-env", String(zoneEnv));

      var orbit = cardOrbitForZone(kind, world, hasCards, isWorldFocus, isRevealFocus);
      zone.style.setProperty("--card-orbit", orbit);

      if (showCollage || isWorldFocus) {
        var collage = zone.querySelector(".world-collage");
        if (collage) {
          collage.style.setProperty("--card-orbit", orbit);
          if (isWorldFocus && chapter) {
            collage.style.opacity = String(chapter.worldOpacity > 0.04 ? 1 : 0);
            collage.style.transform = "scale(" + lerp(0.96, 1, chapter.worldIn) + ")";
            collage.style.visibility = chapter.worldOpacity > 0.04 ? "visible" : "hidden";
          } else {
            var cardEnv = isWorldFocus ? env : isRevealFocus ? env : Math.min(1, env * 0.9 + 0.1);
            collage.style.opacity = String(cardEnv);
            collage.style.transform = "scale(" + lerp(0.96, 1, cardEnv) + ")";
            collage.style.visibility = cardEnv > 0.04 ? "visible" : "hidden";
          }
          collage.style.pointerEvents = "none";
          collage.querySelectorAll(".world-card").forEach(function (cardEl, cardIdx) {
            var stagger = isWorldFocus && chapter ? cardIdx * 0.04 : cardIdx * 0.08;
            var cardT =
              isWorldFocus && chapter
                ? clamp((cardFlyBase - stagger) / Math.max(1 - stagger, 0.01), 0, 1)
                : clamp((env - stagger) / (1 - stagger), 0, 1);
            var cardReveal = easeOutExpo(cardT);
            var cardOp = isWorldFocus && chapter ? cardReveal * chapter.worldOpacity : cardReveal;
            cardEl.style.opacity = String(cardOp);
            cardEl.style.filter = cardReveal < 1 ? "blur(" + lerp(2.5, 0, cardReveal) + "px)" : "";
            cardEl.style.pointerEvents = cardT > 0.18 ? "auto" : "none";
          });
        }
        var core = zone.querySelector(".world-core");
        if (core) {
          core.style.opacity = String(isWorldFocus ? env : Math.min(1, zoneEnv * 0.95 + 0.05));
          core.style.pointerEvents = isWorldFocus && env > 0.18 ? "auto" : "none";
          core.style.zIndex = isWorldFocus ? "50" : "";
        }
      } else {
        zone.style.removeProperty("--scene-env");
        var collageOff = zone.querySelector(".world-collage");
        if (collageOff) {
          collageOff.style.opacity = "";
          collageOff.style.transform = "";
          collageOff.style.visibility = "";
          collageOff.style.pointerEvents = "";
          collageOff.style.removeProperty("--card-orbit");
          collageOff.querySelectorAll(".world-card").forEach(function (cardEl) {
            cardEl.style.opacity = "";
            cardEl.style.filter = "";
            cardEl.style.pointerEvents = "";
          });
        }
        var coreOff = zone.querySelector(".world-core");
        if (coreOff) {
          coreOff.style.opacity = "";
          coreOff.style.pointerEvents = "";
          coreOff.style.zIndex = "";
        }
      }

      if (!isWorldFocus) {
        zone.classList.remove("is-expanded", "world-zone--left-focus", "world-zone--right-focus");
      }
    });
  }

  function applyCardParallax() {
    if (mobileLayout || tabletLayout || reducedMotion || !dom.worldZones) return;
    var par = window.innerWidth <= 1439 ? 0.55 : 1;
    WORLD_KEYS.forEach(function (world) {
      var zone = dom.worldZones[world];
      if (!zone || (!zone.classList.contains("is-active") && !zone.classList.contains("is-hover"))) return;
      zone.querySelectorAll(".world-card").forEach(function (card, i) {
        var depth = 1 + (i % 4) * 0.08;
        var tx = mouseParallax.x * 14 * depth * par;
        var ty = mouseParallax.y * 10 * depth * par;
        card.style.setProperty("--px", tx + "px");
        card.style.setProperty("--py", ty + "px");
      });
    });
  }

  function bindCollageInteractions() {
    if (!heroEl || !dom.worldZones) return;
    heroEl.addEventListener("mousemove", function (e) {
      if (mobileLayout || tabletLayout) return;
      var rect = heroEl.getBoundingClientRect();
      mouseParallax.x = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5) * 2;
      mouseParallax.y = clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5) * 2;
      applyCardParallax();
    });
    WORLD_KEYS.forEach(function (world) {
      var zone = dom.worldZones[world];
      if (!zone) return;
      zone.addEventListener("mouseenter", function () {
        zone.classList.add("is-hover");
        var layout = heroEl ? heroEl.getAttribute("data-layout") : "";
        if (
          layout === "split-world" ||
          zone.classList.contains("is-scene-active") ||
          zone.classList.contains("is-merge-active")
        ) {
          zone.classList.add("is-active");
        }
      });
      zone.addEventListener("mouseleave", function () {
        zone.classList.remove("is-hover", "is-active");
        zone.querySelectorAll(".world-card").forEach(function (card) {
          card.style.removeProperty("--px");
          card.style.removeProperty("--py");
        });
      });
      zone.addEventListener("focusin", function () {
        zone.classList.add("is-active");
      });
      zone.addEventListener("focusout", function () {
        zone.classList.remove("is-active");
      });
      zone.addEventListener("click", function (e) {
        if (e.target.closest("a.world-card") || e.target.closest(".world-core") || e.target.closest(".world-cards-more")) return;
        if (!tabletLayout && !mobileLayout) return;
        if (!zone.classList.contains("is-visible")) return;
        if (!zone.classList.contains("is-active")) {
          e.preventDefault();
          WORLD_KEYS.forEach(function (w) {
            var z = dom.worldZones[w];
            if (z) z.classList.remove("is-active", "is-expanded");
          });
          zone.classList.add("is-active", "is-expanded");
        }
      });
    });
    heroEl.querySelectorAll("[data-world-more]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var w = btn.getAttribute("data-world-more");
        switchWorld(w);
      });
    });
  }

  function applyDecoImg(el, cfg, weight, build, axis) {
    if (!el || !cfg) return;
    var b = build || 0;
    var scale = cfg.scale * lerp(0.35, 1, easeInOutCubic(b));
    var rot = cfg.rotate + axis * 12 * b;
    var xOff = axis * 8 * (1 - b);
    el.style.opacity = String(cfg.opacity * weight * lerp(0.2, 1, b));
    el.style.transform =
      "translate3d(calc(-50% + " + xOff + "vw), -50%, 0) scale(" + scale + ") rotate(" + rot + "deg)";
  }

  function applyTopicGrid(el, opacity, build) {
    if (!el) return;
    var cards = el.querySelectorAll(".mv-topic-card");
    el.style.opacity = String(opacity);
    el.style.pointerEvents = opacity > 0.35 ? "auto" : "none";
    cards.forEach(function (card, i) {
      var delay = i * 0.09;
      var t = clamp((build - delay) / (1 - delay), 0, 1);
      t = easeOutExpo(t);
      card.style.opacity = String(t * opacity);
      card.style.transform = "translate3d(0, " + lerp(22, 0, t) + "px, 0) scale(" + lerp(0.94, 1, t) + ")";
    });
  }

  function updateFrame() {
    rafId = 0;
    if (!heroEl || !config) return;

    if (!bootPaintDone && heroEl.classList.contains("is-js-ready")) {
      bootPaintDone = true;
    }

    var rawP = getProgress();
    if (reducedMotion || mobileLayout) {
      animProgress = rawP;
    } else if (rawP <= introChapterEnd()) {
      animProgress = rawP;
    } else if (rawP >= freiraumChapterEnd() - 0.05) {
      animProgress += (rawP - animProgress) * 0.28;
      if (Math.abs(rawP - animProgress) < 0.00035) animProgress = rawP;
    } else {
      var lerpFactor = config.smoothLerp || 0.075;
      animProgress += (rawP - animProgress) * lerpFactor;
      if (Math.abs(rawP - animProgress) < 0.00035) animProgress = rawP;
    }
    if (rawP !== animProgress) requestTick();

    var phaseP = rawP;
    var p = animProgress;
    var activeSlideEarly = slideIndexForProgress(phaseP);
    var layoutModeEarly = layoutModeForProgress(phaseP, activeSlideEarly);
    var state = getState(p);
    var bookendBg = bookendBackgroundForLayout(layoutModeEarly);
    if (bookendBg) state.backgrounds = bookendBg;
    var px = config.parallax || {};
    var par = mobileLayout ? 0.3 : window.innerWidth <= 1024 ? 0.65 : 1;
    var bounds = config.bounds;
    var fade = config.fade || 0.055;

    var mvBuild = worldBuildProgress(p, "multiversum");
    var nexBuild = worldBuildProgress(p, "nexora");
    var proBuild = worldBuildProgress(p, "professional");
    var freBuild = worldBuildProgress(p, "freiraum");

    if (dom.layers[1]) dom.layers[1].style.transform = "translate3d(0, " + layerShift(p, px.layer1_bg || 0.08, par) + "vh, 0)";
    if (dom.layers[2]) dom.layers[2].style.transform = "translate3d(0, " + layerShift(p, px.layer2_nebula || 0.18, par) + "vh, 0)";
    if (dom.layers[3]) dom.layers[3].style.transform = "translate3d(0, " + layerShift(p, px.layer3_particles || 0.28, par) + "vh, 0)";
    if (dom.layers[4]) dom.layers[4].style.transform = "translate3d(0, " + layerShift(p, px.layer4_objects || 0.42, par) + "vh, 0)";
    if (dom.layers[5]) dom.layers[5].style.transform = "translate3d(0, " + layerShift(p, px.layer5_cards || 0.58, par) + "vh, 0)";
    if (dom.layers[6]) dom.layers[6].style.transform = "translate3d(0, " + layerShift(p, px.layer6_copy || 0.72, par) + "vh, 0)";
    if (dom.layers[7]) dom.layers[7].style.transform = "translate3d(0, " + layerShift(p, px.layer7_ui || 0.85, par) + "vh, 0)";

    ["multiverse", "nexora", "professional", "freiraum"].forEach(function (key) {
      if (dom.bgs[key]) {
        var bgOp = (state.backgrounds[key] || 0) * par;
        dom.bgs[key].style.opacity = String(bgOp);
        dom.bgs[key].style.visibility = bgOp > 0.015 ? "visible" : "hidden";
        var img = dom.bgs[key].querySelector("img");
        if (img) {
          if (bookendBg && key === "multiverse") {
            img.style.transform = "translate(-50%, -50%) scale(1)";
            img.style.width = "100vw";
            img.style.height = "100%";
            img.style.minHeight = "100%";
            img.style.objectFit = "cover";
          } else {
            var zoom = 1 + bgOp * 0.08;
            img.style.transform = "scale(" + zoom + ")";
          }
        }
      }
    });

    if (dom.stars) dom.stars.style.opacity = String(state.stars * par);
    if (dom.vignette) dom.vignette.style.opacity = String(state.vignette * 0.62);

    var themeWeights = {
      multiverse: state.backgrounds.multiverse || 0,
      multiversum: state.backgrounds.multiverse || 0,
      nexora: state.backgrounds.nexora || 0,
      professional: state.backgrounds.professional || 0,
      freiraum: state.backgrounds.freiraum || 0,
    };

    Object.keys(dom.decoSets).forEach(function (theme) {
      var set = dom.decoSets[theme];
      var w = themeWeights[theme] || 0;
      var d = state.decor;
      var build =
        theme === "nexora"
          ? nexBuild
          : theme === "professional"
          ? proBuild
          : theme === "freiraum"
          ? freBuild
          : theme === "multiverse" || theme === "multiversum"
          ? Math.max(mvBuild, 0.42)
          : 0.5;
      var decoOp = w > 0.04 ? Math.min(1, w * 1.2) : 0;
      set.root.style.opacity = String(decoOp);
      set.root.style.visibility = decoOp > 0.02 ? "visible" : "hidden";
      applyDecoImg(set.orbit, d.orbit, w, build, 0);
      applyDecoImg(set.orbit2, d.orbit2, w, build, 1);
      if (set.light) {
        set.light.style.opacity = String(d.light.opacity * w * lerp(0.3, 1, build));
        set.light.style.transform = "translate3d(-50%, calc(-50% + " + lerp(8, 0, build) + "vh), 0) scale(" + lerp(0.8, 1.05, build) + ")";
      }
      if (set.line) {
        set.line.style.opacity = String(d.line.opacity * w * build);
        set.line.style.transform = "translate3d(-50%, -50%, 0) scaleX(" + lerp(0.2, 1, build) + ") scaleY(" + lerp(0.6, 1, build) + ")";
      }
    });

    Object.keys(dom.particleFields).forEach(function (theme) {
      var el = dom.particleFields[theme];
      var w = theme === "multiversum" ? themeWeights.multiverse || 0 : themeWeights[theme] || 0;
      var pOp = w > 0.04 ? (state.decor.particles.opacity || 0.2) * w * par : 0;
      el.style.opacity = String(pOp);
      el.style.visibility = pOp > 0.02 ? "visible" : "hidden";
    });

    var activeBound = boundSegmentForProgress(p);
    var activeSlide = slideIndexForProgress(phaseP);
    var slideRange = slideVisibilityRange(activeSlide);
    var slideLocal = segmentProgress(p, slideRange[0], slideRange[1]);
    var boundLocal = segmentProgress(p, bounds[activeBound], bounds[activeBound + 1]);
    var phases = worldScenePhases(slideLocal, activeSlide);
    var layoutMode = layoutModeForProgress(phaseP, activeSlide);
    var postWorld = isPostWorldPhase(phaseP, layoutMode);

    if (dom.atmo.nexora) {
      var atmoScale = postWorld ? 0 : layoutMode === "split-world" ? 0.55 : 1;
      var nexAtmoOp = themeWeights.nexora > 0.04 ? themeWeights.nexora * nexBuild * atmoScale : 0;
      dom.atmo.nexora.style.opacity = String(nexAtmoOp);
      dom.atmo.nexora.style.visibility = nexAtmoOp > 0.02 ? "visible" : "hidden";
      dom.atmo.nexora.style.transform = "scale(" + lerp(0.9, 1, nexBuild) + ")";
    }
    if (dom.atmo.professional) {
      var atmoScalePro = postWorld ? 0 : layoutMode === "split-world" ? 0.5 : 1;
      var proAtmoOp = themeWeights.professional > 0.04 ? themeWeights.professional * proBuild * atmoScalePro : 0;
      dom.atmo.professional.style.opacity = String(proAtmoOp);
      dom.atmo.professional.style.visibility = proAtmoOp > 0.02 ? "visible" : "hidden";
      dom.atmo.professional.style.transform = "translateX(" + lerp(-6, 0, proBuild) + "vw)";
    }
    if (dom.atmo.freiraum) {
      var atmoScaleFre = postWorld ? 0 : layoutMode === "split-world" ? 0.58 : 1;
      var freAtmoOp = themeWeights.freiraum > 0.04 ? themeWeights.freiraum * freBuild * atmoScaleFre : 0;
      dom.atmo.freiraum.style.opacity = String(freAtmoOp);
      dom.atmo.freiraum.style.visibility = freAtmoOp > 0.02 ? "visible" : "hidden";
      dom.atmo.freiraum.style.transform = "scale(" + lerp(0.85, 1.08, freBuild) + ") rotate(" + lerp(-4, 3, freBuild) + "deg)";
    }

    if (dom.bgs.overview) {
      dom.bgs.overview.style.opacity = "0";
    }

    var stageOp = postWorld ? 0 : worldStageOpacity(activeSlide, phaseP, phases, slideLocal);
    var collageFocus = collageFocusForScene(activeSlide);
    var revealed = revealedWorldsForScene(activeSlide);
    heroEl.setAttribute("data-collage-focus", collageFocus);
    heroEl.setAttribute("data-reveal-step", String(revealed.length));
    var wasPostWorld = heroEl.classList.contains("is-post-world");
    var prevLayout = heroEl.getAttribute("data-layout") || "";
    heroEl.classList.toggle("is-post-world", postWorld);
    var worldHold =
      layoutMode === "split-world" && isWorldSlide(activeSlide) ? worldChapterHold(slideLocal) : 1;

    if (postWorld) {
      forceHideAllWorldZones();
    } else {
      if (
        wasPostWorld ||
        (layoutMode === "intro" &&
          (prevLayout === "split-world" || prevLayout === "finale" || prevLayout === "portfolio"))
      ) {
        resetWorldZoneInlineStyles();
      }
      applyWorldZoneStates(activeSlide, phases, worldHold);
    }

    if (dom.transitionTrail) {
      var trailOp = clamp((state.transitionTrail || 0) * par, 0, 1);
      dom.transitionTrail.style.opacity = String(trailOp);
      dom.transitionTrail.style.transform =
        "translate3d(-50%, -50%, 0) scale(" + lerp(0.88, 1.08, trailOp) + ")";
    }

    if (dom.overlayGlow) {
      var mergeOp = 0;
      dom.overlayGlow.style.opacity = String(mergeOp);
    }

    var dominant = postWorld ? "" : dominantOrbKey(state);

    syncWorldZoneOrbs(state, layoutMode, activeSlide, phases, stageOp, postWorld, worldHold);

    applyWorldAccents();

    if (dom.worldGlow) {
      var glowOp = postWorld
        ? 0
        : isWorldSlide(activeSlide)
        ? phases.orb * 1.05
        : layoutMode === "overview" || layoutMode === "intro"
        ? 0.62
        : 0.24;
      dom.worldGlow.style.opacity = String(glowOp);
    }
    if (dom.worldRing) {
      var ringOp = postWorld
        ? 0
        : isWorldSlide(activeSlide)
        ? lerp(0.22, 0.78, phases.orb)
        : layoutMode === "overview" || layoutMode === "intro"
        ? 0.48
        : 0.14;
      var ringRot =
        slideKind(activeSlide) === "world" && config.slides[activeSlide].worldType === "professional"
          ? p * 24
          : slideKind(activeSlide) === "world" && config.slides[activeSlide].worldType === "freiraum"
          ? p * 48
          : p * 36;
      dom.worldRing.style.opacity = String(ringOp);
      dom.worldRing.style.transform =
        "translate(-50%, -50%) rotate(" + ringRot + "deg) scale(" + lerp(0.94, 1.02, phases.orb || 0.5) + ")";
    }
    if (dom.radialGlows) {
      WORLD_KEYS.forEach(function (w) {
        var el = dom.radialGlows[w];
        if (!el) return;
        var wgt = themeWeights[w] || 0;
        var ro = postWorld
          ? 0
          : wgt * (isWorldSlide(activeSlide) ? phases.orb * 0.95 : layoutMode === "overview" || layoutMode === "intro" ? 0.5 : 0.15);
        el.style.opacity = String(clamp(ro, 0, 1));
      });
    }
    if (dom.worldStage) {
      var effectiveStageOp = postWorld ? 0 : stageOp * worldHold;
      var stageChapter = phases.chapter;
      var stageScale =
        layoutMode === "split-world" && stageChapter
          ? lerp(0.94, 1, stageChapter.worldIn) * (1 - stageChapter.fadeOut * 0.06)
          : lerp(0.96, 1, phases.orb || 1);
      dom.worldStage.style.opacity = String(effectiveStageOp);
      dom.worldStage.style.visibility = effectiveStageOp > 0.03 ? "visible" : "hidden";
      dom.worldStage.style.pointerEvents = effectiveStageOp > 0.2 ? "auto" : "none";
      dom.worldStage.style.transform =
        layoutMode === "split-world"
          ? "translateY(-50%) scale(" + stageScale + ")"
          : layoutMode === "overview"
          ? "translate(-50%, -50%) scale(" + lerp(0.94, 1, slideLocal) + ")"
          : "";
    }

    var topicNex = topicVisibilityForWorld();
    var topicPro = topicVisibilityForWorld();
    var topicFre = topicVisibilityForWorld();
    applyTopicGrid(dom.topicGrids.nexora, topicNex.opacity, topicNex.build);
    applyTopicGrid(dom.topicGrids.professional, topicPro.opacity, topicPro.build);
    applyTopicGrid(dom.topicGrids.freiraum, topicFre.opacity, topicFre.build);

    for (var i = 0; i < dom.slides.length; i++) {
      var slideKindI = slideKind(i);
      if (slideKindI === "reveal" || slideKindI === "merge") {
        dom.slides[i].style.opacity = "0";
        dom.slides[i].style.pointerEvents = "none";
        dom.slides[i].classList.remove("is-active", "is-world-chapter");
        continue;
      }

      if (slideKindI === "finale") {
        continue;
      }

      if (postWorld && isWorldSlide(i)) {
        dom.slides[i].style.opacity = "0";
        dom.slides[i].style.pointerEvents = "none";
        dom.slides[i].classList.remove("is-active", "is-world-chapter");
        continue;
      }

      var visRange = slideVisibilityRange(i);
      var visStart = visRange[0];
      var visEnd = visRange[1];

      var vis = slideVisibility(p, visStart, visEnd, fade);
      var slide = dom.slides[i];
      var slideLocal = segmentProgress(p, visStart, visEnd);
      var slidePhases = worldScenePhases(slideLocal, i);
      var copyEl = slide.querySelector(".world-copy");
      var hintEl = slide.querySelector(".world-visual__hint");
      var isWorldChapter = isWorldSlide(i);
      var chapterPh = isWorldChapter ? slidePhases.chapter || worldChapterPhases(slideLocal) : null;
      var hold = isWorldChapter ? chapterPh.hold : 1;
      var copyOpacity = isWorldChapter ? vis.opacity * (chapterPh ? chapterPh.textOpacity : slidePhases.env) : vis.opacity;
      var scale = lerp(0.98, 1, copyOpacity);
      var worldVisible = chapterPh && chapterPh.worldOpacity > 0.03;

      if (isWorldChapter) {
        slide.style.opacity = String(vis.opacity > 0.02 && (worldVisible || copyOpacity > 0.02) ? 1 : 0);
        slide.style.transform = "translate3d(-50%, -50%, 0)";
        slide.style.pointerEvents = vis.active && copyOpacity > 0.2 ? "auto" : "none";
        if (copyEl) {
          var textOp = chapterPh && chapterPh.showText ? vis.opacity * chapterPh.hold : 0;
          copyEl.style.opacity = String(textOp);
          copyEl.style.transform = "translate3d(0, " + lerp(14, 0, easeInOutSine(textOp)) + "px, 0)";
          if (chapterPh && chapterPh.showText && textOp > 0.01) {
            applyWorldExplainTexts(copyEl, chapterPh.textLocal, textOp);
          } else {
            resetWorldExplainTexts(copyEl);
          }
        }
      } else {
        if (copyEl) resetWorldExplainTexts(copyEl);
        slide.style.opacity = String(vis.opacity);
        slide.style.transform =
          "translate3d(-50%, calc(-50% + " + vis.y + "px), 0) scale(" + scale + ")";
        slide.style.pointerEvents = vis.active && copyOpacity > 0.15 ? "auto" : "none";
        if (copyEl) {
          copyEl.style.opacity = "";
          copyEl.style.transform = "";
        }
      }

      slide.classList.toggle("is-active", vis.active && (isWorldChapter ? copyOpacity > 0.35 || worldVisible : vis.opacity > 0.45));
      slide.classList.toggle("is-world-chapter", isWorldChapter && vis.active);

      if (hintEl) {
        hintEl.style.opacity = String(isWorldChapter ? slidePhases.hint * vis.opacity : 0);
      }
    }

    if (dom.portfolio) {
      var finIdx = config.slides.length - 1;
      var finCopyRange = chapterRange("finaleCopyOnly", [0.86, 0.91]);
      var frameRange = chapterRange("portfolioFrame", [0.91, 0.93]);
      var portRange = chapterRange("portfolioButtons", [0.93, 0.97]);
      var finCopyLocal = segmentProgress(phaseP, finCopyRange[0], finCopyRange[1]);
      var portLocal = segmentProgress(phaseP, portRange[0], portRange[1]);
      var copyIn = easeInOutSine(clamp(finCopyLocal / 0.24, 0, 1));
      var copyOut = finCopyLocal > 0.62 ? easeOutQuart(clamp((finCopyLocal - 0.62) / 0.38, 0, 1)) : 0;
      var finCopyOp =
        phaseP >= finCopyRange[0] && phaseP < finCopyRange[1] ? copyIn * (1 - copyOut) : 0;
      var finaleDone = phaseP >= finCopyRange[1];
      var frameLocal = segmentProgress(phaseP, frameRange[0], frameRange[1]);
      var skipFrame = !!(config && config.skipPortfolioFrame);
      var frameOp =
        skipFrame
          ? 0
          : finaleDone && phaseP >= frameRange[0] && phaseP < portRange[0]
          ? easeInOutSine(clamp(frameLocal / 0.55, 0, 1))
          : 0;
      var portOp =
        finaleDone && phaseP >= portRange[0]
          ? easeInOutSine(clamp((portLocal - 0.18) / 0.42, 0, 1))
          : 0;
      var cardScale = lerp(0.94, 1, portOp);
      var portY = lerp(18, 0, portOp);
      dom.portfolio.style.opacity = String(portOp > 0.02 ? portOp : frameOp > 0.02 ? frameOp * 0.4 : 0);
      dom.portfolio.style.transform =
        "translate3d(-50%, calc(-50% + " + portY + "px), 0) scale(" + cardScale + ")";
      dom.portfolio.style.setProperty("--portfolio-frame-op", String(frameOp));
      dom.portfolio.style.visibility = finaleDone && (frameOp > 0.02 || portOp > 0.02) ? "visible" : "hidden";
      dom.portfolio.style.display = finaleDone && (frameOp > 0.02 || portOp > 0.02) ? "grid" : "none";
      var portfolioInteractive = portOp > 0.55;
      dom.portfolio.style.pointerEvents = portfolioInteractive ? "auto" : "none";
      heroEl.classList.toggle("is-portfolio-frame-visible", frameOp > 0.08);
      heroEl.classList.toggle("is-portfolio-visible", portOp > 0.12);
      heroEl.classList.toggle("is-portfolio-interactive", portfolioInteractive);
      heroEl.classList.toggle("is-portfolio-hold", portfolioInteractive && !portfolioHoldUnlocked);
      heroEl.classList.toggle("is-finale-copy-visible", finCopyOp > 0.08);
      var finSlide = dom.slides[finIdx];
      if (finSlide) {
        var finCopy = finSlide.querySelector(".final-copy") || finSlide.querySelector(".scene-copy");
        if (finCopy) {
          finCopy.style.opacity = String(finCopyOp);
          finCopy.style.transform = "translateY(" + lerp(10, -14, copyOut) + "px)";
        }
        finSlide.style.opacity = String(finCopyOp > 0.02 ? finCopyOp : 0);
        finSlide.style.pointerEvents = finCopyOp > 0.15 ? "auto" : "none";
        finSlide.style.left = "50%";
        finSlide.style.top = "50%";
        finSlide.style.transform = "translate3d(-50%, -50%, 0)";
      }
    }

    if (dom.cue) dom.cue.style.opacity = String(p < 0.05 ? 1 : clamp(1 - (p - 0.05) / 0.04, 0, 1));

    heroEl.setAttribute("data-active-world", layoutMode === "split-world" && config.slides[activeSlide] && config.slides[activeSlide].worldType ? config.slides[activeSlide].worldType : state.activeWorld || "multiversum");
    heroEl.setAttribute("data-scene", String(activeSlide + 1));
    heroEl.setAttribute("data-layout", layoutMode);
    heroEl.setAttribute("data-world-side", worldFocusSide(activeSlide));
    heroEl.setAttribute("data-dominant-orb", dominant || "");
    heroEl.classList.toggle("is-world-focus", layoutMode === "split-world");
    document.body.classList.toggle("is-world-focus", layoutMode === "split-world");
  }

  function requestTick() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(updateFrame);
  }

  function heroMaxScroll() {
    if (!scrollRoot || !heroEl) return 0;
    return Math.max(heroEl.offsetHeight - scrollRoot.clientHeight, 0);
  }

  function isPortfolioHoldActive() {
    if (!heroEl || !config) return false;
    var p = getProgress();
    var portRange = chapterRange("portfolioButtons", [0.93, 0.97]);
    if (p < portRange[0]) return false;
    var portLocal = segmentProgress(p, portRange[0], portRange[1]);
    return portLocal > 0.42;
  }

  function bindPortfolioScrollHold() {
    if (!scrollRoot || !heroEl) return;

    function onWheel(e) {
      if (!isPortfolioHoldActive() || portfolioHoldUnlocked) return;
      var max = heroMaxScroll();
      if (max <= 0) return;
      var atHeroEnd = scrollRoot.scrollTop >= max - 8;
      if (!atHeroEnd) return;

      if (e.deltaY > 0) {
        if (portfolioHoldScrolls < PORTFOLIO_HOLD_SCROLLS) {
          e.preventDefault();
          portfolioHoldScrolls += 1;
          heroEl.setAttribute("data-portfolio-hold", String(portfolioHoldScrolls));
          if (portfolioHoldScrolls >= PORTFOLIO_HOLD_SCROLLS) {
            portfolioHoldUnlocked = true;
            heroEl.classList.add("is-portfolio-unlocked");
            heroEl.removeAttribute("data-portfolio-hold");
          }
          requestTick();
        }
      } else if (e.deltaY < 0 && portfolioHoldScrolls > 0) {
        portfolioHoldScrolls = Math.max(0, portfolioHoldScrolls - 1);
        heroEl.setAttribute("data-portfolio-hold", String(portfolioHoldScrolls));
      }
    }

    var touchStartY = 0;
    scrollRoot.addEventListener(
      "wheel",
      onWheel,
      { passive: false }
    );
    scrollRoot.addEventListener(
      "touchstart",
      function (e) {
        touchStartY = e.touches && e.touches[0] ? e.touches[0].clientY : 0;
      },
      { passive: true }
    );
    scrollRoot.addEventListener(
      "touchmove",
      function (e) {
        if (!isPortfolioHoldActive() || portfolioHoldUnlocked) return;
        var max = heroMaxScroll();
        if (max <= 0 || scrollRoot.scrollTop < max - 8) return;
        var y = e.touches && e.touches[0] ? e.touches[0].clientY : touchStartY;
        var delta = touchStartY - y;
        if (delta > 12) {
          if (portfolioHoldScrolls < PORTFOLIO_HOLD_SCROLLS) {
            e.preventDefault();
            portfolioHoldScrolls += 1;
            heroEl.setAttribute("data-portfolio-hold", String(portfolioHoldScrolls));
            touchStartY = y;
            if (portfolioHoldScrolls >= PORTFOLIO_HOLD_SCROLLS) {
              portfolioHoldUnlocked = true;
              heroEl.classList.add("is-portfolio-unlocked");
              heroEl.removeAttribute("data-portfolio-hold");
            }
            requestTick();
          }
        }
      },
      { passive: false }
    );
  }

  function bindScroll() {
    if (!scrollRoot) return;
    onScrollHandler = function () {
      if (!heroEl) {
        requestTick();
        return;
      }
      var max = heroMaxScroll();
      if (scrollRoot.scrollTop < max - 48) {
        portfolioHoldScrolls = 0;
        portfolioHoldUnlocked = false;
        heroEl.classList.remove("is-portfolio-unlocked");
        heroEl.removeAttribute("data-portfolio-hold");
      }
      requestTick();
    };
    scrollRoot.addEventListener("scroll", onScrollHandler, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    requestTick();
  }

  function onResize() {
    var wasMobile = mobileLayout;
    mobileLayout = window.matchMedia("(max-width: 767px)").matches;
    tabletLayout = window.matchMedia("(max-width: 1099px)").matches && !mobileLayout;
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (heroEl) {
      heroEl.classList.toggle("mv-scroll-story--mobile", mobileLayout);
      heroEl.classList.toggle("mv-scroll-story--tablet", tabletLayout);
      heroEl.classList.toggle("mv-scroll-story--reduced", reducedMotion);
      var vh = config.scrollHeightVh || 820;
      if (window.innerWidth <= 1024 && config.scrollHeightVhTablet) vh = config.scrollHeightVhTablet;
      if (mobileLayout) vh = Math.min(vh, 520);
      heroEl.style.setProperty("--mv-scroll-vh", String(vh));
    }
    if (wasMobile !== mobileLayout && dom.orbs) {
      WORLD_KEYS.forEach(function (w) {
        var orb = dom.orbs[w];
        if (!orb) return;
        var img = orb.querySelector(".mv-orb-bubble__standalone");
        if (img) img.src = orbSrc(w);
      });
    }
    requestTick();
  }

  function isDesktopParallaxHero() {
    try {
      return window.matchMedia("(min-width: 1024px)").matches;
    } catch (e) {
      return window.innerWidth >= 1024;
    }
  }

  function buildParallaxHero(goChapter) {
    if (window.__mvParallaxBuilding || document.getElementById("mvParallaxHero")) return document.getElementById("mvParallaxHero");
    if (document.body.getAttribute("data-world") !== "general") return null;
    if (!isDesktopParallaxHero()) return null;
    if (!window.MVSceneConfig || !window.MVSceneConfig.keyframes) return null;

    window.__mvParallaxBuilding = true;
    try {
      config = window.MVSceneConfig;
      mobileLayout = false;
      tabletLayout = false;

      var stage = document.getElementById("dnaStage");
      if (!stage) return null;
      scrollRoot = document.getElementById("slide-home");
      if (!scrollRoot) return null;

      if ("scrollRestoration" in window.history) {
        try {
          window.history.scrollRestoration = "manual";
        } catch (e) {}
      }
      scrollRoot.scrollTop = 0;
      animProgress = 0;

      var wrap = document.createElement("div");
      wrap.innerHTML = heroMarkup();
      heroEl = wrap.firstElementChild;
      heroEl.style.setProperty("--mv-scroll-vh", String(config.scrollHeightVh || 820));

      stage.parentNode.insertBefore(heroEl, stage);
      stage.classList.add("mv-dna-hidden");
      stage.remove();

      cacheDom();
      Object.keys(dom.particleFields || {}).forEach(function (theme) {
        var src = ASSETS.deco[theme] && ASSETS.deco[theme].particles;
        if (src && dom.particleFields[theme]) {
          dom.particleFields[theme].style.backgroundImage = "url(" + asset(src) + ")";
        }
      });
      bindGoButtons(heroEl, goChapter);
      bindCollageInteractions();
      bindPortfolioScrollHold();
      onResize();
      bindScroll();
      heroEl.classList.add("is-js-ready");
      updateFrame();
      if (window.WeltenPreviewI18n && typeof window.WeltenPreviewI18n.applyParallax === "function") {
        try {
          var langKey = "mv-preview-lang";
          var lang = localStorage.getItem(langKey) || sessionStorage.getItem(langKey) || "de";
          window.WeltenPreviewI18n.applyParallax(document, lang);
        } catch (e) {}
      }
      window.__mvParallaxHeroReady = true;
      bootPaintDone = true;
      return heroEl;
    } finally {
      window.__mvParallaxBuilding = false;
    }
  }

  function destroy() {
    if (rafId) window.cancelAnimationFrame(rafId);
    if (scrollRoot && onScrollHandler) scrollRoot.removeEventListener("scroll", onScrollHandler);
    window.removeEventListener("resize", onResize);
    portfolioHoldScrolls = 0;
    portfolioHoldUnlocked = false;
    onScrollHandler = null;
  }

  window.MVParallaxHero = {
    build: buildParallaxHero,
    destroy: destroy,
    switchWorld: switchWorld,
    requestWorldSwitch: requestWorldSwitch,
    applyLang: function (lang) {
      if (window.WeltenPreviewI18n && typeof window.WeltenPreviewI18n.applyParallax === "function") {
        window.WeltenPreviewI18n.applyParallax(document, lang || "de");
      }
    },
  };
})();
