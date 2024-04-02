const { Schema, model, default: mongoose } = require("mongoose");

const accountSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "user",
    },
    username: {
      type: String,
      required: [true, "Please add the username"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already exist"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("accounts", accountSchema);
