// ============================================================
// Roselys birthday site — entrance trigger + photo booth
// Plain vanilla JS, no build step. Loaded AFTER assets/photos.js
// so window.PHOTOS is already available.
// ============================================================
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // 1) Trigger the falling/assembling cake + headline.
    // Adding .playing on <body> activates the CSS @keyframes.
    document.body.classList.add("playing");

    // 2) After the entrance finishes, print the photos from the booth.
    var photos = Array.isArray(window.PHOTOS) ? window.PHOTOS : [];
    var grid = document.getElementById("photo-grid");

    if (!grid || photos.length === 0) {
      return;
    }

    // Entrance duration: candles finish ~1.9s, headline ~2.45s.
    var ENTRANCE_MS = 2700;
    // Per-photo stagger as each photo "prints" toward the viewer.
    var STEP_MS = 350;

    setTimeout(function () {
      photos.forEach(function (photo, index) {
        var card = document.createElement("figure");
        card.className = "photo-card";
        card.setAttribute("role", "listitem");

        var img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.caption || "Foto de Roselys";
        img.loading = "lazy";

        var caption = document.createElement("figcaption");
        caption.className = "caption";
        caption.textContent = photo.caption || "";

        card.appendChild(img);
        card.appendChild(caption);

        // Inline animation-delay drives the staggered "print" effect.
        card.style.animationDelay = index * STEP_MS + "ms";

        grid.appendChild(card);

        // Force a reflow-free reveal so the keyframe runs from far state.
        requestAnimationFrame(function () {
          card.classList.add("show");
        });
      });
    }, ENTRANCE_MS);
  });
})();
