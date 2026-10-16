// Subtle motion: elements marked .reveal fade up once as they scroll into view, and the top bar
// highlights the section being read. Nothing moves for visitors who prefer reduced motion.
import { onPage } from "./on-page";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Links to a section of the same page glide there; a link from another page jumps straight to it.
document.addEventListener("click", (event) => {
  const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const url = new URL(link.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", url.hash);
});

onPage(() => {
  const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
  if (reduced() || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
  } else {
    const seen = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => seen.observe(el));
  }

  // The section in view lights up its link in the top bar (home page only).
  const links = new Map(
    Array.from(document.querySelectorAll<HTMLAnchorElement>(".topbar nav a[href^='#']")).map((a) => [a.hash.slice(1), a]),
  );
  if (!links.size) return;
  const current = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = links.get(entry.target.id);
        if (link && entry.isIntersecting) {
          links.forEach((l) => l.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  links.forEach((_link, id) => {
    const section = document.getElementById(id);
    if (section) current.observe(section);
  });
});
