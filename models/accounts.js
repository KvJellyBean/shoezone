const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const accountSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email address"],
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true],
    default: "+62",
  },
  address: {
    type: String,
    required: [true],
    default: "Your address, Number, City, Country",
  },
  image: {
    type: String,
    default: "./assets/profiles/profile.png",
  },
});

accountSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// static method to login user
accountSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

module.exports = model("account", accountSchema);
