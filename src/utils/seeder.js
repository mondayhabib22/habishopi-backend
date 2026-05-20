/**
 * HabiShop Database Seeder — 100+ Products
 * Uses Product.create() so pre-save hook fires → unique slugs guaranteed.
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

/* ── Categories ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Electronics',      slug: 'electronics',     icon: '💻', description: 'Gadgets, phones, computers and accessories', order: 1 },
  { name: 'Fashion',          slug: 'fashion',          icon: '👗', description: 'Clothing, shoes, bags and accessories',       order: 2 },
  { name: 'Home & Living',    slug: 'home-living',      icon: '🏠', description: 'Furniture, decor, kitchen and appliances',   order: 3 },
  { name: 'Beauty & Health',  slug: 'beauty-health',    icon: '💄', description: 'Skincare, makeup, hair and wellness',        order: 4 },
  { name: 'Sports & Fitness', slug: 'sports-fitness',   icon: '⚽', description: 'Equipment, apparel and supplements',        order: 5 },
  { name: 'Books & Education',slug: 'books-education',  icon: '📚', description: 'Books, stationery and learning tools',       order: 6 },
  { name: 'Food & Grocery',   slug: 'food-grocery',     icon: '🛒', description: 'Fresh, packaged and specialty foods',        order: 7 },
  { name: 'Toys & Kids',      slug: 'toys-kids',        icon: '🧸', description: 'Toys, games and kids clothing',              order: 8 },
];

/* helper shorthand */
const p = (name, brand, price, comparePrice, cat, stock, rating, reviews, opts = {}) => ({
  name, brand, price, comparePrice, category: cat, stock, rating, numReviews: reviews,
  isFeatured: opts.featured || false,
  isNew:      opts.isNew    || false,
  freeShipping: opts.free   || false,
  thumbnail:  opts.img      || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
  images:    [opts.img      || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
  shortDescription: opts.short || name,
  description:      opts.desc  || `Premium quality ${name}. Trusted by thousands of customers across Nigeria.`,
  tags: opts.tags || [],
  soldCount: opts.sold || 0,
});

/* ── All Products ────────────────────────────────────────────────── */
const getProducts = (cm) => {
  const E  = cm['Electronics'];
  const F  = cm['Fashion'];
  const H  = cm['Home & Living'];
  const B  = cm['Beauty & Health'];
  const S  = cm['Sports & Fitness'];
  const K  = cm['Books & Education'];
  const G  = cm['Food & Grocery'];
  const T  = cm['Toys & Kids'];

  return [
  // ════════════════════════════════════════════════
  // ELECTRONICS — 18 products
  // ════════════════════════════════════════════════
  p('iPhone 15 Pro Max 256GB','Apple',950000,1050000,E,45,4.8,1240,{featured:true,isNew:true,sold:312,
    img:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
    short:'Apple flagship with titanium design',
    desc:'A17 Pro chip, 48MP main camera, USB-C, titanium frame, Action Button, all-day battery life.',
    tags:['iphone','apple','smartphone','flagship']}),

  p('Samsung Galaxy S24 Ultra','Samsung',850000,950000,E,38,4.7,890,{featured:true,sold:267,
    img:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
    short:'Android powerhouse with built-in S Pen',
    desc:'200MP camera, Snapdragon 8 Gen 3, titanium body, built-in S Pen, 5000mAh, 45W fast charging.',
    tags:['samsung','android','smartphone']}),

  p('MacBook Pro 14" M3 Chip','Apple',1450000,1600000,E,20,4.9,560,{featured:true,sold:189,
    img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    short:'Professional laptop for creatives',
    desc:'Apple M3 chip, Liquid Retina XDR, 18GB unified memory, 22-hour battery, 3 Thunderbolt 4 ports.',
    tags:['macbook','laptop','apple','pro']}),

  p('Sony WH-1000XM5 Headphones','Sony',185000,220000,E,67,4.7,2030,{featured:true,sold:445,
    img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    short:'Industry-leading noise cancellation',
    desc:'8 mics for noise cancellation, 30h battery, multipoint connection, speak-to-chat, foldable design.',
    tags:['headphones','sony','wireless','noise cancelling']}),

  p('iPad Air 5th Gen M1','Apple',580000,650000,E,33,4.6,780,{sold:134,
    img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
    short:'Powerful tablet with M1 chip',
    desc:'M1 chip, 10.9" Liquid Retina, Touch ID, USB-C, 5G optional, Magic Keyboard & Apple Pencil 2 support.',
    tags:['ipad','tablet','apple']}),

  p('Nintendo Switch OLED Model','Nintendo',260000,290000,E,52,4.8,3410,{isNew:true,sold:678,
    img:'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600',
    short:'Hybrid gaming console with OLED screen',
    desc:'7" OLED screen, enhanced audio, wide adjustable stand, 64GB internal storage, LAN port in dock.',
    tags:['nintendo','gaming','console','switch']}),

  p('JBL Flip 6 Bluetooth Speaker','JBL',68000,85000,E,55,4.7,1930,{featured:true,sold:523,
    img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    short:'Portable waterproof Bluetooth speaker',
    desc:'IP67 waterproof, 12-hour playtime, PartyBoost multi-speaker, powerful JBL Pro Sound, USB-C charging.',
    tags:['speaker','jbl','bluetooth','waterproof']}),

  p('Xiaomi Smart Watch Pro AMOLED','Xiaomi',45000,62000,E,88,4.5,2740,{isNew:true,sold:289,
    img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    short:'1.43" AMOLED health and fitness tracker',
    desc:'1.43" AMOLED, 150+ workout modes, SpO2, heart rate, blood pressure, built-in GPS, 12-day battery.',
    tags:['smartwatch','xiaomi','wearable','fitness']}),

  p('Dell 27" 4K UltraSharp Monitor','Dell',320000,390000,E,18,4.8,620,{featured:true,sold:98,
    img:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600',
    short:'4K IPS display for creative professionals',
    desc:'4K IPS, 99% sRGB, 60Hz, USB-C 65W PD, HDMI, DP, height/tilt/pivot adjustable, virtually borderless.',
    tags:['monitor','dell','4k','display']}),

  p('Logitech MX Master 3S Mouse','Logitech',38000,52000,E,120,4.8,4450,{featured:true,sold:867,
    img:'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600',
    short:'Advanced wireless productivity mouse',
    desc:'8000 DPI, MagSpeed scroll, works on glass, 70-day battery, 3-device pairing, quiet clicks, USB-C.',
    tags:['mouse','logitech','wireless','productivity']}),

  p('Samsung 65" 4K QLED Smart TV','Samsung',1200000,1450000,E,12,4.7,1340,{featured:true,sold:78,
    img:'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600',
    short:'65" Quantum Dot 4K Smart TV',
    desc:'Quantum HDR, 120Hz, Object Tracking Sound+, built-in Alexa & Bixby, Gaming Hub, Slim design.',
    tags:['tv','samsung','smart tv','4k','qled']}),

  p('DJI Mini 3 Drone','DJI',420000,480000,E,22,4.8,870,{isNew:true,sold:134,
    img:'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600',
    short:'Lightweight 4K camera drone under 249g',
    desc:'4K/60fps, 38-min flight, True Vertical Shooting, Intelligent Modes, obstacle sensing, under 249g.',
    tags:['drone','dji','camera','aerial']}),

  p('Apple AirPods Pro 2nd Gen','Apple',175000,200000,E,90,4.8,2340,{featured:true,sold:567,
    img:'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600',
    short:'Adaptive ANC with Transparency mode',
    desc:'Adaptive Noise Cancellation, Transparency mode, Spatial Audio, H2 chip, 30h total battery (case).',
    tags:['airpods','apple','earbuds','wireless']}),

  p('PlayStation 5 Console','Sony',750000,850000,E,15,4.9,5670,{featured:true,sold:234,
    img:'https://images.unsplash.com/photo-1607853202273-232359a4b8ba?w=600',
    short:'Next-gen gaming console 825GB SSD',
    desc:'825GB custom SSD, 4K 120fps, ray tracing, DualSense haptic controller, Ultra HD Blu-ray drive.',
    tags:['ps5','playstation','gaming','console']}),

  p('Anker 65W GaN Charger 4-Port','Anker',18500,25000,E,200,4.7,1890,{free:true,sold:945,
    img:'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
    short:'65W GaN USB-C multiport fast charger',
    desc:'GaN technology, 65W total (45W USB-C + 20W), 2x USB-C + 2x USB-A, charges 4 devices simultaneously.',
    tags:['charger','anker','usb-c','fast charge']}),

  p('Canon EOS R50 Mirrorless Camera','Canon',480000,560000,E,18,4.7,340,{featured:true,sold:89,
    img:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    short:'24.2MP APS-C mirrorless camera',
    desc:'24.2MP APS-C sensor, 4K video, DIGIC X processor, Eye AF, Dual Pixel CMOS AF, Wi-Fi & Bluetooth.',
    tags:['camera','canon','mirrorless','photography']}),

  p('Mechanical Gaming Keyboard RGB','Redragon',22000,32000,E,150,4.6,890,{isNew:true,sold:345,
    img:'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600',
    short:'TKL RGB mechanical gaming keyboard',
    desc:'Blue switches, per-key RGB backlighting, TKL compact layout, USB passthrough, braided cable.',
    tags:['keyboard','gaming','mechanical','rgb']}),

  p('Portable Power Bank 20000mAh','Anker',25000,35000,E,180,4.7,2340,{free:true,sold:678,
    img:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600',
    short:'20000mAh slim power bank 65W PD',
    desc:'20000mAh, 65W Power Delivery, charges MacBook, iPad & phones simultaneously, LED display, slim profile.',
    tags:['power bank','anker','portable','charging']}),

  // ════════════════════════════════════════════════
  // FASHION — 16 products
  // ════════════════════════════════════════════════
  p('Classic White Leather Sneakers','HabiStyle',35000,45000,F,120,4.5,670,{featured:true,sold:445,
    img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    short:'Timeless minimalist leather sneakers',
    desc:'Premium full-grain leather, memory foam insole, rubber sole, padded collar. Fits true to size.',
    tags:['sneakers','shoes','leather','white']}),

  p('Linen Summer Dress','HabiStyle',18500,25000,F,85,4.4,430,{isNew:true,sold:198,
    img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
    short:'Breezy 100% linen midi dress',
    desc:'100% linen, breathable, side pockets, relaxed A-line fit. Available in white, sage, terracotta, navy.',
    tags:['dress','summer','linen','women']}),

  p('Premium Genuine Leather Wallet','LeatherCo',12000,18000,F,200,4.6,1120,{sold:567,
    img:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
    short:'Slim RFID-blocking leather wallet',
    desc:'Full-grain leather, RFID blocking, 8 card slots, bill pocket, coin compartment. Black or brown.',
    tags:['wallet','leather','rfid','accessories']}),

  p("Men's Slim Fit Chino Trousers",'HabiStyle',14500,20000,F,200,4.4,890,{sold:345,
    img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
    short:'Stretch cotton slim-fit chinos',
    desc:'97% cotton, 3% elastane. Flat-front slim fit in khaki, navy, olive, black. Machine washable.',
    tags:['chinos','men','trousers','smart casual']}),

  p("Women's Large Canvas Tote Bag",'HabiStyle',9500,14000,F,300,4.5,1450,{free:true,isNew:true,sold:534,
    img:'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600',
    short:'Spacious everyday canvas tote',
    desc:'12oz cotton canvas, zip top, inner zip pocket, key hook, 15" laptop fits. Natural & black options.',
    tags:['tote','canvas','bag','women']}),

  p('Men Formal Oxford Dress Shoes','LeatherCo',28000,38000,F,75,4.6,580,{sold:212,
    img:'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600',
    short:'Classic full-grain leather oxfords',
    desc:'Full-grain leather upper, leather lining, rubber sole, Goodyear welt construction. Black & brown.',
    tags:['oxford','shoes','men','formal','leather']}),

  p('Agbada Native Senator Suit','NaijaFashion',45000,65000,F,60,4.8,2030,{featured:true,sold:678,
    img:'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600',
    short:'Premium embroidered senator suit',
    desc:'High-quality fabric, rich embroidery, 2-piece set. 12 colour options. Tailored in Nigeria.',
    tags:['senator','agbada','native','nigerian fashion','men']}),

  p('Gold Plated Jewellery Set 3pc','GoldLux',15000,22000,F,150,4.5,1670,{sold:345,
    img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
    short:'Necklace, earrings and bracelet set',
    desc:'18k gold plated, anti-tarnish, hypoallergenic. Includes necklace, drop earrings & chain bracelet.',
    tags:['jewellery','gold','necklace','earrings','women']}),

  p('Ankara Print Wrap Midi Skirt','NaijaFashion',8500,12000,F,180,4.7,1340,{isNew:true,free:true,sold:456,
    img:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600',
    short:'Vibrant authentic Ankara wrap skirt',
    desc:'100% cotton Ankara, adjustable wrap tie, midi length. Handcrafted by Nigerian artisans.',
    tags:['ankara','skirt','african fashion','nigerian']}),

  p('Unisex Leather Dress Belt','LeatherCo',6500,10000,F,250,4.4,760,{free:true,sold:289,
    img:'https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=600',
    short:'Full-grain leather 1.25" belt',
    desc:'Full-grain leather, solid brass buckle, 1.25" width. Sizes 28–44. Black & brown available.',
    tags:['belt','leather','accessories','unisex']}),

  p('Women Floral Blouse Chiffon','HabiStyle',11000,16000,F,160,4.4,540,{sold:234,
    img:'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600',
    short:'Lightweight chiffon floral blouse',
    desc:'100% chiffon, floral print, v-neck, flutter sleeves. Multiple prints. Sizes XS–3XL.',
    tags:['blouse','women','chiffon','floral']}),

  p('Running Shoes Lightweight Mesh','HabiStyle',22000,32000,F,95,4.5,780,{isNew:true,sold:312,
    img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    short:'Breathable mesh running sneakers',
    desc:'Knit mesh upper, cushioned midsole, non-slip rubber sole. For road running and gym use.',
    tags:['running shoes','sneakers','sport','mesh']}),

  p('Crossbody Bag PU Leather','HabiStyle',13500,19000,F,130,4.5,670,{sold:289,
    img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    short:'Adjustable strap crossbody handbag',
    desc:'PU vegan leather, zip closure, 3 compartments, adjustable strap 20–55cm. 10 colour options.',
    tags:['crossbody','bag','handbag','women']}),

  p('Men Polo Shirt Premium Cotton','HabiStyle',9800,14000,F,220,4.4,890,{sold:456,
    img:'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    short:'Pique cotton slim-fit polo shirt',
    desc:'100% pique cotton, 3-button placket, ribbed collar & cuffs. 8 colours. S–3XL.',
    tags:['polo','shirt','men','cotton']}),

  p('Iro & Buba Lace Set','NaijaFashion',38000,55000,F,45,4.8,780,{featured:true,sold:234,
    img:'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600',
    short:'Nigerian lace fabric iro and buba',
    desc:'Premium French lace, blouse & wrapper set. Fully lined, zipper closure. Custom colours on request.',
    tags:['lace','iro','buba','nigerian','traditional']}),

  p('Sunglasses Polarised UV400','HabiStyle',8500,13000,F,200,4.4,560,{free:true,sold:345,
    img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600',
    short:'Polarised wraparound sunglasses',
    desc:'UV400 protection, polarised lenses, lightweight TR90 frame. Includes case & cleaning cloth.',
    tags:['sunglasses','accessories','uv protection','unisex']}),

  // ════════════════════════════════════════════════
  // HOME & LIVING — 16 products
  // ════════════════════════════════════════════════
  p('Ergonomic Mesh Office Chair','ErgoPlus',125000,160000,H,30,4.7,880,{featured:true,sold:234,
    img:'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
    short:'All-day comfort with lumbar support',
    desc:'Breathable mesh back, 3D adjustable lumbar, 4D armrests, seat depth & height adjust, 5yr warranty.',
    tags:['chair','office','ergonomic','mesh']}),

  p('Ceramic Coffee Mug Set 4pcs','CeramiArt',8500,12000,H,150,4.5,560,{free:true,sold:345,
    img:'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    short:'Artisan handcrafted stoneware mugs',
    desc:'4 mugs, 380ml each, matte glaze, microwave & dishwasher safe. Available in 6 colour sets.',
    tags:['mug','coffee','stoneware','kitchen']}),

  p('Scented Soy Candle Set 3pcs','AromaLux',6500,9000,H,200,4.8,1340,{isNew:true,free:true,sold:567,
    img:'https://images.unsplash.com/photo-1602607774773-04b5aec0ded1?w=600',
    short:'Luxury soy wax home fragrance set',
    desc:'Lavender, Vanilla Bean & Ocean Breeze. 100% soy wax, cotton wick, 45h burn time, reusable jar.',
    tags:['candle','soy wax','aromatherapy','home']}),

  p('Digital Air Fryer 4.5L','CookPro',52000,72000,H,45,4.7,3120,{featured:true,sold:789,
    img:'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600',
    short:'Crispy meals with 80% less oil',
    desc:'4.5L, 8 presets, digital touchscreen, rapid air technology, 1700W, non-stick basket, auto-off.',
    tags:['air fryer','kitchen','appliance','cooking']}),

  p('Memory Foam Cervical Pillow','DreamRest',18000,26000,H,110,4.6,1980,{sold:345,
    img:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    short:'Contoured memory foam neck pillow',
    desc:'Slow-rebound memory foam, cooling gel layer, bamboo-charcoal cover, dual height profile.',
    tags:['pillow','memory foam','sleep','cervical']}),

  p('Non-Stick Cookware Set 7pcs','CookPro',65000,90000,H,40,4.6,1780,{featured:true,sold:456,
    img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    short:'Granite-coated 7-piece pot set',
    desc:'5-layer granite coating, induction compatible, heat-resistant handles, dishwasher safe. Sizes 16–24cm.',
    tags:['cookware','pots','non-stick','granite','kitchen']}),

  p('Electric Standing Desk 140x70cm','ErgoPlus',185000,240000,H,15,4.8,670,{sold:89,
    img:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
    short:'Motorised sit-stand desk 3 memory presets',
    desc:'Electric height 72–120cm, 80kg capacity, 3 memory presets, anti-collision, cable management tray.',
    tags:['standing desk','office','ergonomic','electric']}),

  p('Bamboo Cutting Board Set 3pcs','CeramiArt',7500,11000,H,200,4.5,890,{free:true,sold:456,
    img:'https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?w=600',
    short:'Eco-friendly bamboo boards 3 sizes',
    desc:'S/M/L sizes, juice groove, non-slip feet, handle hole. Harder than wood, knife-friendly.',
    tags:['cutting board','bamboo','kitchen','eco']}),

  p('Smart LED Desk Lamp 15W Wireless','LightPro',24000,35000,H,80,4.7,1430,{isNew:true,sold:234,
    img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    short:'LED desk lamp with Qi wireless charging',
    desc:'5 brightness + 5 colour temp, touch control, 15W Qi pad, USB-A, 180° flex arm, eye-care certified.',
    tags:['desk lamp','wireless charging','led','smart']}),

  p('Blackout Curtains Pair 140x260cm','DreamRest',22000,32000,H,90,4.6,1120,{free:true,sold:345,
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    short:'99% light-blocking thermal curtains',
    desc:'99% blackout, thermal insulated, machine washable. Rod pocket + back tabs. 12 colours.',
    tags:['curtains','blackout','bedroom','thermal']}),

  p('Instant Pot Duo 7-in-1 6L','CookPro',75000,100000,H,35,4.8,2340,{featured:true,sold:567,
    img:'https://images.unsplash.com/photo-1585670711417-f3429adeaa79?w=600',
    short:'Pressure cooker, slow cooker & more',
    desc:'7-in-1: pressure cook, slow cook, rice, steam, sauté, yogurt, warm. 6L, 13 safety features.',
    tags:['instant pot','pressure cooker','kitchen','appliance']}),

  p('Storage Ottoman Bench 110cm','HomeDecor',35000,50000,H,25,4.5,430,{sold:123,
    img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    short:'Faux leather storage bench ottoman',
    desc:'110x38x38cm, 150kg capacity, faux leather, hidden storage, tufted lid. Multiple colours.',
    tags:['ottoman','storage','bench','bedroom','living room']}),

  p('Electric Kettle 1.7L 2200W','LightPro',15000,22000,H,120,4.6,1560,{free:true,sold:678,
    img:'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600',
    short:'Fast-boil kettle with auto shut-off',
    desc:'2200W boils 1.7L in 3 minutes, 100% stainless interior, LED indicator, auto shut-off, cool-touch.',
    tags:['kettle','electric','kitchen','appliance']}),

  p('Throw Blanket Sherpa Fleece 150x200cm','DreamRest',12000,18000,H,180,4.7,890,{free:true,isNew:true,sold:345,
    img:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600',
    short:'Soft reversible sherpa fleece blanket',
    desc:'Micro-mink one side, fluffy sherpa other side. Machine washable, 150x200cm, 8 colour options.',
    tags:['blanket','sherpa','fleece','bedroom','cozy']}),

  p('Wall Mounted Floating Shelves 3pcs','HomeDecor',18000,26000,H,70,4.5,560,{sold:234,
    img:'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600',
    short:'Set of 3 rustic wood floating shelves',
    desc:'Rustic wood boards, hidden metal brackets, 3 sizes (60/45/30cm). Max 15kg per shelf.',
    tags:['shelves','floating','wall decor','storage']}),

  p('Blender 1500W Professional','CookPro',45000,62000,H,60,4.7,780,{sold:312,
    img:'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600',
    short:'Professional countertop blender',
    desc:'1500W, 6 stainless blades, 2L BPA-free jar, 3 speeds + pulse, crush ice, self-cleaning mode.',
    tags:['blender','kitchen','smoothie','appliance']}),

  // ════════════════════════════════════════════════
  // BEAUTY & HEALTH — 14 products
  // ════════════════════════════════════════════════
  p('Vitamin C Brightening Serum 30ml','GlowLab',15000,22000,B,300,4.6,2870,{featured:true,sold:890,
    img:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    short:'20% Vitamin C anti-aging serum',
    desc:'20% ascorbic acid, hyaluronic acid, niacinamide, ferulic acid. Brightens, firms, reduces spots.',
    tags:['serum','vitamin c','skincare','brightening']}),

  p('Jamaican Black Castor Hair Oil 120ml','NatureLocks',4500,6500,B,450,4.5,4120,{sold:1200,
    img:'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600',
    short:'Promotes hair growth and reduces breakage',
    desc:'Cold-pressed JBCO, argan & castor blend. Strengthens hair from root, reduces breakage, seals moisture.',
    tags:['hair oil','jbco','growth','natural']}),

  p('Oral-B Pro 3 Electric Toothbrush','Oral-B',28000,38000,B,95,4.7,2340,{featured:true,sold:678,
    img:'https://images.unsplash.com/photo-1559591935-c3d7cdb07b27?w=600',
    short:'Removes 100% more plaque vs manual',
    desc:'3 cleaning modes, pressure sensor, 2-min timer, 2 replacement heads, Bluetooth compatible.',
    tags:['toothbrush','electric','oral-b','dental']}),

  p('Nigerian Shea Butter Body Cream 400ml','NaturaSkin',3800,5500,B,600,4.6,5340,{sold:1560,
    img:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',
    short:'40% raw shea butter moisturiser',
    desc:'Unrefined Nigerian shea, coconut oil, vitamin E & aloe vera. No parabens. Evens & nourishes skin.',
    tags:['shea butter','body cream','skincare','nigerian']}),

  p('Activated Charcoal Face Wash 150ml','GlowLab',4200,6000,B,400,4.4,1980,{sold:567,
    img:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
    short:'Deep-pore charcoal cleanser',
    desc:'Activated bamboo charcoal + tea tree oil. Unclogs pores, removes oil and impurities. All skin types.',
    tags:['face wash','charcoal','cleanser','skincare']}),

  p('Retinol Anti-Aging Night Cream 50ml','GlowLab',18000,26000,B,180,4.7,1560,{isNew:true,sold:345,
    img:'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
    short:'0.3% retinol wrinkle-reducing cream',
    desc:'0.3% retinol, peptide complex, ceramides, hyaluronic acid. Reduces wrinkles & firms skin overnight.',
    tags:['retinol','anti-aging','night cream','skincare']}),

  p('Silk Sleep Bonnet Hair Cap','NatureLocks',2800,4500,B,500,4.5,3670,{free:true,sold:890,
    img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
    short:'100% mulberry silk satin bonnet',
    desc:'Grade 6A mulberry silk lining, wide elastic band, adjustable tie. Prevents breakage & preserves styles.',
    tags:['silk bonnet','hair cap','protective','sleep']}),

  p('Percussion Massage Gun 6-Speed','HealthPro',35000,50000,B,65,4.6,1120,{sold:312,
    img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    short:'Deep tissue percussion massager',
    desc:'6 speeds up to 3200rpm, 6 attachments, 2400mAh (6hrs), quiet <55dB, carry case included.',
    tags:['massage gun','recovery','percussion','health']}),

  p('Sunscreen SPF 50+ Daily Moisturiser 100ml','GlowLab',6500,9500,B,350,4.6,1890,{free:true,sold:678,
    img:'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600',
    short:'SPF 50+ lightweight daily sunscreen',
    desc:'Broad spectrum SPF 50+, PA++++, non-greasy, tinted for all skin tones, hyaluronic acid, no white cast.',
    tags:['sunscreen','spf','skincare','moisturiser']}),

  p('Hair Relaxer No-Lye Kit','NatureLocks',4800,7000,B,280,4.3,1230,{sold:456,
    img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
    short:'Gentle no-lye relaxer kit with conditioner',
    desc:'Calcium hydroxide formula, odour-neutralising, includes activator, base cream, neutralising shampoo.',
    tags:['relaxer','hair','no-lye','treatment']}),

  p('Jade Gua Sha & Roller Set','GlowLab',5500,8000,B,220,4.7,2340,{free:true,isNew:true,sold:567,
    img:'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600',
    short:'100% natural jade gua sha facial tool',
    desc:'Real jade stone, double-sided gua sha + roller. Reduces puffiness, boosts circulation, tightens pores.',
    tags:['gua sha','jade','facial','skincare','tool']}),

  p('Beard Growth Oil 60ml','HealthPro',3500,5500,B,320,4.5,1670,{sold:456,
    img:'https://images.unsplash.com/photo-1621607505990-9b7f0781e3a7?w=600',
    short:'Natural beard growth and conditioning oil',
    desc:'Castor, argan, jojoba & peppermint blend. Promotes beard growth, reduces itch, softens and conditions.',
    tags:['beard','oil','men grooming','hair growth']}),

  p('Vitamin Gummies 60pc Multivitamin','HealthPro',7800,11000,B,400,4.5,890,{free:true,sold:345,
    img:'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600',
    short:'Adult daily multivitamin gummies',
    desc:'Vitamins A, C, D, E, B-complex, zinc, folic acid. 60 gummies (30-day supply). No artificial dyes.',
    tags:['vitamins','gummies','supplement','health']}),

  p('Face Mask Sheet Pack 10pcs','GlowLab',4200,6500,B,500,4.6,2780,{free:true,sold:890,
    img:'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600',
    short:'Korean hydrating sheet mask set',
    desc:'Hyaluronic acid + collagen + niacinamide. 10 masks in brightening, hydrating & firming variants.',
    tags:['face mask','sheet mask','korean','skincare']}),

  // ════════════════════════════════════════════════
  // SPORTS & FITNESS — 14 products
  // ════════════════════════════════════════════════
  p('Premium Yoga Mat 6mm TPE','FlexFit',12000,18000,S,180,4.6,950,{featured:true,sold:567,
    img:'https://images.unsplash.com/photo-1601925228226-8013e840e2d2?w=600',
    short:'Non-slip eco-friendly yoga mat',
    desc:'6mm TPE, alignment lines, non-slip both sides, carrying strap. Latex-free, recyclable material.',
    tags:['yoga','mat','fitness','non-slip']}),

  p('Adjustable Dumbbells 5-52.5lbs','IronPro',85000,110000,S,25,4.8,670,{isNew:true,sold:189,
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    short:'Replace 15 dumbbells in one set',
    desc:'Dial system, 2.5lb increments, 5 to 52.5lbs per dumbbell. Tray included. 2-year warranty.',
    tags:['dumbbells','weights','adjustable','gym']}),

  p('Resistance Bands Set 5 Levels','FlexFit',5500,8000,S,350,4.5,1890,{free:true,sold:890,
    img:'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600',
    short:'Progressive resistance latex bands',
    desc:'5 bands (10–50lbs), carry bag, door anchor, 2 foam handles, ankle straps included.',
    tags:['resistance bands','workout','home gym','latex']}),

  p('FIFA Quality Pro Football','ProKick',22000,30000,S,80,4.7,540,{sold:234,
    img:'https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=600',
    short:'Match-quality hand-stitched football',
    desc:'FIFA Quality Pro, 32-panel, PU casing, butyl bladder. For grass, turf and indoor play.',
    tags:['football','soccer','ball','sport']}),

  p('Jump Rope Speed Cable Adjustable','FlexFit',4500,7000,S,300,4.5,2130,{free:true,sold:780,
    img:'https://images.unsplash.com/photo-1434596922112-19c563067271?w=600',
    short:'Steel cable speed skipping rope',
    desc:'Adjustable steel cable, 360° ball-bearing handles, counter built-in. Crossfit, boxing, cardio.',
    tags:['jump rope','skipping','cardio','boxing']}),

  p('Waterproof Gym Duffel Bag 45L','IronPro',16000,24000,S,130,4.4,980,{sold:345,
    img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    short:'45L gym bag wet/dry separation',
    desc:'Wet/dry pocket, shoe compartment, laptop sleeve (15"), USB charging port, 600D waterproof polyester.',
    tags:['gym bag','duffel','sports','waterproof']}),

  p('Ab Roller Core Wheel Set','FlexFit',6500,10000,S,200,4.6,1340,{sold:567,
    img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600',
    short:'Core strength ab wheel with knee pad',
    desc:'Dual wheel for stability, non-slip handles, includes knee pad. Targets abs, obliques, back, arms.',
    tags:['ab roller','core','abs','gym']}),

  p('Whey Protein Vanilla 1kg','NutriPro',28000,38000,S,150,4.7,2670,{featured:true,sold:678,
    img:'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
    short:'25g protein per serving, whey isolate',
    desc:'Whey isolate, 25g protein per 32g serving, 5.5g BCAAs, 2g sugar, Madagascar vanilla flavour.',
    tags:['whey protein','supplement','muscle','vanilla']}),

  p('Treadmill Foldable 1-12km/h','IronPro',220000,300000,S,10,4.6,340,{featured:true,sold:78,
    img:'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600',
    short:'Foldable home treadmill 12km/h max',
    desc:'1–12km/h, 12 preset programs, LCD display, 120kg capacity, foldable deck, anti-slip belt.',
    tags:['treadmill','cardio','running','home gym']}),

  p('Foam Roller 45cm Deep Tissue','FlexFit',7500,12000,S,200,4.6,890,{free:true,sold:456,
    img:'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600',
    short:'Deep-tissue muscle recovery roller',
    desc:'45cm, high-density EVA foam, textured surface for trigger point release. Suitable for all fitness levels.',
    tags:['foam roller','recovery','massage','stretching']}),

  p('Sports Water Bottle 1L Insulated','FlexFit',6500,10000,S,300,4.7,1230,{free:true,sold:567,
    img:'https://images.unsplash.com/photo-1574728831938-e0d5bec08cff?w=600',
    short:'1L double-wall vacuum insulated bottle',
    desc:'18/8 stainless, keeps cold 24h / hot 12h, leak-proof lid, wide mouth, 5 colours.',
    tags:['water bottle','insulated','sports','hydration']}),

  p('Kettlebell Cast Iron 16kg','IronPro',18000,26000,S,45,4.7,560,{sold:234,
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    short:'Solid cast iron kettlebell 16kg',
    desc:'Single-piece cast iron, powder-coated, flat base, wide handle. Available 8/12/16/20/24kg.',
    tags:['kettlebell','weights','strength','functional']}),

  p('Pull-Up Bar Doorframe Adjustable','IronPro',12000,18000,S,90,4.5,780,{sold:345,
    img:'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=600',
    short:'No-drill doorframe pull-up bar',
    desc:'Fits doors 62–100cm wide, 180kg capacity, foam grips, multi-grip positions. No screws needed.',
    tags:['pull up bar','home gym','calisthenics','doorframe']}),

  p('Cycling Gloves Padded Half-Finger','ProKick',4200,6500,S,160,4.5,670,{free:true,sold:289,
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    short:'Anti-slip padded cycling gloves',
    desc:'Gel padding, anti-slip silicon, breathable lycra back, hook-and-loop closure. S/M/L/XL.',
    tags:['cycling','gloves','bike','padded']}),

  // ════════════════════════════════════════════════
  // BOOKS & EDUCATION — 10 products
  // ════════════════════════════════════════════════
  p('Atomic Habits — James Clear','Penguin',5500,7500,K,500,4.9,12040,{featured:true,sold:2340,
    img:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    short:'Build good habits, break bad ones',
    desc:'10M+ copies sold. Proven strategies to transform your habits using the 4 Laws of Behaviour Change.',
    tags:['habits','self-help','productivity','bestseller']}),

  p('Rich Dad Poor Dad — Kiyosaki','Plata',4800,6500,K,420,4.7,8760,{sold:1890,
    img:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
    short:'The classic financial education book',
    desc:'Why the rich get richer. Lessons on assets, liabilities, investing and financial independence.',
    tags:['finance','wealth','investing','personal finance']}),

  p('Think and Grow Rich — Napoleon Hill','Tarcher',3800,5500,K,600,4.8,15670,{sold:3450,
    img:'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
    short:'13 principles of success and wealth',
    desc:'100M+ copies since 1937. The 13 proven steps to financial success based on interviews with 500 millionaires.',
    tags:['success','wealth','self-help','classic']}),

  p('Professional Sketching Set 72pc','ArtPro',15000,22000,K,120,4.6,930,{isNew:true,sold:234,
    img:'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    short:'Complete 72-piece artist drawing kit',
    desc:'HB–8B graphite pencils, charcoal, blending stumps, kneadable erasers. Zippered carry case.',
    tags:['sketching','art','drawing','pencils']}),

  p('Casio FX-991EX Scientific Calculator','Casio',12500,16000,K,200,4.8,3420,{featured:true,sold:890,
    img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600',
    short:'552 functions for WAEC, JAMB & uni',
    desc:'552 functions, spreadsheet, QR code, high-resolution natural display. Solar + battery powered.',
    tags:['calculator','casio','education','exam']}),

  p('Moleskine Classic Hardcover Notebook A5','Moleskine',7500,11000,K,300,4.7,2340,{free:true,sold:678,
    img:'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
    short:'A5 ruled hardcover with ribbon bookmark',
    desc:'240 acid-free ivory pages, ribbon bookmark, elastic closure, expandable back pocket. Classic black.',
    tags:['notebook','journal','stationery','moleskine']}),

  p('The Psychology of Money — Morgan Housel','Harriman',5200,7500,K,380,4.8,6780,{sold:1560,
    img:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    short:'How people think about money',
    desc:'19 short stories on the strange ways people think about money. How to make better financial decisions.',
    tags:['finance','psychology','money','investing']}),

  p('Watercolour Paint Set 48 Colours','ArtPro',12000,18000,K,90,4.6,560,{isNew:true,sold:189,
    img:'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    short:'Professional 48-colour watercolour set',
    desc:'48 vivid pigments, 3 brushes, palette tray, masking fluid. Highly pigmented, fade resistant.',
    tags:['watercolour','paint','art','creative']}),

  p('Oxford English Dictionary Hardback','Oxford',22000,30000,K,60,4.9,1230,{sold:345,
    img:'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600',
    short:'Complete Oxford English Dictionary 2024',
    desc:'600,000+ words, 3M+ quotations, etymologies, pronunciations. The definitive English language reference.',
    tags:['dictionary','oxford','reference','english']}),

  p('Graphic Tablet Wacom Intuus S','Wacom',65000,85000,K,40,4.7,560,{isNew:true,sold:134,
    img:'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600',
    short:'Small creative drawing tablet pen',
    desc:'4096 pressure levels, 2540 lpi, 4 express keys, works with Photoshop, Illustrator, Clip Studio.',
    tags:['drawing tablet','wacom','digital art','design']}),

  // ════════════════════════════════════════════════
  // FOOD & GROCERY — 12 products
  // ════════════════════════════════════════════════
  p('Raw Organic Nigerian Honey 500g','NaturaBee',3500,5000,G,600,4.8,4230,{featured:true,sold:1230,
    img:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
    short:'100% pure unfiltered forest honey',
    desc:'Unprocessed raw honey from Nigerian forests. Rich in antioxidants, enzymes. No additives or heating.',
    tags:['honey','organic','raw','natural']}),

  p('Ethiopian Arabica Ground Coffee 250g','BrewMaster',4200,5800,G,400,4.7,2150,{sold:678,
    img:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600',
    short:'Single-origin medium-roast coffee',
    desc:'Washed Arabica, Yirgacheffe. Tasting notes: chocolate, berry, citrus. Medium grind for drip/pour-over.',
    tags:['coffee','arabica','single origin','ethiopian']}),

  p('Premium Mixed Nuts & Fruits 1kg','NutriSnack',8000,11000,G,250,4.6,1780,{free:true,isNew:true,sold:456,
    img:'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=600',
    short:'Cashews, almonds, walnuts & more',
    desc:'Cashews, almonds, walnuts, pistachios, raisins, cranberries. Unsalted, no sugar. High protein snack.',
    tags:['nuts','snack','healthy','mixed nuts']}),

  p('Zobo Hibiscus Drink Concentrate 1L','ZoboKing',2800,4000,G,800,4.5,3120,{sold:890,
    img:'https://images.unsplash.com/photo-1622597467836-f3e4b5df3bdb?w=600',
    short:'Premium Nigerian hibiscus concentrate',
    desc:'Dried Roselle flowers, cloves, ginger, cinnamon. Dilute 1:3. Rich in Vitamin C. No preservatives.',
    tags:['zobo','hibiscus','nigerian','drink']}),

  p('Extra Virgin Olive Oil 1L','OlioGold',5500,7800,G,350,4.7,1890,{sold:567,
    img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600',
    short:'Cold-pressed Spanish extra virgin',
    desc:'First cold-pressed, <0.3% acidity, Andalusia Spain. Rich polyphenols. Dark glass bottle preserves quality.',
    tags:['olive oil','cold pressed','cooking','healthy']}),

  p('Oat Granola Cereal 500g','NutriSnack',3200,4800,G,450,4.6,1430,{free:true,sold:456,
    img:'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=600',
    short:'Crunchy honey-baked oat granola',
    desc:'Rolled oats, honey, almonds, dried cranberries, raisins. Baked not fried. No artificial flavours.',
    tags:['granola','cereal','breakfast','oats']}),

  p('Turmeric Golden Milk Powder 200g','NaturaBee',2500,3800,G,500,4.5,2340,{free:true,isNew:true,sold:345,
    img:'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600',
    short:'Organic turmeric latte powder blend',
    desc:'Turmeric, black pepper, ginger, cinnamon, cardamom. Anti-inflammatory. Add to warm milk or smoothie.',
    tags:['turmeric','golden milk','anti-inflammatory','superfood']}),

  p('Peanut Butter Smooth 500g','NutriSnack',3200,4800,G,400,4.6,1780,{free:true,sold:567,
    img:'https://images.unsplash.com/photo-1575535468508-f1af58c88a78?w=600',
    short:'100% natural peanut butter no sugar',
    desc:'100% roasted peanuts, no added sugar, no palm oil, no preservatives. High protein, smooth spreadable.',
    tags:['peanut butter','natural','protein','snack']}),

  p('Moringa Leaf Powder 200g','NaturaBee',2200,3500,G,550,4.7,1230,{free:true,sold:456,
    img:'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600',
    short:'Organic Nigerian moringa superfood',
    desc:'Dried and ground moringa oleifera leaves. 7x vitamin C of oranges, 4x calcium of milk. NAFDAC certified.',
    tags:['moringa','superfood','organic','nigerian']}),

  p('Coconut Oil Virgin Unrefined 500ml','NaturaBee',3800,5500,G,380,4.7,2340,{sold:678,
    img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600',
    short:'Cold-pressed virgin coconut oil',
    desc:'Cold-pressed, unrefined virgin coconut oil. For cooking, baking, hair and skin. Certified organic.',
    tags:['coconut oil','virgin','organic','cooking','hair']}),

  p('Tiger Nuts (Ofio) 500g','ZoboKing',1800,2800,G,700,4.5,890,{free:true,sold:345,
    img:'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=600',
    short:'Nigerian tiger nuts for kunun aya',
    desc:'Sun-dried tiger nuts (ofio). Rich in fibre, potassium & magnesium. For kunun aya drink or eating raw.',
    tags:['tiger nuts','ofio','nigerian','healthy snack']}),

  p('Agbalumo African Star Apple Jam 350g','ZoboKing',2500,3800,G,300,4.6,670,{isNew:true,free:true,sold:234,
    img:'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=600',
    short:'Nigerian agbalumo fruit jam spread',
    desc:'Made from fresh agbalumo (African star apple), natural sugar, no artificial colouring or preservatives.',
    tags:['jam','agbalumo','nigerian','fruit','spread']}),

  // ════════════════════════════════════════════════
  // TOYS & KIDS — 12 products
  // ════════════════════════════════════════════════
  p('LEGO Classic Creative Brick Box 484pcs','LEGO',28000,38000,T,75,4.9,2870,{featured:true,sold:890,
    img:'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600',
    short:'484 bricks in 33 colours ages 4+',
    desc:'LEGO Classic 10698. Includes building ideas booklet. Develops creativity and spatial thinking.',
    tags:['lego','bricks','creative','ages 4']}),

  p('Kids Bicycle 20" Ages 6-10','KidsCycle',42000,58000,T,40,4.7,1340,{isNew:true,sold:312,
    img:'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600',
    short:'Sturdy bike with removable training wheels',
    desc:'Steel frame, removable training wheels, adjustable seat 51–61cm, front/rear caliper brakes, basket.',
    tags:['bicycle','kids','bike','training wheels']}),

  p('Montessori Wooden Puzzle Set 6pcs','MindSpark',8500,12000,T,160,4.8,2010,{free:true,sold:567,
    img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600',
    short:'Educational wooden puzzles ages 2-6',
    desc:'6 puzzles: alphabet, numbers, shapes, animals, vehicles, fruits. Natural wood, non-toxic paint.',
    tags:['puzzle','montessori','wooden','educational']}),

  p('4WD RC Car 1:16 Scale 30km/h','TurboKids',18500,25000,T,90,4.6,1560,{isNew:true,sold:456,
    img:'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600',
    short:'Off-road RC car rechargeable battery',
    desc:'4WD, 2.4GHz remote, shock absorbers, 30km/h, 40min play, USB rechargeable. Ages 8+.',
    tags:['rc car','remote control','toy','racing']}),

  p('Play-Doh Mega Fun Tub 36 Colours','Play-Doh',12000,16000,T,200,4.8,3120,{free:true,sold:890,
    img:'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600',
    short:'36 cans of non-toxic modelling clay',
    desc:'36 × 28g cans, non-toxic, gluten-free, wheat-free. Develops fine motor skills. Ages 3+.',
    tags:['play-doh','clay','modelling','creative']}),

  p('Kids Learning Tablet 7"','MindSpark',32000,45000,T,55,4.6,890,{isNew:true,sold:234,
    img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
    short:'Kid-safe educational tablet parental controls',
    desc:'7" IPS, 2GB/32GB, 200+ learning apps, parental dashboard, shockproof case, 8hr battery. Ages 3-12.',
    tags:['tablet','kids','educational','learning']}),

  p('Giant Ludo & Snakes 2-in-1 Board Game','GameBox',7500,11000,T,220,4.7,2450,{free:true,sold:678,
    img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    short:'Classic family board game 2-6 players',
    desc:'Giant 60x60cm foldable board, oversized tokens, 2-6 players, ages 5+. Great family game night.',
    tags:['board game','ludo','family','snakes and ladders']}),

  p('Baby Walker Activity Centre','MindSpark',22000,32000,T,45,4.7,780,{isNew:true,sold:234,
    img:'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600',
    short:'3-in-1 baby walker with activity tray',
    desc:'Walker, seated-play & push-along modes. Activity tray with music & lights, height adjustable, 6-18mo.',
    tags:['baby walker','infant','activity','development']}),

  p('Toy Kitchen Playset 25pcs','TurboKids',15000,22000,T,65,4.8,1120,{sold:345,
    img:'https://images.unsplash.com/photo-1545590046-6b7b58cf5f7e?w=600',
    short:'Realistic toy kitchen with accessories',
    desc:'Wooden kitchen set, stove, oven, sink. 25 accessories: pots, pans, utensils, food items. Ages 3+.',
    tags:['kitchen','toy','play','cooking','wooden']}),

  p('Stuffed Animal Plush Elephant 50cm','GameBox',8000,12000,T,150,4.8,1780,{free:true,sold:567,
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    short:'Super soft giant elephant plush toy',
    desc:'50cm, ultra-soft PP cotton fill, machine washable, safe for all ages, non-toxic materials.',
    tags:['plush','stuffed animal','elephant','soft toy']}),

  p('Crayola Crayon & Marker Set 150pc','Crayola',9500,14000,T,180,4.9,2340,{free:true,sold:780,
    img:'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    short:'Crayons, markers & coloured pencils',
    desc:'Crayola set: 64 crayons + 50 markers + 36 pencils. Non-toxic. Ages 3+. Storage case included.',
    tags:['crayola','crayons','markers','art','kids']}),

  p('Trampoline Mini Indoor 36"','TurboKids',38000,55000,T,28,4.6,560,{isNew:true,sold:134,
    img:'https://images.unsplash.com/photo-1576800771042-9e4a9d77ff43?w=600',
    short:'36" indoor mini trampoline with handle',
    desc:'36" mat, safety foam pad, balance handle bar, 150kg capacity, folds flat for storage. Ages 3+.',
    tags:['trampoline','indoor','kids','exercise','jumping']}),
  ];
};

/* ── Coupons ─────────────────────────────────────────────────────── */
const COUPONS = [
  { code: 'WELCOME10', description: '10% off your first order', type: 'percentage', value: 10, minOrderAmount: 5000,  expiresAt: new Date(Date.now() + 365 * 86400000) },
  { code: 'HABI500',   description: '₦500 off orders over ₦3k',  type: 'fixed',      value: 500, minOrderAmount: 3000, usageLimit: 100, expiresAt: new Date(Date.now() + 90 * 86400000) },
  { code: 'SAVE20',    description: '20% off over ₦50k (max ₦20k)', type: 'percentage', value: 20, minOrderAmount: 50000, maxDiscount: 20000, expiresAt: new Date(Date.now() + 60 * 86400000) },
  { code: 'FREESHIP',  description: 'Free shipping on any order', type: 'fixed',      value: 1500, minOrderAmount: 0, expiresAt: new Date(Date.now() + 30 * 86400000) },
  { code: 'FLASH15',   description: '15% flash sale discount',   type: 'percentage', value: 15, minOrderAmount: 10000, maxDiscount: 15000, usageLimit: 50, expiresAt: new Date(Date.now() + 7 * 86400000) },
];

/* ── Main ────────────────────────────────────────────────────────── */
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('\n📦 MongoDB connected:', MONGO_URI);

    // Clear all
    console.log('🗑️  Clearing collections…');
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Coupon.deleteMany()]);

    // Users
    console.log('👤 Creating users…');
    await User.create({ name: 'Admin HabiShop', email: 'admin@habishop.com', password: 'Admin@123', role: 'admin', phone: '+2348000000000' });
    await User.create({ name: 'Test User',       email: 'user@habishop.com',  password: 'User@123',  role: 'user',  phone: '+2348011111111' });
    console.log('   ✅ 2 users created');

    // Categories
    console.log('🗂️  Creating categories…');
    const cats = await Category.insertMany(CATEGORIES);
    const cm = {};
    cats.forEach((c) => { cm[c.name] = c._id; });
    console.log(`   ✅ ${cats.length} categories`);

    // Products (one-by-one so pre-save hook runs → unique slugs)
    const defs = getProducts(cm);
    console.log(`\n📦 Creating ${defs.length} products one by one…`);
    const created = [];

    for (let i = 0; i < defs.length; i++) {
      try {
        const prod = await Product.create(defs[i]);
        created.push(prod);
        const pct  = Math.round(((i + 1) / defs.length) * 20);
        const bar  = '█'.repeat(pct) + '░'.repeat(20 - pct);
        process.stdout.write(`\r   [${bar}] ${i + 1}/${defs.length}  ${prod.name.slice(0, 45).padEnd(45)}`);
      } catch (e) {
        console.error(`\n   ❌ FAILED: ${defs[i].name} — ${e.message}`);
      }
    }

    // Coupons
    console.log(`\n🎟️  Creating coupons…`);
    await Coupon.insertMany(COUPONS);
    console.log(`   ✅ ${COUPONS.length} coupons`);

    // Summary
    const byCategory = {};
    created.forEach((prod) => {
      const catId = prod.category.toString();
      byCategory[catId] = (byCategory[catId] || 0) + 1;
    });

    console.log('\n══════════════════════════════════════════════════');
    console.log('  ✅  HabiShop database seeded successfully!');
    console.log('══════════════════════════════════════════════════');
    console.log('  Admin  →  admin@habishop.com / Admin@123');
    console.log('  User   →  user@habishop.com  / User@123');
    console.log('  Codes  →  WELCOME10 · HABI500 · SAVE20 · FREESHIP · FLASH15');
    console.log(`\n  📊 Breakdown:`);
    cats.forEach((c) => {
      const count = byCategory[c._id.toString()] || 0;
      console.log(`     ${c.icon}  ${c.name.padEnd(20)} ${count} products`);
    });
    console.log(`\n  Total: ${cats.length} categories · ${created.length} products · ${COUPONS.length} coupons`);
    console.log('══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (e) {
    console.error('\n❌ Seed error:', e);
    process.exit(1);
  }
}

seed();
