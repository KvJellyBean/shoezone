const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");

dotenv.config();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log(`Database connected ${process.env.MONGO_URL}`),
  (err) => console.log(err)
);

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/products", require("./routes/api/products"));

const expressLayouts = require("express-ejs-layouts");

//ejs
app.set("view engine", "ejs");

//layout
app.use(expressLayouts);

//static express
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "ShoeZone", layout: "index" });
});

//shop
app.get("/shop", (req, res) => {
  res.render("shop", { title: "Shop", layout: "shop" });
});

//cart
app.get("/cart", (req, res) => {
  res.render("cart", { title: "Cart", layout: "cart" });
});

//account
app.get("/account", (req, res) => {
  res.render("account", { title: "Account", layout: "account" });
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
