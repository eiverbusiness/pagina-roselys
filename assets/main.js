// ============================================================
// Roselys birthday site — entrance trigger + photo booth
// Plain vanilla JS, no build step. Loaded AFTER assets/photos.js
// so window.PHOTOS is already available.
// ============================================================
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // 0) Theme: apply stored choice (or prefers-color-scheme), then wire toggle.
    initTheme();
    wireThemeToggle();

    // 1) Trigger the falling/assembling cake + headline.
    // Adding .playing on <body> activates the CSS @keyframes.
    document.body.classList.add("playing");

    // 3) After the entrance fully finishes, celebrate with confetti.
    spawnConfetti();

    // 2) After the entrance finishes, build the photo-strip printer.
    var photos = Array.isArray(window.PHOTOS) ? window.PHOTOS : [];

    // Entrance duration: candles finish ~2.0s, headline ~2.9s.
    // Start printing shortly after the cake settles.
    var ENTRANCE_MS = 2100;

    setTimeout(function () {
      var strip = document.getElementById("strip");
      if (!strip || photos.length === 0) return;

      // Build one connected frame (figure) for a given photo.
      function buildFrame(p) {
        var fig = document.createElement("figure");
        fig.className = "frame";
        fig.setAttribute("role", "listitem");

        var img = document.createElement("img");
        img.src = p.src;
        img.alt = p.caption || "Foto de Roselys";
        img.loading = "lazy";

        var cap = document.createElement("figcaption");
        cap.className = "caption";
        cap.textContent = p.caption || "";

        fig.appendChild(img);
        fig.appendChild(cap);
        return fig;
      }

      // One set, then a DUPLICATE set so the CSS feedStrip
      // translateY(-50%) -> 0 loop is seamless and infinite.
      photos.forEach(function (p) { strip.appendChild(buildFrame(p)); });
      photos.forEach(function (p) { strip.appendChild(buildFrame(p)); });
    }, ENTRANCE_MS);
  });

  // ------------------------------------------------------------
  // THEME (dark default, optional light) — persisted + accessible
  // ------------------------------------------------------------
  function applyTheme(theme) {
    var isLight = theme === "light";
    document.body.classList.toggle("light", isLight);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", isLight ? "true" : "false");
      btn.textContent = isLight ? "☀️" : "🌙";
      btn.setAttribute("aria-label", isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro");
    }
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) { /* file:// or blocked */ }
    var theme = saved;
    if (!theme) {
      var prefersLight = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;
      theme = prefersLight ? "light" : "dark";
    }
    applyTheme(theme);
  }

  function wireThemeToggle() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = document.body.classList.contains("light") ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
    });
  }

  // ------------------------------------------------------------
  // CONFETTI — lightweight DOM pieces spawned after the entrance
  // ------------------------------------------------------------
  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function spawnConfetti() {
    if (prefersReducedMotion()) return; // accessibility: no motion
    var layer = document.createElement("div");
    layer.className = "confetti-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    var colors = ["#ff4f88", "#a06bff", "#4fd8ff", "#ffd166", "#ff7eb3", "#ffffff"];
    var count = 90;
    for (var i = 0; i < count; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      var size = 6 + Math.random() * 8;
      piece.style.left = (Math.random() * 100) + "vw";
      piece.style.width = size + "px";
      piece.style.height = (size * 1.6) + "px";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (3 + Math.random() * 3) + "s";
      piece.style.animationDelay = (Math.random() * 1.5) + "s";
      piece.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
      layer.appendChild(piece);
    }
  }
})();
