import { Link } from 'react-router-dom';
import { ShoppingBag, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="glass-card sticky top-0 z-50 mb-8 mt-4 mx-4 sm:mx-6 lg:mx-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-[#ff4d00]" />
            <span className="font-bold text-xl tracking-tight">Crave<span className="text-[#ff4d00]">Bite</span></span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <Link to="/cart" className="bg-[#ff4d00] text-white px-4 py-2 rounded-full font-medium hover:bg-[#ff6a2b] transition-colors shadow-[0_0_15px_rgba(255,77,0,0.4)]">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
