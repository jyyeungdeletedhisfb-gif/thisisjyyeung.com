(function () {
  function initNav(nav) {
    var toggle = nav.querySelector(".nav-toggle");
    var panel = nav.querySelector(".nav-panel");
    if (!toggle || !panel) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    }

    setOpen(false);

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains("is-open"));
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  document.querySelectorAll("[data-chrome-nav]").forEach(initNav);
})();
