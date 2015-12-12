/**
 * Created by soul on 15-12-4.
 */
var express = require("express");
var path = require("path")
var port = process.env.PORT || 3000;
var app = express();
var mongoose = require("mongoose");
var _ = require("underscore");
var bodyParser = require('body-parser');
var Movie = require("./models/movie");

app.set("views", "./views/pages");
app.set("view engine", "jade");
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port);
app.locals.moment=require("moment");
mongoose.connect("mongodb://localhost:27017/imooc")

console.log("imooc running:" + port);


//index page
app.get("/", function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render("index", {
            title: "imooc 首页",
            movies: movies
        })
    })
});

//detail page
app.get("/movie/:id", function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render("detail", {
            title: "imooc " + movie.title,
            movie: movie
        })
    })

});

//admin page
app.get("/admin/movie", function (req, res) {
    res.render("admin", {
        title: "imooc 后台录入页",
        movie: {
            title: "",
            doctor: "",
            country: "",
            year: "",
            poster: "",
            flash: "",
            summary: "",
            language: ""
        }
    })
});

//admin update movie
app.get("/admin/update/:id",function(req,res){
    var id=req.params.id
    if(id){
        Movie.findById(id,function(err,movie){
            console.log(72,movie)
            res.render("admin",{
                title:"后台更新页",
                movie:movie
            })
        })
    }
})


//admin post movie
app.post("/admin/movie/new", function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie
    //判断电影是否新加入的
    if (id !== "undefined") {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            //更新变量
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect("/movie/" + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
        })
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }
                res.redirect("/movie/"+movie._id)
        })
    }
})




//list page
app.get("/admin/list", function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render("list", {
            title: "imooc 列表页",
            movies:movies
        })
    })
});

//list delete movie
app.delete("/admin/list",function(req,res){
    var id=req.query.id
    if(id){
        Movie.remove({
            _id:id
        },function(err,movie){
                if(err){
                    console.log(err)
                }else{
                    res.json({success:1})
                }
        })
    }
})
