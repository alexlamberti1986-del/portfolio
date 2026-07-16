(function () {
  if (window.parent === window) return;
  try {
    document.documentElement.classList.add("welten-live-shell", "mv-in-shell");
  } catch (e) {}
  try {
    var hdr = document.querySelector(".site-header");
    if (hdr) hdr.setAttribute("hidden", "");
    var skip = document.querySelector(".welten-skip-link");
    if (skip) skip.setAttribute("hidden", "");
  } catch (e2) {}
})();
