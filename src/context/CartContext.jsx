// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('sitaRamCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync to local storage whenever cart updates
  useEffect(() => {
    localStorage.setItem('sitaRamCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
    );
  };

  // Allows AuthContext / Header to instantly empty the cart upon logout
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('sitaRamCart');
  };

  // Ensure price is treated as a number for accurate subtotal calculation
  const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};