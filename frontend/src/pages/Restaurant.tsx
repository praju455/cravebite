import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Info } from 'lucide-react';
import MenuItem from '../components/MenuItem';
import { useCartStore } from '../store/cartStore';
import { useRestaurant, useMenu } from '../hooks/useRestaurants';
import { motion, AnimatePresence } from 'framer-motion';

export default function Restaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const parsedId = id ? parseInt(id, 10) : 0;
  
  const { data: restaurant, isLoading: loadingRest } = useRestaurant(parsedId);
  const { data: menu = {}, isLoading: loadingMenu } = useMenu(parsedId);
  
  const addToCart = useCartStore(state => state.addToCart);
  const getCartCount = useCartStore(state => state.getCartCount);
  const getCartTotal = useCartStore(state => state.getCartTotal);

  const loading = loadingRest || loadingMenu;

  if (loading) return <div className="text-center py-20 animate-pulse text-xl">Loading...</div>;
  if (!restaurant) return <div className="text-center py-20">Restaurant not found</div>;

  return (
    <div className="relative pb-24">
      {/* Restaurant Header */}
      <div className="glass-card overflow-hidden mb-8 rounded-3xl relative">
        <div className="h-64 sm:h-80 w-full relative">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{restaurant.name}</h1>
            <p className="text-gray-300 text-lg mb-4">{restaurant.cuisine_type} • {restaurant.city}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white">{Number(restaurant.rating).toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <Clock className="w-5 h-5 text-[#ff4d00]" />
                <span className="font-bold text-white">{restaurant.delivery_time_mins} mins</span>
              </div>
              {!restaurant.is_open && (
                <div className="bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg font-bold border border-red-500/50">
                  Currently Closed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-12">
        {Object.entries(menu).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-2">{category}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {items.map(item => (
                <MenuItem key={item.item_id} item={item} onAdd={(i) => addToCart(i, parseInt(id))} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {getCartCount() > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none"
          >
            <div className="max-w-3xl mx-auto pointer-events-auto">
              <button 
                onClick={() => navigate('/cart')}
                className="w-full bg-[#ff4d00] text-white p-4 rounded-2xl font-bold flex justify-between items-center shadow-[0_10px_30px_rgba(255,77,0,0.5)] hover:bg-[#ff6a2b] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="bg-black/20 px-3 py-1 rounded-lg">{getCartCount()} items</span>
                  <span>|</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <span className="flex items-center space-x-2">
                  <span>View Cart</span>
                  <span>→</span>
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
