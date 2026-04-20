import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { to: "/", hash: "brand-history", label: "About us" },
  { to: "/", hash: "philosophy", label: "Our Philosophy" },
  { to: "/", hash: "our-promise", label: "Our Promise" },
  { to: "/", hash: "gallery", label: "Gallery" },
  { to: "/products?featured=true", label: "Best Sellers" },
  { to: "/products?sort=newest", label: "New Arrivals" },
  { to: "/products", label: "Cosmetics" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
    setDropOpen(false);
  };

  const handleNavClick = (e, link) => {
    if (!link.hash) return;
    e.preventDefault();
    setOpen(false);
    if (location.pathname === link.to) {
      document
        .getElementById(link.hash)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(link.to, { state: { scrollTo: link.hash } });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream-50 border-b border-cream-200">
      {/* Main nav */}
      <div className="bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-20">
            {/* Left: social */}
            <div className="flex items-center gap-4 text-burgundy-800">
              <a
                href="https://www.instagram.com/nellurecosmetics/"
                aria-label="Instagram"
                className="hover:text-burgundy-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.4.3 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.4.2-1 .3-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.5s.9-.8 1.5-1c.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8s-.6.8-.8 1.3c-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.5-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3s.8.6 1.3.8c.4.2 1 .3 2.1.4 1.2.1 1.5.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8s.6-.8.8-1.3c.2-.4.3-1 .4-2.1.1-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3s-.8-.6-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.55-.1-4.7-.1zm0 3.1a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.2-2.1a1.17 1.17 0 110 2.34 1.17 1.17 0 010-2.34z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61575741796152"
                aria-label="Facebook"
                className="hover:text-burgundy-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 011.141.195v3.325a8.623 8.623 0 00-.653-.036 26.805 26.805 0 00-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 00-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z" />
                </svg>
              </a>
            </div>

            {/* Center: logo */}
            <Link
              to="/"
              className="font-display italic text-5xl md:text-6xl text-burgundy-800 text-center tracking-wide"
            >
              Nellure
            </Link>

            {/* Right: user + cart */}
            <div className="hidden md:flex items-center justify-end gap-3 text-burgundy-800">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 p-2 hover:text-burgundy-600 transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden sm:block text-sm">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>
                  {dropOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-cream-50 rounded-lg shadow-xl border border-cream-200 py-2 z-50"
                      onMouseLeave={() => setDropOpen(false)}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-burgundy-800 hover:bg-cream-100"
                        onClick={() => setDropOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-burgundy-800 hover:bg-cream-100"
                        onClick={() => setDropOpen(false)}
                      >
                        My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm font-semibold text-gold-600 hover:bg-cream-100"
                          onClick={() => setDropOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-cream-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-burgundy-600 hover:bg-cream-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 hover:text-burgundy-600 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}
              <Link
                to="/cart"
                className="relative p-2 hover:text-burgundy-600 transition-colors"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burgundy-700 text-cream-50 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="md:hidden flex justify-end">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 text-burgundy-800"
              >
                {open ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary nav — centered links */}
        <div className="hidden md:block border-t border-burgundy-900/10 bg-cream-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-12">
            <nav className="flex items-center gap-7 text-sm text-burgundy-800">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={(e) => handleNavClick(e, l)}
                  className="hover:text-burgundy-600 tracking-wide transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 px-4 py-4 space-y-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={(e) => {
                if (l.hash) handleNavClick(e, l);
                else setOpen(false);
              }}
              className="block py-2 text-burgundy-800 hover:text-burgundy-600 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <hr className="border-cream-200" />
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block py-2 text-burgundy-800"
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="block py-2 text-burgundy-800"
              >
                My Orders
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-gold-600 font-semibold"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block py-2 text-burgundy-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block py-2 text-burgundy-800"
            >
              Sign In
            </Link>
          )}
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="block py-2 text-burgundy-800"
          >
            Cart ({itemCount})
          </Link>
        </div>
      )}
    </header>
  );
}
