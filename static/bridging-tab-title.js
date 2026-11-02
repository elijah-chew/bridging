(function () {
  var TAB = 'Bridging';

  var SEO = /^\/(higher-education|l1r5-calculator|cut-off-points|about|elijah-chew)\/?$/;

  function apply() {
    if (SEO.test(location.pathname || "/")) return;
    if (document.title !== TAB) document.title = TAB;
  }

  apply();

  var titleEl = document.querySelector('title');
  if (titleEl) {
    new MutationObserver(apply).observe(titleEl, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  window.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', apply);
  window.addEventListener('pageshow', apply);

  var pushState = history.pushState;
  var replaceState = history.replaceState;
  history.pushState = function () {
    var r = pushState.apply(this, arguments);
    apply();
    return r;
  };
  history.replaceState = function () {
    var r = replaceState.apply(this, arguments);
    apply();
    return r;
  };
  window.addEventListener('popstate', apply);
})();
