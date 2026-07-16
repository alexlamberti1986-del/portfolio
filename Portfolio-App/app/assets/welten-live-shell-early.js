(function () {
  if (window.parent === window) return;
  try {
    document.documentElement.classList.add("welten-live-shell", "mv-in-shell");
  } catch (e) {}

  var done = false;
  var timer = 0;
  var observer = null;

  function stripIframeChrome() {
    if (done) return;
    var found = false;
    try {
      document
        .querySelectorAll(".site-header, .welten-skip-link, body > .mv4-bar, body > .mv4-global-header")
        .forEach(function (el) {
          found = true;
          try {
            el.remove();
          } catch (eRem) {
            el.setAttribute("hidden", "");
            el.style.cssText =
              "display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;pointer-events:none!important";
          }
        });
    } catch (e2) {}
    /* Nach erstem erfolgreichen Strip: Observer stoppen (sonst Main-Thread-Freeze) */
    if (found || document.body) {
      var still = document.querySelector(".site-header, .welten-skip-link, body > .mv4-bar");
      if (!still) {
        done = true;
        if (observer) {
          try {
            observer.disconnect();
          } catch (eDisc) {}
          observer = null;
        }
      }
    }
  }

  function scheduleStrip() {
    if (done) return;
    if (timer) return;
    timer = window.setTimeout(function () {
      timer = 0;
      stripIframeChrome();
    }, 0);
  }

  stripIframeChrome();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", stripIframeChrome, { once: true });
  }
  window.addEventListener("load", stripIframeChrome, { once: true });
  try {
    observer = new MutationObserver(scheduleStrip);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch (eObs) {}
  /* Hard-Stop nach 3s — nie dauerhaft mutieren */
  window.setTimeout(function () {
    done = true;
    if (observer) {
      try {
        observer.disconnect();
      } catch (eStop) {}
      observer = null;
    }
    stripIframeChrome();
  }, 3000);
})();
