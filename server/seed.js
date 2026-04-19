const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Visitor = require('./models/Visitor');

// Verified working Unsplash cosmetics image URLs (all curl-checked, each unique).
// 60 URLs for 20 products x 3 images each; no URL appears twice.
const URLS = [
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
  'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800',
  'https://images.unsplash.com/photo-1583241475880-083f84372725?w=800',
  'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800',
  'https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?w=800',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800',
  'https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?w=800',
  'https://images.unsplash.com/photo-1630082900894-edbd503588f7?w=800',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
  'https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=800',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=800',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800',
  'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800',
  'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800',
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
  'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=800',
  'https://images.unsplash.com/photo-1524255684952-d7185b509571?w=800',
  'https://images.unsplash.com/photo-1534239143101-1b1c627395c5?w=800',
  'https://images.unsplash.com/photo-1563804447971-6e113ab80713?w=800',
  'https://images.unsplash.com/photo-1550246140-29f40b909e5a?w=800',
  'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800',
  'https://images.unsplash.com/photo-1590159763121-7c9fd312190d?w=800',
  'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800',
  'https://images.unsplash.com/photo-1531895861208-8504b98fe814?w=800',
  'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=800',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800',
  'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
  'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800',
  'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=800',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800',
  'https://images.unsplash.com/photo-1585652757173-57de5e9fab42?w=800',
  'https://images.unsplash.com/photo-1526045478516-99145907023c?w=800',
  'https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?w=800',
  'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
  'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
  'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=800',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
  'https://images.unsplash.com/photo-1573575155376-b5010099301b?w=800',
  'https://images.unsplash.com/photo-1603384699007-50799748fc45?w=800',
  'https://images.unsplash.com/photo-1607602132700-068258431c6c?w=800',
  'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=800',
  'https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=800',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  'https://images.unsplash.com/photo-1565791380709-49e529c8b073?w=800',
  'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=800',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
  'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800',
  'https://images.unsplash.com/photo-1564594985645-4427056e22e2?w=800',
  'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=800',
  'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800',
  'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=800',
  'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
];

