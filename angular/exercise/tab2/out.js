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

}]);

ngApp.controller('myCtrl', function ($scope, $http) {
    $scope.test=  true;
});