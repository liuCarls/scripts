'use strict';
console.log(22);

var ngApp = angular.module('myApp', []);
ngApp.controller('myController', function ($scope, $http) {
    $scope.msg = '你好，Angular！';
    $scope.getData = function () {
        return 'qubernet';
    }
});
ngApp.controller('myController1', function ($scope, $http) {
    $scope.msg = '你好，Angular1！';
    $scope.getData = function () {
        return 'qubernet';
    }
});
ngApp.controller('myCtrl', function($scope){
        $scope.iClick = function(){
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


