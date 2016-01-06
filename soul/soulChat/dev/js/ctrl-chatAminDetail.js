/**
 * Created by soul on 2016/1/4.
 */
function chatAdminDetail($scope, $stateParams, checkLogin, $state, $http, $timeout) {
    //判断是否登陆
    checkLogin(1500, 0, null, function () {
        $state.go("login")
    })

    //无
    if (!$stateParams.id) {
        $state.go("login")
        return false
    }


    function getRoomDetail() {
        $http({
            method: "get",
            url: "/api/RoomDetail/" + $stateParams.id
        })
            .success(function (data) {
                if (data.isokay) {
                    $scope.categorys = data.categorys;
                    $scope.room_background = data.room_background;
                    $scope.room_name = data.room_name;
                    $scope.room_sid = data.room_sid;
                    $scope.current_category = data.current_category;
                    $scope.room_id = data.room_id;
                    $scope.old_category = data.current_category;
                }
                $scope.room_info = data.info
            })
    }

    getRoomDetail()

    $scope.room_background_show = true


    $scope.changeRoomDetail = function () {
        $http({
            method: "post",
            url: "/api/RoomDetail/" + $stateParams.id,
            data: {
                change_category: $scope.current_category,
                change_room_background: $scope.room_background,
                change_room_name: $scope.room_name,
                change_room_id: $scope.room_id,
                change_room_sid: $scope.room_sid,
                change_old_category: $scope.old_category
            }
        })
            .success(function (data) {
                if (data.isokay) {
                    getRoomDetail()
                }
                $scope.room_info = data.info
            })
    }


    $scope.addRoomBackground=function(){
        $scope.room_background.push({
            name:"背景",
            url:$scope.add_room_background
        })
        $scope.add_room_background=""
    }

    $scope.removeBackground=function(bg,index){
        console.log("index",index)
        $scope.room_background.splice(index,1)
        console.log("now bg", $scope.room_background)
    }

}