/**
 * Created by soul on 2015/12/26.
 */

app.directive('ctrlEnterBreakLine', function() {
    return function(scope, element, attrs) {
        var ctrlDown = false
        element.bind("keydown", function(evt) {
            if (evt.which === 17) {
                ctrlDown = true
                setTimeout(function() {
                    ctrlDown = false
                }, 1000)
            }
            if (evt.which === 13) {
                if (ctrlDown) {
                    element.val(element.val() + '\n')
                } else {
                    scope.$apply(function() {
                        scope.$eval(attrs.ctrlEnterBreakLine);
                    });
                    evt.preventDefault()
                }
            }
        });
    };
});



function chat($scope,$http,$cookies,socket,$stateParams,server,$rootScope,$state){
        if(!$rootScope.session_user["_id"]){
            return $state.go("login")
        }
        //console.log(33,newValue, oldValue)
            server.joinRoom({
                userId:$rootScope.session_user["_id"],
                username:$rootScope.session_user["name"],
                roomId:$stateParams.roomId
            })
            $scope.room=server.getRoom($stateParams.roomId)




    $scope.sendMessage=function(){
        var _content=$scope.send_message
        server.sendMessage({
            userId:$rootScope.session_user["_id"],
            username:$rootScope.session_user["name"],
            roomId:$stateParams.roomId,
            content:_content
        })
        $scope.send_message=""
    }





}