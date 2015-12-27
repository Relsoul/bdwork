/**
 * Created by soul on 2015/12/22.
 */

var path=require("path");
var user=require("../app/controller/user.js")
var chat=require("../app/controller/chat.js")


module.exports=function(app,io){
    app.get("/",function(req,res){
        res.sendFile(path.join(__dirname,"../app/views/index.html"))
    })
    app.post("/newuser",user.signUp)
    app.post("/login",user.signIn)
    app.get("/api/checkusername/",user.ensureUserName);
    app.get("/api/getname",user.getName)
    app.get("/logout",user.userLogout);
    app.post("/api/getroom",user.adminRequired,user.loginRequired,chat.getRoom)
    app.post("/api/newroom",user.adminRequired,user.loginRequired,chat.newRoom)
    app.post("/api/removeroom",user.adminRequired,user.loginRequired,chat.removeRoom)
}