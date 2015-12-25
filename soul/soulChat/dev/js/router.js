/**
 * Created by soul on 2015/12/24.
 */
app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state("login",{
            url:"/login",
            templateUrl:"login.html"
        })
})