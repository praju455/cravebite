import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : { restaurant_id: null, items: [] };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, restaurant_id) => {
    setCart(prev => {
      // If adding item from a different restaurant, clear cart first
      if (prev.restaurant_id && prev.restaurant_id !== restaurant_id) {
        if (!window.confirm('Adding this item will clear your current cart from another restaurant. Continue?')) {
          return prev;
        }
        return {
          restaurant_id,
          items: [{ ...item, quantity: 1 }]
        };
      }

      const existingItem = prev.items.find(i => i.item_id === item.item_id);
      let newItems;
      if (existingItem) {
        newItems = prev.items.map(i => 
          i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...prev.items, { ...item, quantity: 1 }];
      }

      return {
        restaurant_id: restaurant_id,
        items: newItems
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newItems = prev.items.map(i => {
        if (i.item_id === itemId) return { ...i, quantity: i.quantity - 1 };
        return i;
      }).filter(i => i.quantity > 0);
      
      return {
        restaurant_id: newItems.length > 0 ? prev.restaurant_id : null,
        items: newItems
      };
    });
  };

  const clearCart = () => setCart({ restaurant_id: null, items: [] });

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
