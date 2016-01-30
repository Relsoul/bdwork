/**
 * Created by soul on 2015/12/24.
 */
var user_model=require("../models/user");
var mongoose=require("mongoose");
var Schema=mongoose.Schema,
    ObjectId=Schema.Types.ObjectId;
var config=require("../../config/config")

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


exports.updateUser=function(req,res){
    var _user_info=req.body.user_info
    console.log(115,req.body)
    console.log(116,req.file)
    if(req.file){
        console.log(120,config)
        var filename=config.avatar+"/"+req.file.filename;
        user_model.update({_id:_user_info._id},{$set:{avatarUrl:filename}},function(err){
            if(err){
                return res.json({
                    err:'上传错误',
                })
            }
        })

    }
    //修改密码的情况下
    if(_user_info.old_password && _user_info.new_password){
        user_model.findOne({_id:_user_info._id},function(err,user){
            user.getPass(_user_info.old_password, function (err,isMatch) {
                if(err){
                   return res.json({
                        err:'密码确认错误',
                    })
                }
                if(isMatch){
                    user.password=_user_info.new_password;
                    user.emial=_user_info.email;
                    user.leaveMessage=_user_info.leaveMessage;
                    user.save(function(err,data){
                        if(err){
                            return res.json({
                                err:'修改错误',
                            })
                        }
                        delete req.session.user
                        return res.json({
                            info:'修改成功',
                        });

                    })
                }else{
                    return res.json({
                        err:'原密码不正确',
                    })
                }
            })
        })
    }else{
        //调用update方式
        user_model.update({_id:_user_info._id},{$set:{'email':_user_info.email,'leaveMessage':_user_info.leaveMessage}},function(err){
            if(err){
                res.json({
                    err:'修改错误',
                })
            }else{
                res.json({
                    info:'修改成功'
                })

            }

        })
    }
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