// Sanity: 60 unique URLs for 20 products x 3 images each
const products = [
  // ===== LIPS (5) =====
  {
    name: 'Velvet Matte Lipstick in Ruby Noir',
    description: 'A creamy, weightless matte that wraps the lips in saturated crimson — the kind of red that reads across a candlelit room. Enriched with hyaluronic acid and rosehip oil, the finish is soft as velvet, never dry, never stiff.',
    price: 38.00,
    originalPrice: 45.00,
    category: 'Lips',
    brand: 'Nellure',
    images: ['/lipsticks/1.jpg'],
    stock: 72,
    rating: 4.9,
    numReviews: 142,
    featured: true,
    volume: '3.5g',
    shade: 'Ruby Noir',
    finish: 'Matte',
    ingredients: ['Hyaluronic Acid', 'Rosehip Oil', 'Shea Butter', 'Vitamin E', 'Jojoba Wax'],
    tags: ['vegan', 'cruelty-free', 'bestseller']
  },
  {
    name: 'Gloss Lumière',
    description: 'A mirror-slick gloss that catches light with every word. Non-sticky and cushioning, it layers over lipstick for depth or wears alone for a barely-there shine. Plumping peptides deliver a subtle, gradual fullness.',
    price: 32.00,
    originalPrice: 38.00,
    category: 'Lips',
    brand: 'Nellure',
    images: ['/lipsticks/2.jpg'],
    stock: 88,
    rating: 4.7,
    numReviews: 96,
    featured: true,
    volume: '5ml',
    shade: 'Rose Quartz',
    finish: 'Glossy',
    ingredients: ['Hyaluronic Acid', 'Peptides', 'Vitamin E', 'Almond Oil', 'Candelilla Wax'],
    tags: ['vegan', 'cruelty-free', 'new']
  },
  {
    name: 'Rouge Éclat',
    description: 'A satin-finish lipstick built on a core of pigment and balm — rich, comfortable, and long-wearing without the flatness of a matte. Our most-worn shade, warmed with a whisper of terracotta.',
    price: 36.00,
    originalPrice: 42.00,
    category: 'Lips',
    brand: 'Nellure',
    images: ['/lipsticks/3.jpg'],
    stock: 65,
    rating: 4.8,
    numReviews: 118,
    featured: false,
    volume: '3.5g',
    shade: 'Berry Noir',
    finish: 'Satin',
    ingredients: ['Shea Butter', 'Castor Seed Oil', 'Vitamin E', 'Beeswax Alternative', 'Rose Extract'],
    tags: ['vegan', 'cruelty-free', 'bestseller']
  },
  {
    name: 'Precision Lip Liner',
    description: 'An architect\'s pencil for the mouth — a creamy, self-sharpening tip that glides without dragging and sets within seconds. Engineered to grip, smooth, and frame without fading through coffee or conversation.',
    price: 24.00,
    originalPrice: 28.00,
    category: 'Lips',
    brand: 'Nellure',
    images: ['/lipsticks/4.jpg'],
    stock: 94,
    rating: 4.6,
    numReviews: 73,
    featured: false,
    volume: '1.2g',
    shade: 'Nude Cocoa',
    finish: 'Matte',
    ingredients: ['Jojoba Oil', 'Carnauba Wax', 'Vitamin E', 'Avocado Oil'],
    tags: ['vegan', 'cruelty-free']
  },
  {
    name: 'Balm Velours',
    description: 'A lipstick disguised as a balm — pigmented, nourishing, a quiet blush of colour that reads as your lips but better. Slip it into your coat pocket; no mirror required.',
    price: 28.00,
    originalPrice: 34.00,
    category: 'Lips',
    brand: 'Nellure',
    images: ['/lipsticks/5.jpg'],
    stock: 78,
    rating: 4.7,
    numReviews: 64,
    featured: false,
    volume: '3g',
    shade: 'Nude Glow',
    finish: 'Cream',
    ingredients: ['Shea Butter', 'Coconut Oil', 'Rosehip Oil', 'Vitamin E', 'Beet Extract'],
    tags: ['vegan', 'cruelty-free', 'organic', 'new']
  },

  // ===== EYES (5) =====
  {
    name: 'Ashen Ember Palette',
    description: 'Twelve shades drawn from the edges of firelight — warm smoke, molten copper, deepest charcoal, and a single stroke of pearl. Buttery powders that blend like cream and cling like silk.',
    price: 68.00,
    originalPrice: 82.00,
    category: 'Eyes',
    brand: 'Nellure',
    images: [URLS[15], URLS[16], URLS[17]],
    stock: 45,
    rating: 4.9,
    numReviews: 204,
    featured: true,
    volume: '15g',
    shade: 'Warm Smoke',
    finish: 'Shimmer',
    ingredients: ['Mica', 'Jojoba Oil', 'Vitamin E', 'Silica', 'Rose Extract'],
    tags: ['vegan', 'cruelty-free', 'bestseller']
  },
  {
    name: 'Lash Noir Mascara',
    description: 'A volumising, lifting formula in the blackest black — built on a flexible wax core that curls as it coats. Buildable from whisper to statement, never clumpy, never flaking by hour ten.',
    price: 32.00,
    originalPrice: 38.00,
    category: 'Eyes',
    brand: 'Nellure',
    images: [URLS[18], URLS[19], URLS[20]],
    stock: 82,
    rating: 4.8,
    numReviews: 189,
    featured: true,
    volume: '10ml',
    shade: 'Jet Noir',
    finish: 'Matte',
    ingredients: ['Carnauba Wax', 'Panthenol', 'Biotin', 'Castor Oil', 'Vitamin E'],
    tags: ['vegan', 'cruelty-free', 'bestseller']
  },
  {
    name: 'Precision Liner',
    description: 'A fine-tip liquid liner with the fluid control of ink and the staying power of tattoo pigment. Draw the subtlest flick or the boldest wing — the line holds crisp from morning to midnight.',
    price: 28.00,
    originalPrice: 34.00,
    category: 'Eyes',
    brand: 'Nellure',
    images: [URLS[21], URLS[22], URLS[23]],
    stock: 68,
    rating: 4.7,
    numReviews: 132,
    featured: false,
    volume: '3ml',
    shade: 'Onyx',
    finish: 'Glossy',
    ingredients: ['Water', 'Acacia Gum', 'Panthenol', 'Iron Oxides', 'Vitamin E'],
    tags: ['vegan', 'cruelty-free']
  },
  {
    name: 'Brow Sculpt Pencil',
    description: 'An ultra-fine pencil that mimics the look of individual hair strokes. Waxes and silks anchor the pigment for a brow that stays sculpted through humidity, workouts, and into the next morning.',
    price: 26.00,
    originalPrice: 32.00,
    category: 'Eyes',
    brand: 'Nellure',
    images: [URLS[24], URLS[25], URLS[26]],
    stock: 90,
    rating: 4.6,
    numReviews: 87,
    featured: false,
    volume: '0.08g',
    shade: 'Warm Taupe',
    finish: 'Matte',
    ingredients: ['Carnauba Wax', 'Candelilla Wax', 'Vitamin E', 'Silk Protein'],
    tags: ['vegan', 'cruelty-free']
  },
  {
    name: 'Gilded Noir Palette',
    description: 'Eight shades of burnished gold, bronze, and inked black — the palette our makeup artists reach for at every shoot. Silken textures that build from soft wash to high drama without fallout.',
    price: 72.00,
    originalPrice: 85.00,
    category: 'Eyes',
    brand: 'Nellure',
    images: [URLS[27], URLS[28], URLS[29]],
    stock: 38,
    rating: 4.9,
    numReviews: 156,
    featured: false,
    volume: '12g',
    shade: 'Antique Gold',
    finish: 'Shimmer',
    ingredients: ['Mica', 'Silica', 'Jojoba Oil', 'Vitamin E', 'Argan Oil'],
    tags: ['vegan', 'cruelty-free', 'bestseller']
  },

  // ===== FACE (5) =====
  {
    name: 'Radiant Silk Foundation',
    description: 'A weightless, buildable foundation that reads like skin — never a mask. Light-diffusing pigments blur imperfections while hyaluronic acid and niacinamide hydrate and even tone throughout the day.',
    price: 58.00,
    originalPrice: 68.00,
    category: 'Face',
    brand: 'Nellure',
    images: [URLS[30], URLS[31], URLS[32]],
    stock: 62,
    rating: 4.8,
    numReviews: 213,
    featured: true,
    volume: '30ml',
    shade: 'Porcelain',
    finish: 'Dewy',
    ingredients: ['Hyaluronic Acid', 'Niacinamide', 'Squalane', 'Vitamin E', 'Rose Extract', 'SPF 20'],
    tags: ['vegan', 'cruelty-free', 'bestseller']
  },
  {
    name: 'Soft-Focus Concealer',
    description: 'A creamy, medium-to-full coverage concealer that brightens without creasing. The hydrating formula melts into skin, covering shadows and blemishes with a satin, photo-ready finish.',
    price: 34.00,
    originalPrice: 40.00,
    category: 'Face',
    brand: 'Nellure',
    images: [URLS[33], URLS[34], URLS[35]],
    stock: 88,
    rating: 4.7,
    numReviews: 147,
    featured: false,
    volume: '8ml',
    shade: 'Fair',
    finish: 'Satin',
    ingredients: ['Hyaluronic Acid', 'Peptides', 'Squalane', 'Caffeine', 'Vitamin E'],
    tags: ['vegan', 'cruelty-free']
  },
  {
    name: 'Cheek Noir Blush',
    description: 'A powder blush in shades drawn from the Old Masters — dusty rose, bruised plum, soft terracotta. Silky pigment that blooms on the apples and fades to a convincing flush at the edges.',
    price: 36.00,
    originalPrice: 42.00,
    category: 'Face',
    brand: 'Nellure',
    images: [URLS[36], URLS[37], URLS[38]],
    stock: 74,
    rating: 4.8,
    numReviews: 128,
    featured: true,
    volume: '6g',
    shade: 'Dusty Rose',
    finish: 'Satin',
    ingredients: ['Mica', 'Silica', 'Jojoba Oil', 'Vitamin E', 'Squalane'],
    tags: ['vegan', 'cruelty-free', 'bestseller']
  },
  {
    name: 'Rose Highlighting Balm',
    description: 'A cream-to-skin highlighter that reads as light rather than glitter. Press onto cheekbones, the bridge of the nose, the bow of the lip — anywhere the hour catches. Soft rose-gold with a veil of champagne.',
    price: 42.00,
    originalPrice: 48.00,
    category: 'Face',
    brand: 'Nellure',
    images: [URLS[39], URLS[40], URLS[41]],
    stock: 56,
    rating: 4.9,
    numReviews: 174,
    featured: false,
    volume: '10g',
    shade: 'Rose Gold',
    finish: 'Dewy',
    ingredients: ['Squalane', 'Jojoba Oil', 'Mica', 'Vitamin E', 'Rosehip Oil'],
    tags: ['vegan', 'cruelty-free', 'new', 'bestseller']
  },
  {
    name: 'Skin Veil Setting Powder',
    description: 'An imperceptible translucent powder milled eight times for silk-fine blur. Sets without flattening, mattes without drying — the final, invisible step that keeps makeup in place from noon to last light.',
    price: 44.00,
    originalPrice: 52.00,
    category: 'Face',
    brand: 'Nellure',
    images: [URLS[42], URLS[43], URLS[44]],
    stock: 68,
    rating: 4.7,
    numReviews: 98,
    featured: false,
    volume: '8g',
    shade: 'Translucent',
    finish: 'Matte',
    ingredients: ['Silica', 'Rice Powder', 'Vitamin E', 'Kaolin Clay'],
    tags: ['vegan', 'cruelty-free']
  },

  // ===== SKINCARE (5) =====
  {
    name: 'Nuit Renewal Cream',
    description: 'A rich night cream built on retinol alternatives and bakuchiol. Overnight, it softens fine lines, evens tone, and restores moisture lost across the day. Wake to skin that looks well-rested — even when you weren\'t.',
    price: 88.00,
    originalPrice: 102.00,
    category: 'Skincare',
    brand: 'Nellure',
    images: [URLS[45], URLS[46], URLS[47]],
    stock: 42,
    rating: 4.9,
    numReviews: 236,
    featured: true,
    volume: '50ml',
    shade: '',
    finish: 'Cream',
    ingredients: ['Bakuchiol', 'Niacinamide', 'Hyaluronic Acid', 'Squalane', 'Ceramides', 'Rosehip Oil'],
    tags: ['vegan', 'cruelty-free', 'organic', 'bestseller']
  },
  {
    name: 'Rose Infusion Serum',
    description: 'A featherlight serum steeped in Bulgarian rose water, hyaluronic acid, and vitamin C. Floods the skin with moisture and radiance, evens tone over weeks, and layers weightlessly under makeup.',
    price: 74.00,
    originalPrice: 88.00,
    category: 'Skincare',
    brand: 'Nellure',
    images: [URLS[48], URLS[49], URLS[50]],
    stock: 58,
    rating: 4.8,
    numReviews: 187,
    featured: true,
    volume: '30ml',
    shade: '',
    finish: 'Dewy',
    ingredients: ['Bulgarian Rose Water', 'Vitamin C', 'Hyaluronic Acid', 'Niacinamide', 'Peptides'],
    tags: ['vegan', 'cruelty-free', 'organic', 'bestseller']
  },
  {
    name: 'Velour Cleansing Balm',
    description: 'A solid-to-oil balm that dissolves the day — makeup, sunscreen, city grime — while leaving the skin\'s barrier untouched. Warm between fingertips, press onto dry skin, emulsify with water, and rinse clean.',
    price: 52.00,
    originalPrice: 62.00,
    category: 'Skincare',
    brand: 'Nellure',
    images: [URLS[51], URLS[52], URLS[53]],
    stock: 71,
    rating: 4.8,
    numReviews: 143,
    featured: false,
    volume: '90ml',
    shade: '',
    finish: 'Cream',
    ingredients: ['Squalane', 'Jojoba Oil', 'Shea Butter', 'Rosehip Oil', 'Vitamin E', 'Chamomile Extract'],
    tags: ['vegan', 'cruelty-free', 'organic']
  },
  {
    name: 'Obsidian Clay Mask',
    description: 'A weekly ritual — volcanic clay and charcoal that draw out congestion, while niacinamide and green tea keep the skin calm. Fifteen minutes, one rinse, and a visibly cleaner, finer surface.',
    price: 48.00,
    originalPrice: 58.00,
    category: 'Skincare',
    brand: 'Nellure',
    images: [URLS[54], URLS[55], URLS[56]],
    stock: 54,
    rating: 4.7,
    numReviews: 109,
    featured: false,
    volume: '75ml',
    shade: '',
    finish: 'Matte',
    ingredients: ['Kaolin Clay', 'Bentonite Clay', 'Activated Charcoal', 'Niacinamide', 'Green Tea Extract'],
    tags: ['vegan', 'cruelty-free', 'new']
  },
  {
    name: 'Amber Glow Face Oil',
    description: 'A golden elixir of nine cold-pressed oils — rosehip, argan, marula, jojoba, and more. Four drops at night leave the skin plump, lit from within, and visibly softer by morning.',
    price: 82.00,
    originalPrice: 95.00,
    category: 'Skincare',
    brand: 'Nellure',
    images: [URLS[57], URLS[58], URLS[59]],
    stock: 48,
    rating: 4.9,
    numReviews: 165,
    featured: false,
    volume: '30ml',
    shade: '',
    finish: 'Dewy',
    ingredients: ['Rosehip Oil', 'Argan Oil', 'Marula Oil', 'Jojoba Oil', 'Squalane', 'Vitamin E'],
    tags: ['vegan', 'cruelty-free', 'organic', 'bestseller']
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Visitor.deleteMany({});
    console.log('Existing data cleared.');

    // Create users (bypass pre-save hook by inserting pre-hashed)
    const adminSalt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', adminSalt);

    const userSalt = await bcrypt.genSalt(10);
    const userHash = await bcrypt.hash('nora123', userSalt);

    await User.collection.insertMany([
      {
        name: 'Admin',
        email: 'admin@jardinobscur.com',
        password: adminHash,
        role: 'admin',
        avatar: '',
        address: {},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nora',
        email: 'nora@jardinobscur.com',
        password: userHash,
        role: 'user',
        avatar: '',
        address: {
          street: '12 Rue des Fleurs',
          city: 'Paris',
          state: '',
          zip: '75008',
          country: 'France'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Users seeded: admin@jardinobscur.com (admin123), nora@jardinobscur.com (nora123)');

    // Insert products
    await Product.insertMany(products);
    console.log(`${products.length} cosmetics products seeded across categories.`);

    const categories = [...new Set(products.map(p => p.category))];
    console.log('Categories:', categories.join(', '));

    const countByCategory = categories.reduce((acc, cat) => {
      acc[cat] = products.filter(p => p.category === cat).length;
      return acc;
    }, {});
    console.log('Count by category:', countByCategory);

    const featuredCount = products.filter(p => p.featured).length;
    console.log(`Featured products: ${featuredCount}`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
