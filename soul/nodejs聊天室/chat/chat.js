var chat={
	//socket后端连接
	socket:null,
	//用户唯一id
	userid:null,
	username:null,
}

chat.initId=function(){
	//根据当前系统时间初始化id.. 正式部署得用服务器时间..
	return new Date().getTime()+""+Math.floor(Math.random()*899+100);
}

//用户加入输入用户名
chat.userSubmit=function(){
	$("#init_submit").on("click",function(){
		var username=$("#init_user").val();
		console.log(username)
		$(".userInit").hide();
		chat.init(username)
	})
	
	$("#chat_submit").on("click",function(){
		var content=$("#chat_info").val()
		//..如果content存在则执行.............
		if(content){
			console.log(typeof content)
			var obj={
				userid:chat.userid,
				username:chat.username,
				content:content
			}
		}
		//向服务端发送message事件,同时传递obj变量
		chat.socket.emit("message",obj);
		return false;
	})
	
}

chat.init=function(username){
	this.userid=this.initId();
	this.username=username;
	
	//连接后端
	this.socket=io.connect("ws://localhost:3000");
	//告诉服务端有用户登录
	//传送至后端的login 
	/*
	 * 每有一个用户加入都向后端发送一个login事件
	 * userid:chat.userid
	 * username:chat.username
	 * 
	 * */
	this.socket.emit("login",{userid:this.userid,username:this.username})
	//监听服务端发来的login广播 
	this.socket.on("login",function(o){
		//这里o指向的是后端传入进来的变量
		chat.updateSysMsg(o,"login")
	})
	//监听用户退出
	this.socket.on("logout",function(o){
		chat.updateSysMsg(o,"logout")
	})
	//监听到服务端发送消息
	this.socket.on("message",function(obj){
		//判断是服务端传来的消息还是客户端发送的消息
		/*
		 * obj{
		 * 		userid:chat.userid,
				username:chat.username,
				content:content
		 * }
		 * */
		var isme=(obj.userid==chat.userid)?true:false;
		var contentDiv="<div> 发送消息"+obj.content+"</div>";
		var usernameDiv="<span> 发送人:"+obj.username+"</span>"
		var section=$("<section></section>");
		if(isme){
			section.attr("class","user");
			section.html(contentDiv+usernameDiv)
		}else{
			section.attr("class","service");
			section.html(contentDiv+usernameDiv)
		}
		$("#chat_message").append(section)
	})

}

chat.updateSysMsg=function(o,action){
	/*
	 * o:{
	 * 		onlineUsers:后端传来的用户列表
	 * 		onlineCount:后端传来的在线用户人数
	 * 		user:{
	 * 				userid:id,
	 * 				username:username
	 * 		}
	 * }
	 * */
	//接受后端传入的在线用户列表
	var onlineUsers=o.onlineUsers;
	//接受后端传来的在线用户
	var onlineCount=o.onlineCount;
	//新加入用户的信息 user是个对象
	var user=o.user
	//更新在线人数
	var userhtml="";
	var separator="";
	for(key in onlineUsers){
		//防止把原型链上的遍历出来
		if(onlineUsers.hasOwnProperty(key)){
			//键值对生成userhtml
		userhtml+=separator+onlineUsers[key]
		separator=","
		}
	}
	$("#chat_count").html("当前共有"+onlineCount+"人在线,在线列表:"+userhtml)
	
	//添加系统消息
	action=action=="login"?"加入聊天":"退出聊天室"
	$("#chat_login").html(user.username+action)
	
}


chat.userSubmit()



