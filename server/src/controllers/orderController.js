const prisma = require("../config/db");
const {
  emitToUser,
  emitToDrivers,
  emitToOrder,
} = require("../config/socket.js");

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      pickupLat,
      pickupLng,
      pickupContact,
      dropoffAddress,
      dropoffLat,
      dropoffLng,
      dropoffContact,
      packageDesc,
      packageWeight,
    } = req.body;

    const customerId = req.user.userId;

    const distance = calculateDistance(
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
    );

    const basePrice = 500;
    const pricePerKm = 100;
    const price = basePrice + distance * pricePerKm;

    const order = await prisma.order.create({
      data: {
        customerId,
        pickupAddress,
        pickupLat,
        pickupLng,
        pickupContact,
        dropoffAddress,
        dropoffLat,
        dropoffLng,
        dropoffContact,
        packageDesc,
        packageWeight,
        distance,
        price,
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    // Notify all online drivers
    emitToDrivers("order:new", order);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all orders for customer
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        driver: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        driver: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
        tracking: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get pending orders for drivers
// @route   GET /api/orders/pending
const getPendingOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "PENDING" },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get driver's orders
// @route   GET /api/orders/driver-orders
const getDriverOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const driver = await prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    const orders = await prisma.order.findMany({
      where: { driverId: driver.id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Accept order (driver)
// @route   PATCH /api/orders/:id/accept
const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const driver = await prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    if (!driver.isApproved) {
      return res.status(403).json({ message: "Driver not approved yet" });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({ message: "Order is no longer available" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        driverId: driver.id,
        status: "ACCEPTED",
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        driver: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // Notify customer
    emitToUser(order.customerId, "order:accepted", {
      orderId: id,
      driver: updatedOrder.driver,
    });

    // Remove from available orders for other drivers
    emitToDrivers("order:taken", { orderId: id });

    res.json({
      message: "Order accepted successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const driver = await prisma.driver.findUnique({
      where: { userId },
    });

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.driverId !== driver.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updateData = { status };

    if (status === "PICKED_UP") {
      updateData.pickedUpAt = new Date();
    } else if (status === "DELIVERED") {
      updateData.deliveredAt = new Date();

      await prisma.driver.update({
        where: { id: driver.id },
        data: {
          totalDeliveries: { increment: 1 },
        },
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    // Notify customer of status change
    emitToUser(order.customerId, "order:status", {
      orderId: id,
      status,
    });

    // Emit to order room
    emitToOrder(id, "order:status", {
      orderId: id,
      status,
    });

    res.json({
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customerId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!["PENDING", "ACCEPTED"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Cannot cancel order at this stage" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Notify driver if assigned
    if (order.driverId) {
      const driver = await prisma.driver.findUnique({
        where: { id: order.driverId },
      });
      if (driver) {
        emitToUser(driver.userId, "order:cancelled", { orderId: id });
      }
    }

    res.json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper functions
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getPendingOrders,
  getDriverOrders,
  acceptOrder,
  updateOrderStatus,
  cancelOrder,
};

