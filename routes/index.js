const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Issue = require("../models/Issue");
const { getAge } = require("../middleware/issues");
const { checkAuthenticated } = require("../middleware/auth");
const pjson = require("../package.json");

// Sign in routes

router.get("/", (req, res) => {
  res.render("login", { msg: "", msgtype: "" });
});

router.get("/login", (req, res) => {
  res.render("login", { msg: "", msgtype: "" });
});

router.get("/register", (req, res) => {
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
      role: "regular",
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
    res.redirect("/login");
  });
});

// Dashboard routes

router.get("/dashboard", checkAuthenticated(), (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  Issue.find({ creator: _id })
    .then((issues) => {
      res.render("dashboard", { user: req.user, issues: issues });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/");
    });
});

// my sorting route doesnt work

router.post("/dashboard/sort", checkAuthenticated(), (req, res) => {
  console.log(req.body.sort);
  const { sort } = req.body;
  let sortBy = {};
  if (sort == "new") sortBy.date = -1;
  if (sort == "priority") sortBy.severity = -1;
  if (sort == "unassigned") sortBy.assigned = -1;
  Issue.find({ open: true })
    .sort(sortBy)
    .then((issues) => {
      res.render("dashboard", { user: req.user, issues: issues });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/dashboard");
    });
});

// Users routes

router.get("/users", checkAuthenticated(), (req, res) => {
  User.find({})
    .then((users) => {
      res.render("users", { user: req.user, users: users });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/dashboard");
    });
});

router.get("/users/:user", checkAuthenticated(), (req, res) => {
  const userId = req.params.user;
  console.log(userId);
  User.findById(userId)
    .then((foundUser) => {
      console.log(foundUser);
      res.render("user", { user: req.user, foundUser: foundUser });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/dashboard");
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

// Issues routes

router.get("/issues", checkAuthenticated(), (req, res) => {
  Issue.find({ open: true })
    .sort({ date: -1 })
    .then((issues) => {
      res.render("issues", { user: req.user, issues: issues, departments: [] });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/");
    });
  // I had idea to arrange this by deparments but my execution didnt work
  // const { department } = req.user;
  // console.log(department);
  // const issues = [];
  // for (let dep of department) {
  //   Issue.find({ open: true, department: dep })
  //     .then((depIssues) => {
  //       console.log(depIssues);
  //       issues.push(depIssues);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       res.redirect("/dashboard");
  //     });
  // }

  // res.render("issues", {
  //   user: req.user,
  //   departments: department,
  //   issues: issues,
  // });
});

router.get("/issues/:issue", checkAuthenticated(), (req, res) => {
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

// create a new issue

router.get("/create", checkAuthenticated(), (req, res) => {
  res.render("create", { user: req.user });
});

router.post("/create", checkAuthenticated(), (req, res) => {
  const { title, content, department, severity } = req.body;

  const newIssue = new Issue({
    creator: req.user.id,
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

module.exports = router;
