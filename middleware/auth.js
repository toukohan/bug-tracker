module.exports = {
    checkAuthenticated: function() {
        return function(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect("/login");
        }
    }
}