# Migracja na utilities Tailwind

## Wzorzec (jak w dokumentacji Tailwind)

```html
<section class="py-24">
  <div class="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-12 px-[30px] nav:grid-cols-2">
    …
  </div>
</section>
```

- Kontener: `mx-auto w-full max-w-[1500px] px-[30px] max-nav:px-3`
- Breakpoint sklepu: `nav:` (≥980px), `max-nav:` (<980px) — `src/styles/app.css`
- **Ikony / przyciski z JS:** tymczasowo zostaw `.icon`, `.btn`, `.btn-red`, `.btn-line`

## Sekcje gotowe (utilities w markup)

- `SkipLink.astro`

Po przepisaniu sekcji dopisz jej slug do `TAILWIND_MARKUP` w `scripts/build_tailwind_layers.py` i uruchom `npm run sync:css`.

## Kolejność sugerowana

1. CatPicks, QuoteBanner, PrintGuide  
2. Pricing, Testimonials, WhyGet3d  
3. Features, Faq, Makers  
4. BrandSpot, Hero  
5. Header, Footer, Cart, Cookies (najbardziej złożone)