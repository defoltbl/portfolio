// Set the theme before first paint to avoid a flash of the wrong theme. On a page transition the
// new page gets the theme BEFORE it is swapped in: Astro replaces the <html> attributes and then
// scrolls, so a page without data-theme would be styled light for a moment and fade back (a white blink).
(function () {
  function theme() {
    var stored = localStorage.getItem("theme");
    return stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function apply(root) {
    root.dataset.theme = theme();
    root.classList.add("js");
  }
  apply(document.documentElement);
  document.addEventListener("astro:before-swap", function (event) {
    apply(event.newDocument.documentElement);
  });
  document.addEventListener("astro:after-swap", function () {
    apply(document.documentElement);
  });
})();
