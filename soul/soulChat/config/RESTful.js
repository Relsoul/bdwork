/**
 * Created by soul on 2015/12/22.
 */

var path=require("path");
var user=require("../app/controller/user.js")


module.exports=function(app,io){
    app.get("/",function(req,res){
        res.sendFile(path.join(__dirname,"../app/views/index.html"))
    })
    app.post("/newuser",user.signup)
    app.get("/api/checkusername/",user.ensureUserName)
}