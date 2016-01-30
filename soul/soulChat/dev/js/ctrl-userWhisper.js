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
        server.getWhisperMessage('$stateParams.id')
    }
    server.getWhisperUser($rootScope.session_user["_id"]);
    $scope.$on("getWhisperUser",function(e,d){
        console.log('getWhisper',d)
        $scope.users=d;
    })

}