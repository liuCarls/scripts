var tab1 = angular.module('tab2',['',
	[
		'../lib/grid/zhx-data-grid.css',
		'../lib/grid/zhx-data-grid.js',
		'../lib/echarts/dist/echarts.min.js'
	]
]);

tab1.controller("tab2Controller",function($scope,$http){

	$scope.text = "这里是第二个选项卡控制器的实现";

	$http.get('data/data.json').then(function(result){
		$scope.data = result.data;
	});


	//基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('tab2-chart'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);


})

