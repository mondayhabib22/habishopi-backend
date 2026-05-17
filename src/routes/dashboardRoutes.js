// dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getDashboard);

module.exports = router;
