"use strict";

//create the main directive.
ngApp.directive("tabSet",['$timeout','menuFormat','zhxTabTools','$compile',
    function($timeout,menuFormat,tabTools,$compile){

        return {
            restrict: "AE",
            replace: true,
            scope: {
                navs:'='
            },
            controller : ['$scope',function( $scope ){
                $scope.menu = $scope.navs[0];
                var me = this; //表示一个空的对象，表示该指令的控制器，
                $scope.isCreatedTabs = [];  //已经生成的tab
                $scope.tabsWidth = 0;  //实际长度
                $scope.tabsTipWrapWidth = 0; //可见长度
                $scope.scrollLeft = 0;
                //set toggleTip width px; left or right
                $scope.toggleTipWidth = 20;

                $scope.dateFormat = menuFormat;

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
                    angular.forEach( $scope.isCreatedTabs, function( tab ){
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
                me.removeCreatedTab = function(pTabId){
                    //移除时检查当前共有多少选项卡被激活，如果大于1个则需要计算，如果只有1个，则直接清空数组
                    if( $scope.isCreatedTabs.length > 1 ){
                        for( var i = 0; i < $scope.isCreatedTabs.length; i++ ){
                            var vTab = $scope.isCreatedTabs[i];
                            if( vTab.tabId == pTabId ){
                                //直接关闭非当前，不应该自动选择其他选项卡
                                if( vTab.selected ){
                                    if( i < $scope.isCreatedTabs.length - 1 ){
                                        me.selectTab( $scope.isCreatedTabs[ i + 1 ] );
                                    } else {
                                        me.selectTab( $scope.isCreatedTabs[ $scope.isCreatedTabs.length - 2 ] );
                                    }
                                }
                                $scope.isCreatedTabs.splice( i, 1 );
                                vTab.$destroy();
                            }
                        }
                    } else {
                        me.selectTab( $scope.isCreatedTabs[0] );
                        $scope.isCreatedTabs = [];
                    }
                };
                me.getTabScope = function(tabId){
                    for(var tabScope of $scope.tabs){
                        if(tabScope.tabId == tabid){
                            return tabScope;
                        }
                    }
                    return $scope
                }
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

                me.hasToggleLR = function(){
                    return $scope.hasToogleLeft && $scope.hasToogleRight;
                };

            }],
            link : function( scope, element, attrs, controller ){

                // scope.navigationWidth = zhxFrame.getNavWidth();
                scope.navigationWidth = 200;

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
                //-------------------------
                /**
                 * 延迟加载首页
                 */
                $timeout(function(){
                    // document.createEvent('UIEvents');
                    // controller.addTab(document.createEvent('UIEvents'),scope.menu);
                    scope.select(document.createEvent('UIEvents'),scope.menu);

                    // this.addTab(null,  $scope.menu); //this不可用
                }, 0);
                /**
                 * 选择标签
                 * 每次选择时判断是否已被创建过（隐藏而非关闭）
                 * @return {[type]} [description]
                 */
                scope.select = function(event,evTarget){
                    event.stopPropagation();

                    //如果已经被创建，仅是隐藏，则直接打开选项卡
                    var tabScope = null;
                    for(var tmpV of scope.isCreatedTabs){
                        if(tmpV.name == evTarget.name){
                            tabScope = tmpV;
                            break;
                        }
                    }

                    if( tabScope!=null ){
                        controller.selectTab(tabScope);
                        //只能找到ng-repeat级别的父，真是的父序号得+1
                        // controller.openFatherTab(scope.father + 1);
                        //如果从未被创建，则进行首次创建
                    } else {

                        //每次新建都创建一个新的作用域，每次关闭标签都会移除这个作用域
                        tabScope = scope.$new();
                        tabScope.tabId = tabTools.newId();
                        tabScope.param = evTarget;
                        tabScope.type = evTarget.type;
                        tabScope.htmlUrl = evTarget.template;
                        tabScope.moduleName = evTarget.moduleName;
                        tabScope.name = evTarget.name;
                        tabScope.selected = true;

                        //增加Tab自有属性，




                        controller.selectTab(tabScope);

                        //选项卡内容生成与异步加载
                        // var tpl = $compile( '<div ng-show="selected">' +
                        //                     '<div oc-lazy-load="tplModule">' +
                        //                     '<ng-include src="tplUrl">if you see this, it means contents is not be loaded</ng-include>'+
                        //                     '</div></div>')(tabScope);
                        var tpl = $compile( `<div ng-show="selected"><div id="teModule" oc-lazy-load="'`+tabScope.moduleName+`'">
                                            <ng-include src="'`+tabScope.htmlUrl+`'"></ng-include>
                                            </div></div>`)(tabScope);
                        $(tpl).addClass(tabScope.tabId);
                        $(tpl).appendTo("#contents");

                        if( tabScope.type == 'nav' ){
                            if(this.isCreatedTabs.length>0&&this.isCreatedTabs[0].type=='nav'){
                                //删除原来的菜单工作区
                                var deleteWork = this.isCreatedTabs.shift();
                                $('.'+deleteWork.tabId).remove();
                                deleteWork.$destroy();
                            }
                            this.isCreatedTabs.splice(0,0,tabScope); //菜单只保留一个工作区，并且不生产Tab
                        } else if(tabScope.type == 'tabs') {
                            this.isCreatedTabs.push(tabScope);
                            //生成对应选项卡小标签
                            var smallTab = $compile('<li style="cursor:pointer" ng-click="select($event,this)" ng-right1-click="contextMenu($event);" '+
                                'ng-class="{ smallActive: selected }">{{ name }}' +
                                '<span class="zhx-icon-font icon-close" style="cursor:pointer" ng-click="closeTab(\''+ tabScope.tabId +'\',$event);"></span></li>')(tabScope);
                            $(smallTab).addClass(tabScope.tabId);
                            $(smallTab).appendTo("#tabset-content-tabs > ul");

                            $timeout(function(){
                                // controller.addTabsWidth( angular.element(smallTab).outerWidth() );
                                controller.addTabsWidth($(smallTab).outerWidth());
                                $("#tabset-content-tabs > ul").outerWidth( controller.getTabsWidth() + 5 );
                            },0);
                        }
                    };
                    /**
                     * 选中tab源，切换tab
                     */
                    $timeout(function(){
                        //首先判断是否已经出现选项卡超界（左右出现按钮）（scope判断）
                        if( controller.hasToggleLR() ){

                            var targetTab;
                            var hasToogleTip =  controller.hasToggleLR();
                            var tabsWraperWidth = controller.getTipWrapWidth();
                            var prevLiWidth = 0;
                            var toggleTipWidth = controller.getToggleTipWidth();

                            if( evTarget.type == 'nav' ){
                                targetTab = $("#tabset-content-tabs > ul").find("."+ scope.tabId);
                            } else if(evTarget.type == 'tabs'){
                                targetTab = $(event.target);
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


                        }

                    },10);
                };

                //移除标签页
                scope.closeTab = function(tabId,event){

                    event.stopPropagation();

                    $timeout(function(){

                        var eventTarget = event.target.tagName == "LI" ? $(event.target) : $(event.target).parent();

                        //移除以后重新计算宽度
                        controller.substractTabsWidth( eventTarget.outerWidth() );
                        $("#tabset-content-tabs > ul").outerWidth( controller.getTabsWidth() + 5 );

                        //关闭时应自动滚动tab，不应留白
                        if( controller.getScrollLeft() !== 0 ) controller.setScrollLeft( eventTarget.outerWidth() );

                        //移除视图代码
                        //这里不能使用ng-if 因为其会缓存内容，无法真正清除DOM。
                        //新创建的选项卡DOM应该是全新的。
                        $('.'+tabId).remove();

                        //移除当前Active的tab并且会自动选择周围临近的标签
                        controller.removeCreatedTab( tabId );

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
                            $("#tabset-content-tabs li:not("+ thisId +")").each(function(){
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
                            $("#tabset-content-tabs").find( thisId ).nextAll().each(function(){
                                var thisLi = $(this);
                                thisLi.find("span").trigger("click");
                            });
                        },50);
                    }

                };

                //right-click to show context menu
                scope.contextMenu = function(event){
                    //scope是顶层范围， this是当前范围
                    event.stopPropagation();

                    // controller.removeContextMenu();
                    $(".zhx-tabset-contextmenu").remove();

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

            },
            template :
            '<header ng-style="{ height : headerHeight }">' +
            '<div id="header-nav-bar">' +
            '<ul>' +
            '<li ng-repeat="n in navs" ng-click="select($event,n);" ng-class="{isActiveTab : isActiveTab == $index }">{{ n[dateFormat.name] }}</li>' +
            '</ul>' +
            '</div>' +
            '<div id="tabset-content-tabs" ng-show="isCreatedTabs.length">'+
            '<toogle-tip class="zhx-icon-font icon-pullleft" ng-style="{ \'width\' : toggleTipWidth }" id="toogleLeft" ng-if="hasToogleLeft" ng-click="scrollTabs(\'left\')"></toogle-tip>'+
            '<ul ng-style="{ \'left\': scrollLeft +\'px\'}" ng-class="{ toogleLeftShow:hasToogleLeft }"></ul>'+
            '<toogle-tip class="zhx-icon-font icon-pullright" ng-style="{ \'width\' : toggleTipWidth }" id="toogleRight" ng-if="hasToogleRight" ng-click="scrollTabs(\'right\')"></toogle-tip>'+
            '</div>'+
            '</header>'
        }

    }]);

//this is the click button for tabset, it can scroll the tab ul to left or right.
ngApp.directive("toogleTip", function(){
    return {
        restrict : "E",
        require : "^tabSet",
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
//
ngApp.directive("ngRight1Click",['$parse',function($parse){
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRight1Click);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
}]);

