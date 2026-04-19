import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=85" alt="Cosmetics" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy-900/80 to-burgundy-700/60" />
        <div className="absolute bottom-16 left-16 right-16 text-cream-50">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-400 mb-4">Welcome Back</p>
          <h2 className="font-display text-5xl leading-tight">
            Your beauty, <br/> <span className="italic">your story</span> — <br/> continued.
          </h2>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center bg-cream-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="font-display italic text-4xl text-burgundy-800">Nellure</Link>
            <h1 className="font-display text-3xl text-burgundy-900 mt-6">Sign In</h1>
            <p className="text-sm text-burgundy-900/60 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-cream-50 border border-cream-300 px-4 py-3 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-cream-50 border border-cream-300 px-4 py-3 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-burgundy-700 text-cream-50 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-burgundy-800 disabled:opacity-50 transition-colors">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-burgundy-900/60 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-burgundy-800 font-semibold hover:text-burgundy-600 underline underline-offset-4">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
