(function () {
  var SHUFFLE_KEY = "jy-brand-shuffle";
  var SHUFFLE_MS = 720;
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ";

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

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
        var reduce = prefersReducedMotion();
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

  function initWorkFloat() {
    var tiles = document.querySelectorAll(".work-tile");
    if (!tiles.length) return;

    var reduce = prefersReducedMotion();

    tiles.forEach(function (tile) {
      tile.classList.add("float-up");
    });

    if (reduce || !("IntersectionObserver" in window)) {
      tiles.forEach(function (tile) {
        tile.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          requestAnimationFrame(function () {
            el.classList.add("is-in");
          });
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -4% 0px" }
    );

    tiles.forEach(function (tile) {
      io.observe(tile);
    });
  }

  function markShuffle(dir) {
    try {
      sessionStorage.setItem(SHUFFLE_KEY, dir);
    } catch (e) {}
  }

  function takeShuffle() {
    try {
      var v = sessionStorage.getItem(SHUFFLE_KEY);
      if (v) sessionStorage.removeItem(SHUFFLE_KEY);
      return v;
    } catch (e) {
      return null;
    }
  }

  function isDysphoriaPage() {
    var path = (window.location.pathname || "").replace(/\/+$/, "");
    return /\/dysphoria$/i.test(path);
  }

  function leavesDysphoria(href) {
    if (!href || href.charAt(0) === "#") return false;
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      var path = url.pathname.replace(/\/+$/, "");
      return !/\/dysphoria$/i.test(path);
    } catch (e) {
      return false;
    }
  }

  /**
   * Short letter-scramble / decode on the brand mark only.
   * finalText settles in place; duration capped ~720ms.
   */
  function scrambleBrand(el, finalText, opts) {
    opts = opts || {};
    if (!el) return;
    var done = typeof opts.onDone === "function" ? opts.onDone : function () {};
    var duration = Math.min(800, Math.max(400, opts.duration || SHUFFLE_MS));

    if (prefersReducedMotion()) {
      el.textContent = finalText;
      el.classList.remove("is-shuffling");
      done();
      return;
    }

    var target = String(finalText);
    var len = target.length;
    var start = performance.now();
    el.classList.add("is-shuffling");
    el.setAttribute("aria-label", target);

    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var reveal = Math.floor(t * len);
      var out = "";
      for (var i = 0; i < len; i++) {
        var ch = target.charAt(i);
        if (ch === " ") {
          out += " ";
          continue;
        }
        if (i < reveal) {
          out += ch;
        } else {
          out += GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
        }
      }
      el.textContent = out;
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = target;
        el.classList.remove("is-shuffling");
        el.removeAttribute("aria-label");
        done();
      }
    }
    requestAnimationFrame(frame);
  }

  function brandEl() {
    return (
      document.querySelector(".topbar .brand.site-name") ||
      document.querySelector(".topbar a.brand") ||
      document.querySelector(".site-topbar .site-name") ||
      document.querySelector("a.site-name")
    );
  }

  function initBrandShuffle() {
    var el = brandEl();
    if (!el) return;
    var label = (el.textContent || "JY YEÜNG").trim() || "JY YEÜNG";

    if (isDysphoriaPage()) {
      /* Enter Dysphoria: scramble into Clarendon brand */
      scrambleBrand(el, label, { duration: SHUFFLE_MS });

      document.addEventListener(
        "click",
        function (e) {
          var link = e.target.closest("a[href]");
          if (!link) return;
          if (link.getAttribute("target") === "_blank") return;
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          var href = link.getAttribute("href");
          if (!leavesDysphoria(href)) return;
          e.preventDefault();
          markShuffle("exit");
          var dest = link.href;
          scrambleBrand(el, label, {
            duration: SHUFFLE_MS,
            onDone: function () {
              window.location.href = dest;
            },
          });
        },
        true
      );
      return;
    }

    /* Arriving from Dysphoria: brief scramble back into Geist chrome */
    if (takeShuffle() === "exit") {
      scrambleBrand(el, label, { duration: SHUFFLE_MS });
    }
  }

  document.querySelectorAll("[data-chrome-nav]").forEach(initNav);
  initWorkFloat();
  initBrandShuffle();
})();
