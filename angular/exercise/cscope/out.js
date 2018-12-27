'use strict';
console.log(22);
// var tEle = angular.element('#fPage');

// tEle.data('dTest',{a:'abc', b:123});

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
});
ngApp.directive('testD',function(){
    return {
        restrict : 'EA',
        replace : true,
        transclude: true,
        template: '<h5>testD</h5>'
    };
});
ngApp.controller('myCtrl', ['$scope','$compile','$ocLazyLoad','$timeout','tabTools','menuFormat'
    ,function($scope,$compile,$ocLazyLoad,$timeout,tabTools,menuFormat){

    $scope.menus = [{name:'Menu1', moduleName:'fpage/fpage.js',template:'fpage/fpage.html', type:'nav'},
        {name:'Menu2', moduleName:'mloadT/test.js',template:'mloadT/test.html', type:'nav'}];
    $scope.menu = $scope.menus[0];
    
    /**
     * 延迟加载首页
     */
    $timeout(function(){
        $scope.addTab(null,  $scope.menu);
    }, 0);

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
    /**
     * paramObj,包含,title, htmlUrl, moduleUrl, needTab, type
     * 
     */
    $scope.addTab = function($event, urlObj){
        var me = this;
        let needNew = true;
        for(let value of this.tabs){
            if(value.name == urlObj.name){
                // 打开对应工作区，定位Tab
                //
                console.log('addTab');
                needNew = false;
                break;
            }
        }

        if(needNew){
            let tabScope = this.$new()
            tabScope.tabId = tabTools.newId();
            tabScope.param = urlObj;
            tabScope.type = urlObj.type;
            tabScope.htmlUrl = urlObj.template;
            tabScope.moduleName = urlObj.moduleName;
            tabScope.title = urlObj.name;
            tabScope.selected = true;
            this.selectTab(tabScope);

            //选项卡内容生成与异步加载
            var tpl = $compile( `<div ng-show="selected"><div id="teModule" oc-lazy-load="'`+tabScope.moduleName+`'">
            <ng-include src="'`+tabScope.htmlUrl+`'"></ng-include>
            </div></div>`)(tabScope);
            $(tpl).addClass(tabScope.tabId);
            // $(tpl).appendTo("#zhx-tabset-content-main");  //生成内容区域
            $(tpl).appendTo("#contents");  //生成内容区域

            if( tabScope.type == 'nav' ){
                if(this.tabs.length>0&&this.tabs[0].type=='nav'){
                    //删除原来的菜单工作区
                    let deleteWork = this.tabs.shift();
                    deleteWork
                    $('.'+deleteWork.tabId).remove();
                    
                } 
                this.tabs.splice(0,0,tabScope); //菜单只保留一个工作区，并且不生产Tab
                
            } else if(tabScope.type == 'tab'){
                this.tabs.push(tabScope);
                //生成对应选项卡小标签
                var smallTab = $compile('<li style="cursor:pointer" ng-click="select($event,\'tabs\')" ng-right-click="contextMenu($event);" ng-class="{ smallActive: selected }">{{ title }}<span class="tab-icon-font icon-close" style="cursor:pointer" ng-click="closeTab(\''+tabScope.tabId+'\',$event);"></span></li>')(tabScope);
                $(smallTab).addClass(tabScope.tabId);
                $(smallTab).appendTo("#itabs > ul"); //tgdn
                $timeout(function(){
                    
                    $scope.addTabsWidth($(smallTab).outerWidth());
                    $("#itabs > ul").outerWidth( $scope.getTabsWidth() + 5 );
                }, 0);
            }
        }

        






        //


    }

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
}]);


ngApp.service('tabTools', function(){
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

});

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

