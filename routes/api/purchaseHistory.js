// Import necessary modules.
const { Router } = require("express");
const router = Router();
const PurchaseHistory = require("../../models/purchaseHistory");

// Route to get latest 10 purchase history items.
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

// Route to get purchase history by user ID.
router.get("/:userId", async (req, res) => {
  try {
    const items = await PurchaseHistory.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new purchase history item.
router.post("/", async (req, res) => {
  try {
    const newProduct = new PurchaseHistory(req.body);

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

// Route to add product to purchase history by user ID
router.put("/:userId", async (req, res) => {
  try {
    const updatedPurchaseHistory = await PurchaseHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $push: { products: req.body } },
      { new: true }
    );
    if (!updatedPurchaseHistory) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(updatedPurchaseHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete product from purchase history by user ID and product ID
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const updatedProdutHistory = await PurchaseHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { products: { _id: req.params.productId } } },
      { new: true }
    );
    if (!updatedProdutHistory) {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete all products from purchase history by user ID
router.delete("/:userId", async (req, res) => {
  try {
    const updatedPurchaseHistory = await PurchaseHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { products: [] },
      { new: true }
    );
    if (!updatedPurchaseHistory) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(updatedPurchaseHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
