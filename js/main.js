(() => {
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger");
  const navCats = document.getElementById("nav-cats");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerBody = document.querySelector(".drawer-body");
  const mobileNav = () => window.matchMedia("(max-width: 980px)").matches;
  const pln = new Intl.NumberFormat("pl-PL");
  const accountPop = document.getElementById("account-pop");
  const loginForm = document.getElementById("login-form");
  const accountGuest = document.getElementById("account-guest");
  const accountOpen = document.getElementById("account-open");
  const accountTool = document.getElementById("account-tool");
  const loginSubmit = loginForm.querySelector("button[type=submit]");

  document.querySelectorAll(".btn, .bf-cta, .add-mini, .account-login, .account-register, .cart-outline, .mega-cart").forEach((el) => {
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

  const modelLimit = 8;
  document.querySelectorAll(".mega-kids").forEach((list) => {
    const links = [...list.querySelectorAll(":scope > a:not(.mega-more)")];
    if (links.length <= modelLimit) return;
    const extra = links.slice(modelLimit);
    extra.forEach((link) => link.classList.add("is-extra"));
    const more = document.createElement("a");
    more.className = "mega-more";
    more.href = links[0].getAttribute("href") || "#drukarki";
    const label = document.createElement("span");
    label.textContent = "Więcej...";
    const count = document.createElement("span");
    count.className = "mega-more-count";
    count.textContent = `+${extra.length}`;
    more.append(label, count);
    list.append(more);
  });

  document.querySelectorAll("[data-since]").forEach((node) => {
    const years = new Date().getFullYear() - Number(node.dataset.since);
    node.textContent = years === 1 ? "1 roku" : `${Math.max(years, 0)} lat`;
  });

  const closeDrops = () => {
    document.querySelectorAll(".drop").forEach((drop) => {
      window.clearTimeout(drop._closeTimer);
      drop.classList.remove("is-open");
      drop.querySelector(".drop-btn")?.setAttribute("aria-expanded", "false");
    });
    if (drawerTitle) drawerTitle.textContent = "Menu";
    syncNav();
  };
  const catBar = document.querySelector(".cat-bar");
  const clearCompactBar = () => {
    if (catBar) catBar.style.minHeight = "";
    navCats?.querySelectorAll(".drop-panel").forEach((panel) => {
      panel.style.height = "";
    });
  };
  const compactPanels = () => navCats?.querySelectorAll(".drawer-body > .drop > .drop-panel") || [];
  const measureCompactHeight = () => {
    if (!catBar || !navCats) return 0;
    const barMin = catBar.style.minHeight;
    catBar.style.minHeight = "";
    let max = catBar.offsetHeight;
    compactPanels().forEach((panel) => {
      const height = panel.style.height;
      const display = panel.style.display;
      const visibility = panel.style.visibility;
      panel.style.height = "auto";
      panel.style.visibility = "hidden";
      panel.style.display = "block";
      max = Math.max(max, panel.offsetHeight);
      panel.style.height = height;
      panel.style.display = display;
      panel.style.visibility = visibility;
    });
    catBar.style.minHeight = barMin;
    return max;
  };
  const applyCompactHeight = () => {
    if (!catBar || !nav.classList.contains("is-compact") || !nav.classList.contains("is-open") || mobileNav()) return;
    const height = measureCompactHeight();
    if (!height) return;
    catBar.style.minHeight = `${height}px`;
    compactPanels().forEach((panel) => {
      panel.style.height = `${height}px`;
    });
  };
  const syncNav = () => {
    const sheet = mobileNav() && (
      nav.classList.contains("is-open") ||
      accountTool.classList.contains("is-open") ||
      document.getElementById("cart-tool")?.classList.contains("is-open") ||
      !!document.querySelector(".nav-tools .drop.is-open")
    );
    document.body.classList.toggle("nav-lock", sheet);
    if (navCats) navCats.inert = mobileNav() && !nav.classList.contains("is-open");
    if (!nav.classList.contains("is-open") || !nav.classList.contains("is-compact")) clearCompactBar();
  };
  syncNav();
  const closeAccount = () => {
    accountTool.classList.remove("is-open");
    accountOpen.setAttribute("aria-expanded", "false");
    syncNav();
  };
  const cartTool = document.getElementById("cart-tool");
  const cartOpenBtn = document.getElementById("cart-open");
  const closeCartPop = () => {
    cartTool.classList.remove("is-open");
    cartOpenBtn.setAttribute("aria-expanded", "false");
    syncNav();
  };
  const closeSheets = () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };
  const openCartPop = () => {
    closeDrops();
    closeAccount();
    closeSheets();
    cartTool.classList.add("is-open");
    cartOpenBtn.setAttribute("aria-expanded", "true");
    syncNav();
  };

  const tone = document.querySelector(".tone-btn");
  const accountTone = document.getElementById("account-tone");
  const toneState = document.getElementById("tone-state");
  const setTone = (on) => {
    document.body.classList.toggle("is-soft", on);
    tone?.setAttribute("aria-pressed", String(on));
    accountTone?.setAttribute("aria-pressed", String(on));
    if (toneState) toneState.textContent = on ? "Włączone" : "Wyłączone";
  };
  tone?.addEventListener("click", () => setTone(!document.body.classList.contains("is-soft")));
  accountTone?.addEventListener("click", (event) => {
    event.stopPropagation();
    setTone(!document.body.classList.contains("is-soft"));
  });

  burger.addEventListener("click", () => {
    if (nav.classList.contains("is-compact") && !mobileNav()) return;
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    if (open) {
      closeAccount();
      closeCartPop();
    } else {
      closeDrops();
    }
    syncNav();
  });

  document.querySelector(".drawer-close")?.addEventListener("click", (event) => {
    event.stopPropagation();
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    closeDrops();
    syncNav();
  });
  document.querySelector(".nav-shade")?.addEventListener("click", () => {
    closeSheets();
    closeDrops();
    closeAccount();
    closeCartPop();
  });
  document.querySelector(".drawer-back")?.addEventListener("click", (event) => {
    event.stopPropagation();
    closeDrops();
  });
  window.matchMedia("(max-width: 980px)").addEventListener("change", () => {
    if (!mobileNav()) {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      closeDrops();
    } else {
      nav.classList.remove("is-compact");
      document.querySelectorAll(".nav-cats .drop-panel").forEach((panel) => {
        panel.style.left = "";
        panel.style.top = "";
      });
    }
    syncNav();
  });

  document.querySelectorAll(".nav-cats .mega").forEach((mega) => {
    const drop = mega.closest(".drop");
    const branches = [...mega.querySelectorAll(".mega-branch")];
    const first = branches.find((branch) => branch.querySelector(".mega-kids")) || branches[0];
    if (!first) return;
    let current = first;
    let pending = null;
    let timer = 0;
    let trail = [];

    const setCurrent = (branch) => {
      current = branch;
      pending = null;
      branches.forEach((item) => item.classList.toggle("is-current", item === branch));
    };
    setCurrent(first);

    const towardSubmenu = () => {
      if (trail.length < 2) return false;
      const rect = current.querySelector(".mega-kids")?.getBoundingClientRect();
      const origin = trail[0];
      const last = trail[trail.length - 1];
      const vectorX = last.x - origin.x;
      const vectorY = last.y - origin.y;
      if (!rect || rect.width < 8 || vectorX < 3) return false;
      const yAt = origin.y + vectorY * ((rect.left - origin.x) / vectorX);
      return yAt >= rect.top - 48 && yAt <= rect.bottom + 48;
    };

    const schedule = (branch) => {
      if (mobileNav() || branch === current) {
        if (pending === branch) {
          window.clearTimeout(timer);
          pending = null;
        }
        return;
      }
      window.clearTimeout(timer);
      pending = branch;
      const delay = towardSubmenu(branch) ? 480 : 45;
      timer = window.setTimeout(() => setCurrent(branch), delay);
    };

    branches.forEach((branch) => {
      branch.addEventListener("mouseenter", () => schedule(branch));
      branch.addEventListener("mousemove", () => {
        if (branch !== current && towardSubmenu(branch)) schedule(branch);
      });
      branch.addEventListener("mouseleave", () => {
        if (pending === branch) {
          window.clearTimeout(timer);
          pending = null;
        }
      });
    });

    mega.querySelectorAll(".mega-kids").forEach((kids) => {
      kids.addEventListener("mouseenter", () => {
        window.clearTimeout(timer);
        pending = null;
      });
    });

    drop.addEventListener("mousemove", (event) => {
      const now = performance.now();
      trail.push({ x: event.clientX, y: event.clientY, t: now });
      trail = trail.filter((point) => now - point.t < 160);
    }, true);
    drop.addEventListener("mouseleave", () => {
      window.clearTimeout(timer);
      pending = null;
      trail = [];
      setCurrent(first);
    });
  });

  const placeCatPanel = (drop) => {
    const panel = drop.querySelector(".drop-panel");
    if (!panel || !navCats) return;
    if (mobileNav()) {
      panel.style.left = "";
      panel.style.top = "";
      panel.style.height = "";
      return;
    }
    if (nav.classList.contains("is-compact")) {
      panel.style.height = "";
      if (catBar) catBar.style.minHeight = "";
      const parent = panel.offsetParent || navCats;
      const parentRect = parent.getBoundingClientRect();
      const barRect = catBar.getBoundingClientRect();
      panel.style.top = `${barRect.top - parentRect.top}px`;
      panel.style.left = `${barRect.right - parentRect.left}px`;
      applyCompactHeight();
      return;
    }
    panel.style.height = "";
    panel.style.top = `${catBar.getBoundingClientRect().bottom - navCats.getBoundingClientRect().top}px`;
    clearCompactBar();
    const navRect = navCats.getBoundingClientRect();
    const buttonRect = drop.querySelector(".drop-btn").getBoundingClientRect();
    const width = Math.min(panel.querySelector(".mega-feature") ? 680 : 340, navRect.width);
    let left = buttonRect.left - navRect.left;
    const limit = navRect.width - width;
    if (left > limit) left = Math.max(0, limit);
    panel.style.left = `${Math.max(0, left)}px`;
  };

  document.querySelectorAll(".nav-cats .drop").forEach((drop) => {
    drop.addEventListener("mouseenter", () => {
      if (nav.classList.contains("is-menu-quiet")) return;
      placeCatPanel(drop);
      if (mobileNav() || nav.classList.contains("is-compact")) return;
      window.clearTimeout(drop._closeTimer);
      document.querySelectorAll(".nav-cats .drop").forEach((other) => {
        if (other === drop) return;
        window.clearTimeout(other._closeTimer);
        other.classList.remove("is-open");
        other.querySelector(".drop-btn")?.setAttribute("aria-expanded", "false");
      });
      drop.classList.add("is-open");
      drop.querySelector(".drop-btn")?.setAttribute("aria-expanded", "true");
    });
    drop.addEventListener("mouseleave", () => {
      if (mobileNav() || nav.classList.contains("is-compact")) return;
      window.clearTimeout(drop._closeTimer);
      drop._closeTimer = window.setTimeout(() => {
        if (drop.matches(":hover")) return;
        drop.classList.remove("is-open");
        drop.querySelector(".drop-btn")?.setAttribute("aria-expanded", "false");
      }, 420);
    });
  });
  document.querySelectorAll(".nav-cats .nav-link").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (!nav.classList.contains("is-compact")) return;
      applyCompactHeight();
    });
  });
  navCats?.addEventListener("mouseleave", clearCompactBar);
  window.addEventListener("resize", () => {
    document.querySelectorAll(".nav-cats .drop").forEach(placeCatPanel);
  });

  document.querySelectorAll(".drop").forEach((drop) => {
    const button = drop.querySelector(".drop-btn");
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !drop.classList.contains("is-open");
      closeDrops();
      closeAccount();
      closeCartPop();
      drop.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      if (drawerBody) drawerBody.scrollTop = 0;
      if (drop.closest(".nav-cats") && drawerTitle) {
        drawerTitle.textContent = willOpen
          ? button.childNodes[0].textContent.trim()
          : "Menu";
      }
      if (willOpen && drop.closest(".nav-cats")) placeCatPanel(drop);
      if (willOpen && drop.closest(".nav-tools")) closeSheets();
      syncNav();
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav")) {
      closeSheets();
      syncNav();
    }
    if (!event.target.closest(".drop")) closeDrops();
    if (!event.target.closest("#account-tool")) closeAccount();
    if (!event.target.closest("#cart-tool")) closeCartPop();
    if (!event.target.closest(".nav-search")) {
      const pop = document.getElementById("search-pop");
      const field = document.getElementById("search-input");
      if (pop) pop.hidden = true;
      field?.setAttribute("aria-expanded", "false");
    }
  });

  let scrollAnchor = window.scrollY;
  let dockedHeight = nav.offsetHeight;
  const hideCompactMenu = () => {
    if (!nav.classList.contains("is-open")) return;
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    closeDrops();
    closeAccount();
    closeCartPop();
  };
  let compactMenuTimer = 0;
  const compactHover = () => nav.classList.contains("is-compact") && !mobileNav();
  const compactMenuHot = () =>
    burger.matches(":hover") ||
    burger.matches(":focus-visible") ||
    catBar?.matches(":hover") ||
    catBar?.matches(":focus-within");
  const openCompactMenu = () => {
    window.clearTimeout(compactMenuTimer);
    if (nav.classList.contains("is-menu-quiet") || !compactHover() || nav.classList.contains("is-open")) return;
    nav.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    closeAccount();
    closeCartPop();
    syncNav();
    applyCompactHeight();
  };
  const queueCompactMenuClose = () => {
    if (!compactHover()) return;
    window.clearTimeout(compactMenuTimer);
    compactMenuTimer = window.setTimeout(() => {
      if (compactMenuHot()) return;
      hideCompactMenu();
      syncNav();
    }, 280);
  };
  burger.addEventListener("mouseenter", openCompactMenu);
  burger.addEventListener("mouseleave", queueCompactMenuClose);
  burger.addEventListener("focus", openCompactMenu);
  burger.addEventListener("blur", queueCompactMenuClose);
  catBar?.addEventListener("mouseenter", openCompactMenu);
  catBar?.addEventListener("mouseleave", queueCompactMenuClose);
  const quietMenus = () => {
    nav.classList.add("is-menu-quiet");
    hideCompactMenu();
    closeDrops();
    closeAccount();
    closeCartPop();
    const pop = document.getElementById("search-pop");
    const field = document.getElementById("search-input");
    if (pop) pop.hidden = true;
    field?.setAttribute("aria-expanded", "false");
  };
  window.addEventListener("pointermove", () => {
    if (!nav.classList.contains("is-menu-quiet") || nav.matches(":hover")) return;
    nav.classList.remove("is-menu-quiet");
  });
  nav.addEventListener("pointerdown", () => nav.classList.remove("is-menu-quiet"));
  let compactTimer = 0;
  const hideDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 480;
  const lockHeaderSpace = () => {
    if (document.body.classList.contains("nav-fixed")) return;
    document.documentElement.style.setProperty("--nav-hold", `${nav.offsetHeight}px`);
    document.body.classList.add("nav-fixed");
  };
  const dockHeader = () => {
    window.clearTimeout(compactTimer);
    const formChanged = nav.classList.contains("is-compact");
    const parked = formChanged || nav.classList.contains("is-away") || document.body.classList.contains("nav-fixed");
    if (!parked) return;
    nav.classList.add("is-instant");
    nav.classList.remove("is-compact", "is-away");
    document.body.classList.remove("nav-fixed");
    clearCompactBar();
    if (formChanged) quietMenus();
    requestAnimationFrame(() => nav.classList.remove("is-instant"));
  };
  const beginHide = (mobile) => {
    if (mobile) {
      nav.classList.add("is-away");
      hideCompactMenu();
      return;
    }
    if (!nav.classList.contains("is-compact")) {
      lockHeaderSpace();
      quietMenus();
      nav.classList.add("is-away");
      window.clearTimeout(compactTimer);
      compactTimer = window.setTimeout(() => {
        if (!nav.classList.contains("is-away") || window.scrollY <= 4) return;
        nav.classList.add("is-compact");
        quietMenus();
      }, hideDelay);
      return;
    }
    nav.classList.add("is-away");
    hideCompactMenu();
  };
  const updateHeader = () => {
    const y = window.scrollY;
    if (y <= 4) {
      dockHeader();
      dockedHeight = nav.offsetHeight;
      scrollAnchor = y;
      return;
    }
    const parked = nav.classList.contains("is-away") || nav.classList.contains("is-compact");
    if (!parked) dockedHeight = nav.offsetHeight;
    if (y > scrollAnchor + 12) {
      if (!nav.classList.contains("is-away") && y >= dockedHeight) beginHide(mobileNav());
      else if (nav.classList.contains("is-away")) hideCompactMenu();
      scrollAnchor = y;
    } else if (y < scrollAnchor - 12) {
      if (nav.classList.contains("is-away")) {
        nav.classList.remove("is-away");
        if (!mobileNav() && !nav.classList.contains("is-compact")) {
          window.clearTimeout(compactTimer);
          dockHeader();
        }
      }
      scrollAnchor = y;
    }
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      closeDrops();
      closeAccount();
      closeCartPop();
      syncNav();
      const pop = document.getElementById("search-pop");
      const field = document.getElementById("search-input");
      if (pop) pop.hidden = true;
      field?.setAttribute("aria-expanded", "false");
    });
  });

  const catalog = [
    ["Drukarka get3D Pulse", "Drukarki 3D", "#cennik"],
    ["Drukarka get3D Forge", "Drukarki 3D", "#cennik"],
    ["Drukarka get3D Axis", "Drukarki 3D", "#cennik"],
    ["Bambu Lab", "Drukarki 3D", "#drukarki"],
    ["Formlabs", "Drukarki 3D / UV", "#drukarki"],
    ["PLA Matte", "Materiały", "#materialy"],
    ["PETG Pro", "Materiały", "#materialy"],
    ["ABS Tech", "Materiały", "#materialy"],
    ["Żywica Standard", "Materiały", "#materialy"],
    ["Dysza hartowana 0,4", "Akcesoria", "#akcesoria"],
    ["Stół PEI", "Akcesoria", "#akcesoria"],
    ["Suszarka filamentu", "Akcesoria", "#akcesoria"],
    ["Zestaw serwisowy", "Akcesoria", "#akcesoria"],
    ["Serwis maszyn", "Serwis", "#serwis"],
    ["Szkolenie operatorów", "Szkolenia", "#serwis"]
  ];
  const searchForm = document.querySelector(".nav-search");
  const searchInput = document.getElementById("search-input");
  const searchPop = document.getElementById("search-pop");
  const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
  const renderSearch = (query) => {
    const text = query.trim();
    const q = text.toLowerCase();
    if (q.length < 3) {
      searchPop.hidden = true;
      searchPop.innerHTML = "";
      searchInput.setAttribute("aria-expanded", "false");
      return;
    }
    const hits = catalog.filter((item) => `${item[0]} ${item[1]}`.toLowerCase().includes(q)).slice(0, 6);
    searchPop.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
    searchPop.innerHTML = hits.length
      ? hits.map((item) => `<a href="${item[2]}"><strong>${escapeHtml(item[0])}</strong><span>${escapeHtml(item[1])}</span></a>`).join("")
      : `<p>Brak pozycji dla „${escapeHtml(text)}”.</p>`;
  };
  searchInput.addEventListener("input", () => renderSearch(searchInput.value));
  searchInput.addEventListener("focus", () => renderSearch(searchInput.value));
  searchPop.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    searchPop.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
  });
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderSearch(searchInput.value);
    const first = searchPop.querySelector("a");
    if (first) first.click();
  });

  const showLogin = (mode) => {
    accountGuest.hidden = true;
    loginForm.hidden = false;
    loginSubmit.textContent = mode === "register" ? "Załóż konto" : "Zaloguj się";
  };
  const showAccount = (logged) => {
    accountGuest.hidden = logged;
    loginForm.hidden = true;
    document.getElementById("logout").hidden = !logged;
    accountOpen.classList.toggle("is-active", logged);
    accountTool.classList.add("is-open");
    accountOpen.setAttribute("aria-expanded", "true");
  };
  const openAccount = () => {
    closeDrops();
    closeCartPop();
    closeSheets();
    showAccount(Boolean(sessionStorage.getItem("get3d-user")));
    syncNav();
  };
  document.querySelectorAll("[data-close-sheet]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const tool = button.closest(".tool");
      if (tool?.id === "account-tool") closeAccount();
      else if (tool?.id === "cart-tool") closeCartPop();
      else if (tool?.classList.contains("drop")) {
        tool.classList.remove("is-open");
        tool.querySelector(".drop-btn")?.setAttribute("aria-expanded", "false");
        syncNav();
      }
    });
  });
  document.getElementById("show-login").addEventListener("click", () => showLogin("login"));
  document.getElementById("show-register").addEventListener("click", () => showLogin("register"));
  document.getElementById("login-back").addEventListener("click", () => {
    loginForm.hidden = true;
    accountGuest.hidden = false;
  });
  document.getElementById("account-home").addEventListener("click", () => {
    if (sessionStorage.getItem("get3d-user")) return;
    showLogin("login");
  });
  accountOpen.addEventListener("click", (event) => {
    event.stopPropagation();
    if (accountTool.classList.contains("is-open")) closeAccount();
    else openAccount();
  });
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(loginForm).get("email");
    sessionStorage.setItem("get3d-user", email);
    document.getElementById("login-note").textContent = "";
    showAccount(true);
  });
  document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem("get3d-user");
    loginForm.reset();
    showAccount(false);
  });
  if (sessionStorage.getItem("get3d-user")) accountOpen.classList.add("is-active");

  const billingButtons = document.querySelectorAll("[data-billing]");
  const setBilling = (mode) => {
    billingButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.billing === mode);
    });
    document.querySelectorAll("[data-buy]").forEach((node) => {
      const value = Number(node.dataset[mode]);
      node.textContent = pln.format(value);
    });
    document.querySelectorAll("[data-unit]").forEach((node) => {
      node.textContent = mode === "lease" ? "zł / mies." : "zł";
    });
  };
  billingButtons.forEach((button) => {
    button.addEventListener("click", () => setBilling(button.dataset.billing));
  });

  const tabs = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll("[data-panel]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        const on = item === tab;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-selected", String(on));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
    });
  });

  document.querySelectorAll(".acc button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".acc");
      const panel = item.parentElement;
      panel.querySelectorAll(".acc").forEach((other) => {
        other.classList.toggle("is-open", other === item && !item.classList.contains("is-open"));
      });
    });
  });

  const featureLinks = [...document.querySelectorAll(".feature-nav a")];
  const featureBlocks = featureLinks.map((link) => document.querySelector(link.getAttribute("href")));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      featureLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 });
  featureBlocks.forEach((block) => block && spy.observe(block));

  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const target = Number(node.dataset.count);
      const suffix = node.dataset.suffix || "";
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 900);
        const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        node.textContent = `${pln.format(value)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(node);
    });
  }, { threshold: 0.6 });
  counters.forEach((node) => countObserver.observe(node));

  const row = document.querySelector(".track-row");
  const slides = [...row.children];
  let index = 0;
  const visible = () => (window.innerWidth < 980 ? 1 : 2);
  const updateCarousel = () => {
    const max = Math.max(0, slides.length - visible());
    index = Math.max(0, Math.min(index, max));
    const width = slides[0].getBoundingClientRect().width + 16;
    row.style.transform = `translateX(${-index * width}px)`;
  };
  document.querySelectorAll("[data-slide]").forEach((button) => {
    button.addEventListener("click", () => {
      index += Number(button.dataset.slide);
      const max = Math.max(0, slides.length - visible());
      if (index > max) index = 0;
      if (index < 0) index = max;
      updateCarousel();
    });
  });
  window.addEventListener("resize", updateCarousel);

  const cart = [];
  const cartEl = document.getElementById("cart");
  const overlay = document.getElementById("overlay");
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEl = document.querySelector(".cart-count");

  const money = (value) => `${pln.format(value)} zł`;

  const renderCart = () => {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = String(count);
    countEl.dataset.count = String(count);
    const emptyPop = document.getElementById("cart-empty");
    const filledPop = document.getElementById("cart-filled");
    const miniEl = document.getElementById("cart-mini");
    emptyPop.hidden = cart.length > 0;
    filledPop.hidden = !cart.length;
    if (!cart.length) {
      itemsEl.innerHTML = '<p class="empty">Koszyk jest pusty. Dodaj drukarkę, filament albo akcesorium.</p>';
      miniEl.innerHTML = "";
    } else {
      itemsEl.innerHTML = cart.map((item) => `
        <div class="cart-line">
          <div>
            <strong>${item.name}</strong>
            <div class="qty">
              <button type="button" data-qty="${item.id}" data-dir="-1" aria-label="Zmniejsz">−</button>
              <span>${item.qty}</span>
              <button type="button" data-qty="${item.id}" data-dir="1" aria-label="Zwiększ">+</button>
            </div>
          </div>
          <div>
            <strong>${money(item.price * item.qty)}</strong>
            <button type="button" data-remove="${item.id}" aria-label="Usuń ${item.name}" style="display:block;margin-top:6px;border:0;background:none;color:#8b918e;font-weight:400">Usuń</button>
          </div>
        </div>
      `).join("");
      miniEl.innerHTML = cart.map((item) => `
        <div class="cart-mini-line">
          <span>${item.name}<small>${item.qty} szt.</small></span>
          <strong>${money(item.price * item.qty)}</strong>
        </div>
      `).join("");
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalEl.textContent = money(total);
  };

  const openCart = () => {
    cartEl.classList.add("is-open");
    cartEl.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
  };
  const closeCart = () => {
    cartEl.classList.remove("is-open");
    cartEl.setAttribute("aria-hidden", "true");
    overlay.classList.remove("is-open");
    setTimeout(() => { overlay.hidden = true; }, 200);
  };

  cartOpenBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (cartTool.classList.contains("is-open")) closeCartPop();
    else openCartPop();
  });
  document.getElementById("cart-login").addEventListener("click", (event) => {
    event.stopPropagation();
    closeCartPop();
    openAccount();
    accountOpen.focus();
  });
  document.getElementById("cart-go").addEventListener("click", (event) => {
    event.stopPropagation();
    closeCartPop();
    openCart();
    document.querySelector("[data-close-cart]").focus();
  });
  document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const categoryOpen = document.querySelector(".nav-cats .drop.is-open");
      if (categoryOpen && mobileNav()) {
        closeDrops();
        return;
      }
      if (nav.classList.contains("is-open")) {
        closeSheets();
        closeDrops();
      }
      closeAccount();
      closeCart();
      closeCartPop();
    }
  });

  document.body.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) {
      event.stopPropagation();
      const id = add.dataset.id;
      const found = cart.find((item) => item.id === id);
      if (found) found.qty += 1;
      else cart.push({ id, name: add.dataset.name, price: Number(add.dataset.price), qty: 1 });
      renderCart();
      openCartPop();
      return;
    }
    const qty = event.target.closest("[data-qty]");
    if (qty) {
      const item = cart.find((entry) => entry.id === qty.dataset.qty);
      item.qty += Number(qty.dataset.dir);
      if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
      renderCart();
      return;
    }
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      const index = cart.findIndex((entry) => entry.id === remove.dataset.remove);
      if (index >= 0) cart.splice(index, 1);
      renderCart();
    }
  });

  document.getElementById("checkout").addEventListener("submit", (event) => {
    event.preventDefault();
    const note = document.getElementById("order-note");
    if (!cart.length) {
      note.textContent = "Dodaj coś do koszyka, zanim wyślesz zamówienie.";
      return;
    }
    cart.splice(0, cart.length);
    renderCart();
    event.target.reset();
    note.textContent = "Zamówienie zapisane. Odezwiemy się z potwierdzeniem dostępności.";
  });

  document.getElementById("newsletter").addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElementById("news-note").textContent = "Adres jest na liście. Pierwszy list pójdzie z nowościami filamentów.";
    event.target.reset();
  });

  const heroSlider = document.querySelector("[data-hero-slider]");
  if (heroSlider) {
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
  }

  renderCart();
})();
