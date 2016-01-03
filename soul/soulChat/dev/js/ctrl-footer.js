/**
 * Created by soul on 2015/12/26.
 */
app.controller("footer",function($scope,$rootScope,$cookies,$http,$state){
    $scope.userLogout=function(){
        $http({
            method:"get",
            url:"/logout"
        })
            .success(function(data){
                if(data.isLogout){
                    $rootScope.isSession=false;
                    $rootScope.session_user={};
                    $cookies.remove("connect.sid")
                    $state.go("index")
                }
            })
    }

})