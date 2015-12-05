var mongoose=require("mongoose");
var MovieSchema=new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
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
MovieSchema.pre("save",function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }else{
        this.meta.updateAt=Date.now()
    }
    next()
})



//经过模型编译后才会具有这些方法
MovieSchema.statics={
    fetch:function(cb){
            return this.find({}).sort("meta.updateAt").exec(cb)
    },
    findById:function(id,cb){
        return this.findOne({_id:id}).sort("meta.updateAt").exec(cb)
    }
}

module.exports=MovieSchema