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