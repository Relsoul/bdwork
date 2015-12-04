var http=require("http");
var qs=require("querystring");

function send(query){
	http.request({
		"host":"127.0.0.1",
		"port":3100,
		"method":"POST",
		"url":"/"
	},function(res){
		res.setEncoding("utf-8");
		res.on("data",function(data){
			console.log(data)
		 console.log("请求成功")
		 process.stdout.write("\r\n 请再输入你的名字:")
		})
	}).end(qs.stringify({name:query}))
}

process.stdout.write("第一次输入你的名字:");
//重置输入
process.stdin.resume();
process.stdin.setEncoding("utf-8");
process.stdin.on("data",function(name){
	send(name.replace("\n",""))
})


