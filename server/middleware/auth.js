/*
  THE DIGITAL ATELIER — Auth middleware

  JWT-based authentication. Attaches req.user if token is valid.
*/

import jwt from "jsonwebtoken";
import store from "../db.js";

// Secret key — in production this should be an env variable
const JWT_SECRET = process.env.JWT_SECRET || "atelier_jwt_secret_2024_dev";
export const JWT_EXPIRES_IN = "7d";

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/*
  requireAuth — Blocks unauthenticated requests.
  Reads the Authorization: Bearer <token> header.
*/
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = store.getUserById(decoded.id);
    if (!user) return res.status(401).json({ error: "User no longer exists" });
    // Attach a sanitised user object (no password hash)
    req.user = { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/*
  requireAdmin — Must be used AFTER requireAuth.
  Blocks non-admin users.
*/
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

/*
  optionalAuth — Attaches req.user if token is present, but doesn't block.
*/
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      const token = header.slice(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = store.getUserById(decoded.id);
      if (user) {
        req.user = { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName };
      }
    } catch {
      // Token invalid — continue as guest
    }
  }
  next();
}
