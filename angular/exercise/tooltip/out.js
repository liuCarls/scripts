angular.module('DemoApp', [
    '720kb.tooltips'
  ])
  .config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
    tooltipsConfProvider.configure({
      'size': 'large',
      'speed': 'slow'
    });
  }])
  .controller('DemoCtrl', ['$scope',
    '$timeout',
    function controllerCtrl($scope,$timeout) {
      $scope.greeting = {
        text: 'Hello'
      };
      $scope.tooltipText = 'I\'m a text from </br> module controller';
    }
  ]);