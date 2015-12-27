/**
 * Created by soul on 2015/12/24.
 */
var mongoose=require("mongoose");
var bcrypt=require("bcrypt");
var pskey=10;
var Schema=mongoose.Schema,
    ObjectId=Schema.ObjectId
var UserSchema=new mongoose.Schema({
    name:{
        unique:true,
        type:String,
        required:true,
        min:2,
        max:16
    },
    _roomId:ObjectId,
    online:Boolean,
    avatarUrl:String,
    password:{
        type:String,
        required:true
    },
    //0:nomal user
    //1: verified user
    //10:admin
    role:{
        type:Number,
        default:10
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
    //实例方法
    getPass:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err){
                return cb(err)
            }
            cb(null,isMatch)
        })
    }
}

UserSchema.statics={
    onLine:function(id,cb){
        return this.findOneAndUpdate({name:id},{$set:{online:true}}).exec(cb)
    },
    offLine:function(id,cb){
        return this.findOneAndUpdate({name:id},{$set:{online:false}}).exec(cb)
    },
    leaveRoom:function(leave,callback){
        return this.findOneAndUpdate({
            name:leave.user.name
        },{
            $set:{
                online:false,
                _roomId:null
            }
        }).exec(cb)
    },
    joinRoom:function(join,cb){
        return this.findOneAndUpdate({id:join._id},{$set:{online:true,_roomId:join.roomId}}).exec(cb)
    }
}


var User=mongoose.model("User",UserSchema)
module.exports=User







