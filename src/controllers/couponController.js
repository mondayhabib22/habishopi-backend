const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.body.code?.toUpperCase() });
  if (!coupon) { res.status(404); throw new Error('Invalid coupon code'); }
  const validity = coupon.isValid(req.body.orderAmount || 0, req.user._id);
  if (!validity.valid) { res.status(400); throw new Error(validity.message); }
  const discount = coupon.calcDiscount(req.body.orderAmount || 0);
  res.json({ success: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, discount } });
});

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, coupons });
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }
  res.json({ success: true, coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
