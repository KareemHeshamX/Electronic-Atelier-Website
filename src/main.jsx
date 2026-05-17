import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import App from "./App";

import "../assets/css/theme.css";
import "../assets/css/components.css";
import "../assets/css/pages/home.css";
import "../assets/css/pages/shop.css";
import "../assets/css/pages/product.css";
import "../assets/css/pages/checkout.css";
import "../assets/css/pages/auth.css";
import "../assets/css/pages/admin.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
