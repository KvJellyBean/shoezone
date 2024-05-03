const { Schema, model } = require("mongoose");

// Mongoose schema for partner.
const partnerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  website: String,
});

module.exports = model("partner", partnerSchema);
