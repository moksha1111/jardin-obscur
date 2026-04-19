import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import Spinner from '../../components/Spinner';
import {
  CubeIcon,
  ShoppingBagIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=1').catch(() => ({ data: { total: 0 } })),
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/users').catch(() => ({ data: [] })),
    ]).then(([products, orders, users]) => {
      const ordersArr = orders.data || [];
      const totalRevenue = ordersArr.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const pending = ordersArr.filter(o => o.status === 'pending').length;
      setStats({
        products: products.data.total || 0,
        orders: ordersArr.length,
        users: (users.data || []).length,
        revenue: totalRevenue,
        pending,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: 'Total Products', value: stats?.products, icon: CubeIcon, color: 'bg-burgundy-700' },
    { label: 'Total Orders', value: stats?.orders, icon: ShoppingBagIcon, color: 'bg-burgundy-800' },
    { label: 'Pending Orders', value: stats?.pending, icon: ClockIcon, color: 'bg-gold-600' },
    { label: 'Total Customers', value: stats?.users, icon: UsersIcon, color: 'bg-burgundy-600' },
    { label: 'Total Revenue', value: `$${stats?.revenue?.toFixed(2)}`, icon: CurrencyDollarIcon, color: 'bg-gold-500' },
  ];

  return (
    <div>
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-2">Overview</p>
        <h1 className="font-display text-4xl text-burgundy-900">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-cream-50 border border-cream-200 p-6 flex items-start gap-4">
              <div className={`${card.color} text-cream-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-burgundy-900/60 mb-1">{card.label}</p>
                <p className="font-display text-3xl text-burgundy-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
