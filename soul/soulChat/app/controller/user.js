/**
 * Created by soul on 2015/12/24.
 */
var user_model=require("../models/user");

exports.signup=function(req,res){
    var _user=req.body.reg;
    var name=_user.name,
        password=_user.password,
        email=_user.email

    console.log(_user);
    user_model.findOne({name:_user.name},function(err,user){
        if(err){
            console.log(err)
        }
        if(user){
            return res.json(400,{"err":"用户名已经存在"})
        }else{
            var users=new user_model(_user);
            users.save(function(err,user){
                if(err){
                    console.log(err)
                }
                res.redirect("/")
            })

        }
    })
}

exports.ensureUserName=function(req,res){
    var name=req.query.username
    user_model.findOne({name:name},function(err,user){
        if(user){
            return res.json({"err":"用户名已经存在"})
        }else{
            res.json({
                isUnique:false
            })
        }
    })

}