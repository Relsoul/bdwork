/**
 * Created by soul on 2015/12/27.
 */
var cookie = require("cookie");
var mongoose = require("mongoose");
var user_model = require("../app/models/user");
var message_model = require("../app/models/message");
var room_model = require("../app/models/room");

var onEvent="soulChat"


exports.getAllRooms = function (data, socket) {
        var rooms_config={}
        room_model.getRooms(function(err,rooms){
            if(err){
                socket.emit("err",{
                    megs:err
                })
            }
            rooms.forEach(function(e,i){
                rooms_config[e._id]={};
                rooms_config[e._id].roomname= e.name;
                rooms_config[e._id].user=[];
                rooms_config[e.id].roomId= e._id
            })
            user_model.getUserRooms(function(err,users){
                if(err){
                    socket.emit("err",{
                        megs:err
                    })
                }
                if(!users){
                    return socket.emit("onEvent",{
                        action:"getAllRooms",
                        data:rooms_config
                    })
                }
                users.forEach(function(e,i){
                    rooms_config[e._roomId._id].user.push({username: e.name,userId: e._id})
                })
                console.log(42,"getAllRooms")
                socket.emit(onEvent,{
                    action:"getAllRooms",
                    data:rooms_config
                })
            })
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
                _obj.userId= n._id
                return _obj
            })
            data_config["room"]=_roomId;
            data_config["user"]=user;
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