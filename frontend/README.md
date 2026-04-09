## Electronic Atelier (Frontend)

This folder contains a **pure frontend** build of your `@stitch` designs.

It is intentionally:
- **Framework-free** (plain HTML/CSS/JS) so it’s easy to study.
- **Documented** (clear file roles + “why” comments where helpful).
- **Modular** (one shared stylesheet, shared layout patterns, and small JS utilities).

### Pages

- `index.html`: Home / landing
- `shop.html`: Product listing grid
- `product.html`: Product details
- `checkout.html`: Checkout (UI only; no real payment)

### Folder structure

- `assets/css/theme.css`: Design tokens (colors, typography, spacing) + base styles
- `assets/css/components.css`: Reusable UI components (buttons, chips, cards, forms)
- `assets/css/pages/*.css`: Page-specific layout rules (kept small on purpose)
- `assets/js/main.js`: Tiny JS for demo interactions (mobile menu, quantity controls)

### How to run

Because these pages use only relative links and no API calls, you can open them directly:
- Double-click `frontend/index.html`

If you prefer a local web server (recommended for future expansion):

```powershell
cd "c:\Users\karee\Downloads\FCI Projects\Electronic Atelier Website\frontend"
python -m http.server 5173
```

Then visit `http://localhost:5173`.

### Notes on the design system

Your `@stitch/digital_atelier_dark/DESIGN.md` specifies a “Technical Brutalist” look:
- 0px radius everywhere
- tonal separation instead of divider lines
- “electric glow” reserved for active/hover

Those rules are implemented as CSS variables and a few reusable component classes.

