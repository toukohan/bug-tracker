const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Issue = require("../models/Issue");

const { checkAuthenticated } = require("../middleware/auth");
const pjson = require("../package.json");

// Issues routes

router.get("/", checkAuthenticated(), (req, res) => {
  const { department: departments } = req.user;
  Issue.find({ open: true, department: { $in: departments } })
    .sort({ date: -1 })
    .then((issues) => {
      res.render("issues", {
        user: req.user,
        issues: issues,
        departments: departments,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/");
    });
});

// sort issues

router.post("/", checkAuthenticated(), (req, res) => {
  const { sortby } = req.body;
  const { department: departments } = req.user;
  console.log(sortby, departments);
  let sort;
  let query = { open: true, department: { $in: departments } };
  if (sortby == "new") sort = { date: -1 };
  if (sortby == "help") query.department = "Help";
  if (sortby == "priority") sort = { severity: -1 };
  if (sortby == "closed") {
    sort = { open: -1, date: -1 };
    query = { open: false, department: { $in: departments } };
  }
  if (sortby == "unassigned") {
    sort = { assigned: 1 };
  }
  Issue.find(query)
    .sort(sort)
    .then((issues) => {
      res.render("issues", {
        user: req.user,
        issues: issues,
        departments: departments,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/issues");
    });
});

router.get("/:issue", checkAuthenticated(), (req, res) => {
  const issueId = req.params.issue;
  console.log(req.params);
  Issue.findById(issueId)
    .then((issue) => {
      console.log(issue);
      res.render("issue", { user: req.user, issue: issue });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/issues");
    });
});

router.post("/:issue/assign", checkAuthenticated(), (req, res) => {
  const { assign } = req.body;
  const { issue: issueId } = req.params;
  Issue.findByIdAndUpdate(issueId, { $set: { assigned: assign } })
    .then(() => {
      console.log("Issue assigned to ", assign);
      res.redirect("/issues/" + issueId);
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/issues/" + issueId);
    });
});

router.post("/:issue/handle", checkAuthenticated(), (req, res) => {
  const { issue: issueId } = req.params;
  const { handle } = req.body;
  console.log(req.params);
  console.log(handle, issueId);
  if (handle === "close") {
    Issue.findByIdAndUpdate(issueId, { $set: { open: false } })
      .then(() => {
        console.log("issue closed");
        res.redirect("/issues/" + issueId);
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/issues/" + issueId);
      });
  }
  if (handle === "open") {
    Issue.findByIdAndUpdate(issueId, { $set: { open: true } })
      .then(() => {
        console.log("issue opened");
        res.redirect("/issues/" + issueId);
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/issues/" + issueId);
      });
  }
});

router.post("/:issue/priority", checkAuthenticated(), (req, res) => {
  const { priority } = req.body;
  const { issue: issueid } = req.params;
  let query;
  if (priority == "none") query = 0;
  if (priority == "low") query = 1;
  if (priority == "medium") query = 2;
  if (priority == "high") query = 3;
  Issue.findByIdAndUpdate(issueid, { $set: { severity: query } }, (err) => {
    if (err) console.error(err);
    console.log("priority changed to", query);
    res.redirect("/issues/" + issueid);
  });
});
router.post("/:issue/response", checkAuthenticated(), (req, res) => {
  const { issue: issueId } = req.params;
  const { content } = req.body;
  const { name: responder } = req.user;
  const date = new Date();
  const newResponse = { date, responder, content };
  Issue.findByIdAndUpdate(issueId, { $push: { responses: newResponse } })
    .then(() => {
      console.log("New respond added");
      res.redirect("/issues/" + issueId);
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/issues/" + issueId);
    });
});

router.post("/search", checkAuthenticated(), async (req, res) => {
  const { search } = req.body;
  const regex = new RegExp(search, "i");
  console.log(regex);
  try {
    
    const issues = await Issue.find({$or: [{content: regex}, {title: regex}, {"creator.name": regex}]});
    res.render("issues", {user: req.user, issues: issues, departments: req.user.department});
  }
  catch(err) {
    console.error(err);
    res.redirect("/dashboard");
  }
})
module.exports = router;
