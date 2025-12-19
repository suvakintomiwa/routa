const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  getDrivers,
  approveDriver,
  getOrders,
  getOrderDetails,
  deleteUser,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require admin role
router.use(protect);
router.use(authorize('ADMIN'));

// Dashboard
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Drivers
router.get('/drivers', getDrivers);
router.patch('/drivers/:id/approve', approveDriver);

// Orders
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderDetails);

module.exports = router;