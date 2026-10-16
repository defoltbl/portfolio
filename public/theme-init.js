// Set the theme before first paint to avoid a flash of the wrong theme,
// and again after each page transition (the new page arrives without it).
(function () {
  function apply() {
    var stored = localStorage.getItem("theme");
    var theme =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.add("js");
  }
  apply();
  document.addEventListener("astro:after-swap", apply);
})();
