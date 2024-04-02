const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

module.exports = model("Cart", cartSchema);
