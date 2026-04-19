import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { TrashIcon, ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: me } = useAuth();

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  const toggleRole = async (u) => {
    const action = u.role === 'admin' ? 'remove admin rights from' : 'make admin';
    if (!window.confirm(`Are you sure you want to ${action} ${u.name}?`)) return;
    try {
      const { data } = await api.put(`/users/${u._id}/role`);
      setUsers(users.map(x => x._id === u._id ? { ...x, role: data.role } : x));
      toast.success(`${u.name} is now ${data.role}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Role update failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User removed');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-2">Accounts</p>
        <h1 className="font-display text-4xl text-burgundy-900">Users <span className="text-burgundy-900/40 text-2xl">({users.length})</span></h1>
      </div>

      <div className="bg-cream-50 border border-cream-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 border-b border-cream-200">
            <tr>{['User','Email','Role','Joined','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-gold-600 uppercase tracking-widest">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-cream-100 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-burgundy-700 text-cream-50 flex items-center justify-center font-display text-lg">{u.name?.[0]?.toUpperCase()}</div>
                    <span className="font-medium text-burgundy-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-burgundy-900/70">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-semibold ${u.role === 'admin' ? 'bg-gold-400/40 text-burgundy-800' : 'bg-cream-200 text-burgundy-900/70'}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-burgundy-900/50">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {u._id !== me?._id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleRole(u)}
                        title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                        className={`p-1.5 transition-colors ${u.role === 'admin' ? 'text-gold-600 hover:bg-gold-400/20' : 'text-burgundy-900/50 hover:bg-cream-200'}`}
                      >
                        {u.role === 'admin' ? <ShieldCheckIcon className="w-4 h-4" /> : <ShieldExclamationIcon className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteUser(u._id)} className="p-1.5 text-burgundy-600 hover:bg-burgundy-100 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-burgundy-900/40 font-display italic">No users.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
