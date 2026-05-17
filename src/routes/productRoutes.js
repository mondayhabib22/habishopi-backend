const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, getRelatedProducts,
  createProduct, updateProduct, deleteProduct,
  getFeaturedProducts, getNewArrivals, getBestSellers,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/', getProducts);
router.post('/', protect, admin, createProduct);
router.get('/:id', getProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.get('/:id/related', getRelatedProducts);

module.exports = router;
