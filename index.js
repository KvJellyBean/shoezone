// Import required modules
const express = require("express"); // Express.js framework for Node.js
const app = express(); // Create an Express application
const dotenv = require("dotenv"); // Load environment variables from a .env file
const mongoose = require("mongoose"); // MongoDB object modeling tool designed to work in an asynchronous environment
const morgan = require("morgan"); // HTTP request logger middleware for Node.js
const cookieParser = require("cookie-parser"); // Parse Cookie header and populate req.cookies
const { requireAuth, checkUser } = require("./middleware/authMiddleware"); // Custom middleware functions for authentication

dotenv.config();

const port = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URL).then(
  () => console.log(`Database connected ${process.env.MONGO_URL}`),
  (err) => console.log(err)
);

const expressLayouts = require("express-ejs-layouts");

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Use express-ejs-layouts for layout support
app.use(expressLayouts);

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Logging middleware
app.use(morgan("dev"));

// Parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Define routes
app.use("/api/partners", require("./routes/api/partners"));
app.use("/api/products", require("./routes/api/products"));
app.use("/api/carts", require("./routes/api/carts"));
app.use("/api/purchaseHistory", require("./routes/api/purchaseHistory"));
app.use("/api/account", require("./routes/api/accounts"));

// Middleware to check user authentication status for all routes
app.get("*", checkUser);

// Route for the homepage
app.get("/", (req, res) => {
  res.render("index", { title: "ShoeZone", layout: "index" });
});

// Route for the shop page, requiring authentication
app.get("/shop", requireAuth, (req, res) => {
  res.render("shop", { title: "Shop", layout: "shop" });
});

// Route for the cart page, requiring authentication
app.get("/cart", requireAuth, (req, res) => {
  res.render("cart", { title: "Cart", layout: "cart" });
});

// Route for the account page
app.get("/account", (req, res) => {
  res.render("account", { title: "Account", layout: "account" });
});

// Route for account-related functionality (login, sign up)
app.use(require("./routes/api/accounts"));

// Start the server
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
