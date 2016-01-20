/**
 * Created by soul on 2015/12/22.
 */
var express=require("express");
var config=require("./config/config")
console.log(6,config)
var path=require("path");
var port=process.env.PORT||3000;
var Esession=require("express-session");
var cookieParser=require("cookie-parser");
var mongoose=require("mongoose");
var mongoStore=require("connect-mongo")(Esession);
var bodyParser=require("body-parser");
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/avatar/')
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+'-'+file.originalname)
    }
})
var upload = multer({ storage: storage })
var upload_avatar=upload.single('file')
var morgan=require("morgan");
var app=express();
var dbUrl="mongodb://localhost:27017/soulChat";
var sessionStore=new mongoStore({
    url:dbUrl,
    collection:"sessions"
});




mongoose.connect(dbUrl);

//静态资源
app.use(express.static(path.join(__dirname,config.static)))
app.use(express.static(path.join(__dirname,config.view)))
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
//环境变量
if(app.get("env")=="development"){
    app.set("showStackError",true);
    app.use(morgan(":method :url :status"))
    app.locals.pretty=true;
    mongoose.set("debug",true)
}
app.set('host','127.0.0.1:3000')


var io=require("socket.io").listen(app.listen(port));
console.log("running"+port);

//API
require("./config/RESTful")(app,io,upload_avatar);

//socket
require("./config/socket")(app,io)











