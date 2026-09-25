// public/js/home.js — NEW FILE.
// Loaded only on the homepage (see boilerplate.ejs `isHome` guard).
// Touches nothing outside elements with the "atithi-" prefix, so it
// cannot affect /listings, /login, /signup, etc.
(() => {
  "use strict";

  const body = document.body;
  const THEME_KEY = "atithi-home-theme";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------- theme: init ----------------
  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    const toggle = document.getElementById("atithi-theme-toggle");
    if (toggle) toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }

    if (stored === "dark" || stored === "light") {
      applyTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  function toggleTheme() {
    const current = body.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
  }

  initTheme();

  const themeToggleBtn = document.getElementById("atithi-theme-toggle");
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

  // ---------------- navbar: solid on scroll ----------------
  const navbar = document.querySelector("body.atithi-home .navbar");
  function updateNavbarState() {
    if (!navbar) return;
    if (window.scrollY > 60) navbar.classList.add("atithi-scrolled");
    else navbar.classList.remove("atithi-scrolled");
  }
  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });

  // ---------------- scroll reveal ----------------
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("atithi-revealed"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("atithi-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  // ---------------- feel-india video: lazy start ----------------
  const feelVideo = document.querySelector(".atithi-feel-video");
  if (feelVideo && !reducedMotion) {
    const src = feelVideo.getAttribute("data-src");
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (src && !feelVideo.src) feelVideo.src = src;
            feelVideo.play().catch(() => {});
          } else {
            feelVideo.pause();
          }
        });
      },
      { threshold: 0.3 }
    );
    videoObserver.observe(feelVideo);
  }
})();