const { Router } = require("express");
const router = Router();
const Products = require("../../models/products");

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
    const newProducts = new Products(req.body);
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
router.delete("/:id", async (req, res) => {
  try {
    const deletedProducts = await Products.findByIdAndDelete(req.params.id);
    if (!deletedProducts) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json("Delete successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
