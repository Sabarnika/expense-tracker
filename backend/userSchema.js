const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  userType: {
    type: String,
    default: "customer",
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
