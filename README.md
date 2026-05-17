## Electronic Atelier (Full-Stack)

A React + Vite frontend backed by a **Node.js / Express** API server for an electronics e-commerce site called *THE DIGITAL ATELIER*.

### Architecture

```
┌─────────────┐       /api/*        ┌─────────────────┐
│  React SPA  │  ──────────────►    │  Express API     │
│  (Vite)     │  ◄──────────────    │  (Node.js)       │
│  :5173      │    JSON responses   │  :3001            │
└─────────────┘                     └────────┬──────────┘
                                             │
                                    ┌────────▼──────────┐
                                    │  JSON file store   │
                                    │  (server/data.json)│
                                    └───────────────────┘
```

### Pages

- `/` — Home / landing (fetches featured + accessory products from API)
- `/shop` — Product listing with category filters (data from API)
- `/product/:slug` — Dynamic product detail page (API-driven, with Out of Stock states)
- `/checkout` — Live cart with order submission (creates order via API, requires Auth)
- `/order/:orderId` — Order confirmation (fetches order details from API, requires Auth)
- `/login` — User authentication
- `/register` — Create a new user account
- `/orders` — Order history for the authenticated user
- `/admin` — Admin dashboard to manage products and orders (requires Admin Auth)

### API Endpoints

| Method | Path                    | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | `/api/health`           | Server health check                  |
| GET    | `/api/products`         | All products (optional `?category=`) |
| GET    | `/api/products/featured`| Featured products only               |
| GET    | `/api/products/:slug`   | Single product with gallery images   |
| POST   | `/api/orders`           | Create order from cart items (Auth)  |
| GET    | `/api/orders/:id`       | Retrieve order details               |
| GET    | `/api/orders/mine`      | Order history for user (Auth)        |
| POST   | `/api/auth/login`       | Authenticate user and get JWT        |
| POST   | `/api/auth/register`    | Register new user                    |
| GET    | `/api/auth/me`          | Validate token and get user profile  |
| GET    | `/api/admin/dashboard`  | Store stats (Admin Auth)             |
| GET    | `/api/admin/products`   | List all products (Admin Auth)       |
| POST   | `/api/admin/products`   | Create new product (Admin Auth)      |
| PUT    | `/api/admin/products/:id`| Update product (Admin Auth)         |
| DELETE | `/api/admin/products/:id`| Delete product (Admin Auth)         |
| GET    | `/api/admin/orders`     | List all orders (Admin Auth)         |
| PATCH  | `/api/admin/orders/:id` | Update order status (Admin Auth)     |

### Folder structure

```
├── server/                    # Node.js backend
│   ├── server.js              # Express entry point
│   ├── db.js                  # JSON file data store
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── routes/
│   │   ├── products.js        # Product API routes
│   │   ├── orders.js          # Order API routes
│   │   ├── auth.js            # Authentication routes
│   │   └── admin.js           # Admin CRUD routes
│   └── package.json
│
├── src/                       # React frontend
│   ├── main.jsx               # Entry + global imports
│   ├── App.jsx                # App routes
│   ├── api.js                 # Centralised API client
│   ├── context/
│   │   ├── CartContext.jsx    # Global cart state (Context + localStorage)
│   │   └── AuthContext.jsx    # Authentication state
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── OrderHistoryPage.jsx
│   │   └── AdminPage.jsx
│   ├── components/
│   │   ├── Header.jsx         # Nav bar with live cart badge & auth links
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx # Route guards for Auth/Admin
│   ├── hooks/
│   │   └── useAtelierUi.js
│   └── layout/
│       └── MainLayout.jsx
│
├── assets/css/                # Design system styles
├── public/images/             # Product imagery
├── vite.config.js             # Vite config with API proxy
└── package.json
```

### How to run

**1. Install dependencies:**

```powershell
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

**2. Start both servers (two terminals):**

```powershell
# Terminal 1: Backend API
npm run dev:server

# Terminal 2: Frontend
npm run dev
```

Then visit `http://localhost:5173`.

**Admin Account details:**
- **Email:** `admin@atelier.com`
- **Password:** `admin123`

The Vite dev server proxies all `/api/*` requests to the Express backend on port 3001.

### Key features added

- **Real REST API** — Products, orders, and cart data flow through Express endpoints
- **Authentication** — JWT-based auth system with Registration and Login
- **Admin Dashboard** — Fully functional admin panel to manage Products and Orders
- **Order History** — Authenticated users can view their past orders
- **Dynamic product pages** — `/product/:slug` fetches individual product data
- **Out of Stock UI** — Distinctive visual states and logic for depleted items
- **Category filtering** — Shop page queries the API with `?category=` param
- **Persistent cart** — React Context + localStorage, with live cart badge in header
- **Order system** — Place orders via POST to `/api/orders` (requires Auth)
- **Server-side validation** — Totals computed server-side, product existence and stock verified

### Notes on the design system

The `@stitch/digital_atelier_dark/DESIGN.md` specifies a "Technical Brutalist" look:
- 0px radius everywhere
- tonal separation instead of divider lines
- "electric glow" reserved for active/hover

Those rules are implemented as CSS variables and a few reusable component classes.
