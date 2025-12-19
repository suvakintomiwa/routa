const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getPendingOrders,
  getDriverOrders,
  acceptOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController.js");
const { protect, authorize } = require("../middleware/authMiddleware");

// Customer routes
router.post("/", protect, authorize("CUSTOMER"), createOrder);
router.get("/my-orders", protect, authorize("CUSTOMER"), getMyOrders);
router.patch("/:id/cancel", protect, authorize("CUSTOMER"), cancelOrder);

// Driver routes
router.get("/pending", protect, authorize("DRIVER"), getPendingOrders);
router.get("/driver-orders", protect, authorize("DRIVER"), getDriverOrders);
router.patch("/:id/accept", protect, authorize("DRIVER"), acceptOrder);
router.patch("/:id/status", protect, authorize("DRIVER"), updateOrderStatus);

// Shared routes
router.get("/:id", protect, getOrder);

module.exports = router;

