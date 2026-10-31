/**
 * PROFESSIONAL effect layer — "Redaktionelle Präzision".
 * Restrained by design: headlines ink in word by word while reading,
 * images open like a curtain, hairline rules draw themselves, a folio
 * register shows the current chapter and buttons respond magnetically.
 */
(function () {
  "use strict";
  var fx = window.V2WorldFx;
  if (!fx) return;
  var doc = document;
  var body = doc.body;
  var EASE = "cubic-bezier(.22,.61,.36,1)";

  fx.css(
    "profx",
    [
      /* Reading ink: words darken as the heading moves up the viewport */
      "html.wfx-on .profx-ink .wfx-w{overflow:visible}",
      "html.wfx-on .profx-ink .wfx-wi{opacity:clamp(.2,calc(var(--p,0) * var(--n,1) - var(--i,0)),1);transition:opacity .25s linear}",

      /* Eyebrows settle from wide tracking */
      "html.wfx-on .profx-eyebrow{letter-spacing:.42em;opacity:0;transition:letter-spacing 1.4s " + EASE + ",opacity 1s " + EASE + "}",
      "html.wfx-on .profx-eyebrow.wfx-in{letter-spacing:.12em;opacity:.55}",

      /* Image curtain */
      "html.wfx-on .profx-curtain{clip-path:inset(0 0 100% 0);transition:clip-path 1.3s cubic-bezier(.77,0,.18,1)}",
      "html.wfx-on .profx-curtain img{transform:scale(1.12);transition:transform 1.8s " + EASE + "}",
      "html.wfx-on .profx-curtain.wfx-in{clip-path:inset(0 0 0 0)}",
      "html.wfx-on .profx-curtain.wfx-in img{transform:none}",

      /* Hairline rules */
      "html.wfx-on .profx-ruled{position:relative}",
      ".profx-rule{position:absolute;left:-1px;right:-1px;top:-1px;height:1px;background:#111;transform:scaleX(0);transform-origin:0 50%;",
      "  transition:transform 1.1s " + EASE + " .15s}",
      ".profx-ruled.wfx-in>.profx-rule{transform:scaleX(1)}",

      /* Folio register */
      ".profx-folio{position:fixed;left:24px;bottom:22px;z-index:45;display:flex;align-items:center;gap:.7rem;",
      "  font:500 12px/1 Inter,'Helvetica Neue',Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#111;",
      "  padding:.55rem .8rem;background:rgba(247,247,245,.86);border:1px solid rgba(17,17,17,.1);backdrop-filter:blur(8px)}",
      ".profx-folio__num{display:inline-block;font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}",
      ".profx-folio__bar{width:48px;height:1px;background:rgba(17,17,17,.15);position:relative}",
      ".profx-folio__bar i{position:absolute;inset:0;background:#111;transform-origin:0 50%;transform:scaleX(var(--p,0))}",
      ".profx-folio__name{color:#5c5c58;min-width:7ch}",
      "@media (max-width:1099px){.profx-folio{display:none!important}}",

      /* Wordmark drifts sideways while leaving the menu hero */
      "html.wfx-on .pro-menu-hero__wordmark{transform:translate(calc(-50% + var(--wm,0px)),-50%)}",

      /* Magnetic buttons */
      "html.wfx-on .profx-mag{transform:translate3d(var(--mx,0px),var(--my,0px),0);transition:transform .35s " + EASE + ",background .2s,color .2s,border-color .2s}",
    ].join("\n")
  );

  /* —— Reading ink —— */
  var inkHeads = fx.all(".pro-section__head h2, .pro-position__body h2, .pro-hero__copy h1").map(function (h) {
    var words = fx.splitWords(h);
    h.style.setProperty("--n", words.length || 1);
    h.classList.add("profx-ink");
    return h;
  });
  var lastInkY = -1;
  function drawInk() {
    var y = window.scrollY || 0;
    if (y === lastInkY) return;
    lastInkY = y;
    var vh = window.innerHeight;
    inkHeads.forEach(function (h) {
      var r = h.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var p = fx.clamp((vh * 0.92 - r.top) / (vh * 0.42), 0, 1);
      h.style.setProperty("--p", p.toFixed(3));
    });
  }

  /* —— Eyebrows (translated ones too: only letter-spacing animates) —— */
  fx.all(".pro-eyebrow").forEach(function (e) {
    e.classList.add("profx-eyebrow");
    fx.reveal(e);
  });

  /* —— Image curtains —— */
  fx.all(".pro-service__media, .pro-position__media, .pro-hero__media").forEach(function (f) {
    f.classList.add("profx-curtain");
    fx.reveal(f, null, f.parentNode);
  });

  /* —— Hairline rules —— */
  fx.all(".pro-trust article, .pro-lanes article").forEach(function (a) {
    a.classList.add("profx-ruled");
    var rule = doc.createElement("span");
    rule.className = "profx-rule wfx-deco";
    rule.setAttribute("aria-hidden", "true");
    a.appendChild(rule);
    fx.reveal(a);
  });

  /* —— Folio register —— */
  var chapters = fx.all("main > section[id]").filter(function (s) {
    return s.id !== "menue" && s.id !== "offerte";
  });
  var folio = doc.createElement("div");
  folio.className = "profx-folio wfx-deco";
  folio.setAttribute("aria-hidden", "true");
  folio.innerHTML =
    '<span class="profx-folio__num"></span>' +
    '<span class="profx-folio__bar"><i></i></span>' +
    '<span class="profx-folio__name"></span>';
  body.appendChild(folio);
  var numBox = folio.querySelector(".profx-folio__num");
  var nameEl = folio.querySelector(".profx-folio__name");
  var barEl = folio.querySelector(".profx-folio__bar i");
  var total = ("0" + chapters.length).slice(-2);
  var current = -1;

  function chapterName(sec) {
    var e = sec.querySelector(".pro-eyebrow");
    var t = e ? e.textContent : sec.id;
    return (t.split(/[·&]/)[0] || t).trim();
  }

  function setChapter(i) {
    if (i === current || i < 0) return;
    var dir = i > current ? 1 : -1;
    current = i;
    numBox.textContent = ("0" + (i + 1)).slice(-2) + " / " + total;
    nameEl.textContent = chapterName(chapters[i]);
    if (numBox.animate) {
      var from = { transform: "translateY(" + dir * 70 + "%)", opacity: 0 };
      numBox.animate([from, { transform: "none", opacity: 1 }], { duration: 450, easing: "cubic-bezier(.22,.61,.36,1)" });
      nameEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450 });
    }
  }

  var lastFolioY = -1;
  function drawFolio() {
    var y = window.scrollY || 0;
    if (y === lastFolioY) return;
    lastFolioY = y;
    var mid = window.innerHeight * 0.45;
    var idx = -1;
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].getBoundingClientRect().top <= mid) idx = i;
    }
    folio.style.opacity = idx < 0 ? "0" : "1";
    if (idx < 0) return;
    setChapter(idx);
    var r = chapters[idx].getBoundingClientRect();
    barEl.style.setProperty("--p", fx.clamp((mid - r.top) / Math.max(r.height, 1), 0, 1).toFixed(3));
  }
  folio.style.transition = "opacity .4s";

  /* —— Wordmark drift —— */
  var wordmark = doc.querySelector(".pro-menu-hero__wordmark");
  var lastWmY = -1;
  function drawWordmark() {
    if (!wordmark) return;
    var y = window.scrollY || 0;
    if (y === lastWmY || y > window.innerHeight * 1.5) return;
    lastWmY = y;
    wordmark.style.setProperty("--wm", (y * -0.35).toFixed(1) + "px");
  }

  /* —— Magnetic buttons —— */
  if (fx.finePointer) {
    fx.all(".pro-btn").forEach(function (btn) {
      btn.classList.add("profx-mag");
      btn.addEventListener("pointermove", function (e) {
        if (!fx.isOn()) return;
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.setProperty("--mx", (dx * 0.18).toFixed(1) + "px");
        btn.style.setProperty("--my", (dy * 0.3).toFixed(1) + "px");
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.setProperty("--mx", "0px");
        btn.style.setProperty("--my", "0px");
      });
    });
  }

  fx.loop(function () {
    drawInk();
    drawFolio();
    drawWordmark();
  });
  fx.onToggle(function (active) {
    if (active) {
      lastInkY = lastFolioY = lastWmY = -1;
    }
  });
})();
