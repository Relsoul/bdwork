/**
 * Created by soul on 2015/12/30.
 */
/**
 * Created by soul on 2015/12/26.
 */
var mongoose=require("mongoose");
var Schema=mongoose.Schema,
    ObjectId=Schema.ObjectId
var MusicSchema=new Schema({
        src:String,
        name:String,
        addUser:String,
        addTime:{
            type:Date,
            index:{expires:1}
        }
})



MusicSchema.statics={
    getRooms:function(cb){
        return this.find({}).exec(cb)
    },

}




var Music=mongoose.model("Music",MusicSchema)
module.exports=Music