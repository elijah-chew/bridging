(function themeHowItWorks() {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;

  var UID = "35fa4ab0-66a8-4da6-b8ff-6cdb71aed16b";
  var SEL = '[data-section-uid="' + UID + '"]';
  var FLAG = "data-bridging-hiw-themed";

  var css =
    SEL + "{position:relative;overflow:hidden}" +
    SEL + " .hiw-glow{position:absolute;pointer-events:none;border-radius:50%;z-index:0}" +
    SEL + " .hiw-glow.a{width:520px;height:520px;left:-220px;top:40px;background:rgba(59,130,246,.14);filter:blur(90px)}" +
    SEL + " .hiw-glow.b{width:600px;height:600px;right:-260px;top:38%;background:rgba(6,182,212,.11);filter:blur(120px)}" +
    SEL + " .hiw-glow.c{width:520px;height:520px;left:-200px;bottom:-160px;background:rgba(47,98,253,.10);filter:blur(110px)}" +
    SEL + " > *:not(.hiw-glow){position:relative;z-index:1}" +
    /* eyebrow pill, same as hero / Higher Education */
    SEL + " .hiw-eyebrow{display:inline-flex!important;align-items:center;gap:8px;padding:6px 14px!important;border-radius:9999px;background:#fbfbfb;border:1px solid rgba(0,0,0,.06);font:500 13px/18px Inter,sans-serif!important;letter-spacing:-.02em!important;text-transform:uppercase;color:#6b6b6b!important;margin-bottom:18px!important}" +
    SEL + " .hiw-eyebrow:before{content:'';width:6px;height:6px;border-radius:50%;background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}" +
    /* headline */
    SEL + " h2.hiw-title{font:600 clamp(32px,4.4vw,48px)/1.06 Inter,sans-serif!important;letter-spacing:-.06em!important;color:#0a0a0a!important}" +
    SEL + " h2.hiw-title .hiw-em{font-family:'Source Serif 4',Georgia,serif;font-style:italic;font-weight:600;letter-spacing:-.07em}" +
    /* step headings + copy */
    SEL + " h3{letter-spacing:-.045em!important}" +
    /* mock cards: match 20px radius + float shadow of the design system */
    SEL + " .hiw-card{border-radius:20px!important;box-shadow:0 8px 32px rgba(0,0,0,.04),0 1px 0 rgba(255,255,255,.6) inset!important;border:1px solid rgba(0,0,0,.08)!important;transition:transform .25s ease,box-shadow .25s ease}" +
    SEL + " .hiw-card:hover{transform:translateY(-3px);box-shadow:0 18px 48px rgba(15,23,42,.10)!important}" +
    "@media (max-width:760px){" + SEL + " .hiw-glow.b{display:none}}";

  function text(el) {
    return (el.textContent || "").replace(/\s+/g, " ").trim();
  }

  function apply(sec) {
    if (sec.getAttribute(FLAG)) return true;

    // Eyebrow
    var label = [].slice.call(sec.querySelectorAll("p, span")).filter(function (e) {
      return e.children.length === 0 && text(e).toUpperCase() === "HOW IT WORKS";
    })[0];
    if (label) label.classList.add("hiw-eyebrow");

    // Headline with serif accent
    var h2 = sec.querySelector("h2");
    if (h2 && !h2.querySelector(".hiw-em")) {
      h2.classList.add("hiw-title");
      var t = h2.textContent || "";
      var m = t.match(/^(.*?)(,?\s*)(in one loop)(\.?)\s*$/i);
      if (m) {
        h2.textContent = "";
        h2.appendChild(document.createTextNode(m[1] + m[2]));
        var em = document.createElement("span");
        em.className = "hiw-em";
        em.textContent = m[3];
        h2.appendChild(em);
        if (m[4]) h2.appendChild(document.createTextNode(m[4]));
      }
    }

    // Mock cards (white, bordered, 16px radius) -> design-system card
    [].slice.call(sec.querySelectorAll("div")).forEach(function (d) {
      var c = getComputedStyle(d);
      if (
        c.backgroundColor === "rgb(255, 255, 255)" &&
        c.borderRadius === "16px" &&
        c.borderTopWidth === "1px" &&
        d.getBoundingClientRect().width > 240
      ) {
        d.classList.add("hiw-card");
      }
    });

    // Ambient glows
    ["a", "b", "c"].forEach(function (k) {
      var g = document.createElement("div");
      g.className = "hiw-glow " + k;
      g.setAttribute("aria-hidden", "true");
      sec.insertBefore(g, sec.firstChild);
    });

    sec.setAttribute(FLAG, "1");
    return true;
  }

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  if (!document.querySelector('link[href*="Source+Serif+4"]')) {
    var font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@1,600&display=swap";
    document.head.appendChild(font);
  }

  function tryApply() {
    var sec = document.querySelector(SEL);
    if (!sec || !sec.querySelector("h2")) return false;
    return apply(sec);
  }

  if (tryApply()) return;
  var obs = new MutationObserver(function () {
    if (tryApply()) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () {
    obs.disconnect();
  }, 20000);
})();
