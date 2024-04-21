const { Schema, model } = require("mongoose");

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
