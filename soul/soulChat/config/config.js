/**
 * Created by soul on 2016/1/19.
 */




var obj=function(){
    this.host='soulchat.cn';
    this.static='public';
    this.view="./app/views";
    this.upload=this.static+"/upload";
    this.avatar="http://"+this.host+"/"+this.upload+"/avatar";
}

module.exports=obj