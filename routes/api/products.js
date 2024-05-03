// Import necessary modules.
const { Router } = require("express");
const router = Router();
const Products = require("../../models/products");
const multer = require("multer");
const fs = require("fs");

// Set up multer storage configuration for file uploads.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/shoes");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// Initialize multer upload middleware.
const upload = multer({ storage: storage }).single("image");

// Route to get all products.
router.get("/", async (req, res) => {
  try {
    const items = await Products.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get product by ID.
router.get("/:id", async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new product with image using multer.
router.post("/", async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error while uploading file
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }

      // Create new object to save product to database
      const newProductData = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        rating: req.body.rating,
        image: "./assets/shoes/" + req.file.filename,
      };

      // Save product to database
      const newProduct = new Products(newProductData);
      const savedProduct = await newProduct.save();

      res.status(200).json(savedProduct);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update product with image using multer.
router.put("/:id", async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error while uploading file
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }

      // Fetch product from database by id
      let product = await Products.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product Not Found" });
      }

      // Update product data based on request body
      product.name = req.body.name;
      product.price = req.body.price;
      product.description = req.body.description;
      product.rating = req.body.rating;

      // Check if a new image is uploaded
      if (req.file) {
        // Delete the old image file
        const oldImageName = product.image.split("/").pop();
        fs.unlink(`public/assets/shoes/${oldImageName}`, (err) => {
          if (err) {
            console.error("Error deleting old image file:", err);
            return res
              .status(500)
              .json({ message: "Error deleting old image file" });
          }
        });

        // Update product image with the new image file
        product.image = "./assets/shoes/" + req.file.filename;
      }

      // Save the updated product to the database
      const updatedProduct = await product.save();

      res.status(200).json(updatedProduct);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete product by ID.
router.delete("/:id", async (req, res) => {
  try {
    // Get the product by ID
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Get the filename of the image associated with the product
    const imageName = product.image.split("/").pop();

    // Delete the image file from the server
    fs.unlink(`public/assets/shoes/${imageName}`, async (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
        return res.status(500).json({ message: "Error deleting image file" });
      }

      // Delete the product from the database after the image file is deleted
      const deletedProduct = await Products.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product Not Found" });
      }

      res.status(200).json("Delete successfully");
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
