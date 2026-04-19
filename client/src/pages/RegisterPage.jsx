import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      login(data);
      toast.success('Welcome to Nellure');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=85" alt="Cosmetics" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy-900/80 to-burgundy-700/60" />
        <div className="absolute bottom-16 left-16 right-16 text-cream-50">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-400 mb-4">Join Us</p>
          <h2 className="font-display text-5xl leading-tight">
            Begin your <br/> <span className="italic">beauty</span> <br/> journey.
          </h2>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center bg-cream-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="font-display italic text-4xl text-burgundy-800">Nellure</Link>
            <h1 className="font-display text-3xl text-burgundy-900 mt-6">Create your account</h1>
            <p className="text-sm text-burgundy-900/60 mt-1">Join a world of considered beauty and rituals</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[['name','Name','text','Your full name'],['email','Email','email','you@example.com'],['password','Password','password','••••••••'],['confirm','Confirm Password','password','••••••••']].map(([field, label, type, placeholder]) => (
              <div key={field}>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">{label}</label>
                <input type={type} required value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} className="w-full bg-cream-50 border border-cream-300 px-4 py-3 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700" placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full bg-burgundy-700 text-cream-50 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-burgundy-800 disabled:opacity-50 transition-colors">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-burgundy-900/60 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-burgundy-800 font-semibold hover:text-burgundy-600 underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
