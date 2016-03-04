/**
 * Created by soul on 2015/12/23.
 */
var app=angular.module("soulChat",["ui.router","ngCookies","ngSanitize",'ngFileUpload']);

app.run(function($rootScope,$window,$cookies,$http,$state,$templateCache){
    $rootScope.session_user={};
    $rootScope.rooms_config=null;

    console.log("run");
    //根据session获取name 类似于中间件
    $rootScope.$on("$stateChangeStart",function(evt, next, toParams, fromState, fromParams){
            console.log("视图更改！！");
            var sid=$cookies.get("connect.sid");
            if(!$rootScope.isSession){
                if(sid){
                    evt.preventDefault()
                    var _sid=sid.split(':')[1].split('.')[0];
                    console.log(_sid)
                    $http({
                        method:"get",
                        url:"/api/getname",
                    })
                        .success(function(data){
                            if(data.isSession){
                                $rootScope.session_user["name"]=data.name;
                                $rootScope.session_user["_id"]=data._id;
                                $rootScope.session_user["roomId"]=data.roomId
                                $rootScope.isSession=data.isSession;
                                $rootScope.session_user["role"]=data.role;
                                console.log(30,next,toParams,fromState,fromParams,sid)
                                $state.go(next,toParams)
                                console.log( "session",$rootScope.session_user)
                            }else{
                                $cookies.remove("connect.sid")
                            }
                        })
                }else{
                }
            }
    })
})

/**
 * Created by soul on 2015/12/26.
 */

app.directive('ctrlEnterBreakLine', function () {
    return function (scope, element, attrs) {
        var ctrlDown = false
        element.bind("keydown", function (evt) {
            if (evt.which === 17) {
                ctrlDown = true
                setTimeout(function () {
                    ctrlDown = false
                }, 1000)
            }
            if (evt.which === 13) {
                if (ctrlDown) {
                    element.val(element.val() + '\n')
                } else {
                    scope.$apply(function () {
                        scope.$eval(attrs.ctrlEnterBreakLine);
                    });
                    evt.preventDefault()
                }
            }
        });
    };
});


function chat($scope, $http, $cookies, socket, $stateParams, server, $rootScope, $state,addMusic,checkLogin,$sce) {

    console.log("chatIndex rootscope",$rootScope)
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    })

    //无
    if(!$stateParams.roomId){
        $state.go("login")
        return false
    }





    //获取当前房间信息
    $scope.room = server.getRoom($stateParams.roomId)

    $scope.$on("getRoomDone",function(){
        server.joinRoom({
            userId: $rootScope.session_user["_id"],
            username: $rootScope.session_user["name"],
            roomId: $stateParams.roomId
        });
    });

    $scope.$on("updateUserList",function(event,data){
        
        console.log(61,$scope.room.user)
        var _user=data;
        var is_exist;
        $scope.room.user.push(_user)
        console.log("更新后的$scope.room",$scope.room)
    });



    setTimeout(function(){
        console.log("now room info",$scope.room)

    },2000)

    console.log(40,"getRoom聊天页信息",$scope.room);


    //发送消息
    $scope.sendMessage = function () {
        var _content = $scope.send_message
        server.sendMessage({
            userId: $rootScope.session_user["_id"],
            username: $rootScope.session_user["name"],
            roomId: $stateParams.roomId,
            content: _content
        })
        $scope.send_message = ""
    }

    //添加音乐
    $scope.addMusic = function () {
        var musicuid=$scope.add_music_uid
       server.addMusic({
           username:$rootScope.session_user["name"],
           roomId: $stateParams.roomId,
           music:musicuid
       })
        $scope.add_music_uid=""
        $scope.add_music=false
    }

    //发送图片
    $scope.addImg=function(){
        var img_src=$scope.add_img_src;
        server.addImg({
            userId:$rootScope.session_user["_id"],
            roomId: $stateParams.roomId,
            imgsrc:img_src
        })
        $scope.add_img_src=""
        $scope.add_img=false
    }

    //跳转个人信息页面
    $scope.goUserInfo=function(id){
        $state.go('userInfo',{id:id})

    }


}
/**
 * Created by soul on 2015/12/27.
 */
