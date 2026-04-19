import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <footer className="bg-burgundy-900 text-cream-100 mt-auto">
      {/* Promo bar */}
      <div className="bg-burgundy-800 border-b border-burgundy-700/60 text-center py-4 px-6">
        <p className="font-display italic text-cream-100 text-base md:text-lg max-w-4xl mx-auto">
          Celebrate the beauty of the season with <span className="text-gold-400 not-italic font-semibold">15% off</span> your order — Just use code <span className="text-gold-400 not-italic font-semibold">WINTER15</span> at checkout and let your signature look tell a story of winter elegance.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display italic text-3xl text-cream-50 mb-4">Nellure</h3>
            <p className="text-sm leading-relaxed text-cream-200/80 italic">
              Beauty that tells your story — every product a ritual, every shade a moment that lingers long after the day begins and ends.
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">Info</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" onClick={(e) => scrollToSection(e, 'brand-history')} className="hover:text-gold-400 transition-colors">About us</Link></li>
              <li><Link to="/" onClick={(e) => scrollToSection(e, 'philosophy')} className="hover:text-gold-400 transition-colors">Our Philosophy</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-gold-400 transition-colors">New Arrivals</Link></li>
              <li><Link to="/" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-gold-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products?featured=true" className="hover:text-gold-400 transition-colors">Best Sellers</Link></li>
              <li><Link to="/products" className="hover:text-gold-400 transition-colors">Catalog</Link></li>
              <li><Link to="/products?category=Skincare" className="hover:text-gold-400 transition-colors">Skincare Rituals</Link></li>
              <li><Link to="/cart" className="hover:text-gold-400 transition-colors">Your Bag</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-cream-200/80">
              <li>Head Office in London<br/>36 Regent</li>
              <li><a href="tel:+12345678900" className="hover:text-gold-400 transition-colors">+1 (234) 567 89 00</a></li>
              <li><a href="mailto:jardinobscur@email.com" className="hover:text-gold-400 transition-colors">jardinobscur@email.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-burgundy-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-200/60">
            © {new Date().getFullYear()} Nellure. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-cream-100">
            <a href="#" aria-label="Instagram" className="hover:text-gold-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.4.3 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.4.2-1 .3-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.5s.9-.8 1.5-1c.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.2-2.1a1.17 1.17 0 110 2.34 1.17 1.17 0 010-2.34z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-gold-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 011.141.195v3.325a8.623 8.623 0 00-.653-.036 26.805 26.805 0 00-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 00-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z"/></svg>
            </a>
            <a href="#" aria-label="Pinterest" className="hover:text-gold-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.853c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
