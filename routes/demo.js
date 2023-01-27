const express = require('express');
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("demo-login");
})

router.get("/dashboard", (req, res) => {
    res.render("dashboard");
})

module.exports = router;