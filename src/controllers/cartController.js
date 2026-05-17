const asyncHandler = require('express-async-handler');
const { Cart } = require('../models/Cart');
const Product = require('../models/Product');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name thumbnail price stock isActive');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  // Filter out inactive products
  cart.items = cart.items.filter((i) => i.product && i.product.isActive);
  res.json({ success: true, cart });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant = '' } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) { res.status(404); throw new Error('Product not found'); }
  if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existingIdx = cart.items.findIndex(
    (i) => i.product.toString() === productId && i.variant === variant
  );

  if (existingIdx > -1) {
    const newQty = cart.items[existingIdx].quantity + quantity;
    if (product.stock < newQty) { res.status(400); throw new Error('Insufficient stock'); }
    cart.items[existingIdx].quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity, variant, price: product.price });
  }

  await cart.save();
  await cart.populate('items.product', 'name thumbnail price stock');
  res.json({ success: true, cart });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) { res.status(404); throw new Error('Item not in cart'); }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    const product = await Product.findById(req.params.productId);
    if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name thumbnail price stock');
  res.json({ success: true, cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json({ success: true, cart });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
