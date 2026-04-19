import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK = 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800';

function Badge({ children }) {
  return <span className="inline-block bg-cream-100 text-burgundy-800 px-3 py-1 text-[10px] uppercase tracking-[0.25em] border border-cream-200">{children}</span>;
}

function ShadePill({ shade }) {
  if (!shade) return null;
  // Map common shade-family keywords to a burgundy/cream/gold-friendly hex
  const lc = shade.toLowerCase();
  let bg = '#8b1e3f'; // default burgundy
  if (lc.includes('nude') || lc.includes('cocoa') || lc.includes('taupe') || lc.includes('fair') || lc.includes('porcelain')) bg = '#c7a98a';
  else if (lc.includes('rose') || lc.includes('dusty') || lc.includes('quartz')) bg = '#c76b7f';
  else if (lc.includes('gold') || lc.includes('antique') || lc.includes('translucent')) bg = '#c9a84c';
  else if (lc.includes('smoke') || lc.includes('onyx') || lc.includes('jet') || lc.includes('noir')) bg = '#2b1621';
  else if (lc.includes('berry') || lc.includes('plum')) bg = '#5b2034';
  else if (lc.includes('ruby') || lc.includes('crimson')) bg = '#8b1e3f';
  return (
    <div className="flex items-center gap-3 bg-cream-100 border border-cream-200 px-4 py-3">
      <span className="w-7 h-7 rounded-full border-2 border-cream-50 shadow-sm" style={{ background: bg }} />
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600 mb-0.5">Shade</p>
        <p className="font-display italic text-lg text-burgundy-900 leading-tight">{shade}</p>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(({ data }) => setProduct(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return <div className="text-center py-20 font-display italic text-2xl text-burgundy-900/60">Product not found.</div>;

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try { await addToCart(product._id, qty); toast.success('Added to your bag'); }
    catch { toast.error('Failed to add to bag'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReviewComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-xs uppercase tracking-[0.2em] text-burgundy-900/60 mb-8">
          <Link to="/" className="hover:text-burgundy-800">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-burgundy-800">Catalog</Link>
          <span className="mx-2">/</span>
          <span className="text-burgundy-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-16">
          {/* Images */}
          <div>
            <div className="bg-cream-100 aspect-square overflow-hidden mb-4">
              <img src={product.images?.[activeImg] || FALLBACK} alt={product.name} className="w-full h-full object-cover"
                onError={e => { e.target.src = FALLBACK; }} />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-burgundy-700' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-3">
              {product.category}{product.brand && ` · ${product.brand}`}
            </p>
            <h1 className="font-display text-4xl lg:text-5xl text-burgundy-900 leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex">
                {[1,2,3,4,5].map(s => <StarIcon key={s} className={`w-5 h-5 ${s <= Math.round(product.rating || 0) ? 'text-gold-500' : 'text-cream-300'}`} />)}
              </div>
              <span className="text-sm text-burgundy-900/60">{(product.rating || 0).toFixed(1)} ({product.numReviews || 0} reviews)</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.volume && <Badge>{product.volume}</Badge>}
              {product.finish && <Badge>{product.finish}</Badge>}
              {product.category && <Badge>{product.category}</Badge>}
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-4xl text-burgundy-900">${product.price?.toFixed(2)}</span>
              {product.originalPrice > product.price && <span className="text-xl text-burgundy-900/40 line-through">${product.originalPrice?.toFixed(2)}</span>}
            </div>

            <p className="text-burgundy-900/80 leading-relaxed mb-10 italic font-display text-lg">{product.description}</p>

            {/* Shade + Ingredients */}
            {(product.shade || product.ingredients?.length > 0) && (
              <div className="space-y-4 mb-10">
                {product.shade && <ShadePill shade={product.shade} />}

                {product.ingredients?.length > 0 && (
                  <div className="border border-cream-200 bg-cream-100">
                    <button
                      type="button"
                      onClick={() => setIngredientsOpen(!ingredientsOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="text-[11px] uppercase tracking-[0.3em] text-gold-600">Ingredients</span>
                      <span className="font-display italic text-burgundy-900 text-sm">
                        {ingredientsOpen ? 'Hide' : `${product.ingredients.length} key actives`}
                      </span>
                    </button>
                    {ingredientsOpen && (
                      <ul className="px-4 pb-4 space-y-1.5">
                        {product.ingredients.map((ing, i) => (
                          <li key={i} className="text-sm text-burgundy-900/80 flex items-start gap-2">
                            <span className="text-gold-600 mt-1">·</span>
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Qty + Add */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-burgundy-900/30">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3 hover:bg-cream-100 transition-colors"><MinusIcon className="w-4 h-4" /></button>
                <span className="px-5 py-3 font-medium text-burgundy-900">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))} className="p-3 hover:bg-cream-100 transition-colors"><PlusIcon className="w-4 h-4" /></button>
              </div>
              <span className="text-xs uppercase tracking-widest text-burgundy-900/60">{product.stock} in stock</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-3 bg-burgundy-700 text-cream-50 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {product.tags.map(t => <span key={t} className="text-[10px] uppercase tracking-[0.25em] text-burgundy-900/60 border-b border-burgundy-900/20 pb-0.5">{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-cream-200 pt-12">
          <h2 className="font-display text-3xl text-burgundy-900 mb-10">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              {product.reviews?.length === 0 ? (
                <p className="text-burgundy-900/50 italic font-display text-lg">No reviews yet. Be the first to share your impression.</p>
              ) : (
                <div className="space-y-6">
                  {product.reviews.map((r) => (
                    <div key={r._id} className="bg-cream-100 border border-cream-200 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display text-xl text-burgundy-900">{r.name}</span>
                        <div className="flex">{[1,2,3,4,5].map(s => <StarIcon key={s} className={`w-4 h-4 ${s <= r.rating ? 'text-gold-500' : 'text-cream-300'}`} />)}</div>
                      </div>
                      <p className="text-burgundy-900/80 italic">{r.comment}</p>
                      <p className="text-[10px] uppercase tracking-widest text-burgundy-900/40 mt-3">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <div>
                <h3 className="font-display text-2xl text-burgundy-900 mb-5">Write a Review</h3>
                <form onSubmit={handleReview} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewRating(s)}>
                          <StarIcon className={`w-8 h-8 transition-colors ${s <= reviewRating ? 'text-gold-500' : 'text-cream-300 hover:text-gold-400'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} required placeholder="Share your experience..." rows={4} className="w-full bg-cream-50 border border-cream-300 px-4 py-3 text-sm focus:outline-none focus:border-burgundy-700 resize-none" />
                  <button type="submit" disabled={submitting} className="bg-burgundy-700 text-cream-50 px-8 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:bg-burgundy-800 disabled:opacity-50 transition-colors">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
