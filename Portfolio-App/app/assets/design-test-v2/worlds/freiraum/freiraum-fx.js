/**
 * FREIRAUM effect layer — "Atelier".
 * The cursor leaves fading paint, headline letters are set by hand,
 * images are painted in with a brush wipe, eyebrows get a hand-drawn
 * squiggle, buttons splash colour and the hero marquee follows the scroll.
 */
(function () {
  "use strict";
  var fx = window.V2WorldFx;
  if (!fx) return;
  var doc = document;
  var body = doc.body;
  var PAINT = ["255,198,111", "255,139,189", "255,122,89", "127,214,194", "196,160,255"];
  var SPRING = "cubic-bezier(.34,1.56,.64,1)";

  var wipeFrom = "polygon(-20% -20%,-25% -20%,-32% 12%,-20% 25%,-34% 38%,-22% 52%,-36% 66%,-24% 80%,-33% 92%,-28% 120%,-20% 120%)";
  var wipeTo = "polygon(-20% -20%,115% -20%,108% 12%,120% 25%,106% 38%,118% 52%,104% 66%,116% 80%,107% 92%,112% 120%,-20% 120%)";
  var squiggle =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 10' preserveAspectRatio='none'%3E" +
    "%3Cpath d='M2 6 C 12 1, 20 9, 30 5 S 48 1, 58 6 S 76 9, 86 4 S 106 2, 118 6' fill='none' stroke='%23ffc66f' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E\")";

  fx.css(
    "frfx",
    [
      /* Hand-set letters */
      "html.wfx-on .frfx-h .wfx-c{opacity:0;transform:translate3d(0,-.55em,0) rotate(var(--r,0deg)) scale(.55);",
      "  transition:opacity .35s ease,transform .75s " + SPRING + ";transition-delay:calc(var(--i)*22ms)}",
      "html.wfx-on .frfx-h.wfx-in .wfx-c{opacity:1;transform:none}",

      /* Brush wipe on images */
      "html.wfx-on .frfx-paint{clip-path:" + wipeFrom + ";transition:clip-path 1.25s cubic-bezier(.7,0,.2,1);transition-delay:var(--d,0s)}",
      "html.wfx-on .frfx-paint.wfx-in{clip-path:" + wipeTo + "}",

      /* Hand-drawn squiggle under eyebrows */
      "html.wfx-on .frfx-squiggle{padding-bottom:.55em;background-image:" + squiggle + ";background-repeat:no-repeat;",
      "  background-position:var(--sx,0) 100%;background-size:0 .5em;transition:background-size .9s cubic-bezier(.65,0,.35,1) .2s}",
      "html.wfx-on .frfx-squiggle.wfx-in{background-size:var(--tw,6em) .5em}",

      /* Paint trail + splashes */
      ".frfx-trail{position:fixed;inset:0;z-index:55;width:100%;height:100%;mix-blend-mode:screen;opacity:.55}",
      ".frfx-splash{position:fixed;z-index:56;width:var(--s,8px);height:var(--s,8px);margin:calc(var(--s,8px)/-2) 0 0 calc(var(--s,8px)/-2);",
      "  border-radius:50% 45% 55% 50%;background:var(--c);pointer-events:none}",

      /* Pin labels wobble like a loose sticker */
      "html.wfx-on .fr-pin:hover .fr-pin__label{animation:frfx-wobble .7s " + SPRING + " 1}",
      "@keyframes frfx-wobble{0%{transform:rotate(0)}25%{transform:rotate(-6deg) scale(1.06)}55%{transform:rotate(4deg)}80%{transform:rotate(-2deg)}100%{transform:rotate(0)}}",
    ].join("\n")
  );

  /* —— Hand-set headlines —— */
  fx.all(".fr-section-head h2, .fr-manifest__body h2, .fr-about__copy h2, .fr-contact__copy h2, .fr-hero__copy h1").forEach(function (h) {
    fx.splitChars(h).forEach(function (c) {
      c.style.setProperty("--r", ((Math.random() - 0.5) * 50).toFixed(0) + "deg");
    });
    h.classList.add("frfx-h");
    fx.reveal(h);
  });

  /* —— Brush wipe —— */
  fx.all(".fr-disciplines").forEach(function (group) {
    fx.all(".fr-disc img", group).forEach(function (img, i) {
      img.style.setProperty("--d", (i * 0.14).toFixed(2) + "s");
    });
  });
  fx.all(".fr-notes .fr-pin img").forEach(function (img, i) {
    img.style.setProperty("--d", ((i % 4) * 0.1).toFixed(2) + "s");
  });
  fx.all(".fr-disc img, .fr-tilt img, .fr-notes .fr-pin img").forEach(function (img) {
    img.classList.add("frfx-paint");
    fx.reveal(img, null, img.parentNode);
  });

  /* —— Eyebrow squiggles —— */
  function measure(el) {
    try {
      var range = doc.createRange();
      range.selectNodeContents(el);
      var rr = range.getBoundingClientRect();
      var er = el.getBoundingClientRect();
      if (!rr.width) return;
      el.style.setProperty("--tw", rr.width.toFixed(0) + "px");
      el.style.setProperty("--sx", Math.max(0, rr.left - er.left).toFixed(0) + "px");
    } catch (e) {}
  }
  var eyebrows = fx.all(".fr-eyebrow");
  eyebrows.forEach(function (e) {
    e.classList.add("frfx-squiggle");
    measure(e);
    fx.reveal(e, measure);
  });
  window.addEventListener("resize", function () {
    eyebrows.forEach(measure);
  });
  window.addEventListener("v2-lang-change", function () {
    setTimeout(function () {
      eyebrows.forEach(measure);
    }, 60);
  });

  /* —— Paint splash on click —— */
  function splash(x, y) {
    if (!fx.isOn() || !Element.prototype.animate) return;
    for (var i = 0; i < 12; i++) {
      var d = doc.createElement("i");
      d.className = "frfx-splash wfx-deco";
      d.setAttribute("aria-hidden", "true");
      d.style.left = x + "px";
      d.style.top = y + "px";
      d.style.setProperty("--s", (5 + Math.random() * 9).toFixed(0) + "px");
      d.style.setProperty("--c", "rgb(" + PAINT[i % PAINT.length] + ")");
      body.appendChild(d);
      var a = Math.random() * Math.PI * 2;
      var dist = 30 + Math.random() * 60;
      var dx = Math.cos(a) * dist;
      var dy = Math.sin(a) * dist;
      var anim = d.animate(
        [
          { transform: "translate(0,0) scale(.4)", opacity: 1 },
          { transform: "translate(" + dx + "px," + dy + "px) scale(1)", opacity: 0.9, offset: 0.55 },
          { transform: "translate(" + dx * 1.1 + "px," + (dy + 40) + "px) scale(.7)", opacity: 0 },
        ],
        { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.8,.3,1)" }
      );
      anim.onfinish = (function (node) {
        return function () {
          if (node.parentNode) node.parentNode.removeChild(node);
        };
      })(d);
    }
  }
  doc.addEventListener(
    "pointerdown",
    function (e) {
      var t = e.target && e.target.closest ? e.target.closest(".fr-btn, .fr-pin, .fr-menu-hero__card") : null;
      if (t) splash(e.clientX, e.clientY);
    },
    { passive: true }
  );

  /* —— Paint trail —— */
  if (fx.finePointer) {
    var cv = doc.createElement("canvas");
    cv.className = "frfx-trail wfx-deco";
    cv.setAttribute("aria-hidden", "true");
    body.appendChild(cv);
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0;
    var H = 0;
    var resize = function () {
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    var blobs = [];
    var lx = null;
    var ly = null;
    var hue = 0;
    var dirty = false;
    fx.loop(function () {
      var p = fx.pointer;
      if (p.inside) {
        if (lx === null) {
          lx = p.x;
          ly = p.y;
        }
        var dx = p.x - lx;
        var dy = p.y - ly;
        var dist = Math.hypot(dx, dy);
        if (dist > 2) {
          var steps = Math.min(8, Math.ceil(dist / 9));
          var size = fx.clamp(6 + dist * 0.35, 6, 26);
          for (var s = 1; s <= steps; s++) {
            blobs.push({
              x: lx + (dx * s) / steps,
              y: ly + (dy * s) / steps,
              r: size * (0.75 + Math.random() * 0.5),
              c: PAINT[(hue | 0) % PAINT.length],
              life: 1,
              vy: 0.15 + Math.random() * 0.35,
            });
          }
          hue += 0.04 * steps;
          lx = p.x;
          ly = p.y;
          if (blobs.length > 220) blobs.splice(0, blobs.length - 220);
        }
      } else {
        lx = ly = null;
      }
      if (!blobs.length) {
        if (dirty) {
          ctx.clearRect(0, 0, W, H);
          dirty = false;
        }
        return;
      }
      dirty = true;
      ctx.clearRect(0, 0, W, H);
      for (var i = blobs.length - 1; i >= 0; i--) {
        var b = blobs[i];
        b.life -= 0.022;
        b.y += b.vy;
        if (b.life <= 0) {
          blobs.splice(i, 1);
          continue;
        }
        var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, "rgba(" + b.c + "," + (0.55 * b.life).toFixed(3) + ")");
        g.addColorStop(1, "rgba(" + b.c + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, 6.283);
        ctx.fill();
      }
    });
  }

  /* —— Marquee follows scroll speed and direction —— */
  var track = doc.querySelector(".fr-hero__strip-track");
  var marquee = track && track.getAnimations ? track.getAnimations()[0] : null;
  if (marquee) {
    var prevY = window.scrollY || 0;
    var vel = 0;
    var lastRate = 1;
    fx.loop(function () {
      var y = window.scrollY || 0;
      vel += (y - prevY - vel) * 0.12;
      prevY = y;
      var rate = fx.clamp(1 + vel * 0.35, -6, 8);
      if (Math.abs(rate - lastRate) < 0.02) return;
      lastRate = rate;
      marquee.playbackRate = rate;
    });
    fx.onToggle(function (active) {
      if (!active && marquee) marquee.playbackRate = 1;
    });
  }
})();
