/*!
 * welcome-scroll-fx.js — Scroll- & Animations-Layer für alexlamberti.ch (Willkommensseite)
 * Einbinden direkt vor </body>, NACH welcome-imagevideo.js.
 * Keine Abhängigkeiten. Respektiert "prefers-reduced-motion".
 */
(function () {
  'use strict';
  if (window.__welcomeScrollFx) return;
  window.__welcomeScrollFx = true;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------------------------------------------------------------- CSS */
  var css = `
  :root{--fx-pink:#ff59b2;--fx-violet:#9a6bff;--fx-blue:#8ec5ff;--fx-ease:cubic-bezier(.16,1,.3,1)}
  .fx-progress{position:fixed;left:0;top:0;height:3px;width:100%;z-index:9999;pointer-events:none;
    transform-origin:0 50%;transform:scaleX(0);
    background:linear-gradient(90deg,var(--fx-pink),var(--fx-violet),var(--fx-blue));
    box-shadow:0 0 12px rgba(154,107,255,.8)}
  .fx-stars{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.9;mix-blend-mode:screen}
  html,body{overflow-x:clip}
  #welcomeContent{position:relative;z-index:1}

  /* Reveal-Grundlage */
  .fx-r{opacity:0;transform:translate3d(0,48px,0);filter:blur(10px);
    transition:opacity 1s var(--fx-ease),transform 1.1s var(--fx-ease),filter 1s var(--fx-ease);
    transition-delay:var(--fx-d,0s);will-change:opacity,transform}
  .fx-r.fx-in{opacity:1;transform:none;filter:none}
  .fx-r.fx-left{transform:translate3d(-70px,30px,0) rotate(-2deg)}
  .fx-r.fx-right{transform:translate3d(70px,30px,0) rotate(2deg)}
  .fx-r.fx-zoom{transform:scale(.88) translate3d(0,40px,0)}
  .fx-r.fx-left.fx-in,.fx-r.fx-right.fx-in,.fx-r.fx-zoom.fx-in{transform:none}

  /* Wort-für-Wort Headlines */
  .fx-words .fx-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}
  .fx-words .fx-w>span{display:inline-block;transform:translate3d(0,110%,0) rotate(6deg);opacity:0;
    transition:transform .9s var(--fx-ease),opacity .9s var(--fx-ease);transition-delay:calc(var(--i)*55ms + var(--fx-d,0s))}
  .fx-words.fx-in .fx-w>span{transform:none;opacity:1}

  /* Karten: 3D-Tilt + Spotlight */
  .grid{perspective:1200px}
  .grid .card{position:relative;transform-style:preserve-3d;
    transition:transform .5s var(--fx-ease),border-color .3s,box-shadow .5s var(--fx-ease),opacity 1s var(--fx-ease),filter 1s var(--fx-ease) !important;
    transition-delay:0s,0s,0s,var(--fx-d,0s),var(--fx-d,0s) !important}
  .grid .card.fx-in{transform:perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(var(--ty,0px))}
  .grid .card.fx-hover{--ty:-6px;box-shadow:0 30px 60px -20px rgba(0,0,0,.7),0 0 40px -10px var(--fx-glow,rgba(154,107,255,.6))}
  .grid .card::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;
    transition:opacity .4s;background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.16),transparent 45%);z-index:3}
  .grid .card.fx-hover::after{opacity:1}
  .grid .card.mv{--fx-glow:rgba(255,89,178,.55)}
  .grid .card.nx{--fx-glow:rgba(142,197,255,.55)}
  .grid .card.pro{--fx-glow:rgba(255,255,255,.35)}
  .grid .card.fr{--fx-glow:rgba(255,198,111,.5)}
  .grid .card .thumb{transition:background-position .2s linear;background-position:center var(--py,50%) !important}

  /* Galaxy-Box: rotierender Leuchtrand */
  .galaxy{position:relative;isolation:isolate}
  .galaxy::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;z-index:-1;
    background:conic-gradient(from var(--fx-a,0deg),transparent 0 60%,var(--fx-pink),var(--fx-violet),var(--fx-blue),transparent 95%);
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;
    animation:fxSpin 5s linear infinite;opacity:.9}
  @property --fx-a{syntax:"<angle>";inherits:false;initial-value:0deg}
  @keyframes fxSpin{to{--fx-a:360deg}}
  .galaxy .btn-primary{position:relative;overflow:hidden}
  .galaxy .btn-primary::after{content:"";position:absolute;inset:0;transform:translateX(-120%) skewX(-20deg);
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent);animation:fxSweep 3.2s 1.5s ease-in-out infinite}
  @keyframes fxSweep{0%,60%{transform:translateX(-120%) skewX(-20deg)}100%{transform:translateX(220%) skewX(-20deg)}}

  /* Direkt-weiter Kacheln */
  .more-grid a{transition:transform .4s var(--fx-ease),border-color .3s,background .3s,opacity 1s var(--fx-ease),filter 1s var(--fx-ease) !important}
  .more-grid a.fx-in:hover{transform:translateY(-6px);border-color:rgba(154,107,255,.6)}

  @media (prefers-reduced-motion: reduce){
    .fx-r,.fx-words .fx-w>span{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}
    .galaxy::before,.galaxy .btn-primary::after{animation:none!important}
    .fx-stars{display:none}
  }`;
  var style = document.createElement('style');
  style.id = 'welcome-scroll-fx';
  style.textContent = css;
  document.head.appendChild(style);

  /* -------------------------------------------------- Scroll-Fortschritt */
  var bar = document.createElement('div');
  bar.className = 'fx-progress';
  document.body.appendChild(bar);

  /* ------------------------------------------ Headlines in Wörter teilen */
  function splitWords(el) {
    if (!el || el.dataset.fxSplit) return;
    el.dataset.fxSplit = '1';
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'fx-w';
            var s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
    el.classList.add('fx-words');
  }

  /* ------------------------------------------------ Reveal-Ziele setzen */
  function mark(el, cls, delay) {
    if (!el) return;
    el.classList.add('fx-r');
    if (cls) el.classList.add(cls);
    if (delay) el.style.setProperty('--fx-d', delay + 's');
  }

  splitWords($('.hero h1'));
  mark($('.hero .brand'), 'fx-zoom', 0);
  mark($('.hero .hero-lead'), null, .35);

  $$('.section-head h2').forEach(function (h) { splitWords(h); });
  $$('.section-head p').forEach(function (p) { mark(p, null, .2); });

  var cards = $$('.grid .card');
  cards.forEach(function (c, i) {
    mark(c, i % 2 ? 'fx-right' : 'fx-left', (i % 2) * .12 + Math.floor(i / 2) * .08);
  });

  var galaxy = $('.galaxy');
  mark(galaxy, 'fx-zoom', 0);
  if (galaxy) { splitWords($('h2', galaxy)); mark($('p', galaxy), null, .25); mark($('.galaxy-actions', galaxy), null, .4); }

  $$('.more-grid a').forEach(function (a, i) { mark(a, null, i * .12); });
  $$('.welcome-footer > *').forEach(function (f, i) { mark(f, null, i * .1); });

  var targets = $$('.fx-r, .fx-words');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('fx-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('fx-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ----------------------------------------- Karten: Tilt & Spotlight */
  if (finePointer && !reduce) {
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', x * 100 + '%');
        card.style.setProperty('--my', y * 100 + '%');
        card.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerenter', function () { card.classList.add('fx-hover'); });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('fx-hover');
        card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ------------------------------------------------ Sternenfeld (Canvas) */
  var cv, ctx, stars = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (!reduce) {
    cv = document.createElement('canvas');
    cv.className = 'fx-stars';
    var content = $('#welcomeContent');
    (content ? content.parentNode : document.body).insertBefore(cv, content || null);
    ctx = cv.getContext('2d');
    var resize = function () {
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(clamp(W * H / 9000, 60, 220));
      stars = [];
      for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * .9 + .1, t: Math.random() * 6.28 });
    };
    resize();
    addEventListener('resize', resize);
  }

  /* --------------------------------------------- Scroll-Loop (rAF) */
  var bgImg = $('.page-bg__img'), veil = $('.page-bg__veil'), hero = $('.hero');
  var film = $('#welcomeFilm'), filmVideo = $('#welcomeFilmVideo');
  var thumbs = $$('.grid .card .thumb');
  var lastY = scrollY, vel = 0, ticking = false, lastFp = -1, drawnY = -1;

  function frame() {
    var y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? y / max : 0;
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';

    vel += ((y - lastY) - vel) * 0.18;
    lastY = y;

    if (!reduce && y !== drawnY) {
      drawnY = y;
      if (veil) veil.style.opacity = clamp(.85 + p * .35, 0, 1);
      // .page-bg__img transform gehört der CSS-Drift-Animation — hier nur filter
      if (bgImg) bgImg.style.filter = 'saturate(' + (1.12 + p * .4).toFixed(3) + ') contrast(1.06) hue-rotate(' + (p * 25).toFixed(1) + 'deg)';

      // Film liegt über dem Inhalt: Zoom/Blur nur auf dem Video (wird vom Film-Container geclippt)
      if (film) {
        var fh = film.offsetHeight || 1, fp = clamp(y / fh, 0, 1);
        if (fp !== lastFp) {
          lastFp = fp;
          film.style.opacity = (1 - fp * .9).toFixed(3);
          if (filmVideo) {
            filmVideo.style.transform = fp > 0 ? 'translateZ(0) scale(' + (1.002 + fp * .15).toFixed(4) + ')' : '';
            filmVideo.style.filter = fp > 0 ? 'blur(' + (fp * 6).toFixed(1) + 'px)' : '';
          }
        }
      }

      if (hero) {
        var hr = hero.getBoundingClientRect(), hp = clamp(-hr.top / (hr.height + 200), 0, 1);
        hero.style.transform = 'translate3d(0,' + (hp * -60).toFixed(1) + 'px,0)';
        hero.style.opacity = (1 - hp * .7).toFixed(3);
      }

      thumbs.forEach(function (t) {
        var r = t.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var c = (r.top + r.height / 2) / innerHeight;
        t.style.setProperty('--py', clamp(30 + c * 40, 0, 100).toFixed(1) + '%');
      });
    }

    if (!reduce) {
      // Sterne – ziehen Streifen bei schnellem Scrollen
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
        var warp = clamp(Math.abs(vel), 0, 80);
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          s.y -= vel * s.z * .35;
          s.t += .02;
          if (s.y < -20) s.y += H + 40; else if (s.y > H + 20) s.y -= H + 40;
          var a = (.35 + Math.sin(s.t) * .25) * s.z + warp / 260;
          ctx.strokeStyle = ctx.fillStyle = 'rgba(' + (200 + s.z * 55 | 0) + ',' + (190 + s.z * 40 | 0) + ',255,' + clamp(a, 0, 1).toFixed(3) + ')';
          if (warp > 2) {
            ctx.lineWidth = s.z * 1.4; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y + clamp(vel, -60, 60) * s.z * .7); ctx.stroke();
          } else {
            ctx.beginPath(); ctx.arc(s.x, s.y, s.z * 1.3, 0, 6.283); ctx.fill();
          }
        }
      }
    }
    if (Math.abs(vel) > .05 || ctx) requestAnimationFrame(frame); else ticking = false;
  }
  ticking = true;
  requestAnimationFrame(frame);
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
})();
