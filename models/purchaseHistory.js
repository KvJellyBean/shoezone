const { Schema, model } = require("mongoose");

// Mongoose schema for purchase history.
const purchaseHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        description: String,
        image: String,
        rating: {
          type: Number,
          min: 0,
          max: 5,
          default: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        checkoutTime: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("purchaseHistory", purchaseHistorySchema);
