var app = angular.module('myApp',[]);

app.controller('appCtrl', function($scope){

    $scope.data = {
        name :'seaf',
        count:0
    }
    //$watch(watchFn,watchAction,deepWatch)
    // watchFn:angular表达式或函数的字符串
    // watchAction(newValue,oldValue,scope):watchFn发生变化会被调用
    // deepWatch：可选的布尔值命令检查被监控的对象的每个属性是否发生变化
    // $watch会返回一个函数，想要注销这个watch可以使用函数
    $scope.delWatch = $scope.$watch('data.name',function(n, o){
        $scope.data.count++;
    },true);

   



    //$digest()和$apply()


    //angular.js的$timeout指令对window.setTimeout做了一个封装,它的返回值是一个promise对象.


    $scope.metricNameList=['张三','李四','王五'];
    $scope.currentMetric='李四';
    // $scope.disabled = true;
    $scope.initPage = function() {
        
        $scope.changeSelect();
    }
    //// 下拉选项变化时触发
    $scope.changeSelect=function(){
          console.log('changeSelect');
    }     
    $scope.clickChange=function(){
          console.log('clickChange');
    }     
     $scope.initPage(); 

     
});

app.directive('dropDown', [function () {
        return {
            restrict : 'EA',
            replace : true,
            transclude : true,
            scope : {
                selecttitle : '=', //// 默认选中值
                lidata:'=lidata',  //// 数据集如['张三','李四','王五']
                clickChange:'&',   //// 选项变化时事件
                disabled:'@'       //// 是否显示，支持表达式
            },
            template:'<div class="ddl" ng-show="disabled">'
            +'<div class="ddlTitle" ng-mouseover="toggle()"><span ng-bind="selecttitle"></span><i class="fa fa-angle-down ddli"></i></div>'
            +'<ul ng-show="showMe">'
            +' <li ng-repeat="data in lidata" ng-click="clickLi(data)">{{data}}</li>'
            +'</ul>'
            +'</div>',
            link: function ($scope, $element, $attrs) {

                $scope.showMe = false;
                $scope.disabled = true;

                $scope.toggle = function toggle() {
                    $scope.showMe = !$scope.showMe;
                };

                $scope.clickLi=function clickLi(data_){
                    $scope.selecttitle=data_;
                    $scope.showMe = !$scope.showMe;
                };

                $scope.$watch('selecttitle', function(value) {
                    $scope.clickChange();
                });

                    /*$scope.$watch( function() {
                        return $scope.$eval($attrs.setNgAnimate, $scope);
                    }, function(valnew, valold){
                        $animate.enabled(!!valnew, $element);
                    });*/
            }
        };
    }]);