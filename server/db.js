/*
  THE DIGITAL ATELIER — Data store

  Uses a JSON file as a lightweight database. Reads on startup,
  writes on mutation (orders, users). Zero external dependencies beyond Node.js.
*/

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { randomBytes, pbkdf2Sync } from "crypto";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");

/* ─── Password hashing (pure Node.js crypto) ─── */

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const test = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return test === hash;
}

/* ─── Default product catalogue ─── */

const DEFAULT_DATA = {
  products: [
    {
      id: 1,
      slug: "atelier-x1-w",
      name: "ATELIER X1-W",
      price: 4299.0,
      description:
        "Raw processing power. Machined precision. Engineered with aerospace-grade aluminum and liquid-crystal cooling. The monolith workstation built for professionals who demand zero compromise.",
      category: "laptops",
      image: "/images/product-main.png",
      tags: ["M3 chip", "Liquid cooling", "Titanium"],
      inStock: true,
      featured: true,
      images: [
        "/images/product-main.png",
        "/images/product-thumb-2.png",
        "/images/product-thumb-3.png",
        "/images/product-thumb-4.png",
      ],
    },
    {
      id: 2,
      slug: "neo-carbon-pro",
      name: "NEO-CARBON PRO",
      price: 1299.0,
      description:
        "Machined from aerospace-grade carbon fiber with a 144Hz OLED panel. Ultra-thin design without sacrificing thermal efficiency.",
      category: "laptops",
      image: "/images/shop-neo-carbon.png",
      tags: ["Carbon fiber", "144Hz OLED"],
      inStock: true,
      featured: false,
      images: ["/images/shop-neo-carbon.png"],
    },
    {
      id: 3,
      slug: "atelier-x1",
      name: "ATELIER X-1",
      price: 2850.0,
      description:
        "A monolithic powerhouse with zero compromise on thermal efficiency. Designed for sustained workloads and professional-grade rendering.",
      category: "laptops",
      image: "/images/shop-atelier-x1.png",
      tags: ["Monolithic", "Zero compromise"],
      inStock: true,
      featured: false,
      images: ["/images/shop-atelier-x1.png"],
    },
    {
      id: 4,
      slug: "sonic-chamber-01",
      name: "SONIC CHAMBER_01",
      price: 599.0,
      description:
        "Acoustically tuned for the purest signal path possible. Planar magnetic drivers with open-back design for studio-grade monitoring.",
      category: "accessories",
      image: "/images/shop-sonic-chamber.png",
      tags: ["Planar magnetic", "Open back"],
      inStock: true,
      featured: false,
      images: ["/images/shop-sonic-chamber.png"],
    },
    {
      id: 5,
      slug: "acoustic-core-x",
      name: "ACOUSTIC CORE X",
      price: 499.0,
      description:
        "Active noise isolation headphones with 40-hour battery life. Precision-tuned 50mm drivers deliver immersive spatial audio.",
      category: "accessories",
      image: "/images/home-side-headphones.png",
      tags: ["Active noise isolation", "50mm drivers"],
      inStock: true,
      featured: false,
      images: ["/images/home-side-headphones.png"],
    },
    {
      id: 6,
      slug: "chrono-link",
      name: "CHRONO-LINK",
      price: 349.0,
      description:
        "Sapphire glass display with integrated heart sensor. Machined from surgical-grade stainless steel with a seamless mesh band.",
      category: "accessories",
      image: "/images/home-side-watch.png",
      tags: ["Sapphire glass", "Heart sensor"],
      inStock: true,
      featured: false,
      images: ["/images/home-side-watch.png"],
    },
    {
      id: 7,
      slug: "atelier-tab-pro",
      name: "ATELIER TAB PRO",
      price: 1899.0,
      description:
        "The ultimate canvas for digital artisans. M3 chip with OLED display and pressure-sensitive stylus support.",
      category: "smartphones",
      image: "/images/home-featured.png",
      tags: ["M3 chip", "OLED"],
      inStock: true,
      featured: true,
      images: ["/images/home-featured.png"],
    },
  ],
  orders: [],
  users: [],
  _nextProductId: 8,
  _nextUserId: 1,
};

/* ─── Load / persist ─── */

function loadData() {
  if (existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
      // Ensure new fields exist when upgrading from older data files
      if (!data.users) data.users = [];
      if (!data._nextProductId) data._nextProductId = Math.max(...data.products.map(p => p.id), 0) + 1;
      if (!data._nextUserId) data._nextUserId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id), 0) + 1 : 1;
      return data;
    } catch {
      return structuredClone(DEFAULT_DATA);
    }
  }
  return structuredClone(DEFAULT_DATA);
}

function saveData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/* ─── Public API ─── */

const store = {
  _data: loadData(),

  _save() {
    saveData(this._data);
  },

  /* ─── Products ─── */
  getAllProducts() {
    return this._data.products;
  },

  getProductsByCategory(category) {
    return this._data.products.filter((p) => p.category === category);
  },

  getFeaturedProducts() {
    return this._data.products.filter((p) => p.featured);
  },

  getProductBySlug(slug) {
    return this._data.products.find((p) => p.slug === slug) || null;
  },

  getProductById(id) {
    return this._data.products.find((p) => p.id === id) || null;
  },

  createProduct(data) {
    const product = {
      id: this._data._nextProductId++,
      slug: data.slug,
      name: data.name,
      price: Number(data.price),
      description: data.description || "",
      category: data.category || "general",
      image: data.image || "",
      tags: data.tags || [],
      inStock: data.inStock !== false,
      featured: data.featured || false,
      images: data.images || [data.image || ""],
    };
    this._data.products.push(product);
    this._save();
    return product;
  },

  updateProduct(id, updates) {
    const idx = this._data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const product = { ...this._data.products[idx], ...updates, id }; // id is immutable
    this._data.products[idx] = product;
    this._save();
    return product;
  },

  deleteProduct(id) {
    const idx = this._data.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this._data.products.splice(idx, 1);
    this._save();
    return true;
  },

  /* ─── Orders ─── */
  createOrder(order) {
    this._data.orders.push(order);
    this._save();
    return order;
  },

  getOrderById(id) {
    return this._data.orders.find((o) => o.id === id) || null;
  },

  getOrdersByUserId(userId) {
    return this._data.orders.filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAllOrders() {
    return this._data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  updateOrderStatus(id, status) {
    const order = this._data.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    this._save();
    return order;
  },

  /* ─── Users ─── */
  createUser({ email, password, firstName, lastName, role = "user" }) {
    const user = {
      id: this._data._nextUserId++,
      email: email.toLowerCase(),
      password: hashPassword(password),
      firstName,
      lastName,
      role,
      createdAt: new Date().toISOString(),
    };
    this._data.users.push(user);
    this._save();
    return user;
  },

  getUserByEmail(email) {
    return this._data.users.find((u) => u.email === email.toLowerCase()) || null;
  },

  getUserById(id) {
    return this._data.users.find((u) => u.id === id) || null;
  },

  getAllUsers() {
    return this._data.users;
  },
};

// Persist initial data if file doesn't exist
if (!existsSync(DATA_FILE)) {
  // Create a default admin account: admin@atelier.com / admin123
  store.createUser({
    email: "admin@atelier.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "Atelier",
    role: "admin",
  });
} else {
  // Ensure at least one admin exists in existing data
  const admins = store._data.users.filter((u) => u.role === "admin");
  if (admins.length === 0) {
    store.createUser({
      email: "admin@atelier.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "Atelier",
      role: "admin",
    });
  }
  saveData(store._data);
}

export default store;
