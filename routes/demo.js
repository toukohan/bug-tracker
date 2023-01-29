const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("demo-login");
});

router.get("/dashboard/:role", (req, res) => {
  const user = {
    name: req.params.role,
    role: req.params.role,
  };
  res.render("dashboard", { user: user });
});

module.exports = router;
