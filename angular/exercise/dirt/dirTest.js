var app = angular.module('myApp',[]);
app.directive('grTab',function(){  //自定义指令
  return {
    restrict : 'EA', //定义标签属性
    templateUrl : 'tabqh1.html', //外部引入html文件
    replace : true, //把当前自定义的指令标签替换成引入的标签
    scope : { //作用域隔离 ： 每个作用域执行的是自己的功能
      grId : '@', //拿所有grId的字符串
      grData : '=' //拿所有grData属性的变量名
    },
    link : function( scope , element , attr ){ //dom操作
      element.delegate('a','click',function(){
        $(this).addClass('first').siblings('a').removeClass('first');
        $(this).siblings('div').eq($(this).index()).css('display','block').siblings('div').css('display','none')
      });
    }
  };
})
app.controller('appCtrl',['$scope',function($scope){
  $scope.data1 = [
    {'val':'小花','title':'它是一个比较帅气的男孩儿',"img":"img/img1.png"},
    {'val':'小兰','title':'它有着一张跟年龄不服的脸庞',"img":"img/img2.png"},
    {'val':'小光','title':'它是一个比较任性的男孩儿',"img":"img/img3.png"},
    {'val':'小赫','title':'它是个逗比',"img":"img/img4.png"}
  ]

  $scope.ctrFlavor = "百事可乐";
  $scope.ctrFlavor2 = "百事可乐";
  $scope.sayHello = function(name){
    console.log('Hello'+name);
    }
}]);


// ------------指令与控制器之间交互----------------
app.controller('myAppCtrl', ['$scope', function($scope){
 console.log($scope);
 $scope.loadData = function(){
  console.log('数据加载中.....');
 }
}]);

app.controller('myAppCtrl2', ['$scope', function($scope){
 console.log($scope);
 $scope.loadData2 = function(){
  console.log('数据加载中2.....');
 }
}]);
//指令与控制器之间交互
app.directive('loader', function(){
	return {
  restrict: 'EA',
  template: '<div ng-transclude></div>',
  transclude: true,
  controller: function(scope, element, attrs, transclude ){
    scope.dirV = 'dirV';
    scope.loaderAction = function(){
      console.log(scope.dirV);
      console.log('loaderAction');
    }
  },
  replace: true,
	//明确对于控制器ng-controller都会创建属于自己独立的scope;对于指令若无scope:{}声明会继承控制器中的scope
//   scope: {}, /*独立scope*/
  link: function(scope, element, attrs){
		//link是用来操作dom和绑定监听事件的。
   element.bind('mousedown', function(){
    /*这里调用controller中的方法三种方式*/
    /*(1) scope.loadData(); 两个控制器方法不一致时，就不能用了
     (2) scope.$apply('loadData()'); $apply()方法会从所有控制器中找到多对应的方法。这就实现了指令的复用。
     (3) attrs.howtoload === 属性上绑定的函数名称*/
    //属性方式 注意坑！！！ howtoload得小写
    scope.$apply(attrs.howtoload);
   })
  }
 }
});


//------------指令与指令之间交互----------------
app.directive('superman', function(){
 return {
  scope: {},/*独立作用域*/
  restrict: 'AE',
  template: '<button class="btn btn-primary" ng-transclude></button>',
  transclude: true,
  controller: function($scope){
    /*暴露controller里面方法,指令中的controller相当于暴露里面方法，便于指令复用*/
   $scope.abilities = [];
   this.addStrength = function(){
    $scope.abilities.push('strength');
   };

   this.addSpeed = function(){
    $scope.abilities.push('speed');
   };
   this.addLight = function(){
    $scope.abilities.push('light');
   };
  },
  /*
  element : 表示被编译后的、包含了 DOM 节点的 jqLite\jQuery 对象（如：如果 directive
    是一个 div 元素，那么 element 是一个 jqLite\jQuery 包装的对象）。
  attrs: attrs 是一个对象。这个对象的每一个属性代表着 Node 中的每一个同名属性。
  （如：Node 中有一个 my-attribute 属性，那么就可以通过 attrs.myAttribute 来获取该属性的值）
  */
  link: function(scope, element, attrs, supermanCtr){
   element.addClass = "btn btn-primary";
   element.bind('mousedown', function(){
    console.log(scope.abilities);
   })
  }
 }
})

app.directive('strength', function(){
 return {
  require: "^superman",/*require参数指明需要依赖的指令*/
  //link函数可以接受require指令的controller，ngModelController
  link: function(scope, element, attrs, supermanCtr){
   supermanCtr.addStrength();
  }
 }
});

app.directive('speed', function(){
 return {
  require: "^superman",
  link: function(scope, element, attrs, supermanCtr){
   supermanCtr.addSpeed();
  }
 }
});

app.directive('light', function(){
 return {
  require: "^superman",
  link: function(scope, element, attrs, supermanCtr){
   supermanCtr.addLight();
  }
 }
});

//--------------scope作用域绑定策略-----------
// “@” 把当前属性值(此为指令上的属性值)作为字符串传值, 还可以绑定来自外层scope的值，在属性值中插入{{}}即可
// “=” 与父scope属性进行双向绑定
// '&'传递一个来自父scope的函数，稍后调用

app.directive('drink', function(){
   return {
     restrict: 'AE',
    scope: { /*独立scope作用域*/
     flavor: '@'
    },
    replace:false,
  //   template: '<p>{{flavor}}</p>'
    template: '<input type="text" class="form-control" ng-model="flavor" />{{flavor}}<br/>'
    //使用link进行指令和控制器两个作用域中数据的绑定。
    //如果用scope中@的话，就不需要link这么麻烦了，angularJS会自动进行绑定
    /*,
    link:function(scope,element,attrs){
     element.bind('mouseenter', function(){
     })
     scope.flavor = attrs.flavor;
    }*/
   }
});
app.directive('drink2',function(){
 return {
  restrict: 'EA',
  scope: { /*ng-isolate-scope 隔离作用域*/
   flavor : '='
  },
  template: '<input type="text" class="form-control" ng-model="flavor"/>'
  /*replace:true*/
 }
});

app.directive('greeting', function(){
 return {
  restrict: 'EA',
  scope: { /*'&'传递一个来自父scope的函数，稍后调用*/
   greet : '&'
  },
  templateUrl: 'sayHello.html'
 }
});

//
app.directive('repeater', function($document) {
    return {
        restrict: 'A',
        compile: function(element, attrs) {
            var template = $(element).children().clone();
            for(var i=0; i<attrs.repeater - 1; i++) {
                $(element).append(template.clone());
            }
            return {
                pre: function(scope, iElem, iAttrs) {
                    console.log('pre link start ');
                },
                //这里的post函数想当于link函数
                post: function(scope, iElem, iAttrs) {
                    console.log('post link start ');
                    iElem
                }
            }
        },
        link: function(scope, tElement, tAttrs){
            console.log(scope.name);
        },
        controller: function($scope, $element, $attrs) {
            console.log('controller start ');
        }
   }
});
