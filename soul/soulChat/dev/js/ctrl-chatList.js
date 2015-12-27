/**
 * Created by soul on 2015/12/27.
 */
function chatList ($scope,$http,socket,$state,$rootScope){
    $http({
        method:"post",
        url:"/api/getroom",
    })
        .success(function(data){
            $scope.rooms=data.rooms
        })

    $scope.goRoom=function(roomId){
        socket.emit("joinRoom",{
            _id:$rootScope.session_user._id,
            roomId:roomId,
            name:$rootScope.session_user.name,

        })
        $state.go("chat",{
            roomId:roomId
        })
    }
}