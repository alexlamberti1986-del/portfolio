window.PORTFOLIO_INLINE_IMAGES = {
  nexora: "assets/images/world-nexora.webp",
  vertex: "assets/images/world-vertex.webp",
  freiraum: "assets/images/world-freiraum.webp",
};

/** Responsive Varianten — Mobile kleiner, Desktop schärfer */
window.PORTFOLIO_IMAGE_SRCSET = {
  nexora:
    "assets/images/world-nexora-800.webp 800w, assets/images/world-nexora.webp 1400w",
  vertex: "assets/images/world-vertex.webp 800w",
  freiraum:
    "assets/images/world-freiraum-800.webp 800w, assets/images/world-freiraum.webp 1400w",
};

window.PORTFOLIO_IMAGE_SIZES = "(max-width: 768px) 88vw, (max-width: 1200px) 42vw, 400px";

(function () {
  var r = document.documentElement;
  var m = window.PORTFOLIO_INLINE_IMAGES;
  r.style.setProperty("--portfolio-img-nexora", 'url("' + m.nexora + '")');
  r.style.setProperty("--portfolio-img-vertex", 'url("' + m.vertex + '")');
  r.style.setProperty("--portfolio-img-freiraum", 'url("' + m.freiraum + '")');
})();
