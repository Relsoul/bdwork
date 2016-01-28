/**
 * Created by soul on 2015/12/26.
 */
app.factory("socket",function($rootScope){
    var socket_url="ws://soulchat.cn/"
    var socket=io(socket_url)
    return{
        on:function(eventName,callback){
            socket.on(eventName,function(){
                var args=arguments;
                $rootScope.$apply(function(){
                    callback.apply(this,args)
                })
            })
        },
        emit:function(eventName,data,callback){
            socket.emit(eventName,data,function(){
                var args=arguments;
                $rootScope.$apply(function(){
                    if(callback){
                        callback.apply(socket,args)
                    }
                })
            })
        }
    }
})