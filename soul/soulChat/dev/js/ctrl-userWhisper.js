/**
 * Created by soul on 2016/1/21.
 */
function userWhisper($scope,$scope,$http,$cookies, socket, $stateParams, server, $rootScope, $state,checkLogin){
    console.log("chatIndex rootscope",$rootScope)
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    })


    //无
    if($stateParams.id){
        server.createWhisperMessage({from:$rootScope.session_user["_id"], to:$stateParams.id})
        server.getWhisperMessage({from:$rootScope.session_user["_id"], to:$stateParams.id});
        $scope.is_chat=true;
        $scope.whisper=[];
        $scope.$on("sendWhisperMessage",function(e,d){
            $scope.whisper.push(d)
        })
    }


    //发送消息
    $scope.sendMessage = function () {
        var _content = $scope.send_message
        server.sendWhisperMessage({
            userId: $rootScope.session_user["_id"],
            username: $rootScope.session_user["name"],
            toUserId: $stateParams.id,
            content: _content
        })
        $scope.send_message = ""
    }

    server.getWhisperUser($rootScope.session_user["_id"]);
    $scope.$on("getWhisperUser",function(e,d){
        console.log('getWhisper',d)
        $scope.users=d;
    })

}