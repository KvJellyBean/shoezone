const { Schema, model } = require("mongoose");

const purchaseHistorySchema = new Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  quantity: { type: Number, default: 1 },
  totalPrice: Number,
  checkoutTime: Date,
  ipAddress: String,
});

module.exports = model("purchaseHistory", purchaseHistorySchema);
