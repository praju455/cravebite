import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem } from '../types';

interface CartState {
  restaurant_id: number | null;
  items: CartItem[];
  addToCart: (item: MenuItem, restaurantId: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurant_id: null,
      items: [],
      
      addToCart: (item, restaurantId) => set((state) => {
        if (state.restaurant_id && state.restaurant_id !== restaurantId) {
          if (!window.confirm('Adding this item will clear your current cart from another restaurant. Continue?')) {
            return state;
          }
          return {
            restaurant_id: restaurantId,
            items: [{ ...item, quantity: 1 }]
          };
        }

        const existingItem = state.items.find(i => i.item_id === item.item_id);
        if (existingItem) {
          return {
            restaurant_id: restaurantId,
            items: state.items.map(i => 
              i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }

        return {
          restaurant_id: restaurantId,
          items: [...state.items, { ...item, quantity: 1 }]
        };
      }),
      
      removeFromCart: (itemId) => set((state) => {
        const newItems = state.items.map(i => 
          i.item_id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0);

        return {
          restaurant_id: newItems.length > 0 ? state.restaurant_id : null,
          items: newItems
        };
      }),
      
      clearCart: () => set({ restaurant_id: null, items: [] }),
      
      getCartTotal: () => get().items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0),
      
      getCartCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
