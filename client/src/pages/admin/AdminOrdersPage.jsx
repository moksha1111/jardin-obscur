import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled'];
const STATUS_COLORS = {
  pending: 'bg-cream-200 text-burgundy-700',
  processing: 'bg-burgundy-100 text-burgundy-800',
  shipped: 'bg-gold-400/30 text-burgundy-800',
  delivered: 'bg-burgundy-700 text-cream-50',
  cancelled: 'bg-burgundy-900 text-cream-50',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-2">Management</p>
        <h1 className="font-display text-4xl text-burgundy-900">Orders <span className="text-burgundy-900/40 text-2xl">({orders.length})</span></h1>
      </div>

      <div className="bg-cream-50 border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-cream-200">
              <tr>{['Order ID','Customer','Date','Total','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-gold-600 uppercase tracking-widest">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-cream-100 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-burgundy-900/60">{order._id.slice(-8)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-burgundy-900">{order.user?.name}</p>
                    <p className="text-burgundy-900/50 text-xs">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-burgundy-900/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-display text-lg text-burgundy-900">${order.totalPrice?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      className={`text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/orders/${order._id}`} className="text-burgundy-700 text-xs uppercase tracking-widest hover:text-burgundy-900">View</Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-burgundy-900/40 font-display italic">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
