/**
 * Live-shell menu bridge: parent .mv4-menu-btn → iframe open/closeMenu
 */
(function () {
  "use strict";
  if (window.parent === window) return;
  if (window.__weltenShellMenuBridge) return;
  window.__weltenShellMenuBridge = true;

  function notifyParent(open) {
    try {
      window.parent.postMessage({ type: "portfolio-menu-state", open: !!open }, "*");
    } catch (e) {}
  }

  function isMenuOpen() {
    var menu = document.getElementById("mainMenu");
    if (!menu) return false;
    if (menu.classList.contains("open")) return true;
    return menu.hidden === false && menu.getAttribute("hidden") == null;
  }

  function openMenu() {
    var btn = document.getElementById("openMenu");
    if (btn) {
      btn.click();
      return;
    }
    var menu = document.getElementById("mainMenu");
    if (!menu) return;
    menu.hidden = false;
    menu.classList.add("open");
    document.body.style.overflow = "hidden";
    notifyParent(true);
  }

  function closeMenu() {
    var btn = document.getElementById("closeMenu");
    if (btn) {
      btn.click();
    }
    var menu = document.getElementById("mainMenu");
    if (menu) {
      menu.classList.remove("open");
      menu.hidden = true;
    }
    document.body.style.overflow = "";
    notifyParent(false);
  }

  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "portfolio-open-menu") openMenu();
    if (e.data.type === "portfolio-close-menu") closeMenu();
  });

  var menu = document.getElementById("mainMenu");
  if (menu && typeof MutationObserver !== "undefined") {
    var obs = new MutationObserver(function () {
      notifyParent(isMenuOpen());
    });
    obs.observe(menu, { attributes: true, attributeFilter: ["class", "hidden"] });
  }

  document.addEventListener(
    "click",
    function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest("#openMenu")) {
        setTimeout(function () {
          notifyParent(true);
        }, 0);
      }
      if (t.closest("#closeMenu")) {
        setTimeout(function () {
          notifyParent(false);
        }, 0);
      }
    },
    true
  );
})();
