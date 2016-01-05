/**
 * Created by soul on 2015/12/27.
 */
function chatAdmin($scope,$http,$cookies,socket,$stateParams,checkLogin){
    //判断是否登陆
    checkLogin(1500,0,null,function(){
        $state.go("login")
    })

    function getAllCR(){
        $http({
            method:"post",
            url:"/api/getroom",
        })
            .success(function(data){
                $scope.room_info=data.info
                $scope.categorys=data.categorys
            })
    }
    getAllCR()



    $scope.newRoom=function(){
        var add_room=$scope.add_room
        var add_category=$scope.add_category
        var choice_category=$scope.choice_category;
        var over_category={
            isNewcategory:false,
            category_name:null
        }
        console.log("选择的category",choice_category)
        console.log("添加的分类",add_category)


        if(add_category){
            over_category.isNewcategory=true
            over_category.category_name=add_category
        }else{
            if(!choice_category){
                $scope.room_info="请在添加分类和选择分类中选择一个"
                return false
            }
            console.log("选择的category",choice_category)
            over_category.category_name=choice_category
        }


        if(!add_room){
            $scope.room_info="请填写房间名字"
            return false
    }
        $scope.add_room=""
        $scope.add_category=""
        console.log("over",over_category)
        $http({
            method:"post",
            url:"/api/newroom",
            data:{
                category:over_category,
                room:add_room
            }
        })
            .success(function(data){
                if(data.okay){
                    getAllCR()
                }
                $scope.room_info=data.info
            })
    }

    $scope.removeCategory=function(category){
        console.log(64,category)
        $http({
            method:"delete",
            url:"/api/removecategory/"+category._id,
        })
            .success(function(data){
                if(data.okay){
                    getAllCR()
                }
                $scope.room_info=data.info
            })
    }
    $scope.removeRoom=function(roomId,categoryId){
        console.log(roomId,categoryId)
        $http({
            method:"post",
            url:"/api/removeroom/",
            data:{
                roomId:roomId,
                categoryId:categoryId
            }
        })
            .success(function(data){
                if(data.okay){
                    getAllCR()
                }
            })
    }



}