import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import useInView from '../hooks/useInView';
import {
  CheckBadgeIcon,
  TruckIcon,
  GiftIcon,
  SparklesIcon,
  MinusIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const CATEGORIES = [
  { name: 'Lips', img: '/lipsticks/1.jpg', link: '/products?category=Lips' },
  { name: 'Eyes', img: '/eyes.jpg', link: '/products?category=Eyes' },
  { name: 'Face', img: '/face.jpg', link: '/products?category=Face' },
  { name: 'Skincare', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=85', link: '/products?category=Skincare' },
];

const STATS = [
  { year: '2007', label: 'A Beautiful Beginning' },
  { year: '2010', label: 'Craft Refined' },
  { year: '2018', label: 'Signature Collection' },
  { year: '2023', label: 'Future of Beauty' },
];

const FAQS = [
  {
    q: 'How long do your products last?',
    a: 'Once opened, most makeup products retain peak quality for 6-12 months, while unopened they can last up to 3 years. Skincare formulas are stamped with a period-after-opening symbol — typically 6M or 12M — to guide freshness.',
  },
  {
    q: 'Are your products clean and cruelty-free?',
    a: 'Every Nellure product is cruelty-free, vegan, and formulated without parabens, sulfates, or phthalates. We test on willing humans only — never animals — and publish a full ingredient list for every formula.',
  },
  {
    q: 'Do you offer samples or discovery sets?',
    a: 'Yes — our Discovery Edit lets you trial five miniature bestsellers across lips, eyes, and skin. It is the gentlest way to find your shade and finish before committing to a full size.',
  },
  {
    q: 'Are ingredients ethically and sustainably sourced?',
    a: 'We partner with family-run growers and certified ethical suppliers across France, Morocco, and Bulgaria. Our packaging is refillable where possible, and every box is recyclable or compostable.',
  },
];

const VALUE_PROPS = [
  { icon: CheckBadgeIcon, title: 'Eco-friendly', body: 'Crafted with care for sustainability' },
  { icon: TruckIcon, title: 'Fast Delivery', body: 'Your beauty, fast and safe delivery' },
  { icon: GiftIcon, title: 'Free Shipping', body: 'Free shipping on every order' },
  { icon: SparklesIcon, title: 'Special Discount', body: 'Special savings just for you' },
];

const GALLERY_ROWS = [
  [
    { type: 'img', src: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=600&q=80' },
    { type: 'quote', text: 'When beauty speaks louder than words.', label: 'OUR CATALOG' },
    { type: 'img', src: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80' },
  ],
  [
    { type: 'img', src: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80' },
    { type: 'img', src: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80' },
    { type: 'quote', text: 'Best Sellers', label: 'FAVOURITES' },
  ],
  [
    { type: 'quote', text: 'Beauty that fits like a second skin.', label: 'ESSENCE' },
    { type: 'img', src: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80' },
    { type: 'img', src: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80' },
  ],
];

const INSTA_IMAGES = [
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80',
  'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80',
  'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&q=80',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80',
];

let visitTracked = false;

function FilterSidebar() {
  const [price, setPrice] = useState(60);
  return (
    <aside className="space-y-8 text-burgundy-900">
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-3">Category</h4>
        <ul className="space-y-2 text-sm">
          {['All','Lips','Eyes','Face','Skincare','New Arrivals'].map(c => (
            <li key={c} className="flex items-center gap-2">
              <input type="checkbox" className="accent-burgundy-700" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-3">Price</h4>
        <input type="range" min="0" max="150" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full accent-burgundy-700" />
        <div className="flex justify-between text-xs text-burgundy-900/70 mt-1">
          <span>$0</span>
          <span>${price}</span>
          <span>$150+</span>
        </div>
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-3">Finish</h4>
        <ul className="space-y-2 text-sm">
          {['Matte','Satin','Glossy','Shimmer','Dewy','Cream'].map(c => (
            <li key={c} className="flex items-center gap-2">
              <input type="checkbox" className="accent-burgundy-700" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-3">Shade Family</h4>
        <ul className="space-y-2 text-sm">
          {['Nude','Rose','Red','Berry','Bronze','Gold','Noir'].map(c => (
            <li key={c} className="flex items-center gap-2">
              <input type="checkbox" className="accent-burgundy-700" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-3">Benefits</h4>
        <ul className="space-y-2 text-sm">
          {['Hydrating','Long-Wear','Brightening','Anti-Aging','Clean'].map(c => (
            <li key={c} className="flex items-center gap-2">
              <input type="checkbox" className="accent-burgundy-700" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-3">Size</h4>
        <ul className="space-y-2 text-sm">
          {['Mini','Standard','Full Size','Travel'].map(c => (
            <li key={c} className="flex items-center gap-2">
              <input type="checkbox" className="accent-burgundy-700" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function FaqItem({ q, a, open, onClick }) {
  return (
    <div className="border-b border-burgundy-900/20">
      <button onClick={onClick} className="w-full flex items-center justify-between py-5 text-left text-burgundy-900">
        <span className="font-display text-xl md:text-2xl pr-4">{q}</span>
        {open ? <MinusIcon className="w-5 h-5 flex-shrink-0" /> : <PlusIcon className="w-5 h-5 flex-shrink-0" />}
      </button>
      {open && <p className="pb-6 text-burgundy-900/75 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function HomePage() {
  const location = useLocation();
  const [featured, setFeatured] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  const [heroRef, heroVisible] = useInView();
  const [catRef, catVisible] = useInView();
  const [brandRef, brandVisible] = useInView();
  const [discountRef, discountVisible] = useInView();
  const [philRef, philVisible] = useInView();
  const [bestRef, bestVisible] = useInView();
  const [notesRef, notesVisible] = useInView();
  const [catalogRef, catalogVisible] = useInView();
  const [galRef, galVisible] = useInView();
  const [essRef, essVisible] = useInView();
  const [faqRef, faqVisible] = useInView();
  const [valueRef, valueVisible] = useInView();
  const [testRef, testVisible] = useInView();
  const [newsRef, newsVisible] = useInView();

  useEffect(() => {
    Promise.all([
      api.get('/products/featured').catch(() => ({ data: [] })),
      api.get('/products?limit=6').catch(() => ({ data: { products: [] } })),
    ]).then(([f, c]) => {
      setFeatured(f.data || []);
      setCatalog(c.data?.products || []);
    }).finally(() => setLoading(false));

    if (!visitTracked) {
      visitTracked = true;
      api.post('/visitors/track').catch(() => {});
    }

  }, []);

  useEffect(() => {
    const target = location.state?.scrollTo || (location.hash ? location.hash.slice(1) : null);
    if (target) {
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <div className="bg-cream-50">
      {/* 1. HERO */}
      <section
        className="relative text-cream-50 overflow-hidden h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-burgundy-900/50" />
        <div ref={heroRef} className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${heroVisible ? 'visible' : ''}`}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-gold-400 mb-8">Beauty with Soul</p>
            <h1 className="font-display text-7xl sm:text-8xl lg:text-9xl leading-[0.95] mb-8">
              Beauty That Tells <br/>
              <span className="italic text-gold-400">Your Story</span>
            </h1>
            <p className="text-cream-100/90 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              More than makeup — each product holds a mood, a ritual, a quiet confidence waiting to be drawn onto skin.
            </p>
            <Link
              to="/products"
              className="inline-block bg-gold-500 text-burgundy-900 px-12 py-5 text-sm uppercase tracking-[0.25em] font-semibold hover:bg-gold-400 transition-colors"
            >
              Find Your Match
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY GRID */}
      <section className="bg-cream-50 py-16">
        <div ref={catRef} className={`w-[90%] mx-auto fade-up ${catVisible ? 'visible' : ''}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={cat.link} className="group relative aspect-[4/5] overflow-hidden">
                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/85 via-burgundy-900/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-cream-50">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-gold-400 mb-2">Collection</p>
                  <h3 className="font-display text-4xl lg:text-5xl italic">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BRAND HISTORY */}
      <section id="brand-history" className="bg-cream-100 py-24 scroll-mt-28">
        <div ref={brandRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${brandVisible ? 'visible' : ''}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-4">Brand History</p>
              <h2 className="font-display text-5xl lg:text-6xl text-burgundy-900 leading-tight mb-8">
                Years of Craft, <br/> <span className="italic">Thousands</span>
              </h2>
              <div className="space-y-4 text-burgundy-900/80 leading-relaxed mb-10">
                <p>
                  From a small atelier in the south of France to a globally recognised maison, Nellure was born out of a reverence for the invisible — the shadow side of beauty, where ritual and confidence live quietly, close to the skin.
                </p>
                <p>
                  Each formula is the work of chemists, artists, and dermatologists who blend rare botanicals with skin-loving actives, building cosmetics that behave less like products and more like rituals — considered, sensorial, belonging only to the wearer.
                </p>
              </div>
              <Link to="/products" className="inline-block bg-burgundy-800 text-cream-100 px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-burgundy-700 transition-colors rounded-full">
                Begin Your Beauty Journey
              </Link>

              <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {STATS.map(s => (
                  <div key={s.year} className="border-l-2 border-gold-500 pl-4">
                    <p className="font-display text-3xl text-burgundy-800">{s.year}</p>
                    <p className="text-xs text-burgundy-900/70 mt-1 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=90"
                alt="Cosmetics composition"
                className="w-full h-[560px] object-cover rounded-tl-[2.5rem] rounded-br-[2.5rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE INVITATION */}
      <section className="relative bg-burgundy-800 text-cream-50 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-30 hidden lg:block">
          <img src="https://images.unsplash.com/photo-1598346762291-aee88549193f?w=900&q=85" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-burgundy-800"></div>
        </div>

        <div ref={discountRef} className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-up ${discountVisible ? 'visible' : ''}`}>
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-400 mb-4">An Invitation</p>
            <h2 className="font-display text-5xl lg:text-6xl leading-tight mb-6">
              Find Your <span className="italic text-gold-400">Signature</span>
            </h2>
            <p className="text-cream-100/80 text-base mb-10 leading-relaxed max-w-lg">
              Makeup isn't something you put on — it's something you become. Explore our curated collection and discover the shade, finish, and formula that tells your story.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-gold-500 text-burgundy-900 px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-gold-400 transition-colors">
                Explore the Collection
              </Link>
              <Link to="/" onClick={(e) => { e.preventDefault(); document.getElementById('brand-history')?.scrollIntoView({ behavior: 'smooth' }); }} className="border border-cream-100 text-cream-100 px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-cream-100 hover:text-burgundy-900 transition-colors">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PHILOSOPHY */}
      <section id="philosophy" className="bg-cream-50 py-24 scroll-mt-28">
        <div ref={philRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${philVisible ? 'visible' : ''}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="order-2 lg:order-1">
              <img src="https://images.unsplash.com/photo-1599842057874-37393e9342df?w=700&q=85" alt="Makeup brushes and cosmetics" className="w-full h-[500px] object-cover" />
            </div>

            <div className="text-center order-1 lg:order-2 py-10">
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-4">Our Philosophy</p>
              <h2 className="font-display text-4xl lg:text-5xl text-burgundy-900 leading-tight mb-6">
                Beauty With Meaning <br/> Begin <span className="italic">Your Ritual</span>
              </h2>
              <p className="text-burgundy-900/75 leading-relaxed mb-8 max-w-md mx-auto">
                We do not design cosmetics to be worn — we compose them to be lived. Every shade is a sentence, every finish a feeling, every product a quiet invitation.
              </p>
              <Link to="/philosophy" className="inline-block border border-burgundy-800 text-burgundy-800 px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-burgundy-800 hover:text-cream-50 transition-colors">
                Learn More
              </Link>
            </div>

            <div className="order-3">
              <img src="https://images.unsplash.com/photo-1599948128020-9a44505b0d1b?w=700&q=85" alt="Eyeshadow palette" className="w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="bg-cream-100 py-24">
        <div ref={bestRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${bestVisible ? 'visible' : ''}`}>
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-4">Best Sellers</p>
            <h2 className="font-display text-5xl lg:text-6xl text-burgundy-900 leading-tight mb-4">
              Our <span className="italic">Most-Loved</span> Products
            </h2>
            <p className="text-burgundy-900/70 max-w-2xl mx-auto">
              Click on the image to see product details and click Buy to add a product to cart.
            </p>
          </div>

          {loading ? <Spinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} badge={i === 1 ? 'Limited' : null} />
              ))}
              {/* Placeholders if no data */}
              {featured.length === 0 && Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-cream-50 border border-cream-200 aspect-[3/4] flex items-center justify-center text-burgundy-900/30 font-display italic text-xl">
                  Coming soon
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. CRAFTED WITH INTENTION */}
      <section className="bg-cream-50 py-24">
        <div ref={notesRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${notesVisible ? 'visible' : ''}`}>
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-4">Our Promise</p>
            <h2 className="font-display text-5xl lg:text-6xl text-burgundy-900 leading-tight mb-3">
              Crafted with <span className="italic">Intention</span>
            </h2>
            <p className="font-display italic text-2xl text-burgundy-900/70 mb-4">Made for Every Mood</p>
            <p className="text-burgundy-900/70 max-w-2xl mx-auto">
              Every formula begins with a question — what does your skin need, what does your mood ask for, what makes you feel most yourself?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            {/* Formula */}
            <div className="space-y-10 lg:text-right">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600 mb-2">Formula</p>
                <h3 className="font-display text-4xl italic text-burgundy-900 mb-2">Clean & Clinical</h3>
                <p className="text-sm text-burgundy-900/70 italic">Dermatologist-tested, never harsh</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600 mb-2">Formula</p>
                <h3 className="font-display text-4xl italic text-burgundy-900 mb-2">Skin-Loving</h3>
                <p className="text-sm text-burgundy-900/70 italic">Hydrating actives in every product</p>
              </div>
            </div>

            {/* Center image */}
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-gold-500/10 to-burgundy-900/5 blur-3xl -z-10"></div>
              <img src="https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=700&q=85" alt="Cosmetics composition" className="w-full h-[560px] object-cover mx-auto" />
            </div>

            {/* Finish */}
            <div className="space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600 mb-2">Finish</p>
                <h3 className="font-display text-4xl italic text-burgundy-900 mb-2">Velvet Matte</h3>
                <p className="text-sm text-burgundy-900/70 italic">Soft, never drying</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600 mb-2">Finish</p>
                <h3 className="font-display text-4xl italic text-burgundy-900 mb-2">Luminous Glow</h3>
                <p className="text-sm text-burgundy-900/70 italic">Lit from within, never glittery</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600 mb-2">For</p>
            <h3 className="font-display text-3xl italic text-burgundy-900">Every Shade</h3>
          </div>
        </div>
      </section>

      {/* 8. PRODUCTS CATALOG */}
      <section className="bg-cream-100 py-24">
        <div ref={catalogRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${catalogVisible ? 'visible' : ''}`}>
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-4">Our Products</p>
            <h2 className="font-display text-5xl lg:text-6xl text-burgundy-900 leading-tight mb-4">
              Our <span className="italic">Beauty</span> Catalog
            </h2>
            <p className="text-burgundy-900/70 max-w-2xl mx-auto">
              A curated edit of lips, eyes, face, and skincare — each formula clean, clinical, and designed to feel as good as it looks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterSidebar />
            </div>
            <div className="lg:col-span-3">
              {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catalog.slice(0, 6).map(p => <ProductCard key={p._id} product={p} />)}
                  {catalog.length === 0 && Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-cream-50 border border-cream-200 aspect-[3/4] flex items-center justify-center text-burgundy-900/30 font-display italic">
                      Coming soon
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center mt-10">
                <Link to="/products" className="inline-block border border-burgundy-800 text-burgundy-800 px-10 py-3 text-xs uppercase tracking-[0.25em] hover:bg-burgundy-800 hover:text-cream-50 transition-colors">
                  Show More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. IMAGE GALLERY */}
      <section className="bg-cream-50 py-10">
        <div ref={galRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${galVisible ? 'visible' : ''}`}>
          <div className="grid grid-cols-3 gap-2">
            {GALLERY_ROWS.flat().map((cell, i) => cell.type === 'img' ? (
              <div key={i} className="aspect-square overflow-hidden bg-cream-100">
                <img src={cell.src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ) : (
              <div key={i} className="aspect-square bg-burgundy-800 text-cream-50 flex flex-col items-center justify-center text-center p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400 mb-2">{cell.label}</p>
                <p className="font-display italic text-xl md:text-2xl leading-snug">{cell.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. DISCOVER ESSENCE */}
      <section className="relative bg-burgundy-900 text-cream-50 py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div ref={essRef} className={`relative max-w-4xl mx-auto px-4 text-center fade-up ${essVisible ? 'visible' : ''}`}>
          <h2 className="font-display text-5xl lg:text-7xl leading-tight mb-6">
            Discover <span className="italic text-gold-400">the Essence</span> <br/> that Defines You
          </h2>
          <p className="text-cream-100/80 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Your beauty is your silent signature — an invisible thread woven through every room you leave behind.
          </p>
          <Link to="/products" className="inline-block bg-gold-500 text-burgundy-900 px-10 py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-gold-400 transition-colors">
            Find Your Match
          </Link>
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq" className="bg-cream-50 py-24 scroll-mt-28">
        <div ref={faqRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${faqVisible ? 'visible' : ''}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-4">FAQ</p>
              <h2 className="font-display text-5xl lg:text-6xl text-burgundy-900 leading-tight mb-6">
                Beauty for <span className="italic">Every Moment</span> of Your Day
              </h2>
              <p className="text-burgundy-900/70 mb-10">
                Answers to the questions we hear most — honest, careful, and always from the heart of our atelier.
              </p>
              <img src="https://images.unsplash.com/photo-1617625802912-cde586faf331?w=800&q=85" alt="Cosmetics flatlay" className="w-full h-80 object-cover hidden lg:block" />
            </div>
            <div>
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} open={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. VALUE PROPS */}
      <section className="bg-cream-100 py-20">
        <div ref={valueRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${valueVisible ? 'visible' : ''}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-cream-50 border border-cream-200 p-8 text-center hover:border-gold-500 transition-colors">
                  <Icon className="w-10 h-10 text-gold-600 mx-auto mb-4" />
                  <h3 className="font-display text-xl text-burgundy-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-burgundy-900/70">{v.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13. TESTIMONIALS */}
      <section id="testimonials" className="bg-cream-50 py-24 scroll-mt-28">
        <div ref={testRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${testVisible ? 'visible' : ''}`}>
          <div className="text-center mb-14">
            <h2 className="font-display text-5xl lg:text-6xl text-burgundy-900 leading-tight mb-4">
              Why They <span className="italic">Fell in Love</span> at First Touch
            </h2>
            <p className="text-burgundy-900/70 max-w-2xl mx-auto">
              We are a customer-oriented company, and our values drive us to achieve more.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="bg-cream-100 border border-cream-200 p-10 relative">
              <svg className="w-12 h-12 text-gold-500 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.17 17c-.51 0-.98-.15-1.41-.46a3.4 3.4 0 01-1.08-1.22c-.25-.49-.38-1.05-.38-1.67 0-1.72.36-3.15 1.08-4.29.76-1.18 2.05-2.06 3.85-2.65l.9 1.31c-.88.23-1.66.6-2.34 1.1-.63.49-1.06 1.07-1.29 1.75.13-.06.28-.1.44-.13.19-.04.35-.06.5-.06.91 0 1.65.27 2.23.82.61.54.92 1.26.92 2.17 0 .84-.28 1.55-.84 2.13-.55.54-1.28.8-2.18.8-.43 0-.82-.08-1.17-.24l-.23-.36zm9.26 0c-.51 0-.98-.15-1.4-.46a3.4 3.4 0 01-1.09-1.22c-.25-.49-.37-1.05-.37-1.67 0-1.72.36-3.15 1.08-4.29.75-1.18 2.04-2.06 3.85-2.65l.9 1.31c-.88.23-1.66.6-2.34 1.1-.63.49-1.06 1.07-1.29 1.75.13-.06.28-.1.44-.13.19-.04.35-.06.5-.06.91 0 1.64.27 2.22.82.62.54.93 1.26.93 2.17 0 .84-.28 1.55-.85 2.13-.55.54-1.27.8-2.17.8-.44 0-.83-.08-1.18-.24l-.23-.36z"/></svg>
              <p className="font-display italic text-2xl text-burgundy-900 leading-relaxed mb-8">
                "The moment I swept it on, I understood — this wasn't just makeup, it was a ritual. The skincare left my skin feeling alive for days. My sister thought I'd had a facial; I'd only used the night cream. I'll never go back."
              </p>
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" alt="Sam Smith" className="w-14 h-14 object-cover rounded-full border-2 border-gold-500" />
                <div>
                  <p className="font-display text-xl text-burgundy-900">Sam Smith</p>
                  <p className="text-xs uppercase tracking-widest text-gold-600">Beauty Editor</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-8">
                <button className="w-10 h-10 border border-burgundy-900/30 flex items-center justify-center hover:bg-burgundy-800 hover:text-cream-50 hover:border-burgundy-800 transition-colors">
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 border border-burgundy-900/30 flex items-center justify-center hover:bg-burgundy-800 hover:text-cream-50 hover:border-burgundy-800 transition-colors">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <img src="https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800&q=85" alt="Makeup palette" className="w-full h-[560px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 14. INSTAGRAM GALLERY */}
      <section className="bg-cream-50 pt-6 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {INSTA_IMAGES.map((src, i) => (
              <a key={i} href="#" className="aspect-square overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 15. NEWSLETTER */}
      <section className="bg-burgundy-800 text-cream-50 py-20">
        <div ref={newsRef} className={`max-w-3xl mx-auto px-4 text-center fade-up ${newsVisible ? 'visible' : ''}`}>
          <h2 className="font-display text-5xl lg:text-6xl leading-tight mb-4">
            Subscribe to Our <span className="italic text-gold-400">Newsletter</span>
          </h2>
          <p className="text-cream-100/75 mb-8">
            Be first to hear about new launches, seasonal editions, and stories from our atelier.
          </p>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 bg-cream-50/10 border border-cream-100/30 text-cream-50 placeholder-cream-100/50 px-5 py-4 text-sm focus:outline-none focus:border-gold-400" />
            <button type="submit" className="bg-burgundy-700 hover:bg-burgundy-600 text-cream-50 px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
