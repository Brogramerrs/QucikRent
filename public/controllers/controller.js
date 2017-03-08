/*var files;*/
var fs ;
var imagename;
var price;
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
$scope.showalertlogin=false;
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
if($cookies.get("username")!=null)
{
    $scope.userid=$cookies.get("username");
}
    // $scope.checkUserLogin = true;
    // $scope.checkUserLogout = false;
    loggedin=false;
    console.log("loggedin changed to false:" +loggedin);
    $scope.login = function () {
        if ($scope.loginusername == null && $scope.loginpassword == null) {
            $scope.showalertlogin = true;
            $window.alert("Fields cant be empty");
        }
        else {

            console.log("Login Button Clicked");
            $http({
                method: 'POST',
                url: '/CheckUser',
                data: {
                    _id: $scope.loginusername,
                    password: $scope.loginpassword,
                    user: 'null'
                },
            }).then(function successCallback(response) {
                console.log("loggin username");
                console.log(response);
                console.log("successcallback");

                if (response.data.data.toString().includes("valid")) {
                    console.log("entered if loop");
                    $scope.checkUserLogin = false;
                    $scope.checkUserLogout = true;
                    //$scope.userid = response.data;
                    loggedin = true;
                    var now = new Date();
                    var Expire = new Date();
                    Expire.setMinutes(now.getMinutes() + 60);
                    $cookies.put('username', $scope.loginusername, {path: "/", expires: Expire});
                    $cookies.put('Loggedin', 'true', {path: "/", expires: Expire});
                    $scope.userid = $scope.loginusername;
                    console.log("loggedin changed to true:" + loggedin);
                    $window.location.href = '../views/product.html';
                }
                else {
                    console.log("entered else");
                    alert("invalid username or password")
                }

            }, function errorCallback(response) {
                console.log("error");
                console.log(response.status);
            });
        }

    };

    $scope.logout=function(){
        console.log("in logout");
        $http({
            method: 'POST',
            url: '/logout'
        }).then(function successCallback(response)
            {
                $cookies.remove("Loggedin",{path:"/"});
                $cookies.remove("username",{path:"/"});
                console.log("loggedout");
                $scope.checkUserLogin =true ;
                $scope.checkUserLogout = false;
                $window.location.href = '/';
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
    $scope.showalertregis=false;
    $scope.register = function () {
        if ($scope.regisusername == null && $scope.regisemail == null && $scope.regispassword == null && $scope.regisnumber ==  null)
        {
        $scope.showalertregis= true;
        $window.alert("Fields cannot be empty");
        }else {
            console.log("enter else of register");
            $http({
                method: 'POST',
                url: '/CheckregisterUser',
                data: {
                    _id: $scope.regisusername,
                    email: $scope.regisemail,
                    password: $scope.regispassword,
                    phonenumber: $scope.regisnumber

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
        }
    };

}]);


//-----------------Controller for Forgot User Page-------------------------------------------//
myApp.controller('ForgotCtrl', ['$scope', '$http','$window', function ($scope, $http,$window) {
    $scope.lost = function () {
        //var email = $scope.email;
        $http({
            method: 'POST',
            url: '/forgotPassword',
            data:{email:$scope.email}

        }).then(function successCallback(response) {
            console.log(response.data);
            alert("password sent through email");
            $window.location.href="/";

        }, function errorCallback(response) {
            console.log('error');
            alert("invalid user")
            $window.location.href="/";;
        });

    };
}]);

//-----------------controller for personalized search---------------------//
myApp.controller('LocateProduct', ['$scope', '$http','$window', function ($scope, $http,$window) {
    $scope.searchProduct = function () {
        console.log($scope.product);
        $window.location.href="../views/product.html#?productName="+$scope.product;
        $http({
            method: 'POST',
            url: '/searchMyProduct',
            data: {
                mysearch: $scope.product
            }

        }).then(function successCallback(response) {
            console.log(response);
            console.log("successcallback");

            if (response.data.toString().includes("oops!...there is no data matching your request")) {
                console.log("entered else");
                alert("there is some error correct it");
            }
            else {
                console.log("there is data present");
               /* $scope.products=response.data;*/
                console.log(response);
                /* $window.location.href = '../views/product.html ';*/

            }


        }, function errorCallback(response) {
            console.log('error no such listed product');
        });

    }

}]);
//-------------------------------------controller for get all  product----------------------------------------//
myApp.controller('Product', ['$scope','$http', '$window','$cookies','$location',function ($scope, $http, $window,$cookies,$location) {

    console.log("entering the main game");
    /*$scope.items =
        {
            name: ['Car', 'Book', 'furniture', 'machines', 'others']
        };
    $scope.areas =
        {
            location: ['Irvine', 'West covina', 'Santa ana', 'new york']

        };
    $scope.prices =
        {
            amount: ['10', '20', '30','100']
        };*/
    $scope.items=['Car', 'Book', 'furniture', 'machines'],
    $scope.areas=['Irvine', 'West covina', 'Santa ana', 'new york'],
        $scope.prices=['10', '20', '30','100']
    $scope.selected = function () {
        alert("buttone pressed");
        console.log("search module called");

        var name=$scope.itemSelectName!=null?$scope.itemSelectName:"";
        var location=$scope.itemSelectArea!=null?$scope.itemSelectArea:"";
         price=$scope.itemSelectPrice!=null?$scope.itemSelectPrice:"";

        console.log(name);
        console.log(location);
        /*console.log(price);*/
        //name="{"+"'"+"productType"+"'"+":"+"'"+name.toString().toLowerCase()+"'"+"}";
        //$scope.filterExpr = name;//{"productTyp" : name};//'productAddress': location,
        //$scope.filterExpr={'productType':name};
       // $scope.Type=name.toLowerCase();
        //'Price': price

       // console.log("filter exprs");console.log($scope.filterExpr);
//$scope.applyif();
var URL="../views/product.html#?";

if(name!=null && name!=""){URL=URL+"productType="+name.toString();}
if(location!=null && location!=""){URL=URL+(name!=null && name!=""?"&":"")+"city="+location};
if(price!=null && price!=""){URL=URL+((name!=null && name!="")||(city!=null && city!="")?"&":"")+"amount="+price};
       $window.location.href=URL;//"../views/product.html#?productType="+name+"&city="+location+"&amount="+price;
        $window.location.reload();
console.log("not redirecting");

    }
    $scope.applyif=function()
    {
        console.log("applyif");
        if(!$scope.$$phase) {
            console.log("applying");
            $scope.$apply();
            console.log("applied");
            console.log("scope product");
            $scope.$apply();
            // $scope.$applyAsync(function(){$scope.products=response.data;});
            console.log($scope.products);
        }else
        {
            console.log("timeout");
            setTimeout(function(){$scope.applyif();},2);
        }
    }
        $scope.login = function () {
        console.log("Login Button Clicked");
        if($scope.loginusername == null && $scope.loginpassword == null){
            $scope.showalertlogin=true;
            $window.alert("Fields cant be empty");
        }else {
            $http({
                method: 'POST',
                url: '/CheckUser',
                data: {
                    _id: $scope.loginusername,
                    password: $scope.loginpassword,
                    user:''
                },
            }).then(function successCallback(response) {
                console.log("successcallback of login");
                console.log(response);
                if (response.data != null) {
                    console.log("entered if loop of login");
                    console.log(response);
                    $scope.checkUserLogin = false;
                    $scope.checkUserLogout = true;
                    $scope.userid = response.data;
                    loggedin=true;
                    var now=new Date();
                    var Expire=new Date();
                    Expire.setMinutes(now.getMinutes()+1);
                    $cookies.put('Loggedin', 'true',{path:"/",expires:Expire});
                    $cookies.put('username', $scope.loginusername,{path:"/",expires:Expire});
                    $scope.userid=$scope.loginusername;
                    console.log("loggedin changed to true:" +loggedin);
                    $window.location.href = '../views/product.html';
                }
                else {
                    console.log("entered else of login");
                    alert("invalid username or password")
                }

            }, function errorCallback(response) {
                console.log("error of login");
                console.log(response.status);
            });
        }
    };
/*logout function*/
    $scope.logout=function(){
        $http({
            method: 'POST',
            url: '/logout'
        }).then(function successCallback(response)
            {
                console.log("loggedout");
                $cookies.remove("Loggedin",{path:"/"});
                $cookies.remove("username",{path:"/"});
                $scope.checkUserLogout = false;
            },
            function errorCallback(response) {
                console.log("error");
                console.log(response.status);
            });
    }
    /*logout function end*/
    var pname = $location.search().productName;
    var type = $location.search().productType;
    var city = $location.search().city;
    var amount = $location.search().amount;

/*
    if(type!=null && type!=""){$scope.itemSelectName=type;}
    if(city!=null && city!=""){$scope.itemSelectArea=city;};
    if(amount!=null && amount!=""){$scope.itemSelectPrice=amount;};*/

    if($cookies.get("Loggedin")!=null){
        $scope.emailShow = true;
        $scope.emailparashow=false;
    }
    else{
        $scope.emailShow = false;
        $scope.emailparashow=true;
    }
    if($cookies.get("username")!=null){
        $scope.userid = $cookies.get("username");

    }
    else{

    }

    pname=pname==null?"":pname;
    type=type==null?"":type;
    city=city==null?"":city;
    amount=amount==null?"":amount;
    console.log(name);
    console.log(location);
    console.log(price);
        $http({
            method: 'POST',
            url: '/allData',
            data: {

                productName: pname,
                productType: type,
                city:city,
                amount:amount
            }
        }).then(function successCallback(response) {
            console.log("successcalllback called in get all data");
            console.log("response.redirect" + response.data["redirect"]);
            if ($cookies.get("Loggedin") != null) {
                $scope.checkUserLogout = $cookies.get("Loggedin").includes("true") ? true : false;
                $scope.checkUserLogin = $cookies.get("Loggedin").includes("true") ? false : true;
            }
            console.log("checkUserLogout:" + $scope.checkUserLogout);
            console.log("checkUserLogin:" + $scope.checkUserLogin);
            console.log(response.data.data);
            if (response.data["redirect"] != null && response.data["redirect"] != "") {
                console.log("Redirecting...");
                console.log(response.data["redirect"]);
                $window.location.href = response.data["redirect"];

            }
            console.log("printing response");
            console.log(response);

            if (response.data.data!=null && response.data.data.toString().includes("empty")) {
                console.log("you r going wrong");
            }
            else if (response.data.data!=null && response.data.toString().includes("failed")) {
                console.log("still wrong");
            }
            else {
                console.log("you r going right keep it up");

                $scope.products = response.data;
                console.log("checking scope products data");
                console.log($scope.products);
            }
        }, function errorCallback(response) {
            console.log('error');

            /*Imp Code for pagination do not delete*/
            console.log("errorCallback called in get all data");
            console.log("response.redirect" + response.data["redirect"]);
            if (response.data["redirect"] != null && response.data["redirect"] != "") {
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
/*myApp.controller('selectProduct', ['$scope', '$http','$window', function ($scope, $http, $window) {
    $scope.items =
        {
            name: ['Car', 'Book', 'furniture', 'machines', 'others']
        };
    $scope.areas =
        {
            location: ['Irvine', 'West covina', 'Santa ana', 'new york']

        };
    $scope.prices =
        {
            amount: ['10', '20', '30','100']
        };
    $scope.selected = function () {

        console.log("search module called");
        console.log($scope.itemSelectName);
        console.log($scope.itemSelectArea);
        console.log($scope.itemSelectPrice);

        $scope.filterExpr={"productType":$scope.itemSelectName,"productAddress":$scope.itemSelectArea,"Price":$scope.itemSelectPrice};
        // $http({
        //     method: 'POST',
        //     url: '/searchData',
        //     data: {
        //         itemName:$scope.itemSelectName.toString(),
        //         itemArea:$scope.itemSelectArea.toString(),
        //         itemPrice:$scope.itemSelectPrice.toString()
        //     }
        // }).then(function successCallback(response) {
        //     //console.log(response.data);
        //
        //
        //    console.log(response);
        //     console.log("successcallback");
        //
        //     if (response.data.toString().includes("oops!...there is no data matching your request")) {
        //         console.log("entered else");
        //         alert("there is some error correct it");
        //         return(err);
        //     }
        //     else {
        //         console.log("there is data present");
        //
        //         console.log(response);
        //         return(response);
        //
        //     }
        //
        // }, function errorCallback(response) {
        //     console.log('error');
        //
        //
        // });

    };
}]);*/

/*----------------------------------------upload product------------------------------------------*/
myApp.controller('addProduct', ['Upload','$scope', '$http', '$window','$cookies','$document', function (Upload,$scope, $http, $window, $cookies,$document) {


var imagename;

   // $window.alert("addproduct cookie check");
    console.log("addproduct cookie check");
console.log($cookies.get("Loggedin"));


    if($cookies.get("Loggedin")!=null){

        $scope.buttonShow=true;
        $scope.parashow=false;
        var vm = this;


        vm.submit = function () {
            //function to call on form submit
            console.log("submit");
            //for(var i = 0; i<1;i++) {
                //if (vm.upload_form.file.$valid && vm.file[i]) { //check if from is valid
                    console.log("form valid");
                   console.log(vm.file);
                    vm.upload(vm.file);//call upload function
                   // console.log("value of i is :"+ i);
                // }
                // else {
                //     console.log("invalid form");
                // }
            //}
            //addProductToDb();
            $scope.addProductDelayed();
        }
        $scope.addProductDelayed=function()
        {
            console.log("applyif");//|| image2==null || image2=="" || image3==null || image3==""
            if(!(imagename==null || imagename=="" )) {
                console.log("applying");
                addProductToDb();
                console.log("added");


            }else
            {
                console.log("timeout");
                setTimeout(function(){$scope.addProductDelayed();},2);
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
                        console.log(resp);
                        imagename = resp.data;
                        console.log();

                        //addProductToDb();
                        console.log(resp.config.data.file);
                    } else {
                      // $window.alert('an error occured');
                    }
                },
                function (resp) { //catch error
                    console.log('Error status: ' + resp.status);
                    //$window.alert('Error status: ' + resp.status);
                })
        };

        //}


        //---------------------------------------------------data to database-----------------------------------------//
        //$scope.addProductToDb = function () {
        function addProductToDb() {
            //addImageToFile();

            // console.log($scope.productdescrip);
            // console.log($scope.productaddress);
            var ownerName=$scope.ownername!=null && $scope.ownername!=""?$scope.ownername:" ";
            var emailaddress=$scope.emailaddress!=null && $scope.emailaddress!=""?$scope.emailaddress:" ";
            var productname=$scope.productname!=null && $scope.productname!=""?$scope.productname:" ";
            var producttype=$scope.producttype!=null && $scope.producttype!=""?$scope.producttype:" ";
            var productdescrip=$scope.productdescrip!=null && $scope.productdescrip!=""?$scope.productdescrip:" ";
            var productaddress1=$scope.productaddress1!=null && $scope.productaddress1!=""?$scope.productaddress1:" ";
            var productaddress2=$scope.productaddress2!=null && $scope.productaddress2!=""?$scope.productaddress2:" ";
            var productcity=$scope.productcity!=null && $scope.productcity!=""?$scope.productcity:" ";
            var productprice=$scope.productprice!=null && $scope.productprice!=""?$scope.productprice:" ";
            var productcontact=$scope.productcontact!=null && $scope.productcontact!=""?$scope.productcontact:" ";

            $http({
                method: 'POST',
                url: '/productToDb',
                data: {
                    productusername : 'null',
                    productimagename1: imagename,
                    productOwnerName: ownerName,
                    Emailaddress: emailaddress,
                    productName: productname,
                    productType: producttype,
                    productDescription: productdescrip,
                    productAddress1: productaddress1,
                    productAddress2: productaddress2,
                    productCity: productcity,
                    productPrice: productprice,
                    productContact: productcontact

                },
            }).then(function successCallback(response) {
                console.log(response.data);
                if (response.data.data.toString().includes("valid data")) {
                    console.log("alert");
                    alert("succesfully saved data");
                   // $window.location.href = '../views/product.html';

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
}else{
    $scope.buttonShow=false;
        $scope.parashow=true;
    }



    }]);
//------------------------------------------get specific data-----------------------------------/

myApp.controller('getspecific',['$scope','$http','$window',function ($scope, $http, $window) {
    $scope.specificProduct = function(obj) {
        var clickeddata = obj.currentTarget.attributes.data.nodeValue;
        $window.location.href="../views/product.html#?productType="+clickeddata;

        console.log("entering the main game");
        console.log("getSpecific");

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
               /* $window.location.href = 'views/product.html';*/
                $scope.products = response.data;
            }



        }, function errorCallback(response) {
            console.log('error');
        });

    }

}]);
//----------------------------------------email to tanent----------------------------------------------//
myApp.controller('email', ['$scope', '$http', '$window',function ($scope, $http, $window) {

        $scope.email = function () {
        //var email = $scope.email;

            $scope.emailparashow=false;
            console.log($scope.product.Emailaddress);
            console.log("entred the email function");
            $http({
                method: 'POST',
                url: '/sendEmail',
                data: {
                    emailaddress: $scope.product.Emailaddress,
                    texttosend: $scope.text
                }

            }).then(function successCallback(response) {
                console.log(response);
                if (response.data.data.toString().includes("Valid User.Message sent")) {
                    console.log("check mail...sent from here");
                    alert("Your mail has been sent");
                    $window.location.href='../views/product.html';
                }
                else
                {
                    console.log(response);
                    console.log("mail not sent" + response);
                    alert("mail not sent");

                    $scope.products = response.data;
                }

            }, function errorCallback(response) {
                console.log('error');
            });



    }

}]);
/*My account*/
myApp.controller('myuseraccount',['$scope', '$http', '$window',function ($scope, $http, $window){

        //var email = $scope.email;
    $http({
        method: 'GET',
        url: '/getMyUserAccountDetails',
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data != null) {
                $scope._id = response.data._id;
                $scope.email = response.data.email
            }
            else
            {
                console.log(response.data);
            }
        }, function errorCallback(response) {
            console.log('error');
        });

    $scope.getuserproducts = function () {

        $http({
            method: 'GET',
            url: '/getMyUserAccountProducts',
        }).then(function successCallback(response) {
            if (response != null) {
                console.log("Your condition for get products satisfies");
                console.log(response.data);
                $scope.products = response.data;
            }
            else
            {
                console.log("Invalid data");
            }
        }, function errorCallback(response) {
            console.log('error');
        });
        $scope.currentPage = 1;
        $scope.pageSize = 12;

        function OtherController($scope) {
            $scope.pageChangeHandler = function(num) {

            };
        }
    }
$scope.deletedata = function (object) {
        var userproductid = object;
    $http({
        method: 'POST',
        url: '/deleteMyData',
        data:
            {
                productid:userproductid
            }
    }).then(function successCallback(response) {
        $window.location.reload();
    }, function errorCallback(response) {
        console.log('error');
    });
    }
}]);


