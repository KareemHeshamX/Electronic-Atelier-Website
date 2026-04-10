import { Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";

export default function HomePage() {
  useAtelierUi("THE DIGITAL ATELIER | Precision Hardware");

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
                <Link className="btn btn--secondary" to="/product">
                  Specifications
                </Link>
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

            <div className="selection__grid" role="list">
              <article className="selection__featured" role="listitem">
                <img
                  alt="Atelier tab pro"
                  src="/images/home-featured.png"
                />
                <div className="selection__featured-content">
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span className="chip">M3 chip</span>
                    <span className="chip">OLED</span>
                  </div>
                  <h3 className="headline" style={{ margin: 0, fontSize: 34 }}>
                    ATELIER TAB PRO
                  </h3>
                  <p className="muted" style={{ margin: 0, maxWidth: "54ch" }}>
                    The ultimate canvas for digital artisans.
                  </p>
                  <Link
                    to="/product"
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
              <div className="selection__side" role="listitem" aria-label="Secondary picks">
                <article className="card">
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
                        alt="Headphones"
                        src="/images/home-side-headphones.png"
                        style={{ width: "100%", height: "100%", objectFit: "contain", filter: "grayscale(1) brightness(0.8)" }}
                      />
                    </div>
                    <h4 className="headline" style={{ margin: "0 0 6px", fontSize: 18 }}>
                      ACOUSTIC CORE X
                    </h4>
                    <p className="muted" style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Active noise isolation
                    </p>
                    <div style={{ color: "var(--primary)", fontFamily: "var(--font-headline)", fontWeight: 700 }}>
                      $499.00
                    </div>
                  </div>
                </article>

                <article className="card">
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
                        alt="Watch"
                        src="/images/home-side-watch.png"
                        style={{ width: "100%", height: "100%", objectFit: "contain", filter: "grayscale(1) brightness(0.8)" }}
                      />
                    </div>
                    <h4 className="headline" style={{ margin: "0 0 6px", fontSize: 18 }}>
                      CHRONO-LINK
                    </h4>
                    <p className="muted" style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Sapphire glass • Heart sensor
                    </p>
                    <div style={{ color: "var(--primary)", fontFamily: "var(--font-headline)", fontWeight: 700 }}>
                      $349.00
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
