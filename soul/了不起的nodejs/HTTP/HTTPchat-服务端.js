var http=require("http");
var qs=require("querystring");

http.createServer(function(req,res){
	var body="";
	req.on("data",function(data){
		body+=data
	})
	req.on("end",function(){
	res.writeHead(200);
	res.end("okay")
	console.log("接受到的name参数为:"+qs.parse(body).name)
	})
	
}).listen(3100,function(){console.log("run 3100 port")})
