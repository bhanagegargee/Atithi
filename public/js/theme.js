(() => {
  "use strict";

  const STORAGE_KEY = "atithi-theme";
  const root = document.documentElement;

  function setLabel(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* storage unavailable */ }
    setLabel(theme);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setLabel(root.getAttribute("data-theme") || "light");
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        setTheme(current === "dark" ? "light" : "dark");
      });
    }
  });
})();
