// var tab1 = angular.module('tab1',[]);
//
// tab1.controller("tab1Controller",function($scope){
//
// 	$scope.text = "这里的内容是通过控制器实现";
//
// })
app.controller('testCtrl', ['$scope', function($scope){
  console.log('testCtrl');
  $scope.text = 'testCtrlText';
}]);
