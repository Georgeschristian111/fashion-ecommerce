const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { createOrderValidator } = require("../utils/cartOrderValidators");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);

router.post("/", createOrderValidator, createOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", restrictTo("ADMIN"), updateOrderStatus);

module.exports = router;
