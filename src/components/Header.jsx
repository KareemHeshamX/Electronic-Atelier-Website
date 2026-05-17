import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

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
              <Link to="/shop?category=laptops" role="menuitem">
                Laptops
              </Link>
              <Link to="/shop?category=smartphones" role="menuitem">
                Smartphones
              </Link>
              <Link to="/shop?category=accessories" role="menuitem">
                Accessories
              </Link>
            </div>
          </div>
          {isAuthenticated && <NavLink to="/orders">My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin">Dashboard</NavLink>}
        </nav>

        <div className="topbar__actions">
          <button className="icon-btn nav-toggle" type="button" aria-expanded="false" data-nav-toggle>
            Menu
          </button>

          {isAuthenticated ? (
            <>
              <div className="user-greeting">
                <span className="eyebrow" style={{ fontSize: 9 }}>
                  {user?.firstName}
                </span>
              </div>
              <button
                className="icon-btn"
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
              </button>
            </>
          ) : (
            <Link className="btn btn--ghost" to="/login" style={{ padding: "8px 14px", fontSize: 10 }}>
              Login
            </Link>
          )}

          <Link className="icon-btn cart-icon" to="/checkout" aria-label="Open cart">
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
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>

      <div className="container mobile-nav" data-mobile-nav data-open="false">
        <Link to="/">Home</Link>
        <Link to="/shop">Products</Link>
        <Link className="mobile-nav__sub" to="/shop?category=laptops">Laptops</Link>
        <Link className="mobile-nav__sub" to="/shop?category=smartphones">Smartphones</Link>
        <Link className="mobile-nav__sub" to="/shop?category=accessories">Accessories</Link>
        {isAuthenticated && <Link to="/orders">My Orders</Link>}
        {isAdmin && <Link to="/admin">Dashboard</Link>}
        <Link to="/checkout">Cart{totalItems > 0 ? ` (${totalItems})` : ""}</Link>
        {isAuthenticated ? (
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
            Logout ({user?.firstName})
          </a>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
