'use strict';
console.log(22);

var ngApp = angular.module('myApp', ['oc.lazyLoad']);
ngApp.config(['$ocLazyLoadProvider','$controllerProvider','$compileProvider','$filterProvider','$provide',
function($ocLazyLoadProvider,$controllerProvider,$compileProvider,$filterProvider,$provide){



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
}]);

ngApp.controller('myCtrl', ['$scope','$compile','$ocLazyLoad','tabTools'
    ,function($scope,$compile,$ocLazyLoad,tabTools){
// ngApp.controller('myCtrl', ['$scope','$compile','$ocLazyLoad'
//     ,function($scope,$compile,$ocLazyLoad){
    $scope.pV = 'parentV';
    $scope.tabs = [];
    $scope.addTab = function(){
        let tabScope = this.$new()
        tabScope.tabId = tabTools.newId();
        tabScope.Name = 'GW001212121';
        this.tabs.push(tabScope);


            //选项卡内容生成与异步加载
        var tpl = $compile( `<div id="teModule" oc-lazy-load="teModule">
        <ng-include src="'mloadT/test.html'"></ng-include>
        </div>`)(tabScope);

        $(tpl).addClass(tabScope.tabId);

        // $(tpl).appendTo("#zhx-tabset-content-main");  //生成内容区域
        $(tpl).appendTo("#contents");  //生成内容区域

        //生成对应选项卡小标签
        var smallTab = $compile('<li style="cursor:pointer" ng-class="{ smallActive: selected }">{{ title }}<span class="zhx-icon-font icon-close" style="cursor:pointer" ng-click="closeTab(\''+tabScope.tabId+'\',$event);">'+tabScope.Name+'</span></li>')(tabScope);
        $(smallTab).addClass(tabScope.tabId);
        $(smallTab).appendTo("#tabs"); //tgdn
    }
    $scope.deletTab = function(){
        //移除视图代码
        
        //移除当前标签作用域（此作用域为选择标签时创建的作用域tabScope）;
        // tabScope.$destroy();
    }
    $scope.closeTab = function(tabId, event){
        //移除视图代码
        console.log("parent"+tabId)
        $('.'+tabId).remove();
        //移除当前标签作用域（此作用域为选择标签时创建的作用域tabScope）;
        // tabScope.$destroy();
        // this.tabs.
    }
    $scope.choseTab = function(){
        //移除视图代码

        //移除当前标签作用域（此作用域为选择标签时创建的作用域tabScope）;
        // tabScope.$destroy();
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


