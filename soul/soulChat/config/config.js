/**
 * Created by soul on 2016/1/19.
 */


var obj={
    host:"soulchat.cn",
    static:"public",//相当于__dirname
    view:"./app/views",
    upload:this.static+"/upload",
    avatar:"http://"+this.host+"/"+this.upload+"/avatar",
}

module.exports={
    host:obj.host,
    static:obj.static,//相当于__dirname
    view:obj.view,
    upload:obj.upload,
    avatar:obj.avatar
}