function chatAdmin($scope,$http,$cookies,socket,$stateParams,checkLogin){
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    })

    function getAllCR(){
        $http({
            method:"post",
            url:"/api/getroom",
        })
            .success(function(data){
                $scope.room_info=data.info
                $scope.categorys=data.categorys
            })
    }
    getAllCR()



    $scope.newRoom=function(){
        var add_room=$scope.add_room
        var add_category=$scope.add_category
        var choice_category=$scope.choice_category;
        var over_category={
            isNewcategory:false,
            category_name:null
        }
        console.log("选择的category",choice_category)
        console.log("添加的分类",add_category)


        if(add_category){
            over_category.isNewcategory=true
            over_category.category_name=add_category
        }else{
            if(!choice_category){
                $scope.room_info="请在添加分类和选择分类中选择一个"
                return false
            }
            console.log("选择的category",choice_category)
            over_category.category_name=choice_category
        }


        if(!add_room){
            $scope.room_info="请填写房间名字"
            return false
    }
        $scope.add_room=""
        $scope.add_category=""
        console.log("over",over_category)
        $http({
            method:"post",
            url:"/api/newroom",
            data:{
                category:over_category,
                room:add_room
            }
        })
            .success(function(data){
                if(data.okay){
                    getAllCR()
                }
                $scope.room_info=data.info
            })
    }

    $scope.removeCategory=function(category){
        console.log(64,category)
        $http({
            method:"delete",
            url:"/api/removecategory/"+category._id,
        })
            .success(function(data){
                if(data.okay){
                    getAllCR()
                }
                $scope.room_info=data.info
            })
    }
    $scope.removeRoom=function(roomId,categoryId){
        console.log(roomId,categoryId)
        $http({
            method:"post",
            url:"/api/removeroom/",
            data:{
                roomId:roomId,
                categoryId:categoryId
            }
        })
            .success(function(data){
                if(data.okay){
                    getAllCR()
                }
            })
    }



}
/**
 * Created by soul on 2016/1/4.
 */
function chatAdminDetail($scope, $stateParams, checkLogin, $state, $http, $timeout) {
    //判断是否登陆
    checkLogin(1500, 0, null, function () {
        $state.go("login")
    })

    //无
    if (!$stateParams.id) {
        $state.go("login")
        return false
    }


    function getRoomDetail() {
        $http({
            method: "get",
            url: "/api/RoomDetail/" + $stateParams.id
        })
            .success(function (data) {
                if (data.isokay) {
                    $scope.categorys = data.categorys;
                    $scope.room_background = data.room_background;
                    $scope.room_name = data.room_name;
                    $scope.room_sid = data.room_sid;
                    $scope.current_category = data.current_category;
                    $scope.room_id = data.room_id;
                    $scope.old_category = data.current_category;
                }
                $scope.room_info = data.info
            })
    }

    getRoomDetail()

    $scope.room_background_show = true


    $scope.changeRoomDetail = function () {
        $http({
            method: "post",
            url: "/api/RoomDetail/" + $stateParams.id,
            data: {
                change_category: $scope.current_category,
                change_room_background: $scope.room_background,
                change_room_name: $scope.room_name,
                change_room_id: $scope.room_id,
                change_room_sid: $scope.room_sid,
                change_old_category: $scope.old_category
            }
        })
            .success(function (data) {
                if (data.isokay) {
                    getRoomDetail()
                }
                $scope.room_info = data.info
            })
    }


    $scope.addRoomBackground=function(){
        $scope.room_background.push({
            name:"背景",
            url:$scope.add_room_background
        })
        $scope.add_room_background=""
    }

    $scope.removeBackground=function(bg,index){
        console.log("index",index)
        $scope.room_background.splice(index,1)
        console.log("now bg", $scope.room_background)
    }

}
/**
 * Created by soul on 2015/12/27.
 */
