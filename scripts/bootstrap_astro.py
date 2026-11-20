"""One-time migration: split index.html and styles.css into Astro section files."""
from __future__ import annotations

import re
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "legacy-index.html"
if not INDEX.exists():
    INDEX = ROOT / "index.html"
STYLES = ROOT / "css" / "styles.css"
SECTIONS_DIR = ROOT / "src" / "components" / "sections"
STYLES_DIR = ROOT / "src" / "styles" / "sections"


def slug_to_component(slug: str) -> str:
    parts = re.split(r"[-_]", slug)
    return "".join(p[:1].upper() + p[1:] for p in parts if p)


def strip_html_comments(html: str) -> str:
    return re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)


def extract_main_sections(html: str) -> list[tuple[str, str]]:
    main_m = re.search(r'<main[^>]*>(.*)</main>', html, re.DOTALL)
    if not main_m:
        raise SystemExit("Could not find <main>")
    main_inner = strip_html_comments(main_m.group(1)).strip()
    pattern = re.compile(
        r"<section\b([^>]*)>(.*?)</section>",
        re.DOTALL | re.IGNORECASE,
    )
    sections: list[tuple[str, str]] = []
    for m in pattern.finditer(main_inner):
        attrs = m.group(1)
        body = m.group(2).strip()
        class_m = re.search(r'class="([^"]*)"', attrs)
        id_m = re.search(r'id="([^"]*)"', attrs)
        classes = (class_m.group(1) if class_m else "").split()
        primary = classes[0] if classes else (id_m.group(1) if id_m else f"section-{len(sections)}")
        name = slug_to_component(primary.replace(" ", "-"))
        full = f"<section{attrs}>\n{body}\n</section>"
        sections.append((name, full))
    return sections


def extract_fragment(html: str, start_pat: str, end_pat: str) -> str:
    start = re.search(start_pat, html, re.DOTALL | re.IGNORECASE)
    if not start:
        raise SystemExit(f"Pattern not found: {start_pat}")
    rest = html[start.start() :]
    end = re.search(end_pat, rest, re.DOTALL | re.IGNORECASE)
    if not end:
        return rest.strip()
    return rest[: end.start()].strip()


def fix_asset_urls(css: str) -> str:
    return css.replace('url("../assets/', 'url("/assets/')


def write_section_css(lines: list[str], ranges: list[tuple[str, int, int]]) -> None:
    STYLES_DIR.mkdir(parents=True, exist_ok=True)
    for filename, start, end in ranges:
        chunk = "".join(lines[start - 1 : end])
        chunk = fix_asset_urls(chunk)
        (STYLES_DIR / filename).write_text(chunk, encoding="utf-8")


def astro_file(name: str, css_file: str | None, html: str) -> str:
    front = "---\n"
    if css_file:
        front += f'import "../../styles/sections/{css_file}";\n'
    front += "---\n\n"
    return front + html.strip() + "\n"


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    style_lines = STYLES.read_text(encoding="utf-8").splitlines(keepends=True)

    SECTIONS_DIR.mkdir(parents=True, exist_ok=True)

    skip = extract_fragment(html, r'<a class="skip"', r"\s*<header")
    header = extract_fragment(html, r"<header\b", r"</header>\s*")
    footer = extract_fragment(html, r"<footer\b", r"</footer>\s*")
    overlay = extract_fragment(html, r'<div class="overlay"', r'<aside class="cart"')
    cart = extract_fragment(html, r'<aside class="cart"', r'<div class="cookie"')
    cookie = extract_fragment(html, r'<div class="cookie"', r"\s*<script")

    main_sections = extract_main_sections(html)

    pieces: list[tuple[str, str | None, str]] = [
        ("SkipLink", None, skip),
        ("Header", "header.css", header),
    ]
    css_map = {
        "Hero": "hero.css",
        "CatPicks": "cat-picks.css",
        "PrintGuide": "print-guide.css",
        "BrandSpot": "brand-spot.css",
        "Logos": "logos.css",
        "Trust": "trust.css",
        "About": "about.css",
        "Benefits": "benefits.css",
        "QuoteBanner": "quote-banner.css",
        "Features": "features.css",
        "Pricing": "pricing.css",
        "Testimonials": "testimonials.css",
        "Makers": "makers.css",
        "WhyGet3d": "why-get3d.css",
        "Faq": "faq.css",
    }
    for name, fragment in main_sections:
        css = css_map.get(name)
        pieces.append((name, css, fragment))

    pieces.extend(
        [
            ("Footer", "footer.css", footer),
            ("SiteOverlay", "cart.css", overlay),
            ("CartDrawer", "cart.css", cart),
            ("CookieConsent", "cookies.css", cookie),
        ]
    )

    for name, css_file, fragment in pieces:
        (SECTIONS_DIR / f"{name}.astro").write_text(
            astro_file(name, css_file, fragment),
            encoding="utf-8",
        )

    (ROOT / "src" / "styles").mkdir(parents=True, exist_ok=True)

    # global.css: tokens, reset, shared UI
    global_css = fix_asset_urls("".join(style_lines[:416]))
    (ROOT / "src" / "styles" / "global.css").write_text(global_css, encoding="utf-8")

    responsive_start = next(
        (i + 1 for i, line in enumerate(style_lines) if line.startswith("@media (max-width: 1180px)")),
        len(style_lines),
    )
    responsive_css = fix_asset_urls("".join(style_lines[responsive_start - 1 :]))
    (ROOT / "src" / "styles" / "responsive.css").write_text(responsive_css, encoding="utf-8")

    faq_styles_start = next(
        i + 1 for i, line in enumerate(style_lines) if line.startswith(".faq {")
    )
    why_styles_start = next(
        i + 1 for i, line in enumerate(style_lines) if "/* Dlaczego get3D */" in line
    )
    css_ranges: list[tuple[str, int, int]] = [
        ("header.css", 417, 1504),
        ("hero.css", 1505, 1838),
        ("cat-picks.css", 1839, 1901),
        ("print-guide.css", 1902, 1977),
        ("brand-spot.css", 1978, 2266),
        ("logos.css", 2267, 2301),
        ("trust.css", 2302, 2371),
        ("about.css", 2372, 2408),
        ("benefits.css", 2409, 2436),
        ("quote-banner.css", 2437, 2459),
        ("features.css", 2460, 2532),
        ("pricing.css", 2533, 2626),
        ("testimonials.css", 2627, 2661),
        ("makers.css", 2663, faq_styles_start - 1),
        ("faq.css", faq_styles_start, why_styles_start - 1),
        ("why-get3d.css", why_styles_start, 3193),
        ("footer.css", 3217, 3402),
        ("cookies.css", 3403, 3586),
        ("cart.css", 3587, responsive_start - 1),
    ]
    write_section_css(style_lines, css_ranges)

    print(f"Wrote {len(pieces)} section components to {SECTIONS_DIR}")
    print(f"Wrote CSS to {STYLES_DIR} + global + responsive")


if __name__ == "__main__":
    main()