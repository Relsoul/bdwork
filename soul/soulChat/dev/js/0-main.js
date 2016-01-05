/**
 * Created by soul on 2015/12/23.
 */
var app=angular.module("soulChat",["ui.router","ngCookies","ngSanitize"]);

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