function chatList($scope, $http, socket, $state, $rootScope, server, checkLogin) {
    server.getRooms()
    $scope.rooms = [];





    var getAllRooms=function(){
        var Hash=function(){
            var rooms_hash={};
            var _rooms_config;
            var isExist=function(room_id){
                return rooms_hash[room_id]||false
            };
            var addHash=function(room_id,val){
                return rooms_hash[room_id]=val
            }

            var addCategory=function(_rooms_config){
                var getRoomUsers=function(){
                    return _rooms_config.users
                };
                var getRoomCategorys=function(){
                    return _rooms_config.categorys
                }
                var getRoom=function(index){
                    return _rooms_config.categorys[index].rooms
                }
                getRoomUsers().forEach(function(user,i){
                    var room_hash=isExist(user.roomId)
                    console.log("room_hash",room_hash)
                    if(room_hash){
                        room_hash["user"].push(user)
                    }else{
                        getRoomCategorys().forEach(function(category,m){
                            getRoom(m).forEach(function(room,k){
                                if(room._id== user.roomId){
                                    room['user']=[];
                                    room['user'].push(user)
                                    addHash(room._id,room)
                                }
                            })
                        })
                    }
                })
                return _rooms_config
            }
            return{
                isExist:isExist,
                init:function(data){
                    _rooms_config=data
                    $scope.rooms_config=addCategory(_rooms_config)
                }

            }
        }()

        $scope.$on("get_rooms", function (err, data) {
            console.log(57,data)
            Hash.init(data)
            console.log("$scope.rooms_config",$scope.rooms_config)
        })
        return Hash
    }()


   /* $scope.$on("get_rooms", function (err, data) {
        $scope.rooms_config = data
        console.log(7, $scope.rooms_config)

  /!*      $scope.rooms_config.users.forEach(function (e, i) {
            if(rooms_hash){
                console.log("有hash运行")
                for (var m in rooms_hash) {
                    console.log("for in")
                    if (e.roomId == m) {
                        console.log("no hash")
                        rooms_hash[m].users.push(e)
                        return false
                    } else {
                        console.log("no hash")
                        $scope.rooms_config.categorys.forEach(function (z, k) {
                            z.rooms.forEach(function (s, n) {
                                s.users = []
                                if (s._id == e.roomId) {
                                    rooms_hash[s._id] = $scope.rooms_config.categorys[i].rooms[n]
                                    s.users.push(e)
                                }
                            })
                        })
                    }
                }
            }else{
                console.log("没hash运行")
                $scope.rooms_config.categorys.forEach(function (z, k) {
                    z.rooms.forEach(function (s, n) {
                        s.users = []
                        if (s._id == e.roomId) {
                            if(!rooms_hash){
                                rooms_hash={}
                            }
                            rooms_hash[s._id] = $scope.rooms_config.categorys[i].rooms[n]
                            s.users.push(e)
                        }
                    })
                })
            }
        })*!/
    })*/



    $scope.goRoom = function (roomId) {
        $rootScope.session_user['roomId']=roomId
        $state.go("chat", {
            roomId: roomId
        })
    }
}
/**
 * Created by soul on 2015/12/31.
 */

function chatError($scope,$state,$stateParams,$rootScope,$timeout){
    if($rootScope.err_data==null||$rootScope.err_data.megs==""||!$rootScope.err_data){
        $state.go("chatList")
        return false
    }
    $rootScope.err_data.href=$rootScope.err_data.href?$rootScope.err_data.href:"index"
    var timer=$timeout(function(){
        $state.go($rootScope.err_data.href);
        $timeout.cancel(timer);
        $rootScope.err_data==null;
    },1500)


}
/**
 * Created by soul on 2015/12/26.
 */
app.controller("footer",function($scope,$rootScope,$cookies,$http,$state,server,$location){
    $scope.userLogout=function(){
        $http({
            method:"get",
            url:"/logout"
        })
            .success(function(data){
                if(data.isLogout){
                    server.offLine($rootScope.session_user._id)
                    $rootScope.isSession=false;
                    $rootScope.session_user={};
                    $cookies.remove("connect.sid")
                    $state.go("index",{},{location:true,reload: true})
                    //$location.path("/")
                }
            })
    }

})
/**
 * Created by soul on 2015/12/26.
 */
app.controller("header",function($scope){

})
/**
 * Created by soul on 2015/12/24.
 */
app.directive("snow",function(){
    return{
        restrict:"A",
        link:function(scope,element,attr){
            $(element).height($(document).height())
            $(element).particleground();
            $(".snow-row").css("marginTop",(-$(document).height()))
            $(".snow-hello").height($(document).height())
        }
    }
})




/**
 * Created by soul on 2015/12/25.
 */
