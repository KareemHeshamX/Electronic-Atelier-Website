/*
  THE DIGITAL ATELIER — Express server

  - Serves REST API at /api/*
  - Auth routes at /api/auth/*
  - Admin routes at /api/admin/*
  - In production, serves the Vite-built frontend from ../dist
  - In development, Vite dev server runs separately and proxies to this
*/

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === "production";

const app = express();

/* ─── Middleware ─── */
app.use(cors({ origin: true }));
app.use(express.json());

/* ─── API routes ─── */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

/* ─── Health check ─── */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ─── Production: serve the Vite build ─── */
if (IS_PROD) {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  // SPA fallback: let React Router handle client-side routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

/* ─── Start ─── */
// When running on Vercel, we export the app for serverless functions.
// When running locally, we start the listener.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n⚡ THE DIGITAL ATELIER — API server`);
    console.log(`  → http://localhost:${PORT}`);
    console.log(`  → Mode: ${IS_PROD ? "production" : "development"}`);
    console.log(`  → Admin: admin@atelier.com / admin123\n`);
  });
}

export default app;
