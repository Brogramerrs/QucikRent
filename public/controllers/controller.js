
var myApp = angular.module('myApp', []);

//-----------------Controller for login Page-------------------------------------------//
myApp.controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log("hello from the controller");
    $scope.login = function () {
        console.log("Login Button Clicked");
        $http({
            method: 'POST',
            url: '/CheckUser',
            data : {
                username: $scope.username,
                password: $scope.password
            },
        }).then(function successCallback(response) {
            console.log(response.data.data);
        }, function errorCallback(response) {
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

}]);
//-----product select---//
/*
myApp.controller('selectProduct'['$scope',function ($scope) {
    $scope.items =
    [
        name: "cars"
    ]
}]);*/
