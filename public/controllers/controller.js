
var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination']);//'angularUtils.directives.dirPagination','ngRoute'

//-----------------Controller for login Page-------------------------------------------//
myApp.controller('LoginCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    console.log("hello from the controller");
    $scope.login = function () {
        console.log("Login Button Clicked");
        $http({
            method: 'POST',
            url: '/CheckUser',
            data: {
                username: $scope.loginusername,
                password: $scope.loginpassword
            },
        }).then(function successCallback(response) {

            console.log(response);
            console.log("successcallback");
            if (response.data.toString().includes("Valid")) {
                console.log("entered if loop");
                $window.location.href = 'product.html';
            }
        },
        function errorCallback(response) {
            console.log("error");
            console.log(response.status);
        });
    };

}]);

//-----------------Controller for Registration Page-------------------------------------------//
myApp.controller('RegisterCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log("clicked register controller");
    $scope.register = function () {
        $http({
            method: 'POST',
            url: '/CheckregisterUser',
            data: {
                username: $scope.regisusername,
                email:$scope.regisemail,
                password: $scope.regispassword

            },
        }).then(function successCallback(response) {
            console.log(response.data);

        }, function errorCallback(response) {
            console.log('error');
        });

    };

}]);


//-----------------Controller for Forgot User Page-------------------------------------------//
myApp.controller('ForgotCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.lost = function () {
        //var email = $scope.email;
        $http({
            method: 'POST',
            url: '/forgotPassword',
            data:{email:$scope.email}

        }).then(function successCallback(response) {
            console.log(response.data);

        }, function errorCallback(response) {
            console.log('error');
        });

    };
}]);

//-----------------controller for location---------------------//
myApp.controller('LocateCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.locate = function () {
        var location = $scope.location;
        console.log(location);

        $http({
            method: 'POST',
            url: '/locate?location=' + location

        }).then(function successCallback(response) {
            console.log(response.data);

        }, function errorCallback(response) {
            console.log('error no such kind of place');
        });

    }

}]);
//-----------controller for product--------//
myApp.controller('Product', ['$scope',function ($scope) {
    var productlist=[];
    for(var i=1;i<=100;i++)
    {
        var products=
            {
                name:"Products "+i,
                desciption:"description "+i,
                moredetail:"More Detail"+i,
                modaldetails:"Lorem ipsum dolor sit amet",
                address:"2541 e temple ave",
                price:"24$",
                contact:"6263275334",
                buttontext:"Email"

            };

        productlist.push(products);
    }
    $scope.products=productlist;
    $scope.currentPage = 1;
    $scope.pageSize = 12;

    function OtherController($scope) {

        $scope.pageChangeHandler = function(num) {
        };
    }

}]);
//-----product select---//
myApp.controller('selectProduct',['$scope','$http',function ($scope, $http) {
   $scope.items =
        {
            name: ['Car','Books','Furniture','Machines','Others']
        };
    $scope.areas =
        {
            location: ['Irvine','West covina','Santa ana','new york']

        };
    $scope.prices =
        {
            amount: ['10', '20', '30']
        };
    $scope.selected = function () {
        console.log("search module called");
        console.log($scope.itemSelectName);
        console.log($scope.itemSelectArea);
        console.log($scope.itemSelectPrice);
    $http({
        method: 'POST',
        url: '/ProductSelectCheck',
        data:{
            itemName:$scope.itemSelectName,
            itemArea:$scope.itemSelectArea,
            itemPrice:$scope.itemSelectPrice
        },

    }).then(function successCallback(response) {
        console.log(response.data);

    }, function errorCallback(response) {
        console.log('error');
    });

    };
}]);
/*Add product*/
myApp.controller('addProduct',['$scope','$http',function($scope,$http){
    $scope.addProductToDb = function () {
        $http({
            method: 'POST',
            url: '/ProductSelectCheck',
            data: {
                productImages:$scope.images =
                {
                    
                },
                productOwnerName:$scope.ownername,
                productDescription:$scope.productdescrip,
                productAddress:$scope.productaddress,
                productPrice:$scope.productprice,
                productContact:$scope.productcontact
            },
        }).
        then(function successCallback(response) {
            console.log(response.data);

        }, function errorCallback(response) {
            console.log('error');
        });
    };
}]);
