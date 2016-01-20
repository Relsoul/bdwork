/**
 * Created by soul on 2015/12/27.
 */
function chatList($scope, $http, socket, $state, $rootScope, server, checkLogin) {
    server.getRooms()
    $scope.rooms = [];
    var rooms_hash;


    $scope.$on("get_rooms", function (err, data) {
        $scope.rooms_config = data
        console.log(7, $scope.rooms_config)
        $scope.rooms_config.users.forEach(function (e, i) {
            if(rooms_hash){
                console.log("有hash运行")
                for (var m in rooms_hash) {
                    console.log("for in")
                    if (e.roomId == m) {
                        console.log("no hash")
                        rooms_hash[m].users.push(e)
                        return false
                    } else {
                        console.log("no hash")
                        $scope.rooms_config.categorys.forEach(function (z, k) {
                            z.rooms.forEach(function (s, n) {
                                s.users = []
                                if (s._id == e.roomId) {
                                    rooms_hash[s._id] = $scope.rooms_config.categorys[i].rooms[n]
                                    s.users.push(e)
                                }
                            })
                        })
                    }
                }
            }else{
                console.log("没hash运行")
                $scope.rooms_config.categorys.forEach(function (z, k) {
                    z.rooms.forEach(function (s, n) {
                        s.users = []
                        if (s._id == e.roomId) {
                            if(!rooms_hash){
                                rooms_hash={}
                            }
                            rooms_hash[s._id] = $scope.rooms_config.categorys[i].rooms[n]
                            s.users.push(e)
                        }
                    })
                })
            }
        })

    })



    $scope.goRoom = function (roomId) {
        $rootScope.session_user['roomId']=roomId
        $state.go("chat", {
            roomId: roomId
        })
    }
}