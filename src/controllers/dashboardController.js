const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders, monthOrders, lastMonthOrders,
    totalRevenue, monthRevenue, lastMonthRevenue,
    totalUsers, monthUsers,
    totalProducts, lowStockProducts,
    pendingOrders, recentOrders,
    topProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
    Order.countDocuments({ status: 'pending' }),
    Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, soldCount: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
    ]),
  ]);

  // Monthly revenue chart (last 6 months)
  const revenueChart = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      monthOrders,
      orderGrowth: lastMonthOrders ? ((monthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1) : 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      revenueGrowth: lastMonthRevenue[0]?.total ? (((monthRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(1) : 0,
      totalUsers, monthUsers, totalProducts, lowStockProducts, pendingOrders,
    },
    recentOrders,
    topProducts,
    revenueChart,
    ordersByStatus,
  });
});

module.exports = { getDashboard };
