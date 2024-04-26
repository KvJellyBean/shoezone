// accounts.js

const express = require("express");
const router = express.Router();
const Account = require("../../models/accounts");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/profiles");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

// cookie
router.use(cookieParser());

// expire time for cookies/jwt
const maxAge = 60 * 60 * 24 * 24;

// creat token (JWT)
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// Error handler
const handleErrors = (err) => {
  let errors = { username: "", email: "", password: "" };

  // Login handler
  // Incorrect Email
  if (err.message === "Incorrect email") {
    errors.email = "The email is not registered";
  }

  // Incorrect Password
  if (err.message === "Incorrect password") {
    errors.password = "The password is incorrect";
  }

  // Sign up handler
  // Duplicate data error
  if (err.code === 11000) {
    if (err.message.includes("username")) {
      errors.username = "Username already exists";
    }
    if (err.message.includes("email")) {
      errors.email = "Email address already exists";
    }
    return errors;
  }

  // Validation errors
  if (err.message.includes("account validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// Get account page
router.get("/account", (req, res) => {
  res.render("account", { layout: "account" });
});

// Get login
router.get("/login", (req, res) => {
  res.render("login", { title: "Login", layout: "login" });
});

// Get sign up
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up", layout: "signup" });
});

// Get logout
router.get("/logout", (req, res) => {
  res.cookie("shoezone_cookie", "", { maxAge: 1 });
  res.redirect("/");
});

// Post signup
router.post("/signup", async (req, res) => {
  try {
    const newAccount = new Account(req.body);
    const savedAccount = await newAccount.save();

    if (!savedAccount) {
      res.status(500).json({ message: "Internal Server Error" });
    }

    const token = createToken(savedAccount._id);
    res.cookie("shoezone_cookie", token, { maxAge: maxAge * 100 });

    res.status(200).json(savedAccount);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
});

// Post login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Account.login(email, password);
    const token = createToken(user._id);
    res.cookie("shoezone_cookie", token, { maxAge: maxAge * 100 });
    res.status(200).json(user);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
});

router.get("/api/account", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get account by id
router.get("/api/account/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account Not Found" });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update account by id
router.put("/api/account/:userId", async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error while uploading file
        return res.status(500).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }

      // Fetch account from database by id
      let account = await Account.findById(req.params.userId);
      if (!account) {
        return res.status(404).json({ message: "Account Not Found" });
      }

      // Update account data based on request body
      account.username = req.body.username;
      account.phone = req.body.phone;
      account.address = req.body.address;

      // Check if a new image is uploaded
      if (req.file) {
        // Mendapatkan nama file lama
        const oldImageName = account.image.split("/").pop();

        // Jika nama file lama bukan "profile.png", maka hapus file lama
        if (oldImageName !== "profile.png") {
          fs.unlink(`public/assets/profiles/${oldImageName}`, (err) => {
            if (err) {
              console.error("Error deleting old image file:", err);
              return res
                .status(500)
                .json({ message: "Error deleting old image file" });
            }
          });
        }

        // Mengganti image dengan file baru
        account.image = "./assets/profiles/" + req.file.filename;
      }

      // Save the updated account to the database
      const updatedAccount = await account.save();

      res.status(200).json(updatedAccount);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
