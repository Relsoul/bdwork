/**
 * Created by soul on 2015/12/22.
 */
var express=require("express");
var path=require("path");
var port=process.env.PORT||3000;
var Esession=require("express-session");
var cookieParser=require("cookie-parser");
var mongoose=require("mongoose");
var mongoStore=require("connect-mongo")(Esession);
var bodyParser=require("body-parser");
var morgan=require("morgan");
var app=express();
var dbUrl="mongodb://localhost:27017/soulChat";
var sessionStore=new mongoStore({
    url:dbUrl,
    collection:"sessions"
});


mongoose.connect(dbUrl);

//设置中间件
app.use(express.static(path.join(__dirname,"public")))
app.use(express.static(path.join(__dirname,"app/views")))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(Esession({
    secret:"soulChat",
    cookie: { httpOnly: false },
    store:sessionStore,
    resave:false,
    saveUninitialized:false
}));
//判断环境
if(app.get("env")=="development"){
    app.set("showStackError",true);
    app.use(morgan(":method :url :status"))
    app.locals.pretty=true;
    mongoose.set("debug",true)
}


var io=require("socket.io").listen(app.listen(port));
console.log("running"+port);

//路由
require("./config/RESTful")(app,io);

//socket
require("./config/socket")(app,io)











