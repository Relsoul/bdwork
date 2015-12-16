var qn = require("qiniu");
var fs = require("fs");
var node_path = require("path");
var request = require("request");
var _=require("underscore");
function Qiniu(obj, qiniu, fs) {
    var qiniu = qiniu, fs = fs;
    qiniu.conf.ACCESS_KEY = obj.AK;
    qiniu.conf.SECRET_KEY = obj.SK;
    var bucket = obj.bucket;
    var uptoken = new qiniu.rs.PutPolicy(bucket).token();
    var extra = new qiniu.io.PutExtra();
    var dir_path = obj.path;
    var client = new qiniu.rs.Client();
    var domain = obj.domain;

    return {
        getDir: function (cb) {
            var path = node_path.join(__dirname, dir_path)
            var dirs = [];
            //用来存储最后获得的目录
            var over_dir=[];
            //获取存储最后获得的文件
            var over=[];
            //初始化
            dirs.push(path);

            function forFiles(files, file_path) { // 循环目录下所有文件
                var fixdir = [];
                var arrlength=files.length;
                files.forEach(function (e, i) {
                    var e = node_path.join(file_path,e);
                    fs.stat(e, function (err, stat) {
                        arrlength--
                        if (stat.isDirectory()) { // 为目录则给over_dir添加目录
                            fixdir.push(e)
                            over_dir.push(e)
                        }else{ // 给over添加文件
                            over.push(e)
                        };
                        if(arrlength==0){
                            if(file_path==over_dir[over_dir.length-1]){ // 当次循环的目录是否等于over_dir的最后一个目录
                                 cb(over,over_dir)
                            }
                            if(fixdir.length>0){ //如果获取到文件夹
                                forDir(fixdir)
                            }
                        }
                     /*   if (i == files.length - 1) { // 当次循环目录结束

                        }*/
                    })
                })
            }
            function forDir(dirs) {
                dirs.forEach(function (e, i) {
                    fs.readdir(e, function (err, files) {
                        forFiles(files,e)
                    })
                })
            }
            forDir(dirs)
        },
        getAk: function () {
            return AK
        },
        getSk: function () {
            return SK
        },
        getUptoken: function () {
            return uptoken
        },
        uploadFile: function () {
            var _this=this
            var dir = function (files) {
                //console.log(74,files)
                _this.listBucket(function(serverList){
                    startCompared(serverList,files)
                })
            }
            var startCompared=function(serverList,ClientList){
                //console.log(serverList,ClientList)
                var serverList=serverList.items
                serverList=serverList.map(function(e){
                    var _result=node_path.join(__dirname,dir_path,e.key)
                    return _result
                })
                var compared_list=serverList.concat(ClientList)
                var temp=[]; var temp_arr=[];
                serverList.forEach(function(e,i){
                    temp[e]=true
                });
                ClientList.forEach(function(e,i){
                    if(!temp[e]){
                        temp_arr.push(e)
                    }
                })

                function upload(files){
                    if(_.isArray(files)){
                        files.forEach(function(e,i){
                            fs.readFile(e,function(err,data){
                                var file_name=e.replace(node_path.join(__dirname,dir_path),"").replace(/\\/gi,"\/").substr(1)
                                qiniu.io.put(uptoken,file_name,data,extra,function(err,ret){
                                    if(err){
                                        console.log("上传失败")
                                    }
                                    else{
                                        console.log(ret)
                                    }

                                })
                            })
                        })
                    }
                }
                if(temp_arr.length>0){
                    upload(temp_arr)
                }

            }



            this.getDir(dir)



        },
        getFile: function () {
            var createFile = function (ret) {
                var down_files = [];
                var items_len=ret.items.length
                ret.items.forEach(function (e, i) {
                    var files = e.key;
                    var dir_name = files.match(/[a-zA-Z0-9]+\//gi);
                    var first_dir_name = node_path.join(__dirname, dir_path, dir_name.join(""))
                    fs.exists(first_dir_name, function (exists) {
                        items_len--
                        if (!exists) {
                            var before_path = ""
                            var dir_len=dir_name.length
                            dir_name.forEach(function (e_t, i_t) {
                                var e = e_t;
                                before_path += e;
                                var create_dir_name = node_path.join(__dirname, dir_path, before_path)
                                fs.exists(create_dir_name, function (exists) {
                                    dir_len--
                                    if (!exists) {
                                        fs.mkdir(create_dir_name, function (err) {
                                        })
                                    } else {
                                        if (dir_len==0) {
                                            down_files.push(files)
                                        }
                                    }
                                })
                            })
                        } else {
                            down_files.push(files);
                            if(items_len==0){
                                downFile(down_files)
                            }
                        }
                    })

                })



                function downFile(urls) {
                    urls.forEach(function (e, i) {
                        var first_dir_name = node_path.join(__dirname, dir_path, e)

                        request(domain + e).on("end", function () {
                            console.log("下载完成", "下载文件为:" + first_dir_name)
                        }).pipe(fs.createWriteStream(first_dir_name))
                    })

                }


            }
            this.listBucket(function(ret){
                createFile(ret)
            })
        },
        listBucket: function (cb) {
            qiniu.rsf.listPrefix(bucket, null, null, null, function (err, ret) {
                cb(ret)
            })
        }

    }
}

var initqn = Qiniu({
    AK: "",
    SK: "",
    path: "/uploadQN",
    bucket: "soul",
    domain: "http://cdn.emufan.com/"
}, qn, fs, request)

var arg = process.argv.splice(2);

if (arg[0] == "get") {
    initqn.getFile()

} else if (arg[0] == "upload") {
    initqn.uploadFile()

} else if (arg[0] == "list") {
    initqn.listBucket(function(ret){
        var ret=ret.items;
        ret=ret.map(function(e){
            return e.key
        })
        console.log(ret)
    })
} else {
    console.log("please input get or upload or list")
}
