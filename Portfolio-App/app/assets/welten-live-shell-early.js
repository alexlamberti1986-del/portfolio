(function () {
  if (window.parent === window) return;
  try {
    document.documentElement.classList.add("welten-live-shell", "mv-in-shell");
  } catch (e) {}

  function stripIframeChrome() {
    try {
      document.querySelectorAll(".site-header, .welten-skip-link, body > .mv4-bar, body > .mv4-global-header").forEach(function (el) {
        try {
          el.remove();
        } catch (eRem) {
          el.setAttribute("hidden", "");
          el.style.cssText =
            "display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;pointer-events:none!important";
        }
      });
    } catch (e2) {}
  }

  stripIframeChrome();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", stripIframeChrome, { once: true });
  }
  window.addEventListener("load", stripIframeChrome, { once: true });
  try {
    new MutationObserver(stripIframeChrome).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  } catch (eObs) {}
})();
