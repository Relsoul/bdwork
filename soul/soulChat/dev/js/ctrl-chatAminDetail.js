/**
 * Created by soul on 2016/1/4.
 */
function chatAdminDetail ($scope,$stateParams,checkLogin,$state,$http,$timeout){
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    })

    //无
    if(!$stateParams.id){
        $state.go("login")
        return false
    }



    function getRoomDetail(){
        $http({
            method:"get",
            url:"/api/RoomDetail/"+$stateParams.id
        })
            .success(function(data){
                if(data.isokay){

                    $scope.categorys=data.categorys;
                    $scope.room_background=data.room_background;
                    $scope.room_name=data.room_name;
                    $scope.room_sid=data.room_sid;
                    $scope.current_category=data.current_category
                }
                $scope.room_info=data.info
        })
    }
    getRoomDetail()

    $scope.room_background_show=true






}