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

    //验证设置session 使用官方推荐API
    io.use(function(socket,next){
        console.log("socket 登陆验证");
        if(!socket.handshake.headers.cookie||typeof socket.handshake.headers.cookie != 'string'){
            return false
        }
        var user_cookie=cookie.parse(socket.handshake.headers.cookie);
        if(!('connect.sid' in user_cookie)){
            return false
        }
        var sessionid = user_cookie['connect.sid'];
        if (sessionid) {
            var sid = sessionid.split(':')[1].split('.')[0];
            //用mongodb查询语法
            mongoose.connection.db.collection("sessions", function (err, collection) {
                collection.find({_id: sid}).toArray(function (err, results) {
                    console.log('session',err,results)
                    if (!results.length||err) {
                        return false
                    } else {
                        socket.session = JSON.parse(results[0].session)
                        console.log(23, socket.session)
                        next()
                    }
                });
            });
        }
    })
/*    io.set("authorization", function (handshakeData, callback) {
        //解析cookie
        //console.log('cookie',handshakeData.headers)
        if(!handshakeData.headers.cookie||typeof handshakeData.headers.cookie != 'string'){
            return false
        }
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie)
        console.log(handshakeData.cookie)
        var sessionid = handshakeData.cookie['connect.sid']
        if (sessionid) {
            var sid = sessionid.split(':')[1].split('.')[0];
            //用mongodb查询语法
            mongoose.connection.db.collection("sessions", function (err, collection) {
                collection.find({_id: sid}).toArray(function (err, results) {
                    console.log('session',err,results)
                    if (!results.length||err) {
                        callback(err, false)
                    } else {
                        handshakeData.session = JSON.parse(results[0].session)
                        console.log(23, handshakeData.session)
                        callback(null, true)
                    }
                });
            });
        }
    })*/

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
        //var _name=socket.request.session.user.name;
        console.log("session",socket.session)


    })
}
























