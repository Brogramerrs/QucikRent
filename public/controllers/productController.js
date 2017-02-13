/**
 * Created by djeth on 2/12/2017.
 */
var myApp = angular.module('myApp', []);

//-----------------controller for products---------------------//
myApp.controller('Product', ['$scope',function ($scope) {

    $scope.products = [{

        name: "AAAAA",
        desciption: "Simple card",
        moredetail: "More Detail",

    }, {

        name: "BBBBB",
        desciption: "Simple card",
        moredetail: "More Detail",
    }, {
        name: "CCCCC",
        desciption: "Simple card",
        moredetail: "More Detail",
    }];

}]);