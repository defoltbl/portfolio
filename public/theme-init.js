// Set the theme before first paint to avoid a flash of the wrong theme.
(function () {
  var stored = localStorage.getItem("theme");
  var theme =
    stored ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = theme;
})();
