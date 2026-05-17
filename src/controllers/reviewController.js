const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Order = require('../models/Order');

const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Review.countDocuments({ product: req.params.productId, isApproved: true });
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort(sort).skip(skip).limit(Number(limit));

  const stats = await Review.aggregate([
    { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(req.params.productId), isApproved: true } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
  ]);
  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats.forEach((s) => { ratingBreakdown[s._id] = s.count; });

  res.json({ success: true, reviews, total, ratingBreakdown, pages: Math.ceil(total / Number(limit)) });
});

const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.productId;

  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) { res.status(400); throw new Error('You already reviewed this product'); }

  // Check verified purchase
  const order = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    isDelivered: true,
  });

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating, title, comment,
    isVerifiedPurchase: !!order,
  });

  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, review });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  Object.assign(review, req.body);
  await review.save();
  res.json({ success: true, review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  await review.deleteOne();
  await Review.calcAverageRating(review.product);
  res.json({ success: true, message: 'Review deleted' });
});

const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  const idx = review.helpful.indexOf(req.user._id);
  if (idx === -1) review.helpful.push(req.user._id);
  else review.helpful.splice(idx, 1);
  await review.save();
  res.json({ success: true, helpfulCount: review.helpful.length });
});

module.exports = { getProductReviews, createReview, updateReview, deleteReview, markHelpful };
