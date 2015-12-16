/**
 * Created by soul on 15-12-6.
 */
var mongoose=require("mongoose");
var bcrypt=require("bcrypt");
var SALT_WORK_FACTOR=10;
var UserSchema=new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:{
        type:String
    },
    // 0: nomal user
    // 1: verified user
    // 2: professonal user
    // >10: admin
    // >50: super admin
    role:{
        type:Number,
        default:0
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
});

//每次存储数据都会调用这个函数 类似于路由中间件
UserSchema.pre("save",function(next){
    var user=this;
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }else{
        this.meta.updateAt=Date.now()
    }
    //生成随机salt
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err){
            return next(err)
        }
        //混合salt
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err){return next(err)}
            //设置混合密码
            user.password=hash;
            next()
        })
    });
});


//实例方法
UserSchema.methods={
    //解密password
    comparePassword:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err){return cb(err)}
            cb(null,isMatch)
        })
    }
}



//经过模型编译后才会具有这些方法
UserSchema.statics={
    fetch:function(cb){
        return this.find({}).sort("meta.updateAt").exec(cb)
    },
    findById:function(id,cb){
        return this.findOne({_id:id}).sort("meta.updateAt").exec(cb)
    }
};

module.exports=UserSchema;