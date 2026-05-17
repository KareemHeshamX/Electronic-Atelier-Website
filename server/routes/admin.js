/*
  THE DIGITAL ATELIER — Admin routes

  All routes require admin role.

  Products:
    GET    /api/admin/products       → list all products
    POST   /api/admin/products       → create product
    PUT    /api/admin/products/:id   → update product
    DELETE /api/admin/products/:id   → delete product

  Orders:
    GET    /api/admin/orders         → list all orders
    PATCH  /api/admin/orders/:id     → update order status

  Dashboard:
    GET    /api/admin/dashboard      → stats overview
*/

import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import store from "../db.js";

const router = Router();

// All admin routes require authentication + admin role
router.use(requireAuth, requireAdmin);

/* ─── Dashboard stats ─── */
router.get("/dashboard", (_req, res) => {
  const products = store.getAllProducts();
  const orders = store.getAllOrders();
  const users = store.getAllUsers();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const outOfStock = products.filter((p) => !p.inStock).length;

  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue,
    pendingOrders,
    outOfStock,
    recentOrders: orders.slice(0, 10),
  });
});

/* ─── Product CRUD ─── */
router.get("/products", (_req, res) => {
  res.json(store.getAllProducts());
});

router.post("/products", (req, res) => {
  const { name, slug, price, description, category, image, tags, inStock, featured, images } = req.body;

  if (!name || !slug || price == null) {
    return res.status(400).json({ error: "Name, slug, and price are required" });
  }

  // Check slug uniqueness
  if (store.getProductBySlug(slug)) {
    return res.status(409).json({ error: "A product with this slug already exists" });
  }

  const product = store.createProduct({ name, slug, price, description, category, image, tags, inStock, featured, images });
  res.status(201).json(product);
});

router.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = store.getProductById(id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  // If slug is changing, check uniqueness
  if (req.body.slug && req.body.slug !== product.slug) {
    const existing = store.getProductBySlug(req.body.slug);
    if (existing) return res.status(409).json({ error: "Slug already in use" });
  }

  const updated = store.updateProduct(id, req.body);
  res.json(updated);
});

router.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const deleted = store.deleteProduct(id);
  if (!deleted) return res.status(404).json({ error: "Product not found" });
  res.json({ success: true });
});

/* ─── Order management ─── */
router.get("/orders", (_req, res) => {
  res.json(store.getAllOrders());
});

router.patch("/orders/:id", (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status is required" });

  const order = store.updateOrderStatus(req.params.id, status);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;
