import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/axiosInstance';
import { LogIn, Mail, Shield, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/users/send-otp', { email });
      setDemoOtp(data.data.otp); // Show for demo
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/users/verify-otp', { email, otp });
      setAuth(data.data.user, data.data.token);
      navigate('/restaurants');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl w-full max-w-md border-theme"
      >
        {/* Header */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#d97706]/20">
            {step === 'email' ? <LogIn className="text-white" size={22} /> : <Shield className="text-white" size={22} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {step === 'email' ? 'Welcome Back' : 'Enter OTP'}
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {step === 'email' ? 'Login with OTP — no password needed' : `Sent to ${email}`}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-5 text-sm text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.form key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl pl-10 pr-4 py-3 theme-input"
                    placeholder="rahul@example.com"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#d97706]/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </motion.form>
          ) : (
            <motion.form key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleVerifyOtp} className="space-y-5">
              {/* Demo OTP display */}
              {demoOtp && (
                <div className="rounded-xl p-4 text-center border" style={{ borderColor: 'var(--accent)', background: 'rgba(15,118,110,0.08)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>🔐 Demo OTP (would be sent via SMS)</p>
                  <p className="text-3xl font-mono font-bold tracking-widest text-[#d97706]">{demoOtp}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full rounded-xl px-4 py-3 theme-input text-center text-2xl font-mono tracking-widest"
                  placeholder="• • • • • •"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#d97706]/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><span>Verify & Login</span><Shield className="w-4 h-4" /></>}
              </button>
              <button type="button" onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                className="w-full text-sm underline" style={{ color: 'var(--text-muted)' }}>
                Use a different email
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" className="text-[#d97706] hover:underline font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
