'use strict';
console.log(22);

var ngApp = angular.module('myApp', []);
    ngApp.controller('myController', function ($scope, $http) {
        $scope.msg = '你好，Angular！';
        $scope.getData = function () {
            return 'qubernet';
        }
    });
    ngApp.controller('myCtrl', function($scope){
        $scope.iClick = function(){
            console.log(12);
            this
        }

    });

    // onload = function () {
    //     document.getElementById('lbtnTest').onclick = function () {
    //         //通过controller来获取Angular应用
    //         var appElement = document.querySelector('[ng-controller=myController]');
    //         //获取$scope变量
    //         var $scope = angular.element(appElement).scope();

    //         //调用msg变量，并改变msg的值
    //         $scope.msg = '123456';
    //         //上一行改变了msg的值，如果想同步到Angular控制器中，则需要调用$apply()方法即可
    //         $scope.$apply();
    //         //调用控制器中的getData()方法
    //         console.log($scope.getData());
    //      }
    // }
