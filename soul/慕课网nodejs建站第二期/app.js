/**
 * Created by soul on 15-12-4.
 */
var express = require("express");
var path = require("path");
var port = process.env.PORT || 3000;
var Esession=require("express-session");
var cookieParser=require("cookie-parser");
var app = express();
var mongoStore=require("connect-mongo")(Esession);
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var morgan = require('morgan')



var dbUrl="mongodb://localhost:27017/imooc";
mongoose.connect(dbUrl);
//设置模板视图
app.set("views","app/views/pages");
//设置模板引擎
app.set("view engine", "jade");
//设置静态资源
app.use(express.static(path.join(__dirname, "public")));
//设置body解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//设置cookie解析
app.use(cookieParser());
//设置session
app.use(Esession({
    secret:"imooc",
    //mongo数据库session持久化
    store:new mongoStore({
        url:dbUrl,
        collection:"sessions"
    }),
    resave:false,
    saveUninitialized:false
}));
process.env.NODE_ENV ="development"
if("development"===app.get("env")){
    app.set("showStackError",true)
    //请求类型:请求路径:请求状态
    app.use(morgan(":method :url :status"))
    //不压缩html
    app.locals.pretty=true
    mongoose.set("debug",true)
}


//路由
require("./config/routes")(app);

//监听端口
app.listen(port);
//设置express本地资源
app.locals.moment=require("moment");
//链接数据库


console.log("imooc running:" + port);


