const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Issue = require("../models/Issue");

const { checkAuthenticated } = require("../middleware/auth");
const pjson = require("../package.json");

// Dashboard routes

router.get("/", checkAuthenticated(), async (req, res) => {
  const { _id, email } = req.user;
  // the creator query
  // { $and: [{ creator: _id }, { open: true }, { assigned: { $ne: email } }],}
  const assigned = await Issue.find({ assigned: email });
  Issue.find({department: "Help"})
    .sort({ date: -1 })
    .then((issues) => {
      res.render("dashboard", {
        user: req.user,
        issues: issues,
        assigned: assigned,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/");
    });
});

// my sorting route doesnt work

router.post("/", checkAuthenticated(), async (req, res) => {
  const { _id, email } = req.user;

  const { sortby } = req.body;
  let sort = {};
  let query = {
    $and: [{ open: true }, { creator: _id }, { assigned: { $ne: email } }],
  };
  if (sortby == "new") sort.date = -1;
  if (sortby == "priority") sort.severity = -1;
  if (sortby == "unassigned") sort.assigned = 1;

  const assigned = await Issue.find({ assigned: email });

  Issue.find(query)
    .sort(sort)
    .then((issues) => {
      res.render("dashboard", {
        user: req.user,
        issues: issues,
        assigned: assigned,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/dashboard");
    });
});

router.post("/:issueid/assign", checkAuthenticated(), (req, res) => {
  const { issueid } = req.params;
  const { assign } = req.body;
  Issue.findByIdAndUpdate(issueid, { $set: { assigned: assign } })
    .then(() => {
      console.log("Issue assigned to", assign);
      res.redirect("/dashboard");
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/dashboard");
    });
});

module.exports = router;
