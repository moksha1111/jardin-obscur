import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { TrashIcon, EyeIcon, UserIcon, CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-cream-50 border border-cream-200 p-5 flex items-start gap-3">
      <div className={`${color} text-cream-50 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-burgundy-900/60 mb-1">{label}</p>
        <p className="font-display text-2xl text-burgundy-900">{value}</p>
      </div>
    </div>
  );
}

function BarChart({ data, label }) {
  const max = Math.max(...(data || []).map(d => d.count), 1);
  return (
    <div className="bg-cream-50 border border-cream-200 p-5">
      <h3 className="font-display text-lg text-burgundy-900 mb-4">{label}</h3>
      <div className="space-y-2">
        {(data || []).map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm text-burgundy-900/80 w-28 truncate" title={item.name}>{item.name}</span>
            <div className="flex-1 bg-cream-200 h-5 overflow-hidden">
              <div
                className="bg-burgundy-700 h-full transition-all duration-500"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-burgundy-900 w-10 text-right">{item.count}</span>
          </div>
        ))}
        {(!data || data.length === 0) && <p className="text-burgundy-900/40 text-sm italic">No data yet</p>}
      </div>
    </div>
  );
}

function HourlyChart({ data }) {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const match = (data || []).find(d => d.hour === i);
    return { hour: i, count: match ? match.count : 0 };
  });
  const max = Math.max(...hours.map(h => h.count), 1);

  return (
    <div className="bg-cream-50 border border-cream-200 p-5">
      <h3 className="font-display text-lg text-burgundy-900 mb-4">Today's Traffic by Hour</h3>
      <div className="flex items-end gap-1 h-32">
        {hours.map(h => (
          <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-gold-500 transition-all duration-500 min-h-[2px]"
              style={{ height: `${(h.count / max) * 100}%` }}
              title={`${h.hour}:00 — ${h.count} visits`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {hours.filter((_, i) => i % 6 === 0).map(h => (
          <span key={h.hour} className="text-[10px] text-burgundy-900/40" style={{ width: '25%' }}>
            {h.hour}:00
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminVisitorsPage() {
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDevice, setFilterDevice] = useState('');
  const [filterBrowser, setFilterBrowser] = useState('');

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/visitors/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const fetchVisitors = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 30 });
      if (search) params.append('search', search);
      if (filterDevice) params.append('device', filterDevice);
      if (filterBrowser) params.append('browser', filterBrowser);
      const { data } = await api.get(`/visitors?${params}`);
      setVisitors(data.visitors || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load visitors', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchStats(), fetchVisitors()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [page, filterDevice, filterBrowser]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVisitors();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this visit?')) return;
    try {
      await api.delete(`/visitors/${id}`);
      setVisitors(prev => prev.filter(v => v._id !== id));
      setTotal(t => t - 1);
      toast.success('Visit deleted');
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete ALL visits? This cannot be undone.')) return;
    try {
      const { data } = await api.delete('/visitors');
      toast.success(`${data.deletedCount} visits deleted`);
      setVisitors([]);
      setTotal(0);
      setPage(1);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-2">Analytics</p>
          <h1 className="font-display text-4xl text-burgundy-900">Visitor Analytics</h1>
        </div>
        {total > 0 && (
          <button onClick={handleDeleteAll} className="flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-burgundy-700 hover:text-cream-50 transition-colors">
            <TrashIcon className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Visits" value={stats?.total || 0} icon={EyeIcon} color="bg-burgundy-700" />
        <StatCard label="Unique Visitors" value={stats?.uniqueVisitors || 0} icon={UserIcon} color="bg-burgundy-800" />
        <StatCard label="Today" value={stats?.today || 0} icon={CalendarIcon} color="bg-gold-600" />
        <StatCard label="This Week" value={stats?.thisWeek || 0} icon={ChartBarIcon} color="bg-burgundy-600" />
        <StatCard label="This Month" value={stats?.thisMonth || 0} icon={ArrowTrendingUpIcon} color="bg-gold-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <HourlyChart data={stats?.hourlyToday || []} />
        <BarChart data={stats?.topCountries || []} label="Top Countries" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BarChart data={stats?.topBrowsers || []} label="Browsers" />
        <BarChart data={stats?.devices || []} label="Devices" />
        <BarChart data={stats?.topPages || []} label="Top Pages" />
      </div>

      {/* Filters */}
      <div className="bg-cream-50 border border-cream-200 p-5 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search IP, city, or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700"
            />
            <button type="submit" className="bg-burgundy-700 text-cream-50 px-4 py-2 text-xs uppercase tracking-[0.25em] font-medium hover:bg-burgundy-800 transition-colors">
              Search
            </button>
          </form>
          <select
            value={filterDevice}
            onChange={(e) => { setFilterDevice(e.target.value); setPage(1); }}
            className="border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700"
          >
            <option value="">All Devices</option>
            <option value="Desktop">Desktop</option>
            <option value="Mobile">Mobile</option>
            <option value="Tablet">Tablet</option>
          </select>
          <select
            value={filterBrowser}
            onChange={(e) => { setFilterBrowser(e.target.value); setPage(1); }}
            className="border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700"
          >
            <option value="">All Browsers</option>
            <option value="Chrome">Chrome</option>
            <option value="Firefox">Firefox</option>
            <option value="Safari">Safari</option>
            <option value="Edge">Edge</option>
            <option value="Opera">Opera</option>
          </select>
          <span className="text-sm text-burgundy-900/60">{total} results</span>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-cream-50 border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-cream-200">
              <tr className="text-left text-[10px] font-semibold text-gold-600 uppercase tracking-widest">
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Browser</th>
                <th className="px-4 py-3">OS</th>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">ISP</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {visitors.map((v) => (
                <tr key={v._id} className="hover:bg-cream-100 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-burgundy-700">{v.ip}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-burgundy-900">{v.city}</span>
                    <span className="text-burgundy-900/50 ml-1">/ {v.country}</span>
                  </td>
                  <td className="px-4 py-3 text-burgundy-900/80">{v.browser}</td>
                  <td className="px-4 py-3 text-burgundy-900/80">{v.os}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium bg-gold-400/30 text-burgundy-800">{v.device}</span>
                  </td>
                  <td className="px-4 py-3 text-burgundy-900/70 max-w-[200px] truncate" title={v.page}>{v.page}</td>
                  <td className="px-4 py-3 text-burgundy-900/60 text-xs">{v.isp}</td>
                  <td className="px-4 py-3 text-burgundy-900/60 text-xs whitespace-nowrap">
                    {new Date(v.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(v._id)} className="p-1.5 text-burgundy-900/40 hover:text-burgundy-700 hover:bg-burgundy-100 transition-colors" title="Delete visit">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr><td colSpan="9" className="px-4 py-10 text-center text-burgundy-900/40 font-display italic">No visitors recorded yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-cream-200">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-1.5 text-xs uppercase tracking-[0.25em] bg-cream-100 text-burgundy-900 hover:bg-cream-200 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-burgundy-900/70">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-1.5 text-xs uppercase tracking-[0.25em] bg-cream-100 text-burgundy-900 hover:bg-cream-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
