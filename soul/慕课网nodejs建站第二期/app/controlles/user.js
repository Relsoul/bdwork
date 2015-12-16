/**
 * Created by soul on 15-12-9.
 */
var User = require("../models/user");

//showSignup
exports.showSignup = function (req, res) {
    res.render("signup", {
        title: "注册页面",
    })
};
//showSignin
exports.showSignin = function (req, res) {
    res.render("signin", {
        title: "登陆页面",
    })
};


//sign up
exports.signup = function (req, res) {
    var _user = req.body.user;
    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (user) {
            return res.redirect("/signin")
        } else {
            var users = new User(_user);
            users.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                res.redirect("/")
            })
        }
    });
};

//sign in
exports.signin = function (req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            return res.redirect("/signup")
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                req.session.user = user;
                return res.redirect("/")
            } else {
                return res.redirect("/signin")
            }
        })
    })
};

//logout
exports.logout = function (req, res) {
    delete req.session.user;
    // delete app.locals.user
    res.redirect("/")
};


//user page
exports.list = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render("userlist", {
            title: "imooc 列表页",
            users: users
        })
    })
};
//midware for user
exports.signinRequired = function (req, res,next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect("/signin")
    }
    next()
};
//midware for admin
exports.adminRequired = function (req, res,next) {
    var user = req.session.user;
    if (user.role <= 10) {
        return res.redirect("/signin")
    }
    next()
    }
