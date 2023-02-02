const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  email_verified: {
    type: Boolean,
    default: false,
  },
  role: String,
  department: [String],
  teams: [String],
  team: [String],
});

module.exports = mongoose.model("User", UserSchema);

