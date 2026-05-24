/**
 * Lightweight world transitions — disabled (instant world switch)
 */
(function (global) {
  "use strict";

  function playWorldTransition() {
    return Promise.resolve();
  }

  global.playWorldTransition = playWorldTransition;
})(window);
