import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import { fetchMyOrders } from "../api";

export default function OrderHistoryPage() {
  useAtelierUi("Order History | THE DIGITAL ATELIER");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    pending: "var(--outline)",
    processing: "#f0c040",
    shipped: "var(--primary-container)",
    delivered: "#4cff90",
    cancelled: "#ff6b6b",
  };

  return (
    <MainLayout>
      <main className="container anim-in anim-delay-1" style={{ paddingBlock: "40px 80px" }}>
        <header style={{ marginBottom: 32 }}>
          <div className="kicker">
            <span className="status-pulse"></span>
            <span className="eyebrow">Transaction Log</span>
          </div>
          <h1 className="headline" style={{ fontSize: 42, margin: "8px 0 0" }}>
            Order <span style={{ color: "var(--primary-container)" }}>History</span>
          </h1>
        </header>

        {loading ? (
          <div className="muted" style={{ textAlign: "center", padding: 48 }}>Loading orders…</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📦</div>
            <h2 className="headline" style={{ fontSize: 24, marginBottom: 8 }}>No transactions yet</h2>
            <p className="muted" style={{ marginBottom: 24 }}>Your order history will appear here after your first acquisition.</p>
            <Link className="btn btn--primary" to="/shop">Browse hardware</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/order/${order.id}`}
                className="order-history-card"
              >
                <div className="order-history-card__header">
                  <div>
                    <div className="label" style={{ margin: "0 0 4px" }}>Order ID</div>
                    <div className="headline" style={{ fontSize: 11, wordBreak: "break-all" }}>
                      {order.id.slice(0, 8)}…
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="label" style={{ margin: "0 0 4px" }}>Date</div>
                    <div className="headline" style={{ fontSize: 11 }}>
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>

                <div className="order-history-card__items">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="order-history-card__item">
                      <img src={item.image} alt={item.name} />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="order-history-card__more">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="order-history-card__footer">
                  <div
                    className="pill"
                    style={{
                      background: "transparent",
                      border: `1px solid ${statusColors[order.status] || "var(--outline)"}`,
                      color: statusColors[order.status] || "var(--outline)",
                    }}
                  >
                    {order.status}
                  </div>
                  <div className="headline" style={{ fontSize: 18, color: "var(--primary-container)" }}>
                    ${order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </MainLayout>
  );
}
