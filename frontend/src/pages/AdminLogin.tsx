import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosInstance';
import { useAdminStore } from '../store/adminStore';
import { Shield, Mail, Lock, LogIn, RefreshCw, Pizza } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAdmin = useAdminStore((s) => s.setAdmin);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/users/admin-login', { email, password });
      setAdmin(data.data.admin, data.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Pizza className="w-9 h-9 text-[#d97706]" />
          <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            Crave<span className="text-[#d97706]">Bite</span>
          </span>
        </div>

        <div className="glass-card p-8 rounded-2xl border-theme">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#d97706]/30">
              <Shield className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Portal</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Restricted access — admins only</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium">
              🚫 {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-3 theme-input"
                  placeholder="admin@cravebite.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-3 theme-input"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#d97706]/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <><LogIn className="w-4 h-4" /><span>Access Dashboard</span></>
              }
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Demo credentials</p>
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              📧 admin@cravebite.com<br />
              🔑 admin123
            </p>
          </div>
        </div>

        <p className="text-center mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Not an admin?{' '}
          <button onClick={() => navigate('/')} className="text-[#d97706] hover:underline font-medium">
            Go to Homepage
          </button>
        </p>
      </motion.div>
    </div>
  );
}
