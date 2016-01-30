/**
 * Created by soul on 2016/1/19.
 */
module.exports={
    host:"soulchat.cn",
    static:"public",//相当于__dirname
    view:"./app/views",
    upload:this.static+"/upload",
    avatar:"http://"+this.host+"/"+this.upload+"/avatar",
}