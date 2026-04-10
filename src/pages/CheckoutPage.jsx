import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";

export default function CheckoutPage() {
  useAtelierUi("Checkout | THE DIGITAL ATELIER");

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
            <form style={{ display: "grid", gap: 20 }}>
              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="field">
                  <label className="label" htmlFor="firstName">
                    First Name
                  </label>
                  <input className="input" id="firstName" type="text" placeholder="MARCUS" />
                </div>
                <div className="field">
                  <label className="label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input className="input" id="lastName" type="text" placeholder="VANE" />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="address">
                  Delivery Address
                </label>
                <input className="input" id="address" type="text" />
              </div>
            </form>
            <section>
              <div className="kicker">
                <span className="kicker__dot" aria-hidden="true"></span>
                <span className="eyebrow">Phase 02 / Payment</span>
              </div>
              <h2 className="headline" style={{ margin: "6px 0 0", fontSize: 28 }}>
                Secure Transaction
              </h2>
              <button className="btn btn--primary btn--block" type="button" style={{ marginTop: 16 }}>
                Authorize Transaction <span aria-hidden="true">→</span>
              </button>
            </section>
          </section>
          <aside className="summary">
            <div className="summary__card">
              <h3 className="headline" style={{ margin: 0, fontSize: 18 }}>
                Order Summary
              </h3>
              <div style={{ display: "grid", gap: 16, margin: "16px 0" }}>
                <article className="cart-item">
                  <div className="cart-item__img">
                    <img
                      alt="Laptop in cart"
                      src="/images/checkout-laptop.png"
                    />
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div className="headline" style={{ fontSize: 12 }}>
                      Pro Workstation
                    </div>
                    <div className="label" style={{ margin: 0 }}>
                      32GB / 1TB SSD / TITANIUM
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="eyebrow" style={{ fontSize: 10, color: "var(--primary-container)" }}>
                        Qty: 01
                      </span>
                      <span className="headline" style={{ fontSize: 14 }}>
                        $3,499.00
                      </span>
                    </div>
                  </div>
                </article>
                <article className="cart-item">
                  <div className="cart-item__img">
                    <img
                      alt="Headphones in cart"
                      src="/images/checkout-headphones.png"
                    />
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div className="headline" style={{ fontSize: 12 }}>
                      Studio Headphones
                    </div>
                    <div className="label" style={{ margin: 0 }}>
                      PLANAR MAGNETIC / OPEN BACK
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="eyebrow" style={{ fontSize: 10, color: "var(--primary-container)" }}>
                        Qty: 01
                      </span>
                      <span className="headline" style={{ fontSize: 14 }}>
                        $899.00
                      </span>
                    </div>
                  </div>
                </article>
              </div>
              <div className="totals__row">
                <span>Subtotal</span>
                <span>$4,398.00</span>
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
                    $4,398.00
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </MainLayout>
  );
}
