// Filter the project cards by category. Instant: the matching cards show at once with a very short
// fade-in; nothing waits for a fade-out or a stagger.
import { firstTime, onPage } from "./on-page";

onPage(() => {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".filter-btn"));
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".card[data-categories]"));
  if (!buttons.length || !cards.length) return;

  function apply(filter: string): void {
    cards.forEach((card) => {
      const categories = (card.dataset.categories ?? "").split(",");
      const show = filter === "All" || categories.includes(filter);
      card.hidden = !show;
      card.classList.remove("filtered-in");
      if (show) {
        card.classList.add("is-visible");          // a card shown by the filter needs no scroll reveal
        void card.offsetWidth;                     // restart the short fade
        card.classList.add("filtered-in");
      }
    });
  }

  buttons.forEach((btn) => {
    if (!firstTime(btn)) return;
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      apply(btn.dataset.filter ?? "All");
    });
  });
});
