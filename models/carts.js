const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  quantity: { type: Number, default: 1 },
  totalPrice: Number,
});

module.exports = model("Cart", cartSchema);
