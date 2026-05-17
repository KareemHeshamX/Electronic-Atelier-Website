/*
  THE DIGITAL ATELIER — Cart Context

  Global cart state shared across all pages via React Context.
  Persists to localStorage so cart survives page refreshes.
*/

import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "atelier_cart";

/* ─── Helpers ─── */

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* ─── Reducer ─── */

function cartReducer(state, action) {
  let next;
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.productId === action.item.productId);
      if (existing) {
        next = state.map((i) =>
          i.productId === action.item.productId
            ? { ...i, quantity: Math.min(99, i.quantity + (action.item.quantity || 1)) }
            : i
        );
      } else {
        next = [...state, { ...action.item, quantity: action.item.quantity || 1 }];
      }
      break;
    }
    case "REMOVE_ITEM":
      next = state.filter((i) => i.productId !== action.productId);
      break;
    case "UPDATE_QUANTITY":
      next = state.map((i) =>
        i.productId === action.productId
          ? { ...i, quantity: Math.max(1, Math.min(99, action.quantity)) }
          : i
      );
      break;
    case "CLEAR":
      next = [];
      break;
    default:
      return state;
  }
  persistCart(next);
  return next;
}

/* ─── Provider ─── */

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, loadCart);

  // Public API passed through context
  const cart = {
    items,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),

    addItem(product, quantity = 1) {
      dispatch({
        type: "ADD_ITEM",
        item: {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      });
    },

    removeItem(productId) {
      dispatch({ type: "REMOVE_ITEM", productId });
    },

    updateQuantity(productId, quantity) {
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
    },

    clear() {
      dispatch({ type: "CLEAR" });
    },
  };

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

/* ─── Hook ─── */

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a <CartProvider>");
  return ctx;
}