function login($scope,$http,$state,$window,$cookies,$rootScope,$timeout,$location){
    if($rootScope.isSession){
        $scope.login_info="你已经登陆,无法重复登陆,正在跳转到聊天页"
        var timer=$timeout(function(){
             $state.go("chat", {roomId: $rootScope.session_user["roomId"]},{reload:true})
            $scope.login_info=""
            $timeout.cancel(timer)
        },1500)
        return false
    }

    $scope.userLogin=function(){
        var name=$scope.login.name;
        var password=$scope.login.password;
        $http({
            method:"post",
            url:"/login",
            data:{
                "login_name":name,
                "login_password":password
            }
        }).success(function(data){
            $scope.login_info=data.login_info
            if(data.isLogin) {
                var sid = $cookies.get("connect.sid");
                if (!$rootScope.isSession) {
                    if (sid) {
                        $rootScope.session_user={}
                        var _sid = sid.split(':')[1].split('.')[0];
                        console.log(_sid)
                        $http({
                            method: "get",
                            url: "/api/getname",
                        })
                            .success(function (data) {
                                if (data.isSession) {
                                    $rootScope.session_user["name"] = data.name;
                                    $rootScope.session_user["_id"] = data._id;
                                    $rootScope.session_user["roomId"] = data.roomId;
                                    $rootScope.session_user["role"]=data.role;
                                    $rootScope.isSession = data.isSession
                                    console.log("session", $rootScope.session_user)
                                        //$state.reload("login")
                                    $window.location.reload()
                                    //$state.go("chat", {roomId: $rootScope.session_user["roomId"]},{reload: true})


                                } else {
                                    $cookies.remove("connect.sid")
                                }
                            })
                    }
                    //$window.sessionStorage.setItem(user, JSON.stringify(data.user))
                }
            }
        })
    }
}
/**
 * Created by soul on 2015/12/24.
 */
app.directive("reg", function () {
    return {
        restrict: "E",
        templateUrl: "register.html",
        controller: function ($scope) {
            $scope.hello = "hello"
            $scope.name_info="请输入用户名，长度2-16位"
        }
    }
})

app.directive("ensureUnique", function ($http, $timeout, $window) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelController) {
            scope.$watch(attrs.ngModel, function (n) {
                console.log("$window", $window, "window", window)
                console.log(n)
                if (!n)return;
                $timeout.cancel($window.timer);
                $window.timer = $timeout(function () {
                    $http({
                        method: "get",
                        url: "/api/checkusername/",
                        params: {
                            "username": n
                        }
                    })
                        .success(function (data) {
                            ngModelController.$setValidity("unique", data.isUnique)
                            scope.name_info=data.name_info
                         })
                }, 500)
            })
        }
    }
})

/**
 * Created by soul on 2016/1/12.
 */
function userInfo($scope,server,checkLogin,$stateParams,Upload,$http,$window,$timeout,$state,$rootScope){
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    });

    //无
    if(!$stateParams.id){
        $state.go("login");
        return false
    }
    $scope.upload_img_file=null;
    $scope.$on("user_info",function(e,d){
        $scope.user_info=d;
        console.log("user_info",$scope.user_info);
        if($scope.user_info==true && typeof $scope.user_info!="object"){
           $scope.user_err='未找到此用户';
            return false
        }
        if($rootScope.session_user['_id']!=$scope.user_info._id){
            $scope.user_info.is_owner=false;
        }else{
            $scope.user_info.is_owner=true
        }


    });
    server.getUserInfo($stateParams.id);
    $scope.user_info_is_modify=false;
    $scope.showUserList=function(){
        $scope.user_info_is_modify=true;
    }

    //
    $scope.submitChange=function(upload_img){
        var _upload_img=upload_img;
        console.log(35,$scope.user_info);
        if(_upload_img){
            console.log("okay img upload",_upload_img)
            Upload.upload({
                url: '/api/user/'+$stateParams.id,
                data: {file: _upload_img, 'user_info': $scope.user_info},
                method:'POST'
            }).then(function (data) {
                data=data.data
                if(data.err){
                    $scope.user_err=data.err
                    $timeout(function(){
                        $window.location.reload()
                    },1500)
                }else{
                    $scope.user_err=data.info
                    $timeout(function(){
                        $window.location.reload()
                    },1500)
                }
            });
        }else{
            console.log("okay")
            $http({
                method:'post',
                url:'/api/user/'+$stateParams.id,
                data:{'user_info':$scope.user_info}
            })
                .success(function(data){
                    if(data.err){
                        $scope.user_err=data.err
                        $timeout(function(){
                            $window.location.reload()
                        },1500)
                    }else{
                        $scope.user_err=data.info
                        $timeout(function(){
                            $window.location.reload()
                        },1500)

                    }
                    console.log(58,data)
                })
        }
    }

    $scope.goWhisper=function(){
        $state.go('whisper',{id: $stateParams.id})
    }


}
/**
 * Created by soul on 2016/1/21.
 */
