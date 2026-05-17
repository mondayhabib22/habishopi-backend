// wishlistController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name thumbnail price comparePrice rating numReviews slug isActive');
  res.json({ success: true, wishlist: user.wishlist.filter((p) => p.isActive) });
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;
  const idx = user.wishlist.indexOf(productId);
  let action;
  if (idx === -1) { user.wishlist.push(productId); action = 'added'; }
  else { user.wishlist.splice(idx, 1); action = 'removed'; }
  await user.save();
  res.json({ success: true, action, wishlist: user.wishlist });
});

module.exports = { getWishlist, toggleWishlist };
