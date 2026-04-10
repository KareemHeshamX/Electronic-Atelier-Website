import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
