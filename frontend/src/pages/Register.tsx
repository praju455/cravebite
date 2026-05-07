import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axiosInstance';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="glass-card p-8 rounded-2xl w-full max-w-lg border border-white/10">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff4d00] to-[#ff7a00] flex items-center justify-center shadow-lg shadow-[#ff4d00]/20">
            <UserPlus className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold">Create Account</h2>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff4d00]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff4d00]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff4d00]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
            <input
              type="tel"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff4d00]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
            <textarea
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff4d00]"
              rows={2}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#ff4d00] to-[#ff7a00] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#ff4d00]/30 transition-all mt-4"
          >
            Sign Up
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-[#ff4d00] hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
