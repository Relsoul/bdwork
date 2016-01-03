/**
 * Created by soul on 2015/12/27.
 */
function chatList ($scope,$http,socket,$state,$rootScope,server,checkLogin){
    $scope.rooms_config=server.getRooms()
    $scope.goRoom=function(roomId){
        $state.go("chat",{
            roomId:roomId
        })
    }
}