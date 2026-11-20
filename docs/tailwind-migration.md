# Migracja na utilities Tailwind

## Wzorzec (CatPicks / Tailwind v4)

```html
---
const rowClass = "mt-7 grid … max-[980px]:flex …";
---
<section class="pt-9 pb-7">
  <ul class={rowClass}>…</ul>
</section>
```

- Kontener: `mx-auto w-full max-w-[1500px] px-[30px]`
- Breakpointy: `max-[980px]:…`, w `app.css` także `nav:` / `max-nav:` (≥61.25rem)
- **Prymitywy globalne:** `.btn`, `.mini-link`, `.mega-price`, `.mega-cart` — `primitives.css`

## Sekcje na markup (utilities)

Wszystkie komponenty z `index.astro`:

| Sekcja | Plik | Uwagi |
|--------|------|--------|
| Skip link | `SkipLink.astro` | pełne utilities |
| Header | `Header.astro` | + `header-icons.css`, `header-interactions.css`. **Powłoka** (`.nav`, `.nav-top`, `.cat-bar`, `.burger`, wyszukiwarka) — tylko hooki klas; bez utilities (konflikt z `.is-compact` w `responsive.css`). |
| Hero | `Hero.astro` | + `<style>` dla `--hero-shade` / slider `.is-ready` |
| Cat picks | `CatPicks.astro` | wzorzec |
| Print guide | `PrintGuide.astro` | |
| Brand spot | `BrandSpot.astro` | + `brand-spot-primitives.css` (slidery, karty) |
| Makers | `Makers.astro` | |
| Why get3D | `WhyGet3d.astro` | |
| FAQ | `Faq.astro` | + `faq-interactions.css` (akordeon, pill tabs) |
| Footer | `Footer.astro` | |
| Overlay | `SiteOverlay.astro` | `[&.is-open]:…` |
| Cart | `CartDrawer.astro` | + `cart-interactions.css` (linie koszyka) |
| Cookies | `CookieConsent.astro` | + `cookies-interactions.css` (przełączniki) |

Sekcje nieużywane na stronie (about, pricing, …) — tylko stuby w warstwach CSS.

## Workflow

1. Przepisz markup na utilities w `.astro`.
2. Dodaj slug do `TAILWIND_MARKUP` w `scripts/build_tailwind_layers.py`.
3. Jeśli zostają stany JS / pseudo-elementy — dopisz plik w `SECTION_INTERACTIONS`.
4. `npm run sync:css` — regeneruje `src/styles/tailwind/` i `index.css`.
5. `npx astro build` — weryfikacja.

## Resztki legacy

`css/styles.css` i `responsive.css` nadal zawierają stare selektory (martwe po migracji) — można je stopniowo czyścić; nie są źródłem prawdy dla zmigrowanych sekcji.