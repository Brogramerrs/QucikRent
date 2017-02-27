
var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination','ng-file-model','ngCkeditor']);//'angularUtils.directives.dirPagination','ngRoute'

//-----------------Controller for login Page-------------------------------------------//
myApp.controller('LoginCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    console.log("hello from the controller");
    $scope.checkUserLogin = true;
    $scope.checkUserLogout = false;
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
            if (response.data.data.toString().includes("Valid")) {
                console.log("entered if loop");
                $scope.checkUserLogin = false;
                $scope.checkUserLogout = true;
                $window.location.href = 'views/product.html';
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
myApp.controller('LocateProduct', ['$scope', '$http', function ($scope, $http) {
    $scope.searchProduct = function () {
        console.log($scope.product);

        $http({
            method: 'POST',
            url: '/searchMyProduct',
            data:{
                mysearch:$scope.product
            }

        }).then(function successCallback(response) {
            console.log(response.data);

        }, function errorCallback(response) {
            console.log('error no such listed product');
        });

    }

}]);
//-----------controller for product--------//
myApp.controller('Product', ['$scope','$http',function ($scope, $http) {
    /*var productlist=[];
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
    $scope.products=productlist;*/
    $http({
        method: 'GET',
        url: '/getAllData'

    }).then(function successCallback(response) {
        console.log(response.data);
        $scope.products = response.data;

    }, function errorCallback(response) {
        console.log(response.data);
        console.log('error no such listed product');
    });
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
        url: '/productSelectCheck',
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
        console.log("entered product add function");
        console.log($scope.productdescrip);
        console.log($scope.productaddress);
        $http({
            method: 'POST',
            url: '/productToDb',
            data: {
                productImages:$scope.images [
                    {
                        url:[],
                    }
                    ],
                productOwnerName:$scope.ownername,
                productType:$scope.producttype,
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
    $scope.editorOptions = {
        language: 'ru',
        uiColor: '#ffffff'
    };
   /* Clear data function*/
    $scope.clearData = function () {
        console.log("clear function hit");
        $("input[type=file], textarea").val("");
    }
}]);

