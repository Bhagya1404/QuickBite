const express = require("express");

const {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addToCart);

router.get("/", protect, getCart);

router.patch("/:id", protect, updateQuantity);

router.delete("/:id", protect, removeFromCart);

module.exports = router;