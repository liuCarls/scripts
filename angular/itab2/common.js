(function(){
	'use strict';

	var app = angular.module('myApp',['oc.lazyLoad']);
	app.service('iservice', ['$http', function ($http) {
		this.findUser = function(){
			console.log('iservice.findUser');
		}
	}]);



	app.controller('myCtrl', ['$scope','$compile',function($scope,$compile){
			console.log(22);



			// iservice.findUser();
	}]);

	/*

	*/
	app.directive("iHead", function(){

		
	});

	/**
		list
	*/
	app.directive('menuTragll', function(){


	});

})();
