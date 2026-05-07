import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function MenuItem({ item, onAdd }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="glass-card p-4 flex justify-between gap-4 border border-white/5 hover:border-white/20 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${item.is_veg ? 'border-green-500' : 'border-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{item.name}</h4>
        </div>
        <p className="text-[#d97706] font-medium mb-2">₹{Number(item.price).toFixed(2)}</p>
        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
      </div>
      
      <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">No Image</div>
        )}
        <button 
          onClick={() => onAdd(item)}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-amber-600 px-4 py-1.5 rounded-lg font-bold shadow-lg text-sm border border-gray-200 hover:bg-gray-50 flex items-center space-x-1 uppercase"
        >
          <span>Add</span>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
