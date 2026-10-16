// Filter the project cards by category with a staggered crossfade.
import { firstTime, onPage } from "./on-page";

const FADE_OUT = 240; // wait for the fade-out before rearranging
const STAGGER = 80; // delay between each card fading in

onPage(() => {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".filter-btn"));
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".card[data-categories]"));
  if (!buttons.length || !cards.length) return;

  function apply(filter: string): void {
    // 1. Fade everything out in place; reset any leftover stagger delays.
    cards.forEach((card) => {
      card.style.transitionDelay = "0ms";
      card.classList.add("is-hidden");
    });
    // 2. Once invisible, rearrange the grid (no visible jump).
    window.setTimeout(() => {
      cards.forEach((card) => {
        const categories = (card.dataset.categories ?? "").split(",");
        card.style.display = filter === "All" || categories.includes(filter) ? "" : "none";
      });
      // 3. Next frame, cascade the matching cards in with a stagger.
      requestAnimationFrame(() => {
        let i = 0;
        cards.forEach((card) => {
          if (card.style.display === "none") return;
          card.style.transitionDelay = `${i * STAGGER}ms`;
          card.classList.remove("is-hidden");
          i++;
        });
        // Clear the delays afterwards so hover stays instant.
        window.setTimeout(() => cards.forEach((card) => (card.style.transitionDelay = "0ms")), i * STAGGER + 600);
      });
    }, FADE_OUT);
  }

  buttons.forEach((btn) => {
    if (!firstTime(btn)) return;
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      apply(btn.dataset.filter ?? "All");
    });
  });
});
