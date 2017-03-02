
var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination','ng-file-model','ngCkeditor','ngCookies']);//'angularUtils.directives.dirPagination','ngRoute'
console.log("loggedin");
var loggedin=false;
console.log("loggedin:" +loggedin);
//-----------------Controller for login Page-------------------------------------------//
myApp.controller('LoginCtrl', ['$scope', '$http', '$window','$cookies', function ($scope, $http, $window,$cookies) {
    console.log("hello from the controller");

if($cookies.get("Loggedin")!=null)
{
    console.log("LoggedIn cookie:"+$cookies.get("Loggedin"));
    $scope.checkUserLogin = $cookies.get("Loggedin").includes("true")?false:true;

    $scope.checkUserLogout = $cookies.get("Loggedin").includes("true")?true:false;
    console.log("checkUserLogout:"+$scope.checkUserLogout);
    console.log("checkUserLogin:"+$scope.checkUserLogin);
}
else{
    $scope.checkUserLogin = true;
    $scope.checkUserLogout = false;
    console.log("checkUserLogout:"+$scope.checkUserLogout);
    console.log("checkUserLogin:"+$scope.checkUserLogin);
}

    // $scope.checkUserLogin = true;
    // $scope.checkUserLogout = false;
    loggedin=false;
    console.log("loggedin changed to false:" +loggedin);
    $scope.login = function () {
        console.log("Login Button Clicked");
        $http({
            method: 'POST',
            url: '/CheckUser',
            data: {
                _id: $scope.loginusername,
                password: $scope.loginpassword
            },
        }).then(function successCallback(response) {

            console.log(response);
            console.log("successcallback");
            if (response.data.data.toString().includes("Valid")) {
                console.log("entered if loop");
                $scope.checkUserLogin = false;
                $scope.checkUserLogout = true;
                loggedin=true;
                var now=new Date();
                var Expire=new Date();
                Expire.setMinutes(now.getMinutes()+1);
                $cookies.put('Loggedin', 'true',Expire);
                console.log("loggedin changed to true:" +loggedin);
                $window.location.href = 'views/product.html';
            }
        },
        function errorCallback(response) {
            console.log("error");
            console.log(response.status);
        });
    };
    $scope.logout=function(){
        console.log("in logout");
        $http({
            method: 'POST',
            url: '/logout'
        }).then(function successCallback(response)
            {
                $cookies.remove("Loggedin");
                console.log("loggedout");
                $scope.checkUserLogin =true ;
                $scope.checkUserLogout = false;
            },
            function errorCallback(response) {
                console.log("error");
                console.log(response.status);
            });
    }
}]);

//-----------------Controller for Registration Page-------------------------------------------//
myApp.controller('RegisterCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log("clicked register controller");
    $scope.register = function () {
        $http({
            method: 'POST',
            url: '/CheckregisterUser',
            data: {
                _id: $scope.regisusername,
                email: $scope.regisemail,
                password: $scope.regispassword

            },
        }).then(function successCallback(response) {
            console.log('userRegistered');
            console.log(response.data);

        }, function errorCallback(response) {
            console.log('Unregistered User');
            console.log('error');

        });
    }
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
myApp.controller('Product', ['$scope','$http', '$window','$cookies',function ($scope, $http, $window,$cookies) {
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
    $scope.logout=function(){
        $http({
            method: 'POST',
            url: '/logout'
        }).then(function successCallback(response)
            {
                console.log("loggedout");
                $cookies.remove("Loggedin");
                $scope.checkUserLogout = false;
            },
            function errorCallback(response) {
                console.log("error");
                console.log(response.status);
            });
    }
    console.log("calling getAllData");
    $http({
        method: 'POST',
        url: '/getProducts'

    }).then(function successCallback(response) {
        console.log("successcalllback called in get all data");
        console.log("response.redirect" +response.data["redirect"]);
        $scope.checkUserLogout = $cookies.get("Loggedin").includes("true")?true:false;
        $scope.checkUserLogin = $cookies.get("Loggedin").includes("true")?false:true;
        console.log("checkUserLogout:"+$scope.checkUserLogout);
        console.log("checkUserLogin:"+$scope.checkUserLogin);
        if(response.data["redirect"]!= null && response.data["redirect"]!="")
        {
            console.log("Redirecting...");
            console.log(response.data["redirect"]);
         $window.location.href=response.data["redirect"];

        }
        console.log(response);
        $scope.products = response.data;

    }, function errorCallback(response) {
        console.log("errorCallback called in get all data");
           console.log("response.redirect" +response.data["redirect"]);
        if(response.data["redirect"]!= null && response.data["redirect"]!="")
        {
            //$window.location.href=response.data["redirect"];
        }
        console.log(response);
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

