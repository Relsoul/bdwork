/**
 * Created by soul on 2015/12/26.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId
var MessageSchema = new Schema({
    content: String,
    user: {type: ObjectId, ref: "User"},
    _roomId: {type: ObjectId, ref: "Room"},
    createAt: {type: Date, default: Date.now()}
})

MessageSchema.statics = {
    getRoomMessages: function (roomId, cb) {
        return this.find({_roomId: roomId})
            .populate([
                {path: "_roomId", select: "_id name"},
                {path: "user", select: "_id name"}
            ])
            .sort("-createAt")
            .limit(15)
            .exec(cb)
    }
}

MessageSchema.methods = {
    getMessageInfo: function (messageId, cb) {
        return this.model("message")
            .find({_id: messageId})
            .populate([
                {path: "_roomId", select: "_id name"},
                {path: "user", select: "_id name"}
            ])
            .exec(cb)
    }
}


var Message = mongoose.model("message", MessageSchema)
module.exports = Message