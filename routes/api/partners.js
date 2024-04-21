const { Router } = require("express");
const router = Router();
const Partners = require("../../models/partners");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/partners");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("logo");

// Method Get
router.get("/", async (req, res) => {
  try {
    const partners = await Partners.find();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Post with image using multer
router.post("/", async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error while uploading file
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }

      // Create new object to save partner to database
      const newPartnerData = {
        name: req.body.name,
        logo: "./assets/partners/" + req.file.filename,
        website: req.body.website,
      };

      const newPartner = new Partners(newPartnerData);
      await newPartner.save();
      res.status(201).json(newPartner);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Put with image using multer
router.put("/:id", async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error while uploading file
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }

      const updatedPartnerData = {
        name: req.body.name,
        logo: "./assets/partners/" + req.file.filename,
        website: req.body.website,
      };

      const updatedPartner = await Partners.findByIdAndUpdate(
        req.params.id,
        updatedPartnerData
      );
      if (!updatedPartner) {
        res.status(404).json({ message: "Not Found" });
      }

      res.status(200).json(updatedPartner);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Method Delete
router.delete("/:id", async (req, res) => {
  try {
    const partner = await Partners.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner Not Found" });
    }

    const logoImage = partner.logo.split("/").pop();

    fs.unlink(`public/assets/partners/${logoImage}`, async (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
        return res.status(500).json({ message: "Error deleting image file" });
      }

      // Hapus produk dari database setelah file gambar dihapus
      const deletedPartner = await Partners.findByIdAndDelete(req.params.id);
      if (!deletedPartner) {
        return res.status(404).json({ message: "Partner Not Found" });
      }

      res.status(200).json("Delete successfully");
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
