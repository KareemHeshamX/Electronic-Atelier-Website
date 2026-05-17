import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";
import { fetchFeaturedProducts, fetchProducts } from "../api";

export default function HomePage() {
  useAtelierUi("THE DIGITAL ATELIER | Precision Hardware");

  const [featured, setFeatured] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFeaturedProducts(), fetchProducts("accessories")])
      .then(([feat, acc]) => {
        setFeatured(feat);
        setAccessories(acc.slice(0, 2)); // Show first two accessories
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hero = featured[0]; // Primary featured product for the hero
  const featuredSecondary = featured[1]; // Secondary featured for selection

  return (
    <MainLayout>
      <main className="anim-in anim-delay-1">
        <section className="hero brushed-metal">
          <div className="container hero__grid">
            <div>
              <div className="kicker">
                <span className="status-pulse"></span>
                <span className="eyebrow">Established 2024</span>
              </div>
              <h1 className="headline hero__title">
                THE
                <br />
                <span style={{ color: "var(--primary-container)" }}>MONOLITH</span>
                <br />
                SERIES
              </h1>
              <p className="hero__lede muted">
                Engineered with aerospace-grade aluminum and liquid-crystal cooling.
              </p>
              <div style={{ display: "flex", gap: 12, paddingTop: 18 }}>
                <Link className="btn btn--primary" to="/shop">
                  Acquire now
                </Link>
                {hero && (
                  <Link className="btn btn--secondary" to={`/product/${hero.slug}`}>
                    Specifications
                  </Link>
                )}
              </div>
            </div>
            <div className="hero__img-wrap">
              <div className="hero__glow" aria-hidden="true"></div>
              <img
                alt="Featured laptop"
                src="/images/home-hero.png"
              />
              <div className="machined-glass hero__badge" aria-label="Current version badge">
                <div className="muted" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Current version
                </div>
                <div className="headline" style={{ fontWeight: 800, color: "var(--primary-container)", fontSize: 18 }}>
                  0.99.1 BETA
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section surface--lowest">
          <div className="container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                gap: 18,
                flexWrap: "wrap",
                marginBottom: 28,
              }}
            >
              <div>
                <h2 className="headline" style={{ margin: "0 0 10px", fontSize: 34 }}>
                  The selection
                </h2>
                <div style={{ height: 4, width: 90, background: "var(--primary-container)" }}></div>
              </div>
            </div>

            {loading ? (
              <div className="muted" style={{ textAlign: "center", padding: 48 }}>Loading catalogue…</div>
            ) : (
              <div className="selection__grid" role="list">
                {featuredSecondary && (
                  <article className="selection__featured" role="listitem">
                    <img
                      alt={featuredSecondary.name}
                      src={featuredSecondary.image}
                    />
                    <div className="selection__featured-content">
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {featuredSecondary.tags.map((tag) => (
                          <span className="chip" key={tag}>{tag}</span>
                        ))}
                      </div>
                      <h3 className="headline" style={{ margin: 0, fontSize: 34 }}>
                        {featuredSecondary.name}
                      </h3>
                      <p className="muted" style={{ margin: 0, maxWidth: "54ch" }}>
                        {featuredSecondary.description}
                      </p>
                      <Link
                        to={`/product/${featuredSecondary.slug}`}
                        style={{
                          marginTop: 10,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          fontSize: 11,
                          color: "var(--primary)",
                        }}
                      >
                        View system →
                      </Link>
                    </div>
                  </article>
                )}
                <div className="selection__side" role="listitem" aria-label="Secondary picks">
                  {accessories.map((acc) => (
                    <article className="card" key={acc.id}>
                      <Link to={`/product/${acc.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="card__pad">
                          <div
                            style={{
                              height: 180,
                              background: "var(--surface-lowest)",
                              overflow: "hidden",
                              marginBottom: 14,
                            }}
                          >
                            <img
                              alt={acc.name}
                              src={acc.image}
                              style={{ width: "100%", height: "100%", objectFit: "contain", filter: "grayscale(1) brightness(0.8)" }}
                            />
                          </div>
                          <h4 className="headline" style={{ margin: "0 0 6px", fontSize: 18 }}>
                            {acc.name}
                          </h4>
                          <p className="muted" style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                            {acc.tags.join(" • ")}
                          </p>
                          <div style={{ color: "var(--primary)", fontFamily: "var(--font-headline)", fontWeight: 700 }}>
                            ${acc.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
