import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/axiosInstance';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/login', { email, password });
      setAuth(data.data.user, data.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md border-theme">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff4d00] to-[#ff7a00] flex items-center justify-center shadow-lg shadow-[#ff4d00]/20">
            <LogIn className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 focus:outline-none transition-colors theme-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 focus:outline-none transition-colors theme-input"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#ff4d00] to-[#ff7a00] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#ff4d00]/30 transition-all active:scale-[0.98]"
          >
            Login
          </button>
        </form>
        
        <p className="text-center mt-6" style={{color:'var(--text-secondary)'}}>
          Don't have an account? <Link to="/register" className="text-[#ff4d00] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
