const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products (with filters, search, pagination)
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, brand, minPrice, maxPrice, rating, sort, page = 1, limit = 12, featured, newArrival, freeShipping } = req.query;

  const query = { isActive: true };

  if (category) query.category = category;
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (minPrice || maxPrice) { query.price = {}; if (minPrice) query.price.$gte = Number(minPrice); if (maxPrice) query.price.$lte = Number(maxPrice); }
  if (rating) query.rating = { $gte: Number(rating) };
  if (featured === 'true') query.isFeatured = true;
  if (newArrival === 'true') query.isNew = true;
  if (freeShipping === 'true') query.freeShipping = true;

  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, price_asc: { price: 1 }, price_desc: { price: -1 }, rating: { rating: -1 }, popular: { soldCount: -1, rating: -1 } };
  const sortBy = sortMap[sort] || { createdAt: -1 };
  const skip = (Number(page) - 1) * Number(limit);

  // keyword: try text index first, fall back to regex
  if (keyword) {
    try {
      const testQ = { ...query, $text: { $search: keyword } };
      const count = await Product.countDocuments(testQ);
      if (count >= 0) query.$text = { $search: keyword };
    } catch (_) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } },
      ];
    }
  }

  let total, products;
  try {
    total = await Product.countDocuments(query);
    products = await Product.find(query)
      .populate('category', 'name slug icon')
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');
  } catch (_) {
    // text index fallback
    delete query.$text;
    if (keyword) query.$or = [{ name: { $regex: keyword, $options: 'i' } }, { brand: { $regex: keyword, $options: 'i' } }];
    total = await Product.countDocuments(query);
    products = await Product.find(query).populate('category', 'name slug icon').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-__v');
  }

  res.json({ success: true, products, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1, total });
});

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.id;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const product = await Product.findOne(isObjectId ? { _id: idOrSlug, isActive: true } : { slug: idOrSlug, isActive: true }).populate('category', 'name slug icon');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @desc    Get related products
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  const related = await Product.find({ category: product.category, _id: { $ne: product._id }, isActive: true }).limit(8).select('name thumbnail price comparePrice rating numReviews slug brand');
  res.json({ success: true, products: related });
});

// Admin CRUD
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

// Featured — fallback to top-rated
const getFeaturedProducts = asyncHandler(async (req, res) => {
  let products = await Product.find({ isFeatured: true, isActive: true }).limit(12).populate('category', 'name slug icon').select('-__v');
  if (products.length === 0) products = await Product.find({ isActive: true }).sort({ rating: -1, numReviews: -1 }).limit(12).populate('category', 'name slug icon').select('-__v');
  res.json({ success: true, products });
});

// New Arrivals — fallback to newest
const getNewArrivals = asyncHandler(async (req, res) => {
  let products = await Product.find({ isNew: true, isActive: true }).sort({ createdAt: -1 }).limit(12).populate('category', 'name slug icon').select('-__v');
  if (products.length === 0) products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(12).populate('category', 'name slug icon').select('-__v');
  res.json({ success: true, products });
});

// Best Sellers — fallback to highest rated
const getBestSellers = asyncHandler(async (req, res) => {
  let products = await Product.find({ isActive: true, soldCount: { $gt: 0 } }).sort({ soldCount: -1 }).limit(12).populate('category', 'name slug icon').select('-__v');
  if (products.length === 0) products = await Product.find({ isActive: true }).sort({ rating: -1, numReviews: -1 }).limit(12).populate('category', 'name slug icon').select('-__v');
  res.json({ success: true, products });
});

module.exports = { getProducts, getProduct, getRelatedProducts, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getNewArrivals, getBestSellers };
