/* Pin a Higher Education link at the bottom of the E-Math sidebar. */
(function emathSidebar() {
  var app = /^\/(dashboard|practice|notes|topics|account|analytics|admin)(\/|$)/;
  if (!app.test(location.pathname)) return;

  try {
    var bounce = sessionStorage.getItem("bridging_redirect");
    if (bounce && bounce.charAt(0) === "/" && bounce.indexOf("//") === -1) {
      sessionStorage.removeItem("bridging_redirect");
      if (bounce !== location.pathname + location.search) {
        location.replace(bounce);
        return;
      }
    }
  } catch (e) {}

  var CSS_ID = "bridging-he-side-css";
  if (!document.getElementById(CSS_ID)) {
    var style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent =
      "a.bridging-he-side{display:flex;align-items:center;gap:8px;margin-top:12px;padding:10px 12px;border-radius:12px;border:1px solid rgba(0,0,0,.08);background:#fff;color:#0a0a0a;font:600 13px/1.2 Inter,sans-serif;letter-spacing:-.01em;text-decoration:none}" +
      "a.bridging-he-side:hover{border-color:#3b82f6;color:#2f62fd}" +
      "a.bridging-he-side small{display:block;font:500 11px/1.2 Inter,sans-serif;color:#94a3b8;font-weight:500;margin-top:3px}";
    document.head.appendChild(style);
  }

  function hrefOf(a) {
    try { return new URL(a.href, location.origin).pathname.replace(/\/+$/, "") || "/"; }
    catch (e) { return (a.getAttribute("href") || "").replace(/\/+$/, ""); }
  }

  function findSidebar() {
    var wanted = { "/dashboard": 1, "/practice": 1, "/notes": 1, "/topics": 1, "/account": 1 };
    var links = [].slice.call(document.querySelectorAll("a[href]")).filter(function (a) {
      return wanted[hrefOf(a)];
    });
    if (links.length < 3) return null;
    var node = links[0];
    while (node && node !== document.body) {
      var hits = 0;
      node.querySelectorAll("a[href]").forEach(function (a) {
        if (wanted[hrefOf(a)]) hits += 1;
      });
      var r = node.getBoundingClientRect();
      if (hits >= 3 && r.width > 80 && r.width < 360 && r.height > 180) return node;
      node = node.parentElement;
    }
    return null;
  }

  function inject() {
    if (document.querySelector("a.bridging-he-side")) return true;
    var side = findSidebar();
    if (!side) return false;
    var a = document.createElement("a");
    a.className = "bridging-he-side";
    a.href = "/higher-education";
    a.innerHTML = "Higher Education<small>Calculator and cut-offs</small>";
    side.appendChild(a);
    return true;
  }

  if (inject()) return;
  var obs = new MutationObserver(function () {
    if (inject()) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); inject(); }, 15000);
})();
