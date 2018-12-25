(function(){

"use strict";

/**
 *	zhxTabFrame ver 1.0
 * 	Author: Vicco Wang Date: 2016.05.24
 *
 *  useage:
 *
 *  1. you must inject tabset module in your module, just like this:
 *
 *  var app = angular.module( "myModule", ["zhxTabFrame"] );
 *
 *  2. add the angular directive in your page:
		<zhx-main-frame>
			<zhx-head></zhx-head>
			<zhx-tab-set></zhx-tab-set>
		</zhx-main-frame>
 *
 *  3. in your controller, the plugin will read the jsonData and build
 *     the navigation,so you need to use $http service to load it. this
 *     is a example of data format:
		[
			{
				"id"		: "001",
				"order"		: 1,
				"name"  	: "大学",
				"icon"		: "iconName",
				"children"	: [
					{ "name" : "大学之道", "icon":"smallIconName", "moduleName":"tab1", "template":"tpl/tab1.html" }
				]
			}
		]
 *
 *  4. This plugin is dependency with oc.Lazyload, so you must init 
 *  your tabs data's module in the MODULE CONFIG part, like this:
 *  
 *  app.config( function($ocLazyLoadProvider){
 * 		$ocLazyLoadProvider.config({
 * 			// so lazyLoad plugin will load the modules automaticly after 
 * 			// you click the nav.
 * 			modules: [
			 	{
				    name: 'tab1',
				    files: ['tpl/tab1-controller.js']
				 },{
				 	name: 'tab2',
				    files: ['tpl/tab2-controller.js']
			 }]
 * 		});
 *  });
 * 		
 * 	and then when you click the navigation, ocLazyLoad will load the 
 * 	module and controller after tab page loaded.
 *  
 *  enjoy it! ;p 
 *
 */

// create the plugin module
angular.module('zhxTabFrame',[]);

angular.module("zhxTabFrame").provider("zhxFrame", function(){

	var config = {
		dataUrl : "",
		dataSrc : "data",
		dataFormat : {
			"name" 			: "name",
			"order" 		: "order",
			"icon" 			: "icon",
			"moduleName" 	: "moduleName",
			"template" 		: "template",
			"children" 		: "children"
		},
		logoUrl : "",
		logoText : "LOGO",
		logoWidth : 200,
		headerHeight : 45,
		settingWidth : 60,
		footerHeight : 30,
		settingMenuTplUrl : 'tpl/settingMenu.html',
		navigationWidth : 200,
		isShowFooter : false
	};

	this.config = function(cfg){
		//angular.merge support deep copy!
		config = angular.merge({}, config, cfg);
	};

	this.$get = function(){
		return {
			getDataUrl : function(){
				return config.dataUrl;
			},
			getDataSrc : function(){
				return config.dataSrc;
			},
			getDataFormat : function(){
				return config.dataFormat;
			},
			getLogoUrl : function(){
				return config.logoUrl; 
			},
			getLogoText : function(){
				return config.logoText;
			},
			getLogoWidth : function(){
				return config.logoWidth;
			},
			getHeaderHeight : function(){
				return config.headerHeight;
			},
			getNavWidth : function(){
				return config.navigationWidth;
			},
			getSettingWidth : function(){
				return config.settingWidth;
			},
			isShowFooter : function(){
				return config.isShowFooter;
			},
			getSettingMenuTplUrl : function(){
				return config.settingMenuTplUrl;
			}

		}
	};
});

// create a service to build some tools for the plugin
angular.module("zhxTabFrame").service('zhxTabTools', function(){

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


angular.module("zhxTabFrame").directive("zhxMainFrame",['$http','zhxFrame',function($http,zhxFrame){
	return {
		restrict : 	"AE",
		replace  : 	true,
		transclude : true,
		controller : ['$scope',function( $scope ){
			//navbar
			$scope.navs = [];
			//left navigation
			$scope.tabsNav = [];
				
			$scope.showSlideSetting = false;

			$scope.slideSettingWidth = zhxFrame.getSettingWidth();

			$scope.logoWidth = zhxFrame.getLogoWidth();

			$scope.dataFormat = zhxFrame.getDataFormat();

			$scope.dataSrc = zhxFrame.getDataSrc();

			//get the data url 
			var dataUrl = zhxFrame.getDataUrl();

			if( dataUrl == "" ) {
				console.warn("未指定加载模块数据的URL地址，请在zhxFrameProvider的Config中指定dataUrl.");
				return false;
			}
			//left navigation offset to left
			$scope.navOffsetLeft = 0;
			//get data
			$http.get(dataUrl).then(function(result){
				var resData = eval( 'result.'+ $scope.dataSrc );
				if( resData.length ){
					for( var i = 0; i < resData.length; i++ ){
						// console.log( result.data[i].children );
						$scope.tabsNav.push( resData[i][$scope.dataFormat.children] );
					};
					$scope.navs = resData;
				}
			},function(result){
				console.warn("数据加载错误或加载失败！");
			});	

			this.setNavOffset = function(number){
				$scope.navOffsetLeft = -number;
			};

			this.showSlideSetting = function( boolean ){
				$scope.showSlideSetting = boolean;
			}

			this.getSlideSettingStatus = function(){
				return $scope.showSlideSetting;
			}

		}],
		link : function( scope, element, attrs ){

			angular.element(element).on("click",function(event){

				if( scope.showSlideSetting && $(event.target)[0].id != 'zhx-slide-settings' ){
					scope.showSlideSetting = false;
					scope.$digest();
				}
			})
		},
		template : 	"<ng-transclude ng-style='{ left : showSlideSetting ? -slideSettingWidth : 0 }' id='zhx-frame-wrapper'></ng-transclude>"
	}
}]);

angular.module("zhxTabFrame").directive("zhxHead",['zhxFrame',function(zhxFrame){
	return {
		restrict : "AE",
		replace : true,
		require : '^zhxMainFrame',
		link : function( scope, element, attrs, ctrl ){
			//set LogoText
			scope.logoText = zhxFrame.getLogoText();

			scope.headerHeight = zhxFrame.getHeaderHeight();

			scope.settingMenuUrl = zhxFrame.getSettingMenuTplUrl();

			scope.dateFormat = zhxFrame.getDataFormat();

			//witch tab is actived
			scope.isActiveTab = 0;

			scope.navTheTabs = function(event,index){

				var navWidth = zhxFrame.getNavWidth();
				
				ctrl.setNavOffset( index * navWidth );

				scope.isActiveTab = index;

			};

			scope.showSlideSetting = function(event){
				event.stopPropagation();
				if( !ctrl.getSlideSettingStatus() ){
					ctrl.showSlideSetting(true);
				} else {
					ctrl.showSlideSetting(false);
				}
			};

		},
		template : '<header ng-style="{ height : headerHeight }">' +
						'<div id="logo" ng-style="{ width: logoWidth }">{{ logoText }}</div>' +
						'<div id="header-nav-bar">' +
							'<ul>' +
								'<li ng-repeat="n in navs" ng-click="navTheTabs($event,$index);" ng-class="{isActiveTab : isActiveTab == $index }">{{ n[dateFormat.name] }}</li>' +
							'</ul>' +
						'</div>' +
						'<div id="header-control" ng-click="showSlideSetting($event);" style="cursor:pointer;" class="zhx-icon-font icon-moreandroid"></div>' +
						'<div id="zhx-slide-settings" ng-style="{ right : $parent.showSlideSetting ? 0 : -$parent.slideSettingWidth, width: $parent.slideSettingWidth }">' +
							'<div ng-include="settingMenuUrl"></div>' +
						'</div>' +
					'</header>'
	}
}])

//create the main directive.
angular.module("zhxTabFrame").directive("zhxTabSet",['$timeout','zhxFrame',function($timeout,zhxFrame){

	return {
		restrict: "AE",
		replace: true,
		controller : ['$scope',function( $scope ){

			var me = this;

			$scope.tabs = [];
			$scope.isCreatedTabs = [];
			$scope.childrenTabs = [];	//所有具有子集（三级）菜单的选项卡集合
			$scope.tabsWidth = 0;
			$scope.tabsTipWrapWidth = 0;
			$scope.scrollLeft = 0;
			//set toggleTip width px; left or right
			$scope.toggleTipWidth = 40;
			$scope.contextMenu = {};
			$scope.createdContextMenu = false;

			$scope.dateFormat = zhxFrame.getDataFormat();

			$scope.$watch('tabsWidth',function(nv,ov){
				if( nv > $scope.tabsTipWrapWidth ){
					//
					$scope.hasToogleLeft = $scope.hasToogleRight = true;
				} else {
					$scope.hasToogleLeft = $scope.hasToogleRight = false;
					$scope.scrollLeft = 0;
				}
			});
			$scope.$watch('tabsTipWrapWidth',function(nv,ov){
				if( nv !== ov && nv < $scope.tabsWidth ){
					//
					$scope.hasToogleLeft = $scope.hasToogleRight = true;
				} else {
					$scope.hasToogleLeft = $scope.hasToogleRight = false;
					$scope.scrollLeft = 0;
				}
			});

			//在所有激活的选项卡中选择(active)
			me.selectTab = function(thisTab){
				angular.forEach( $scope.tabs, function( tab ){
					tab.selected = false;
				});
				thisTab.selected = true;
			};

			//当前页所有的选项卡都将被添加至该数组中
			me.pushTab = function(tab){
				$scope.tabs.push(tab);
			};

			//添加已激活的选项卡（非选择的）
			me.pushCreatedTab = function(tab){
				$scope.isCreatedTabs.push(tab);
			};

			//打开当前折叠的子菜单（三级菜单）
			me.openChildTab = function(thisTab){
				angular.forEach( $scope.childrenTabs, function( tab ){
					//设置子菜单高度为0，表示隐藏，这里依靠高度变化来实现动画折叠效果
					if( tab !== thisTab ){
						tab.childHeight = 0;
						tab.isShowChild = false;	
					} else if( thisTab.isShowChild ){
						thisTab.isShowChild = false;	
						thisTab.childHeight = 0;	
					} else {
						thisTab.isShowChild = true;	
						thisTab.childHeight = thisTab.childrenLen * 47;	
					}
				});
			};

			/**
			 * 通过右侧横向菜单栏来控制左侧导航栏的目标菜单折叠与隐藏
			 * 这里使用了一个特殊处理，因为暂时无法想到好的办法
			 *
			 * 这里在给所有子的作用域传递了父ng-repeat作用域的序号，该序号是其真实父作用域的序号-1，意思是点击任意一个右侧导航后，如果它含有子且已经被折叠其来，则直接打开左侧折叠的父并值为高亮。
			 * 这里暂时只通过作用域ID来检查父子关系，想到好办法再做调整 :P
			 * @param  {[type]} childId [description]
			 * @return {[type]}         [description]
			 */
			me.openFatherTab = function(childId){
				angular.forEach( $scope.childrenTabs, function( tab ){
					tab.childHeight = 0;
					tab.isShowChild = false;
					if( tab.$id == childId ){
						tab.isShowChild = true;	
						//目前写死一个高，子的数量 * 单个高度
						tab.childHeight = tab.childrenLen * 47;	
					}
				});
			};

			me.pushChildTab = function(tab){
				$scope.childrenTabs.push(tab);
			};

			/**
			 * [removeCreatedTab description]
			 * 移除当前选项卡时，如果位置处于最后，则自动选择前一个选项卡，如果非最后，则选择后一个选项卡。
			 * @param  {[type]} tab [description]
			 * @return {[type]}     [description]
			 */
			me.removeCreatedTab = function(tab){
				//移除时检查当前共有多少选项卡被激活，如果大于1个则需要计算，如果只有1个，则直接清空数组
				if( $scope.isCreatedTabs.length > 1 ){
					for( var i = 0; i < $scope.isCreatedTabs.length; i++ ){
						if( $scope.isCreatedTabs[i] == tab ){
							//直接关闭非当前，不应该自动选择其他选项卡
							if( tab.selected ){
								if( i < $scope.isCreatedTabs.length - 1 ){
									me.selectTab( $scope.isCreatedTabs[ i + 1 ] );
								} else {
									me.selectTab( $scope.isCreatedTabs[ $scope.isCreatedTabs.length - 2 ] );
								}
							}
							$scope.isCreatedTabs.splice( i, 1 );
						}
					}
				} else {
					me.selectTab( $scope.isCreatedTabs[0] );
					$scope.isCreatedTabs = [];
				}
			};

			me.getCreatedTabs = function(){
				return $scope.isCreatedTabs;
			}

			me.isLastCreatedTab = function(tab){
				return $scope.isCreatedTabs[ $scope.isCreatedTabs.length - 1 ] == tab;
			}

			me.addTabsWidth = function(width){
				$scope.tabsWidth += width;
			};

			me.substractTabsWidth = function(width){
				$scope.tabsWidth -= width;
			};

			me.getTabsWidth = function(){
				return $scope.tabsWidth;
			};

			me.getTabTipWrapWidth = function(){
				return $scope.tabsTipWrapWidth;
			};

			me.setScrollLeft = function(leftNum){
				if( $scope.hasToogleLeft && $scope.hasToogleRight ){
					$scope.scrollLeft += leftNum;
				}
			};

			me.getScrollLeft = function(){
				return $scope.scrollLeft;
			};

			me.getToggleTipWidth = function(){
				return $scope.toggleTipWidth;
			};

			me.getTipWrapWidth = function(){
				return $scope.tabsTipWrapWidth;
			}

			me.createContextMenu = function(scope){
				$scope.contextMenu = scope;
				$scope.createdContextMenu = true;
			};

			me.hasToggleLR = function(){
				return $scope.hasToogleLeft && $scope.hasToogleRight;
			};

			me.removeContextMenu = function(){
				if( !$.isEmptyObject($scope.contextMenu) ) $scope.contextMenu.$destroy();
				$scope.createdContextMenu = false;
			};

		}],
		link : function( scope, element, attrs, controller ){

			scope.navigationWidth = zhxFrame.getNavWidth();

			var docWidth = document.documentElement.clientWidth;

			scope.tabsTipWrapWidth = docWidth - scope.navigationWidth;

			var time = {};

			$(window).on("resize",function(){
				$timeout.cancel(time);
				time = $timeout(function(){

					var docWidth = document.documentElement.clientWidth;
					var eleOuterWidth = docWidth - scope.navigationWidth;

					scope.tabsTipWrapWidth = eleOuterWidth;

					//窗口放大后自动滑动tab补全后面的空白，缩小不控制
					var l =  eleOuterWidth - ( controller.getTabsWidth() - Math.abs( controller.getScrollLeft() ) ) - controller.getToggleTipWidth()*2;
					if( l > 0 ) controller.setScrollLeft( l + 5 );
					
				},300);
			});

			//给父控制器一个自动打开某个选项卡的方法
			scope.$parent.autoOpenTab = function(num){
				$timeout(function(){
					$("#zhx-tabset-navigation li:nth("+ (num - 1) +")").trigger("click");
				},10);
			};

		},
		template : '<div id="zhx-tabset-wrap">' +
						'<div id="zhx-tabset-navigation" ng-style="{ width : navigationWidth,minWidth : navigationWidth }">' +
							'<div id="nav-wrapper" ng-style="{ left : navOffsetLeft }">' +
								'<ul ng-repeat="n in tabsNav" ng-style="{ width: navigationWidth }" >' +
									'<tabf ng-repeat="t in n" title="t[dateFormat.name]" tpl-module="t[dateFormat.moduleName]" tpl-url="t[dateFormat.template]" children="t[dateFormat.children]" father="$id"></tabf>'+
								'</ul>' +
							'</div>'+
						'</div>'+
						'<div id="zhx-tabset-content">'+
							'<div id="zhx-tabset-content-tabs" ng-show="isCreatedTabs.length">'+
								'<toogle-tip class="zhx-icon-font icon-pullleft" ng-style="{ \'width\' : toggleTipWidth }" id="toogleLeft" ng-if="hasToogleLeft" ng-click="scrollTabs(\'left\')"></toogle-tip>'+
								'<ul ng-style="{ \'left\': scrollLeft }" ng-class="{ toogleLeftShow:hasToogleLeft }"></ul>'+
								'<toogle-tip class="zhx-icon-font icon-pullright" ng-style="{ \'width\' : toggleTipWidth }" id="toogleRight" ng-if="hasToogleRight" ng-click="scrollTabs(\'right\')"></toogle-tip>'+
							'</div>'+
							'<div id="zhx-tabset-content-main"></div>'+
						'</div>'+
					'</div>'

	}

}]);

/**
 *
 * 这里相当于处理左侧菜单具体事务前的一个预处理，将菜单分成两部分,一部分有子菜单（三级菜单），一部分没有子菜单（通过JSON中children字段数组是否为空判断）、
 * 
 * 如果有子菜单则需要添加对应的折叠打开事件，并使用tab指令来渲染子菜单选项
 * 如果无子菜单则直接转为tab指令来处理最终的菜单事件与渲染
 * 
 * 根据接收的数据判断生成直接点击的菜单还是拥有子集的折叠菜单
 */
angular.module("zhxTabFrame").directive("tabf", ['$compile','$timeout',function($compile,$timeout){
	return {
		restrict : "E",
		scope : {
			title : "=",
			tplModule : "=",
			tplUrl : "=",
			children : "=",
			father : '='
		},
		replace : true,
		require : "^zhxTabSet",
		template :  "<div ng-class='{ \"tab-slide-menu\" : childrenLen }' >" +
						"<div ng-if='childrenLen' ng-click='showSlideMenu($event)' ng-class='{ isChildActive : isShowChild }'>" +
							"<span class='zhx-icon-font icon-right' ng-class='{ iconRotated : isShowChild }'></span>{{ title }}" +
						"</div>" +
						"<ul ng-class='{ isChild : childrenLen,activeChild: isShowChild }' ng-style='{ height: childHeight, overflow: \"hidden\" }' ng-if='childrenLen'>" +
							'<tab ng-repeat="c in children" title="c.name" tpl-module="c.tplModule" tpl-url="c.tplUrl" is-child="childrenLen" father="father"></tab>' +
						"</ul>" +
						'<tab ng-if="!childrenLen" title="title" tpl-module="tplModule" tpl-url="tplUrl" is-child="childrenLen"></tab>' +
					"</div>"
		,link : function( scope, element, attrs, controller ){

			scope.isShowChild = false;
			scope.childHeight = 0;
			scope.childrenLen = scope.children.length;

			//如果当前选项卡有子集（三级），则将此选项卡添加至总控制器（拥有自己选项卡 数组中，以便下面控制打开与折叠）
			if( scope.children.length ) controller.pushChildTab(scope);

			//打开当前折叠菜单
			scope.showSlideMenu = function(event){
				controller.openChildTab(scope);
			}

		}
	}
}]);

//this directive will create the tabs and events
angular.module("zhxTabFrame").directive("tab",['$compile','$timeout','$ocLazyLoad','zhxTabTools',function($compile,$timeout,$ocLazyLoad,zhxTabTools){

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
			scope.tabId = zhxTabTools.newId();

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

					$(tpl).appendTo("#zhx-tabset-content-main");

					//生成对应选项卡小标签
					var smallTab = $compile('<li style="cursor:pointer" ng-click="select($event,\'tabs\')" ng-right-click="contextMenu($event);" ng-class="{ smallActive: selected }">{{ title }}<span class="zhx-icon-font icon-close" style="cursor:pointer" ng-click="closeTab(\''+ scope.tabId +'\',$event);"></span></li>')(tabScope);
					$(smallTab).addClass(scope.tabId);
					$(smallTab).appendTo("#zhx-tabset-content-tabs > ul");

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

//this is the click button for tabset, it can scroll the tab ul to left or right.
angular.module("zhxTabFrame").directive("toogleTip", function(){
	return {
		restrict : "E",
		require : "^zhxTabSet",
		link : function( scope, element, attrs, controller ){

			var toggleTipWidth = controller.getToggleTipWidth();

			scope.scrollTabs = function(direction){
				switch( direction ){
					case "left":
						var tabsTipWrapWidth = controller.getTabTipWrapWidth() - toggleTipWidth*2;

						if( $.isNumeric( controller.getScrollLeft() ) ){
							if( Math.abs(  controller.getScrollLeft() ) < tabsTipWrapWidth ){
								scope.$parent.scrollLeft -= scope.$parent.scrollLeft;
							} else {
								scope.$parent.scrollLeft += tabsTipWrapWidth;
							}
						}
					break;
					case "right":
						var tabsWidth = controller.getTabsWidth()
							tabsTipWrapWidth = controller.getTabTipWrapWidth() - toggleTipWidth*2;

							if( tabsWidth - tabsTipWrapWidth  > tabsTipWrapWidth + Math.abs( scope.scrollLeft ) ){
								controller.setScrollLeft( -tabsTipWrapWidth );
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
//extend angularjs the event of right-click directive
angular.module("zhxTabFrame").directive("ngRightClick",['$parse',function($parse){
	return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
}])

})();

