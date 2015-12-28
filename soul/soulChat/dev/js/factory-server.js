/**
 * Created by soul on 2015/12/27.
 */
app.factory("server",function($rootScope,socket,$cacheFactory,$interval){
    var cache = window.cache = $cacheFactory('soulChat');
    socket.on("soulChat",function(data){
        switch(data.action){
            case "getAllRooms":
                angular.copy(data.data,cache.get("rooms_config"))
                console.log("getAllRooms",cache.get("rooms_config"))
                break;
            case "getRoom":
               var roomId=data.data.room;
               var _user=data.data.user
               var _message=data.data.message
                cache.get(roomId).user=_user
                cache.get(roomId).message=_message
                console.log(cache.get(roomId))
                break;
            case "sendMessage":
                var _data=data.data,
                    message=_data.message
                    roomId=_data.roomId
                cache.get(roomId)["message"].push(message)
                break

        }

    })

    return{
        getRooms:function(){
            if(!cache.get("rooms_config")){
                cache.put('rooms_config', {})
            }
            socket.emit("soulChat",{
                action:"getAllRooms"
            })
            return cache.get("rooms_config")
        },
        /*
         *
         * join:{
         *   userId:userId
         *   username:username,
         *   roomId:roomId,
         * }
         *
         * */
        joinRoom:function(join){
            socket.emit("soulChat",{action:"joinRoom",data:{"join":join}})
        },
        getRoom:function(roomId){
            if(!cache.get(roomId)){
                cache.put(roomId, {})
            }
            socket.emit("soulChat",{action:"getRoom",data:{"roomId":roomId}})
            return cache.get(roomId)
        },
        /*
        *
        * message:{
        *   userId:userId
        *   username:username,
        *   roomId:roomId,
        *   content:message
        * }
        *
        * */
        sendMessage:function(message){
            socket.emit("soulChat",{
                action:"sendMessage",
                data:message
            })
        }
    }
})