import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', address: user?.address || {} });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, address: form.address };
      if (form.password) payload.password = form.password;
      const { data } = await api.put('/users/profile', payload);
      login({ ...user, ...data });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-display text-5xl text-burgundy-900 mb-10">My <span className="italic">Profile</span></h1>
        <div className="bg-cream-100 border border-cream-200 p-8">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-burgundy-900/10">
            <div className="w-16 h-16 rounded-full bg-burgundy-700 flex items-center justify-center text-2xl font-display text-cream-50">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p className="font-display text-2xl text-burgundy-900">{user?.name}</p>
              <p className="text-burgundy-900/60 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium bg-gold-400/40 text-burgundy-800 capitalize">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[['name','Full Name','text'],['email','Email','email']].map(([field,label,type]) => (
              <div key={field}>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">{label}</label>
                <input type={type} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} className="w-full bg-cream-50 border border-cream-300 px-4 py-3 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">New Password <span className="text-burgundy-900/50 normal-case">(leave blank to keep current)</span></label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-cream-50 border border-cream-300 px-4 py-3 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700" placeholder="••••••••" />
            </div>

            <div className="border-t border-burgundy-900/10 pt-5">
              <h3 className="font-display text-xl text-burgundy-900 mb-4">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                {[['street','Street','col-span-2'],['city','City',''],['state','State',''],['zip','ZIP',''],['country','Country','']].map(([field,label,cls]) => (
                  <div key={field} className={cls}>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">{label}</label>
                    <input value={form.address?.[field] || ''} onChange={e => setForm({...form, address: {...form.address, [field]: e.target.value}})} className="w-full bg-cream-50 border border-cream-300 px-3 py-2 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700" />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-burgundy-700 text-cream-50 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-burgundy-800 disabled:opacity-50 transition-colors">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
