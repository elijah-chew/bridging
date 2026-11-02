/* Restyle login / signup / forgot-password to the landing aesthetic. */
(function authTheme() {
  var path = (location.pathname || "/").replace(/\/+$/, "") || "/";
  if (path !== "/login" && path !== "/signup" && path !== "/forgot-password") return;

  var params = new URLSearchParams(location.search);
  var redirect = params.get("redirect");
  if (redirect && redirect.charAt(0) === "/") {
    try { sessionStorage.setItem("bridging_redirect", redirect); } catch (e) {}
  }

  var css =
    "html.bl-auth,html.bl-auth body{background:#fff!important;min-height:100%;}" +
    "html.bl-auth body{font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;}" +
    ".bl-auth-glow{position:fixed;pointer-events:none;border-radius:50%;z-index:0}" +
    ".bl-auth-glow.a{width:560px;height:560px;left:-180px;top:-160px;background:rgba(59,130,246,.16);filter:blur(90px)}" +
    ".bl-auth-glow.b{width:640px;height:640px;right:-240px;top:18%;background:rgba(6,182,212,.12);filter:blur(120px)}" +
    ".bl-auth-glow.c{width:520px;height:520px;left:-160px;bottom:-200px;background:rgba(47,98,253,.10);filter:blur(110px)}" +
    "html.bl-auth #app,.bl-auth [data-section-uid],.bl-auth .section-base{position:relative;z-index:1;background:transparent!important}" +
    "html.bl-auth h1,html.bl-auth h2{font:600 clamp(28px,4vw,40px)/1.08 Inter,sans-serif!important;letter-spacing:-.05em!important;color:#0a0a0a!important}" +
    "html.bl-auth h1 em,html.bl-auth h2 em{font-family:'Source Serif 4',Georgia,serif;font-style:italic;font-weight:600;letter-spacing:-.06em}" +
    "html.bl-auth p{color:#6b6b6b!important}" +
    "html.bl-auth input,html.bl-auth .ww-input-basic{border-radius:12px!important;border:1px solid rgba(0,0,0,.08)!important;background:#fbfbfb!important;font:400 15px/1.4 Inter,sans-serif!important;min-height:46px!important}" +
    "html.bl-auth input:focus,html.bl-auth .ww-input-basic:focus{outline:none!important;border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,.16)!important;background:#fff!important}" +
    "html.bl-auth button[type=submit],html.bl-auth button.ww-button{border-radius:9999px!important;background:#0a0a0a!important;color:#fff!important;font:600 15px/1 Inter,sans-serif!important;letter-spacing:-.01em!important;min-height:48px!important;border:0!important;box-shadow:none!important;transition:transform .2s ease,box-shadow .2s ease}" +
    "html.bl-auth button[type=submit]:hover,html.bl-auth button.ww-button:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(10,10,10,.18)!important}" +
    "html.bl-auth a{color:#3b82f6!important;font-weight:500}" +
    "html.bl-auth label{font:500 13px/1 Inter,sans-serif!important;color:#64748b!important;letter-spacing:-.01em!important}" +
    ".bl-auth-card-hit{border-radius:20px!important;border:1px solid rgba(0,0,0,.08)!important;box-shadow:0 8px 32px rgba(0,0,0,.04)!important;background:#fff!important}";

  document.documentElement.classList.add("bl-auth");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  if (!document.querySelector('link[href*="Source+Serif+4"]')) {
    var font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@1,600&display=swap";
    document.head.appendChild(font);
  }

  ["a", "b", "c"].forEach(function (k) {
    var g = document.createElement("div");
    g.className = "bl-auth-glow " + k;
    g.setAttribute("aria-hidden", "true");
    document.body.appendChild(g);
  });

  function accent(el, word) {
    if (!el || el.querySelector("em")) return;
    var t = (el.textContent || "").trim();
    var i = t.toLowerCase().lastIndexOf(word);
    if (i < 0) return;
    el.textContent = "";
    el.appendChild(document.createTextNode(t.slice(0, i)));
    var em = document.createElement("em");
    em.textContent = t.slice(i, i + word.length);
    el.appendChild(em);
    if (i + word.length < t.length) el.appendChild(document.createTextNode(t.slice(i + word.length)));
  }

  function polish() {
    var heads = document.querySelectorAll("h1, h2, p");
    heads.forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (/welcome back/i.test(t)) accent(el, "back");
      else if (/create an account/i.test(t)) accent(el, "account");
      else if (/forgot|reset/i.test(t) && el.tagName !== "A") accent(el, "password");
      if (/BRIDGING/.test(t) && el.children.length === 0) el.textContent = t.replace(/BRIDGING/g, "Bridging");
    });

    var btn = document.querySelector("button[type=submit], button.ww-button");
    if (btn) {
      var card = btn.parentElement;
      var best = null;
      var bestW = 0;
      for (var i = 0; i < 10 && card; i++) {
        var r = card.getBoundingClientRect();
        if (r.width > 280 && r.width < 560 && r.height > 320 && r.width >= bestW) {
          best = card;
          bestW = r.width;
        }
        card = card.parentElement;
      }
      document.querySelectorAll(".bl-auth-card-hit").forEach(function (el) {
        el.classList.remove("bl-auth-card-hit");
      });
      if (best) best.classList.add("bl-auth-card-hit");
    }
  }

  polish();
  var obs = new MutationObserver(function () { polish(); });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); polish(); }, 12000);
})();
