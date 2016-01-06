/**
 * Created by soul on 2015/12/27.
 */
var cookie = require("cookie");
var mongoose = require("mongoose");
var user_model = require("../app/models/user");
var message_model = require("../app/models/message");
var room_model = require("../app/models/room");
var request=require("request");
var music_model=require("../app/models/music");
var category_model=require("../app/models/category")

var onEvent="soulChat"


exports.getAllRooms = function (data, socket) {
        var rooms_config={
            "categorys":[],
            "users":[]
        };
    category_model.getCategorys(function(err,categorys){
        if(err){
            socket.emit("err",{
                megs:err
            })
        }else{
            categorys.forEach(function(e,i){
                e.rooms.user=0;
                rooms_config.categorys.push({
                    "category_id": e._id,
                    "category_name": e.name,
                    "rooms": e.rooms
                })
            })
            user_model.find({online:true},function(err,users){
                if(err){
                    socket.emit("err",{
                        megs:err
                    })
                }else{
                    //这里设计有点问题,放浏览器去处理,不加重服务端.
                    users.forEach(function(e,i){
                        rooms_config.users.push(
                            {
                                name: e.name,
                                roomId: e._roomId
                            }
                        )
                    })
                    socket.emit(onEvent,{
                        action:"getAllRooms",
                        data:rooms_config
                    })
                }
            })
        }
    })
}

exports.getRoom=function(data,socket){
    var _roomId=data.roomId
    var data_config={}
    console.log("getRoomData",data)
    user_model.getRoom(_roomId,function(err,user){
        console.log(54,user)
        if(err){
            socket.emit("err",{
                megs:err
            })
        }else{
            user=user.map(function(n){
                var _obj={}
                _obj.username= n.name;
                _obj.userId= n._id;
                _obj.avatarUrl= n.avatarUrl;
                return _obj
            })
            data_config["room"]=_roomId;
            data_config["user"]=user;

            room_model.getMusics(_roomId,function(err,room){
                console.log(82,room)
                data_config["music"]=room.music
                data_config["name"]=room.name
                message_model.getRoomMessages(_roomId,function(err,message){
                    if(err){
                        socket.emit("err",{
                            megs:err
                        })
                    }else{
                        //console.log(75,message)
                        data_config["message"]=message
                        socket.emit(onEvent,{
                            action:"getRoom",
                            data:data_config
                        })
                    }
                })

            })


        }
    })
}

exports.sendMessage=function(message,socket,io){
    var _message=new message_model({
        content:message.content,
        user:message.userId,
        _roomId:message.roomId
    })
    _message.save(function(err,megs){

        //console.log(94,megs)
        if(err){
            socket.emit("err",{
                megs:err
            })
        }else{
            megs.getMessageInfo(megs._id,function(err,returnmegs){
                if(err){
                    console.log(103,err)

                }else{
                    console.log(105,returnmegs)
                    console.log("发送的房间为:"+message.roomId)

                    io.sockets.to(message.roomId).emit(onEvent, {
                        action: 'sendMessage',
                        data: {
                            "roomId":message.roomId,
                            "message": returnmegs[0]
                        }
                    });
                }
            })
        }
        console.log(116,megs)
    })

}


exports.joinRoom=function(join_user,socket){
        //加入房间
        /*
         *
         * join:{
         *   userId:userId
         *   username:username,
         *   roomId:roomId,
         * }
         *
         * */
    console.log(132,join_user)

    room_model.findOne({_id:join_user.join.roomId},function(err,docs){
        if(err){
            socket.emit("err",{
                code:404,
                href:"chatList",
                megs:"无法找到该房间~,正在跳转到房间列表页"
            })
        }else{
            user_model.joinRoom(join_user.join,function(err){
                console.log(134,err)
                if(err){
                    socket.emit("err",{
                        megs:err
                    })
                }else{
                    socket.join(join_user.join.roomId)
                    console.log("加入成功 房间ID为:"+join_user.join.roomId)
                }
            })
        }

    })
}

exports.offLine=function(userId,socket,io){
    console.log("off line")
   user_model.offLine(userId,function(err,user){
       console.log("off line")
        if(err){
         return console.log(err)
        }
   })
}


exports.addMusic=function(add_music,socket,io){
    var uid=add_music.music;
    var roomId=add_music.roomId;
    var username=add_music.username
    console.log("music ROOMID",roomId)

    //获取歌曲地址
    request.get("http://music.163.com/api/song/detail/?ids=["+uid+"]",function(e,r,body){
        //格式化json
        var body=JSON.parse(body);
        //console.log("body",body)
        //判断返回数据
        if("songs" in body &&body.songs.length>0){
            var music_tone=body.songs[0].hMusic||body.songs[0].mMusic||body.songs[0]
            var music_time=music_tone.playTime-60000;
            var music_src=body.songs[0].mp3Url;
            var music_name=body.songs[0].name;
            //查找到相应房间
            room_model.findOne({_id:roomId},function(err,room){
                if(err){
                    socket.emit("err",{
                        megs:err
                    })
                }else{
                    //console.log("music roomid",room)
                    var _music=new music_model({
                        src:music_src,
                        name:music_name,
                        addTime:new Date(new Date().getTime()+music_time),
                        addUser:username
                    })
                    _music.save(function(err,music){
                        if(err){
                            socket.emit("err",{
                                megs:err
                            })
                        }else{
                            console.log("music music",music)
                            room.music.push(music._id)
                            room.save(function(err,_room){
                                if(err){
                                    socket.emit("err",{
                                        megs:err
                                    })
                                }
                                io.sockets.to(roomId).emit(onEvent,{
                                    "action":"addMusic",
                                    data:{
                                        "music":music,
                                        "roomId":roomId
                                    }
                                })
                            })
                        }
                    })
                }
            })
        }
    })
}