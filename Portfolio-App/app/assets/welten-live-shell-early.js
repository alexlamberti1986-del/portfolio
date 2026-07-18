(function () {
  var isTop = false;
  try {
    isTop = window.parent === window;
  } catch (eTop) {
    isTop = false;
  }

  try {
    if (isTop) {
      document.documentElement.classList.add("welten-standalone");
    } else {
      document.documentElement.classList.add("welten-live-shell", "mv-in-shell");
    }
  } catch (eClass) {}

  /* FOUC: Header standardmässig aus, nur standalone sichtbar */
  try {
    if (!document.getElementById("welten-shell-header-fouc")) {
      var st = document.createElement("style");
      st.id = "welten-shell-header-fouc";
      st.textContent =
        "html:not(.welten-standalone) .site-header," +
        "html:not(.welten-standalone) .welten-skip-link," +
        "html:not(.welten-standalone) body > .mv4-bar," +
        "html:not(.welten-standalone) body > .mv4-global-header," +
        "html:not(.welten-standalone) .mv4-shell-chrome," +
        "html:not(.welten-standalone) #mv4ShellChrome{" +
        "display:none!important;visibility:hidden!important;opacity:0!important;" +
        "height:0!important;min-height:0!important;overflow:hidden!important;" +
        "pointer-events:none!important;margin:0!important;padding:0!important;" +
        "position:absolute!important;left:-9999px!important;width:1px!important}" ;
      (document.head || document.documentElement).appendChild(st);
    }
  } catch (eStyle) {}

  if (isTop) return;

  function applyParentViewportClasses(w, h) {
    try {
      var root = document.documentElement;
      if (w >= 1025 && h >= 640) root.classList.add("welten-parent-desktop");
      else root.classList.remove("welten-parent-desktop");
      if (w >= 1920) root.classList.add("welten-parent-xl");
      else root.classList.remove("welten-parent-xl");
    } catch (eVp) {}
  }

  function syncParentViewport() {
    try {
      var pw = window.parent.innerWidth || 0;
      var ph = window.parent.innerHeight || 0;
      if (pw > 0 && ph > 0) applyParentViewportClasses(pw, ph);
    } catch (eSync) {}
  }

  syncParentViewport();
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "mv-parent-viewport") return;
    applyParentViewportClasses(e.data.width || 0, e.data.height || 0);
  });
  try {
    window.parent.addEventListener("resize", syncParentViewport);
  } catch (eResize) {}

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
      document.querySelectorAll(".site-header").forEach(function (el) {
        found = true;
        hideEl(el);
      });
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
