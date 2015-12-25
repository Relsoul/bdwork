/**
 * Created by soul on 2015/12/24.
 */
app.directive("reg", function () {
    return {
        restrict: "E",
        templateUrl: "register.html",
        controller: function ($scope) {
            $scope.hello = "hello"
            $scope.name_info="请输入用户名"
        }
    }
})

app.directive("ensureUnique", function ($http, $timeout, $window) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelController) {
            scope.$watch(attrs.ngModel, function (n) {
                console.log("$window", $window, "window", window)
                console.log(n)
                if (!n)return;
                $timeout.cancel($window.timer);
                $window.timer = $timeout(function () {
                    $http({
                        method: "get",
                        url: "/api/checkusername/",
                        params: {
                            "username": n
                        }
                    })
                        .success(function (data) {
                            ngModelController.$setValidity("unique", data.isUnique)
                            scope.name_info="用户名"

                         })
                }, 500)
            })
        }
    }
})
