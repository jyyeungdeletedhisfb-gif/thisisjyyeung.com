(function () {
  "use strict";

  const CONTENT_URL = new URL("content/dysphoria.json", document.baseURI).href;
  function assetUrl(path) {
    if (!path) return "";
    if (/^https?:/i.test(path)) return path;
    return new URL(path.replace(/^\//, ""), document.baseURI).href;
  }
  const ZOOM = 2.2;

  let sheets = [];
  let i = 0, flipped = false, animating = false, loupeOn = false, usingAlt = false;
  let plate, plateStage, peekLeft, peekRight, flipBtn, loupeBtn, replaceBtn, loupe;
  let titleBtn, titleJump, tracklist, intro, introCover, introCopy, introSticky, toTop;
  let playlistBg, soundtrackLayer, soundtrackDarken, soundtrackInner;
  let enterGate, exitGate, enterBg, enterGateImg, exitGateImg, exitReveal;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function displayTitle(s) { return s.titleDisplay || s.title; }
  function currentSrc() {
    const s = sheets[i];
    return assetUrl((usingAlt && s.alt) ? s.alt : s.src);
  }
  function plateBox(ar) {
    const maxH = Math.min(window.innerHeight * 0.65, 720);
    const maxW = Math.min(window.innerWidth * 0.72, 560);
    let h = maxH, w = h * ar;
    if (w > maxW) { w = maxW; h = w / ar; }
    return { w, h };
  }
  /** Tallest plate box across all sheets (smallest AR under same maxW/maxH). */
  function maxPlateBox() {
    let maxH = 0;
    for (let n = 0; n < sheets.length; n++) {
      const { h } = plateBox(sheets[n].ar);
      if (h > maxH) maxH = h;
    }
    return { h: maxH };
  }
  function syncStageReserve() {
    if (!plateStage || !sheets.length) return;
    const { h } = maxPlateBox();
    plateStage.style.setProperty("--plate-reserve-h", h + "px");
    return h;
  }
  function peekBox(ar) {
    const { w, h } = plateBox(ar);
    return { w: w * 0.55, h: h * 0.55 };
  }

  function setTracklistOpen(open) {
    if (!titleJump) return;
    titleJump.classList.toggle("is-open", !!open);
    if (titleBtn) titleBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function closeTracklist() { setTracklistOpen(false); }

  function fillTracklist() {
    tracklist.innerHTML = sheets.map((s, idx) =>
      `<button type="button" data-i="${idx}"><span class="n">${String(idx + 1).padStart(2, "0")}</span><span>${displayTitle(s)}</span></button>`
    ).join("");
    tracklist.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        closeTracklist();
        jumpTo(+b.dataset.i);
      };
    });
  }

  function setPeek(el, sheet) {
    if (!sheet) {
      el.classList.add("empty");
      el.style.backgroundImage = "";
      el.style.width = el.style.height = "120px";
      el.style.setProperty("--peek-x", "0px");
      el.style.transition = "";
      return;
    }
    el.classList.remove("empty");
    const { w, h } = peekBox(sheet.ar);
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.backgroundImage = `url("${assetUrl(sheet.src)}")`;
    el.style.setProperty("--peek-x", "0px");
    el.style.transition = "";
  }

  function setPeekShift(px, withTransition) {
    const val = (px || 0) + "px";
    [peekLeft, peekRight].forEach((el) => {
      if (!el) return;
      if (withTransition) {
        el.style.transition = "transform 0.4s var(--ease)";
      } else {
        el.style.transition = "none";
      }
      el.style.setProperty("--peek-x", val);
    });
  }

  function clearPeekShift(withTransition) {
    setPeekShift(0, withTransition);
  }

  function titleMarkup(label, name) {
    // Spaces inside title-line keep one continuous underline through the em dash
    return (
      `<span class="title-line"><span class="num">${label}</span> — <span class="name">${name}</span></span>` +
      `<span class="title-caret" aria-hidden="true">▾</span>`
    );
  }

  function setTitle(dir, index = i) {
    const s = sheets[index];
    const label = `${String(index + 1).padStart(2, "0")} / ${String(sheets.length).padStart(2, "0")}`;
    const name = displayTitle(s);
    if (!dir) {
      titleBtn.className = "title-btn";
      titleBtn.style.transform = "";
      titleBtn.style.opacity = "";
      titleBtn.innerHTML = titleMarkup(label, name);
      return;
    }
    titleBtn.classList.remove("enter-from-left", "enter-from-right");
    titleBtn.classList.add(dir > 0 ? "exit-left" : "exit-right");
    setTimeout(() => {
      titleBtn.innerHTML = titleMarkup(label, name);
      titleBtn.className = "title-btn " + (dir > 0 ? "enter-from-right" : "enter-from-left");
    }, 160);
  }

  function renderPlate(keepTitle) {
    const s = sheets[i];
    const { w, h } = plateBox(s.ar);
    plate.style.width = w + "px";
    plate.style.height = h + "px";
    plate.style.transform = "";
    plate.style.opacity = "";
    plate.style.filter = "";
    plate.style.transition = "";
    plate.className = "plate" + (flipped ? " flipped" : "");
    plate.innerHTML =
      `<div class="shot-wrap"><div class="shot" style="background-image:url('${currentSrc()}')" role="img" aria-label="${displayTitle(s)}"></div></div>` +
      `<div class="liner"><div><h2>${displayTitle(s)}</h2><p>${s.liner}</p></div>` +
      `<div class="hint">liner · editable</div></div>`;
    if (!keepTitle) setTitle(0);
    setPeek(peekLeft, i > 0 ? sheets[i - 1] : null);
    setPeek(peekRight, i < sheets.length - 1 ? sheets[i + 1] : null);
    tracklist.querySelectorAll("button").forEach((b) =>
      b.classList.toggle("active", +b.dataset.i === i)
    );
    loupe.style.backgroundImage = `url("${currentSrc()}")`;
    loupe.style.backgroundSize = `${w * ZOOM}px ${h * ZOOM}px`;
    // Reserve tallest sheet height so title + tools stay fixed while plate varies.
    const reserveH = syncStageReserve() || h;
    // Phone: peek cy = mid of reserved stage (plate is vertically centered in it).
    // Desktop keeps CSS top:50% of tall stage.
    if (plateStage) {
      if (window.matchMedia("(max-width: 800px)").matches) {
        plateStage.style.setProperty("--peek-cy", reserveH / 2 + "px");
      } else {
        plateStage.style.removeProperty("--peek-cy");
      }
    }
    replaceBtn.disabled = !s.alt;
    replaceBtn.classList.toggle("on", !!s.alt && usingAlt);
    flipBtn.classList.toggle("on", flipped);
    flipBtn.setAttribute("aria-pressed", flipped ? "true" : "false");
    loupeBtn.classList.toggle("on", loupeOn);
    loupeBtn.setAttribute("aria-pressed", loupeOn ? "true" : "false");
  }

  function commitTo(next, dir) {
    animating = true;
    flipped = false;
    usingAlt = false;
    loupe.classList.remove("on");
    loupeOn = false;
    loupeBtn.classList.remove("on");
    loupeBtn.setAttribute("aria-pressed", "false");
    flipBtn.classList.remove("on");
    flipBtn.setAttribute("aria-pressed", "false");
    setTitle(dir, next);
    const dist = dir > 0 ? -1 : 1;
    const exitPx = dist * (plate.offsetWidth || 300) * 0.18;
    plate.style.transition = "transform 0.55s var(--ease), opacity 0.45s var(--ease), filter 0.45s var(--ease)";
    plate.style.transform = `translateX(${dist * 18}%)`;
    plate.style.opacity = "0";
    plate.style.filter = "blur(2px)";
    setPeekShift(exitPx, true);
    setTimeout(() => {
      i = next;
      renderPlate(true);
      plate.style.transition = "none";
      plate.style.transform = `translateX(${-dist * 18}%)`;
      plate.style.opacity = "0";
      plate.style.filter = "blur(2px)";
      setPeekShift(-exitPx, false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          plate.style.transition =
            "transform 0.6s var(--ease), opacity 0.5s var(--ease), filter 0.5s var(--ease)";
          plate.style.transform = "translateX(0)";
          plate.style.opacity = "1";
          plate.style.filter = "none";
          clearPeekShift(true);
          setTimeout(() => {
            plate.style.transition = "";
            clearPeekShift(false);
            animating = false;
          }, 620);
        })
      );
    }, 280);
  }

  function go(d) {
    if (animating) return;
    const n = i + d;
    if (n < 0 || n >= sheets.length) return;
    commitTo(n, d);
  }
  function jumpTo(idx) {
    closeTracklist();
    if (animating || idx === i) return;
    commitTo(idx, idx > i ? 1 : -1);
  }

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function smoothstep(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /** Progress 0–1 through a tall sticky scrub section */
  function sectionProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const topH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--top-h")) || 52;
    const viewH = window.innerHeight - topH;
    const total = el.offsetHeight - viewH;
    if (total <= 0) return 0;
    const scrolled = -rect.top + topH;
    return clamp(scrolled / total, 0, 1);
  }

  function scrubEnter(t) {
    if (!enterGateImg) return;
    // Solid black void under gate (no blurred backdrop).
    if (enterBg) enterBg.style.opacity = "1";

    // 0.00–0.10 gate fades in small on black
    // 0.06–0.58 scale up / circle expand until engulf
    // 0.48–0.72 soundtrack fades in; gate softens after ~0.62
    // 0.72–1.00 darken → solid black into sheets
    const gateIn = smoothstep((t - 0.0) / 0.10);
    const scaleT = smoothstep((t - 0.06) / 0.52);
    const scale = lerp(0.32, 4.6, scaleT);
    const clipR = lerp(32, 78, scaleT);

    enterGateImg.style.opacity = String(gateIn);
    enterGateImg.style.transform = `scale(${scale})`;
    enterGateImg.style.clipPath = `circle(${clipR}% at 50% 50%)`;

    const snd = smoothstep((t - 0.48) / 0.24);
    if (soundtrackLayer) {
      soundtrackLayer.style.opacity = String(snd);
      soundtrackLayer.classList.toggle("is-live", snd > 0.4);
    }
    if (t > 0.62) {
      const fadeGate = 1 - smoothstep((t - 0.62) / 0.16);
      enterGateImg.style.opacity = String(gateIn * fadeGate);
    }

    const darken = smoothstep((t - 0.72) / 0.28);
    if (soundtrackDarken) soundtrackDarken.style.opacity = String(darken);
    if (soundtrackInner) soundtrackInner.style.opacity = String(1 - darken * 0.98);
  }

  function scrubExit(t) {
    if (!exitGateImg) return;
    // hold ~0–0.12; contract 0.12–0.80; fade late; footer reveal
    const contractT = smoothstep((t - 0.12) / 0.68);
    const scale = lerp(4.4, 0.28, contractT);
    const clipR = lerp(78, 34, contractT);
    const fadeOut = 1 - smoothstep((t - 0.78) / 0.18);

    exitGateImg.style.opacity = String(fadeOut);
    exitGateImg.style.transform = `scale(${scale})`;
    exitGateImg.style.clipPath = `circle(${clipR}% at 50% 50%)`;

    if (exitReveal) {
      const reveal = smoothstep((t - 0.55) / 0.25) * (1 - smoothstep((t - 0.9) / 0.1));
      exitReveal.style.opacity = String(reveal * 0.85);
    }
  }

  function scrub() {
    const enterT = sectionProgress(enterGate);
    const exitT = sectionProgress(exitGate);

    if (reduceMotion) {
      const mid = window.scrollY + window.innerHeight * 0.4;
      const sheetsEl = document.getElementById("sheets");
      const sheetsTop = sheetsEl ? sheetsEl.offsetTop : 0;
      if (!enterGate || mid < enterGate.offsetTop) {
        scrubEnter(0);
        scrubExit(0);
      } else if (mid < sheetsTop) {
        scrubEnter(1);
        scrubExit(0);
      } else if (!exitGate || mid < exitGate.offsetTop) {
        scrubEnter(1);
        scrubExit(0);
      } else {
        scrubEnter(1);
        scrubExit(1);
      }
    } else {
      scrubEnter(enterT);
      scrubExit(exitT);
    }

    // Topbar dark once past intro (entering gate scrub or beyond)
    const pastIntro = window.scrollY > intro.offsetHeight - 80 || enterT > 0.01;
    document.body.classList.toggle("on-dark", pastIntro);
  }

  function moveLoupe(cx, cy) {
    if (!loupeOn) return;
    const stage = plateStage.getBoundingClientRect();
    const rect = plate.getBoundingClientRect();
    const lw = loupe.offsetWidth;
    const lh = loupe.offsetHeight;
    const r = lw / 2;
    // Hotspot = bottom-right rim (~4 o'clock). Pointer sits on the rim while
    // the glass sits up-left of the finger so it is not covered.
    const ang = Math.PI / 6; // 4 o'clock ≈ 30° below +x
    const localX = cx - stage.left;
    const localY = cy - stage.top;
    let left = localX - r - r * Math.cos(ang);
    let top = localY - r - r * Math.sin(ang);
    // Keep loupe on-stage; hotspot stays BR-biased (never UL / glass-center)
    left = Math.max(0, Math.min(stage.width - lw, left));
    top = Math.max(0, Math.min(stage.height - lh, top));
    loupe.style.left = left + "px";
    loupe.style.top = top + "px";
    // Magnified sample = what's under the glass CENTER (not the rim hotspot)
    const centerClientX = stage.left + left + lw / 2;
    const centerClientY = stage.top + top + lh / 2;
    const sx = Math.max(0, Math.min(rect.width, centerClientX - rect.left));
    const sy = Math.max(0, Math.min(rect.height, centerClientY - rect.top));
    loupe.style.backgroundPosition = `${-(sx * ZOOM - lw / 2)}px ${-(sy * ZOOM - lh / 2)}px`;
  }

  function applyChrome(data) {
    const brand = document.querySelector(".brand");
    const project = document.querySelector(".project-title");
    if (brand && data.chrome) {
      brand.textContent = data.chrome.brand || "Jy Yeüng";
      brand.setAttribute("href", data.chrome.brandHref || "./");
    }
    if (project && data.chrome) {
      project.textContent = data.chrome.projectTitle || "Dysphoria";
    }
  }

  function applyIntro(data) {
    const introData = data.intro || {};
    if (introCover && introData.cover) {
      introCover.style.backgroundImage = `url('${assetUrl(introData.cover)}')`;
    }
    const h1 = introCopy && introCopy.querySelector("h1");
    const p = introCopy && introCopy.querySelector("p");
    const hint = document.getElementById("introHint");
    if (h1 && introData.heading) h1.textContent = introData.heading;
    if (p && introData.body) p.textContent = introData.body;
    if (hint && introData.hint) hint.setAttribute("aria-label", introData.hint);
  }

  function applySoundtrack(data) {
    const st = data.soundtrack || {};
    const section = soundtrackInner || document.getElementById("soundtrackInner");
    if (!section) return;
    const h2 = section.querySelector("h2");
    const sub = section.querySelector(".sub");
    const apple = section.querySelector('a[data-listen="apple"]');
    const iframe = section.querySelector("iframe");
    const bg = playlistBg || document.getElementById("playlistBg");
    if (h2 && st.heading) h2.textContent = st.heading;
    if (sub && st.sub) sub.textContent = st.sub;
    if (apple && st.appleMusicUrl) apple.href = st.appleMusicUrl;
    if (iframe && st.appleMusicEmbed) iframe.src = st.appleMusicEmbed;
    if (bg && st.backdrop) {
      bg.style.backgroundImage = `url("${assetUrl(st.backdrop)}")`;
    }
  }

  function applyMeta(data) {
    const m = data.meta || {};
    if (m.title) document.title = m.title;
    const setMeta = (sel, attr, val) => {
      const el = document.querySelector(sel);
      if (el && val) el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]', "content", m.description);
    setMeta('meta[property="og:title"]', "content", m.title);
    setMeta('meta[property="og:description"]', "content", m.description);
    setMeta('meta[property="og:image"]', "content", m.ogImage);
    setMeta('meta[name="twitter:title"]', "content", m.title);
    setMeta('meta[name="twitter:description"]', "content", m.description);
    setMeta('meta[name="twitter:image"]', "content", m.ogImage);
    const yearEl = document.querySelector("[data-year]");
    if (yearEl && m.year) yearEl.textContent = m.year;
  }

  function bindInteractions() {
    let drag = null;
    plateStage.addEventListener("pointerdown", (e) => {
      if (animating || loupeOn) return;
      if (e.target.closest(".icon-btn,.peek,.plate-controls")) return;
      drag = { id: e.pointerId, x0: e.clientX, dx: 0 };
      plateStage.setPointerCapture(e.pointerId);
      plate.style.transition = "none";
      setPeekShift(0, false);
    });
    plateStage.addEventListener("pointermove", (e) => {
      if (loupeOn) {
        moveLoupe(e.clientX, e.clientY);
        return;
      }
      if (!drag || e.pointerId !== drag.id) return;
      drag.dx = e.clientX - drag.x0;
      const w = plate.offsetWidth || 300;
      const p = Math.max(-1, Math.min(1, drag.dx / w));
      const shiftPx = p * w;
      plate.style.transform = `translateX(${p * 100}%)`;
      plate.style.opacity = String(1 - Math.abs(p) * 0.35);
      plate.style.filter = `blur(${Math.abs(p) * 3}px)`;
      // Peeks share the same translate family as the central plate
      setPeekShift(shiftPx, false);
      titleBtn.style.transition = "none";
      titleBtn.style.transform = `translateX(${p * 40}%)`;
      // Mid-scrub fade: opacity dips as |drag| approaches ~0.5, recovers on commit
      const ap = Math.abs(p);
      const midFade = Math.min(1, ap / 0.5); // 0→1 as |p|→0.5
      titleBtn.style.opacity = String(1 - midFade * 0.62);
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = drag.dx;
      drag = null;
      titleBtn.style.transition = "";
      titleBtn.style.transform = "";
      titleBtn.style.opacity = "";
      const th = Math.min(80, (plate.offsetWidth || 300) * 0.22);
      if (dx < -th && i < sheets.length - 1) commitTo(i + 1, 1);
      else if (dx > th && i > 0) commitTo(i - 1, -1);
      else {
        plate.style.transition =
          "transform 0.4s var(--ease), opacity 0.35s var(--ease), filter 0.35s var(--ease)";
        plate.style.transform = "translateX(0)";
        plate.style.opacity = "1";
        plate.style.filter = "none";
        clearPeekShift(true);
      }
    }
    plateStage.addEventListener("pointerup", endDrag);
    plateStage.addEventListener("pointercancel", endDrag);

    peekLeft.onclick = () => go(-1);
    peekRight.onclick = () => go(1);
    flipBtn.onclick = () => {
      flipped = !flipped;
      plate.classList.toggle("flipped", flipped);
      flipBtn.classList.toggle("on", flipped);
      flipBtn.setAttribute("aria-pressed", flipped ? "true" : "false");
    };
    loupeBtn.onclick = () => {
      loupeOn = !loupeOn;
      loupe.classList.toggle("on", loupeOn);
      loupeBtn.classList.toggle("on", loupeOn);
      loupeBtn.setAttribute("aria-pressed", loupeOn ? "true" : "false");
      if (loupeOn) {
        const r = plate.getBoundingClientRect();
        // Seed hotspot at BR rim so glass center lands near plate mid
        const lw = loupe.offsetWidth || 168;
        const ang = Math.PI / 6;
        const hr = lw / 2;
        const hx = r.left + r.width / 2 + hr * Math.cos(ang);
        const hy = r.top + r.height / 2 + hr * Math.sin(ang);
        moveLoupe(hx, hy);
      }
    };
    replaceBtn.onclick = () => {
      if (!sheets[i].alt || animating) return;
      animating = true;
      plate.classList.add("swapping");
      setTimeout(() => {
        usingAlt = !usingAlt;
        const shot = plate.querySelector(".shot");
        if (shot) shot.style.backgroundImage = `url("${currentSrc()}")`;
        loupe.style.backgroundImage = `url("${currentSrc()}")`;
        replaceBtn.classList.toggle("on", usingAlt);
        setTimeout(() => {
          plate.classList.remove("swapping");
          setTimeout(() => (animating = false), 550);
        }, 40);
      }, 520);
    };

    if (titleBtn && titleJump) {
      titleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = !titleJump.classList.contains("is-open");
        setTracklistOpen(open);
        if (!open) titleBtn.blur();
      });
      document.addEventListener(
        "pointerdown",
        (e) => {
          if (!titleJump.classList.contains("is-open")) return;
          if (titleJump.contains(e.target)) return;
          closeTracklist();
        },
        true
      );
      titleJump.addEventListener("focusout", (e) => {
        // Close when focus leaves the jump control (keyboard)
        if (!titleJump.contains(e.relatedTarget)) closeTracklist();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeTracklist();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "f" || e.key === "F") flipBtn.click();
    });
    window.addEventListener("scroll", scrub, { passive: true });
    window.addEventListener("resize", () => {
      scrub();
      renderPlate(true);
    });

    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
    function syncToTop() {
      toTop.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener("scroll", syncToTop, { passive: true });
    syncToTop();
  }

  function collectImageUrls(data) {
    const urls = [];
    const cover = data.intro && data.intro.cover;
    if (cover) urls.push(assetUrl(cover));
    const backdrop = data.soundtrack && data.soundtrack.backdrop;
    if (backdrop) urls.push(assetUrl(backdrop));
    urls.push(assetUrl("assets/dysphoria/gate-enter.jpg"));
    urls.push(assetUrl("assets/dysphoria/gate-exit.jpg"));
    (data.tracks || []).forEach((t) => {
      if (t.src) urls.push(assetUrl(t.src));
      if (t.alt) urls.push(assetUrl(t.alt));
    });
    return [...new Set(urls.filter(Boolean))];
  }

  function preloadImages(urls) {
    return Promise.all(
      urls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = img.onerror = () => resolve(src);
            img.src = src;
          })
      )
    );
  }

  function dismissLoadGate() {
    const gate = document.getElementById("loadGate");
    if (!gate || gate.classList.contains("is-done")) return;
    gate.classList.add("is-done");
    gate.setAttribute("aria-busy", "false");
    const remove = () => {
      if (gate.parentNode) gate.parentNode.removeChild(gate);
    };
    gate.addEventListener("transitionend", remove, { once: true });
    setTimeout(remove, 700);
  }

  async function runLoadGate(data) {
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const urls = collectImageUrls(data);
    const timeoutMs = reduced ? 400 : 2200;
    const minMs = reduced ? 0 : 320;

    const started = performance.now();
    await Promise.race([
      preloadImages(urls),
      new Promise((r) => setTimeout(r, timeoutMs)),
    ]);
    const waited = performance.now() - started;
    if (waited < minMs) {
      await new Promise((r) => setTimeout(r, minMs - waited));
    }
    dismissLoadGate();
  }

  async function boot() {
    plate = document.getElementById("plate");
    plateStage = document.getElementById("plateStage");
    peekLeft = document.getElementById("peekLeft");
    peekRight = document.getElementById("peekRight");
    flipBtn = document.getElementById("flipBtn");
    loupeBtn = document.getElementById("loupeBtn");
    replaceBtn = document.getElementById("replaceBtn");
    loupe = document.getElementById("loupe");
    titleBtn = document.getElementById("titleBtn");
    titleJump = document.getElementById("titleJump");
    tracklist = document.getElementById("tracklist");
    intro = document.getElementById("intro");
    introCover = document.getElementById("introCover");
    introCopy = document.getElementById("introCopy");
    introSticky = document.querySelector(".intro-sticky");
    playlistBg = document.getElementById("playlistBg");
    soundtrackLayer = document.getElementById("soundtrackLayer");
    soundtrackDarken = document.getElementById("soundtrackDarken");
    soundtrackInner = document.getElementById("soundtrackInner");
    enterGate = document.getElementById("enterGate");
    exitGate = document.getElementById("exitGate");
    enterBg = document.getElementById("enterBg");
    enterGateImg = document.getElementById("enterGateImg");
    exitGateImg = document.getElementById("exitGateImg");
    exitReveal = document.getElementById("exitReveal");
    toTop = document.getElementById("toTop");

    // Gate backgrounds via assetUrl so <base href> resolves correctly
    if (enterGateImg) {
      enterGateImg.style.backgroundImage = `url("${assetUrl("assets/dysphoria/gate-enter.jpg")}")`;
    }
    if (exitGateImg) {
      exitGateImg.style.backgroundImage = `url("${assetUrl("assets/dysphoria/gate-exit.jpg")}")`;
    }

    const res = await fetch(CONTENT_URL);
    if (!res.ok) throw new Error("Failed to load content/dysphoria.json");
    const data = await res.json();
    sheets = data.tracks || [];
    applyMeta(data);
    applyChrome(data);
    applyIntro(data);
    applySoundtrack(data);
    fillTracklist();
    bindInteractions();
    renderPlate(false);
    scrub();
    // QA harness for gate scrub (mirrors locked mock)
    window.__gateMock = {
      sectionProgress,
      scrubEnter,
      scrubExit,
      update: scrub,
      getEnterT: () => sectionProgress(enterGate),
      getExitT: () => sectionProgress(exitGate),
      scrollToProgress(kind, t) {
        const el = kind === "exit" ? exitGate : enterGate;
        if (!el) return;
        const topH = 52;
        const viewH = window.innerHeight - topH;
        const total = el.offsetHeight - viewH;
        const y = el.offsetTop - topH + total * clamp(t, 0, 1);
        window.scrollTo(0, y);
        scrub();
      }
    };
    // Gate runs after first paint of chrome so sheets don't hitch on first open
    runLoadGate(data).catch(() => dismissLoadGate());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => boot().catch(console.error));
  } else {
    boot().catch(console.error);
  }
})();
