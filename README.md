# Electronic Atelier Website

React-based frontend project for an electronic atelier storefront.

## Project overview

This repository contains a React frontend implementation using:

- React
- Vite
- CSS

The main work lives in the `frontend` folder and includes:

- `src/App.jsx` (route registration)
- `src/pages/*` (home, shop, product, checkout pages)
- `src/components/*` (shared layout components)

## Run locally

Install and run the React app:

```powershell
cd "C:\Users\karee\Downloads\FCI Projects\Electronic-Atelier-Website\frontend"
npm install
npm run dev
```

Then visit: `http://localhost:5173`

## Frontend structure

- `frontend/assets/css/theme.css`: design tokens and base styles
- `frontend/assets/css/components.css`: shared components
- `frontend/assets/css/pages/*.css`: page-specific styles
- `frontend/assets/js/main.js`: shared UI interaction initializers

## Notes

- This is a frontend prototype (no backend or payment processing yet).
- See `frontend/README.md` for frontend-specific details.

