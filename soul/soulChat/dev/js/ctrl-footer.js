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