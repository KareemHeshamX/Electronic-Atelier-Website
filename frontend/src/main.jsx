import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "../assets/css/theme.css";
import "../assets/css/components.css";
import "../assets/css/pages/home.css";
import "../assets/css/pages/shop.css";
import "../assets/css/pages/product.css";
import "../assets/css/pages/checkout.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
