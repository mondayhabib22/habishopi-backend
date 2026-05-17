const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema({
  name: String, // e.g., "Size", "Color"
  value: String, // e.g., "XL", "Red"
  price: Number,
  stock: { type: Number, default: 0 },
  sku: String,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name required'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: [true, 'Description required'] },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: [true, 'Price required'], min: 0 },
  comparePrice: { type: Number, default: 0 }, // original price before discount
  costPrice: { type: Number, default: 0 }, // for admin profit tracking
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  thumbnail: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, unique: true, sparse: true },
  barcode: { type: String, default: '' },
  weight: { type: Number, default: 0 }, // in grams
  dimensions: {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  variants: [variantSchema],
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isNew: { type: Boolean, default: false },
  freeShipping: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
}, { timestamps: true, toJSON: { virtuals: true } });

// Virtual: discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// pre-save: for single document .save() calls
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  next();
});

// Static helper used by seeder for insertMany (bypasses pre-save hooks)
productSchema.statics.prepareForInsert = function(doc) {
  const slug = slugify(doc.name, { lower: true, strict: true }) + '-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  return {
    ...doc,
    slug,
    thumbnail: doc.thumbnail || (doc.images && doc.images[0]) || '',
  };
};

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, rating: -1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);
