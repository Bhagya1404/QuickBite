const Cart = require("../models/Cart");
const Food = require("../models/Food");

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    const userId = req.user._id;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const existingItem = await Cart.findOne({
      user: userId,
      food: foodId,
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart Updated",
        cart: existingItem,
      });
    }

    const cart = await Cart.create({
      user: userId,
      food: foodId,
      quantity: quantity || 1,
    });

    res.status(201).json({
      success: true,
      message: "Item Added To Cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user._id,
    }).populate("food");

    res.status(200).json({
      success: true,
      count: cart.length,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Quantity
const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Item Not Found",
      });
    }

    cart.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity Updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Item
const removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item Removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
};