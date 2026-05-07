import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const cuisines = ['All', 'Fast Food', 'Italian', 'Indian', 'Continental', 'Cafe', 'Desserts'];

  useEffect(() => {
    fetch('http://localhost:5001/api/restaurants')
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch restaurants', err);
        setLoading(false);
      });
  }, []);

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || r.cuisine_type === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-card p-8 sm:p-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d00]/20 to-transparent opacity-50"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl sm:text-6xl font-extrabold tracking-tight"
          >
            Food at your door, <br/><span className="text-[#ff4d00]">faster than ever</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            Discover the best food & drinks in Bangalore
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto relative mt-8"
          >
            <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white/10 overflow-hidden border border-white/20 backdrop-blur-md">
              <div className="grid place-items-center h-full w-12 text-gray-300">
                <Search className="h-6 w-6" />
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-white bg-transparent pr-4 placeholder-gray-400"
                type="text"
                id="search"
                placeholder="Search for restaurants or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cuisines Filter */}
      <section>
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
          {cuisines.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-300 border ${
                selectedCuisine === cuisine 
                  ? 'bg-[#ff4d00] text-white border-[#ff4d00] shadow-[0_0_15px_rgba(255,77,0,0.4)]' 
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Popular Restaurants</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-72 animate-pulse bg-white/5"></div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <h3 className="text-xl text-gray-400">No restaurants found matching your criteria.</h3>
          </div>
        )}
      </section>
    </div>
  );
}
