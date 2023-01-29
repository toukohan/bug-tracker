const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Issue = new Schema({
  date: Date,
  creator: String,
  title: String,
  content: String,
  version: Number,
  open: Boolean,
  assigned: String,
  severity: Number,
  department: String,
});

module.exports = mongoose.model("Issue", Issue);
