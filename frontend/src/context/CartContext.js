import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food) => {
    setCartItems((prev) => ({
      ...prev,
      [food._id]: {
        ...food,
        quantity: (prev[food._id]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (foodId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[foodId]?.quantity > 1) {
        updated[foodId] = { ...updated[foodId], quantity: updated[foodId].quantity - 1 };
      } else {
        delete updated[foodId];
      }
      return updated;
    });
  };

  const deleteFromCart = (foodId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[foodId];
      return updated;
    });
  };

  const clearCart = () => setCartItems({});

  const getTotalAmount = () =>
    Object.values(cartItems).reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getTotalItems = () =>
    Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, deleteFromCart, clearCart, getTotalAmount, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
