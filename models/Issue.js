const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Issue = new Schema({
    date: Date,
    title: String,
    content: String,
    version: Number,
    open: Boolean,
    assigned: String,
    severity: Number
});

module.exports = mongoose.model("Issue", Issue);