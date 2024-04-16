const { Router } = require("express");
const router = Router();
const PurchaseHistory = require("../../models/purchaseHistory");

// Method Get
router.get("/", async (req, res) => {
  try {
    // Fetch the items, sort them by checkoutTime in descending order and limit to 10 items
    const items = await PurchaseHistory.find()
      .sort({ checkoutTime: -1 })
      .limit(10);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Post
router.post("/", async (req, res) => {
  try {
    const newProduct = new PurchaseHistory({
      ...req.body,
      checkoutTime: new Date(), // Save the current date and time
      ipAddress: req.ip, // Save the user's IP address
    });
    // Check if the purchase history has more than 10 items
    const count = await PurchaseHistory.countDocuments();
    if (count >= 10) {
      // If it has more than 10 items, find the oldest one and delete it
      const oldestItem = await PurchaseHistory.find()
        .sort({ checkoutTime: 1 })
        .limit(1);
      await PurchaseHistory.findByIdAndDelete(oldestItem[0]._id);
    }
    const savedProduct = await newProduct.save();
    if (!savedProduct) {
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(savedProduct);
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

// Method Delete One
router.delete("/:id", async (req, res) => {
  try {
    const product = await PurchaseHistory.findById(req.params.id);
    if (product) {
      await PurchaseHistory.findByIdAndDelete(req.params.id);
      res.status(200).json("Product deleted successfully");
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Delete All
router.delete("/", async (req, res) => {
  try {
    await PurchaseHistory.deleteMany({});
    res.status(200).json("All products deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
