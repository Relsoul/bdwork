/**
 * Created by soul on 2015/12/26.
 */

app.directive('ctrlEnterBreakLine', function () {
    return function (scope, element, attrs) {
        var ctrlDown = false
        element.bind("keydown", function (evt) {
            if (evt.which === 17) {
                ctrlDown = true
                setTimeout(function () {
                    ctrlDown = false
                }, 1000)
            }
            if (evt.which === 13) {
                if (ctrlDown) {
                    element.val(element.val() + '\n')
                } else {
                    scope.$apply(function () {
                        scope.$eval(attrs.ctrlEnterBreakLine);
                    });
                    evt.preventDefault()
                }
            }
        });
    };
});


function chat($scope, $http, $cookies, socket, $stateParams, server, $rootScope, $state,addMusic,checkLogin,$sce) {

    console.log("chatIndex rootscope",$rootScope)
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    })

    //无
    if(!$stateParams.roomId){
        $state.go("login")
        return false
    }


    server.joinRoom({
        userId: $rootScope.session_user["_id"],
        username: $rootScope.session_user["name"],
        roomId: $stateParams.roomId
    })

    //获取当前房间信息
    $scope.room = server.getRoom($stateParams.roomId)
    








    //发送消息
    $scope.sendMessage = function () {
        var _content = $scope.send_message
        server.sendMessage({
            userId: $rootScope.session_user["_id"],
            username: $rootScope.session_user["name"],
            roomId: $stateParams.roomId,
            content: _content
        })
        $scope.send_message = ""
    }

    //添加音乐


    $scope.addMusic = function () {
        var musicuid=$scope.add_music_uid
       server.addMusic({
           username:$rootScope.session_user["name"],
           roomId: $stateParams.roomId,
           music:musicuid
       })
        $scope.add_music_uid=""
        $scope.add_music=false
    }


}