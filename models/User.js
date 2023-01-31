const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  email_verified: Boolean,
  role: String,
  department: [String],
  teams: [String],
});

module.exports = mongoose.model("User", User);
