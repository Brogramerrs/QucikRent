/**
 * Created by hardeepsingh on 2/9/17.
 */
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
    $scope.register = function () {
        var username = $scope.regisusername;
        var email = $scope.regisemail;
        var pwd = $scope.regispassword;
        $http({
            method: 'POST',
            url: '/CheckregisterUser?username=' + username + '&email=' + email + '&password=' + pwd
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
        var email = $scope.email;
        $http({
            method: 'POST',
            url: '/forgotPassword?email=' + email
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