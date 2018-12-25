// app.factory('PrintService', ['$http', function($http){
//   var service = {};
//
//       service.Print = function (params) {
//         console.log('printService.print');
//           // return $http.post('Public/LoginAction', params).error(function (result) {
//           //     //console.log(result);
//           // });
//       }
//
//       return service;
//
// }]);

// app.controller('printCtrl', ['$scope', 'PrintService',
(function(){
  app.controller('printCtrl', ['$scope', function($scope){
    $scope.name = "PRINT";
    function initPage() {
      console.log('printCtrl.initPage');
    }
    console.log(66);
    // initPage();
  }]);

})();
// app.controller('printCtrl',  function($scope, PrintService){
//     $scope.name = "PRINT";
//     function initPage() {
//       console.log('printCtrl.initPage');
//     }
//     console.log(66);
//     initPage();
//   });

console.log(55);
