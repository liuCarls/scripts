'use strict';
  var app = angular.module('myApp', ['ui.router', 'oc.lazyLoad']);
  app.controller('myCtrl1', function($scope, myProvider) {
    // console.log(myProvider.lastName);
    console.log(myProvider.test.a);

  });
  // app.controller('printCtrl', function ($scope,$ocLazyLoad) {
  //   // $scope.name = 'XXX: ';
  //   $ocLazyLoad.load('views/print.js');
  // })
  //需要注意的是：在注入provider时，名字应该是：providerName+Provider
  app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
  function($provide, $compileProvider, $controllerProvider, $filterProvider){
      // myProviderProvider.setName("大圣");

      //
      app.controller = $controllerProvider.register;
      app.directive = $compileProvider.directive;
      app.filter = $filterProvider.register;
      app.factory = $provide.factory;
      app.service = $provide.service;
      app.constant = $provide.constant;

  }]);
  // 按模块化加载其他的脚本文件
  app.constant('Modules_Config', [{
    name: 'treeControl',
    serie: true,
    files: [
      "Scripts/angular-bootstrap/ui-bootstrap-tpls-0.14.3.min.js"
    ]}
  ]);
  app.config(['$ocLazyLoadProvider',function($ocLazyLoadProvider){
    $ocLazyLoadProvider.config({
      debug: false,
      events: false,
      modules: [{
        name: 'iCss',
        files: [
          'res/style.css',
          'res/style.js',
        ]
      }
      ]
    });
  }]);

  //建立路由
  app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
      $urlRouterProvider.otherwise('/');

      $stateProvider
      .state('home',{
        url: '/',
        template:'这是首页页面'})
      .state('computers',{
        url: '/computers',
        template:'这是电脑分类页面'})
      .state('print',{
        url: '/printers',
        // template: '<div id="printContent" ng-controller="printCtrl">12312</div>',
        // template: 'abcd',
        templateUrl:'views/print.html',
        controller: 'printCtrl',
        controllerAs: 'print',
        resolve:{
          deps: ["$ocLazyLoad",function($ocLazyLoad){
            return $ocLazyLoad.load('views/print.js');
          }]

            // loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
            //   return $ocLazyLoad.load(['iCss']).then(function(){
            //     var js = $ocLazyLoad.load('views/print.js');
            //     return js;
            //   });
            //   console.log(66);
            // }]
        }
        // ,params: {factory: {}}
      });
  }]);


  app.provider('myProvider', function() {
      var name="";
      var test={"a":1,"b":2};
      //注意的是，setter方法必须是(set+变量首字母大写)格式
      this.setName = function(newName){
          name = newName
      }

      this.$get =function($http,$q){
          return {
              getData : function(){
                  var d = $q.defer();
                  $http.get("url")//读取数据的函数。
                      .success(function(response) {
                          d.resolve(response);
                      })
                      .error(function(){
                          d.reject("error");
                      });
                  return d.promise;
              },
              "lastName":name,
              "test":test
          }
      }
  });
