import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import {
  fetchAdminDashboard,
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "../api";

/* ─── Tab constants ─── */
const TABS = [
  { key: "overview", label: "Overview" },
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
];

export default function AdminPage() {
  useAtelierUi("Admin Dashboard | THE DIGITAL ATELIER");

  const [activeTab, setActiveTab] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [dash, prods, ords] = await Promise.all([
        fetchAdminDashboard(),
        fetchAdminProducts(),
        fetchAdminOrders(),
      ]);
      setDashboard(dash);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <main className="container anim-in anim-delay-1" style={{ padding: "80px 0" }}>
          <div className="muted" style={{ textAlign: "center" }}>Loading dashboard…</div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="container anim-in anim-delay-1" style={{ paddingBlock: "32px 80px" }}>
        <header style={{ marginBottom: 28 }}>
          <div className="kicker">
            <span className="kicker__dot" aria-hidden="true"></span>
            <span className="eyebrow">Administrative Panel</span>
          </div>
          <h1 className="headline" style={{ fontSize: 38, margin: "8px 0 0" }}>
            Command <span style={{ color: "var(--primary-container)" }}>Center</span>
          </h1>
        </header>

        {/* Tab bar */}
        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-tab ${activeTab === tab.key ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && <OverviewTab dashboard={dashboard} />}
        {activeTab === "products" && (
          <ProductsTab
            products={products}
            onRefresh={loadData}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            showProductForm={showProductForm}
            setShowProductForm={setShowProductForm}
          />
        )}
        {activeTab === "orders" && <OrdersTab orders={orders} onRefresh={loadData} />}
      </main>
    </MainLayout>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ dashboard }) {
  if (!dashboard) return null;

  const stats = [
    { label: "Products", value: dashboard.totalProducts, color: "var(--primary-container)" },
    { label: "Total Orders", value: dashboard.totalOrders, color: "var(--primary)" },
    { label: "Revenue", value: `$${dashboard.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "#4cff90" },
    { label: "Pending", value: dashboard.pendingOrders, color: "#f0c040" },
    { label: "Users", value: dashboard.totalUsers, color: "var(--secondary)" },
    { label: "Out of Stock", value: dashboard.outOfStock, color: dashboard.outOfStock > 0 ? "#ff6b6b" : "var(--outline)" },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <div className="admin-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <div className="label" style={{ margin: 0 }}>{s.label}</div>
            <div className="headline" style={{ fontSize: 28, color: s.color, marginTop: 8 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {dashboard.recentOrders.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 className="headline" style={{ fontSize: 18, marginBottom: 16 }}>Recent Orders</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="headline" style={{ fontSize: 11 }}>{o.id.slice(0, 8)}…</td>
                    <td>{o.firstName} {o.lastName}</td>
                    <td className="headline" style={{ color: "var(--primary-container)" }}>
                      ${o.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td><span className="pill">{o.status}</span></td>
                    <td className="muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab({ products, onRefresh, editingProduct, setEditingProduct, showProductForm, setShowProductForm }) {
  const [formData, setFormData] = useState(getEmptyForm());
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  function getEmptyForm() {
    return { name: "", slug: "", price: "", description: "", category: "laptops", image: "", tags: "", inStock: true, featured: false };
  }

  function openCreate() {
    setEditingProduct(null);
    setFormData(getEmptyForm());
    setFormError(null);
    setShowProductForm(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      price: String(product.price),
      description: product.description,
      category: product.category,
      image: product.image,
      tags: (product.tags || []).join(", "),
      inStock: product.inStock,
      featured: product.featured,
    });
    setFormError(null);
    setShowProductForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.slug || !formData.price) {
      setFormError("Name, slug, and price are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };

      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, payload);
      } else {
        await createAdminProduct(payload);
      }

      setShowProductForm(false);
      await onRefresh();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteAdminProduct(id);
      await onRefresh();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggleStock(product) {
    try {
      await updateAdminProduct(product.id, { inStock: !product.inStock });
      await onRefresh();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="headline" style={{ fontSize: 16 }}>
          {products.length} product{products.length !== 1 ? "s" : ""}
        </div>
        <button className="btn btn--primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {/* Product form modal */}
      {showProductForm && (
        <div className="admin-modal-backdrop" onClick={() => setShowProductForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="headline" style={{ fontSize: 20, marginBottom: 20 }}>
              {editingProduct ? "Edit Product" : "New Product"}
            </h3>
            <form onSubmit={handleSave} style={{ display: "grid", gap: 16 }}>
              {formError && <div className="auth-error">{formError}</div>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field">
                  <label className="label">Name</label>
                  <input className="input" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="field">
                  <label className="label">Slug</label>
                  <input className="input" value={formData.slug} onChange={(e) => setFormData((f) => ({ ...f, slug: e.target.value }))} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field">
                  <label className="label">Price ($)</label>
                  <input className="input" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))} required />
                </div>
                <div className="field">
                  <label className="label">Category</label>
                  <select className="input" value={formData.category} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))} style={{ padding: "12px 0" }}>
                    <option value="laptops">Laptops</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <input className="input" value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="field">
                <label className="label">Image URL</label>
                <input className="input" value={formData.image} onChange={(e) => setFormData((f) => ({ ...f, image: e.target.value }))} placeholder="/images/..." />
              </div>

              <div className="field">
                <label className="label">Tags (comma-separated)</label>
                <input className="input" value={formData.tags} onChange={(e) => setFormData((f) => ({ ...f, tags: e.target.value }))} placeholder="M3 chip, OLED" />
              </div>

              <div style={{ display: "flex", gap: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData((f) => ({ ...f, inStock: e.target.checked }))}
                    style={{ accentColor: "var(--primary-container)" }}
                  />
                  <span className="label" style={{ margin: 0 }}>In Stock</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((f) => ({ ...f, featured: e.target.checked }))}
                    style={{ accentColor: "var(--primary-container)" }}
                  />
                  <span className="label" style={{ margin: 0 }}>Featured</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn--primary" type="submit" disabled={saving}>
                  {saving ? "Saving…" : editingProduct ? "Update" : "Create"}
                </button>
                <button className="btn btn--ghost" type="button" onClick={() => setShowProductForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={!p.inStock ? "admin-row--oos" : ""}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {p.image && (
                      <div className="admin-product-thumb">
                        <img src={p.image} alt="" />
                      </div>
                    )}
                    <div>
                      <div className="headline" style={{ fontSize: 12 }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 10 }}>{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="headline" style={{ color: "var(--primary-container)" }}>
                  ${p.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td><span className="chip">{p.category}</span></td>
                <td>
                  <button
                    className={`pill admin-stock-toggle ${p.inStock ? "admin-stock--in" : "admin-stock--out"}`}
                    onClick={() => handleToggleStock(p)}
                    title={p.inStock ? "Click to mark out of stock" : "Click to mark in stock"}
                  >
                    {p.inStock ? "IN STOCK" : "OUT OF STOCK"}
                  </button>
                </td>
                <td>{p.featured ? "★" : "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn--ghost" style={{ padding: "6px 10px", fontSize: 10 }} onClick={() => openEdit(p)}>Edit</button>
                    <button
                      className="btn btn--ghost"
                      style={{ padding: "6px 10px", fontSize: 10, color: "#ff6b6b", borderColor: "rgba(255,60,60,0.3)" }}
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab({ orders, onRefresh }) {
  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      await onRefresh();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div className="headline" style={{ fontSize: 16, marginBottom: 20 }}>
        {orders.length} order{orders.length !== 1 ? "s" : ""}
      </div>

      {orders.length === 0 ? (
        <div className="muted" style={{ textAlign: "center", padding: 48 }}>No orders yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/order/${o.id}`} className="headline" style={{ fontSize: 11, color: "var(--primary-container)" }}>
                      {o.id.slice(0, 8)}…
                    </Link>
                  </td>
                  <td>{o.firstName} {o.lastName}</td>
                  <td>
                    {o.items.map((item) => item.name).join(", ")}
                  </td>
                  <td className="headline" style={{ color: "var(--primary-container)" }}>
                    ${o.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <select
                      className="input admin-status-select"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
