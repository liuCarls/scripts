"use strict";

var ngApp = angular.module('myApp', ['oc.lazyLoad']);
ngApp.config(['$ocLazyLoadProvider','$controllerProvider','$compileProvider','$filterProvider','$provide',
    function($ocLazyLoadProvider,$controllerProvider,$compileProvider,$filterProvider,$provide){

        ngApp.controller = $controllerProvider.register;
        ngApp.directive = $compileProvider.directive;
        ngApp.filter = $filterProvider.register;
        ngApp.factory = $provide.factory;
        ngApp.service = $provide.service;
        ngApp.constant = $provide.constant;

        $ocLazyLoadProvider.config({
            debug : false,
            //定义导航模块以及每个模块需要的控制器
             modules: [
             {
                name: 'teModule',
                files: ['mloadT/test.js']
             }
             ]

        });
    }])
    .constant('menuFormat',{
        "name" 			: "name",
        "order" 		: "order",
        "icon" 			: "icon",
        "moduleName" 	: "moduleName",
        "template" 		: "template",
        "children" 		: "children"
    }).service('zhxTabTools', function(){

        var service = {};

        service.newId = function(){
            var date,seed,char,randomChar="",string;
            date = new Date().getTime();
            seed = parseInt( Math.random(1,1000) * 1000 );
            char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for( var i = 0 ; i < 5; i++ ){
                randomChar += char.charAt(Math.floor(Math.random() * 52));
            }
            string = String(seed + date) + randomChar;
            return 'tab-' + string.substr(5);
        };

        return service;

    })
    .controller('myCtrl', ['$scope',function($scope){
        // $scope.navs = [{id: "001", order: 1, name: "大学", icon: "iconName",
        $scope.menus = [{name:'Menu1', moduleName:'fpage/fpage.js',template:'fpage/fpage.html', type:'nav'
                    },
                    {name: "Menu2", icon1: "smallIconName",icon2:"xxxxx", moduleName:'mloadT/test.js',template:'mloadT/test.html', type:'nav'}
                    ];
        $scope.sMenu = $scope.menus[0];

    }]);