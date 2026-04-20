import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const FALLBACK =
  "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=200";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, itemCount } = useCart();

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="bg-cream-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-5xl text-burgundy-900 mb-4">
            Your Bag <span className="italic">is Empty</span>
          </h1>
          <p className="text-burgundy-900/60 mb-10 font-display italic text-xl">
            No products have been chosen yet.
          </p>
          <Link
            to="/products"
            className="inline-block bg-burgundy-700 text-cream-50 px-10 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-burgundy-800 transition-colors"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-5xl text-burgundy-900 mb-2">
          Your <span className="italic">Bag</span>
        </h1>
        <p className="text-sm text-burgundy-900/60 mb-10">
          {itemCount} {itemCount === 1 ? "item" : "items"} ready for you
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product}
                className="bg-cream-100 border border-cream-200 p-5 flex gap-5 items-start"
              >
                <img
                  src={item.image || FALLBACK}
                  alt={item.name}
                  className="w-24 h-24 object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = FALLBACK;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl text-burgundy-900 leading-tight mb-1">
                    {item.name}
                  </h3>
                  <p className="font-display text-lg text-burgundy-800">
                    ${item.price?.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-burgundy-900/30">
                      <button
                        onClick={() =>
                          item.qty > 1
                            ? addToCart(item.product, item.qty - 1)
                            : removeFromCart(item.product)
                        }
                        className="p-2 hover:bg-cream-200 transition-colors"
                      >
                        <MinusIcon className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm font-medium text-burgundy-900">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => addToCart(item.product, item.qty + 1)}
                        className="p-2 hover:bg-cream-200 transition-colors"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-burgundy-600 hover:text-burgundy-800 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl text-burgundy-900">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-cream-100 border border-cream-200 p-7 h-fit sticky top-32">
            <h2 className="font-display text-2xl text-burgundy-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-burgundy-900/80">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-burgundy-900/80">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-gold-600 font-medium">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-burgundy-900/80">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-burgundy-900/20 pt-3 flex justify-between font-display text-2xl text-burgundy-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal < 50 && (
              <p className="text-xs text-burgundy-800 bg-cream-200 p-3 mb-4 italic">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping.
              </p>
            )}
            <Link
              to="/checkout"
              className="block w-full text-center bg-burgundy-700 text-cream-50 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-burgundy-800 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="block w-full text-center mt-3 text-sm text-burgundy-900/60 hover:text-burgundy-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
