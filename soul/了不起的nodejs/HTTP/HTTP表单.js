var http=require("http");
var fs=require("fs");
var qs=require("querystring")
var app=http.createServer(function(req,res){
	if(req.url=="/"){
		res.writeHead(200,{"Content-Type":"text/html"})
		fs.readFile(__dirname+"/index.html",function(err,data){
			
			res.write(data)
			res.end()
		})
	}else if(req.url=="/url"&&req.method=="POST"){
		var body='';
		req.on("data",function(data){
			//这里必须隐式转化为字符串
			body+=data
		});
		req.on("end",function(){
			//qs.parse默认只支持字符串
			console.log(qs.parse(body))
			console.log("接收完毕")
			res.write("<h1>Content-Type:"+req.headers["content-type"]+"</h1> <h1>接收到的数据为:"+body+"</h1>"+
			"<h1>格式化后的数据为:"+JSON.stringify(qs.parse(body))+"</h1>")
			res.end()
		})
	}else{
		res.writeHead(404);
		res.end("404")
	}
	
})
app.listen(3100,function(){
	console.log("监听于3100端口")
})
