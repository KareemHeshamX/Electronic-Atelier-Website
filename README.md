# Electronic Atelier Website

Frontend-only website project for an electronic atelier storefront.

## Project overview

This repository currently contains a pure frontend implementation using:
- HTML
- CSS
- JavaScript (vanilla)

The main work lives in the `frontend` folder and includes:
- `index.html` (home page)
- `shop.html` (product listing)
- `product.html` (product details)
- `checkout.html` (checkout UI)

## Run locally

You can open the pages directly in your browser, starting with:
- `frontend/index.html`

For a local development server (recommended):

```powershell
cd "C:\Users\karee\Downloads\FCI Projects\Electronic-Atelier-Website\frontend"
python -m http.server 5173
```

Then visit: `http://localhost:5173`

## Frontend structure

- `frontend/assets/css/theme.css`: design tokens and base styles
- `frontend/assets/css/components.css`: shared components
- `frontend/assets/css/pages/*.css`: page-specific styles
- `frontend/assets/js/main.js`: small interactive behaviors

## Notes

- This is a static frontend prototype (no backend or payment processing yet).
- See `frontend/README.md` for frontend-specific details.