/**
 * Created by soul on 2015/12/26.
 */

function chat($scope,$http,$cookies,socket,$stateParams){

    socket.emit('rooms.read', {
        _roomId: $stateParams.roomId
    })




}