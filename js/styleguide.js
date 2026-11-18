(() => {
  document.querySelectorAll(".btn, .bf-cta, .account-login, .account-register, .cart-outline").forEach((el) => {
    const text = [...el.childNodes].find((node) => node.nodeType === 3 && node.textContent.trim());
    if (!text || el.querySelector(".btn-clip")) return;
    const label = text.textContent.trim();
    const chars = [...label];
    const center = (chars.length - 1) / 2;
    const reach = Math.max(center, 1);
    const face = (hidden) => {
      const span = document.createElement("span");
      span.className = "btn-face";
      if (hidden) span.setAttribute("aria-hidden", "true");
      chars.forEach((char, index) => {
        const piece = document.createElement("span");
        piece.className = "btn-char";
        piece.textContent = char === " " ? "\u00a0" : char;
        piece.style.transitionDelay = `${(Math.abs(index - center) / reach * 0.18).toFixed(3)}s`;
        span.append(piece);
      });
      return span;
    };
    const clip = document.createElement("span");
    clip.className = "btn-clip";
    clip.setAttribute("aria-hidden", "true");
    clip.append(face(false), face(true));
    text.replaceWith(clip);
    if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) {
      el.setAttribute("aria-label", label);
    }
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
  const track = heroSlider.querySelector(".hero-slider-track");
  const slides = [...track.children];
  const dots = [...heroSlider.querySelectorAll("[data-hero-go]")];
  let heroIndex = 0;
  const showHero = (next) => {
    heroIndex = (next + slides.length) % slides.length;
    track.style.transform = `translateX(${-heroIndex * 100}%)`;
    dots.forEach((dot, index) => {
      const on = index === heroIndex;
      dot.classList.toggle("is-on", on);
      if (on) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };
  heroSlider.querySelectorAll("[data-hero-dir]").forEach((button) => {
    button.addEventListener("click", () => showHero(heroIndex + Number(button.dataset.heroDir)));
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => showHero(Number(dot.dataset.heroGo)));
  });
  showHero(0);
})();
