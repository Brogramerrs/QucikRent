var files;
var fs ;
var imagename;
var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination', 'ng-file-model', 'ngCkeditor','ngFileUpload','ngCookies']);//'angularUtils.directives.dirPagination','ngRoute'
myApp.directive('fdInput', [function () {
    return {
        link: function (scope, element, attrs) {
            element.on('change', function (evt) {
                files = evt.target.files;
                console.log(files[0].name);
                console.log(files[0].size);
                console.log(files);

            });
        }
    }
}]);
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
            else {
                console.log("entered else");
                alert("invalid username or password")
            }

        }, function errorCallback(response) {
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
myApp.controller('RegisterCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
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
            console.log(response.data);
            if (response.data.data.toString().includes("saved to database")) {
                console.log("entered if statement");
                $window.location.href = '/';
            }
            else if (response.data.data.toString().includes("data exist")) {

                console.log("entered else if statement");
                alert("this user name has alredy taken");

            }

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
            data: {
                mysearch: $scope.product
            }

        }).then(function successCallback(response) {
            console.log(response.data);

        }, function errorCallback(response) {
            console.log('error no such listed product');
        });

    }

}]);
//-------------------------------------controller for product----------------------------------------//
myApp.controller('Product', ['$scope','$http', '$window','$cookies',function ($scope, $http, $window,$cookies) {
    console.log("entering the main game");
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
    $http({
        method : 'POST',
        url : '/allData'
    }).then(function successCallback(response) {
        console.log("successcalllback called in get all data");
        console.log("response.redirect" +response.data["redirect"]);
        $scope.checkUserLogout = $cookies.get("Loggedin").includes("true")?true:false;
        $scope.checkUserLogin = $cookies.get("Loggedin").includes("true")?false:true;
        console.log("checkUserLogout:"+$scope.checkUserLogout);
        console.log("checkUserLogin:"+$scope.checkUserLogin);
        console.log(response.data);
        if(response.data["redirect"]!= null && response.data["redirect"]!="")
        {
            console.log("Redirecting...");
            console.log(response.data["redirect"]);
            $window.location.href=response.data["redirect"];

        }
        if (response.data.toString().includes("empty")) {
            console.log("you r going wrong");
        }
        else if (response.data.toString().includes("failed")){
            console.log("still wrong");
        }
        else
        {
            console.log("you r going right keep it up");
            $scope.products=response.data;
            console.log("checking scope products data");
            console.log( $scope.products);
        }
    }, function errorCallback(response) {
        console.log('error');

    /*Imp Code for pagination do not delete*/
        console.log("errorCallback called in get all data");
           console.log("response.redirect" +response.data["redirect"]);
        if(response.data["redirect"]!= null && response.data["redirect"]!="")
        {
            //$window.location.href=response.data["redirect"];
        }
        console.log(response);
        console.log('error no such listed product');
    })
    $scope.currentPage = 1;
    $scope.pageSize = 12;

    function OtherController($scope) {


        $scope.pageChangeHandler = function(num) {

        };
    }


}]);

//------------------------------------------product select----------------------------------------//
myApp.controller('selectProduct', ['$scope', '$http', function ($scope, $http) {
    $scope.items =
        {
            name: ['Car', 'Books', 'Furniture', 'Machines', 'Others']
        };
    $scope.areas =
        {
            location: ['Irvine', 'West covina', 'Santa ana', 'new york']

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
            method: 'GET',
            url: '/searchData',
            data: {
                itemName: $scope.itemSelectName,
                itemArea: $scope.itemSelectArea,
                itemPrice: $scope.itemSelectPrice
            },

        }).then(function successCallback(response) {
            console.log(response.data);


            console.log(response);
            console.log("successcallback");

            if (response.data.data.toString().includes("Valid")) {
                console.log("entered if loop");

            }
            else {
                console.log("entered else");
                alert("invalid username or password")
            }

        }, function errorCallback(response) {
            console.log('error');
        });

    };
}]);
/*----------------------------------------upload product------------------------------------------*/
myApp.controller('addProduct', ['Upload','$scope', '$http', '$window', function (Upload,$scope, $http, $window) {

    //---------------------------------------------------image to databse------------------------------------//
    // function addImageToFile() {
    //console.log(file);



    var vm = this;

    vm.submit = function() {
        //function to call on form submit
        console.log("submit");
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            console.log("form valid");
            vm.upload(vm.file); //call upload function
        }
        else {
            console.log("invalid form");
        }
    }
    //$http({

    // method: 'POST',
    vm.upload = function (file) {
        console.log("Printing files");
        console.log(file);
        Upload.upload({

            url: '/imagetodb', //webAPI exposed to upload the file

            data: {
                file: file
            } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
                if (resp != null) { //validate success
                    console.log("returend successfully");
                    console.log(resp.data);
                    imagename = resp.data;
                    console.log();

                    addProductToDb();
                    console.log(resp.config.data.file);
                } else {
                    $window.alert('an error occured');
                }
            },
            function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            })
    };

    //}






    //---------------------------------------------------data to database-----------------------------------------//
    //$scope.addProductToDb = function () {
    function addProductToDb() {

        //addImageToFile();
        console.log("entered product add function");
        console.log($scope.productdescrip);
        console.log($scope.productaddress);
        $http({
            method: 'POST',
            url: '/productToDb',
            data: {
                productimagename: imagename,
                productOwnerName: $scope.ownername,
                Emailaddress : $scope.emailaddress,
                productName: $scope.productname,
                productType: $scope.producttype,
                productDescription: $scope.productdescrip,
                productAddress: $scope.productaddress,
                productPrice: $scope.productprice,
                productContact: $scope.productcontact
            },
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.data.toString().includes("Valid data")) {
                alert("succesfully saved data");
                $window.location.href('views/product.html');
            }


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
//------------------------------------------get specific data-----------------------------------/

myApp.controller('getspecific',['$scope','$http','$window',function ($scope, $http, $window) {
    $scope.specificProduct = function(obj) {
        console.log("entering the main game");
        var clickeddata = obj.currentTarget.attributes.data.nodeValue;
        console.log("game data is : " +clickeddata);
        $http({
            method : 'GET',
            url : '/getSpecificdata',
            params : {
                clicked : clickeddata
            }
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.data.toString().includes("empty")) {
                console.log("you r going wrong");
            }
            else if (response.data.toString().includes("failed")){
                console.log("still wrong");
            }
            else
            {
                console.log(response.data);
                console.log("you r going right keep it up");
                $window.location.href = 'views/product.html';
                $scope.products = response.data;
            }



        }, function errorCallback(response) {
            console.log('error');
        });

    }

}]);
//----------------------------------------email to tanent----------------------------------------------//
myApp.controller('email', ['$scope', '$http', function ($scope, $http) {
    $scope.email = function () {
        //var email = $scope.email;
        console.log($scope.product.Emailaddress);
        console.log("entred the email function");
        $http({
            method: 'POST',
            url: '/sendEmail',
            data: {
                emailaddress: $scope.product.Emailaddress,
                texttosend : $scope.text
            }

        }).then(function successCallback(response) {
            console.log(response.data);
            console.log("check mail...sent from here");

        }, function errorCallback(response) {
            console.log('error');
        });

    };
}]);
