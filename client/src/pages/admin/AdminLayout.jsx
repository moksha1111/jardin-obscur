import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Squares2X2Icon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: Squares2X2Icon, exact: true },
  { to: '/admin/products', label: 'Products', icon: CubeIcon },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBagIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/visitors', label: 'Visitors', icon: EyeIcon },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen bg-cream-50">
      <aside className="w-64 bg-burgundy-900 text-cream-50 flex flex-col p-6 gap-2 fixed h-full">
        <Link to="/" className="mb-6">
          <p className="font-display italic text-3xl text-gold-400 leading-none">Nellure</p>
          <p className="text-[10px] uppercase tracking-[0.35em] text-cream-100/50 mt-1">Admin</p>
        </Link>
        <nav className="flex flex-col gap-1 mt-4">
          {LINKS.map(link => {
            const Icon = link.icon;
            const active = link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active ? 'bg-gold-500 text-burgundy-900' : 'text-cream-100/80 hover:bg-burgundy-800 hover:text-cream-50'}`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-burgundy-800 text-xs text-cream-100/50">
          Signed in as
          <p className="text-cream-50 font-medium">{user.name}</p>
        </div>
      </aside>
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
