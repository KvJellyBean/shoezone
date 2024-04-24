const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const Carts = require("../../models/carts");

// Method Get
router.get("/", async (req, res) => {
  try {
    const items = await Carts.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method get by userId
router.get("/:userId", async (req, res) => {
  try {
    const items = await Carts.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Post
router.post("/", async (req, res) => {
  try {
    const newCart = new Carts(req.body);
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Method Put
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

// Method put untuk mengubah/mengupdate quantity product berdasarkan quantity di req body ke cart berdasarkan userId yang didalamnya terdapat key products yang berisi array of object tiap productnya
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

// Method Delete untuk mengosongkan array products dari user cart by userId, bukan menghapus cart nya
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
