/**
 * Created by soul on 15-12-9.
 */
var mongoose=require("mongoose");
var CommentSchema=require("../schemas/comment");
var Comment=mongoose.model("Comment",CommentSchema)


module.exports=Comment