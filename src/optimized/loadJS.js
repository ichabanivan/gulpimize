(function(window, document, src) {
  "use strict";

  var elem = function(window) {

    if ("[object Array]" !== Object.prototype.toString.call(window)) return false;

    for (var object = 0; object < window.length; object++) {

      var elem = document.createElement("script"),
          script = window[object];

      elem.src = script.src;
      elem.async = script.async;

      document.body.appendChild(elem);
    }

    return true

  };

  window.addEventListener ? window.addEventListener("load", function() {
    elem(src.scripts)
  }, !1) : window.attachEvent ? window.attachEvent("onload", function() {
    elem(src.scripts)
  }) : window.onload = function() {
    elem(src.scripts)
  }

}(window, document, scr));