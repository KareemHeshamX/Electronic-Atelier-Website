/*
  THE DIGITAL ATELIER — Order routes

  POST /api/orders        → create a new order (requires auth)
  GET  /api/orders/mine   → get current user's order history (requires auth)
  GET  /api/orders/:id    → retrieve an order (for confirmation page)
*/

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import store from "../db.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/orders — requires authentication
router.post("/", requireAuth, (req, res) => {
  const { firstName, lastName, address, items } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "First and last name are required" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item" });
  }

  // Validate each item and compute total server-side
  let total = 0;
  const resolvedItems = [];

  for (const item of items) {
    const product = store.getProductById(item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    if (!product.inStock) {
      return res.status(400).json({ error: `${product.name} is out of stock` });
    }
    const qty = Math.max(1, Math.min(99, Number(item.quantity) || 1));
    total += product.price * qty;
    resolvedItems.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      slug: product.slug,
      quantity: qty,
      unitPrice: product.price,
    });
  }

  const order = {
    id: uuidv4(),
    userId: req.user.id,
    firstName,
    lastName,
    address: address || "",
    status: "pending",
    total,
    items: resolvedItems,
    createdAt: new Date().toISOString(),
  };

  store.createOrder(order);

  res.status(201).json({ orderId: order.id, total: order.total });
});

// GET /api/orders/mine — user's order history
router.get("/mine", requireAuth, (req, res) => {
  const orders = store.getOrdersByUserId(req.user.id);
  res.json(orders);
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const order = store.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;
