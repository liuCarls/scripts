/**
 * Created by user on 2019/2/1.


 */
//@ sourceURL=test.js
ngApp.controller('footerCtrl', ['$scope', function($scope){
   console.log('footerCtrl');
    $scope.iNum = 1;
    $scope.addNum = function(){
        $scope.iNum++;
    };
    $scope.subNum = function(){
        $scope.iNum--;
    };
}]);


