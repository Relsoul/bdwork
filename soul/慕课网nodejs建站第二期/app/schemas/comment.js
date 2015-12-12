var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var ObjectId=Schema.ObjectId
console.log(4,ObjectId)
var CommentSchema=new mongoose.Schema({
    //关联文档查询
    movie:{
        type:ObjectId,
        ref:"Movie"
    },
    from: {type: ObjectId, ref: "User"},
    content: String,
    reply:[{
        to: {type: Schema.Types.ObjectId, ref: "User"},
        from: {type: ObjectId, ref: "User"},
        content: String,
    }],
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
CommentSchema.pre("save",function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }else{
        this.meta.updateAt=Date.now()
    }
    next()
})



//经过模型编译后才会具有这些方法
CommentSchema.statics={
    fetch:function(cb){
        return this.find({}).sort("meta.updateAt").exec(cb)
    },
    findById:function(id,cb){
        return this.findOne({_id:id}).sort("meta.updateAt").exec(cb)
    }
}

module.exports=CommentSchema