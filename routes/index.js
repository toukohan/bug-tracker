const express = require('express');
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { checkAuthenticated } = require("../middleware/auth")


router.get("/", (req, res) => {
    res.render("login", {msg: "", msgtype: ""});
});

router.get("/login", (req, res) => {
    res.render("login", {msg: "", msgtype: ""});
});

router.get("/register", (req, res) => {
    res.render("register", {msg: "", msgtype: ""});
})

router.get("/dashboard", checkAuthenticated(), (req, res) => {
    res.render("dashboard", { user: req.user });
})

// post reqs

router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) return next(err);
        if(!user) {
            res.render("login", { msg: info.message, msgtype: "warning" });
        }
        req.logIn(user, (err) => {
            if(err) return next(err);
            res.redirect("/dashboard");
        });
    })(req, res, next);
    
});


router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    
    User.findOne({ email: email }, (err, user) => {
        if(err) {
            console.error(err);
            res.render("register", {msg: "error", msgtype: "warning"});
        }
        if(user) {
            res.render("register", {msg: "email already registered", msgtype: "warning"});
        }
        const hash = bcrypt.hashSync(password, 8);
        const newUser = new User({name, email, password: hash, role: "regular", email_verified: false});
        newUser.save((err) => {
            if(err) {
                console.error(err);
                res.render("register", {msg: "something went wrong", msgtype: "warning"});
            }
            console.log("user saved");
            res.render("login", {msg: "Registration successful.", msgtype: "success"})
        })
    })
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err) console.error(err);
        res.redirect("/login");
    });
});

module.exports = router;