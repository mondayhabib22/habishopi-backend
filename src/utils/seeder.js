/**
 * HabiShop Database Seeder
 * Uses Product.create() for each product so the pre-save hook
 * always runs and generates unique slugs correctly.
 *
 * Run: cd backend && npm run seed
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../../.env') });

const User     = require('../models/User');
const Category = require('../models/Category');
const Product  = require('../models/Product');
const Coupon   = require('../models/Coupon');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/habishop';

/* ── Categories ──────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Electronics',     slug: 'electronics',    icon: '💻', description: 'Gadgets, phones, computers and more',    order: 1 },
  { name: 'Fashion',         slug: 'fashion',         icon: '👗', description: 'Clothing, shoes, and accessories',       order: 2 },
  { name: 'Home & Living',   slug: 'home-living',     icon: '🏠', description: 'Furniture, decor, and kitchen',          order: 3 },
  { name: 'Beauty & Health', slug: 'beauty-health',   icon: '💄', description: 'Skincare, makeup, and wellness',         order: 4 },
  { name: 'Sports & Fitness',slug: 'sports-fitness',  icon: '⚽', description: 'Equipment, apparel, and supplements',   order: 5 },
  { name: 'Books & Education',slug:'books-education', icon: '📚', description: 'Books, courses, and stationery',         order: 6 },
  { name: 'Food & Grocery',  slug: 'food-grocery',    icon: '🛒', description: 'Fresh produce and packaged foods',       order: 7 },
  { name: 'Toys & Kids',     slug: 'toys-kids',       icon: '🧸', description: 'Toys, games, and kids clothing',         order: 8 },
];

/* ── Product definitions (category is resolved after categories are created) ── */
const getProducts = (cm) => [
  // ── ELECTRONICS ────────────────────────────────────────────────
  {
    name: 'iPhone 15 Pro Max 256GB', brand: 'Apple',
    shortDescription: 'Apple flagship with titanium design',
    description: 'Experience the power of the A17 Pro chip with this stunning titanium-bodied smartphone featuring a 48MP camera system and all-day battery life.',
    price: 950000, comparePrice: 1050000, category: cm['Electronics'],
    stock: 45, rating: 4.8, numReviews: 124, isFeatured: true, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'],
    tags: ['iphone', 'apple', 'smartphone'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung',
    shortDescription: 'Android powerhouse with S Pen',
    description: 'The ultimate Android experience with a built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor for unmatched performance.',
    price: 850000, comparePrice: 950000, category: cm['Electronics'],
    stock: 38, rating: 4.7, numReviews: 89, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'],
    tags: ['samsung', 'android', 'smartphone'],
  },
  {
    name: 'MacBook Pro 14" M3', brand: 'Apple',
    shortDescription: 'Professional laptop for creatives',
    description: 'The MacBook Pro 14" with M3 chip delivers extraordinary performance for professionals, with up to 22 hours of battery life and a stunning Liquid Retina XDR display.',
    price: 1450000, comparePrice: 1600000, category: cm['Electronics'],
    stock: 20, rating: 4.9, numReviews: 56, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
    tags: ['macbook', 'laptop', 'apple'],
  },
  {
    name: 'Sony WH-1000XM5 Headphones', brand: 'Sony',
    shortDescription: 'Industry-leading noise cancelling',
    description: 'Premium wireless headphones with industry-leading noise cancellation, 30-hour battery life, and crystal-clear call quality.',
    price: 185000, comparePrice: 220000, category: cm['Electronics'],
    stock: 67, rating: 4.7, numReviews: 203, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    tags: ['headphones', 'sony', 'wireless'],
  },
  {
    name: 'iPad Air 5th Generation', brand: 'Apple',
    shortDescription: 'Powerful tablet with M1 chip',
    description: 'The iPad Air features the powerful M1 chip, a stunning 10.9" Liquid Retina display, USB-C connectivity, and support for Apple Pencil.',
    price: 580000, comparePrice: 650000, category: cm['Electronics'],
    stock: 33, rating: 4.6, numReviews: 78,
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'],
    tags: ['ipad', 'tablet', 'apple'],
  },
  {
    name: 'Nintendo Switch OLED', brand: 'Nintendo',
    shortDescription: 'Hybrid gaming console',
    description: 'Play your favourite games at home or on the go with the Nintendo Switch OLED featuring a vibrant 7-inch OLED screen and enhanced audio.',
    price: 260000, comparePrice: 290000, category: cm['Electronics'],
    stock: 52, rating: 4.8, numReviews: 341, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600',
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600'],
    tags: ['nintendo', 'gaming', 'console'],
  },
  {
    name: 'JBL Flip 6 Bluetooth Speaker', brand: 'JBL',
    shortDescription: 'Portable waterproof speaker',
    description: 'JBL Flip 6 with powerful stereo sound, IP67 waterproof rating, 12-hour battery life, and PartyBoost for linking multiple speakers.',
    price: 68000, comparePrice: 85000, category: cm['Electronics'],
    stock: 55, rating: 4.7, numReviews: 193, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
    tags: ['speaker', 'jbl', 'bluetooth'],
  },
  {
    name: 'Xiaomi Smart Watch Pro', brand: 'Xiaomi',
    shortDescription: '1.43" AMOLED health tracker',
    description: 'Smartwatch with 1.43" AMOLED display, 150+ workout modes, SpO2 and heart rate monitoring, built-in GPS, and 12-day battery life.',
    price: 45000, comparePrice: 62000, category: cm['Electronics'],
    stock: 88, rating: 4.5, numReviews: 274, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    tags: ['smartwatch', 'xiaomi', 'wearable'],
  },
  {
    name: 'Dell 27" 4K IPS Monitor', brand: 'Dell',
    shortDescription: 'Colour-accurate display for pros',
    description: 'Dell UltraSharp 27" 4K IPS monitor with 99% sRGB coverage, USB-C 65W charging, height-adjustable stand, and virtually borderless design.',
    price: 320000, comparePrice: 390000, category: cm['Electronics'],
    stock: 18, rating: 4.8, numReviews: 62, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'],
    tags: ['monitor', 'dell', '4k', 'display'],
  },

  // ── FASHION ─────────────────────────────────────────────────────
  {
    name: 'Classic White Leather Sneakers', brand: 'HabiStyle',
    shortDescription: 'Timeless minimalist style',
    description: 'Premium leather white sneakers with cushioned sole and breathable lining. Versatile enough for any casual occasion.',
    price: 35000, comparePrice: 45000, category: cm['Fashion'],
    stock: 120, rating: 4.5, numReviews: 67, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    tags: ['sneakers', 'shoes', 'fashion'],
  },
  {
    name: 'Linen Summer Dress', brand: 'HabiStyle',
    shortDescription: 'Breezy and elegant',
    description: 'Lightweight 100% linen dress perfect for warm weather. Available in multiple colors with a relaxed, flattering fit.',
    price: 18500, comparePrice: 25000, category: cm['Fashion'],
    stock: 85, rating: 4.4, numReviews: 43, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'],
    tags: ['dress', 'summer', 'women'],
  },
  {
    name: 'Premium Genuine Leather Wallet', brand: 'LeatherCo',
    shortDescription: 'Slim minimalist design',
    description: 'Handcrafted genuine leather slim wallet with RFID protection, 8 card slots, and a cash compartment. Perfect gift.',
    price: 12000, comparePrice: 18000, category: cm['Fashion'],
    stock: 200, rating: 4.6, numReviews: 112,
    thumbnail: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'],
    tags: ['wallet', 'leather', 'accessories'],
  },
  {
    name: "Men's Slim Fit Chino Trousers", brand: 'HabiStyle',
    shortDescription: 'Smart-casual everyday pants',
    description: 'Premium cotton-blend slim-fit chino trousers with stretch comfort. Available in khaki, navy, olive, and black.',
    price: 14500, comparePrice: 20000, category: cm['Fashion'],
    stock: 200, rating: 4.4, numReviews: 89,
    thumbnail: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
    tags: ['trousers', 'chino', 'men', 'fashion'],
  },
  {
    name: "Women's Canvas Tote Bag", brand: 'HabiStyle',
    shortDescription: 'Spacious everyday carry bag',
    description: 'Large heavyweight canvas tote bag with zip closure, interior pockets, and reinforced handles. Ideal for work, market, or travel.',
    price: 9500, comparePrice: 14000, category: cm['Fashion'],
    stock: 300, rating: 4.5, numReviews: 145, freeShipping: true, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'],
    tags: ['bag', 'tote', 'canvas', 'women'],
  },

  // ── HOME & LIVING ────────────────────────────────────────────────
  {
    name: 'Ergonomic Mesh Office Chair', brand: 'ErgoPlus',
    shortDescription: 'All-day comfort and lumbar support',
    description: 'Premium mesh ergonomic chair with adjustable lumbar support, 4D armrests, and breathable design engineered for all-day comfort.',
    price: 125000, comparePrice: 160000, category: cm['Home & Living'],
    stock: 30, rating: 4.7, numReviews: 88, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600'],
    tags: ['chair', 'office', 'ergonomic'],
  },
  {
    name: 'Ceramic Coffee Mug Set (4 pcs)', brand: 'CeramiArt',
    shortDescription: 'Artisan handcrafted mugs',
    description: 'Set of 4 handcrafted ceramic mugs with a beautiful matte finish. Microwave and dishwasher safe. Makes a great gift.',
    price: 8500, comparePrice: 12000, category: cm['Home & Living'],
    stock: 150, rating: 4.5, numReviews: 56, freeShipping: true,
    thumbnail: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600'],
    tags: ['mug', 'coffee', 'kitchen'],
  },
  {
    name: 'Scented Soy Candle Set (3 pcs)', brand: 'AromaLux',
    shortDescription: 'Luxury home fragrance',
    description: 'Set of 3 premium soy wax candles with calming fragrances: Lavender, Vanilla Bean, and Ocean Breeze. 45-hour burn time each.',
    price: 6500, comparePrice: 9000, category: cm['Home & Living'],
    stock: 200, rating: 4.8, numReviews: 134, isNew: true, freeShipping: true,
    thumbnail: 'https://images.unsplash.com/photo-1602607774773-04b5aec0ded1?w=600',
    images: ['https://images.unsplash.com/photo-1602607774773-04b5aec0ded1?w=600'],
    tags: ['candle', 'home', 'aromatherapy'],
  },
  {
    name: 'Digital Air Fryer 4.5L', brand: 'CookPro',
    shortDescription: 'Crispy food with 80% less oil',
    description: '4.5L digital air fryer with 8 preset cooking functions, rapid air circulation technology, non-stick basket, and digital touchscreen.',
    price: 52000, comparePrice: 72000, category: cm['Home & Living'],
    stock: 45, rating: 4.7, numReviews: 312, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600'],
    tags: ['air fryer', 'kitchen', 'cooking'],
  },
  {
    name: 'Memory Foam Cervical Pillow', brand: 'DreamRest',
    shortDescription: 'Orthopaedic neck support',
    description: 'Contoured memory foam pillow with cooling gel layer and breathable bamboo cover. Supports natural spine alignment for all sleepers.',
    price: 18000, comparePrice: 26000, category: cm['Home & Living'],
    stock: 110, rating: 4.6, numReviews: 198,
    thumbnail: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'],
    tags: ['pillow', 'memory foam', 'bedroom', 'sleep'],
  },

  // ── BEAUTY & HEALTH ──────────────────────────────────────────────
  {
    name: 'Vitamin C Brightening Serum 30ml', brand: 'GlowLab',
    shortDescription: 'Brightening and anti-aging serum',
    description: '20% Vitamin C serum with hyaluronic acid and niacinamide for radiant, youthful skin. Clinically tested and dermatologist approved.',
    price: 15000, comparePrice: 22000, category: cm['Beauty & Health'],
    stock: 300, rating: 4.6, numReviews: 287, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
    tags: ['serum', 'skincare', 'vitamin c'],
  },
  {
    name: 'Jamaican Black Castor Hair Oil', brand: 'NatureLocks',
    shortDescription: 'Promotes growth and reduces breakage',
    description: 'A powerful blend of Jamaican Black Castor Oil, argan, and coconut oil to promote hair growth, reduce breakage, and moisturise the scalp.',
    price: 4500, comparePrice: 6500, category: cm['Beauty & Health'],
    stock: 450, rating: 4.5, numReviews: 412,
    thumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600',
    images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600'],
    tags: ['haircare', 'natural', 'oil'],
  },
  {
    name: 'Oral-B Pro Series 3 Electric Toothbrush', brand: 'Oral-B',
    shortDescription: 'Removes 100% more plaque',
    description: 'Oral-B Pro Series 3 with 3 cleaning modes, built-in pressure sensor, 2-minute smart timer, and 2 replacement brush heads included.',
    price: 28000, comparePrice: 38000, category: cm['Beauty & Health'],
    stock: 95, rating: 4.7, numReviews: 234, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1559591935-c3d7cdb07b27?w=600',
    images: ['https://images.unsplash.com/photo-1559591935-c3d7cdb07b27?w=600'],
    tags: ['toothbrush', 'oral-b', 'dental'],
  },
  {
    name: 'Nigerian Shea Butter Body Cream 400ml', brand: 'NaturaSkin',
    shortDescription: 'Deep moisturising shea formula',
    description: 'Rich body cream with 40% unrefined Nigerian shea butter, coconut oil, and vitamin E. Deeply moisturises and evens skin tone.',
    price: 3800, comparePrice: 5500, category: cm['Beauty & Health'],
    stock: 600, rating: 4.6, numReviews: 534,
    thumbnail: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600'],
    tags: ['shea butter', 'skincare', 'body cream'],
  },

  // ── SPORTS & FITNESS ─────────────────────────────────────────────
  {
    name: 'Premium Non-Slip Yoga Mat 6mm', brand: 'FlexFit',
    shortDescription: 'Professional-grade eco yoga mat',
    description: 'Eco-friendly TPE yoga mat with alignment lines, carrying strap, and 6mm extra thickness for superior joint support during practice.',
    price: 12000, comparePrice: 18000, category: cm['Sports & Fitness'],
    stock: 180, rating: 4.6, numReviews: 95, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1601925228226-8013e840e2d2?w=600',
    images: ['https://images.unsplash.com/photo-1601925228226-8013e840e2d2?w=600'],
    tags: ['yoga', 'fitness', 'mat'],
  },
  {
    name: 'Adjustable Dumbbells Set 5-52.5lbs', brand: 'IronPro',
    shortDescription: 'Replaces 15 dumbbells in one',
    description: 'Space-saving adjustable dumbbell set with patented dial system for quick weight changes from 5 to 52.5 lbs in 2.5 lb increments.',
    price: 85000, comparePrice: 110000, category: cm['Sports & Fitness'],
    stock: 25, rating: 4.8, numReviews: 67, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'],
    tags: ['dumbbell', 'weights', 'fitness'],
  },
  {
    name: 'Resistance Bands Set 5 Levels', brand: 'FlexFit',
    shortDescription: 'Full-body home workout kit',
    description: 'Set of 5 latex resistance bands with varying resistance levels. Perfect for stretching, strength training, and physiotherapy exercises.',
    price: 5500, comparePrice: 8000, category: cm['Sports & Fitness'],
    stock: 350, rating: 4.5, numReviews: 189, freeShipping: true,
    thumbnail: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600',
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600'],
    tags: ['resistance', 'bands', 'workout'],
  },
  {
    name: 'FIFA Quality Pro Football', brand: 'ProKick',
    shortDescription: 'Official match-grade football',
    description: 'FIFA Quality Pro certified football with water-resistant casing, 32-panel stitched design, and optimised flight path for all surfaces.',
    price: 22000, comparePrice: 30000, category: cm['Sports & Fitness'],
    stock: 80, rating: 4.7, numReviews: 54,
    thumbnail: 'https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=600',
    images: ['https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=600'],
    tags: ['football', 'soccer', 'sport'],
  },

  // ── BOOKS & EDUCATION ────────────────────────────────────────────
  {
    name: 'Atomic Habits — James Clear', brand: 'Penguin Random House',
    shortDescription: 'Build good habits, break bad ones',
    description: 'The global bestselling guide to building good habits and breaking bad ones. Over 10 million copies sold. Backed by science, grounded in practice.',
    price: 5500, comparePrice: 7500, category: cm['Books & Education'],
    stock: 500, rating: 4.9, numReviews: 1204, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
    tags: ['book', 'self-help', 'habits'],
  },
  {
    name: 'Rich Dad Poor Dad — Robert Kiyosaki', brand: 'Plata Publishing',
    shortDescription: 'Personal finance classic',
    description: "Robert Kiyosaki's timeless classic on financial education, investing, and wealth building. A must-read for every entrepreneur and professional.",
    price: 4800, comparePrice: 6500, category: cm['Books & Education'],
    stock: 420, rating: 4.7, numReviews: 876,
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
    tags: ['book', 'finance', 'wealth'],
  },
  {
    name: 'Professional Artist Sketching Set 72pc', brand: 'ArtPro',
    shortDescription: 'Complete artist drawing kit',
    description: 'Complete sketching set with graphite pencils HB-8B, blending stumps, charcoal sticks, kneaded erasers, and a premium zippered carrying case.',
    price: 15000, comparePrice: 22000, category: cm['Books & Education'],
    stock: 120, rating: 4.6, numReviews: 93, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'],
    tags: ['art', 'sketching', 'stationery'],
  },
  {
    name: 'Casio FX-991EX Scientific Calculator', brand: 'Casio',
    shortDescription: 'Advanced natural textbook display',
    description: 'Casio FX-991EX Classwiz with 552 functions, spreadsheet capability, QR code function. Essential for WAEC, JAMB, and university students.',
    price: 12500, comparePrice: 16000, category: cm['Books & Education'],
    stock: 200, rating: 4.8, numReviews: 342, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600',
    images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600'],
    tags: ['calculator', 'casio', 'education', 'school'],
  },

  // ── FOOD & GROCERY ───────────────────────────────────────────────
  {
    name: 'Raw Organic Nigerian Honey 500g', brand: 'NaturaBee',
    shortDescription: '100% pure Nigerian forest honey',
    description: 'Unfiltered, raw organic honey sourced from pristine Nigerian forests. No additives, no preservatives. Rich in antioxidants and natural enzymes.',
    price: 3500, comparePrice: 5000, category: cm['Food & Grocery'],
    stock: 600, rating: 4.8, numReviews: 423, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'],
    tags: ['honey', 'organic', 'natural', 'food'],
  },
  {
    name: 'Single-Origin Ground Coffee 250g', brand: 'BrewMaster',
    shortDescription: 'Ethiopian Arabica blend',
    description: 'Medium-roast single-origin Arabica coffee from Ethiopian highlands. Rich, smooth flavour with natural chocolate and berry notes.',
    price: 4200, comparePrice: 5800, category: cm['Food & Grocery'],
    stock: 400, rating: 4.7, numReviews: 215,
    thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600',
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600'],
    tags: ['coffee', 'arabica', 'beverage'],
  },
  {
    name: 'Premium Mixed Nuts and Dried Fruits 1kg', brand: 'NutriSnack',
    shortDescription: 'Healthy assorted snack mix',
    description: 'Premium mix of cashews, almonds, walnuts, pistachios, raisins, and cranberries. No added salt or sugar. Perfect healthy office snack.',
    price: 8000, comparePrice: 11000, category: cm['Food & Grocery'],
    stock: 250, rating: 4.6, numReviews: 178, freeShipping: true, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=600',
    images: ['https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=600'],
    tags: ['nuts', 'snack', 'healthy', 'organic'],
  },
  {
    name: 'Zobo Hibiscus Drink Concentrate 1L', brand: 'ZoboKing',
    shortDescription: 'Premium Nigerian hibiscus drink',
    description: 'Authentic Nigerian zobo concentrate made from dried Roselle flowers with cloves, ginger, and natural spices. Just dilute and serve chilled.',
    price: 2800, comparePrice: 4000, category: cm['Food & Grocery'],
    stock: 800, rating: 4.5, numReviews: 312,
    thumbnail: 'https://images.unsplash.com/photo-1622597467836-f3e4b5df3bdb?w=600',
    images: ['https://images.unsplash.com/photo-1622597467836-f3e4b5df3bdb?w=600'],
    tags: ['zobo', 'hibiscus', 'drink', 'nigerian'],
  },

  // ── TOYS & KIDS ──────────────────────────────────────────────────
  {
    name: 'LEGO Classic Creative Brick Box 484pcs', brand: 'LEGO',
    shortDescription: '484 pieces for endless creativity',
    description: 'LEGO Classic 10698 with 484 colourful bricks in 33 different colours. Includes building ideas booklet. For ages 4 and up.',
    price: 28000, comparePrice: 38000, category: cm['Toys & Kids'],
    stock: 75, rating: 4.9, numReviews: 287, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600',
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600'],
    tags: ['lego', 'toy', 'kids', 'creative'],
  },
  {
    name: 'Kids Bicycle 20 Inch Ages 6-10', brand: 'KidsCycle',
    shortDescription: 'Safe and sturdy first bike',
    description: 'Lightweight steel-frame bicycle with training wheels, adjustable seat height, front and rear hand brakes, and a front basket. Ages 6-10.',
    price: 42000, comparePrice: 58000, category: cm['Toys & Kids'],
    stock: 40, rating: 4.7, numReviews: 134, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600',
    images: ['https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600'],
    tags: ['bicycle', 'kids', 'outdoor', 'bike'],
  },
  {
    name: 'Montessori Wooden Puzzle Set 6 pcs', brand: 'MindSpark',
    shortDescription: 'Educational learning toys',
    description: 'Set of 6 wooden puzzles: alphabet, numbers, shapes, animals, vehicles, and fruits. Enhances cognitive development for ages 2-6.',
    price: 8500, comparePrice: 12000, category: cm['Toys & Kids'],
    stock: 160, rating: 4.8, numReviews: 201, freeShipping: true,
    thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600',
    images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600'],
    tags: ['puzzle', 'educational', 'montessori', 'kids'],
  },
  {
    name: 'High-Speed RC Car 4WD 1:16 Scale', brand: 'TurboKids',
    shortDescription: '30km/h off-road remote control car',
    description: '4WD remote control car with 2.4GHz remote, 30km/h top speed, shock-absorbing suspension, rechargeable battery, and all-terrain tyres.',
    price: 18500, comparePrice: 25000, category: cm['Toys & Kids'],
    stock: 90, rating: 4.6, numReviews: 156, isNew: true,
    thumbnail: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600',
    images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600'],
    tags: ['rc car', 'remote control', 'toy', 'kids'],
  },
];

/* ── Coupons ──────────────────────────────────────────────────────── */
const COUPONS = [
  {
    code: 'WELCOME10',
    description: 'Welcome discount for new users — 10% off',
    type: 'percentage', value: 10,
    minOrderAmount: 5000,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'HABI500',
    description: 'Flat ₦500 off on orders over ₦3,000',
    type: 'fixed', value: 500,
    minOrderAmount: 3000, usageLimit: 100,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'SAVE20',
    description: '20% off for orders above ₦50,000 (max ₦20,000)',
    type: 'percentage', value: 20,
    minOrderAmount: 50000, maxDiscount: 20000,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
];

/* ── Main ─────────────────────────────────────────────────────────── */
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('\n📦 Connected to MongoDB:', MONGO_URI);

    // ── Clear existing data ──
    console.log('🗑️  Clearing existing data…');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);

    // ── Users ──
    console.log('👤 Creating users…');
    await User.create({
      name: 'Admin HabiShop', email: 'admin@habishop.com',
      password: 'Admin@123', role: 'admin', phone: '+2348000000000',
    });
    await User.create({
      name: 'Test User', email: 'user@habishop.com',
      password: 'User@123', role: 'user', phone: '+2348011111111',
    });
    console.log('   ✅ 2 users created');

    // ── Categories ──
    console.log('🗂️  Creating categories…');
    const createdCats = await Category.insertMany(CATEGORIES);
    const cm = {};
    createdCats.forEach((c) => { cm[c.name] = c._id; });
    console.log(`   ✅ ${createdCats.length} categories created`);

    // ── Products (one by one so pre-save hook runs → unique slugs) ──
    console.log('📦 Creating products…');
    const productDefs = getProducts(cm);
    const created = [];

    for (let i = 0; i < productDefs.length; i++) {
      const def = productDefs[i];
      try {
        const p = await Product.create(def);
        created.push(p);
        process.stdout.write(`\r   ✅ ${created.length}/${productDefs.length} — ${p.name.substring(0, 50)}`);
      } catch (err) {
        console.error(`\n   ❌ Failed: ${def.name} — ${err.message}`);
      }
    }
    console.log(`\n   ✅ ${created.length} products created successfully`);

    // ── Coupons ──
    console.log('🎟️  Creating coupons…');
    await Coupon.insertMany(COUPONS);
    console.log(`   ✅ ${COUPONS.length} coupons created`);

    // ── Summary ──
    console.log('\n══════════════════════════════════════════');
    console.log('✅  HabiShop database seeded successfully!');
    console.log('══════════════════════════════════════════');
    console.log('\n🔑 Login credentials:');
    console.log('   Admin → admin@habishop.com / Admin@123');
    console.log('   User  → user@habishop.com  / User@123');
    console.log('\n🎟️  Coupon codes: WELCOME10 · HABI500 · SAVE20');
    console.log(`\n📊 Summary:`);
    console.log(`   Categories : ${createdCats.length}`);
    console.log(`   Products   : ${created.length}`);
    console.log(`   Coupons    : ${COUPONS.length}`);
    console.log('══════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
