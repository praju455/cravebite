import { Link } from 'react-router-dom';
import { ShoppingBag, User, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export default function Navbar() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <nav className="glass-card sticky top-0 z-50 mb-8 mt-4 mx-4 sm:mx-6 lg:mx-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-[#ff4d00]" />
            <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Crave<span className="text-[#ff4d00]">Bite</span>
            </span>
          </Link>

          <div className="flex items-center space-x-5">
            <Link
              to="/dashboard"
              className="transition-colors flex items-center space-x-1 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            <Link
              to="/profile"
              className="transition-colors flex items-center space-x-1 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: isDark ? '#facc15' : '#ff4d00',
              }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/cart"
              className="bg-[#ff4d00] text-white px-4 py-2 rounded-full font-medium hover:bg-[#ff6a2b] transition-colors"
              style={{ boxShadow: '0 0 15px var(--accent-shadow)' }}
            >
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
