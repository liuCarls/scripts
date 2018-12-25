(function(){
	'use strict';

	var app = angular.module('zhxProject',['oc.lazyLoad','zhxTabFrame']);

	app.config(['$ocLazyLoadProvider','zhxFrameProvider',function($ocLazyLoadProvider, zhxFrameProvider){

		//需要配置框架基础属性
		zhxFrameProvider.config({
			//数据读取的路径，这里为URL地址，必填
			dataUrl  : "data/nav-data1.json",
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
			//这里模拟了9个选项卡
		 	modules: [
		 	{
			    name: 'tab1',
			    files: ['tpl/tab1-controller.js']
			 },{
			 	name: 'tab2',
			    files: ['tpl/tab2-controller.js']
			 },{
			 	name: 'tab3',
			    files: ['tpl/tab3-controller.js']
			 },{
			 	name: 'tab4',
			    files: ['tpl/tab4-controller.js']
			 },{
			 	name: 'tab5',
			    files: ['tpl/tab5-controller.js']
			 },{
			 	name: 'tab6',
			    files: ['tpl/tab6-controller.js']
			 },{
			 	name: 'tab7',
			    files: ['tpl/tab7-controller.js']
			 },{
			 	name: 'tab8',
			    files: ['tpl/tab8-controller.js']
			 },{
			 	name: 'tab9',
			    files: ['tpl/tab9-controller.js']
			 }
		 	]

		});

	}]);

})();
