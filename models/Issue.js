const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Issue = new Schema({
  date: Date,
  creator: {
    id: String,
    name: String,
    email: String,
  },
  title: String,
  content: String,
  version: Number,
  open: Boolean,
  assigned: String,
  severity: {
    type: Number,
    default: 1,
  },
  department: {
    type: String,
    default: "Support",
  },
  responses: [
    {
      date: Date,
      responder: String,
      content: String,
    },
  ],
});

module.exports = mongoose.model("Issue", Issue);
