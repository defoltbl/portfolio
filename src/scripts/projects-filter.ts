// Filter the project cards by category. One smooth motion that starts at once: cards that stay glide to
// their new places, new ones fade in, removed ones fade out (View Transitions). Browsers without the
// API, and visitors who prefer reduced motion, get the new set of cards at once.
import { firstTime, onPage } from "./on-page";

onPage(() => {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".filter-btn"));
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".card[data-categories]"));
  if (!buttons.length || !cards.length) return;
  const root = document.documentElement;

  // Show the matching cards in their final state: no scroll reveal is left half-way on a card.
  function show(filter: string): void {
    root.classList.add("settling");
    cards.forEach((card) => {
      const categories = (card.dataset.categories ?? "").split(",");
      card.hidden = !(filter === "All" || categories.includes(filter));
      if (!card.hidden) card.classList.add("is-visible");
    });
    void root.offsetHeight; // apply it while transitions are off
    root.classList.remove("settling");
  }

  function apply(filter: string): void {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !document.startViewTransition) {
      show(filter);
      return;
    }
    cards.forEach((card, i) => (card.style.viewTransitionName = `filter-card-${i}`));
    root.classList.add("filtering");
    const transition = document.startViewTransition(() => show(filter));
    transition.finished.finally(() => {
      cards.forEach((card) => (card.style.viewTransitionName = ""));
      root.classList.remove("filtering");
    });
  }

  buttons.forEach((btn) => {
    if (!firstTime(btn)) return;
    btn.addEventListener("click", () => {
      if (btn.getAttribute("aria-pressed") === "true") return;
      buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      apply(btn.dataset.filter ?? "All");
    });
  });
});
