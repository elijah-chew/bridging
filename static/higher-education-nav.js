(function injectHigherEducationNav() {
  if (!location.pathname || location.pathname !== "/") return;

  function isFaq(el) {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    return t === "FAQ";
  }

  function makeLink(mobile) {
    const a = document.createElement("a");
    a.href = "/higher-education";
    a.textContent = "Higher Education";
    a.setAttribute("data-bridging-he-nav", "1");
    if (mobile) {
      a.style.cssText =
        "display:block;font:400 16px/24px Inter,sans-serif;color:#0F172A;cursor:pointer;padding:12px 0;text-decoration:none;letter-spacing:-0.04em;";
    } else {
      a.style.cssText =
        "color:#0a0a0a;font-size:14px;font-weight:500;letter-spacing:-0.04em;cursor:pointer;text-decoration:none;";
    }
    a.addEventListener("mouseenter", () => {
      a.style.color = "#2F62FD";
    });
    a.addEventListener("mouseleave", () => {
      a.style.color = mobile ? "#0F172A" : "#0a0a0a";
    });
    return a;
  }

  function run() {
    if (document.querySelector("[data-bridging-he-nav]")) return;
    const nodes = [...document.querySelectorAll("a, p, span, div, button")].filter(isFaq);
    if (!nodes.length) return;
    for (const faq of nodes) {
      if ((faq.textContent || "").includes("Higher Education")) continue;
      const mobile = (faq.textContent || "").trim() === "FAQ" && getComputedStyle(faq).fontSize >= "16px";
      const link = makeLink(mobile || faq.tagName === "P");
      faq.insertAdjacentElement("afterend", link);
    }
  }

  run();
  const obs = new MutationObserver(run);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 15000);
})();
