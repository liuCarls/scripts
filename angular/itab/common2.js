
'use strict';

var app = angular.module('zhxProject',['oc.lazyLoad','zhxTabFrame']);

// app.config(['$scope', '$ocLazyLoadProvider','zhxFrameProvider',function($scope,$ocLazyLoadProvider, zhxFrameProvider){
app.config(['$ocLazyLoadProvider','$controllerProvider','$compileProvider','$filterProvider','$provide', 'zhxFrameProvider',
function($ocLazyLoadProvider,$controllerProvider,$compileProvider,$filterProvider,$provide, zhxFrameProvider){
	//
	app.controller = $controllerProvider.register;
	app.directive = $compileProvider.directive;
	app.filter = $filterProvider.register;
	app.factory = $provide.factory;
	app.service = $provide.service;
	app.constant = $provide.constant;

	//需要配置框架基础属性
	zhxFrameProvider.config({
		//数据读取的路径，这里为URL地址，必填
		dataUrl  : "data/nav-data.json",
		/**
		 * 数据获取后的格式路径，默认data, 数据在组件中通过$http获取后，在返回对象中
		 * 会获取数据 result.data ，这里的data为数据获取路径，如果项目数据获取路径有变化
		 * 例如数据最终获取为 data.res,那这里可以定义
		 *  dataSrc : "data.res"
		 *  即可。组件会拼接为result.data.res来获取最终的数据对象
		 */
		dataSrc : "data.res",
		/**
		 * 获取JSON对象的数据格式的KEY名称定义，默认id 为不可变项目，其他都可以自由配置
		 * 可以配置以下KEY（以下为组件默认）
		 * order,name,icon,moduleName,template,children
		 * @type {Object}
		 */
		dataFormat : {
			"moduleName" : "module",
			"template" : "url",
			"children" : "child"
		},
		//项目的LOGO名称
		logoText : "OneTabs",
		// logoUrl : "",
		headerHeight : 40,
		//左侧导航宽度
		navigationWidth : 170,
		//右侧隐藏功能菜单宽度
		settingWidth : 120,
		// footerHeight : 30,
		// isShowFooter : false
	});

	$ocLazyLoadProvider.config({

		debug : false,
		//定义导航模块以及每个模块需要的控制器
	 	modules: [
	 	{
		    name: 'teModule',
		    files: ['tpl/mloadT/test.js']
		 }
	 	]

	});
}]);
app.controller('AppCtrl',function($scope){
	$scope.text = 'parentText';
})
