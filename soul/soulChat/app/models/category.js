/**
 * Created by soul on 2015/12/26.
 */
var mongoose=require("mongoose");
var Schema=mongoose.Schema,
    ObjectId=Schema.ObjectId
var CategorySchema=new Schema({
    name:{type:String,unique:true},
    sid:{type:Number,default:0},
    rooms:[{type:ObjectId,ref:"Room"}],
    createAt:{type: Date, default: Date.now}
})



CategorySchema.statics={
    getCategorys:function(cb){
        return this.find({}).populate("rooms").exec(cb)
    },
    getRoomCategory:function(_roomId,cb){
        return this.findOne({rooms:{$in:[_roomId]}}).populate("rooms").exec(cb)
    }
}




var Category=mongoose.model("Category",CategorySchema)
module.exports=Category