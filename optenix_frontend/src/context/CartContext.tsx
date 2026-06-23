// src/context/CartContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  subtotal: number;
  gst: number;
  grandTotal: number;

  totalItems: number;
  initialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  const GST_RATE = 0.18;

  /* ---------- LOAD CART ---------- */

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Cart parse error", err);
    }

    setInitialized(true);
  }, []);

  /* ---------- SAVE CART ---------- */

  useEffect(() => {
    if (!initialized) return;

    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );
  }, [cartItems, initialized]);

  /* ---------- ADD ---------- */

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {

      const existing = prev.find(p => p.id === item.id);

      if (existing) {
        return prev.map(p =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      return [...prev, item];
    });
  };

  /* ---------- REMOVE ---------- */

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  /* ---------- UPDATE ---------- */

  const updateQuantity = (id: string, quantity: number) => {

    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  /* ---------- CLEAR ---------- */

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  /* ---------- CALCULATIONS ---------- */

  const subtotal = useMemo(() =>
    cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ), [cartItems]
  );

  const gst = useMemo(() =>
    subtotal * GST_RATE,
    [subtotal]
  );

  const grandTotal = useMemo(() =>
    subtotal + gst,
    [subtotal, gst]
  );

  const totalItems = useMemo(() =>
    cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        gst,
        grandTotal,
        totalItems,
        initialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}