//引入express同时实例化
var app = require("express")();
//创建http服务器
var http = require("http").Server(app);
//引入socket.io同时加载http服务器
var io = require("socket.io")(http)

app.get("/", function(req, res) {
	res.send("<h1>Hello 欢迎来到socket.io</h1>")
})





//在线用户
var onlineUsers = {};

//当前在线人数
var onlineCount = 0;

//初始化socket
io.on("connection", function(socket) {
	//这里的socket才是socket..
	console.log("一个新用户连接了");
	//监听新用户加入
	socket.on("login", function(obj) {
		//这里的obj是个很重要的东东.后面再来看
		//接受前端传来的 obj
		//格式为 {userid:this.id,username:this.username}
		socket.name = obj.userid
			//如果onlineUsers不存在当前用户
		if (!onlineUsers.hasOwnProperty(obj.userid)) {
			//onlineUsers.obj.userid=obj.username
			//以用户id作为索引添加用户名
			onlineUsers[obj.userid] = obj.username
			onlineCount++
		}

		//广播用户加入
		//这里的obj指的是前端传来的obj
		io.emit("login", {
			onlineUser: onlineUsers,
			onlineCount: onlineCount,
			user: obj
		})
		console.log(obj.username + "加入了聊天室")
	})

	//监听用户退出 未完成
	socket.on("disconnect", function(obj) {
		//将退出用户从在线列表删除
		//如果存在当前退出用户
		if (onlineUsers.hasOwnProperty(obj.userid)) {
			//退出用户信息
			//
			var obj = {
				userid: socket.name,
				username: onlineUsers[socket.name]
			}
			delete onlineUsers[socket.name];
			onlineCount--
		}
		//广播用户退出
		io.emit("logout", {
			onlineUsers: onlineUsers,
			onlineCount: onlineCount,
			user: obj
		})
		console.log(obj.username + "退出聊天室")
	})

	socket.on("message", function(obj) {
		//向所有客户端发送消息

		/*obj为客户端传递过来的参数
		 * 
		 * 
		 * obj{
		 * userid:chat.userid,
			username:chat.username,
			content:content	
		 * 
		 * }*/
		io.emit("message", obj);
		console.log(obj.username + "说:" + obj.content)
	})

})

//监听3000端口
http.listen(3000, function() {
	console.log("服务器监听端口3000")
})