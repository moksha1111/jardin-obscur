import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ street: '', city: '', state: '', zip: '', country: 'US' });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const items = cart?.items || [];
  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 50 ? 0 : 9.99;
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your bag is empty'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ product: i.product, name: i.name, image: i.image, price: i.price, qty: i.qty })),
        shippingAddress: form,
        paymentMethod,
        itemsPrice: parseFloat(itemsPrice.toFixed(2)),
        shippingPrice: parseFloat(shippingPrice.toFixed(2)),
        taxPrice: parseFloat(taxPrice.toFixed(2)),
        totalPrice: parseFloat(totalPrice.toFixed(2))
      });
      await clearCart();
      toast.success('Order placed successfully');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-5xl text-burgundy-900 mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-cream-100 border border-cream-200 p-7">
              <h2 className="font-display text-2xl text-burgundy-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['street','Street Address','sm:col-span-2'],['city','City',''],['state','State',''],['zip','ZIP Code',''],['country','Country','']].map(([field, label, cls]) => (
                  <div key={field} className={cls}>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">{label}</label>
                    <input required value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} className="w-full bg-cream-50 border border-cream-300 px-4 py-3 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700" />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-cream-100 border border-cream-200 p-7">
              <h2 className="font-display text-2xl text-burgundy-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                {[['card','Credit / Debit Card'],['paypal','PayPal'],['cod','Cash on Delivery']].map(([val, label]) => (
                  <label key={val} className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-colors ${paymentMethod === val ? 'border-burgundy-700 bg-cream-50' : 'border-cream-300 hover:border-burgundy-400'}`}>
                    <input type="radio" name="payment" value={val} checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} className="accent-burgundy-700" />
                    <span className="text-sm font-medium text-burgundy-900">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-burgundy-700 text-cream-50 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-burgundy-800 disabled:opacity-50 transition-colors">
              {loading ? 'Placing Order...' : `Place Order — $${totalPrice.toFixed(2)}`}
            </button>
          </form>

          {/* Summary */}
          <div className="bg-cream-100 border border-cream-200 p-7 h-fit">
            <h2 className="font-display text-2xl text-burgundy-900 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map(i => (
                <div key={i.product} className="flex justify-between text-sm">
                  <span className="text-burgundy-900/80 line-clamp-1 flex-1">{i.name} × {i.qty}</span>
                  <span className="font-medium text-burgundy-900 ml-4">${(i.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-burgundy-900/20 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-burgundy-900/80"><span>Subtotal</span><span>${itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-burgundy-900/80"><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-burgundy-900/80"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
              <div className="border-t border-burgundy-900/20 pt-2 flex justify-between font-display text-xl text-burgundy-900"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
