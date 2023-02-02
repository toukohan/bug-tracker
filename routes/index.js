const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Issue = require("../models/Issue");

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth");
const pjson = require("../package.json");

// Sign in routes

router.get("/", checkNotAuthenticated(), (req, res) => {
  res.render("demo-login", { msg: "", msgtype: "" });
});

router.get("/login", checkNotAuthenticated(), (req, res) => {
  res.render("login", { msg: "", msgtype: "" });
});

router.get("/register", checkNotAuthenticated(), (req, res) => {
  res.render("register", { msg: "", msgtype: "" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.render("login", { msg: info.message, msgtype: "warning" });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect("/dashboard");
    });
  })(req, res, next);
});

router.get("/demo-login", checkNotAuthenticated(), (req, res) => {
  res.render("demo-login");
});

// ignoring security issues here with this hack login

router.post("/demo-login", (req, res, next) => {
  const { role } = req.body;
  if (role == "admin") {
    req.body.email = "admin@admin";
    req.body.password = "admin";
  }
  if (role == "manager") {
    req.body.email = "manager@manager";
    req.body.password = "manager";
  }
  if (role == "developer") {
    req.body.email = "dev@dev";
    req.body.password = "dev";
  }
  if (role == "client") {
    req.body.email = "client@client";
    req.body.password = "client";
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.render("login", { msg: info.message, msgtype: "warning" });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect("/dashboard");
    });
  })(req, res, next);
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.error(err);
      res.render("register", { msg: "error", msgtype: "warning" });
    }
    if (user) {
      res.render("register", {
        msg: "email already registered",
        msgtype: "warning",
      });
    }
    const hash = bcrypt.hashSync(password, 8);
    const newUser = new User({
      name,
      email,
      password: hash,
      role: "admin",
      email_verified: false,
    });
    newUser.save((err) => {
      if (err) {
        console.error(err);
        res.render("register", {
          msg: "something went wrong",
          msgtype: "warning",
        });
      }
      console.log("user saved");
      res.render("login", {
        msg: "Registration successful.",
        msgtype: "success",
      });
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

// Department routes

router.get("/departments", checkAuthenticated(), (req, res) => {
  if (req.user.role == "admin") {
    Issue.find({})
      .distinct("department")
      .then((deps) => {
        res.render("departments", {
          user: req.user,
          departments: deps,
          issues: [],
        });
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/dashboard");
      });
  } else {
    const deps = req.user.department;
    res.render("departments", {
      user: req.user,
      issues: [],
      departments: deps,
    });
  }
});

router.get("/departments/:department", checkAuthenticated(), (req, res) => {
  const { department } = req.params;
  const deps = req.user.department;

  Issue.find({ department: department })
    .then((issues) => {
      console.log(issues);
      res.render("departments", {
        user: req.user,
        issues: issues,
        departments: deps,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/departments");
    });
});

// create a new issue

router.get("/create", checkAuthenticated(), (req, res) => {
  res.render("create", { user: req.user });
});

router.post("/create", checkAuthenticated(), (req, res) => {
  const { title, content, department, severity } = req.body;

  const newIssue = new Issue({
    creator: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
    date: new Date(),
    title: title,
    content: content,
    department: department,
    assigned: null,
    open: true,
    severity: severity,
    version: pjson.version,
  });
  newIssue.save((err) => {
    if (err) {
      console.error(err);
      res.redirect("/dashboard/create");
    }
    res.redirect("/dashboard");
  });
});

router.get("/settings/:userid", checkAuthenticated(), (req, res) => {
  res.render("settings", {user: req.user});
});

router.post("/settings/:userid/remove-member", checkAuthenticated(), (req, res) => {
  const { userid } = req.params;
  const { member } = req.body;
  User.findByIdAndUpdate(userid, {$pull: {team: member }}, (err) => {
    if(err) {
      console.error(err);
      res.redirect("/settings/"+ userid);
    }
    res.redirect("/settings/"+ userid);
  })
})

router.get("/team", checkAuthenticated(), (req, res) => {
  console.log(req.user.team);
  res.redirect("/dashboard");
});

module.exports = router;
