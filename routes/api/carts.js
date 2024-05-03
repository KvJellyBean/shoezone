// Import necessary modules.
const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const Carts = require("../../models/carts");

// Route to get all items in carts.
router.get("/", async (req, res) => {
  try {
    const items = await Carts.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get items in cart by userId.
router.get("/:userId", async (req, res) => {
  try {
    const items = await Carts.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new item to cart.
router.post("/", async (req, res) => {
  try {
    const newCart = new Carts(req.body);
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update an item in cart by ID.
router.put("/:id", async (req, res) => {
  try {
    const updatedProducts = await Carts.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProducts) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update quantity of a product in cart based on userId and productId.
router.put("/:userId/:productId", async (req, res) => {
  try {
    const updatedCart = await Carts.findOneAndUpdate(
      { userId: req.params.userId, "products._id": req.params.productId },
      { $set: { "products.$.quantity": req.body.quantity } },
      { new: true }
    );
    if (!updatedCart) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete all items in cart by userId.
router.delete("/:userId", async (req, res) => {
  try {
    const updatedCart = await Carts.findOneAndUpdate(
      { userId: req.params.userId },
      { products: [] },
      { new: true }
    );
    if (!updatedCart) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a specific item from cart by userId and productId.
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const updatedCart = await Carts.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { products: { _id: req.params.productId } } },
      { new: true }
    );
    if (!updatedCart) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
