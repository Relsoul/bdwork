/**
 * Created by soul on 2016/1/19.
 */
module.exports={
    host:"127.0.0.1:3000",
    static:"public",//相当于__dirname
    view:"./app/views",
    upload:this.static+"/upload",
    avatar:"http://"+this.host+"/"+this.upload+"/avatar",
}