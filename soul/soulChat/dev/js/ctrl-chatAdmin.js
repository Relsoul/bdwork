/**
 * Created by soul on 2015/12/27.
 */
function chatAdmin($scope,$http,$cookies,socket,$stateParams){

    $http({
        method:"post",
        url:"/api/getroom",
    })
        .success(function(data){
            $scope.room_info=data.info
            $scope.rooms=data.rooms
        })

    $scope.newRoom=function(){
        var add_room=$scope.add_room
        $scope.add_room=""
        $http({
            method:"post",
            url:"/api/newroom",
            data:{
                name:add_room
            }
        })
            .success(function(data){
                $scope.room_info=data.info
                $scope.rooms=data.rooms
            })
    }

    $scope.removeRoom=function(room_name){
        $http({
            method:"post",
            url:"/api/removeroom",
            data:{
                name:room_name
            }
        })
            .success(function(data){
                $scope.room_info=data.info
                $scope.rooms=data.rooms
            })
    }



}