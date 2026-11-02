(function () {
  var ADMIN_EMAIL = '3lijahzhou@gmail.com';
  var gated = /^\/(practice|notes|topics|dashboard|analytics|account|admin)(\/|$)/;
  var adminPath = /^\/admin(\/|$)/;
  var checking = false;

  if (adminPath.test(location.pathname)) {
    document.documentElement.classList.add('admin-pending');
    var lock = document.createElement('style');
    lock.id = 'bridging-admin-lock';
    lock.textContent = 'html.admin-pending body{visibility:hidden!important}';
    document.head.appendChild(lock);
  }

  function unlockAdmin() {
    document.documentElement.classList.remove('admin-pending');
    var lockEl = document.getElementById('bridging-admin-lock');
    if (lockEl) lockEl.remove();
  }

  function hasClientSessionHint() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i) || '';
        if (/better-auth|supabase|session_token|bridging/i.test(key) && localStorage.getItem(key)) return true;
      }
    } catch (e) {}
    return false;
  }

  function supabaseSessionEmail() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i) || '';
        if (!/^sb-.*-auth-token$/i.test(key)) continue;
        var raw = localStorage.getItem(key);
        if (!raw) continue;
        var data = JSON.parse(raw);
        var email = (data && data.user && data.user.email) || (data && data.currentSession && data.currentSession.user && data.currentSession.user.email);
        if (email) return String(email).trim().toLowerCase();
      }
    } catch (e) {}
    return '';
  }

  function sessionLooksValid(payload) {
    if (!payload) return false;
    if (payload.user && (payload.user.id || payload.user.email)) return true;
    if (payload.session && payload.session.userId) return true;
    return false;
  }

  function sessionEmail(payload) {
    var email = payload && payload.user && payload.user.email;
    return String(email || '').trim().toLowerCase();
  }

  function isAdminSession(payload) {
    if (sessionEmail(payload) === ADMIN_EMAIL) return true;
    if (supabaseSessionEmail() === ADMIN_EMAIL) return true;
    return false;
  }

  function removeFloatingBrix() {
    var byId = document.getElementById('bridging-brix');
    if (byId) byId.remove();
    var imgs = document.querySelectorAll('img[src*="/brand/brix.png"], img[src*="brix.png"]');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var style = window.getComputedStyle(img);
      if (style.position === 'fixed' || img.id === 'bridging-brix') img.remove();
    }
  }

  function guard(attempt) {
    removeFloatingBrix();
    if (!gated.test(location.pathname)) {
      return;
    }
    if (checking && !attempt) return;
    checking = true;
    fetch('/api/auth/get-session', { credentials: 'include' })
      .then(function (res) {
        return res.json();
      })
      .then(function (session) {
        if (adminPath.test(location.pathname)) {
          if (isAdminSession(session)) {
            checking = false;
            unlockAdmin();
            removeFloatingBrix();
            return;
          }
          if (sessionLooksValid(session) || hasClientSessionHint()) {
            checking = false;
            location.replace('/dashboard');
            return;
          }
          var adminNext = (attempt || 0) + 1;
          if (adminNext < 6) {
            setTimeout(function () { guard(adminNext); }, 250);
            return;
          }
          checking = false;
          location.replace('/login?redirect=/admin');
          return;
        }
        if (sessionLooksValid(session)) {
          checking = false;
          removeFloatingBrix();
          return;
        }
        var next = (attempt || 0) + 1;
        if (next < 6) {
          setTimeout(function () { guard(next); }, 250);
          return;
        }
        checking = false;
        if (hasClientSessionHint()) {
          removeFloatingBrix();
          return;
        }
        location.replace('/login');
      })
      .catch(function () {
        checking = false;
        removeFloatingBrix();
      });
  }

  var push = history.pushState;
  history.pushState = function () {
    var result = push.apply(this, arguments);
    guard(0);
    return result;
  };
  var replace = history.replaceState;
  history.replaceState = function () {
    var result = replace.apply(this, arguments);
    guard(0);
    return result;
  };
  window.addEventListener('popstate', function () { guard(0); });
  guard(0);
})();
