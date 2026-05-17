/*
  THE DIGITAL ATELIER — API client

  Centralised fetch wrappers for the Express backend.
  All functions throw on non-OK responses so callers can catch errors.
  Auth token is automatically attached from localStorage.
*/

const BASE = "/api";
const TOKEN_KEY = "atelier_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${url}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

/* ─── Auth ─── */

export function apiLogin({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function apiRegister({ email, password, firstName, lastName }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
}

export function apiGetMe() {
  return request("/auth/me");
}

/* ─── Products ─── */

export function fetchProducts(category) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  return request(`/products${qs}`);
}

export function fetchFeaturedProducts() {
  return request("/products/featured");
}

export function fetchProduct(slug) {
  return request(`/products/${encodeURIComponent(slug)}`);
}

/* ─── Orders ─── */

export function createOrder({ firstName, lastName, address, items }) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, address, items }),
  });
}

export function fetchOrder(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}`);
}

export function fetchMyOrders() {
  return request("/orders/mine");
}

/* ─── Admin ─── */

export function fetchAdminDashboard() {
  return request("/admin/dashboard");
}

export function fetchAdminProducts() {
  return request("/admin/products");
}

export function createAdminProduct(data) {
  return request("/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminProduct(id, data) {
  return request(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteAdminProduct(id) {
  return request(`/admin/products/${id}`, {
    method: "DELETE",
  });
}

export function fetchAdminOrders() {
  return request("/admin/orders");
}

export function updateAdminOrderStatus(id, status) {
  return request(`/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
