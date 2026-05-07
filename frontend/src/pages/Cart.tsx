import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/axiosInstance';
import { Trash2, CreditCard, Banknote, Wallet, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
  const cartItems = useCartStore(state => state.items);
  const restaurant_id = useCartStore(state => state.restaurant_id);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const getCartTotal = useCartStore(state => state.getCartTotal);
  const clearCart = useCartStore(state => state.clearCart);
  const user = useAuthStore(state => state.user);
  
  const navigate = useNavigate();
  const [address, setAddress] = useState('123, Default Street, Bangalore');
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'UPI', icon: Smartphone, label: 'UPI' },
    { id: 'Card', icon: CreditCard, label: 'Credit/Debit Card' },
    { id: 'Cash', icon: Banknote, label: 'Cash on Delivery' },
    { id: 'Wallet', icon: Wallet, label: 'Digital Wallet' },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-48 h-48 mb-8 opacity-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate('/')} className="bg-[#ff4d00] text-white px-8 py-3 rounded-xl font-bold">
          Explore Restaurants
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      if (!user) {
        alert("Please login first");
        return;
      }
      
      const items = cartItems.map(i => ({
        item_id: i.item_id,
        quantity: i.quantity,
        unit_price: i.price
      }));

      const { data } = await api.post('/orders', {
        restaurant_id: restaurant_id,
        items: items
      });
      
      if (data.success) {
        clearCart();
        navigate(`/track/\${data.data.order_id}`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Order Summary */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Order Summary</h2>
        <div className="glass-card p-6 space-y-4">
          {cartItems.map(item => (
            <motion.div layout key={item.item_id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10">
                  {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{item.name}</h4>
                  <p className="text-gray-400">₹{Number(item.price).toFixed(2)} x {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-bold text-lg">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => removeFromCart(item.item_id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-bold pt-4">Delivery Details</h2>
        <div className="glass-card p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Delivery Address</label>
          <textarea 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ff4d00] transition-colors"
            rows="3"
          ></textarea>
        </div>
      </div>

      {/* Payment & Checkout */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Payment Method</h2>
        <div className="glass-card p-6 space-y-3">
          {paymentMethods.map(pm => {
            const Icon = pm.icon;
            return (
              <button
                key={pm.id}
                onClick={() => setMethod(pm.id)}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl border transition-all ${
                  method === pm.id 
                    ? 'border-[#ff4d00] bg-[#ff4d00]/10 text-[#ff4d00]' 
                    : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{pm.label}</span>
              </button>
            )
          })}
        </div>

        <div className="glass-card p-6">
          <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Delivery Fee</span>
              <span>₹40.00</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Taxes</span>
              <span>₹{(getCartTotal() * 0.05).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold mb-8">
            <span>Total</span>
            <span className="text-[#ff4d00]">₹{(getCartTotal() * 1.05 + 40).toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-[#ff4d00] text-white p-4 rounded-xl font-bold text-lg hover:bg-[#ff6a2b] transition-colors shadow-[0_5px_20px_rgba(255,77,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
