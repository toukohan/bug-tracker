const mongoose = require("mongoose");
const Issue = require("../models/Issue");
const User = require("../models/User");
module.exports = {
  getIssues: async function () {
    try {
      const issues = await Issue.find({}).then((issues) => {
        return issues;
      });
    } catch (err) {
      console.error(err);
    }
  },
  getUsers: function () {
    User.find({}, (err, users) => {
      if (err) console.error(err);
      return users;
    });
  },
  getAge: function (timeframe) {
    let days = 1;
    switch (timeframe) {
      case "week":
        days = 7;
        break;
      case "month":
        days = 30;
        break;
      case "year":
        days = 365;
        break;
      case "all":
        days = 365 * 50;
        break;
      default:
        break;
    }
    const date = new Date();
    return date.setDate(date.getDate() - days);
  },
};
