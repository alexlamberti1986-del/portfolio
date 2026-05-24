window.PORTFOLIO_INLINE_IMAGES = {
  "nexora": "assets/images/world-nexora.png",
  "vertex": "assets/images/world-vertex.webp",
  "freiraum": "assets/images/world-freiraum.png"
};
(function () {
  var r = document.documentElement;
  var m = window.PORTFOLIO_INLINE_IMAGES;
  r.style.setProperty("--portfolio-img-nexora", 'url("' + m.nexora + '")');
  r.style.setProperty("--portfolio-img-vertex", 'url("' + m.vertex + '")');
  r.style.setProperty("--portfolio-img-freiraum", 'url("' + m.freiraum + '")');
})();
