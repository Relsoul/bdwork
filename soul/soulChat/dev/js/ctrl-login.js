/**
 * Created by soul on 2015/12/25.
 */
function login($scope,$http,$state,$window,$cookies,$rootScope){
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
                                    $rootScope.session_user["roomId"] = data.roomId
                                    $rootScope.isSession = data.isSession
                                    console.log("session", $rootScope.session_user)
                                    $state.go("chat", {roomId: $rootScope.session_user["roomId"]})
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