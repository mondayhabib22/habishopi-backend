const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
// Admin
router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
