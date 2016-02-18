var fs=require("fs");
var cheerio=require("cheerio");
var path=require("path");
var request=require("request");

var token="http://data.zz.baidu.com/urls?site=emufan.com&token=qdanRA6OJgn9r7pD";
var file_name=path.join(__dirname,"site_file.json");
var baidu_site_map_file=path.join(__dirname,"./public/baidusitemap.xml");
var is_all=false;
var arg = process.argv.splice(2);
if(arg[0]=="all"){
	is_all=true
}

function push_site(token,ary){
	var txt=ary.join("\r\n")//...要换行...囧
	request({
	method:"post",
	url:token,
    body:txt
	},function(err,re,body){
		console.log(err,body)
	})
}

var baidu_site_map=fs.readFile(baidu_site_map_file,function(err,data){
	var $=cheerio.load(data,{
		normalizeWhitespace: true,
    	xmlMode: true
	});
	var s=$("loc");
	var ary=[];
	$(s).each(function(i,e){
		ary.push($(e).text())
	})
	if(!is_all){
		var old_json=fs.readFile(file_name,function(err,data){
		if(!data||data.length==0){
			push_site(token,ary)
		}else{
			var parse_data=JSON.parse(data)
            var temp=[]; var temp_arr=[];
            parse_data.forEach(function(e,i){
                temp[e]=true
            });
            ary.forEach(function(e,i){
                if(!temp[e]){
                    temp_arr.push(e)
                }
            })
            push_site(token,temp_arr)
		}
		fs.writeFile(file_name,JSON.stringify(ary),function(err,data){
				if(err){console.log("err",err)}else{console.log("okay",data)}
			})
		})
	}else{
		push_site(token,ary)
	}

	


	


})
