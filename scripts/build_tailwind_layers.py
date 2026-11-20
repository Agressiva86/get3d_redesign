"""Split legacy styles.css into Tailwind v4 layer files (@theme, @layer base/components)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "css" / "styles.css"
OUT = ROOT / "src" / "styles" / "tailwind"

# Sekcje przepisane na utilities w .astro — nie generujemy dla nich warstwy components.
TAILWIND_MARKUP = frozenset({"skip-link"})

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


def fix_urls(text: str) -> str:
    return text.replace('url("../assets/', 'url("/assets/')


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

    root_tokens = "".join(lines[65:139])
    typography = apply_base_enhancements("".join(lines[139:181]))
    layout = "".join(lines[183:196])
    primitives = "".join(lines[196:416])
    write(OUT / "base.css", wrap("base", root_tokens + typography))
    write(OUT / "components" / "layout.css", wrap("components", layout))
    write(OUT / "components" / "primitives.css", wrap("components", primitives))

    sections: list[tuple[str, int, int]] = [
        ("header", 416, 1504),
        ("hero", 1504, 1838),
        ("cat-picks", 1838, 1901),
        ("print-guide", 1901, 1977),
        ("brand-spot", 1977, 2266),
        ("logos", 2266, 2301),
        ("trust", 2301, 2371),
        ("about", 2371, 2408),
        ("benefits", 2408, 2436),
        ("quote-banner", 2436, 2459),
        ("features", 2459, 2532),
        ("pricing", 2532, 2626),
        ("testimonials", 2626, 2661),
        ("makers", 2661, why_start),
        ("why-get3d", why_start, faq_start),
        ("faq", faq_start, cta_start),
        ("footer", 3216, 3402),
        ("cookies", 3402, 3586),
        ("cart", 3586, responsive_start),
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
    ]
    for name, _, _ in sections:
        imports.append(f'@import "./components/{name}.css";')
    imports.append('@import "./responsive.css";')
    write(OUT / "index.css", "\n".join(imports) + "\n")

    print(f"Wrote Tailwind layers to {OUT} ({len(sections)} component files)")


if __name__ == "__main__":
    main()