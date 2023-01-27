const passport = require("passport")
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

passport.use(new LocalStrategy({ usernameField: "email" }, function verify(email, password, done) {
    User.findOne({email: email}, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false, { message: "No user found"});
        if(!bcrypt.compareSync(password, user.password)) return done(null, false, { message: "Password doesn't match"});
        return done(null, user);
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