function userWhisper($scope,$scope,$http,$cookies, socket, $stateParams, server, $rootScope, $state,checkLogin){
    console.log("chatIndex rootscope",$rootScope)
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    })


    //无
    if($stateParams.id){
        server.createWhisperMessage({from:$rootScope.session_user["_id"], to:$stateParams.id})
        server.getWhisperMessage({from:$rootScope.session_user["_id"], to:$stateParams.id});
        $scope.is_chat=true;
        $scope.whisper=[];
        $scope.$on("sendWhisperMessage",function(e,d){
            $scope.whisper.push(d)
        })
    }


    //发送消息
    $scope.sendMessage = function () {
        var _content = $scope.send_message
        server.sendWhisperMessage({
            userId: $rootScope.session_user["_id"],
            username: $rootScope.session_user["name"],
            toUserId: $stateParams.id,
            content: _content
        })
        $scope.send_message = ""
    }


    server.getWhisperUser($rootScope.session_user["_id"]);
    $scope.$on("getWhisperUser",function(e,d){
        console.log('getWhisperUser',d)
        $scope.users=d;
    })

}
app.directive("musicPlayer", function ($timeout) {
    return {
        restrict: 'EA',
        templateUrl: '/musicPlay.html',
        scope: {
            room: '='
        },
        controller: function ($scope) {
            $scope.$on("musicList", function () {
                //加载歌曲列表
                $scope.music_list = $scope.room.music
                $scope.pointer = 0
                $scope.now_music = $scope.music_list[$scope.pointer]

                //歌曲当前时间
                $scope.progress_time = {
                    now: 0,
                    true_time: 0,
                    end: 0,
                }

                //播放与暂停
                $scope.musicPlay = function () {
                    //只有当歌曲触发了"canplay"事件才能点击
                    if ($scope.progress_time.end == 0) {
                        console.log("未准备")
                        return false
                    } else if ($scope.playClass) {
                        $scope.audio.pause();
                        $scope.playClass = false
                        $scope.clearAudioProgress();
                        console.log("暂停")
                    } else if ($scope.playClass == false) {
                        //获取歌曲当前时间
                        $scope.getNowTime()
                        $scope.progress_time.true_time = ($scope.progress_time.end - $scope.progress_time.now) * 1000
                        $scope.setAudioProgress($scope.progress_time.true_time)
                        $scope.audio.play();
                        $scope.playClass = true;
                        console.log("开始")
                    }
                }

                //下一曲
                $scope.musicNext = function () {

                    if ($scope.pointer >= $scope.music_list.length - 1) {
                        return false
                    }

                    //设置歌曲与进度条为初始状态
                    $scope.clearAudioProgress(true)
                    $scope.setNowTime(0)
                    $scope.pointer++
                    $scope.now_music = $scope.music_list[$scope.pointer]
                }

                //上一曲
                $scope.musicPref = function () {
                    if ($scope.pointer <= 0) {
                        return false
                    }

                    //设置歌曲与进度条为初始状态
                    $scope.clearAudioProgress(true)
                    $scope.setNowTime(0)
                    $scope.pointer--
                    $scope.now_music = $scope.music_list[$scope.pointer]
                }
            })

        },
        link: function (scope, element, attr) {
            //关于DOM操作都在这块
            scope.audio = $(".music_audio")[0]
            scope.audio_progress = $(".music-play-progress")[0];
            //当歌曲触发了canplay事件才能播放
            $(scope.audio).on("canplay", function () {
                //重置歌曲信息
                scope.progress_time.now = scope.audio.currentTime = 0
                scope.progress_time.true_time = 0
                scope.progress_time.end = scope.audio.duration
                //清除进度条
                scope.clearAudioProgress()
                scope.audio.play()
                scope.playClass = true;
                //设置进度条
                scope.progress_time.true_time = (scope.progress_time.end - scope.progress_time.now) * 1000
                scope.setAudioProgress(scope.progress_time.true_time)
                scope.$apply()
            })

            //清除进度条当前状态
            scope.clearAudioProgress = function (val) {
                $(scope.audio_progress).stop(true)
                if (val) {
                    $(scope.audio_progress).width(0)
                }
            }

            //设置进度条
            scope.setAudioProgress = function (time, cb) {
                $(scope.audio_progress).stop(true)
                $(scope.audio_progress).animate({
                    width: "100%"
                }, time, function () {
                    scope.musicNext()
                })
            }

            //获取歌曲当前时间
            scope.getNowTime = function () {
                return scope.progress_time.now = scope.audio.currentTime
            }

            //设置歌曲当前时间
            scope.setNowTime = function (val) {
                scope.progress_time.now = scope.audio.currentTime = val
            }

        }
    }
})

