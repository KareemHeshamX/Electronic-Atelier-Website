import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import { fetchProducts } from "../api";
import { useCart } from "../context/CartContext";

export default function ShopPage() {
  useAtelierUi("Shop | THE DIGITAL ATELIER");

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    fetchProducts(activeCategory || undefined)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const categories = [
    { key: "", label: "All" },
    { key: "laptops", label: "Laptops" },
    { key: "smartphones", label: "Smartphones" },
    { key: "accessories", label: "Accessories" },
  ];

  function handleFilter(key) {
    if (key) {
      setSearchParams({ category: key });
    } else {
      setSearchParams({});
    }
  }

  return (
    <MainLayout>
      <main className="anim-in anim-delay-1">
        <header className="shop-hero brushed-metal">
          <div className="container">
            <div className="kicker">
              <span className="kicker__dot" aria-hidden="true"></span>
              <span className="eyebrow">Inventory_v1.0</span>
            </div>
            <h1 className="headline shop-hero__title">
              Engineered{" "}
              <span style={{ color: "var(--primary-container)", textShadow: "0 0 10px rgba(0, 240, 255, 0.4)" }}>
                precision.
              </span>
            </h1>
            <p className="muted" style={{ maxWidth: "62ch", fontSize: 18 }}>
              A curated selection of high-performance hardware, machined from premium materials.
            </p>
          </div>
        </header>
        <section className="filters">
          <div className="container filters__row">
            <div className="filters__group">
              <span className="label" style={{ margin: 0 }}>
                Filter by spec:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className="btn btn--ghost"
                  type="button"
                  aria-pressed={activeCategory === cat.key ? "true" : "false"}
                  onClick={() => handleFilter(cat.key)}
                  style={
                    activeCategory === cat.key
                      ? { borderColor: "var(--primary-container)", color: "var(--primary-container)" }
                      : {}
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="container">
          {loading ? (
            <div className="muted" style={{ textAlign: "center", padding: 48 }}>Loading products…</div>
          ) : products.length === 0 ? (
            <div className="muted" style={{ textAlign: "center", padding: 48 }}>No products found.</div>
          ) : (
            <div className="grid" role="list">
              {products.map((product) => (
                <article
                  className={`card product ${!product.inStock ? "product--oos" : ""}`}
                  role="listitem"
                  key={product.id}
                >
                  <Link to={`/product/${product.slug}`} className="product__media" aria-label={`View ${product.name}`}>
                    <img alt={product.name} src={product.image} />
                    {!product.inStock && (
                      <div className="product__oos-overlay">
                        <div className="product__oos-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                          </svg>
                          <span>DEPLETED</span>
                        </div>
                      </div>
                    )}
                  </Link>
                  <div className="card__pad">
                    <h3 className="headline" style={{ margin: "14px 0 6px", fontSize: 22 }}>
                      {product.name}
                    </h3>
                    <p className="muted" style={{ margin: "0 0 16px" }}>
                      {product.description}
                    </p>
                    <div className={`price ${!product.inStock ? "price--oos" : ""}`}>
                      ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                    {product.inStock ? (
                      <Link className="btn btn--primary btn--block" to={`/product/${product.slug}`}>
                        View details
                      </Link>
                    ) : (
                      <button className="btn btn--block btn--disabled" disabled>
                        Currently unavailable
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </MainLayout>
  );
}
