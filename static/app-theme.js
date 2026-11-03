/* Landing-page aesthetic for the E-Math app pages. Pure styling: it tags
   existing elements by how they look and restyles them with CSS. */
(function appTheme() {
  var path = (location.pathname || "/").replace(/\/+$/, "") || "/";
  if (!/^\/(dashboard|notes|topics|practice|analytics|account)(\/|$)/.test(path)) return;

  var INK = "#0a0a0a";
  var css =
    "html.bl-app,html.bl-app body{background:#fff!important}" +
    "html.bl-app body{font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;color:" + INK + "}" +
    "html.bl-app ::selection{background:rgba(59,130,246,.18)}" +
    /* layout */
    "html.bl-app [data-bl=main]{background:#fff!important}" +
    "html.bl-app [data-bl=side]{background:#fff!important;border-right:1px solid rgba(0,0,0,.06)!important;position:sticky;top:0;align-self:flex-start;max-height:100vh;overflow-y:auto}" +
    "html.bl-app [data-bl=topbar]{background:rgba(255,255,255,.86)!important;border-bottom:1px solid rgba(0,0,0,.06)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}" +
    "html.bl-app [data-bl=topbar] h1{font:600 clamp(22px,2.2vw,28px)/1.1 Inter,sans-serif!important;letter-spacing:-.045em!important;color:" + INK + "!important}" +
    "html.bl-app [data-bl=topbar] p{color:#6b6b6b!important;font-size:14px!important}" +
    /* type */
    "html.bl-app h1,html.bl-app h2,html.bl-app h3,html.bl-app h4{letter-spacing:-.035em;color:" + INK + "}" +
    "html.bl-app h2{font-weight:600!important}" +
    "html.bl-app h3,html.bl-app h4{font-weight:600!important}" +
    "html.bl-app [data-bl=hero]{font:600 clamp(28px,3vw,38px)/1.08 Inter,sans-serif!important;letter-spacing:-.05em!important;color:" + INK + "!important}" +
    "html.bl-app [data-bl=hero] em{font-family:'Source Serif 4',Georgia,serif;font-style:italic;font-weight:600;letter-spacing:-.05em;color:" + INK + "}" +
    "html.bl-app [data-bl=stat]{font-weight:600!important;letter-spacing:-.045em!important;line-height:1.05!important}" +
    "html.bl-app [data-bl=stat].ink{color:" + INK + "!important}" +
    "html.bl-app [data-bl=label]{color:#94a3b8!important;font:600 11px/1.4 Inter,sans-serif!important;letter-spacing:.08em!important;text-transform:uppercase}" +
    "html.bl-app [data-bl=muted]{color:#6b6b6b!important}" +
    /* sidebar */
    "html.bl-app [data-bl=navlink]{border-radius:12px!important;background:transparent!important;transition:background .18s ease,color .18s ease}" +
    "html.bl-app [data-bl=navlink],html.bl-app [data-bl=navlink] *{color:#6b6b6b!important;font-weight:500!important}" +
    "html.bl-app [data-bl=navlink]:hover{background:#f4f4f5!important}" +
    "html.bl-app [data-bl=navlink]:hover,html.bl-app [data-bl=navlink]:hover *{color:" + INK + "!important}" +
    "html.bl-app [data-bl=navlink].is-active{background:rgba(59,130,246,.10)!important}" +
    "html.bl-app [data-bl=navlink].is-active,html.bl-app [data-bl=navlink].is-active *{color:#2f62fd!important;font-weight:600!important}" +
    "html.bl-app [data-bl=navlink].is-active svg *{stroke:#2f62fd}" +
    "html.bl-app [data-bl=tabbar]{background:rgba(255,255,255,.92)!important;border-top:1px solid rgba(0,0,0,.06)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 -8px 24px rgba(0,0,0,.04)}" +
    "html.bl-app [data-bl=tab]{border-radius:10px!important;background:transparent!important}" +
    "html.bl-app [data-bl=tab],html.bl-app [data-bl=tab] *{color:#6b6b6b!important;font-weight:500!important}" +
    "html.bl-app [data-bl=tab].is-active{background:rgba(59,130,246,.10)!important}" +
    "html.bl-app [data-bl=tab].is-active,html.bl-app [data-bl=tab].is-active *{color:#2f62fd!important;font-weight:600!important}" +
    "html.bl-app [data-bl=profile]{border-radius:14px!important;border:1px solid rgba(0,0,0,.08)!important;background:#fff!important;color:" + INK + "!important;font-weight:500!important;box-shadow:0 4px 16px rgba(0,0,0,.03)}" +
    "html.bl-app [data-bl=profile]:hover{border-color:rgba(0,0,0,.2)!important}" +
    /* cards */
    "html.bl-app [data-bl=card]{background:#fff!important;border:1px solid rgba(0,0,0,.08)!important;border-radius:20px!important;box-shadow:0 8px 32px rgba(0,0,0,.04)!important}" +
    "html.bl-app a[data-bl=card]{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}" +
    "html.bl-app a[data-bl=card]:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(0,0,0,.08)!important;border-color:rgba(0,0,0,.14)!important}" +
    "html.bl-app [data-bl=sub]{border-radius:14px!important}" +
    "html.bl-app [data-bl=sub]:not(.pointer){background:#fafafa!important;border:1px solid rgba(0,0,0,.06)!important}" +
    "html.bl-app .bl-shell{overflow:clip!important}" +
    "html.bl-app [data-bl=sub].heavy{background:#f6f7f9!important;border:1px solid rgba(0,0,0,.06)!important}" +
    "html.bl-app [data-bl=sub].pointer{transition:border-color .18s ease,background .18s ease,transform .18s ease,box-shadow .18s ease}" +
    "html.bl-app [data-bl=sub].pointer:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.06)}" +
    "html.bl-app [data-bl=icon]{border-radius:12px!important;border:1px solid rgba(0,0,0,.06)!important;background:#fafafa!important}" +
    "html.bl-app [data-bl=tint]{border-radius:12px!important;border-color:transparent!important}" +
    /* buttons */
    "html.bl-app [data-bl=btn],html.bl-app [data-bl=ghost]{border-radius:9999px!important;box-shadow:none!important;font-weight:600!important;letter-spacing:-.01em;transition:transform .2s ease,box-shadow .2s ease}" +
    "html.bl-probe [data-bl]{transition:none!important}" +
    "html.bl-app:not(.bl-probe) [data-bl=btn]{background:" + INK + "!important;border:1px solid " + INK + "!important}" +
    "html.bl-app:not(.bl-probe) [data-bl=btn],html.bl-app:not(.bl-probe) [data-bl=btn] *{color:#fff!important}" +
    "html.bl-app:not(.bl-probe) [data-bl=btn]:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(10,10,10,.18)!important}" +
    "html.bl-app [data-bl=btn].wide{padding-left:20px!important;padding-right:20px!important}" +
    "html.bl-app:not(.bl-probe) [data-bl=ghost]{background:#fff!important;border:1px solid rgba(0,0,0,.1)!important}" +
    "html.bl-app:not(.bl-probe) [data-bl=ghost],html.bl-app:not(.bl-probe) [data-bl=ghost] *{color:" + INK + "!important}" +
    "html.bl-app:not(.bl-probe) [data-bl=ghost]:hover{border-color:rgba(0,0,0,.28)!important;background:#fafafa!important}" +
    "html.bl-app:not(.bl-probe) [data-bl=ghost].sel{background:rgba(59,130,246,.10)!important;border-color:rgba(59,130,246,.35)!important}" +
    "html.bl-app:not(.bl-probe) [data-bl=ghost].sel,html.bl-app:not(.bl-probe) [data-bl=ghost].sel *{color:#2f62fd!important}" +
    "html.bl-app [data-bl=chip]{border-radius:9999px!important;border-color:rgba(0,0,0,.08)!important;background:#fafafa!important}" +
    "html.bl-app [data-bl=chip],html.bl-app [data-bl=chip] *{color:#6b6b6b!important}" +
    "html.bl-app [data-bl=bluechip]{border-radius:9999px!important;background:rgba(59,130,246,.08)!important;border:1px solid rgba(59,130,246,.18)!important}" +
    /* inputs */
    "html.bl-app [data-bl=input]{border-radius:12px!important;border:1px solid rgba(0,0,0,.08)!important;background:#fbfbfb!important;color:" + INK + "!important;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}" +
    "html.bl-app [data-bl=input]:focus{outline:none!important;border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,.16)!important;background:#fff!important}" +
    /* links */
    "html.bl-app a:not([data-bl]) span,html.bl-app a:not([data-bl]){text-decoration:none}" +
    "html.bl-app [data-bl=glow]{position:fixed;pointer-events:none;border-radius:50%;z-index:0}" +
    "html.bl-app [data-bl=glow].a{width:560px;height:560px;right:-200px;top:-200px;background:rgba(59,130,246,.10);filter:blur(100px)}" +
    "html.bl-app [data-bl=glow].b{width:520px;height:520px;left:18%;bottom:-260px;background:rgba(6,182,212,.08);filter:blur(110px)}" +
    "html.bl-app #app{position:relative;z-index:1}" +
    "a.bridging-he-side{border-radius:14px!important}";

  document.documentElement.classList.add("bl-app");
  var style = document.createElement("style");
  style.id = "bl-app-theme";
  style.textContent = css;
  document.head.appendChild(style);

  if (!document.querySelector('link[href*="Source+Serif+4"]')) {
    var font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@1,600&display=swap";
    document.head.appendChild(font);
  }
  ["a", "b"].forEach(function (k) {
    var g = document.createElement("div");
    g.setAttribute("data-bl", "glow");
    g.className = k;
    g.setAttribute("aria-hidden", "true");
    document.body.appendChild(g);
  });

  var APP_ROUTES = { "/dashboard": 1, "/practice": 1, "/notes": 1, "/topics": 1, "/account": 1, "/analytics": 1, "/admin": 1 };
  var WHITE = "rgb(255, 255, 255)";
  var SLATE50 = "rgb(248, 250, 252)";
  var BLUES = { "rgb(59, 130, 246)": 1, "rgb(47, 98, 253)": 1, "rgb(37, 99, 235)": 1 };
  var GREYS = { "rgb(107, 107, 107)": 1, "rgb(15, 23, 42)": 1, "rgb(10, 10, 10)": 1, "rgb(0, 0, 0)": 1, "rgb(30, 41, 59)": 1 };

  function hrefPath(a) {
    try { return new URL(a.getAttribute("href") || "", location.origin).pathname.replace(/\/+$/, "") || "/"; }
    catch (e) { return ""; }
  }
  function isPill(cs, r) {
    var br = parseFloat(cs.borderTopLeftRadius);
    return br >= 100 || br >= r.height / 2 - 1;
  }
  function textLen(el) { return (el.textContent || "").trim().length; }
  function clickable(el, cs) {
    return el.tagName === "A" || el.tagName === "BUTTON" || cs.cursor === "pointer";
  }

  function classify(el) {
    var tag = el.tagName;
    if (tag === "SVG" || tag === "PATH" || tag === "IMG" || tag === "CANVAS" || tag === "SCRIPT" || tag === "STYLE") return "x";
    var r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return null;
    var cs = getComputedStyle(el);
    var bg = cs.backgroundColor;
    var bd = parseFloat(cs.borderTopWidth) > 0;
    var shadow = cs.boxShadow !== "none";
    var radius = parseFloat(cs.borderTopLeftRadius) || 0;
    var fs = parseFloat(cs.fontSize) || 0;

    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      return el.type === "checkbox" || el.type === "radio" || el.type === "range" ? "x" : "input";
    }

    /* Sidebar, top bar, main column. */
    if (tag === "DIV" && bg === WHITE && r.x < 4 && r.width > 150 && r.width < 340 && r.height > 400) {
      return "side";
    }
    if (tag === "DIV" && !bd && !shadow && radius === 0 && r.width >= 300 && r.height > 400 &&
        (bg === SLATE50 || (bg === WHITE && r.x > 150 && r.width > 600))) {
      return "main";
    }
    if (tag === "DIV" && bg === WHITE && !shadow && radius === 0 && r.width >= 300 && r.height < 170 && r.y < 60 && (r.x > 150 || r.width < 600) && el.querySelector("h1")) {
      return "topbar";
    }
    if (tag === "DIV" && bg === WHITE && cs.position === "fixed" && r.width >= 300 && r.height < 90 && r.y > 400 && el.querySelectorAll("a").length >= 3) {
      return "tabbar";
    }
    if (tag === "A" && el.closest("[data-bl=tabbar]")) return "tab";

    /* Buttons and chips. */
    var inSide = !!el.closest("[data-bl=side]");
    if (inSide && tag === "A" && r.height >= 32 && r.height <= 48 && r.width > 100) {
      return "navlink";
    }
    if (inSide && tag === "A" && bd && r.height > 48) return "profile";
    if (inSide && tag === "DIV" && fs <= 12 && textLen(el) <= 12 && el.children.length === 0 && /^[A-Z ]+$/.test((el.textContent || "").trim())) {
      return "label";
    }

    if (BLUES[bg] && (clickable(el, cs) || tag === "P" || tag === "SPAN") && r.height >= 24 && r.height <= 60 && r.width <= 420 && textLen(el) > 0 && textLen(el) <= 40) {
      return "btn";
    }
    if (clickable(el, cs) && (tag === "A" || tag === "BUTTON" || tag === "P" || tag === "SPAN") && r.height >= 26 && r.height <= 56 && r.width <= 420 &&
        textLen(el) > 0 && textLen(el) <= 40 && el.children.length <= 2 && (bd || bg === WHITE || bg === SLATE50 || isPill(cs, r)) &&
        !el.closest("[data-bl=side]") && !el.querySelector("h1,h2,h3,h4,p+p")) {
      return "ghost";
    }
    if ((tag === "DIV" || tag === "SPAN" || tag === "P") && bd && !clickable(el, cs) && r.height >= 24 && r.height <= 40 && r.width <= 260 && textLen(el) > 0 && textLen(el) <= 40 && el.children.length <= 1) {
      return bg.indexOf("59, 130, 246") >= 0 || bg.indexOf("47, 98, 253") >= 0 ? "bluechip" : "chip";
    }
    if ((tag === "DIV") && bd && isPill(cs, r) && r.height >= 26 && r.height <= 40 && r.width <= 320 && el.children.length >= 2 && textLen(el) <= 50 && bg.indexOf("59, 130, 246") >= 0) {
      return "bluechip";
    }

    /* Cards and sub-panels. */
    if ((tag === "DIV" || tag === "A" || tag === "SECTION" || tag === "ARTICLE" || tag === "FORM") && bg === WHITE && (bd || shadow) && radius >= 8) {
      if (r.width <= 56 && r.height <= 56) return "icon";
      if (r.width >= 150 && r.height >= 56) return "card";
    }
    if ((tag === "DIV" || tag === "A" || tag === "LABEL") && (bg === SLATE50 || bg === "rgb(226, 232, 240)") && radius >= 6 && r.width >= 100 && r.height >= 36 && textLen(el) > 0) {
      return "sub";
    }
    if (tag === "DIV" && bd && radius >= 4 && r.width >= 100 && r.height >= 40 && /rgba\((248, 113, 113|251, 191, 36|52, 211, 153|96, 165, 250|59, 130, 246|5, 150, 105|217, 119, 6|220, 38, 38)/.test(bg)) {
      return "tint";
    }

    /* Text roles. */
    if (tag === "H2" && fs >= 30 && !el.closest("[data-bl=topbar]") && !el.closest("[data-bl=card]")) return "hero";
    if ((tag === "P" || tag === "H2" || tag === "H3" || tag === "H4" || tag === "SPAN") && fs >= 22 && el.children.length === 0 && textLen(el) <= 24 && !el.closest("[data-bl=topbar]")) {
      return "stat";
    }
    if (tag === "P" && (cs.color === "rgb(100, 116, 139)" || cs.color === "rgb(107, 107, 107)") && fs <= 16) return "muted";
    return "x";
  }

  function decorate(el, kind) {
    el.setAttribute("data-bl", kind);
    if (kind === "side" && el.parentElement) {
      el.parentElement.classList.add("bl-shell");
    } else if (kind === "sub" && getComputedStyle(el).backgroundColor === "rgb(226, 232, 240)") {
      el.classList.add("heavy");
    }
    if (kind === "stat") {
      var c = getComputedStyle(el).color;
      if (GREYS[c]) el.classList.add("ink");
    } else if (kind === "btn") {
      if (el.getBoundingClientRect().height >= 36) el.classList.add("wide");
    } else if (kind === "sub" && (el.tagName === "A" || getComputedStyle(el).cursor === "pointer")) {
      el.classList.add("pointer");
    } else if (kind === "hero") {
      accentGreeting(el);
    }
  }

  function accentGreeting(el) {
    if (el.querySelector("em")) return;
    var t = (el.textContent || "").trim();
    var m = /^(Good (?:morning|afternoon|evening)),\s*(.+?)(!?)$/.exec(t);
    if (!m) return;
    el.textContent = "";
    el.appendChild(document.createTextNode(m[1] + ", "));
    var em = document.createElement("em");
    em.textContent = m[2];
    el.appendChild(em);
    if (m[3]) el.appendChild(document.createTextNode(m[3]));
  }

  /* Buttons toggle between filled and outlined as the app changes state.
     Briefly lift the overrides to read the app's own colours, then re-tag. */
  function probe() {
    var els = document.querySelectorAll("[data-bl=btn],[data-bl=ghost]");
    if (!els.length) return;
    var root = document.documentElement;
    root.classList.add("bl-probe");
    var bgs = [];
    for (var i = 0; i < els.length; i++) bgs.push(getComputedStyle(els[i]).backgroundColor);
    root.classList.remove("bl-probe");
    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      var bg = bgs[j];
      if (BLUES[bg]) {
        if (el.getAttribute("data-bl") !== "btn") el.setAttribute("data-bl", "btn");
        el.classList.remove("sel");
      } else {
        if (el.getAttribute("data-bl") !== "ghost") el.setAttribute("data-bl", "ghost");
        el.classList.toggle("sel", /^rgba\((59, 130, 246|47, 98, 253|37, 99, 235), 0?\.\d+\)$/.test(bg));
      }
    }
  }

  function paintNav() {
    document.querySelectorAll("[data-bl=navlink],[data-bl=tab]").forEach(function (a) {
      var p = hrefPath(a);
      var active = p && (p === path || (p !== "/" && path.indexOf(p + "/") === 0));
      a.classList.toggle("is-active", !!active);
    });
  }

  function fixTitle() {
    if (path !== "/analytics") return;
    document.querySelectorAll("[data-bl=topbar] h1").forEach(function (h) {
      if (/^dashboard$/i.test((h.textContent || "").trim())) h.textContent = "Analytics";
    });
  }

  var queued = false;
  function scan() {
    queued = false;
    var app = document.getElementById("app");
    if (!app) return;
    /* Layout first so children can test their ancestors. */
    var order = ["side", "main", "topbar", "tabbar"];
    var nodes = app.querySelectorAll("*:not([data-bl])");
    var pending = [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var kind = classify(el);
      if (kind === null) continue;
      if (order.indexOf(kind) >= 0) decorate(el, kind);
      else pending.push([el, kind]);
    }
    for (var j = 0; j < pending.length; j++) {
      var el2 = pending[j][0];
      if (el2.hasAttribute("data-bl")) continue;
      /* Re-run for things whose answer depends on the sidebar being tagged. */
      var k = pending[j][1];
      if ((el2.closest("[data-bl=side]") && k !== "navlink" && k !== "profile" && k !== "label") ||
          (el2.closest("[data-bl=tabbar]") && k !== "tab")) {
        var again = classify(el2);
        if (again) k = again;
      }
      decorate(el2, k);
    }
    probe();
    paintNav();
    fixTitle();
  }
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(scan, 120);
  }

  schedule();
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
  document.addEventListener("click", function () { setTimeout(schedule, 60); }, true);
  window.addEventListener("resize", function () {
    document.querySelectorAll('[data-bl="side"],[data-bl="main"],[data-bl="topbar"],[data-bl="tabbar"],[data-bl="tab"],[data-bl="navlink"]').forEach(function (el) {
      el.removeAttribute("data-bl");
    });
    schedule();
  });
})();
