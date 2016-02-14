/**
 * Created by soul on 2016/1/21.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var WhisperSchema = new Schema({
    content: String,
    content_img: String,
    form: {type: ObjectId, ref: "User"},
    to: {type: ObjectId, ref: "User"},
    is_read: {type:'Boolean',default:false},
    createAt: {type: Date, default: Date.now()}
});

WhisperSchema.statics={
    findWhisper:function(from,to,cb){
        this.find({to:to,from:from}).populate([
            {path: "form", select: "_id name avatarUrl"},
            {path: "to", select: "_id name avatarUrl"}
        ]).exec(cb)
    },

    setWhidperRead:function(from,to,cb){
        this.update({to:to},{from:from},{$set:{is_read:true}},function(err){
            cb(err)
        })
    }

}

var Whisper = mongoose.model("Whisper", WhisperSchema)
module.exports = Whisper;