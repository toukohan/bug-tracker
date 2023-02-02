const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  name: String,
  email: {
    type: String,
    
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "developer",
  },
  projects: [String],
});

const TeamSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  members: [MemberSchema],
  admins: [MemberSchema],
  projects: [String],
});



module.exports = {

 Team: mongoose.model("Team", TeamSchema),
 Member: mongoose.model("Member", MemberSchema),
}