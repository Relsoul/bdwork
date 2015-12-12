var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var ObjectId=Schema.ObjectId;
var CatetorySchema=new mongoose.Schema({
    name:String,
    movies:[{type:ObjectId,ref:"Movie"}],
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

//每次存储数据都会调用这个函数 类似于路由中间件
CatetorySchema.pre("save",function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }else{
        this.meta.updateAt=Date.now()
    }
    next()
})



//经过模型编译后才会具有这些方法
CatetorySchema.statics={
    fetch:function(cb){
        return this.find({}).sort("meta.updateAt").exec(cb)
    },
    findById:function(id,cb){
        return this.findOne({_id:id}).sort("meta.updateAt").exec(cb)
    }
}

module.exports=CatetorySchema