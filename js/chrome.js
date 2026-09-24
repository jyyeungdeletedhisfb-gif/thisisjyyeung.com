(function () {
  function initNav(nav) {
    var toggle = nav.querySelector(".nav-toggle");
    var panel = nav.querySelector(".nav-panel");
    var scrim = nav.querySelector(".nav-scrim");
    if (!toggle || !panel) return;
    var closeTimer = null;

    function setOpen(open) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }

      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      if (scrim) scrim.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.classList.toggle("nav-open", open);

      if (open) {
        panel.removeAttribute("hidden");
        if (scrim) scrim.removeAttribute("hidden");
        /* Force a frame so translateX(100%) → 0 can transition */
        void panel.offsetWidth;
        nav.classList.add("is-open");
      } else {
        nav.classList.remove("is-open");
        var reduce =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var delay = reduce ? 0 : 420;
        closeTimer = window.setTimeout(function () {
          closeTimer = null;
          if (!nav.classList.contains("is-open")) {
            panel.setAttribute("hidden", "");
            if (scrim) scrim.setAttribute("hidden", "");
          }
        }, delay);
      }
    }

    setOpen(false);

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains("is-open"));
    });

    if (scrim) {
      scrim.addEventListener("click", function () {
        setOpen(false);
      });
    }

    panel.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (link) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  }

  document.querySelectorAll("[data-chrome-nav]").forEach(initNav);
})();
