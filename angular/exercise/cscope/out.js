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
    //查询出菜单
    $scope.menus = [{name:'Menu1', moduleName:'fpage/fpage.js',template:'fpage/fpage.html', type:'nav'},
        {name:'Menu2', moduleName:'mloadT/test.js',template:'mloadT/test.html', type:'nav'}];
    
    $scope.menu = $scope.menus[0];

    /**
     * 延迟加载首页
     */
    $timeout(function(){
        $scope.addTab(null,  $scope.menu);
    }, 0);

    $scope.tabs = [];
    
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
                $scope.selectTab(me);
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
                
            } else if(tabScope.type == 'tab') {
                this.tabs.push(tabScope);
                //生成对应选项卡小标签
                var smallTab = $compile('<li style="cursor:pointer" ng-click="addTab($event,\'tabs\')" ng-right-click="contextMenu($event);" ng-class="{ smallActive: selected }">{{ title }}<span class="tab-icon-font icon-close" style="cursor:pointer" ng-click="closeTab(\''+tabScope.tabId+'\',$event);"></span></li>')(tabScope);
                $(smallTab).addClass(tabScope.tabId);
                $(smallTab).appendTo("#itabs > ul"); //tgdn
                $timeout(function(){
                    
                    $scope.addTabsWidth($(smallTab).outerWidth());
                    $("#itabs > ul").outerWidth( $scope.getTabsWidth() + 5 );
                }, 0);
            }
        }
    }

    $scope.selectTab = function(thisTab){
        angular.forEach( $scope.tabs, function( tab ){
            tab.selected = false;
        });
        thisTab.selected = true;
    };
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


