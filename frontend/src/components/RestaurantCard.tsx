import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RestaurantCard({ restaurant }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link to={`/restaurant/${restaurant.restaurant_id}`} className="block h-full">
        <div className="glass-card h-full overflow-hidden group">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={restaurant.image_url} 
              alt={restaurant.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {!restaurant.is_open && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg border-2 border-white px-4 py-1 rounded-full">CLOSED</span>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg flex items-center space-x-1 border border-white/10">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-sm text-white">{Number(restaurant.rating).toFixed(1)}</span>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-[#ff4d00] transition-colors">{restaurant.name}</h3>
            </div>
            
            <p className="text-sm mb-4" style={{color:'var(--text-secondary)'}}>{restaurant.cuisine_type}</p>
            
            <div className="flex items-center text-sm space-x-4" style={{color:'var(--text-secondary)'}}>
              <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                <Clock className="w-4 h-4 text-[#ff4d00]" />
                <span>{restaurant.delivery_time_mins} mins</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
