/**
 * Created by soul on 2016/1/12.
 */
function userInfo($scope,server,checkLogin,$stateParams){
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    })

    //无
    if(!$stateParams.id){
        $state.go("login")
        return false
    }

}