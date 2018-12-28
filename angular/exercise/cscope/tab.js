// create the plugin module
ngApp.directive('myTab', ['$timeout','$compile',function ($timeout,$compile) {
    return {
        restrict: 'EA',
        replace: true,
        template: `<div id="itabs" style="width: 100%">
            <toogle-tip class="tab-icon-font icon-pullleft" ng-style="{ 'width' : toggleTipWidth }" id="toogleLeft" ng-if="hasToogleLeft" ng-mousedown="scrollTabs('left')"></toogle-tip>
            <ul ng-style="{left: scrollLeft+'px'}" ng-class="{ toogleLeftShow:hasToogleLeft }" class=""></ul>
            <toogle-tip class="tab-icon-font icon-pullright" ng-style="{ 'width' : toggleTipWidth }" id="toogleRight" ng-if="hasToogleRight" ng-mousedown="scrollTabs('right')"></toogle-tip>
        </div>`,
        link: function($scope , element , attr){
            $scope.pV = 'parentV';
            $scope.tabs = [];
            $scope.tabsWidth = 0;
            $scope.tabsTipWrapWidth = $("#itabs").outerWidth();
            $scope.toggleTipWidth = 40;
            $scope.hasToogleLeft;
            $scope.hasToogleRight;
            $scope.scrollLeft = 0;
            $scope.istyle = {'red':'red'};
        
            // $scope.contextMenu = {};
            $scope.createdContextMenu = false;
            // $scope.tabsTipWrapWidth = $("#tabs").clientWidth;
            $scope.addTabsWidth = function(width){
                $scope.tabsWidth += width;
            };
            $scope.$watch('tabsWidth',function(nv,ov){
                if( nv > $scope.tabsTipWrapWidth ){
                    //
                    $scope.hasToogleLeft = $scope.hasToogleRight = true;
                } else {
                    $scope.hasToogleLeft = $scope.hasToogleRight = false;
                    $scope.scrollLeft = 0;
                }
            });
            $scope.substractTabsWidth = function(width){
                $scope.tabsWidth -= width;
            };
        
            $scope.getTabsWidth = function(){
                return $scope.tabsWidth;
            };
            $scope.getToggleTipWidth = function(){
                return $scope.toggleTipWidth;
            };
            $scope.getTabTipWrapWidth = function(){
                return $scope.tabsTipWrapWidth;
            };
            $scope.getScrollLeft = function(){
                return $scope.scrollLeft;
            };
            $scope.setScrollLeft = function(leftNum){
                if( $scope.hasToogleLeft && $scope.hasToogleRight ){
                    $scope.scrollLeft += leftNum;
                }
            };
            $scope.addTabsWidth = function(width){
                $scope.tabsWidth += width;
            };
        
            $scope.substractTabsWidth = function(width){
                $scope.tabsWidth -= width;
            };
        
            $scope.select = function(event,evTarget){
                console.log('select Tab or menu');
                let me = this;
        
                //tab 的class增加smallActive
                // me.tabId
                $scope.selectTab(me);
        
        
        
            }
            //在选项卡或菜单中选择(active)
            //thisTab是一个Tab的tabScope
            $scope.selectTab = function(thisTab){
                angular.forEach( $scope.tabs, function( tab ){
                    tab.selected = false;
                });
                thisTab.selected = true;
            };
        
        
            $scope.closeTab = function(tabId, event){
                //移除视图代码
                console.log("parent"+tabId)
                this.substractTabsWidth($('.'+tabId).outerWidth());
                $("#itabs > ul").outerWidth(this.getTabsWidth());
                $('.'+tabId).remove();
                //移除当前标签作用域（此作用域为选择标签时创建的作用域tabScope）;
                // tabScope.$destroy();
                
                
            }
        
            $scope.choseTab = function(){
                //移除视图代码
        
                //移除当前标签作用域（此作用域为选择标签时创建的作用域tabScope）;
                // tabScope.$destroy();
            }
            //关闭其他只是简单触发单个关闭的事件
            $scope.closeOthers = function(tabId,event){
                //如果激活的选项卡大于1个才可以使用此功能
                if( this.getCreatedTabs().length > 1 ){
                    var thisId = "." + tabId;
                    //移除除当前的其他DOM
                    $timeout(function(){
                        $("#itabs li:not("+ thisId +")").each(function(){
                            var thisLi = $(this);
                                thisLi.find("span").trigger("click");
                        });
                    },50);
                }
            };
            //关闭右侧所有选项卡
            $scope.closeTabsToRight = function(tabId,event){
                //激活选项卡必须大于1个 并且 不能是最后一个选项卡
                if( this.getCreatedTabs().length > 1 && !this.isLastCreatedTab(this) ){
                    var thisId = "." + tabId;
                    //移除除当前的其他DOM
                    $timeout(function(){
                        $("#itabs").find( thisId ).nextAll().each(function(){
                            var thisLi = $(this);
                                thisLi.find("span").trigger("click");
                        });
                    },50);
                }
        
            };
            // $scope.getCreatedTabs = function(){
            //     return $scope.tabs;
            // }
            $scope.removeContextMenu = function(){
                // if( !$.isEmptyObject($scope.contextMenu) ) $scope.contextMenu.$destroy();
                $scope.createdContextMenu = false;
            };
            $scope.createContextMenu = function(scope){
                // $scope.contextMenu = scope;
                $scope.createdContextMenu = true;
            };
            $scope.isLastCreatedTab = function(tab){
                // return $scope.isCreatedTabs[ $scope.isCreatedTabs.length - 1 ] == tab;
                return $scope.tabs[ $scope.tabs.length - 1 ] == tab;
            };
            $scope.getCreatedTabs = function(){
                // return $scope.isCreatedTabs;
                return $scope.tabs;
            };
            //right-click to show context menu
            $scope.contextMenu = function(event){
                let me = this;
                event.stopPropagation();
        
                me.removeContextMenu();
                $(".tabset-contextmenu").remove();
        
                var contextScope = me.$new();
        
                me.tabsEvent = event;
        
                me.y = me.tabsEvent.pageY;
                //修整溢出屏幕问题
                var docWidth = document.documentElement.clientWidth;
                if( me.tabsEvent.pageX + 200 > docWidth ){
                    me.x = docWidth - 200;
                } else {
                    me.x = me.tabsEvent.pageX;
                };
        
                //是否有不止一个选项卡
                me.createdTabsLen = me.getCreatedTabs().length <= 1 ? true : false;
                //是否为最后一个选项卡
                me.isTheLast= me.isLastCreatedTab(me);
        
                // var tip = $compile( '<div class="tabset-contextmenu" style="left:121px;top:36px;">' +
                var tip = $compile( '<div class="tabset-contextmenu" ng-style="{left:\''+ me.x +'px\',top:\''+ me.y +'px\'};">' +
                                    '<ul>' +
                                        '<li ng-click="closeTab(\''+ me.tabId +'\',tabsEvent);removeThisTip();" >关闭标签页</li>' +
                                        '<li ng-click="closeOthers(\''+ me.tabId +'\',tabsEvent)" ng-class="{disabled: createdTabsLen}">关闭其他标签页</li>' +
                                        '<li ng-click="closeTabsToRight(\''+ me.tabId +'\',tabsEvent)" ng-class="{disabled: isTheLast || createdTabsLen}">关闭右侧标签页</li>' +
                                    '</ul>' +
                                    '</div>')(contextScope);
                
                contextScope.removeThisTip = function(){
                    //移除DOM
                    $(tip).remove();
                    //移除scope
                    me.removeContextMenu(contextScope);
                    //移除body事件
                    $("body").off("click",contextScope.removeThisTip);
        
                }
        
                me.createContextMenu(contextScope);
                $('body').on("click",contextScope.removeThisTip);
                $(tip).appendTo('body');
            
            }
        }
    };
    
    
}]);