/**
 * Created by soul on 2015/12/30.
 */
app.factory("addMusic",function($rootScope,$http){
    var addMusicServer={}
        //?ids=[32069280]
    return addMusicServer


})
/**
 * Created by soul on 2015/12/31.
 */
app.factory("checkLogin",function($rootScope,$timeout,$state){
    function checkLoginServer(time,role,beforecb,aftercb){
        //登陆判断
        if(timer){
            $timeout.cancel(timer)
        }

        if(!$rootScope.isSession&&$rootScope.session_user["role"]<role){
            if(beforecb){
                beforecb()
            }
            var timer=$timeout(function(){
                console.log("aftercb",aftercb)
                aftercb()
                $timeout.cancel(timer)
            },time)
        }else{
            var data={}
            if(!$rootScope.isSession){
                data.megs="sorry~请先登陆"
                data.href="login"
                $rootScope.err_data=data
                $state.go("error")
            }else if($rootScope.session_user["role"]<role){
                data.megs="sorry~你无权访问此页面"
                data.href="chatList"
                $rootScope.err_data=data
                $state.go("error")
            }
        }
    }
    return checkLoginServer
})
/**
 * Created by soul on 2015/12/27.
 */
app.factory("server",function($rootScope,socket,$cacheFactory,$interval,$state,$sce){
    var cache = window.cache = $cacheFactory('soulChat');
    socket.on("soulChat",function(data){
        switch(data.action){
            case "getAllRooms":
                $rootScope.$broadcast("get_rooms",data.data)
                break;
            case "getRoom":
                var _data=data.data,
                    roomId=data.data.room,
                    _user=data.data.user,
                    _message=data.data.message,
                    _music= data.data.music,
                    _name=data.data.name;
                    _background=data.data.background
                _music=_music.map(function(n){
                    var _obj={}
                    _obj.name= n.name
                    _obj.src=$sce.trustAsResourceUrl(n.src)
                    return _obj
                })
                cache.get(roomId).user=_user
                cache.get(roomId).message=_message
                cache.get(roomId).music=_music
                cache.get(roomId).name=_name
                cache.get(roomId).background=_background

                console.log(cache.get(roomId),"roomID:",roomId)
                $rootScope.$broadcast("musicList",true)
                $rootScope.$broadcast("getRoomDone",true)

                break;
            case "updateUserList":
                var _data=data.data,
                    roomId=_data.roomId,
                    _user=_data.user;
                console.log(39,"updateUserList",_data);
                console.log(40,"getRoom前信息",cache.get(roomId));

                $rootScope.$broadcast("updateUserList",_user)
                console.log(40,"getRoom后信息",cache.get(roomId));
                break;
            case "sendMessage"||"addImg":
                var _data=data.data,
                    message=_data.message
                    roomId=_data.roomId
                if(!cache.get(roomId)){
                    cache.put(roomId, {})
                }
                cache.get(roomId)["message"].push(message)
                console.log("message",cache.get(roomId)["message"])
                break
            case "addMusic":
                var _data=data.data,
                    roomId=_data.roomId
                    new_music=_data.music
                    _data.music.src=$sce.trustAsResourceUrl(_data.music.src)
                if(cache.get(roomId)["music"].length==0){
                    cache.get(roomId)["music"].push(new_music)
                    $rootScope.$broadcast("musicList",true)
                }else{
                    cache.get(roomId)["music"].push(new_music)
                }
                console.log("musid data",_data,roomId,cache.get(roomId))

                console.log("musid data",_data)
                console.log("music get room id",cache.get(roomId))
                break
            case "getUserInfo":
                 var _data=data.data;
                $rootScope.$broadcast("user_info",_data);
            case "getWhisperUser":
                var _data=data.data;
                $rootScope.$broadcast("getWhisperUser",_data);
            case 'sendWhisperMessage':
                var _data=data.data;
                $rootScope.$broadcast("sendWhisperMessage",_data);
            case "getWhisperMessage":
                var _data=data.data;
        }
    })

    socket.on("err",function(data){
        $state.go("error")
        $rootScope.err_data=data
    })

    return{
        getRooms:function(){
            if(!cache.get("rooms_config")){
                cache.put('rooms_config', {})
            }
            socket.emit("soulChat",{
                action:"getAllRooms"
            })
        },
        /*
         *
         * join:{
         *   userId:userId
         *   username:username,
         *   roomId:roomId,
         * }
         *
         * */
        joinRoom:function(join){
            socket.emit("soulChat",{action:"joinRoom",data:{"join":join}})
        },
        getRoom:function(roomId){
            if(!cache.get(roomId)){
                cache.put(roomId, {})
            }
            socket.emit("soulChat",{action:"getRoom",data:{"roomId":roomId}})
            return cache.get(roomId)
        },
        /*
        *
        * message:{
        *   userId:userId
        *   username:username,
        *   roomId:roomId,
        *   content:message
        * }
        *
        * */
        sendMessage:function(message){
            socket.emit("soulChat",{
                action:"sendMessage",
                data:message
            })
        },
        /*
         *
         * message:{
         *   userId:userId
         *   username:username,
         *   toUserId:id,
         *   content:message
         * }
         *
         * */
        sendWhisperMessage:function(message){
            socket.emit("soulChat",{
                action:"sendWhisperMessage",
                data:message
            })
        },
        /*
        * addMusic:{
        *   roomId:roomId,
        *   username:username,
        *   music:musicUrl
        *
        * }
        *
        * */
        addMusic:function(addMusic){
            socket.emit("soulChat",{
                action:"addMusic",
                data:addMusic
            })
        },
        offLine:function(userId){
            socket.emit("soulChat",{
                action:"offLine",
                data:userId
            })
        },
        addImg:function(addImg){
            socket.emit("soulChat",{
                action:"addImg",
                data:addImg
            })

        },
        getUserInfo:function(id){
            socket.emit("soulChat",{
                action:"getUserInfo",
                data:id
            })
        },
        getWhisperUser:function(id){
            socket.emit('soulChat',{
                action:"getWhisperUser",
                data:id
            })

        },
        getWhisperMessage:function(user_id){
            socket.emit("soulChat",{
                action:"getWhisperMessage",
                data:{
                    from:user_id.from,
                    to:user_id.to
                }
            })
        },
        createWhisperMessage:function(user_id){
            socket.emit("soulChat",{
                action:"createWhisperMessage",
                data:{
                    from:user_id.from,
                    to:user_id.to
                }
            })
        }

    }
})
/**
 * Created by soul on 2015/12/26.
 */
