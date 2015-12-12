/**
 * Created by soul on 15-12-8.
 */
var mongoose=require("mongoose");
var UserSchema=require("../schemas/user");
var User=mongoose.model("User",UserSchema)


module.exports=User