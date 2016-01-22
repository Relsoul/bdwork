/**
 * Created by soul on 2016/1/12.
 */
function userInfo($scope,server,checkLogin,$stateParams,Upload,$http,$window,$timeout){
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
        $scope.user_info.is_owner=true;

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





}