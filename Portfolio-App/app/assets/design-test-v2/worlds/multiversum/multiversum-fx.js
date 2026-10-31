/**
 * MULTIVERSUM effect layer — "Gravitation & Sternbilder".
 * Constellations form around the cursor, headline words fall in from deep
 * space, a comet tracks the scroll position and cards shimmer holographically.
 */
(function () {
  "use strict";
  var fx = window.V2WorldFx;
  if (!fx) return;
  var doc = document;
  var body = doc.body;

  fx.addOffCondition(function () {
    return body.classList.contains("mv-galaxy-open");
  });

  fx.css(
    "mvfx",
    [
      /* Headline words drift in from depth, each from its own direction */
      "html.wfx-on .mvfx-h .wfx-w{overflow:visible}",
      "html.wfx-on .mvfx-h .wfx-wi{opacity:0;filter:blur(14px);",
      "  transform:translate3d(var(--dx,0),var(--dy,0),0) scale(1.9);",
      "  transition:opacity 1s cubic-bezier(.2,.9,.2,1),filter 1.1s cubic-bezier(.2,.9,.2,1),transform 1.3s cubic-bezier(.16,1,.3,1);",
      "  transition-delay:calc(var(--i)*70ms)}",
      "html.wfx-on .mvfx-h.wfx-in .wfx-wi{opacity:1;filter:none;transform:none}",
      "html.wfx-on .mvfx-h.wfx-in em .wfx-wi{text-shadow:0 0 24px rgba(255,89,178,.55)}",

      /* Constellation canvas lives inside the fixed cosmos background */
      ".mvfx-sky{position:absolute;inset:0;width:100%;height:100%}",

      /* Comet scroll orbit (desktop) */
      ".mvfx-orbit{position:fixed;right:18px;top:50%;height:46vh;width:2px;transform:translateY(-50%);z-index:40;",
      "  background:linear-gradient(180deg,transparent,rgba(255,255,255,.14) 12%,rgba(255,255,255,.14) 88%,transparent)}",
      ".mvfx-orbit__planet{position:absolute;left:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;",
      "  background:rgba(255,255,255,.22);transition:background .4s,box-shadow .4s,transform .4s}",
      ".mvfx-orbit__planet.is-passed{background:#ff59b2;box-shadow:0 0 10px #ff59b2;transform:scale(1.25)}",
      ".mvfx-orbit__comet{position:absolute;left:50%;top:0;width:11px;height:11px;margin:-5.5px 0 0 -5.5px;border-radius:50%;",
      "  background:radial-gradient(circle,#fff 0 30%,#ffc66f 45%,rgba(255,89,178,0) 72%);box-shadow:0 0 16px 4px rgba(255,198,111,.55)}",
      ".mvfx-orbit__comet::after{content:'';position:absolute;left:50%;bottom:50%;width:2px;height:var(--tail,24px);transform:translateX(-50%);",
      "  background:linear-gradient(0deg,rgba(255,198,111,.9),rgba(255,89,178,0));border-radius:2px}",
      ".mvfx-orbit.is-up .mvfx-orbit__comet::after{bottom:auto;top:50%;background:linear-gradient(180deg,rgba(255,198,111,.9),rgba(255,89,178,0))}",
      "@media (max-width:899px){.mvfx-orbit{display:none!important}}",

      /* Holographic shimmer on dimension + world cards */
      "html.wfx-on .mv-dim{position:relative}",
      ".mvfx-holo{position:absolute;inset:0;z-index:3;opacity:0;transition:opacity .45s ease;mix-blend-mode:screen;border-radius:inherit;",
      "  background:",
      "    radial-gradient(380px circle at var(--mx,50%) var(--my,50%),var(--holo,rgba(255,89,178,.28)),transparent 55%),",
      "    linear-gradient(115deg,transparent 30%,rgba(110,184,255,.14) 45%,rgba(255,198,111,.12) 52%,transparent 66%);",
      "  background-size:100% 100%,240% 100%;background-position:0 0,var(--sheen,50%) 0}",
      ".is-holo>.mvfx-holo{opacity:1}",
      "[data-world-card=nexora]{--holo:rgba(142,197,255,.3)}",
      "[data-world-card=professional]{--holo:rgba(232,228,220,.26)}",
      "[data-world-card=freiraum]{--holo:rgba(255,198,111,.3)}",

      /* Dimension images float at their own depth */
      "html.wfx-on .mv-dim__media img{transform:translate3d(0,var(--py,0px),0) scale(1.12);will-change:transform}",

      /* Closing links glow in their world colour */
      "html.wfx-on .mv-closing__worlds a{transition:border-color .25s,color .25s,background .25s,box-shadow .35s}",
      "html.wfx-on .mv-closing__worlds a[href='/multiversum']:hover{box-shadow:0 0 22px rgba(255,89,178,.45)}",
      "html.wfx-on .mv-closing__worlds a[href='/nexora']:hover{border-color:#8ec5ff;background:rgba(142,197,255,.12);box-shadow:0 0 22px rgba(142,197,255,.45)}",
      "html.wfx-on .mv-closing__worlds a[href='/professional']:hover{border-color:#e8e4dc;background:rgba(232,228,220,.1);box-shadow:0 0 22px rgba(232,228,220,.35)}",
      "html.wfx-on .mv-closing__worlds a[href='/freiraum']:hover{border-color:#ffc66f;background:rgba(255,198,111,.12);box-shadow:0 0 22px rgba(255,198,111,.45)}",
    ].join("\n")
  );

  /* —— Headlines —— */
  fx.all(
    ".mv-section__head h2, .mv-galaxy__copy h2, .mv-alex__copy h2, .mv-contact__copy h2, .mv-closing__inner h2, .mv-hero__title"
  ).forEach(function (h) {
    var words = fx.splitWords(h);
    words.forEach(function (w) {
      var a = Math.random() * Math.PI * 2;
      var d = 40 + Math.random() * 70;
      w.style.setProperty("--dx", (Math.cos(a) * d).toFixed(0) + "px");
      w.style.setProperty("--dy", (Math.sin(a) * d * 0.6).toFixed(0) + "px");
    });
    h.classList.add("mvfx-h");
    fx.reveal(h);
  });

  /* —— Constellations —— */
  var cosmos = doc.querySelector(".mv-cosmos");
  var cv = null;
  var ctx = null;
  var stars = [];
  var W = 0;
  var H = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var COLORS = ["255,89,178", "110,184,255", "255,198,111", "235,240,255"];

  function resize() {
    if (!cv) return;
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(fx.clamp((W * H) / (fx.finePointer ? 16000 : 26000), 28, 110));
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: 0.25 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        t: Math.random() * 6.28,
      });
    }
  }

  if (cosmos) {
    cv = doc.createElement("canvas");
    cv.className = "mvfx-sky wfx-deco";
    cv.setAttribute("aria-hidden", "true");
    cosmos.appendChild(cv);
    ctx = cv.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  var lastScroll = window.scrollY || 0;
  var LINK = 120;
  var REACH = 190;

  function drawSky() {
    if (!ctx) return;
    var sy = window.scrollY || 0;
    var ds = sy - lastScroll;
    lastScroll = sy;
    ctx.clearRect(0, 0, W, H);
    var p = fx.pointer;
    var px = p.inside ? p.x : -9999;
    var py = p.inside ? p.y : -9999;
    var i;
    var s;
    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      s.x += s.vx;
      s.y += s.vy - ds * s.z * 0.18;
      s.t += 0.015;
      if (s.x < -10) s.x = W + 10;
      else if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y += H + 20;
      else if (s.y > H + 10) s.y -= H + 20;
      var near = Math.hypot(s.x - px, s.y - py) < REACH;
      var a = (0.28 + Math.sin(s.t) * 0.18) * s.z + (near ? 0.4 : 0);
      ctx.fillStyle = "rgba(" + s.c + "," + fx.clamp(a, 0, 1).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.z * (near ? 1.9 : 1.3), 0, 6.283);
      ctx.fill();
      s.near = near;
    }
    ctx.lineWidth = 0.8;
    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      if (!s.near) continue;
      var dc = Math.hypot(s.x - px, s.y - py);
      ctx.strokeStyle = "rgba(" + s.c + "," + (0.5 * (1 - dc / REACH)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      for (var j = i + 1; j < stars.length; j++) {
        var o = stars[j];
        if (!o.near) continue;
        var d = Math.hypot(s.x - o.x, s.y - o.y);
        if (d > LINK) continue;
        ctx.strokeStyle = "rgba(235,240,255," + (0.32 * (1 - d / LINK)).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(o.x, o.y);
        ctx.stroke();
      }
    }
  }

  /* —— Comet orbit —— */
  var orbit = doc.createElement("div");
  orbit.className = "mvfx-orbit wfx-deco";
  orbit.setAttribute("aria-hidden", "true");
  var comet = doc.createElement("i");
  comet.className = "mvfx-orbit__comet";
  var planets = fx.all("main > section[id]").filter(function (s) {
    return s.id !== "menue" && s.id !== "offerte";
  });
  var planetEls = planets.map(function () {
    var el = doc.createElement("i");
    el.className = "mvfx-orbit__planet";
    orbit.appendChild(el);
    return el;
  });
  orbit.appendChild(comet);
  body.appendChild(orbit);

  var cometVel = 0;
  var cometPrev = window.scrollY || 0;
  var lastP = -1;
  function drawOrbit() {
    var y = window.scrollY || 0;
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? y / max : 0;
    cometVel += (y - cometPrev - cometVel) * 0.2;
    cometPrev = y;
    var tail = fx.clamp(Math.abs(cometVel) * 1.4, 10, 70);
    if (p !== lastP || Math.abs(cometVel) > 0.05) {
      lastP = p;
      comet.style.top = (p * 100).toFixed(3) + "%";
      comet.style.setProperty("--tail", tail.toFixed(0) + "px");
      orbit.classList.toggle("is-up", cometVel < -0.5);
      planets.forEach(function (sec, i) {
        var at = max > 0 ? fx.clamp((sec.offsetTop - window.innerHeight * 0.4) / max, 0, 1) : 0;
        planetEls[i].style.top = (at * 100).toFixed(2) + "%";
        planetEls[i].classList.toggle("is-passed", p >= at - 0.002);
      });
    }
  }

  /* —— Holographic cards —— */
  fx.all(".mv-dim, .mv-world-card").forEach(function (card) {
    var holo = doc.createElement("span");
    holo.className = "mvfx-holo wfx-deco";
    holo.setAttribute("aria-hidden", "true");
    card.appendChild(holo);
    if (!fx.finePointer) return;
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      holo.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      holo.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      holo.style.setProperty("--sheen", (100 - x * 100).toFixed(1) + "%");
    });
    card.addEventListener("pointerenter", function () {
      card.classList.add("is-holo");
    });
    card.addEventListener("pointerleave", function () {
      card.classList.remove("is-holo");
    });
  });

  /* —— Depth parallax on dimension images —— */
  var dimImgs = fx.all(".mv-dim__media img");
  var lastImgY = -1;
  function drawDepth() {
    var y = window.scrollY || 0;
    if (y === lastImgY) return;
    lastImgY = y;
    var vh = window.innerHeight;
    dimImgs.forEach(function (img) {
      var r = img.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var c = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.setProperty("--py", (c * -34).toFixed(1) + "px");
    });
  }

  fx.loop(function () {
    drawSky();
    drawOrbit();
    drawDepth();
  });
  fx.onToggle(function (active) {
    if (!active && ctx) ctx.clearRect(0, 0, W, H);
    if (active) {
      lastP = -1;
      lastImgY = -1;
    }
  });
})();
