//初始化Angular对象
var myNg = angular.module('mainApp', []);
myNg.controller('mainController', function ($scope) { });
myNg.directive('quberGrid', function () {
    return {
      restrict: 'EA',
      replace: true,//移除<quber-grid>标签
      templateUrl: 'tmp.html',
      link: function (sco, ele, attr) {
        //通知下属DOM，执行名为sendChildGridAttr的事件
        sco.$broadcast('sendChildGridAttr', attr);
      }
    };
});
myNg.directive('quberGridAttr', function () {
    return {
      restrict: 'A',
      link: function (sco, ele, attr) {
        sco.$on('sendChildGridAttr', function (event, data) {
          angular.forEach(data, function (val, key, obj) {
            if (key != '$attr' && key != '$$element') {
              //设置标签属性和值
              attr.$set(key, val);
            }
          });
        });
      }
    };
});
