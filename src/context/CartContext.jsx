import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. Load initial cart from local storage so it survives page refreshes
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('sitaram_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from local storage", error);
      return [];
    }
  });

  // 2. Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('sitaram_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Add to Cart Logic
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Use cartItemId if available (for variants), otherwise fallback to id
      const identifier = product.cartItemId || product.id;
      
      const existingItemIndex = prevItems.findIndex(
        item => (item.cartItemId || item.id) === identifier
      );

      if (existingItemIndex > -1) {
        // Item exists, just increase quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }
      
      // New item, add it to the array
      return [...prevItems, { ...product, quantity }];
    });
  };

  // 4. Update Quantity
const updateQuantity = (identifier, newQuantity) => {
  if (newQuantity < 1) return;

  setCartItems(prevItems =>
    prevItems.map(item =>
      ((item.cartItemId || item.id) === identifier)
        ? { ...item, quantity: newQuantity }
        : item
    )
  );
};

// 5. Remove from Cart
const removeFromCart = (identifier) => {
  setCartItems(prevItems =>
    prevItems.filter(
      item => ((item.cartItemId || item.id) !== identifier)
    )
  );
};
  // 6. Clear Cart (Used after successful checkout)
  const clearCart = () => {
    setCartItems([]);
  };

  // 7. Calculate Cart Total automatically
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || Number(item.price_npr) || 0;
    return sum + (price * item.quantity);
  }, 0);

  // 8. Calculate total item count automatically
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};