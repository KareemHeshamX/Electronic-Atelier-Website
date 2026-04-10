import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="topbar anim-in">
      <div className="container topbar__inner">
        <Link className="brand" to="/">
          THE DIGITAL ATELIER
        </Link>

        <nav className="nav" aria-label="Primary">
          <NavLink to="/">Home</NavLink>
          <div className="nav-dropdown" data-products-dropdown data-open="false">
            <NavLink
              className="nav__trigger"
              to="/shop"
              data-products-trigger
              aria-haspopup="menu"
              aria-expanded="false"
            >
              Products <span className="nav__chev">▾</span>
            </NavLink>
            <div className="nav-dropdown__menu" role="menu" aria-label="Products" data-products-menu>
              <Link to="/shop" role="menuitem">
                All products
              </Link>
              <Link to="/shop#laptops" role="menuitem">
                Laptops
              </Link>
              <Link to="/shop#smartphones" role="menuitem">
                Smartphones
              </Link>
              <Link to="/shop#accessories" role="menuitem">
                Accessories
              </Link>
            </div>
          </div>
        </nav>

        <div className="topbar__actions">
          <button className="icon-btn nav-toggle" type="button" aria-expanded="false" data-nav-toggle>
            Menu
          </button>
          <Link className="icon-btn" to="/checkout" aria-label="Open cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-cart"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="container mobile-nav" data-mobile-nav data-open="false">
        <Link to="/">Home</Link>
        <Link to="/shop">Products</Link>
        <Link className="mobile-nav__sub" to="/shop#laptops">
          Laptops
        </Link>
        <Link className="mobile-nav__sub" to="/shop#smartphones">
          Smartphones
        </Link>
        <Link className="mobile-nav__sub" to="/shop#accessories">
          Accessories
        </Link>
        <Link to="/checkout">Cart</Link>
      </div>
    </header>
  );
}
