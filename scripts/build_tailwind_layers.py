"""Split legacy styles.css into Tailwind v4 layer files (@theme, @layer base/components)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "css" / "styles.css"
OUT = ROOT / "src" / "styles" / "tailwind"

# Sekcje przepisane na utilities w .astro — nie generujemy dla nich warstwy components.
TAILWIND_MARKUP = frozenset({
    "skip-link",
    "header",
    "cat-picks",
    "bestsellery",
    "print-guide",
    "why-get3d",
    "hero",
    "brand-spot",
    "makers",
    "faq",
    "footer",
    "cookies",
    "cart",
})

# Sidecar CSS (niewyciągane z styles.css) — import po danym slug-u sekcji.
SECTION_INTERACTIONS = {
    "cat-picks": ("bestsellery.css", "bestsellery-interactions.css"),
    "brand-spot": ("brand-spot-primitives.css",),
    "faq": ("faq-interactions.css",),
    "cookies": ("cookies-interactions.css",),
    "cart": ("cart-interactions.css",),
}

# Sekcje usunięte z witryny — nie generuj CSS.
REMOVED_SECTIONS = frozenset(
    {
        "logos",
        "about",
        "benefits",
        "trust",
        "features",
        "testimonials",
        "quote-banner",
        "pricing",
    }
)


# Zgodne z astro.config.mjs → base (Vite przy url(../assets/) źle liczy ścieżkę względem src/styles/).
DEPLOY_BASE = "/get3d_redesign/"


def fix_urls(text: str) -> str:
    """Absolutne URL-e assetów pod GitHub Pages (base + public/assets)."""
    abs_url = f'url("{DEPLOY_BASE}assets/'
    abs_url_sq = f"url('{DEPLOY_BASE}assets/"
    for old in (
        'url("../assets/',
        'url("./assets/',
        'url("/assets/',
        "url('../assets/",
        "url('./assets/",
        "url('/assets/",
    ):
        if old.startswith('url("'):
            text = text.replace(old, abs_url)
        else:
            text = text.replace(old, abs_url_sq)
    return text


def fix_sidecar_assets() -> None:
    """Pliki sidecar nie są generowane z styles.css — napraw absolutne url(/assets/)."""
    for rel in (
        "components/header-icons.css",
        "components/header-interactions.css",
        "components/brand-spot-primitives.css",
        "components/faq-interactions.css",
        "components/cookies-interactions.css",
        "components/cart-interactions.css",
    ):
        path = OUT / rel
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        fixed = fix_urls(text)
        if fixed != text:
            path.write_text(fixed, encoding="utf-8")


def apply_base_enhancements(typography_block: str) -> str:
    """Map element defaults to Tailwind utilities where it stays readable."""
    return typography_block.replace(
        """body {
  margin: 0;
  background: #fff;
  color: var(--gray);
  font-family: var(--sans);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.6;
}""",
        """body {
  @apply m-0 bg-white font-sans text-base font-light leading-relaxed text-stone-600;
}""",
    ).replace(
        """h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading);
  font-weight: 600;
  letter-spacing: 0;
  color: var(--ink);
  margin: 0;
}""",
        """h1, h2, h3, h4, h5, h6 {
  @apply m-0 font-[family-name:var(--font-heading)] font-semibold tracking-normal text-ink;
}""",
    ).replace(
        """.skip {
  position: absolute;
  left: 12px;
  top: 12px;
  transform: translateY(-150%);
  background: var(--ink);
  color: #fff;
  padding: 8px 12px;
  z-index: 80;
}
.skip:focus { transform: none; }""",
        """.skip {
  @apply absolute left-3 top-3 z-80 bg-ink px-3 py-2 text-white;
  transform: translateY(-150%);
}
.skip:focus { @apply translate-y-0; }""",
    )


def wrap(layer: str, body: str) -> str:
    body = body.strip()
    if not body:
        return ""
    return f"@layer {layer} {{\n{body}\n}}\n"


def write(path: Path, content: str) -> None:
    if not content.strip():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def main() -> None:
    lines = fix_urls(SRC.read_text(encoding="utf-8")).splitlines(keepends=True)
    n = len(lines)

    responsive_start = next(
        i for i, line in enumerate(lines)
        if line.startswith("@media (max-width: 1180px)")
    )
    why_start = next(i for i, line in enumerate(lines) if "/* Dlaczego get3D */" in line)
    faq_start = next(i for i, line in enumerate(lines) if line.startswith(".faq {"))
    cta_start = next(i for i, line in enumerate(lines) if "/* CTA */" in line)
    footer_start = next(i for i, line in enumerate(lines) if "/* Footer */" in line)
    cookies_start = next(i for i, line in enumerate(lines) if "/* Cookies */" in line)
    cart_start = next(
        i for i, line in enumerate(lines) if line.startswith(".overlay {") or "/* Cart */" in line
    )

    fonts = "".join(lines[0:65])
    write(OUT / "fonts.css", fonts)

    theme = """@theme {
  --font-sans: "Geist", Arial, sans-serif;
  --font-heading: "Familjen Grotesk", "Geist", Arial, sans-serif;
  --font-display: "Geist", Arial, sans-serif;
  --font-serif: "Geist", Arial, sans-serif;

  --color-stone-50: #faf9fa;
  --color-stone-100: #f4f3f6;
  --color-stone-200: #e7e5ea;
  --color-stone-300: #d4d1da;
  --color-stone-400: #a49caf;
  --color-stone-500: #786d88;
  --color-stone-600: #5a4c6d;
  --color-stone-700: #48395d;
  --color-stone-800: #2d1b42;
  --color-stone-850: #27143c;
  --color-stone-900: #220d37;
  --color-stone-950: #150029;

  --color-red-50: #fff1f1;
  --color-red-100: #ffe1e2;
  --color-red-200: #fdcacb;
  --color-red-300: #f9a6aa;
  --color-red-400: #ee747e;
  --color-red-500: #e1415a;
  --color-red-600: #cf3b52;
  --color-red-700: #ac3043;
  --color-red-800: #912637;
  --color-red-900: #7b1f2e;
  --color-red-950: #430d15;

  --color-accent: #e1415a;
  --color-accent-deep: #cf3b52;
  --color-ink: #150029;
  --color-ink-soft: #2d1b42;
  --color-paper: #ffffff;

  --breakpoint-nav: 61.25rem;
  --breakpoint-lg: 73.75rem;
  --breakpoint-xl: 93.75rem;

  --radius-get3d: 0.5rem;
  --radius-card: 1.375rem;
  --radius-btn: 1.375rem;

  --shadow-get3d: 0 18px 50px rgb(21 0 41 / 0.08);
  --header-height: 12.25rem;
  --container-get3d: 93.75rem;
}
"""
    write(OUT / "theme.css", theme)

    def line_index(pred) -> int:
        return next(i for i, line in enumerate(lines) if pred(line))

    header_start = line_index(lambda l: l.startswith("/* Header */"))
    hero_start = line_index(lambda l: l.startswith("/* Hero */"))
    cat_picks_start = line_index(lambda l: l.startswith(".cat-picks {"))
    print_guide_start = line_index(lambda l: "/* Wybór drukarki */" in l)
    brand_spot_start = line_index(lambda l: l.startswith(".brand-spot {"))
    marquee_start = line_index(lambda l: l.startswith("/* Marquee"))
    trust_start = line_index(lambda l: l.startswith("/* Trust */"))
    about_start = line_index(lambda l: l.startswith("/* About */"))
    benefits_start = line_index(lambda l: l.startswith("/* Benefits */"))
    quote_banner_start = line_index(lambda l: l.startswith(".quote-banner {"))
    features_start = line_index(lambda l: l.startswith("/* Features */"))
    pricing_start = line_index(lambda l: l.startswith("/* Pricing */"))
    testimonials_start = line_index(lambda l: l.startswith("/* Testimonials */"))
    makers_start = line_index(lambda l: l.startswith(".makers {"))
    faq_block_start = line_index(lambda l: l.startswith(".faq {"))

    root_tokens = "".join(lines[65:139])
    typography = apply_base_enhancements("".join(lines[139:181]))
    layout = "".join(lines[183:196])
    primitives = "".join(lines[196:header_start])
    write(OUT / "base.css", wrap("base", root_tokens + typography))
    write(OUT / "components" / "layout.css", wrap("components", layout))
    write(OUT / "components" / "primitives.css", wrap("components", primitives))

    sections: list[tuple[str, int, int]] = [
        ("header", header_start, hero_start),
        ("hero", hero_start, cat_picks_start),
        ("cat-picks", cat_picks_start, print_guide_start),
        ("print-guide", print_guide_start, brand_spot_start),
        ("brand-spot", brand_spot_start, marquee_start),
        ("logos", marquee_start, trust_start),
        ("trust", trust_start, about_start),
        ("about", about_start, benefits_start),
        ("benefits", benefits_start, quote_banner_start),
        ("quote-banner", quote_banner_start, features_start),
        ("features", features_start, pricing_start),
        ("pricing", pricing_start, testimonials_start),
        ("testimonials", testimonials_start, makers_start),
        ("makers", makers_start, why_start),
        ("why-get3d", why_start, faq_block_start),
        ("faq", faq_block_start, cta_start),
        ("footer", footer_start, cookies_start),
        ("cookies", cookies_start, cart_start),
        ("cart", cart_start, responsive_start),
    ]

    comp_dir = OUT / "components"
    for name, start, end in sections:
        if name in REMOVED_SECTIONS:
            write(comp_dir / f"{name}.css", f"/* Sekcja usunięta: {name} */\n")
            continue
        if name in TAILWIND_MARKUP:
            write(
                comp_dir / f"{name}.css",
                f"/* Przeniesione do utilities: sections/{name.replace('-', '')} lub osobny plik */\n",
            )
            continue
        chunk = "".join(lines[start:end])
        write(comp_dir / f"{name}.css", wrap("components", chunk))

    responsive = "".join(lines[responsive_start:n])
    write(OUT / "responsive.css", wrap("components", responsive))

    imports = [
        '@import "./theme.css";',
        '@import "./fonts.css";',
        '@import "./base.css";',
        '@import "./components/layout.css";',
        '@import "./components/primitives.css";',
        '@import "./components/header-icons.css";',
        '@import "./components/header-interactions.css";',
    ]
    for name, _, _ in sections:
        imports.append(f'@import "./components/{name}.css";')
        for extra in SECTION_INTERACTIONS.get(name, ()):
            imports.append(f'@import "./components/{extra}";')
    imports.append('@import "./responsive.css";')
    write(OUT / "index.css", "\n".join(imports) + "\n")

    fix_sidecar_assets()

    print(f"Wrote Tailwind layers to {OUT} ({len(sections)} component files)")


if __name__ == "__main__":
    main()