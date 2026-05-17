import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api";

export default function CheckoutPage() {
  useAtelierUi("Checkout | THE DIGITAL ATELIER");

  const navigate = useNavigate();
  const { items, totalPrice, updateQuantity, removeItem, clear } = useCart();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await createOrder({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      clear();
      navigate(`/order/${result.orderId}`);
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const formattedTotal = totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <MainLayout>
      <main className="container checkout anim-in anim-delay-1">
        <div className="checkout-grid">
          <section style={{ display: "grid", gap: 40 }}>
            <header>
              <div className="kicker">
                <span className="kicker__dot" aria-hidden="true"></span>
                <span className="eyebrow">Phase 01 / Shipping</span>
              </div>
              <h1 className="headline phase-title">Precision Delivery</h1>
            </header>
            <form
              style={{ display: "grid", gap: 20 }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="field">
                  <label className="label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="input"
                    id="firstName"
                    type="text"
                    placeholder="MARCUS"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="input"
                    id="lastName"
                    type="text"
                    placeholder="VANE"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="address">
                  Delivery Address
                </label>
                <input
                  className="input"
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <section>
                <div className="kicker">
                  <span className="kicker__dot" aria-hidden="true"></span>
                  <span className="eyebrow">Phase 02 / Payment</span>
                </div>
                <h2 className="headline" style={{ margin: "6px 0 0", fontSize: 28 }}>
                  Secure Transaction
                </h2>
                {error && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "12px 16px",
                      background: "rgba(255, 60, 60, 0.12)",
                      border: "1px solid rgba(255, 60, 60, 0.3)",
                      color: "#ff6b6b",
                      fontSize: 13,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {error}
                  </div>
                )}
                <button
                  className="btn btn--primary btn--block"
                  type="submit"
                  style={{ marginTop: 16 }}
                  disabled={submitting || items.length === 0}
                >
                  {submitting ? "Processing…" : (
                    <>Authorize Transaction <span aria-hidden="true">→</span></>
                  )}
                </button>
              </section>
            </form>
          </section>

          <aside className="summary">
            <div className="summary__card">
              <h3 className="headline" style={{ margin: 0, fontSize: 18 }}>
                Order Summary
              </h3>

              {items.length === 0 ? (
                <div className="muted" style={{ padding: "32px 0", textAlign: "center" }}>
                  Your cart is empty.{" "}
                  <Link to="/shop" style={{ color: "var(--primary-container)" }}>
                    Browse products
                  </Link>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gap: 16, margin: "16px 0" }}>
                    {items.map((item) => (
                      <article className="cart-item" key={item.productId}>
                        <Link to={`/product/${item.slug}`} className="cart-item__img">
                          <img alt={item.name} src={item.image} />
                        </Link>
                        <div style={{ display: "grid", gap: 6 }}>
                          <Link
                            to={`/product/${item.slug}`}
                            className="headline"
                            style={{ fontSize: 12, textDecoration: "none", color: "inherit" }}
                          >
                            {item.name}
                          </Link>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button
                              className="btn btn--ghost"
                              type="button"
                              style={{ padding: "4px 8px", fontSize: 10 }}
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  removeItem(item.productId);
                                } else {
                                  updateQuantity(item.productId, item.quantity - 1);
                                }
                              }}
                            >
                              −
                            </button>
                            <span
                              className="eyebrow"
                              style={{ fontSize: 10, color: "var(--primary-container)", minWidth: 20, textAlign: "center" }}
                            >
                              {String(item.quantity).padStart(2, "0")}
                            </span>
                            <button
                              className="btn btn--ghost"
                              type="button"
                              style={{ padding: "4px 8px", fontSize: 10 }}
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              +
                            </button>
                            <button
                              className="btn btn--ghost"
                              type="button"
                              style={{
                                padding: "4px 8px",
                                fontSize: 10,
                                marginLeft: "auto",
                                color: "#ff6b6b",
                                borderColor: "rgba(255, 60, 60, 0.3)",
                              }}
                              onClick={() => removeItem(item.productId)}
                            >
                              Remove
                            </button>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="headline" style={{ fontSize: 14 }}>
                              ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="totals__row">
                    <span>Subtotal</span>
                    <span>${formattedTotal}</span>
                  </div>
                  <div className="totals__row">
                    <span>Shipping</span>
                    <span style={{ color: "var(--primary-container)" }}>Complimentary</span>
                  </div>
                  <div className="totals">
                    <div className="totals__final">
                      <span className="headline" style={{ fontSize: 12 }}>
                        Total Precision
                      </span>
                      <span className="headline" style={{ fontSize: 28, color: "var(--primary-container)" }}>
                        ${formattedTotal}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
    </MainLayout>
  );
}
