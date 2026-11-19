(() => {
  document.querySelectorAll(".btn, .bf-cta, .mega-cart, .hero-caption-btn").forEach((el) => {
    if (el.querySelector(".btn-chip")) return;
    const text = [...el.childNodes].find((node) => node.nodeType === 3 && node.textContent.trim());
    if (!text) return;
    const icon = el.querySelector(":scope > .icon");
    const textLink = (el.classList.contains("btn-line") && !el.classList.contains("btn-block"))
      || (el.classList.contains("hero-caption-btn-line") && !icon);
    const chipHost = !textLink && (
      el.matches(".btn-dark, .btn-red, .mega-cart, .bf-cta, .hero-caption-btn-solid, .btn-block")
      || (el.classList.contains("hero-caption-btn") && icon)
    );
    if (!chipHost) return;
    const label = document.createElement("span");
    label.className = "btn-label";
    label.textContent = text.textContent.trim();
    text.replaceWith(label);
    const chip = document.createElement("span");
    chip.className = "btn-chip";
    chip.setAttribute("aria-hidden", "true");
    const glyph = document.createElement("span");
    glyph.className = icon ? "btn-glyph" : "btn-glyph btn-glyph-arrow";
    if (icon) glyph.append(icon);
    chip.append(glyph);
    el.append(chip);
  });

  document.querySelectorAll(".sg-scroll form").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
  });

  document.querySelectorAll(".sg-scroll .mega").forEach((mega) => {
    const branches = [...mega.querySelectorAll(".mega-branch")];
    const first = branches.find((branch) => branch.querySelector(".mega-kids")) || branches[0];
    const setCurrent = (branch) => {
      branches.forEach((item) => item.classList.toggle("is-current", item === branch));
    };
    if (first) setCurrent(first);
    branches.forEach((branch) => {
      branch.addEventListener("mouseenter", () => setCurrent(branch));
      branch.addEventListener("focusin", () => setCurrent(branch));
    });
  });

  const heroSlider = document.querySelector("[data-hero-slider]");
  if (!heroSlider) return;
  const viewport = heroSlider.querySelector(".hero-slider-viewport");
  const track = heroSlider.querySelector(".hero-slider-track");
  const slides = [...track.children];
  const dots = [...heroSlider.querySelectorAll("[data-hero-go]")];
  let heroIndex = 0;
  let heroDrag = 0;
  let heroGrab = null;
  const wrapDiff = (diff) => {
    const count = slides.length;
    let value = ((diff % count) + count) % count;
    if (value > count / 2) value -= count;
    return value;
  };
  const placeHero = () => {
    let nearest = heroIndex;
    let nearestDistance = Infinity;
    const offsets = slides.map((_, index) => {
      const offset = wrapDiff(index - heroIndex) - heroDrag;
      const distance = Math.abs(offset);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
      return offset;
    });
    slides.forEach((slide, index) => {
      const offset = offsets[index];
      const distance = Math.abs(offset);
      const current = index === nearest;
      const amount = Math.min(distance, 1);
      const towardNext = offset > 0;
      const tx = ((towardNext ? 5 : -5) / 100) * slide.offsetWidth * amount;
      const tz = -200 * amount;
      const ry = (towardNext ? -100 : 100) * amount;
      slide.classList.toggle("is-current", current);
      slide.setAttribute("aria-hidden", current ? "false" : "true");
      slide.style.zIndex = String(20 - Math.round(distance));
      slide.style.pointerEvents = current && !heroGrab ? "auto" : "none";
      if (amount > 0.001) slide.style.transformOrigin = towardNext ? "right center" : "left center";
      slide.style.opacity = distance > 1 ? "0" : "1";
      slide.style.setProperty("--hero-shade", offset < 0 ? String(amount) : "0");
      slide.style.transform = `perspective(1200px) translate3d(${tx}px, 0px, ${tz}px) rotateX(0deg) rotateY(${ry}deg) rotateZ(0deg)`;
    });
    track.style.height = `${slides[nearest].offsetHeight}px`;
    dots.forEach((dot, index) => {
      const on = index === nearest;
      dot.classList.toggle("is-on", on);
      if (on) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };
  const showHero = (next) => {
    heroIndex = ((next % slides.length) + slides.length) % slides.length;
    heroDrag = 0;
    heroSlider.classList.add("is-ready");
    placeHero();
  };
  const releaseHero = (event) => {
    if (!heroGrab || event.pointerId !== heroGrab.id) return;
    const moved = heroGrab.moved;
    const velocity = heroGrab.velocity;
    heroGrab = null;
    viewport.classList.remove("is-grabbing");
    slides.forEach((slide) => { slide.style.transition = ""; });
    let shift = 0;
    if (heroDrag > 0.5) shift = Math.max(1, Math.round(heroDrag));
    else if (heroDrag < -0.5) shift = Math.min(-1, Math.round(heroDrag));
    else if (heroDrag > 0.06 && velocity < -0.4) shift = 1;
    else if (heroDrag < -0.06 && velocity > 0.4) shift = -1;
    if (moved) viewport.dataset.heroSwiped = "1";
    showHero(heroIndex + shift);
  };
  viewport.addEventListener("dragstart", (event) => event.preventDefault());
  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || slides.length < 2) return;
    if (event.target.closest("button, .mega-cart")) return;
    heroGrab = {
      id: event.pointerId,
      x: event.clientX,
      drag: heroDrag,
      moved: false,
      velocity: 0,
      lastX: event.clientX,
      lastT: performance.now()
    };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-grabbing");
    slides.forEach((slide) => { slide.style.transition = "none"; });
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!heroGrab || event.pointerId !== heroGrab.id) return;
    const dx = event.clientX - heroGrab.x;
    if (Math.abs(dx) > 5) heroGrab.moved = true;
    const now = performance.now();
    const dt = now - heroGrab.lastT;
    if (dt > 0) heroGrab.velocity = (event.clientX - heroGrab.lastX) / dt;
    heroGrab.lastX = event.clientX;
    heroGrab.lastT = now;
    heroDrag = heroGrab.drag - dx / (viewport.offsetWidth || 1);
    placeHero();
  });
  viewport.addEventListener("pointerup", releaseHero);
  viewport.addEventListener("pointercancel", releaseHero);
  viewport.addEventListener("click", (event) => {
    if (viewport.dataset.heroSwiped !== "1") return;
    delete viewport.dataset.heroSwiped;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  heroSlider.querySelectorAll("[data-hero-dir]").forEach((button) => {
    button.addEventListener("click", () => showHero(heroIndex + Number(button.dataset.heroDir)));
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => showHero(Number(dot.dataset.heroGo)));
  });
  showHero(0);
})();
