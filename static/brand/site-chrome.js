(function () {
  // Ambient edge glows (same palette as the landing page).
  if (!document.querySelector(".ambient")) {
    var ambient = document.createElement("div");
    ambient.className = "ambient";
    ambient.setAttribute("aria-hidden", "true");
    ambient.innerHTML = '<i class="a1"></i><i class="a2"></i><i class="a3"></i><i class="rings"></i>';
    document.body.prepend(ambient);
  }

  // Highlight the current page in the pill nav.
  var path = (location.pathname || "/").replace(/\/+$/, "") || "/";
  document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
    var href = a.getAttribute("href").replace(/\/+$/, "") || "/";
    if (href === path || (href === "/about" && path === "/elijah-chew")) {
      a.setAttribute("aria-current", "page");
    }
  });

  // Footer (landing-style: wordmark, copy, links).
  var mount = document.querySelector("footer[data-bridging-site-footer]");
  if (!mount) return;
  mount.classList.add("site-footer");
  mount.innerHTML =
    '<img class="wordmark" src="/brand/wordmark.png" alt="bridging" width="120" height="26" />' +
    '<p class="copy">© 2026 BRIDGING. Not affiliated with SEAB or MOE. Designed for Singapore students.</p>' +
    '<div class="links" aria-label="Site links">' +
    '<a href="/">Features</a>' +
    '<a href="/">How it Works</a>' +
    '<a href="/">FAQ</a>' +
    '<a href="/higher-education">Higher Education</a>' +
    '<a href="https://www.linkedin.com/company/bridgingai/" target="_blank" rel="noreferrer" aria-label="LinkedIn">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z"/></svg>' +
    "</a>" +
    '<a href="https://www.instagram.com/bridging.lol/" target="_blank" rel="noreferrer" aria-label="Instagram">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98C23.99 15.67 24 15.26 24 12s-.01-3.67-.07-4.95C23.73 2.69 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg>' +
    "</a>" +
    "</div>";
})();
