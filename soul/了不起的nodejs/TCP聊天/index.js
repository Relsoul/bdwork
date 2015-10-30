var net=require("net")
//创建net服务器
var count=0;
var users={};
var server=net.createServer(function(conn){
	var nickname;
	//设置获取客户端输入编码
	conn.setEncoding("utf8")
	count++
	conn.write("welcome now conn:"+count+" please input your name and press enter:\r\n")
	console.log("当前连接数为:"+count)
	//监听退出事件
	conn.on("close",function(){
		count--
		//删除相应的conn
		delete users[nickname]
		console.log("退出一位链接 当前链接数为"+count)
	})
	//监听用户输入事件
	conn.on("data",function(data){
		data=data.replace("\r\n","")
		/*
		 *  这里相当于做路由,因为我们只能监听用户的输入 
		 * 根据用户第一次输入来判断是否输入了姓名,以及用户后续的输入判别为聊天消息
		 * 
		 * */
		//如果还不存在注册姓名
		if(!nickname){
			//用户输入了触发了data时间 然后再根据data检测.
			//检测用户名是否重复
			if(users[data]){
				conn.write("\r\n nickname already in use try agin: ")
				return false;
			}else{
				//注册用户名
				nickname=data
				//存储每一个用户链接
				//conn相当于身份证 这里就可以通过key value来索引到conn看
				users[nickname]=conn
				for(var i in users){
					users[i].write("\r\n"+nickname+"joined the room\r\n")
				}
			}
			//用户输入了姓名后的消息都视为聊天记录
		}else{
			//聊天消息
			//把消息发送给每个用户
			for(var i in users){
				//除了发送者本人
				if(i!=nickname){
					users[i].write(nickname+": "+data+"\r\n")
				}
			}
		}
		
	})
})
server.listen(4120,function(){
	console.log("监听4120端口")
})
