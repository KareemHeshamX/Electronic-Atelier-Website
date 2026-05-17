import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import { fetchProduct } from "../api";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  useAtelierUi("Product | THE DIGITAL ATELIER");

  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProduct(slug)
      .then((data) => {
        setProduct(data);
        setMainImage(data.images?.[0] || data.image);
        document.title = `${data.name} | THE DIGITAL ATELIER`;
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  function handleAddToCart() {
    if (!product || !product.inStock) return;
    addItem(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  }

  if (loading) {
    return (
      <MainLayout>
        <main className="container product-page anim-in anim-delay-1">
          <div className="muted" style={{ textAlign: "center", padding: 80 }}>Loading product…</div>
        </main>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <main className="container product-page anim-in anim-delay-1">
          <div style={{ textAlign: "center", padding: 80 }}>
            <h2 className="headline" style={{ marginBottom: 12 }}>Product not found</h2>
            <p className="muted">{error || "This product doesn't exist."}</p>
            <Link className="btn btn--primary" to="/shop" style={{ marginTop: 24 }}>
              Back to shop
            </Link>
          </div>
        </main>
      </MainLayout>
    );
  }

  const images = product.images || [product.image];
  const isOOS = !product.inStock;

  return (
    <MainLayout>
      <main className="container product-page anim-in anim-delay-1">
        <section className="product-grid" aria-label="Product details">
          <div className={`gallery ${isOOS ? "gallery--oos" : ""}`} data-product-gallery>
            <div className="gallery__hero">
              <img
                data-gallery-main
                alt={product.name}
                src={mainImage}
                style={{ transition: "opacity 220ms ease" }}
              />
              {isOOS && (
                <div className="gallery__oos-banner">
                  <div className="gallery__oos-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    <span>STOCK DEPLETED — PRODUCTION PENDING</span>
                  </div>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className="thumb"
                    type="button"
                    aria-current={mainImage === img ? "true" : "false"}
                    onClick={() => setMainImage(img)}
                  >
                    <img alt="" src={img} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="headline product-title">{product.name}</h1>
            <p className="subline">{product.description}</p>
            <div className="stock-row">
              <div className={`headline ${isOOS ? "price--oos" : ""}`} style={{ fontSize: 28, fontWeight: 300 }}>
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className={`pill ${isOOS ? "pill--oos" : ""}`}>
                {isOOS ? "Out of stock" : "In stock"}
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "14px 0" }}>
                {product.tags.map((tag) => (
                  <span className="chip" key={tag}>{tag}</span>
                ))}
              </div>
            )}

            {isOOS ? (
              /* ─── Out of stock panel ─── */
              <div className="oos-panel">
                <div className="oos-panel__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z"/>
                  </svg>
                </div>
                <h3 className="headline" style={{ fontSize: 16, margin: "0 0 6px" }}>
                  Currently Unavailable
                </h3>
                <p className="muted" style={{ margin: "0 0 16px", fontSize: 13 }}>
                  This product is temporarily out of stock. Our precision manufacturing line is preparing the next batch.
                </p>
                <Link className="btn btn--secondary btn--block" to="/shop">
                  Browse available hardware
                </Link>
              </div>
            ) : (
              /* ─── In stock: quantity + add to cart ─── */
              <>
                <div className="option-row">
                  <div className="label">Quantity</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <button
                      className="btn btn--ghost"
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                      style={{ width: 56, textAlign: "center" }}
                    />
                    <button
                      className="btn btn--ghost"
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                  <button
                    className="btn btn--primary btn--block"
                    type="button"
                    onClick={handleAddToCart}
                    style={addedFeedback ? { background: "#0f0", color: "#000" } : {}}
                  >
                    {addedFeedback ? "✓ Added to cart" : "Add to workspace"}
                  </button>
                  <Link className="btn btn--secondary btn--block" to="/checkout">
                    Go to checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
