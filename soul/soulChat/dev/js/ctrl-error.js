/**
 * Created by soul on 2015/12/31.
 */

function chatError($scope,$state,$stateParams,$rootScope,$timeout){
    if($rootScope.err_data==null||$rootScope.err_data.megs==""||!$rootScope.err_data){
        $state.go("chatList")
    }

    var timer=$timeout(function(){
        $state.go($rootScope.err_data.href);
        $timeout.cancel(timer);
        $rootScope.err_data==null;
    },1500)


}