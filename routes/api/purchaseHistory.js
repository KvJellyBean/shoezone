const { Router } = require("express");
const router = Router();
const PurchaseHistory = require("../../models/purchaseHistory");

// Method Get
router.get("/", async (req, res) => {
  try {
    const items = await PurchaseHistory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Post
router.post("/", async (req, res) => {
  try {
    const newProducts = new PurchaseHistory(req.body);
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
    const updatedProducts = await PurchaseHistory.findByIdAndUpdate(
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
    await PurchaseHistory.deleteMany({});
    res.status(200).json("Purchase history cleared successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
