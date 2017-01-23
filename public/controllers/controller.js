var myApp = angular.module('myApp',[]);

//-----------------Controller for login Page-------------------------------------------//
myApp.controller('LoginCtrl',['$scope','$http',function ($scope, $http) {
    console.log("hello from the controller");
  $scope.login=function(){
var username=$scope.username;
var pwd=$scope.password;
    console.log("login button clicked")
    $http({
  method: 'POST',
  url: '/CheckUser?username='+username+'&password='+pwd
}).then(function successCallback(response) {
    console.log(response.data);
    
  }, function errorCallback(response) {
    console.log('error');
  });

  };

  }]);


//-----------------Controller for Registration Page-------------------------------------------//
myApp.controller('RegisterCtrl',['$scope','$http',function ($scope, $http) {
      $scope.register=function(){
var username=$scope.regisusername;
var email=$scope.regisemail;
var pwd=$scope.regispassword;
    $http({
  method: 'POST',
  url: '/CheckregisterUser?username='+username+'&email='+email+'&password='+pwd
}).then(function successCallback(response) {
    console.log(response.data);
    
  }, function errorCallback(response) {
    console.log('error');
      });

  };

  }]);



//-----------------Controller for Forgot User Page-------------------------------------------//
myApp.controller('ForgotCtrl',['$scope','$http',function ($scope, $http) {
  $scope.lost=function(){
  var email=$scope.email;
$http({
  method: 'POST',
  url: '/forgotPassword?email='+email
}).then(function successCallback(response) {
    console.log(response.data);
    
  }, function errorCallback(response) {
    console.log('error');
  });

  };
 }]);