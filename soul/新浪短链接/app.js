var express=require("express");
var request=require("request");
var path=require("path");


var app=express();

var developer_info={
    app_key:"3280957344",
    app_secret:"939ab18691ad498636c900f4250b4a64",
    grant_type:"authorization_code",
    redirect_uri:"http://t.relsoul.com/oauth",
}
var access_token_url="https://api.weibo.com/oauth2/access_token";

app.use("/libs",express.static(path.join(__dirname,"libs")))

var accessToken=function(req,res,next){
    var access_token=app.get("accessToken")
    if(!access_token){
        return res.json({
            error:" get access_token error please go http://t.relsoul.com/oauth"
        })

    }
    req.access_token=access_token["access_token"];
    next()
}




app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"index.html"))
});

app.get("/api/longToShort",accessToken,function(req,res){
    console.log(38,req.access_token);
    var long_url=req.query.long_url;
    console.log(40,long_url);
    request.get({
        url:"https://api.weibo.com/2/short_url/shorten.json",
        qs:{
            access_token:req.access_token,
            url_long:long_url
        }
    },function(err,data){
        if(err){
            return res.json({
                error:err
            })
        }
        if(data.statusCode==400){
            return res.json({
                error:"please input like http://xxx.com/, and must add http:// at the beginning of  url"
            })
        }
        res.json(JSON.parse(data.body));
    })
    console.log("is okay!")
})


app.get("/oauth",function(req,res){
    var code=req.query.code;
    if(!code){
        return res.redirect("https://api.weibo.com/oauth2/authorize"+"?client_id="+developer_info.app_key+"&redirect_uri="+developer_info.redirect_uri)
    }
    request.post({
        url:access_token_url,
        qs:{
            code:code,
            client_id:developer_info.app_key,
            client_secret:developer_info.app_secret,
            grant_type:developer_info.grant_type,
            redirect_uri:developer_info.redirect_uri,
        }
    },function(err,data){
        app.set("accessToken",JSON.parse(data.body))
        console.log(52,app.get("accessToken"))
        res.json(JSON.parse(data.body))
    });

});


app.listen(3001);
console.log("running 3001")
/*setTimeout(function(){
    request.get("https://api.weibo.com/oauth2/authorize"+"?client_id="+developer_info.app_key+"&redirect_uri="+developer_info.redirect_uri,function(err,res){
        console.log(44,res)
    })
},5000)*/


