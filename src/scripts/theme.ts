// The light/dark switch: remembers the choice. (The theme itself is set before the first paint by
// /theme-init.js, which also keeps it after a page transition.)
import { firstTime, onPage } from "./on-page";

onPage(() => {
  const btn = document.getElementById("theme-toggle");
  if (!btn || !firstTime(btn)) return;
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
});
