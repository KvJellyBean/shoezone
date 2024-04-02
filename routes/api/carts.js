const { Router } = require("express");
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

// Method Post
router.post("/", async (req, res) => {
  try {
    const newProducts = new Carts(req.body);
    const savedProducts = await newProducts.save();
    if (!savedProducts) {
      res.status(500).json({ message: "Internal Server Error" });
    }

    res.status(200).json(savedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Method Delete
router.delete("/:id", async (req, res) => {
  try {
    const product = await Carts.findById(req.params.id);
    if (product) {
      await Carts.findByIdAndDelete(req.params.id);
      res.status(200).json("Product deleted successfully");
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
