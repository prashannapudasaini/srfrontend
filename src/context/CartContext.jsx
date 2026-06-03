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
      // Prioritize composite key (for variants), fallback to standard id
      const currentIdentifier = product.cartItemId || product.id;
      
      const existingItemIndex = prevItems.findIndex(item => {
        const itemIdentifier = item.cartItemId || item.id;
        return itemIdentifier === currentIdentifier;
      });

      if (existingItemIndex > -1) {
        // Item exists, just increase quantity safely mutation-free
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        return newItems;
      }
      
      // New item, add it to the array
      return [...prevItems, { ...product, quantity }];
    });
  };

  // 4. Update Quantity (Fixed strict identity resolution)
  const updateQuantity = (identifier, newQuantity) => {
    if (newQuantity < 1) return; 
    
    setCartItems(prevItems => 
      prevItems.map(item => {
        const itemIdentifier = item.cartItemId || item.id;
        return itemIdentifier === identifier
          ? { ...item, quantity: newQuantity } 
          : item;
      })
    );
  };

  // 5. Remove from Cart (Fixed strict identity filter)
  const removeFromCart = (identifier) => {
    setCartItems(prevItems => 
      prevItems.filter(item => {
        const itemIdentifier = item.cartItemId || item.id;
        return itemIdentifier !== identifier;
      })
    );
  };

  // 6. Clear Cart
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