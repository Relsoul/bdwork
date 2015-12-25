/**
 * Created by soul on 2015/12/24.
 */
var mongoose=require("mongoose");
var bcrypt=require("bcrypt");
var pskey=10;
var UserSchema=new mongoose.Schema({
    name:{
        unique:true,
        type:String,
        required:true,
        min:2,
        max:16
    },
    password:{
        type:String,
        required:true
    },
    //0:nomal user
    //1: verified user
    //100:admin
    role:{
        type:Number,
        default:0
    },
    email:{
        type:String,
        default:""
    },
    qq:{
        type:String
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})


UserSchema.pre("save",function(next){
    var user=this;
    if(user.isNew){
        user.meta.createAt=user.meta.updateAt=Date.now()
    }else{
        user.meta.updateAt=Date.now()
    }
    bcrypt.genSalt(pskey,function(err,salt){
        if(err){
            return next(err)
        }
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err){
                return next(err)
            }
            user.password=hash
            next()
        })
    })
})

UserSchema.methods={
    //Ω‚√‹
    getPass:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err){
                return cb(err)
            }
            cb(null,isMatch)
        })
    }
}

var User=mongoose.model("User",UserSchema)
module.exports=User







