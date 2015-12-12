/**
 * Created by soul on 15-12-9.
 */
var _ = require("underscore");
var Index = require("../app/controlles/index");
var User = require("../app/controlles/user");
var Movie = require("../app/controlles/movie");
var Comment=require("../app/controlles/comment");
var Catetory=require("../app/controlles/catetory")



module.exports = function (app) {

// pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;
        next()
    });

//Index
//index page
    app.get("/",Index.index);
//Index End

// User
//sign up
    app.post("/user/signup",User.signup);
//sign in
    app.post("/user/signin", User.signin);
//logout
    app.get("/logout", User.logout);
//sign in
    app.get("/signin",User.showSignin);
//sign up
    app.get("/signup",User.showSignup);
//user page
    app.get("/admin/user/list",User.signinRequired,User.adminRequired,User.list);
// User End

//Movie
//detail page
    app.get("/movie/:id",Movie.detail);
//admin page
    app.get("/admin/movie/new",User.signinRequired,User.adminRequired,Movie.new);
//admin update movie
    app.get("/admin/movie/update/:id",User.signinRequired,User.adminRequired,Movie.update);
//admin post movie
    app.post("/admin/movie/new",User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save);
//list page
    app.get("/admin/movie/list",User.signinRequired,User.adminRequired,Movie.list);
//list delete movie
    app.delete("/admin/movie/list", User.signinRequired,User.adminRequired,Movie.del);
//Movie End

//Comment
    app.post("/user/comment", User.signinRequired,Comment.save);

// Catetory
    app.get("/admin/catetory/new",User.signinRequired,User.adminRequired,Catetory.new);
    app.post("/admin/catetory",User.signinRequired,User.adminRequired,Catetory.save);
    app.get("/admin/catetory/list",User.signinRequired,User.adminRequired,Catetory.list);

    //results
    app.get("/results",Index.search);


};
