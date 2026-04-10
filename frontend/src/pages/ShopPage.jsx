import { Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { useAtelierUi } from "../hooks/useAtelierUi";

const products = [
  {
    name: "NEO-CARBON PRO",
    price: "$1,299.00",
    desc: "Machined from aerospace-grade carbon fiber with a 144Hz OLED panel.",
    image: "/images/shop-neo-carbon.png",
  },
  {
    name: "ATELIER X-1",
    price: "$2,850.00",
    desc: "A monolithic powerhouse with zero compromise on thermal efficiency.",
    image: "/images/shop-atelier-x1.png",
  },
  {
    name: "SONIC CHAMBER_01",
    price: "$599.00",
    desc: "Acoustically tuned for the purest signal path possible.",
    image: "/images/shop-sonic-chamber.png",
  },
];

export default function ShopPage() {
  useAtelierUi("Shop | THE DIGITAL ATELIER");

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
              <button className="btn btn--ghost" type="button" aria-pressed="true">
                Performance
              </button>
              <button className="btn btn--ghost" type="button" aria-pressed="false">
                Mobility
              </button>
              <button className="btn btn--ghost" type="button" aria-pressed="false">
                Design
              </button>
            </div>
          </div>
        </section>
        <section className="container">
          <div className="grid" role="list">
            {products.map((product) => (
              <article className="card product" role="listitem" key={product.name}>
                <Link to="/product" className="product__media" aria-label={`View ${product.name}`}>
                  <img alt={product.name} src={product.image} />
                </Link>
                <div className="card__pad">
                  <h3 className="headline" style={{ margin: "14px 0 6px", fontSize: 22 }}>
                    {product.name}
                  </h3>
                  <p className="muted" style={{ margin: "0 0 16px" }}>
                    {product.desc}
                  </p>
                  <div className="price">{product.price}</div>
                  <Link className="btn btn--primary btn--block" to="/product">
                    Acquire hardware
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