//extend angularjs the event of right-click directive
ngApp.directive("ngRightClick",['$parse',function($parse){
	return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
}]);

ngApp.directive("toogleTip", function(){
	return {
		restrict : "E",
		link : function( scope, element, attrs, controller ){

			var toggleTipWidth = scope.getToggleTipWidth();

			scope.scrollTabs = function(direction){
				switch( direction ){
					case "left":
						var tabsTipWrapWidth = scope.getTabTipWrapWidth() - toggleTipWidth*2;
                        // console.log('left');
                        
						if( $.isNumeric( scope.getScrollLeft() ) ){
							if( Math.abs(  scope.getScrollLeft() ) < tabsTipWrapWidth ){
								scope.$parent.scrollLeft -= scope.$parent.scrollLeft;
							} else {
								scope.$parent.scrollLeft += tabsTipWrapWidth;
							}
						}
					break;
                    case "right":
                        // console.log('right');
						var tabsWidth = scope.getTabsWidth()
							tabsTipWrapWidth = scope.getTabTipWrapWidth() - toggleTipWidth*2;
                            //
							if( tabsWidth - tabsTipWrapWidth  > tabsTipWrapWidth + Math.abs( scope.scrollLeft ) ){
								scope.setScrollLeft( -tabsTipWrapWidth );
							} else {
								//TODO 这里最后 -5 不知道为什么会有5像素的误差，可能是每个选项卡的小数造成的
								scope.$parent.scrollLeft = -(tabsWidth - tabsTipWrapWidth - 5);
							}
					break;
					default :
					console.warn("The params of scrollTabs method set error.it must be a string 'left' or 'right'. please check.");
					return;
				}
			}

		}
	}
});