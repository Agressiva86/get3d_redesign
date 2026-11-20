# get3D redesign (Astro + Tailwind v4)

## Struktura stylów (Tailwind)

```
src/styles/
  app.css                    # @import tailwindcss + warstwy
  tailwind/
    theme.css                # @theme — tokeny designu
    fonts.css                # @font-face
    base.css                 # @layer base (reset, :root, typografia + @apply)
    components/
      layout.css             # .wrap, .sheet
      primitives.css         # przyciski, .eyebrow, chipy
      header.css … cart.css  # jedna sekcja sklepu = jeden plik @layer components
    responsive.css             # @media na końcu kaskady
```

**Źródło prawdy dla CSS:** `css/styles.css` → generator warstw:

```bash
npm run sync:css     # python scripts/build_tailwind_layers.py
npm run build
```

Edycja stylów:

1. Zmień `css/styles.css` (lub bezpośrednio plik w `tailwind/components/` jeśli nie ma go w monolicie).
2. Uruchom `npm run sync:css` gdy edytujesz monolit.
3. W nowym kodzie preferuj **utility** z tokenów `@theme` (`text-stone-600`, `bg-accent`).

## Sekcje HTML

`src/components/sections/*.astro` — markup bez importów CSS (style z `app.css`).

## Komendy

```bash
npm install
npm run dev
npm run build
```

## Dla agentów

- **HTML:** tylko wskazana sekcja w `src/components/sections/`.
- **Style sekcji:** `src/styles/tailwind/components/<sekcja>.css` (`@layer components`).
- **Tokeny / breakpointy:** `src/styles/tailwind/theme.css`.
- Nie edytuj `dist/` ani nie wracaj do `public/css/get3d.css` (archiwum).