(function () {
  if (window.parent === window) return;
  try {
    document.documentElement.classList.add("welten-live-shell", "mv-in-shell");
  } catch (e) {}

  var done = false;
  var timer = 0;
  var observer = null;

  function hideEl(el) {
    if (!el) return;
    try {
      el.setAttribute("hidden", "");
      el.setAttribute("aria-hidden", "true");
      el.style.cssText =
        "display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important;margin:0!important;padding:0!important;position:absolute!important;left:-9999px!important";
    } catch (eHide) {}
  }

  function stripIframeChrome() {
    if (done) return;
    var found = false;
    try {
      /* site-header NUR verstecken — #openMenu muss für Scripts erhalten bleiben */
      document.querySelectorAll(".site-header").forEach(function (el) {
        found = true;
        hideEl(el);
      });
      /* Echte Shell-Duplikate / Skip-Link entfernen */
      document
        .querySelectorAll(
          ".welten-skip-link, body > .mv4-bar, body > .mv4-global-header, .mv4-shell-chrome, #mv4ShellChrome"
        )
        .forEach(function (el) {
          found = true;
          try {
            el.remove();
          } catch (eRem) {
            hideEl(el);
          }
        });
    } catch (e2) {}
    if (found || document.body) {
      var still = document.querySelector(
        "body > .mv4-bar, body > .mv4-global-header, .mv4-shell-chrome, #mv4ShellChrome"
      );
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
