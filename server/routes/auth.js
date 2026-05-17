/*
  THE DIGITAL ATELIER — Auth routes

  POST /api/auth/register → create a new user account (always role: "user")
  POST /api/auth/login    → authenticate and return JWT
  GET  /api/auth/me       → get current user profile (requires auth)
*/

import { Router } from "express";
import store, { verifyPassword } from "../db.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "All fields are required (email, password, firstName, lastName)" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  // Check for existing user
  if (store.getUserByEmail(email)) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  // Register always creates a "user" role — never "admin"
  const user = store.createUser({ email, password, firstName, lastName, role: "user" });
  const token = signToken(user);

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
  });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = store.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (!verifyPassword(password, user.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
  });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
