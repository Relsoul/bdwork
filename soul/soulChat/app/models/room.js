/**
 * Created by soul on 2015/12/26.
 */
var mongoose=require("mongoose");
var Schema=mongoose.Schema,
    ObjectId=Schema.ObjectId
var RoomSchema=new Schema({
    name:{type:String,unique:true},
    createAt:{type: Date, default: Date.now}
})



RoomSchema.statics={

}




var Room=mongoose.model("Room",RoomSchema)
module.exports=Room