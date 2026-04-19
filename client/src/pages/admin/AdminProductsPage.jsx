import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const CATEGORIES = ['Lips', 'Eyes', 'Face', 'Skincare', 'Body'];
const FINISHES = ['', 'Matte', 'Satin', 'Glossy', 'Shimmer', 'Dewy', 'Cream'];

const EMPTY = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'Lips', brand: '', stock: '', images: '', featured: false, tags: '',
  volume: '', shade: '', finish: '', ingredients: '',
};

const FALLBACK = 'https://images.unsplash.com/photo-1574621100236-d25b64cfd647?w=80';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    setLoading(true);
    api.get(`/products?page=${page}&limit=10`)
      .then(({ data }) => { setProducts(data.products || []); setPages(data.pages || 1); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (p) => {
    setForm({
      ...EMPTY,
      ...p,
      images: p.images?.join(', ') || '',
      tags: p.tags?.join(', ') || '',
      ingredients: p.ingredients?.join(', ') || '',
    });
    setEditing(p._id);
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const splitList = (s) => (s || '').split(',').map(x => x.trim()).filter(Boolean);
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || 0,
      stock: Number(form.stock),
      images: splitList(form.images),
      tags: splitList(form.tags),
      ingredients: splitList(form.ingredients),
    };
    try {
      if (editing) { await api.put(`/products/${editing}`, payload); toast.success('Product updated'); }
      else { await api.post('/products', payload); toast.success('Product created'); }
      setModal(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-2">Catalog</p>
          <h1 className="font-display text-4xl text-burgundy-900">Products</h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-burgundy-700 text-cream-50 px-5 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:bg-burgundy-800 transition-colors">
          <PlusIcon className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-cream-50 border border-cream-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-cream-200">
              <tr>{['Image','Name','Category','Price','Stock','Featured','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-gold-600 uppercase tracking-widest">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-cream-100 transition-colors">
                  <td className="px-4 py-3"><img src={p.images?.[0] || FALLBACK} alt="" className="w-12 h-12 object-cover" onError={e => { e.target.src = FALLBACK; }} /></td>
                  <td className="px-4 py-3 font-medium text-burgundy-900 max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3 text-burgundy-900/60">{p.category}</td>
                  <td className="px-4 py-3 font-display text-lg text-burgundy-900">${p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wide font-semibold ${p.stock > 0 ? 'bg-gold-400/30 text-burgundy-800' : 'bg-burgundy-900 text-cream-50'}`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-burgundy-900/80">{p.featured ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-burgundy-700 hover:bg-cream-200 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-burgundy-600 hover:bg-burgundy-100 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-burgundy-900/40 font-display italic">No products yet.</td></tr>
              )}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-cream-200">
              {Array.from({length: pages}, (_,i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 text-sm font-medium ${page===p ? 'bg-burgundy-800 text-cream-50' : 'bg-cream-100 text-burgundy-900 hover:bg-cream-200'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-burgundy-900/70 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="bg-cream-50 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-3xl text-burgundy-900 mb-6">{editing ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Name</label>
                  <input value={form.name} onChange={set('name')} required className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Description</label>
                  <textarea value={form.description} onChange={set('description')} required rows={3} className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700 resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Price</label>
                  <input type="number" step="0.01" value={form.price} onChange={set('price')} required className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Original Price</label>
                  <input type="number" step="0.01" value={form.originalPrice} onChange={set('originalPrice')} className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Category</label>
                  <select value={form.category} onChange={set('category')} className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Brand</label>
                  <input value={form.brand} onChange={set('brand')} className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={set('stock')} required className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Volume / Size</label>
                  <input value={form.volume} onChange={set('volume')} placeholder="30ml, 3.5g..." className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Shade</label>
                  <input value={form.shade} onChange={set('shade')} placeholder="Ruby Noir, Rose Quartz..." className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Finish</label>
                  <select value={form.finish} onChange={set('finish')} className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700">
                    {FINISHES.map(c => <option key={c} value={c}>{c || '— None —'}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Ingredients (comma-separated)</label>
                  <textarea value={form.ingredients} onChange={set('ingredients')} rows={2} placeholder="Hyaluronic Acid, Vitamin E, Squalane" className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700 resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Images (comma-separated URLs)</label>
                  <input value={form.images} onChange={set('images')} className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-1">Tags (comma-separated)</label>
                  <input value={form.tags} onChange={set('tags')} className="w-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-burgundy-700" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="accent-burgundy-700" />
                <span className="text-sm font-medium text-burgundy-900">Featured product</span>
              </label>
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={saving} className="flex-1 bg-burgundy-700 text-cream-50 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:bg-burgundy-800 disabled:opacity-50 transition-colors">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setModal(false)} className="flex-1 border border-burgundy-900/30 text-burgundy-900 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:bg-cream-100 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