app.factory("socket",function($rootScope){
    var socket_url="ws://soulchat.cn/"
    var socket=io(socket_url)
    return{
        on:function(eventName,callback){
            socket.on(eventName,function(){
                var args=arguments;
                $rootScope.$apply(function(){
                    callback.apply(this,args)
                })
            })
        },
        emit:function(eventName,data,callback){
            socket.emit(eventName,data,function(){
                var args=arguments;
                $rootScope.$apply(function(){
                    if(callback){
                        callback.apply(socket,args)
                    }
                })
            })
        }
    }
})
/**
 * Created by soul on 2015/12/24.
 */
app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state("login",{
            url:"/login",
            templateUrl:"login.html",
            controller:login
        })
        .state("index",{
            url:"/",
        })
        .state("chat",{
            url:"/chat/:roomId",
            templateUrl:"chatIndex.html",
            cache:false,
            controller:chat
        })
        .state("chatAdmin",{
            url:"/chatAdmin",
            templateUrl:"chatRoomAdmin.html",
            controller:chatAdmin
        })
        .state("chatList",{
            url:"/chatList",
            templateUrl:"chatRoomList.html",
            controller:chatList
        })
        .state("error",{
            url:"/error",
            templateUrl:"error.html",
            controller:chatError
        })
        .state("chatAdminDetail",{
            url:"/chatAdmin/:id",
            templateUrl:"chatRoomAdmin-detail.html",
            controller:chatAdminDetail
        })
        .state("userInfo",{
            url:"/userInfo/:id",
            templateUrl:"userInfo.html",
            controller:userInfo
        })
        .state("whisper",{
            url:'/userWhisper/:id',
            templateUrl:'whisper.html',
            controller:userWhisper
        })
})