/**
 * Created by soul on 2015/12/24.
 */
app.directive("snow",function(){
    return{
        restrict:"A",
        link:function(scope,element,attr){
            $(element).height($(document).height())
            $(element).particleground();
            $(".snow-row").css("marginTop",(-$(document).height()))
            $(".snow-hello").height($(document).height())
        }
    }
})



