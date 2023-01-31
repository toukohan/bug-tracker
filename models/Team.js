const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const Team = new Schema({
  members: [User],
});

module.exports = mongoose.model("Team", Team);
