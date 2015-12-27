/**
 * Created by soul on 2015/12/26.
 */
var mongoose=require("mongoose");
var Schema=mongoose.Schema,
    ObjectId=Schema.ObjectId
var MessageSchema=new Schema({
    content:String,
    user:{type:ObjectId,ref:"user"},
    _roomId:{type:ObjectId,ref:"room"},
    createAt:{type:Date,default:Date.now()}
})







var Message=mongoose.model("message",MessageSchema)
module.exports=Message