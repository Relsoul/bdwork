/**
 * Created by soul on 2015/12/22.
 */
var cookie=require("cookie");
var mongoose=require("mongoose");
var user_model=require("../app/models/user");
var message_model=require("../app/models/message");
var room_model=require("../app/models/room");
var socketApi=require("./socketApi")


module.exports=function(app,io) {

    //验证设置session
    io.set("authorization", function (handshakeData, callback) {
        //解析cookie
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie)
        console.log(handshakeData.cookie)
        var sessionid = handshakeData.cookie['connect.sid']
        if (sessionid) {
            var sid = sessionid.split(':')[1].split('.')[0];
            //用mongodb查询语法
            mongoose.connection.db.collection("sessions", function (err, collection) {
                collection.find({_id: sid}).toArray(function (err, results) {
                    if (err) {
                        callback(err, false)
                    } else {
                        handshakeData.session = JSON.parse(results[0].session)
                        console.log(23, handshakeData.session)
                        callback(null, true)
                    }
                });
            });
        }
    })

    io.sockets.on("connection", function (socket) {

        /*
        *
        * .action:动作
        * .data:附加数据
        *
        *
        * */
        socket.on("soulChat",function(request){
            console.log(40,request)
            socketApi[request.action](request.data,socket,io)
        })

        //获取用户session
        var _name=socket.request.session.user.name;


    })
}
























