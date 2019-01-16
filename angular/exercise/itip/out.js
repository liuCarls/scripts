angular.module('DemoApp', [
  ])
  .config([function configConf() {
    
  }])
  .controller('DemoCtrl', ['$scope','$timeout',
    function controllerCtrl($scope,$timeout) {
      $scope.greeting = {
        text: 'Hello'
      };
      $scope.tooltipText = 'I\'m a text from </br> module controller';
      $scope.itip2 = function(event, para){
        console.log(para);
        //在这里弹出一个提示框
        //scope是顶层范围， this是当前范围
        event.stopPropagation();
    
        // controller.removeContextMenu();
        // $(".zhx-tabset-contextmenu").remove();
        
        var contextScope = this.$new();

        scope.tabsEvent = event;

        scope.y = scope.tabsEvent.pageY;
        //修整溢出屏幕问题
        var docWidth = document.documentElement.clientWidth;
        if( scope.tabsEvent.pageX + 200 > docWidth ){
            scope.x = docWidth - 200;
        } else {
            scope.x = scope.tabsEvent.pageX;
        };
        
        //是否有不止一个选项卡
        scope.createdTabsLen = controller.getCreatedTabs().length < 3;
        //是否为最后一个选项卡
        scope.isTheLast= controller.isLastCreatedTab(this);

        var tip = $compile( '<div class="zhx-tabset-contextmenu" ng-style="{left:'+ scope.x +'+\'px\',top:'+ scope.y +'+\'px\'}">' +
                            '<ul>' +
                                '<li ng-click="closeTab(\''+ this.tabId +'\',tabsEvent);removeThisTip();" >关闭标签页</li>' +
                                '<li ng-click="closeOthers(\''+ this.tabId +'\',tabsEvent);removeThisTip();" ng-class="{disabled: createdTabsLen}">关闭其他标签页</li>' +
                                '<li ng-click="closeTabsToRight(\''+ this.tabId +'\',tabsEvent);removeThisTip();" ng-class="{disabled: isTheLast || createdTabsLen}">关闭右侧标签页</li>' +
                            '</ul>' +
                            '</div>')(contextScope);
        
        contextScope.removeThisTip = function(){
            //移除DOM
            $(tip).remove();
            //移除scope
            contextScope.$destroy();
            // controller.removeContextMenu(contextScope);
            // $scope.contextMenu.$destroy();
            //移除body事件
            $("body").off("click",contextScope.removeThisTip);

        }

        // controller.createContextMenu(contextScope);
        $('body').on("click",contextScope.removeThisTip);
        $(tip).appendTo('body');



      }
    }
  ]).directive('iTip',function(){
    return {
      restrict : 'EA', //定义标签属性
      templateUrl : 'tipTmp.html', //外部引入html文件
      replace : false, //把当前自定义的指令标签替换成引入的标签
      // transclude : true,
      scope : { //作用域隔离 ： 每个作用域执行的是自己的功能
        grId : '@', //拿所有grId的字符串
        grData : '=' //拿所有grData属性的变量名
      },
      link : function( scope , element , attr ){ //dom操作
        // element.delegate('a','click',function(){
        //   $(this).addClass('first').siblings('a').removeClass('first');
        //   $(this).siblings('div').eq($(this).index()).css('display','block').siblings('div').css('display','none')
        // });
      }
    }
  });