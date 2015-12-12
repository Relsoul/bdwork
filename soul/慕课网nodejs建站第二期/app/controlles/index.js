/**
 * Created by soul on 15-12-9.
 */
var Movie = require("../models/movie");
var Catetory=require("../models/catetory");

//index page
exports.index=function(req,res){
    Catetory
        .find({})
        .populate({path:"movies",options:{limit:5}})
        .exec(function(err,catetories){
            console.log(13,catetories);
            res.render("index", {
                title: "imooc 首页",
                catetories: catetories
            })
        });
    //session 存储的是用户相应的数据库信息
    console.log("user session", req.session.user);
};


//index search page
exports.search=function(req,res){
    var count=2
    var catId=req.query.cat;
    var q=req.query.q
    var page=parseInt(req.query.p,10)||0;
    var index=page*count;
    if(catId){
        Catetory
            .find({_id:catId})
            .populate({path:"movies",select:"title poster"})
            .exec(function(err,catetories){
                console.log(13,catetories);
                var catetory=catetories[0]||{};
                var movies=catetory.movies||[];
                var results=movies.slice(index,index+count)
                res.render("results", {
                    title: "imooc 结果列表页面",
                    keyword:catetory.name,
                    currentPage:(page+1),
                    query:"cat="+catId,
                    totalPage:Math.ceil(movies.length/count),
                    movies: results
                })
            });
    }else{
        Movie
            .find({title:new RegExp(q+".*","i")})
            .exec(function(err,movies){
                var results=movies.slice(index,index+count)
                res.render("results", {
                    title: "imooc 结果列表页面",
                    keyword:q,
                    currentPage:(page+1),
                    query:"q="+q,
                    totalPage:Math.ceil(movies.length/count),
                    movies: results
                })
            })
    }

};