(function () {
  if (window.parent === window) return;
  try {
    if (
      window.parent.document.body &&
      window.parent.document.body.getAttribute("data-live-shell") === "1"
    ) {
      document.documentElement.classList.add("welten-live-shell");
    }
  } catch (e) {
    document.documentElement.classList.add("welten-live-shell");
  }
})();
