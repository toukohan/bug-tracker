const Issue = require("./models/Issue");
const mongoose = require("mongoose");
const assert = require("assert");

const json = require("./mock_data/MOCK_DATA3.json");
const { db } = require("./models/User");

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/bug-tracker")
  .then(console.log("connected"))
  .catch((err) => console.log(err));

Issue.collection.insertMany(json, (err, r) => {
  assert.equal(null, err);
  assert.equal(1000, r.insertedCount);

  db.close();
});
