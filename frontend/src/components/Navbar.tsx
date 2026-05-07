import { Link, useNavigate } from 'react-router-dom';
import { Pizza, User, Sun, Moon, LogOut } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <nav className="glass-card sticky top-0 z-50 mb-8 mt-4 mx-4 sm:mx-6 lg:mx-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: User info (if logged in) OR Logo */}
          {token && user ? (
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#d97706]/20 flex-shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
              </div>
            </div>
          ) : (
            <Link to="/" className="flex items-center space-x-2">
              <Pizza className="w-8 h-8 text-[#d97706]" />
              <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Crave<span className="text-[#d97706]">Bite</span>
              </span>
            </Link>
          )}

          {/* Right: Nav actions */}
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link to="/profile"
                  className="transition-colors flex items-center space-x-1 text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}>
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  title="Logout"
                  className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-red-400"
                  style={{ color: 'var(--text-secondary)' }}>
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login"
                className="transition-colors flex items-center space-x-1 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}>
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: isDark ? '#facc15' : '#d97706' }}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link to="/cart"
              className="bg-[#d97706] text-white px-4 py-2 rounded-full font-medium hover:bg-[#f59e0b] transition-colors"
              style={{ boxShadow: '0 0 15px var(--accent-shadow)' }}>
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
