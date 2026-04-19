import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axios';
import Spinner from '../components/Spinner';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS = {
  pending: 'bg-cream-200 text-burgundy-700',
  processing: 'bg-burgundy-100 text-burgundy-800',
  shipped: 'bg-gold-400/30 text-burgundy-800',
  delivered: 'bg-burgundy-700 text-cream-50',
  cancelled: 'bg-burgundy-900 text-cream-50',
};

const FALLBACK = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!order) return <div className="text-center py-20 font-display italic text-2xl text-burgundy-900/60">Order not found.</div>;

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl text-burgundy-900">Order Details</h1>
            <p className="text-sm font-mono text-burgundy-900/60 mt-2">{order._id}</p>
          </div>
          <span className={`px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-medium ${STATUS_COLORS[order.status]}`}>{order.status}</span>
        </div>

        {/* Progress */}
        {order.status !== 'cancelled' && (
          <div className="bg-cream-100 border border-cream-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${i <= stepIdx ? 'bg-burgundy-700 text-cream-50' : 'bg-cream-200 text-burgundy-900/50'}`}>{i + 1}</div>
                  <span className={`text-[10px] uppercase tracking-widest capitalize font-medium ${i <= stepIdx ? 'text-burgundy-800' : 'text-burgundy-900/40'}`}>{step}</span>
                  {i < STATUS_STEPS.length - 1 && <div className={`h-0.5 w-full mt-4 ${i < stepIdx ? 'bg-burgundy-700' : 'bg-cream-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-cream-100 border border-cream-200 p-6">
            <h2 className="font-display text-xl text-burgundy-900 mb-4">Shipping Address</h2>
            <address className="text-sm text-burgundy-900/80 not-italic space-y-1">
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
            </address>
          </div>

          <div className="bg-cream-100 border border-cream-200 p-6">
            <h2 className="font-display text-xl text-burgundy-900 mb-4">Payment</h2>
            <p className="text-sm text-burgundy-900/80 capitalize">{order.paymentMethod}</p>
            <p className={`text-sm font-semibold mt-2 ${order.isPaid ? 'text-gold-600' : 'text-burgundy-600'}`}>{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not yet paid'}</p>
          </div>
        </div>

        <div className="bg-cream-100 border border-cream-200 p-6 mb-6">
          <h2 className="font-display text-xl text-burgundy-900 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={item.image || FALLBACK} alt={item.name} className="w-14 h-14 object-cover"
                  onError={e => { e.target.src = FALLBACK; }} />
                <div className="flex-1">
                  <p className="font-medium text-burgundy-900 text-sm">{item.name}</p>
                  <p className="text-burgundy-900/50 text-xs">{item.qty} × ${item.price?.toFixed(2)}</p>
                </div>
                <p className="font-semibold text-burgundy-900">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-burgundy-900/10 mt-6 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-burgundy-900/80"><span>Items</span><span>${order.itemsPrice?.toFixed(2)}</span></div>
            <div className="flex justify-between text-burgundy-900/80"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-burgundy-900/80"><span>Tax</span><span>${order.taxPrice?.toFixed(2)}</span></div>
            <div className="flex justify-between font-display text-xl text-burgundy-900 border-t border-burgundy-900/10 pt-2"><span>Total</span><span>${order.totalPrice?.toFixed(2)}</span></div>
          </div>
        </div>

        <Link to="/orders" className="text-burgundy-800 text-sm hover:text-burgundy-600 transition-colors">← Back to Orders</Link>
      </div>
    </div>
  );
}
