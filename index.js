const express = require("express");
const app = express();
const port = 3000;
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

//login
app.get("/login", (req, res) => {
  res.render("login", { title: "Account", layout: "login" });
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
