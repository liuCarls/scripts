(function(){
"use strict";
// create the plugin module
angular.module('TabFrame',[]);

angular.module("TabFrame").provider("tFrame", function(){
	var config = {
		dataSrc : "data",
		dataFormat : {
			"name" 			: "name",
			"order" 		: "order",
			"icon" 			: "icon",
			"moduleName" 	: "moduleName",
			"template" 		: "template",
			"children" 		: "children"
		}
	};

	this.config = function(cfg){
		//angular.merge support deep copy!
		config = angular.merge({}, config, cfg);
	};

});

angular.module("TabFrame").service('tabTools', function(){
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

//this directive will create the tabs and events
angular.module("TabFrame").directive("tab",['$compile','$timeout','$ocLazyLoad','tabTools',function($compile,$timeout,$ocLazyLoad, tabTools){

	return {

		restrict : "E",
		scope : {
			title : "=",
			tplModule : "=",
			tplUrl : "=",
			isChild : "=",
			father : '='
		},
		replace : true,
		template : "<li ng-click='select($event,\"nav\")' ng-class='{active : selected && !isChild,childActive : selected && isChild, isChild : isChild }' style='cursor:pointer;'> " +
						"<span class='zhx-icon-font icon-right' ng-if='!isChild'></span>" +
						"{{ title }}" +
					"</li>",
		require : "^zhxTabSet",
		link : function( scope, element, attrs, controller ){

			//set attr title
			element.attr("title", scope.title);
			/**
			 * scope : 导航标签作用域，父作用域
			 * tabScope : 右侧可关闭小标签以及内容区域作用域
			 */

			//新建一个随机ID给每一组tab
			scope.tabId =  tabTools.newId();

			//为右侧整体区域创建一个作用域
			var tabScope = {};

			scope.isCreated = false;

			//在指令初始化时候将所有导航标签初始化进数组中
			controller.pushTab(scope);

			/**
			 * 选择标签
			 * 每次选择时判断是否已被创建过（隐藏而非关闭）
			 * @return {[type]} [description]
			 */
			scope.select = function(event,evTarget){

				event.stopPropagation();

				//如果已经被创建，仅是隐藏，则直接打开选项卡
				if( scope.isCreated ){

					controller.selectTab(scope);
					//只能找到ng-repeat级别的父，真是的父序号得+1
					controller.openFatherTab(scope.father + 1);

				//如果从未被创建，则进行首次创建
				} else {

					//每次新建都创建一个新的作用域，每次关闭标签都会移除这个作用域
					tabScope = scope.$new();

					controller.selectTab(scope);

					//选项卡内容生成与异步加载
					var tpl = $compile( '<div ng-show="selected">' +
										'<div oc-lazy-load="tplModule">' +
										'<ng-include src="tplUrl">if you see this, it means contents is not be loaded</ng-include>'+
										'</div></div>')(tabScope);

					$(tpl).addClass(scope.tabId);

					$(tpl).appendTo("#zhx-tabset-content-main");  //生成内容区域

					//生成对应选项卡小标签
					var smallTab = $compile('<li style="cursor:pointer" ng-click="select($event,\'tabs\')" ng-right-click="contextMenu($event);" ng-class="{ smallActive: selected }">{{ title }}<span class="zhx-icon-font icon-close" style="cursor:pointer" ng-click="closeTab(\''+ scope.tabId +'\',$event);"></span></li>')(tabScope);
					$(smallTab).addClass(scope.tabId);
					$(smallTab).appendTo("#zhx-tabset-content-tabs > ul"); //生成标签区域

					$timeout(function(){
						controller.addTabsWidth( angular.element(smallTab).outerWidth() );
						$("#zhx-tabset-content-tabs > ul").outerWidth( controller.getTabsWidth() + 5 );
					},0);

					//创建完成将属性设置为true
					scope.isCreated = true;
					controller.pushCreatedTab(scope);

				};

				var selectedWatch = scope.$watch('selected',function(nv,ov){

					if(nv){
						//最后来判断当前激活的tab是否在可见区域内，如果不在，则通过计算微调位置
						$timeout(function(){
							//首先判断是否已经出现选项卡超界（左右出现按钮）（scope判断）
							if( controller.hasToggleLR() ){

								var targetTab;
								var hasToogleTip =  controller.hasToggleLR();
								var tabsWraperWidth = controller.getTipWrapWidth();
								var prevLiWidth = 0;
								var toggleTipWidth = controller.getToggleTipWidth();

								if( evTarget == 'nav' ){
									targetTab = $("#zhx-tabset-content-tabs > ul").find("."+ scope.tabId);
								} else if(evTarget == 'tabs'){
									targetTab = $(event.target);
								}

								angular.forEach( targetTab.prevAll("li"), function(li){
									prevLiWidth += li.clientWidth;
								});

								var tw = tabsWraperWidth - toggleTipWidth*2;
								var w = Math.abs( controller.getScrollLeft() ) + tabsWraperWidth - prevLiWidth - toggleTipWidth*2;

								if( w > tw ){
									//设置位置
									controller.setScrollLeft( w - tw );
								}
								if( w < targetTab.outerWidth() ){
									controller.setScrollLeft( -( targetTab.outerWidth() - w + 20 ) );
								}

							}

						},10);
					}
				});

				//检测完毕后，清除当前的watch
				$timeout(selectedWatch,10);

			};

			//移除标签页
			scope.closeTab = function(tabId,event){

				event.stopPropagation();

				$timeout(function(){

					var eventTarget = event.target.tagName == "LI" ? $(event.target) : $(event.target).parent();

					//移除以后重新计算宽度
					controller.substractTabsWidth( eventTarget.outerWidth() );
					//关闭时应自动滚动tab，不应留白
					if( controller.getScrollLeft() !== 0 ) controller.setScrollLeft( eventTarget.outerWidth() );

					//移除视图代码
					//这里不能使用ng-if 因为其会缓存内容，无法真正清除DOM。
					//新创建的选项卡DOM应该是全新的。
					$('.'+tabId).remove();

					//移除当前Active的tab并且会自动选择周围临近的标签
					controller.removeCreatedTab( scope );

					//父作用域中的属性设置
					scope.isCreated = false;
					scope.selected = false;

					//移除当前标签作用域（此作用域为选择标签时创建的作用域tabScope）;
					tabScope.$destroy();

					//最后如果没有任何激活的tab，则将tab总长度置为0， 这里是为了防止计算中出现的像素级的误差。
					if( !controller.getCreatedTabs().length ) controller.substractTabsWidth( controller.getTabsWidth() );

				},10);

			};

			//关闭其他只是简单触发单个关闭的事件
			scope.closeOthers = function(tabId,event){
				//如果激活的选项卡大于1个才可以使用此功能
				if( controller.getCreatedTabs().length > 1 ){
					var thisId = "." + tabId;
					//移除除当前的其他DOM
					$timeout(function(){
						$("#zhx-tabset-content-tabs li:not("+ thisId +")").each(function(){
							var thisLi = $(this);
								thisLi.find("span").trigger("click");
						});
					},50);
				}
			};

			//关闭右侧所有选项卡
			scope.closeTabsToRight = function(tabId,event){
				//激活选项卡必须大于1个 并且 不能是最后一个选项卡
				if( controller.getCreatedTabs().length > 1 && !controller.isLastCreatedTab(scope) ){
					var thisId = "." + tabId;
					//移除除当前的其他DOM
					$timeout(function(){
						$("#zhx-tabset-content-tabs").find( thisId ).nextAll().each(function(){
							var thisLi = $(this);
								thisLi.find("span").trigger("click");
						});
					},50);
				}

			};

			//right-click to show context menu
			scope.contextMenu = function(event){

				event.stopPropagation();

				controller.removeContextMenu();
				$(".zhx-tabset-contextmenu").remove();

				var contextScope = tabScope.$new();

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
				scope.createdTabsLen = controller.getCreatedTabs().length <= 1 ? true : false;
				//是否为最后一个选项卡
				scope.isTheLast= controller.isLastCreatedTab(scope);

				var tip = $compile( '<div class="zhx-tabset-contextmenu" ng-style="{left:'+ scope.x +',top:'+ scope.y +'};">' +
									'<ul>' +
										'<li ng-click="closeTab(\''+ scope.tabId +'\',tabsEvent);removeThisTip();" >关闭标签页</li>' +
										'<li ng-click="closeOthers(\''+ scope.tabId +'\',tabsEvent)" ng-class="{disabled: createdTabsLen}">关闭其他标签页</li>' +
										'<li ng-click="closeTabsToRight(\''+ scope.tabId +'\',tabsEvent)" ng-class="{disabled: isTheLast || createdTabsLen}">关闭右侧标签页</li>' +
									'</ul>' +
									'</div>')(contextScope);

				contextScope.removeThisTip = function(){
					//移除DOM
					$(tip).remove();
					//移除scope
					controller.removeContextMenu(contextScope);
					//移除body事件
					$("body").off("click",contextScope.removeThisTip);

				}

				controller.createContextMenu(contextScope);
				$('body').on("click",contextScope.removeThisTip);
				$(tip).appendTo('body');

			}

		}

	}

}]);






})();
