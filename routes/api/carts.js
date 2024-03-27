const { Router } = require("express");
const router = Router();
const Products = require("../../models/carts");

// Method Get
router.get("/", async (req, res) => {
  try {
    const items = await Products.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Post
router.post("/", async (req, res) => {
  try {
    const newProduct = new Products(req.body);
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Put
router.put("/:id", async (req, res) => {
  try {
    const updatedProducts = await Products.findByIdAndUpdate(
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
router.delete("/", async (req, res) => {
  try {
    await Products.deleteMany({});
    res.status(200).json("Cart cleared successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
