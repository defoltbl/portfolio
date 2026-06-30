// Filter project cards by category with a staggered crossfade cascade.
document.addEventListener("DOMContentLoaded", function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".card[data-categories]"));
  if (!buttons.length || !cards.length) return;

  var FADE_OUT = 240; // wait for the fade-out before rearranging
  var STAGGER = 80; // delay between each card fading in

  function apply(filter) {
    // 1. Fade everything out in place; reset any leftover stagger delays.
    cards.forEach(function (card) {
      card.style.transitionDelay = "0ms";
      card.classList.add("is-hidden");
    });

    // 2. Once invisible, rearrange the grid (no visible jump).
    window.setTimeout(function () {
      cards.forEach(function (card) {
        var cats = (card.dataset.categories || "").split(",");
        var matches = filter === "All" || cats.indexOf(filter) !== -1;
        card.style.display = matches ? "" : "none";
      });

      // 3. Next frame, cascade the matching cards in with a stagger.
      requestAnimationFrame(function () {
        var i = 0;
        cards.forEach(function (card) {
          if (card.style.display === "none") return;
          card.style.transitionDelay = i * STAGGER + "ms";
          card.classList.remove("is-hidden");
          i++;
        });
        // Clear delays afterwards so hover stays instant.
        window.setTimeout(function () {
          cards.forEach(function (card) {
            card.style.transitionDelay = "0ms";
          });
        }, i * STAGGER + 600);
      });
    }, FADE_OUT);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      apply(btn.dataset.filter);
    });
  });
});
