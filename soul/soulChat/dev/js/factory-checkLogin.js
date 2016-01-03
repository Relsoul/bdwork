/**
 * Created by soul on 2015/12/31.
 */
app.factory("checkLogin",function($rootScope,$timeout,$state){
    function checkLoginServer(time,role,beforecb,aftercb){
        //登陆判断
        if(timer){
            $timeout.cancel(timer)
        }

        if(!$rootScope.isSession&&$rootScope.session_user["role"]<role){
            if(beforecb){
                beforecb()
            }
            var timer=$timeout(function(){
                console.log("aftercb",aftercb)
                aftercb()
                $timeout.cancel(timer)
            },time)
        }else{
            var data={}
            if(!$rootScope.isSession){
                data.megs="sorry~请先登陆"
                data.href="login"
                $rootScope.err_data=data
                $state.go("error")
            }else if($rootScope.session_user["role"]<role){
                data.megs="sorry~你无权访问此页面"
                data.href="chatList"
                $rootScope.err_data=data
                $state.go("error")
            }
        }
    }
    return checkLoginServer
})