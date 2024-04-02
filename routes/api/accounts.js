const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const cookieParser = require("cookie-parser");
const Accounts = require("../../models/accounts");

router.get("/registers", async (req, res) => {
  try {
    const items = await Accounts.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/logins", async (req, res) => {
  try {
    const items = await Accounts.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/registers", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are mandatory!" });
  }
  const emailAvailable = await Accounts.findOne({ email });
  if (emailAvailable) {
    return res.status(400).json({ error: "Email already registered!" });
  }

  const userAvailable = await Accounts.findOne({ username });
  if (userAvailable) {
    return res.status(400).json({ error: "Username already registered!" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);

    // Create user
    const user = await Accounts.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log(`User created ${user}`);

    // Send success response
    res.status(201).json({ _id: user.id, email: user.email });
  } catch (error) {
    // Send error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//login
router.post("/logins", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are mandatory!" });
  }

  const user = await Accounts.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "10s" }
    );
    res.status(200).json({ accessToken });
  } else {
    return res.status(401).json({ error: "Email or Password is not valid" });
  }
});

//validateToken
const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (authHeader && authHeader.startsWith("Bearer")) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "User is not authorized" });
      }
      console.log(decoded);
      next(); // Lanjutkan ke middleware atau handler berikutnya setelah verifikasi token
    });
  } else {
    res.status(401).json({ error: "Unauthorized: No token provided" });
  }
});

const current = asyncHandler(async (req, res) => {
  res.json({ message: "Current user information" });
});

router.get("/currents", validateToken, current);

module.exports = router;
