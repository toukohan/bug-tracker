const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Issue = require("../models/Issue");

const { checkAuthenticated } = require("../middleware/auth");
const pjson = require("../package.json");

// Users routes

router.get("/", checkAuthenticated(), (req, res) => {
  User.find({})
    .then((users) => {
      res.render("users", { user: req.user, users: users });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/dashboard");
    });
});

router.get("/:user", checkAuthenticated(), async (req, res) => {
  const userId = req.params.user;
  console.log(userId);
  try {
  const foundUser = await User.findById(userId);
  const issues = await Issue.find({assigned: foundUser.email });
  let deps = await Issue.find({}).distinct("department");
  res.render("user", {
    user: req.user,
    foundUser: foundUser,
    departments: deps,
    issues: issues,
  });
  }
  catch(err) {
    console.error(err);
    res.redirect("/users");
  }
});

router.post("/create", checkAuthenticated(), async (req, res) => {
  const { name, email, password, role, teams, department } = req.body;
  try {
    const hash = await bcrypt.hash(password, 8);
    const newUser = new User({
      name,
      email,
      password: hash,
      role,
      teams: [teams],
      department: [department],
      team: [email],
    });
    await newUser.save().then(() => console.log("user saved."));
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.redirect("/users");
  }
});

router.post("/:userid/role", checkAuthenticated(), (req, res) => {
  const { userid } = req.params;
  const newRole = req.body.role;
  User.findByIdAndUpdate(userid, { $set: { role: newRole } })
    .then(() => {
      console.log("role changed to:", newRole);
      res.redirect("/users/" + userid);
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/users/" + userid);
    });
});

router.post("/:userid/toggle-team", checkAuthenticated(), async (req, res) => {
  const { userid } = req.params;
  const { _id } = req.user;
  const { toggle } = req.body;
  try {
    const user = await User.findById(userid);
  let query;
  if(toggle === "add") query = {$push: {team: user.email}};
  if(toggle === "remove") query = {$pull: {team: user.email}}
    await User.findByIdAndUpdate(_id, query);
    res.redirect("/users/" + userid);
  }
  catch(err) {
    console.error(err);
    res.redirect("/users/" + userid);
  }
});

router.post("/:userid/add-department", checkAuthenticated(), (req, res) => {
  const { userid } = req.params;
  const newDepartment = req.body.department;
  User.findByIdAndUpdate(userid, { $push: { department: newDepartment } })
    .then(() => {
      console.log("added a new department:", newDepartment);
      res.redirect("/users/" + userid);
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/users/" + userid);
    });
});

router.post("/:userid/remove-department", checkAuthenticated(), (req, res) => {
  const { userid } = req.params;
  const departmentToRemove = req.body.department;
  User.findByIdAndUpdate(userid, {
    $pull: { department: departmentToRemove },
  })
    .then(() => {
      console.log("removed department:", departmentToRemove);
      res.redirect("/users/" + userid);
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/users/" + userid);
    });
});

module.exports = router;
