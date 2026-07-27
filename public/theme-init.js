// Prevent theme flash: dark is the brand default unless the user saved a preference.
(function () {
  try {
    var stored = localStorage.getItem("mdf-theme") || localStorage.getItem("ut-theme");
    var isDark = stored ? stored === "dark" : true;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
