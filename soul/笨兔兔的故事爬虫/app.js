/**
 * Created by soul on 15-12-4.
 */

//引入request模块
var superagent=require("superagent");
//引入async并发模块
var async=require("async");
//引入DOM操作模块
var cheerio=require("cheerio");
//引入file模块
var fs=require("fs")

//生成url
var host="http://www.linuxidc.com/Linux/2010-12/30786";
var urls=[];
//urls初始化
urls.push(host+".htm");

for(var i=2;i<=129;i++){
    urls.push(host+"p"+i+".htm")
}


//并发扒取url
async.mapLimit(urls,5,function(url,callback){
    //每次爬取urls获取html
    superagent.get(url).end(function(err,html){
        if(err){console.log(err)}
        var $=cheerio.load(html.text);
        var txt=$("#content").text();
        //爬去完毕后调用callback
        callback(null,txt)
    })
},function(err,result){
    //result是129个url爬去完毕后汇总的结果
    console.log(result)
    //fs.mkdir("./txt");
    result.forEach(function(e,i){
        fs.writeFile("./txt/笨兔兔的故事.txt",e+"\n\r",{flag:"a",encoding:"utf8"},function(err){})

    })
})

