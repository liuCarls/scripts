
ngApp.directive('myMenu', ['$timeout',function ($timeout) {
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
        template:'<div class="ddl" ng-click="clickLi2(data)" ng-show="disabled">'
        +'<div class="ddlTitle" ng-mouseover="toggle()" ng-nouseleave="toggle()"><span ng-bind="selecttitle.name"></span><i class="fa fa-angle-down ddli"></i></div>'
        +'<ul ng-show="showMe">'
        +' <li ng-repeat="data in lidata" ng-click="clickLi(data)">{{data.name}}</li>'
        +'</ul>'
        +'</div>',
        link: function ($scope, $element, $attrs) {
            $scope.showMe = false;
            $scope.disabled = true;

            $scope.toggle = function toggle() {
                $scope.showMe = !$scope.showMe;
            };

            $scope.clickLi=function clickLi(data_){
                if($scope.selecttitle&&data_&&
                    !($scope.selecttitle.name==data_.name)){
                    $scope.selecttitle=data_;
                    $scope.showMe = !$scope.showMe;
                    $timeout(function(){
                        $scope.clickChange();
                    }, 0);
                    // $scope.clickChange($event, data_);
                }
            };
            $scope.clickLi2=function clickLi(data_){
                $timeout(function(){
                    $scope.clickChange();
                }, 0);
                   
            };

            // $scope.$watch('selecttitle', function(value) {
            //     $scope.clickChange();
            // });

                /*$scope.$watch( function() {
                    return $scope.$eval($attrs.setNgAnimate, $scope);
                }, function(valnew, valold){
                    $animate.enabled(!!valnew, $element);
                });*/
        }
    };
}]);