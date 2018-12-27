

ngApp.controller('fpageCtrl', ['$scope', function($scope){
  console.log('fpageCtrl');
  $scope.text = 'fpageCtrlText';
  $scope.gateways = [{name:'GW000001', moduleName:'tabmodel/imodel.js',template:'tabmodel/imodel.html', type:'tab', value: 123123},
                    {name:'GW000002', moduleName:'tabmodel/imodel.js',template:'tabmodel/imodel.html', type:'tab', value: 123123},
                    {name:'GW000003', moduleName:'tabmodel/imodel.js',template:'tabmodel/imodel.html', type:'tab', value: 123123},
                    {name:'GW000004', moduleName:'tabmodel/imodel.js',template:'tabmodel/imodel.html', type:'tab', value: 123123},
                    {name:'GW000005', moduleName:'tabmodel/imodel.js',template:'tabmodel/imodel.html', type:'tab', value: 123123},
                    {name:'GW000006', moduleName:'tabmodel/imodel.js',template:'tabmodel/imodel.html', type:'tab', value: 123123}
                  ];
  

}]);
// console.log(55);
