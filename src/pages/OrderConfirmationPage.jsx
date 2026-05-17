import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import { fetchOrder } from "../api";

export default function OrderConfirmationPage() {
  useAtelierUi("Order Confirmed | THE DIGITAL ATELIER");

  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder(orderId)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <MainLayout>
        <main className="container checkout anim-in anim-delay-1" style={{ padding: "80px 0" }}>
          <div className="muted" style={{ textAlign: "center" }}>Loading order details…</div>
        </main>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <main className="container checkout anim-in anim-delay-1" style={{ padding: "80px 0" }}>
          <div style={{ textAlign: "center" }}>
            <h2 className="headline">Order not found</h2>
            <p className="muted">{error || "This order doesn't exist."}</p>
            <Link className="btn btn--primary" to="/" style={{ marginTop: 24 }}>
              Return home
            </Link>
          </div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="container checkout anim-in anim-delay-1" style={{ paddingBlock: "60px 100px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          {/* Success indicator */}
          <div
            style={{
              width: 72,
              height: 72,
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 240, 255, 0.08)",
              border: "2px solid var(--primary-container)",
              fontSize: 32,
            }}
          >
            ✓
          </div>

          <div className="kicker" style={{ justifyContent: "center", marginBottom: 12 }}>
            <span className="status-pulse"></span>
            <span className="eyebrow">Order confirmed</span>
          </div>

          <h1 className="headline" style={{ fontSize: 42, margin: "0 0 8px" }}>
            Transaction{" "}
            <span style={{ color: "var(--primary-container)" }}>Authorized</span>
          </h1>

          <p className="muted" style={{ marginBottom: 32 }}>
            Thank you, {order.firstName}. Your precision hardware is being prepared.
          </p>

          {/* Order details card */}
          <div
            className="summary__card"
            style={{ textAlign: "left", marginBottom: 24 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div className="label" style={{ margin: "0 0 4px" }}>Order ID</div>
                <div className="headline" style={{ fontSize: 12, wordBreak: "break-all" }}>
                  {order.id}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="label" style={{ margin: "0 0 4px" }}>Status</div>
                <div className="pill" style={{ display: "inline-block" }}>
                  {order.status}
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(59, 73, 75, 0.2)", paddingTop: 16 }}>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: i < order.items.length - 1 ? "1px solid rgba(59, 73, 75, 0.1)" : "none",
                  }}
                >
                  <div>
                    <span className="headline" style={{ fontSize: 12 }}>{item.name}</span>
                    <span className="muted" style={{ fontSize: 11, marginLeft: 8 }}>×{item.quantity}</span>
                  </div>
                  <span className="headline" style={{ fontSize: 14 }}>
                    ${(item.unitPrice * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            <div className="totals" style={{ marginTop: 8 }}>
              <div className="totals__final">
                <span className="headline" style={{ fontSize: 12 }}>Total</span>
                <span className="headline" style={{ fontSize: 28, color: "var(--primary-container)" }}>
                  ${order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn--primary" to="/shop">
              Continue shopping
            </Link>
            <Link className="btn btn--secondary" to="/">
              Return home
            </Link>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
