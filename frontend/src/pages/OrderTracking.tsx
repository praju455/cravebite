import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Bike, MapPin, Phone } from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  const statuses = [
    { id: 'Placed', icon: Clock, label: 'Order Placed' },
    { id: 'Confirmed', icon: CheckCircle2, label: 'Order Confirmed' },
    { id: 'Preparing', icon: ChefHat, label: 'Preparing Food' },
    { id: 'Out for Delivery', icon: Bike, label: 'Out for Delivery' },
    { id: 'Delivered', icon: MapPin, label: 'Delivered' }
  ];

  useEffect(() => {
    // Poll for status updates
    const fetchTracking = () => {
      fetch(`http://localhost:5001/api/orders/${id}/track`)
        .then(res => res.json())
        .then(data => {
          setTracking(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchTracking();
    const interval = setInterval(fetchTracking, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="text-center py-20 text-xl animate-pulse">Loading tracking details...</div>;
  if (!tracking || !tracking.order) return <div className="text-center py-20 text-xl">Order not found</div>;

  const currentStatusIndex = statuses.findIndex(s => s.id === tracking.order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2 mb-12">
        <h1 className="text-3xl font-bold">Track Your Order</h1>
        <p className="text-gray-400">Order ID: #{tracking.order.order_id} • From <span className="text-white font-medium">{tracking.order.restaurant_name}</span></p>
      </div>

      {/* Stepper */}
      <div className="glass-card p-8 sm:p-12 mb-8">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-white/10 rounded-full"></div>
          
          {/* Active Progress Bar */}
          <motion.div 
            className="absolute top-6 left-0 h-1 bg-[#ff4d00] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>

          <div className="relative flex justify-between">
            {statuses.map((status, index) => {
              const Icon = status.icon;
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={status.id} className="flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isCurrent ? 1.2 : 1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-[#0a0a0a] transition-colors duration-300 ${
                      isCompleted ? 'bg-[#ff4d00] text-white shadow-[0_0_15px_rgba(255,77,0,0.5)]' : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <p className={`mt-4 text-sm font-medium text-center hidden sm:block ${
                    isCurrent ? 'text-[#ff4d00]' : isCompleted ? 'text-white' : 'text-gray-500'
                  }`}>
                    {status.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Details */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Bike className="text-[#ff4d00]" />
            <span>Delivery Agent</span>
          </h2>
          
          {tracking.delivery ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{tracking.delivery.agent_name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{tracking.delivery.agent_name}</h3>
                  <p className="text-gray-400 text-sm">{tracking.delivery.vehicle} • ★ {Number(tracking.delivery.rating).toFixed(1)}</p>
                </div>
              </div>
              <a href={`tel:${tracking.delivery.agent_phone}`} className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/50 hover:bg-green-500/30 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded-full mx-auto mb-4 animate-spin-slow"></div>
              <p>Assigning delivery partner...</p>
            </div>
          )}
        </div>

        {/* Map Placeholder */}
        <div className="glass-card overflow-hidden h-64 relative group">
          <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[2px] transition-all group-hover:backdrop-blur-none">
            <span className="bg-black/60 px-4 py-2 rounded-lg font-medium text-sm backdrop-blur-md border border-white/10">Live Map View</span>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" 
            alt="Map view" 
            className="w-full h-full object-cover opacity-50 grayscale"
          />
        </div>
      </div>
    </div>
  );
}
