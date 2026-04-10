import { Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";

export default function ProductPage() {
  useAtelierUi("Product | THE DIGITAL ATELIER");

  return (
    <MainLayout>
      <main className="container product-page anim-in anim-delay-1">
        <section className="product-grid" aria-label="Product details">
          <div className="gallery" data-product-gallery>
            <div className="gallery__hero">
              <img
                data-gallery-main
                alt="ATELIER X1-W"
                src="/images/product-main.png"
              />
            </div>
            <div className="gallery__thumbs">
              <button
                className="thumb"
                type="button"
                aria-current="true"
                data-gallery-thumb
                data-image="/images/product-main.png"
              >
                <img alt="" src="/images/product-main.png" />
              </button>
              <button
                className="thumb"
                type="button"
                aria-current="false"
                data-gallery-thumb
                data-image="/images/product-thumb-2.png"
              >
                <img alt="" src="/images/product-thumb-2.png" />
              </button>
              <button
                className="thumb"
                type="button"
                aria-current="false"
                data-gallery-thumb
                data-image="/images/product-thumb-3.png"
              >
                <img alt="" src="/images/product-thumb-3.png" />
              </button>
              <button
                className="thumb"
                type="button"
                aria-current="false"
                data-gallery-thumb
                data-image="/images/product-thumb-4.png"
              >
                <img alt="" src="/images/product-thumb-4.png" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="headline product-title">ATELIER X1-W</h1>
            <p className="subline">Raw processing power. Machined precision.</p>
            <div className="stock-row">
              <div className="headline" style={{ fontSize: 28, fontWeight: 300 }}>
                $4,299.00
              </div>
              <div className="pill">In stock</div>
            </div>
            <div className="option-row">
              <div className="label">Configuration</div>
              <div className="option-grid">
                <button className="mini-btn" type="button" aria-pressed="true">
                  Standard performance
                </button>
                <button className="mini-btn" type="button" aria-pressed="false">
                  Ultra neural tier
                </button>
              </div>
            </div>
            <div className="option-row">
              <div className="label">Quantity</div>
              <div data-qty style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <button className="btn btn--ghost" type="button" data-qty-dec>
                  -
                </button>
                <input className="input" type="number" min="1" max="99" defaultValue="1" />
                <button className="btn btn--ghost" type="button" data-qty-inc>
                  +
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
              <Link className="btn btn--primary btn--block" to="/checkout">
                Add to workspace
              </Link>
              <button className="btn btn--secondary btn--block" type="button">
                Request quote for teams
              </button>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
