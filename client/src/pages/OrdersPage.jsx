import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import Spinner from '../components/Spinner';

const STATUS_COLORS = {
  pending: 'bg-cream-200 text-burgundy-700',
  processing: 'bg-burgundy-100 text-burgundy-800',
  shipped: 'bg-gold-400/30 text-burgundy-800',
  delivered: 'bg-burgundy-700 text-cream-50',
  cancelled: 'bg-burgundy-900 text-cream-50',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-5xl text-burgundy-900 mb-10">My <span className="italic">Orders</span></h1>
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display italic text-2xl text-burgundy-900/60 mb-6">No orders yet.</p>
            <Link to="/products" className="inline-block bg-burgundy-700 text-cream-50 px-8 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:bg-burgundy-800 transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="block bg-cream-100 border border-cream-200 hover:border-burgundy-700 p-6 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Order ID</p>
                    <p className="font-mono text-sm text-burgundy-900">{order._id}</p>
                    <p className="text-xs text-burgundy-900/50 mt-2">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-medium ${STATUS_COLORS[order.status] || 'bg-cream-200 text-burgundy-800'}`}>{order.status}</span>
                    <p className="font-display text-2xl text-burgundy-900 mt-2">EGP {order.totalPrice?.toFixed(2)}</p>
                    <p className="text-xs text-burgundy-900/50">{order.items?.length} item(s)</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
