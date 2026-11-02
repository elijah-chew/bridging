(function injectHigherEducationSnippet() {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;

  var FAQ_UID = "f9d9c27b-da5f-4e1d-b868-17a802ad6161";
  var ID = "bridging-he-snippet";

  var css =
    "#" + ID + "{position:relative;padding:96px 24px 104px;background:#fff;font-family:Inter,sans-serif;color:#0a0a0a;overflow:hidden}" +
    "#" + ID + " .he-glow{position:absolute;pointer-events:none;border-radius:50%;filter:blur(90px)}" +
    "#" + ID + " .he-glow.a{width:520px;height:520px;left:-200px;top:-120px;background:rgba(59,130,246,.14)}" +
    "#" + ID + " .he-glow.b{width:560px;height:560px;right:-220px;bottom:-200px;background:rgba(6,182,212,.11);filter:blur(120px)}" +
    "#" + ID + " .he-in{position:relative;max-width:1080px;margin:0 auto}" +
    "#" + ID + " .he-label{display:block;text-align:center;font:500 13px/18px Inter,sans-serif;letter-spacing:-.02em;text-transform:uppercase;color:#6b6b6b;margin:0 0 14px}" +
    "#" + ID + " h2{margin:0 auto;max-width:760px;text-align:center;font:600 clamp(30px,4.2vw,44px)/1.08 Inter,sans-serif;letter-spacing:-.06em;color:#0a0a0a}" +
    "#" + ID + " h2 em{font-family:'Source Serif 4',Georgia,serif;font-style:italic;font-weight:600}" +
    "#" + ID + " .he-sub{max-width:620px;margin:16px auto 0;text-align:center;font:400 17px/1.45 Inter,sans-serif;letter-spacing:-.02em;color:#6b6b6b}" +
    "#" + ID + " .he-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin:44px 0 0}" +
    "#" + ID + " .he-card{position:relative;display:flex;flex-direction:column;gap:12px;padding:28px 28px 26px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.04);text-decoration:none;color:inherit;overflow:hidden;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}" +
    "#" + ID + " .he-card:hover{transform:translateY(-3px);box-shadow:0 18px 48px rgba(15,23,42,.10);border-color:rgba(0,0,0,.12)}" +
    "#" + ID + " .he-card:after{content:'';position:absolute;right:-90px;top:-90px;width:220px;height:220px;border-radius:50%;background:rgba(59,130,246,.12);filter:blur(50px);opacity:0;transition:opacity .25s ease}" +
    "#" + ID + " .he-card.cyan:after{background:rgba(6,182,212,.14)}" +
    "#" + ID + " .he-card:hover:after{opacity:1}" +
    "#" + ID + " .he-pill{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;padding:5px 10px;border-radius:999px;background:#eff6ff;color:#2f62fd;font:500 12px/1 Inter,sans-serif;letter-spacing:-.01em}" +
    "#" + ID + " .he-card.cyan .he-pill{background:#ecfeff;color:#0891b2}" +
    "#" + ID + " .he-card h3{margin:4px 0 0;font:600 22px/1.2 Inter,sans-serif;letter-spacing:-.04em;color:#0a0a0a}" +
    "#" + ID + " .he-card p{margin:0;font:400 15px/1.5 Inter,sans-serif;letter-spacing:-.015em;color:#6b6b6b}" +
    "#" + ID + " .he-cta{margin-top:auto;padding-top:8px;font:600 14px/1 Inter,sans-serif;letter-spacing:-.02em;color:#0a0a0a}" +
    "#" + ID + " .he-cta span{display:inline-block;transition:transform .2s ease}" +
    "#" + ID + " .he-card:hover .he-cta span{transform:translateX(4px)}" +
    "#" + ID + " .he-all{display:flex;justify-content:center;margin-top:32px}" +
    "#" + ID + " .he-all a{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:999px;background:#0a0a0a;color:#fff;text-decoration:none;font:600 15px/1 Inter,sans-serif;letter-spacing:-.02em;transition:background .2s ease,transform .2s ease}" +
    "#" + ID + " .he-all a:hover{background:#2f62fd;transform:translateY(-1px)}" +
    "@media (max-width:760px){#" + ID + "{padding:72px 20px 80px}#" + ID + " .he-grid{grid-template-columns:1fr;gap:14px;margin-top:32px}#" + ID + " .he-card{padding:22px}}";

  function build() {
    var sec = document.createElement("section");
    sec.id = ID;
    sec.setAttribute("aria-labelledby", ID + "-title");
    sec.innerHTML =
      '<div class="he-glow a"></div><div class="he-glow b"></div>' +
      '<div class="he-in">' +
      '<span class="he-label">Higher Education</span>' +
      '<h2 id="' + ID + '-title">Know where your grades <em>can take you</em>.</h2>' +
      '<p class="he-sub">Free JAE tools for after O-Levels: work out your aggregate, then see how JCs, polytechnics, and ITE have actually posted over the last decade.</p>' +
      '<div class="he-grid">' +
      '<a class="he-card" href="/l1r5-calculator">' +
      '<span class="he-pill">Aggregate calculator</span>' +
      "<h3>L1R5/4 JC and Poly/ITE Aggregate Calculator</h3>" +
      "<p>Enter G3, G2 and G1 grades once. Get JC L1R5 and L1R4, polytechnic ELR2B2-A to D, and ITE aggregates including ELMAB3, with CCA and bonus points applied.</p>" +
      '<span class="he-cta">Open calculator <span>→</span></span>' +
      "</a>" +
      '<a class="he-card cyan" href="/cut-off-points">' +
      '<span class="he-pill">Cut-off history · 2014–2026</span>' +
      "<h3>JC, Polytechnic, and ITE Historical Cut off points</h3>" +
      "<p>Search by school or course and compare JAE net cut-offs year by year, grouped by institution, so you can see where your aggregate has landed before.</p>" +
      '<span class="he-cta">Explore cut-offs <span>→</span></span>' +
      "</a>" +
      "</div>" +
      '<div class="he-all"><a href="/higher-education">See the Higher Education hub <span aria-hidden="true">→</span></a></div>' +
      "</div>";
    return sec;
  }

  function mount() {
    if (document.getElementById(ID)) return true;
    var faq = document.querySelector('[data-section-uid="' + FAQ_UID + '"]');
    if (!faq) return false;
    var anchor = faq.previousElementSibling;
    if (!anchor || !anchor.classList.contains("placeholder-section")) anchor = faq;
    anchor.parentNode.insertBefore(build(), anchor);
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

  if (mount()) return;
  var obs = new MutationObserver(function () {
    if (mount()) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () {
    obs.disconnect();
  }, 20000);
})();
