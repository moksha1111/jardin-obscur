import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const FALLBACK =
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600";

export default function ProductCard({ product, badge }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success("Added to your bag");
    } catch {
      toast.error("Failed to add to bag");
    }
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative bg-cream-50 border border-cream-200 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative overflow-hidden bg-cream-100 aspect-[3/4]">
        <img
          src={product.images?.[0] || FALLBACK}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = FALLBACK;
          }}
        />
        {discount && (
          <span className="absolute top-3 left-3 bg-burgundy-700 text-cream-50 text-[10px] font-semibold uppercase tracking-widest px-2 py-1">
            -{discount}%
          </span>
        )}
        {badge && (
          <span className="absolute top-3 right-3 bg-gold-500 text-burgundy-900 text-[10px] font-semibold uppercase tracking-widest px-2 py-1">
            {badge}
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-burgundy-900/50 flex items-center justify-center">
            <span className="bg-cream-50 text-burgundy-800 px-3 py-1 text-xs uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-600 mb-2">
          {product.category}
          {product.volume ? ` · ${product.volume}` : ""}
        </p>
        <h3 className="font-display text-xl text-burgundy-900 leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        {(product.shade || product.finish) && (
          <p className="text-xs text-burgundy-700/70 italic mb-3">
            {product.shade}
            {product.shade && product.finish ? " · " : ""}
            {product.finish}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <span className="font-display text-xl font-medium text-burgundy-900">
              EGP {product.price?.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-burgundy-900/40 line-through ml-2">
                EGP {product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="w-full bg-burgundy-700 text-cream-50 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {product.stock === 0 ? "Out of Stock" : "Buy Now"}
      </button>
    </Link>
  );
}
