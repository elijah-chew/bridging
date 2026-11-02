/* Shared Bridging account on Higher Education pages: sign in/up, saved schools/courses. */
(function heAuth() {
  var HE_PATHS = ["/higher-education", "/l1r5-calculator", "/cut-off-points"];
  var path = (location.pathname || "/").replace(/\/+$/, "") || "/";
  if (HE_PATHS.indexOf(path) < 0) return;

  var FLAG = "data-he-auth-ready";
  var session = null;
  var saves = [];

  function itemKey(item) {
    return [item.itemType || item.item_type, item.kind || "", item.institution || "", item.course || "", item.code || ""].join("|");
  }

  function api(method, body, query) {
    var url = "/api/account/saves" + (query || "");
    return fetch(url, {
      method: method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) { return r.json().catch(function () { return {}; }); });
  }

  function loadSession() {
    return fetch("/api/auth/get-session", { credentials: "include" })
      .then(function (r) { return r.json(); })
      .then(function (payload) {
        if (payload && payload.user && (payload.user.id || payload.user.email)) {
          session = payload;
          return true;
        }
        session = null;
        return false;
      })
      .catch(function () { session = null; return false; });
  }

  function loadSaves() {
    if (!session) { saves = []; return Promise.resolve([]); }
    return api("GET").then(function (res) {
      saves = Array.isArray(res.items) ? res.items : [];
      return saves;
    }).catch(function () { saves = []; return saves; });
  }

  function isSaved(item) {
    var k = itemKey(item);
    return saves.some(function (s) { return (s.item_key || itemKey(s)) === k; });
  }

  function paintNav() {
    var host = document.querySelector(".nav-auth");
    if (!host) return;
    var next = encodeURIComponent(location.pathname + location.search);
    if (session) {
      host.innerHTML =
        '<a class="nav-cta ghost" href="/dashboard">E-Math dashboard</a>' +
        '<a class="nav-cta" href="/higher-education#he-saved">Saved</a>';
    } else {
      host.innerHTML =
        '<a class="nav-cta ghost" href="/login?redirect=' + next + '">Sign in</a>' +
        '<a class="nav-cta" href="/signup?redirect=' + next + '">Sign up</a>';
    }
  }

  function paintSavedPanel() {
    var mount = document.getElementById("he-saved");
    var list = document.getElementById("he-saved-list");
    if (!mount || !list) return;
    mount.hidden = false;
    if (!session) {
      list.innerHTML =
        '<p class="lede" style="margin:0">Sign in with the same Bridging account you use for E-Math to save schools and courses, then open them again here.</p>' +
        '<p style="margin:16px 0 0"><a class="btn" href="/login?redirect=/higher-education">Sign in to save</a></p>';
      return;
    }
    if (!saves.length) {
      list.innerHTML = '<p class="lede" style="margin:0">Nothing saved yet. Open cut-off points and tap Save on a school or course.</p>';
      return;
    }
    var schools = saves.filter(function (s) { return (s.item_type || s.itemType) === "school"; });
    var courses = saves.filter(function (s) { return (s.item_type || s.itemType) === "course"; });
    function row(s, label) {
      var href = "/cut-off-points?q=" + encodeURIComponent(s.course || s.institution || "");
      return '<a class="saved-row" href="' + href + '"><span class="overline">' + label + '</span><strong>' +
        (s.course || s.institution) + '</strong><span class="meta">' + (s.institution && s.course ? s.institution : (s.kind || "")) +
        (s.code ? " · " + s.code : "") + '</span></a>';
    }
    list.innerHTML = '<div class="saved-grid">' +
      (schools.length ? '<div class="saved-col"><h3>Schools</h3>' + schools.map(function (s) { return row(s, s.kind || "School"); }).join("") + "</div>" : "") +
      (courses.length ? '<div class="saved-col"><h3>Courses</h3>' + courses.map(function (s) { return row(s, s.kind || "Course"); }).join("") + "</div>" : "") +
      "</div>";
  }

  function paintButtons() {
    document.querySelectorAll("[data-he-save]").forEach(function (btn) {
      var item = {
        itemType: btn.getAttribute("data-he-save"),
        kind: btn.getAttribute("data-kind") || "",
        institution: btn.getAttribute("data-institution") || "",
        course: btn.getAttribute("data-course") || "",
        code: btn.getAttribute("data-code") || ""
      };
      var on = isSaved(item);
      btn.classList.toggle("is-saved", on);
      btn.textContent = on ? "Saved" : "Save";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function toggle(item, btn) {
    if (!session) {
      location.href = "/login?redirect=" + encodeURIComponent(location.pathname + location.search);
      return;
    }
    var on = isSaved(item);
    btn.disabled = true;
    api("POST", { op: on ? "remove" : "add", itemType: item.itemType, kind: item.kind, institution: item.institution, course: item.course, code: item.code })
      .then(function () { return loadSaves(); })
      .then(function () { paintButtons(); paintSavedPanel(); })
      .finally(function () { btn.disabled = false; });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-he-save]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    toggle({
      itemType: btn.getAttribute("data-he-save"),
      kind: btn.getAttribute("data-kind") || "",
      institution: btn.getAttribute("data-institution") || "",
      course: btn.getAttribute("data-course") || "",
      code: btn.getAttribute("data-code") || ""
    }, btn);
  });

  window.bridgingHeSaves = {
    isSaved: isSaved,
    itemKey: itemKey,
    refresh: function () { return loadSaves().then(function () { paintButtons(); paintSavedPanel(); }); }
  };

  if (document.documentElement.getAttribute(FLAG)) return;
  document.documentElement.setAttribute(FLAG, "1");

  loadSession().then(function () {
    paintNav();
    return loadSaves();
  }).then(function () {
    paintSavedPanel();
    paintButtons();
  });
})();
