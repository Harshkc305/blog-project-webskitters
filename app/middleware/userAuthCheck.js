function UserAuthCheck(req, res, next) {
    if (req.user.role !== "user") {
        console.log("user access only");
        return res.redirect("/login-page");
    }
    next();
}

module.exports = UserAuthCheck;
