
var mongoose=require("mongoose");
var CatetorySchema=require("../schemas/catetory");
var Catetory=mongoose.model("Catetory",CatetorySchema)
module.exports=Catetory;

