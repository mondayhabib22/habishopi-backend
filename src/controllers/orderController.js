const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { Cart } = require('../models/Cart');

// @desc    Create order
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode, notes } = req.body;

  if (!items || items.length === 0) { res.status(400); throw new Error('No order items'); }

  // Validate products & stock
  const orderItems = [];
  let itemsTotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) { res.status(404); throw new Error(`Product not found: ${item.product}`); }
    if (product.stock < item.quantity) {
      res.status(400); throw new Error(`Insufficient stock for ${product.name}`);
    }
    const orderItem = {
      product: product._id,
      name: product.name,
      image: product.thumbnail,
      price: product.price,
      quantity: item.quantity,
      variant: item.variant || '',
    };
    orderItems.push(orderItem);
    itemsTotal += product.price * item.quantity;
  }

  // Apply coupon
  let couponDiscount = 0;
  let couponId = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const validity = coupon.isValid(itemsTotal, req.user._id);
      if (validity.valid) {
        couponDiscount = coupon.calcDiscount(itemsTotal);
        couponId = coupon._id;
      }
    }
  }

  const shippingFee = itemsTotal >= 50000 ? 0 : 1500; // Free shipping over ₦50k
  const tax = 0; // adjust as needed
  const totalAmount = itemsTotal - couponDiscount + shippingFee + tax;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    coupon: couponId,
    couponDiscount,
    itemsTotal,
    shippingFee,
    tax,
    totalAmount,
    notes,
    statusHistory: [{ status: 'pending', note: 'Order placed', updatedBy: req.user._id }],
  });

  // Decrement stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  // Mark coupon as used
  if (couponId) {
    await Coupon.findByIdAndUpdate(couponId, {
      $inc: { usedCount: 1 },
      $push: { usedBy: req.user._id },
    });
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null });

  const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
  res.status(201).json({ success: true, order: populatedOrder });
});

// @desc    Get user orders
// @route   GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt').skip(skip).limit(Number(limit));
  res.json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, order });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'processing';
  order.paymentResult = req.body;
  order.statusHistory.push({ status: 'processing', note: 'Payment confirmed', updatedBy: req.user._id });
  await order.save();
  res.json({ success: true, order });
});

// ── Admin ─────────────────────────────────────────────────────────────

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort('-createdAt').skip(skip).limit(Number(limit));
  res.json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
  order.statusHistory.push({ status, note: note || `Status updated to ${status}`, updatedBy: req.user._id });
  await order.save();
  res.json({ success: true, order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (['shipped', 'delivered'].includes(order.status)) {
    res.status(400); throw new Error('Cannot cancel shipped/delivered order');
  }
  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, soldCount: -item.quantity },
    });
  }
  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', note: req.body.reason || 'Order cancelled', updatedBy: req.user._id });
  await order.save();
  res.json({ success: true, order });
});

module.exports = {
  createOrder, getMyOrders, getOrderById, updateOrderToPaid,
  getAllOrders, updateOrderStatus, cancelOrder,
};
