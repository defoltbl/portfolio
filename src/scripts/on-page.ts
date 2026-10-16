// Run `setup` once for every page the visitor sees: on the first load, and after each
// in-site navigation (Astro's page transitions swap the page without reloading scripts).
// `setup` must be safe to call twice; elements remember that they are already wired up.
export function onPage(setup: () => void): void {
  document.addEventListener("astro:page-load", setup);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
}

/** True the first time it is asked for this element, so a listener is never added twice. */
export function firstTime(el: HTMLElement): boolean {
  if (el.dataset.wired === "1") return false;
  el.dataset.wired = "1";
  return true;
}
