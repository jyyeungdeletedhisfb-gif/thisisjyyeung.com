(function () {
  var STORAGE_KEY = "about-voice";
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
  var handshakeEl = document.querySelector("[data-about-handshake]");
  var bioEl = document.querySelector("[data-about-bio]");
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
      .setAttribute("content", voice === "he" ? "#0a0a0a" : "#f4f4f4");

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

    // Portraits crossfade
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
      if (handshakeEl) handshakeEl.textContent = data.handshake;
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

  // Keyboard: left/right within tablist
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
})();
