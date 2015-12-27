/**
 * Created by soul on 2015/12/25.
 */
function login($scope,$http,$state,$window){
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
            if(data.isLogin){
                //$window.sessionStorage.setItem(user, JSON.stringify(data.user))
                $state.go("chat",{chatId:"tiro"})
            }
        })
    }
}