/*
  THE DIGITAL ATELIER — Product routes

  GET  /api/products          → list all (with optional ?category= filter)
  GET  /api/products/featured → featured products only
  GET  /api/products/:slug    → single product with gallery images
*/

import { Router } from "express";
import store from "../db.js";

const router = Router();

// GET /api/products
router.get("/", (req, res) => {
  const { category } = req.query;
  const products = category
    ? store.getProductsByCategory(category)
    : store.getAllProducts();
  res.json(products);
});

// GET /api/products/featured
router.get("/featured", (_req, res) => {
  res.json(store.getFeaturedProducts());
});

// GET /api/products/:slug
router.get("/:slug", (req, res) => {
  const product = store.getProductBySlug(req.params.slug);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export default router;
