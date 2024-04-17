// accounts.js

const express = require("express");
const router = express.Router();
const Account = require("../../models/accounts");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
  res.render("account", { title: "My Account", layout: "account" });
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

router.get("/api/account", async(req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

//update
router.put("/:id", async (req, res) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedAccount) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
