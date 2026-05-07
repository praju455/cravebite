import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useOrderHistory } from '../hooks/useOrders';
import { Package, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const user = useAuthStore(state => state.user);
  const { data: orders = [], isLoading: loading } = useOrderHistory();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const toggleOrder = (id) => {
    if (expandedOrder === id) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(id);
    }
  };

  if (loading) return <div className="text-center py-20 text-xl animate-pulse">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="glass-card p-8 flex items-center space-x-6">
        <div className="w-24 h-24 bg-[#d97706] rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/10 shadow-[0_0_20px_rgba(217,119,6,0.5)] uppercase">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.name || 'User'}</h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold pt-4">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 glass-card">
          <Package className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <p className="text-xl text-gray-400">No orders placed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.order_id} className="glass-card overflow-hidden">
              <div 
                onClick={() => toggleOrder(order.order_id)}
                className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    order.status === 'Delivered' ? 'bg-amber-500/20 text-amber-400' :
                    order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-orange-600/20 text-orange-600'
                  }`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{order.restaurant_name}</h3>
                    <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-lg">₹{Number(order.total_amount).toFixed(2)}</p>
                    <p className={`text-sm font-medium ${
                      order.status === 'Delivered' ? 'text-amber-400' :
                      order.status === 'Cancelled' ? 'text-red-400' :
                      'text-orange-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                  {expandedOrder === order.order_id ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedOrder === order.order_id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 bg-black/20"
                  >
                    <div className="p-6 flex flex-col sm:flex-row justify-between gap-6">
                      <div className="space-y-2">
                        <p className="font-medium text-gray-300">Payment: <span className="text-white">{order.payment_method} ({order.payment_status})</span></p>
                        {order.status === 'Delivered' && (
                          <button className="mt-4 flex items-center space-x-2 text-[#d97706] hover:text-[#f59e0b] transition-colors border border-[#d97706] px-4 py-2 rounded-lg font-medium">
                            <Star className="w-4 h-4" />
                            <span>Rate & Review</span>
                          </button>
                        )}
                      </div>
                      <div className="text-right flex flex-col justify-end sm:hidden">
                        <p className="font-bold text-lg">₹{Number(order.total_amount).toFixed(2)}</p>
                        <p className="text-sm text-[#d97706]">{order.status}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
