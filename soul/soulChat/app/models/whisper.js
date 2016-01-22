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
    findWhisper:function(id,is_read,is_to,cb){
        var find_val={};
        if(is_read!=null){
            find_val.is_read=is_read
        }
        if(is_to){
            find_val.to=id;
        }else{
            find_val.form=id;
        }
        this.find(find_val).populate([
            {path: "form", select: "_id name avatarUrl"},
            {path: "to", select: "_id name avatarUrl"}
        ]).exec(cb)
    },

}

var Whisper = mongoose.model("Whisper", WhisperSchema)
module.exports = Whisper;