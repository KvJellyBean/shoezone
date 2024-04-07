const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

dotenv.config();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log(`Database connected ${process.env.MONGO_URL}`),
  (err) => console.log(err)
);

const expressLayouts = require("express-ejs-layouts");

//ejs
app.set("view engine", "ejs");

//layout
app.use(expressLayouts);

//static express
app.use(express.static("public"));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/products", require("./routes/api/products"));
app.use("/api/carts", require("./routes/api/carts"));
app.use("/api/purchaseHistory", require("./routes/api/purchaseHistory"));
app.get("*", checkUser);

// homepage
app.get("/", (req, res) => {
  res.render("index", { title: "ShoeZone", layout: "index" });
});

// shop
app.get("/shop", requireAuth, (req, res) => {
  res.render("shop", { title: "Shop", layout: "shop" });
});

// cart
app.get("/cart", requireAuth, (req, res) => {
  res.render("cart", { title: "Cart", layout: "cart" });
});

// account (login and sign up)
app.use(require("./routes/api/accounts"));

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
