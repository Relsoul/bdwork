/**
 * Created by soul on 2015/12/24.
 */
var user_model=require("../models/user");
var mongoose=require("mongoose");
var Schema=mongoose.Schema,
    ObjectId=Schema.Types.ObjectId

exports.signUp=function(req,res){
    var _user=req.body.reg;
    var name=_user.name,
        password=_user.password,
        email=_user.email;
    console.log(_user);
    user_model.findOne({name:_user.name},function(err,user){
        if(err){
            console.log(err)
        }
        if(user){
            return res.json(400,{"err":"用户名已经存在"})
        }else{
            var users=new user_model(_user);
            //users._roomId="567ed27b9a39bc4041a3e95c"
            console.log(users)
            users.save(function(err,_users){
                if(err){
                    console.log(err)
                }
                res.redirect("/#/login")
            })
        }
    })
}

exports.signIn=function(req,res){
    var name=req.body.login_name,
          password=req.body.login_password
    user_model.findOne({name:name},function(err,user) {
        if(!user){
            return res.json({
                isLogin:false,
                login_info:"请检查用户名是否存在"
            })
        }
        if (err) {
            console.log(err)
        }
        user.getPass(password, function (err,isMatch) {
            if(err){console.log(err)}
            if(isMatch){
                req.session.user = user;
                res.json({
                    isLogin:true,
                    login_info:"登录成功正在跳转",
                    user:user.name
                })
            }else{
                res.json({
                    isLogin:false,
                    login_info:"密码不正确,请重新输入"
                })
            }
        })


    })
}


exports.ensureUserName=function(req,res){
    var name=req.query.username
    user_model.findOne({name:name},function(err,user){
        if(user){
            return res.json(
                {
                    isUnique:false,
                    name_info:"万分抱歉~用户名已被抢注"
                }
            )
        }else{
            res.json({
                isUnique:true,
                name_info:"用户名可以使用"
            })
        }
    })
}


exports.getName=function(req,res){
    if(req.session.user){
        res.json({
            isSession:true,
            _id:req.session.user._id,
            name:req.session.user.name,
            roomId:req.session.user._roomId,
            role:req.session.user.role
        })
    }else{
        res.json({
            isSession:false
        })
    }
}

exports.userLogout=function(req,res){
        delete req.session.user
        res.json({
            isLogout:true
        })
}


exports.adminRequired=function(req,res,next){
    var user=req.session.user;
    if(user.role<10){
        return false
    }
    next()
}
exports.loginRequired=function(req,res,next){
    var user=req.session.user;
    if(!user){
        return false
    }
    next()
}


