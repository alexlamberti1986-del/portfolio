/**
 * NEXORA effect layer — "System-Boot".
 * Mono labels decode like data streams, headlines are scanned in,
 * skill bars load, cards get HUD target corners and the cursor carries
 * a scanner grid with live coordinates.
 */
(function () {
  "use strict";
  var fx = window.V2WorldFx;
  if (!fx) return;
  var doc = document;
  var body = doc.body;

  fx.css(
    "nxfx",
    [
      /* Headline scan: clip from left, bright scan bar rides the edge */
      "html.wfx-on .nxfx-h{position:relative}",
      "html.wfx-on .nxfx-h:not(.wfx-in){clip-path:inset(0 100% 0 0)}",
      "html.wfx-on .nxfx-h.wfx-in{animation:nxfx-wipe .9s cubic-bezier(.65,0,.35,1) both}",
      ".nxfx-scanbar{position:absolute;top:-6%;bottom:-6%;left:0;width:2px;opacity:0;",
      "  background:#8ec5ff;box-shadow:0 0 12px 2px rgba(142,197,255,.9),0 0 40px 6px rgba(61,139,255,.45)}",
      "html.wfx-on .nxfx-h.wfx-in .nxfx-scanbar{animation:nxfx-bar .9s cubic-bezier(.65,0,.35,1) both}",
      "@keyframes nxfx-wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}",
      "@keyframes nxfx-bar{0%{left:0;opacity:1}92%{opacity:1}100%{left:100%;opacity:0}}",

      /* Skill bars load up */
      "html.wfx-on .nxfx-bar i{transform:scaleX(0);transform-origin:0 50%;transition:transform 1.4s cubic-bezier(.16,1,.3,1) .25s}",
      "html.wfx-on .nxfx-bar.wfx-in i{transform:scaleX(1)}",

      /* Timeline entries log in one by one */
      "html.wfx-on .nxfx-log{opacity:0;transform:translate3d(-14px,0,0);transition:opacity .55s ease,transform .55s cubic-bezier(.16,1,.3,1),border-color .8s;transition-delay:calc(var(--i,0)*90ms)}",
      "html.wfx-on .nxfx-log.wfx-in{opacity:1;transform:none;border-left-color:rgba(142,197,255,.6)}",
      "html.wfx-on .nxfx-log.wfx-in time::after{content:'_';margin-left:.2em;animation:nxfx-caret 1s steps(1) 3 forwards}",
      "@keyframes nxfx-caret{50%{opacity:0}100%{opacity:0}}",

      /* HUD target corners on cards */
      "html.wfx-on .nxfx-card{position:relative}",
      ".nxfx-corners{position:absolute;inset:0;z-index:2;border-radius:inherit;--c:rgba(142,197,255,.55);--s:9px;",
      "  background:",
      "    linear-gradient(var(--c),var(--c)) 0 0/var(--s) 1px no-repeat,linear-gradient(var(--c),var(--c)) 0 0/1px var(--s) no-repeat,",
      "    linear-gradient(var(--c),var(--c)) 100% 0/var(--s) 1px no-repeat,linear-gradient(var(--c),var(--c)) 100% 0/1px var(--s) no-repeat,",
      "    linear-gradient(var(--c),var(--c)) 0 100%/var(--s) 1px no-repeat,linear-gradient(var(--c),var(--c)) 0 100%/1px var(--s) no-repeat,",
      "    linear-gradient(var(--c),var(--c)) 100% 100%/var(--s) 1px no-repeat,linear-gradient(var(--c),var(--c)) 100% 100%/1px var(--s) no-repeat;",
      "  transition:--s .3s}",
      "@property --s{syntax:'<length>';inherits:true;initial-value:9px}",
      ".nxfx-card:hover>.nxfx-corners{--s:22px;--c:#8ec5ff;filter:drop-shadow(0 0 4px rgba(142,197,255,.8))}",
      ".nxfx-corners::after{content:'';position:absolute;left:0;right:0;top:0;height:40%;opacity:0;",
      "  background:linear-gradient(180deg,transparent,rgba(142,197,255,.12) 70%,rgba(142,197,255,.5) 98%,transparent)}",
      ".nxfx-card:hover>.nxfx-corners::after{animation:nxfx-sweep .9s cubic-bezier(.65,0,.35,1) 1}",
      "@keyframes nxfx-sweep{0%{opacity:1;transform:translateY(-100%)}100%{opacity:0;transform:translateY(260%)}}",

      /* Cursor scanner grid + coordinates */
      ".nxfx-scope{position:fixed;inset:0;z-index:70;opacity:0;transition:opacity .4s;mix-blend-mode:screen;",
      "  background-image:linear-gradient(rgba(142,197,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(142,197,255,.16) 1px,transparent 1px);",
      "  background-size:28px 28px;background-position:var(--gx,0) var(--gy,0);",
      "  -webkit-mask-image:radial-gradient(170px circle at var(--x,-999px) var(--y,-999px),#000 0,rgba(0,0,0,.35) 55%,transparent 100%);",
      "  mask-image:radial-gradient(170px circle at var(--x,-999px) var(--y,-999px),#000 0,rgba(0,0,0,.35) 55%,transparent 100%)}",
      ".nxfx-scope.is-on{opacity:1}",
      ".nxfx-readout{position:fixed;left:0;top:0;z-index:71;opacity:0;transition:opacity .4s;",
      "  font:500 10px/1.2 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.12em;color:rgba(142,197,255,.85);",
      "  text-shadow:0 0 8px rgba(61,139,255,.6);white-space:nowrap}",
      ".nxfx-readout.is-on{opacity:1}",

      /* Primary buttons glitch briefly on hover */
      "html.wfx-on .nx-btn--primary:hover{animation:nxfx-glitch .38s steps(2) 1}",
      "@keyframes nxfx-glitch{0%{text-shadow:2px 0 #ff59b2,-2px 0 #5dffc2}33%{text-shadow:-2px 0 #ff59b2,2px 0 #5dffc2}66%{text-shadow:1px 0 #ff59b2,-1px 0 #5dffc2}100%{text-shadow:none}}",
    ].join("\n")
  );

  /* —— Decode mono labels —— */
  var GLYPHS = "01<>/\\#%&$@+=*ABCDEFXYZ";
  function decode(el) {
    var final = el.textContent;
    if (!final || !final.trim()) return;
    var start = performance.now();
    var dur = 520 + Math.min(final.length * 28, 520);
    (function step(t) {
      if (!fx.isOn()) {
        el.textContent = final;
        return;
      }
      var p = Math.min(1, (t - start) / dur);
      var reveal = Math.floor(p * final.length);
      var out = "";
      for (var i = 0; i < final.length; i++) {
        var ch = final[i];
        out += i < reveal || ch === " " || ch === "·" ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = final;
    })(start);
  }
  fx.all(".nx-kicker, .nx-mono, .nx-kv dt").forEach(function (el) {
    /* Translated labels would be reverted to German when the decode finishes */
    if (el.hasAttribute("data-i18n-v2") || el.hasAttribute("data-i18n-v2-html")) return;
    var textOnly = Array.prototype.every.call(el.childNodes, function (n) {
      return n.nodeType === 3;
    });
    if (!textOnly) return;
    fx.reveal(el, function () {
      if (fx.isOn()) decode(el);
    });
  });

  /* —— Headline scan —— */
  fx.all(".nx-section__head h2, .nx-contact__copy h2, .nx-prose h3, .nx-hero__copy h1").forEach(function (h) {
    h.classList.add("nxfx-h");
    var bar = doc.createElement("span");
    bar.className = "nxfx-scanbar wfx-deco";
    bar.setAttribute("aria-hidden", "true");
    h.appendChild(bar);
    fx.reveal(h, null, h.parentNode);
  });

  /* —— Skill bars —— */
  fx.all(".nx-bar").forEach(function (b) {
    b.classList.add("nxfx-bar");
    fx.reveal(b);
  });

  /* —— Timeline —— */
  fx.all(".nx-timeline").forEach(function (list) {
    fx.all("li", list).forEach(function (li, i) {
      li.classList.add("nxfx-log");
      li.style.setProperty("--i", i);
      fx.reveal(li);
    });
  });

  /* —— HUD corners —— */
  fx.all(".nx-module, .nx-svc, .nx-tech, .nx-values article, .nx-port, .nx-exp-block, .nx-flow__card").forEach(function (card) {
    card.classList.add("nxfx-card");
    var c = doc.createElement("span");
    c.className = "nxfx-corners wfx-deco";
    c.setAttribute("aria-hidden", "true");
    card.appendChild(c);
  });

  /* —— Cursor scanner —— */
  if (fx.finePointer) {
    var scope = doc.createElement("div");
    scope.className = "nxfx-scope wfx-deco";
    scope.setAttribute("aria-hidden", "true");
    var readout = doc.createElement("div");
    readout.className = "nxfx-readout wfx-deco";
    readout.setAttribute("aria-hidden", "true");
    body.appendChild(scope);
    body.appendChild(readout);
    var sx = -999;
    var sy = -999;
    var lastKey = "";
    var pad = function (n) {
      n = Math.max(0, Math.round(n));
      return ("0000" + n).slice(-4);
    };
    fx.loop(function () {
      var p = fx.pointer;
      var on = p.inside;
      scope.classList.toggle("is-on", on);
      readout.classList.toggle("is-on", on);
      if (!on) return;
      sx += (p.x - sx) * 0.22;
      sy += (p.y - sy) * 0.22;
      var y = window.scrollY || 0;
      var key = sx.toFixed(1) + "|" + sy.toFixed(1) + "|" + y;
      if (key === lastKey) return;
      lastKey = key;
      scope.style.setProperty("--x", sx.toFixed(1) + "px");
      scope.style.setProperty("--y", sy.toFixed(1) + "px");
      scope.style.setProperty("--gy", (-y % 28).toFixed(1) + "px");
      readout.style.transform = "translate3d(" + (sx + 18).toFixed(1) + "px," + (sy + 16).toFixed(1) + "px,0)";
      readout.textContent = "X " + pad(sx) + " · Y " + pad(sy + y);
    });
  }
})();
