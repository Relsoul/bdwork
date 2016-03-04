/**
 * Created by soul on 2015/12/27.
 */
app.factory("server",function($rootScope,socket,$cacheFactory,$interval,$state,$sce){
    var cache = window.cache = $cacheFactory('soulChat');
    socket.on("soulChat",function(data){
        switch(data.action){
            case "getAllRooms":
                $rootScope.$broadcast("get_rooms",data.data)
                break;
            case "getRoom":
                var _data=data.data,
                    roomId=data.data.room,
                    _user=data.data.user,
                    _message=data.data.message,
                    _music= data.data.music,
                    _name=data.data.name;
                    _background=data.data.background
                _music=_music.map(function(n){
                    var _obj={}
                    _obj.name= n.name
                    _obj.src=$sce.trustAsResourceUrl(n.src)
                    return _obj
                })
                cache.get(roomId).user=_user
                cache.get(roomId).message=_message
                cache.get(roomId).music=_music
                cache.get(roomId).name=_name
                cache.get(roomId).background=_background

                console.log(cache.get(roomId),"roomID:",roomId)
                $rootScope.$broadcast("musicList",true)
                $rootScope.$broadcast("getRoomDone",true)

                break;
            case "updateUserList":
                var _data=data.data,
                    roomId=_data.roomId,
                    _user=_data.user;
                console.log(39,"updateUserList",_data);
                console.log(40,"getRoom前信息",cache.get(roomId));
                    var is_exist;
                    cache.get(roomId).user.forEach(function(e,i){
                        if(e.userId==_user.userId){
                            is_exist=true
                        }
                    })
                    if(!is_exist){
                        cache.get(roomId).user.push(_user)
                    }
                $rootScope.$broadcast("updateUserList",true)
                console.log(40,"getRoom后信息",cache.get(roomId));
                break;
            case "sendMessage"||"addImg":
                var _data=data.data,
                    message=_data.message
                    roomId=_data.roomId
                if(!cache.get(roomId)){
                    cache.put(roomId, {})
                }
                cache.get(roomId)["message"].push(message)
                console.log("message",cache.get(roomId)["message"])
                break
            case "addMusic":
                var _data=data.data,
                    roomId=_data.roomId
                    new_music=_data.music
                    _data.music.src=$sce.trustAsResourceUrl(_data.music.src)
                if(cache.get(roomId)["music"].length==0){
                    cache.get(roomId)["music"].push(new_music)
                    $rootScope.$broadcast("musicList",true)
                }else{
                    cache.get(roomId)["music"].push(new_music)
                }
                console.log("musid data",_data,roomId,cache.get(roomId))

                console.log("musid data",_data)
                console.log("music get room id",cache.get(roomId))
                break
            case "getUserInfo":
                 var _data=data.data;
                $rootScope.$broadcast("user_info",_data);
            case "getWhisperUser":
                var _data=data.data;
                $rootScope.$broadcast("getWhisperUser",_data);
            case 'sendWhisperMessage':
                var _data=data.data;
                $rootScope.$broadcast("sendWhisperMessage",_data);
            case "getWhisperMessage":
                var _data=data.data;
        }
    })

    socket.on("err",function(data){
        $state.go("error")
        $rootScope.err_data=data
    })

    return{
        getRooms:function(){
            if(!cache.get("rooms_config")){
                cache.put('rooms_config', {})
            }
            socket.emit("soulChat",{
                action:"getAllRooms"
            })
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
        },
        /*
         *
         * message:{
         *   userId:userId
         *   username:username,
         *   toUserId:id,
         *   content:message
         * }
         *
         * */
        sendWhisperMessage:function(message){
            socket.emit("soulChat",{
                action:"sendWhisperMessage",
                data:message
            })
        },
        /*
        * addMusic:{
        *   roomId:roomId,
        *   username:username,
        *   music:musicUrl
        *
        * }
        *
        * */
        addMusic:function(addMusic){
            socket.emit("soulChat",{
                action:"addMusic",
                data:addMusic
            })
        },
        offLine:function(userId){
            socket.emit("soulChat",{
                action:"offLine",
                data:userId
            })
        },
        addImg:function(addImg){
            socket.emit("soulChat",{
                action:"addImg",
                data:addImg
            })

        },
        getUserInfo:function(id){
            socket.emit("soulChat",{
                action:"getUserInfo",
                data:id
            })
        },
        getWhisperUser:function(id){
            socket.emit('soulChat',{
                action:"getWhisperUser",
                data:id
            })

        },
        getWhisperMessage:function(user_id){
            socket.emit("soulChat",{
                action:"getWhisperMessage",
                data:{
                    from:user_id.from,
                    to:user_id.to
                }
            })
        },
        createWhisperMessage:function(user_id){
            socket.emit("soulChat",{
                action:"createWhisperMessage",
                data:{
                    from:user_id.from,
                    to:user_id.to
                }
            })
        }

    }
})