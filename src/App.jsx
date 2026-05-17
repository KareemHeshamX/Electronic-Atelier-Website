import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminPage from "./pages/AdminPage";
import { RequireAuth, RequireAdmin } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Auth-required routes */}
      <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
      <Route path="/order/:orderId" element={<RequireAuth><OrderConfirmationPage /></RequireAuth>} />
      <Route path="/orders" element={<RequireAuth><OrderHistoryPage /></RequireAuth>} />

      {/* Admin-only routes */}
      <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />

      {/* Legacy /product without slug redirects to shop */}
      <Route path="/product" element={<Navigate to="/shop" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
