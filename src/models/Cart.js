const mongoose = require('mongoose');

// ── Cart ──────────────────────────────────────────────────────────────
const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  variant: { type: String, default: '' },
  price: { type: Number, required: true }, // price at time of adding
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
}, { timestamps: true });

cartSchema.virtual('itemsTotal').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Cart };
