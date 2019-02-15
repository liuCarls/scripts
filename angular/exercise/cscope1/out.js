'use strict';
console.log(22);

var ngApp = angular.module('myApp', []);
ngApp.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
    function($provide, $compileProvider, $controllerProvider, $filterProvider){
        // myProviderProvider.setName("大圣");

        //
        ngApp.controller = $controllerProvider.register;
        ngApp.directive = $compileProvider.directive;
        ngApp.filter = $filterProvider.register;
        ngApp.factory = $provide.factory;
        ngApp.service = $provide.service;
        ngApp.constant = $provide.constant;

    }])

ngApp.controller('myController', function ($scope, $http) {
    $scope.msg = '你好，Angular！';
    // var otherScope = $('div[ng-controller="myController1"]').scope(); 
    $scope.getData = function () {
        console.log("getData")
        // otherScope.getData1();
        return 'qubernet';
    }
});
ngApp.controller('myController1', function ($scope, $http) {
    $scope.msg1 = '你好，Angular1！';
    $scope.list = [1,2,3,4,5];
    $scope.test = function () {
        console.log('test');
    }
    $scope.item = "ctrl1's item";
    $scope.getData1 = function () {
        console.log("getData1");
        return 'qubernet';
    }
});
ngApp.controller('myCtrl', function($scope){
        $scope.iClick = function(){
            $scope;
            console.log(12);
            // let hCtrl = this.$$childHead;
            let nCtrl;
            let i=0;
            while(true){
                nCtrl = i==0?this.$$childHead:nCtrl.$$nextSibling
                if(nCtrl){
                    nCtrl.msg = 'abc'+i;
                } else {
                    break;
                }
                i++;
            }
            // console.log(2)
            // if(hCtrl){
            //     hCtrl.msg = 'abc';
            // } else {
            //     console.log(1)
            // }

        }

    });


