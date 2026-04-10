## Electronic Atelier (Frontend)

This folder contains a React + Vite frontend build of your `@stitch` designs.

It is intentionally:
- **React-based** (component + route structure).
- **Documented** (clear file roles + “why” comments where helpful).
- **Modular** (shared styles, layout components, and small JS utilities).

### Pages

- `/`: Home / landing
- `/shop`: Product listing grid
- `/product`: Product details
- `/checkout`: Checkout (UI only; no real payment)

### Folder structure

- `src/main.jsx`: React entry + global stylesheet imports
- `src/App.jsx`: app routes
- `src/pages/*`: route pages
- `src/components/*`: shared header/footer
- `assets/css/theme.css`: Design tokens (colors, typography, spacing) + base styles
- `assets/css/components.css`: Reusable UI components (buttons, chips, cards, forms)
- `assets/css/pages/*.css`: Page-specific layout rules (kept small on purpose)
- `assets/js/main.js`: UI interaction helpers used by React pages

### How to run

Install dependencies and run the Vite dev server:

```powershell
cd "c:\Users\karee\Downloads\FCI Projects\Electronic-Atelier-Website\frontend"
npm install
npm run dev
```

Then visit `http://localhost:5173`.

### Notes on the design system

Your `@stitch/digital_atelier_dark/DESIGN.md` specifies a “Technical Brutalist” look:
- 0px radius everywhere
- tonal separation instead of divider lines
- “electric glow” reserved for active/hover

Those rules are implemented as CSS variables and a few reusable component classes.

