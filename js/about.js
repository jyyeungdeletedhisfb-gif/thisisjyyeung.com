(function () {
  var STORAGE_KEY = "about-voice";
  var THEME = { i: "#bebebe", he: "#6e6e6e" };
  var body = document.body;
  if (!body || !body.classList.contains("about-page")) return;

  var copyEl = document.getElementById("about-copy");
  var copy = { i: null, he: null };
  try {
    copy = JSON.parse(copyEl.textContent);
  } catch (e) {
    return;
  }

  var nameEl = document.querySelector("[data-about-name]");
  var bioEl = document.querySelector("[data-about-bio]");
  var heroEl = document.querySelector("[data-about-hero]");
  var imgs = document.querySelectorAll(".about-hero__img");
  var buttons = document.querySelectorAll(".about-voice__btn");
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stored() {
    try {
      var v = sessionStorage.getItem(STORAGE_KEY);
      return v === "he" || v === "i" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function persist(voice) {
    try {
      sessionStorage.setItem(STORAGE_KEY, voice);
    } catch (e) {}
  }

  function setBio(paragraphs) {
    bioEl.textContent = "";
    paragraphs.forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      bioEl.appendChild(p);
    });
  }

  function setVoice(voice, opts) {
    opts = opts || {};
    var data = copy[voice];
    if (!data) return;
    var instant = reduce || opts.instant;

    body.classList.remove("about-voice-i", "about-voice-he");
    body.classList.add(voice === "he" ? "about-voice-he" : "about-voice-i");
    body.setAttribute("data-about-voice", voice);
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", THEME[voice] || THEME.i);

    buttons.forEach(function (btn) {
      var on = btn.getAttribute("data-voice") === voice;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (bioEl) {
      bioEl.setAttribute(
        "aria-labelledby",
        voice === "he" ? "voice-he" : "voice-i"
      );
    }

    imgs.forEach(function (img) {
      var on = img.getAttribute("data-voice") === voice;
      if (on) {
        img.removeAttribute("hidden");
        if (instant) {
          img.classList.add("is-active");
        } else {
          requestAnimationFrame(function () {
            img.classList.add("is-active");
          });
        }
      } else {
        img.classList.remove("is-active");
        if (instant) {
          img.setAttribute("hidden", "");
        } else {
          window.setTimeout(function () {
            if (!img.classList.contains("is-active")) {
              img.setAttribute("hidden", "");
            }
          }, 420);
        }
      }
    });

    function applyCopy() {
      if (nameEl) nameEl.textContent = data.name;
      if (bioEl) setBio(data.bio);
    }

    if (instant || !bioEl) {
      applyCopy();
      if (bioEl) {
        bioEl.classList.remove("is-fading");
        bioEl.classList.add("is-ready");
      }
    } else {
      bioEl.classList.add("is-fading");
      bioEl.classList.remove("is-ready");
      window.setTimeout(function () {
        applyCopy();
        bioEl.classList.remove("is-fading");
        bioEl.classList.add("is-ready");
      }, 200);
    }

    persist(voice);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var voice = btn.getAttribute("data-voice");
      if (voice && voice !== body.getAttribute("data-about-voice")) {
        setVoice(voice);
      }
    });
  });

  var tablist = document.querySelector(".about-voice__toggle");
  if (tablist) {
    tablist.addEventListener("keydown", function (e) {
      var keys = { ArrowLeft: "i", ArrowRight: "he", Home: "i", End: "he" };
      var next = keys[e.key];
      if (!next) return;
      e.preventDefault();
      setVoice(next);
      var target = document.querySelector(
        '.about-voice__btn[data-voice="' + next + '"]'
      );
      if (target) target.focus();
    });
  }

  var initial = stored() || "i";
  setVoice(initial, { instant: true });

  // Scroll: park hero under sheet — blur + fade (fade-only if reduced motion)
  (function initHeroScroll() {
    if (!heroEl || !body.style) return;

    var ticking = false;

    function apply() {
      ticking = false;
      var heroH =
        heroEl.getBoundingClientRect().height || window.innerHeight * 0.5;
      var y = window.scrollY || window.pageYOffset || 0;
      var progress = Math.min(1, Math.max(0, y / (heroH * 0.85)));
      var fade = (1 - progress * 0.72).toFixed(3);
      body.style.setProperty("--about-hero-fade", fade);
      if (reduce) {
        body.style.setProperty("--about-hero-blur", "0px");
      } else {
        var blur = (progress * 14).toFixed(2);
        body.style.setProperty("--about-hero-blur", blur + "px");
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  })();

  // Page enter. A fixed hero often never "enters" for IntersectionObserver,
  // and adding is-in in the same turn as float-up skips the first paint so
  // the transition never runs. Arm is-in on a double rAF after the hidden
  // state has painted. Once per load — do not re-bind on scroll.
  (function initAboutEnter() {
    var hero = document.querySelector(".about-hero");
    var intro = document.querySelector(".about-intro");
    var targets = [];
    if (hero) targets.push(hero);
    if (intro) targets.push(intro);
    if (!targets.length) return;

    targets.forEach(function (el) {
      el.classList.add("float-up");
    });

    function show() {
      targets.forEach(function (el) {
        el.classList.add("is-in");
      });
    }

    if (reduce) {
      show();
      return;
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        targets.forEach(function (el) {
          el.classList.add("is-entering");
        });
        show();
        window.setTimeout(function () {
          targets.forEach(function (el) {
            el.classList.remove("is-entering");
          });
        }, 1500);
      });
    });
  })();
})();
