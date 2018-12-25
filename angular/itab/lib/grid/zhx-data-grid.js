(function(){
    'use strict';
/**
 * 数据表模块
 *
 * 目前模块主要依赖数据表模板
 * TODO 模板未抽离
 *
 * 数据表目前已实现如下功能
 * a)初始化loading遮罩
 * b)全选，非全选
 * c)表头固定
 * d)列的隐藏与显示
 * e)列排序
 * f)列宽的拖动设置
 * g)翻页指令控制
 * h)隐藏行折叠功能
 *
 */
angular.module("zhxDataGrid",[]);

})();
(function(){
    'use strict';
    /**
     * JAVASCRIPT 全局数组对象新增 indexOf 和 remove 两个方法
     * 用来移除数组中指定值（非下标）
     */
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    Array.prototype.max=function(){
        var max = this[0];

        for(var i=1;i<this.length;i++){ 

          if(max<this[i])max=this[i];
          }
         return max;
    } 
})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");

    /**
     *
     * zhx-data-grid service
     *
     */
    module.service("gridUtil",gridUtil);

    function gridUtil(){
        var s = {};

        //数组叠加
        s.addArray = function(arr,start,end){
            var addCount = 0;
            for( var i = start; i < end; i++){
                addCount += arr[i];
            }
            return addCount;
        };

        //获取页面宽
        s.getDocWidth = function(){
            return document.documentElement.clientWidth;
        };

        //获取页面高
        s.getDocHeight = function(){
            return document.documentElement.clientHeight;
        };

        s.removeArrayItem = function(arrayIds,arrayItems,id){
            for( var i = 0,len = arrayIds.length; i < len; i++){
                if( id == arrayIds[i] ){
                    arrayItems.remove( arrayItems[i] );
                    arrayIds.remove( id );
                }
            }
        };
        s.newId = function(){
            var date,seed,char,randomChar="",string;
            date = new Date().getTime();
            seed = parseInt( Math.random(1,1000) * 1000 );
            char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for( var i = 0 ; i < 5; i++ ){
                randomChar += char.charAt(Math.floor(Math.random() * 52));
            }
            string = String(seed + date) + randomChar;
            return string.substr(10);
        };

        /**
         * //子滚动不触发父滚动
         * //此主要应用在同一页面有两层滚动条的情况下
         * @param obj  jQuery Object
         */
        s.scrollUnique = function(obj) {
            obj.each(function() {
                var eventType = 'mousewheel';
                if (document.mozHidden !== undefined) {
                    eventType = 'DOMMouseScroll';
                }
                obj.on(eventType, function(event) {
                    // 一些数据
                    var scrollTop = obj[0].scrollTop,
                        scrollHeight = obj[0].scrollHeight,
                        height = obj[0].clientHeight;

                    var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);

                    if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                        // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                        obj[0].scrollTop = delta > 0? 0: scrollHeight;
                        // 向上滚 || 向下滚
                        event.preventDefault();
                    }
                });
            });
        };

        return s;
    }

})();
(function(){
    'use strict';
    var module = angular.module("zhxDataGrid");

    /**
     * Grid通用服务，目前主要给Grid提供数据提交接口与多选的暂存。
     * 需要浏览器sessionStorage支持。
     */
    module.factory("gridService",['$rootScope','$http','$q',function($rootScope,$http,$q){

        var service = {
            setCheckedItem      : setCheckedItem,
            setCheckedId        : setCheckedId,
            getCheckedItems     : getCheckedItems,
            getCheckedIds       : getCheckedIds,
            removeItem          : removeItem,
            setGridData         : setGridData,
            getGridData         : getGridData,
            submit              : submit
        };

        function setCheckedItem(gridName,ckedItem){

            var checkedObj = sessionStorage.getItem( gridName + 'checkedItems' );

            if( checkedObj == '' ){
                checkedObj = {
                    checkedItems : []
                };
            } else {
                checkedObj = JSON.parse(checkedObj);
            }

            if( checkedObj !== null ){
                //var isAdd = checkArrayValid(gridName,ckedItem);
                //if( isAdd  ) return;
                checkedObj.checkedItems.push(ckedItem);
                checkedObj = JSON.stringify(checkedObj);
                sessionStorage.setItem( gridName + 'checkedItems' ,checkedObj);
            }

        };
        function setCheckedId(gridName,ckedId){

            var checkedObj = sessionStorage.getItem( gridName + 'checkedIds' );

            if( checkedObj == '' ){
                checkedObj = {
                    checkedIds : []
                };
            } else {
                checkedObj = JSON.parse(checkedObj);
            }

            if( checkedObj !== null ){
                checkedObj.checkedIds.push(ckedId);
                checkedObj = JSON.stringify(checkedObj);
                sessionStorage.setItem( gridName + 'checkedIds' ,checkedObj);
            }
        };

        function getCheckedItems(gridName){
            if( (sessionStorage.getItem( gridName + 'checkedItems') == null &&
                sessionStorage.getItem( gridName + 'checkedIds') == null) ||
                (sessionStorage.getItem( gridName + 'checkedItems') == '' &&
                sessionStorage.getItem( gridName + 'checkedIds') == '') ){
                sessionStorage.setItem( gridName + 'checkedItems' ,'');
                sessionStorage.setItem( gridName + 'checkedIds' ,'');
                return [];
            } else {
                var checkItems = sessionStorage.getItem( gridName + 'checkedItems' );
                var checkedObj = JSON.parse(checkItems);
                var checkedItems = checkedObj.checkedItems;
                return checkedItems;
            }
        };

        function getCheckedIds(gridName){
            if( (sessionStorage.getItem( gridName + 'checkedItems') == null &&
                sessionStorage.getItem( gridName + 'checkedIds') == null) ||
                (sessionStorage.getItem( gridName + 'checkedItems') == '' &&
                sessionStorage.getItem( gridName + 'checkedIds') == '') ){
                sessionStorage.setItem( gridName + 'checkedItems' ,'');
                sessionStorage.setItem( gridName + 'checkedIds' ,'');
                return [];
            } else {
                var checkIds = sessionStorage.getItem( gridName + 'checkedIds' );
                var checkedObj = JSON.parse(checkIds);
                var checkedIds = checkedObj.checkedIds;
                return checkedIds;
            }
        };

        function removeItem(gridName,removeId){
            var checkedIds = sessionStorage.getItem( gridName + 'checkedIds' );
            var checkedItems = sessionStorage.getItem( gridName + 'checkedItems' );
            if( checkedIds !== null && checkedIds != '' ){

                checkedIds = JSON.parse(checkedIds);
                checkedIds = checkedIds.checkedIds;
                checkedItems = JSON.parse(checkedItems);
                checkedItems = checkedItems.checkedItems;

                if( checkedIds.length ){

                    for(var i = 0; i < checkedIds.length; i++ ){
                        if( removeId == checkedIds[i] ){
                            checkedItems.remove( checkedItems[i] );
                            checkedIds.remove( removeId );
                        }
                    }

                    var checkedIdsObj = {
                        checkedIds : checkedIds
                    };
                    var checkedItemsObj = {
                        checkedItems : checkedItems
                    };
                    sessionStorage.setItem( gridName + 'checkedIds', JSON.stringify(checkedIdsObj) );
                    sessionStorage.setItem( gridName + 'checkedItems', JSON.stringify(checkedItemsObj) );

                } else {
                    console.log("并没有选中任何列表");
                }
            }

        };

        function setGridData(gridName, data ){
            if( angular.isObject(data) ){
                var stringData = JSON.stringify(data);
                //sessionStorage.removeItem( gridName + 'Data' );
                sessionStorage.setItem( gridName + 'Data', stringData );
            }
        }

        function getGridData(gridName){
            var data = sessionStorage.getItem( gridName + 'Data' );
            return data;
        }

        function submit(url,data){

            var data = data || {};

            var deferred = $q.defer();
            $http({
                method  : 'POST',
                url     :  url,
                data    : data  // pass in data as strings
                //headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {

                deferred.resolve(data);

            }).error(function(reason){

                deferred.reject(reason);

            });

            return deferred.promise;
        }

        return service;

    }]);

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");
    /**
     * classic Table 基础设置
     * 独立作用域scope,可作为组件多次在不同控制器内调用。
     * 此为Grid组件最顶级父作用域
     * @params grid-data        [Object Array]  必须设置属性，属性值对应控制器内定义的grid数据模型，格式为数组对象[object,object,object...]
     * @params grid-height      [Number]        非必须，如果定义了Grid高度，那么自适应高度则失效，表格将使用自定义高度设置
     * @params grid-flex-height [Number]        非必填属性，该属性值可以让当前Grid冗余一定的高度，例如当前页其他部分有其他内容，
     *                                          则填入其他内容的高度后，表格会自适应该高度。如果没有设置该属性，则表格会按照屏幕面积减
     * @params check-model      [boolean]       是否显示checkbox列
     * @params multi-expand     [boolean]       配合expand-row指令使用，为每一行新增一个可以新增一个折叠行的事件
     *
     *
     * 表头单元可设置参数（都为非必须）
     * @params twidth       [Number]    表示此列固定自定义宽度
     * @params order-by     [String]    对应数据模型中的字段（必须与 order-event 结合使用）
     * @params order-event  [Function]  默认填写 orderBy(order,desc)即可，然后在对应控制器中填写 orderBy 方法用来实现排序
     *
     * 注意：如果没有设定表格的任何高度参数，则表格会以自适应高度设置（参考上面grid-flex-height说明）.
     *      如果有需要自定义自适应高度，可以设置grid-flex-height。
     *
     *
     * 外部控制器（父控制器可以应用的方法）(暴露方法)
     *
     * $scope.renderGrid()  重新布局Grid
     *
     * $scope.toggleGridLoading(boolean)  手动启动或关闭Loading加载遮罩
     *
     */
    module.controller("classTableBaseController",['$scope','$element','gridUtil','$q','$compile',
        function($scope,$element,gridUtil,$q,$compile){

            //为Grid赋一个Id
            $element.attr("id","zhx-grid-" + gridUtil.newId() );
            //Loading模板
            var loadingTpl =
                "<div class='table-loading' ng-show='isHideLoading'>" +
                "<div class='table-loading-mask'></div>" +
                "<div class='table-loading-content'>" +
                "<span class='table_loading_img glyphicon glyphicon-asterisk'></span>" +
                "<span class='table_loading_txt'>正在加载,请稍候...</span>" +
                "</div>" +
                "</div>";
            //编译Loading
            loadingTpl = $compile(loadingTpl)($scope.$new());
            //添加Loading至Grid
            $element.append( angular.element(loadingTpl) );

            //初始化是否显示loading
            $scope.isHideLoading = true;
            /**
             * 父控制器可以介入控制GridLoading
             * @param status true显示 false隐藏
             */
            $scope.$parent.toggleGridLoading = function(status){
                $scope.isHideLoading = status;
            };

            /**
             * 父控制器传入参数来控制是否可以在多行同时展开隐藏行（expandRow指令）,
             * 如果不允许，则同时只能展开一个行，其他行则隐藏
             * @type {string|boolean}
             */
            this.showMultiExpand = $scope.multiExpand || false;
            this.multiExpandRows = [];

            this.expandThisRow = function(rowScope){
                rowScope.expanded = true;
            };
            this.collapseThisRow = function(rowScope){
                rowScope.expanded = false;
            }
            this.hideOtherExpandRow = function(rowScope){
                if( !this.showMultiExpand ){
                    angular.forEach( this.multiExpandRows, function(otherScope,key){
                        if( rowScope != otherScope ){
                            otherScope.expanded = false;
                        }
                    });
                }
                $scope.$parent.$digest();
            };

            //初始化表格默认宽度（最小宽度，由指令动态生成数值）
            $scope.gridWidth = 0;
            //指令内部使用暂存列宽度的数组
            var columnWidth = [];
            //指令内部使用暂存列left属性值的数组
            var columnLeft = [];
            //指令内部使用暂存列隐藏的数组
            var hideColumns = [];
            //指令内部使用暂存checkList
            //var checkedIds = [], checkedItems = [];

            this.getGridData = function(){
                return $scope.gridData;
            };

            this.promiseArr = [];

            this.renderHeaderPromise = $q.defer();
            this.renderRowsPromise = $q.defer();
            this.renderFooterPromise = $q.defer();

            this.promiseArr.push(this.renderHeaderPromise);
            this.promiseArr.push(this.renderRowsPromise);
            this.promiseArr.push(this.renderFooterPromise);


            /**
             * 接收来自checkAll的事件
             * value为 true全选  false取消全选
             */
            $scope.$parent.$on("gridCheckAll",function(ev,value){
                //向子作用于广播全选事件
                $scope.$parent.$broadcast("checkSelf",value);
            });
            /**
             * 接收来自子作用域（这里是列表）的选择事件，如果当前页已全部勾选，则需要
             * 通知全选按钮进行勾选
             */
            $scope.$parent.$on("setCheckAll",function(ev,value){
                //通知全选按钮进行全选或反选操作
                $scope.$parent.$broadcast("checkAll",value);
            });

            this.isBaseGrid = function(){
                if( $scope.basicGrid === undefined || $scope.basicGrid ){
                    return true
                } else {
                    return false;
                }
            }

            //this.getCheckedIds = function(){
            //    return checkedIds;
            //};
            //this.setCheckedIds = function(id){
            //    checkedIds.push(id);
            //};
            //this.getCheckedItems = function(){
            //    return checkedItems;
            //};
            //this.setCheckedItems = function(item){
            //    checkedItems.push(item);
            //}
            //this.removeChecked = function(id){
            //    gridUtil.removeArrayItem(checkedIds,checkedItems,id);
            //};

            this.getColumnWidth = function(){
                return columnWidth;
            };
            this.setColumnWidth = function(columnArr){
                if( angular.isArray(columnArr) ){
                    columnWidth = columnArr;
                } else {
                    console.error("传入的参数非数组");
                }
            };
            /**
             * status == true 意味通过列宽自动计算出做浮动距离
             * status == false 意味直接设置做浮动距离
             * @param columnWidth 为列宽数组或者为LEFT数组
             * @param status 是否根据列宽计算浮动距离
             */
            this.setColumnLeft = function(columnWidth,status){
                if( status ){
                    var ArrLeft = [];
                    for( var j = 0; j < columnWidth.length - 1; j++){
                        var left = 0;
                        if( j == 0 ) ArrLeft.push(0);
                        left = gridUtil.addArray(columnWidth,0,j + 1 );
                        ArrLeft.push(left);
                    }
                    columnLeft = ArrLeft;
                } else {
                    columnLeft = columnWidth;
                }
            };
            this.getColumnLeft = function(){
                return columnLeft;
            };
            this.getHideColumns = function(){
                return hideColumns;
            };
            this.setHideColumns = function(columns){
                if( angular.isArray(columns) ){
                    hideColumns = columns
                } else {
                    console.warn("传入的参数非数组");
                }
            };
            this.getScroll = function(){
                var tbodyContentHeight = $element.find(".tbody_wrapper").outerHeight();
                var tbodyHeight = $element.find(".tbody").outerHeight();
                if( tbodyContentHeight > tbodyHeight ){
                    return true;
                } else {
                    return false;
                }
            };
            this.hasFooter = function(){
                return $element.find(".tfoot").length ? true : false;
            };
            this.setGridWidth = function(width){
                $scope.gridWidth  = width;
            };
            this.getGridWidth = function(){
                return $scope.gridWidth;
            };

            this.getGridWrapWidth = function(){
                return $element.outerWidth();
            }
            this.setGridMinWidth = function(width){
                $scope.gridMinWidth = width;
            };
            this.getGridMinWidth = function(){
                return $scope.gridMinWidth;
            };
            this.hideLoading = function(){
                $scope.isHideLoading = false;
                $element.find(".table-loading").css("top",0);
                this.removeNoDataColumn();
            };
            this.showLoading = function(){
                $scope.isHideLoading = true;
                var scrollTop = $element.scrollTop();
                $element.find(".table-loading").css("top",scrollTop);
                this.setLoadingImgPos();
            };
            //设置LOADING中菊花的位置
            this.setLoadingImgPos = function(){
                var gridHeight = $element.outerHeight();
                var scrollTop = $element.scrollTop();
                $element.find(".table-loading > .table-loading-content").css("top",scrollTop + gridHeight / 2 - 35);
            };
            this.removeNoDataColumn = function(){
                $element.find(".no-data-row").remove();
            };
            this.setNoData = function(){
                this.hideLoading();
                if( $element.find('.tbody > .tbody_tr').length ) return;
                //添加无数据行
                var thTpl = angular.element("<div class='no-data-row'>暂无数据</div>");
                thTpl.appendTo($element.find('.tbody'));
            };
            /**
             * Grid更新
             * @param columnWidth [Array] 每一列的宽度
             * @param gridWidth [Number] 表格总宽度
             * @param status [boolean] 是否根据列宽计算浮动距离
             */
            this.updateGrid = function(columnWidth,gridWidth,status){
                this.setColumnWidth( columnWidth );
                this.setColumnLeft(columnWidth,status);
                this.setGridMinWidth( gridWidth );
            };
    }]);

    /**
     * 指令部分
     */
    module.directive("classTable",['$timeout','$window','$rootScope','$q','gridUtil',function($timeout,$window,$rootScope,$q,gridUtil){
        return {
            restrict : 'A',
            scope : {
                gridData : '=',
                gridHeight : '@',
                rowHeight : '@',
                gridFlexHeight : '@',
                basicGrid : '=',
                multiExpand : '='
            },
            //transclude : true,
            //template : '<div ng-transclude></div>',
            controller : 'classTableBaseController',
            compile : function(tElement,tAttr){
                /**
                 * Grid初始化指令到模板中（指令的运行方式为自定义dom标签，因此，这里为dom添加指令自定义标签）
                 * 日后模板抽离后，此处代码均可以省略
                 */
                var header = tElement.find(".thead"),
                    headerTr = header.find(".thead_tr"),
                    body = tElement.find(".tbody"),
                    foot = tElement.find(".tfoot"),
                    bodyTr = body.find(".tbody_tr");

                //表头固定 && 表头拖拽
                header.attr("fixed-table-header","").attr("drag-columns","");
                //表头控制列隐藏
                headerTr.attr("hide-columns","").attr("orders-tr","");

                headerTr.find(">div").each(function(){
                    var thisTr = $(this);
                    if( thisTr.attr("ng-repeat") ) thisTr.attr('class-cell','header');
                });

                //行渲染控制
                bodyTr.attr("class-td","");

                bodyTr.find(">div").each(function(){
                    var thisTr = $(this);
                    if( thisTr.attr("ng-repeat") ) thisTr.attr('class-cell','body');
                });

                //列脚渲染控制
                foot.attr("class-footer","");

                //foot.find(">div").each(function(){
                //    var thisTr = $(this);
                //    if( thisTr.attr("ng-repeat") ) thisTr.attr('class-cell','footer');
                //});

                body.wrapInner("<div class='tbody_wrapper' />");

                //设置行高，一般情况默认不需要设置此属性
                if( tAttr.rowHeight !== undefined ) {
                    bodyTr.outerHeight( tAttr.rowHeight );
                    body.find(".tbody_tr > div").outerHeight( tAttr.rowHeight );
                }

                /**
                 * 初始化是否应用checkModel(checkbox)
                 */
                var isCheckModel = tAttr.checkModel;

                if( isCheckModel == "true" ){
                    var checkTpl = angular.element("<div twidth='25'><input type='checkbox' check-all /></div>"),
                        checkListTpl =
                            angular.element("<div class='checkbox_wrapper'>" +
                            "<label class='checkbox_label'>" +
                            "<input type='checkbox' data='d' check-list />" +
                            "</label>" +
                            "</div>");

                    headerTr.prepend(checkTpl);
                    bodyTr.prepend(checkListTpl);
                }

                return {
                    post : function( scope, tElement, tAttrs, tableController ){

                        if( scope.basicGrid || scope.basicGrid === undefined ){
                            tableController.renderHeaderPromise.resolve("finished");
                            tableController.renderRowsPromise.resolve("finished");
                            tableController.renderFooterPromise.resolve("finished");
                        };

                        /**
                         * Grid初始化列宽
                         * 列宽根据表头的宽度初始化，如果没有设置twidth属性，则按照表头原生宽度初始化，
                         * 如果设置了twidth,则取值初始化
                         */
                        var gridPopWidth = 0;
                        var columnWidth = [];
                        //首先需要计算哪些列可以被系统更新（不包含twidth）属性的列,这个属性将被用作全局列布局更新时使用
                        var columnLenWithoutWidth = 0;


                        tableController.renderHeaderPromise.promise.then(function(value){

                            if( value == "finished" ){

                                var header = tElement.find(".thead"),
                                    headerHeight = header.outerHeight(),
                                    headerTr = header.find(".thead_tr"),
                                    headerTh = header.find(".thead_tr > div"),
                                    body = tElement.find(".tbody"),
                                    foot = tElement.find(".tfoot"),
                                    pagination = tElement.find(".tpagination");
                                    //footTh = foot.find(" > div");


                                for( var i = 0,len = headerTh.length; i < len; i++){
                                    var thisTh = angular.element(headerTh[i]);
                                    var thisWidth = thisTh.attr("twidth");
                                    //如果定义列宽
                                    if( thisWidth !== undefined ){
                                        columnWidth.push( parseInt(thisWidth) );
                                        gridPopWidth += parseInt(thisWidth);
                                        //没有定义列宽
                                    } else {
                                        columnWidth.push( thisTh.outerWidth() );
                                        thisTh.css("flex", columnLenWithoutWidth);
                                        gridPopWidth += thisTh.outerWidth();
                                        columnLenWithoutWidth++;
                                    }
                                }

                                //初始化表头布局
                                headerTr.outerWidth( tElement.outerWidth() );
                                foot.outerWidth( tElement.outerWidth() );
                                /**
                                 * GridWidth为原始（初始化时的宽度）该原始宽度在页面缩放时被用来判断Grid最小宽度值
                                 */
                                tableController.setGridWidth( gridPopWidth );

                                //更新Grid布局
                                tableController.updateGrid(columnWidth,gridPopWidth,true);


                                /**
                                 * 设置grid自适应容差高度
                                 * @param flexHeight
                                 */
                                var initGridHeight = function(flexHeight){
                                    tElement.outerHeight( docHeight - flexHeight );
                                    body.outerHeight( tElement.outerHeight() - headerHeight - foot.outerHeight() - pagination.outerHeight() );

                                    //设置Loading的位置;
                                    tableController.setLoadingImgPos();

                                    $window.addEventListener("resize",function(){
                                        docHeight = gridUtil.getDocHeight();
                                        tElement.outerHeight( docHeight - flexHeight );
                                        body.outerHeight( tElement.outerHeight() - headerHeight - foot.outerHeight() - pagination.outerHeight() );
                                    });
                                };

                                /**
                                 * Grid整体布局算法
                                 * 当页面数据载入完毕后调用或窗口变化，数据变化后调用。
                                 *
                                 * Grid初始化宽度为默认最小宽度，数据载入完毕后设置Grid铺满屏幕，宽度之差将分配给所有无自定义列宽(twidth属性)的列。
                                 * 窗口缩放时计算前后Grid宽度差值，并分配给所有列宽(不包含自定义列宽)
                                 *
                                 * 所以列宽以及列偏移将记录在Grid临时数组中
                                 *
                                 * 每次触发布局需要有50毫秒的延迟，降低系统负荷
                                 */
                                var timeout;
                                var watchGridResize = function(){

                                    if( timeout ) $timeout.cancel(timeout);

                                    timeout = $timeout(function(){

                                        //目前表格总宽度（columnWidth数组中累加出的宽度值）
                                        var gridTotalWidth = 0;
                                        //需要排除twidth后的可以进行缩放的列总数

                                        //grid目前的宽度
                                        var tableWidth = tElement.outerWidth();

                                        var gridNormalWidth = tableController.getGridWidth();
                                        var columnLeft = tableController.getColumnLeft();
                                        var columnWidth = tableController.getColumnWidth();
                                        //循环出总宽度值
                                        for( var c = 0; c < columnWidth.length; c++){
                                            gridTotalWidth += columnWidth[c];
                                        }

                                        //是否Grid有滚动条
                                        var scrollbar = tableController.getScroll() ? 20 : 0;
                                        //平均每一列宽度值
                                        var tableWidthCon = parseInt( (tableWidth - gridTotalWidth - scrollbar) / columnLenWithoutWidth );

                                        if( tableWidth > gridNormalWidth ) {
                                            headerTr.outerWidth(tableWidth);
                                            foot.outerWidth( tableWidth );
                                            var hasFooter = tableController.hasFooter();
                                            for (var i = 0; i < headerTh.length; i++) {
                                                var thisTh = angular.element(headerTh[i]);
                                                //var thisFooter = angular.element(footTh[i]);
                                                if( !thisTh.attr('twidth') ){
                                                    //header
                                                    thisTh.outerWidth(columnWidth[i] + tableWidthCon);
                                                    thisTh.css('left',columnLeft[i] + tableWidthCon);
                                                    //footer
                                                    //if( hasFooter ){
                                                    //    thisFooter.outerWidth(columnWidth[i] + tableWidthCon);
                                                    //    thisFooter.css('left',columnLeft[i] + tableWidthCon);
                                                    //}
                                                    columnWidth[i] = columnWidth[i] + tableWidthCon;

                                                }
                                            }
                                            tableController.updateGrid(columnWidth,tableWidth,true);
                                        } else {
                                            // headerTr.outerWidth(gridNormalWidth);
                                            foot.outerWidth( gridNormalWidth );
                                        }

                                    },50);
                                };


                                /**
                                 * 窗口缩放后，取缩放差值，然后将差值平均到每一列上，保证Grid满屏
                                 * 例如：如果有10列，窗口缩放后差值为100，则每一列新增10像素，如果为-100则每一列减10像素
                                 * 如果表格已经溢出屏幕（出现横向滚动条），则不进行计算，但当窗口缩放到宽度大于表格宽度后，再进行计算
                                 *
                                 * 注意：缩放列不包含 含有twidth自定义宽度属性的列，以保证自定义宽度始终有效
                                 */
                                $window.addEventListener("resize",watchGridResize);

                                /**
                                 * 给父控制器暴露一个renderGrid布局的方法
                                 * @type {watchGridResize}
                                 */
                                scope.$parent.renderGrid = watchGridResize;


                                /**
                                 * 根据数据变化隐藏LOADING
                                 * 没有数据则添加一行无数据行
                                 */
                                var clearGridDataWatch = scope.$watchCollection('gridData',function(newValue,oldValue){
                                    if( oldValue != newValue || ( oldValue == newValue && newValue != null ) ){
                                        tableController.hideLoading();
                                        //如果数据变化后列表超长，出现滚动条，则需要重新计算列宽
                                        watchGridResize();
                                        gridUtil.scrollUnique(body);
                                    }
                                    //无数据
                                    if( newValue === null || ( newValue && !newValue.length ) ){
                                        tableController.setNoData();
                                        watchGridResize();
                                    }
                                });

                                /**
                                 * 全局窗口中导航是否折叠监控
                                 */
                                $rootScope.$watchCollection('slideNav',function(value){
                                    if( value !== undefined ){
                                        $timeout(function(){
                                            watchGridResize();
                                        },100);
                                    }
                                });

                                scope.$on("$destroy",function(){
                                    clearGridDataWatch();
                                });

                                /**
                                 * 页面全部repeat循环数据后，渲染页面
                                 */
                                $q.all( tableController.promiseArr ).then(function(value){
                                    watchGridResize();
                                });

                                /**
                                 * 如果用户没有定义高度，则取自适应高度
                                 */
                                if( tAttrs.gridHeight == undefined ){

                                    //如果没有配置表格的高度，则系统给一个计算的高度
                                    var docHeight = gridUtil.getDocHeight();

                                    //项目框架原生需要设置[去除高度]为205px
                                    if( tAttrs.gridFlexHeight == undefined ) initGridHeight(205);
                                    //如果设置了属性则取值，无值则取默认
                                    if( tAttrs.gridFlexHeight !== undefined && tAttrs.gridFlexHeight == '' ){
                                        initGridHeight(205);
                                        //否则接收一个数值，用来设定当前grid需要去除多少高度，比如同页面还有其他内容（图标，按钮，或者其他占位）
                                    } else {
                                        initGridHeight( parseInt(scope.gridFlexHeight) );
                                    }

                                } else {
                                    /**
                                     * 如果用户定义了Grid高度，那么自适应高度则失效
                                     */
                                    tElement.outerHeight( parseInt(scope.gridHeight ) );
                                    body.outerHeight( tElement.outerHeight() - headerHeight - foot.outerHeight() - pagination.outerHeight() );
                                }


                                /**
                                 * 为Grid表身绑定横向滚动事件
                                 * 当滚动横向滚动条，则表头随之一起滚动
                                 */
                                body.on("scroll",function(){
                                    var scrollLeft = $(this).scrollLeft();
                                    headerTr.css('left', -scrollLeft );
                                    //if( !foot.hasClass("tpagination")){
                                    //    foot.css('left', -scrollLeft );
                                    //}
                                });

                            }
                        });


                    }
                }
            }
        }
    }]);

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");

    module.directive("classCell",classCell);
    module.controller("classCellController",classCellController);

    classCellController.$inject = ['$scope','$element'];
    classCell.$inject = ['$timeout'];

    function classCellController($scope,$element){

    };

    function classCell($timeout){
        return {
            restrict : 'A',
            scope : true,
            require : '^?classTable',
            controller : 'classCellController',
            compile : function(tElement){
                return {
                    post : function( scope, tElement, tAttr, tableController ){

                        if( !tableController.isBaseGrid() ){

                            if( scope.$parent.$last ) {
                                switch ( tAttr.classCell ) {
                                    case 'header' :

                                        var headerTr = tElement.parent();
                                        var headerTh = headerTr.find(">div");

                                        var clearWatch = scope.$watchCollection(function(){
                                            return tableController.getColumnWidth();
                                        },function(arr){
                                            var columnLeft = tableController.getColumnLeft();
                                            for( var i = 0; i < headerTh.length; i++){
                                                angular.element(headerTh[i]).outerWidth( arr[i] );
                                                angular.element(headerTh[i]).css('left',columnLeft[i]);
                                            }
                                        });

                                        scope.$on("$destroy",function(){
                                            clearWatch();
                                        });

                                        tableController.renderHeaderPromise.resolve("finished");

                                        break;
                                    case 'body' :
                                        tableController.renderRowsPromise.resolve("finished");
                                        break;
                                    case 'footer' :

                                        var footer = tElement.parent();
                                        var footerTh = footer.find(">div");
                                        var clearWatch = scope.$watchCollection(function(){
                                            return tableController.getColumnWidth();
                                        },function(arr){
                                            var columnLeft = tableController.getColumnLeft();
                                            for( var i = 0; i < footerTh.length; i++){
                                                angular.element(footerTh[i]).outerWidth( arr[i] );
                                                angular.element(footerTh[i]).css('left',columnLeft[i]);
                                            }
                                        });

                                        scope.$on("$destroy",function(){
                                            clearWatch();
                                        })

                                        tableController.renderFooterPromise.resolve("finished");
                                        break;
                                }

                            }

                        }

                    }
                }
            }
        }

    }

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");
    /**
     * checkbox全选指令
     */
    module.directive("checkAll",checkAll);

    /**
     * Grid全选按钮控制指令
     * 该指令使用监听与发送事件来处理
     */
    function checkAll(){
        return {
            restrict : 'A',
            scope : true,
            require : '^?classTable',
            compile : function(tElement){
                //checkbox列25像素足矣...
                angular.element(tElement).parent().attr("twidth",25);
                return {
                    post : function( scope, tElement, tAttr, classTableCtrl ){

                        scope.$on("checkAll",function(ev,value){
                            tElement.prop("checked",value);
                        });

                        var _hander = function(){
                            var checked = tElement.prop("checked");
                            scope.$emit("gridCheckAll",checked);
                        }

                        tElement.bind("change",_hander);
                    }
                }
            }
        }

    }

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");
    /**
     * grid 单元行（这里是单元格所在行）指令控制
     */
    module.directive("classTd",classTd);

    /**
     * Grid 表格(表身）指令
     * 该指令目前只用来同步表身与表头的宽度
     */
    function classTd(){
        return {
            restrict : 'A',
            scope : true,
            require : '^?classTable',
            compile : function(){
                return {
                    post : function(scope, element, attr, classTableCtrl ){

                        classTableCtrl.renderHeaderPromise.promise.then(function(value) {

                            if (value == "finished") {

                                var td = element.find("div");

                                //监控表格是否大小有变化，如果有变化，需要将当前表格的宽度数组传回公共方法以便设置表头宽度同步
                                var clearTdWatch = scope.$watchCollection(function(){
                                    return classTableCtrl.getColumnWidth();
                                },function(arr){
                                    var columnLeft = classTableCtrl.getColumnLeft();
                                    var gridWidth = classTableCtrl.getGridMinWidth();

                                    //判断是否需要为横向滚动条留出20像素位置;
                                    var isScroll =  classTableCtrl.getScroll() ? 20 : 0;
                                    //行宽为总行宽减滚动条
                                    element.outerWidth( gridWidth - isScroll );

                                    for( var i = 0,len = td.length; i < len; i++){
                                        angular.element(td[i]).outerWidth(arr[i]);
                                        angular.element(td[i]).css('left',columnLeft[i]);
                                    }
                                });

                                scope.$on("$destroy",function(){
                                    clearTdWatch();
                                })


                            }
                        })



                    }
                }

            }
        }
    }

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");
    /**
     * 表头浮动指令控制
     */
    module.directive("fixedTableHeader",fixedTableHeader);

    /**
     * Grid表头固定指令
     * 该指令需要与classTd指令配合使用
     */
    function fixedTableHeader(){
        return {
            restrict : 'A',
            scope : true,
            require : '^?classTable',
            compile : function(tElement){

                return {
                    post : function( scope, element, attr, classTableCtrl ){

                        classTableCtrl.renderHeaderPromise.promise.then(function(value){

                            if( value == "finished" ){

                                if( classTableCtrl.isBaseGrid() ){

                                    var th = angular.element(element).find(".thead_tr > div");

                                    element.next('.tbody').css('margin-top',element.outerHeight() );

                                    element.addClass('fixedTableHeader');

                                    //监控表格大小是否有变化，将公共方法的表格宽度数组设置回表头，保持表头与表格同步
                                    var clearHeaderWatch = scope.$watchCollection(function(){
                                        return classTableCtrl.getColumnWidth();
                                    },function(arr){
                                        var columnLeft = classTableCtrl.getColumnLeft();
                                        for( var i = 0; i < th.length; i++){
                                            angular.element(th[i]).outerWidth( arr[i] );
                                            angular.element(th[i]).css('left',columnLeft[i]);
                                        }
                                    });

                                    scope.$on("$destroy",function(){
                                        clearHeaderWatch();
                                    })

                                }

                            }

                        })


                    }
                }
            }
        }
    }

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");

    module.directive("classFooter",classFooter);
    /**
     * Grid表尾固定指令
     */
    function classFooter(){
        return {
            restrict : 'A',
            scope : true,
            require : '^?classTable',
            compile : function(tElement){
                /**
                 * 为Grid表身绑定横向滚动事件
                 * 当滚动横向滚动条，则表头随之一起滚动
                 */
                //var body = tElement.prev('.tbody');
                //body.on("scroll",function(){
                //    var scrollLeft = $(this).scrollLeft();
                //    tElement.css('left', -scrollLeft );
                //});

                return {
                    post : function( scope, element, attr, classTableCtrl ){

                        classTableCtrl.renderFooterPromise.promise.then(function(value){
                            if( value == "finished"){
                                //var tfoot = element.find(">div");
                                ////监控表格大小是否有变化，将公共方法的表格宽度数组设置回表头，保持表头与表格同步
                                //var clearFooterWatch = scope.$watchCollection(function(){
                                //    return classTableCtrl.getColumnWidth();
                                //},function(arr){
                                //    var columnLeft = classTableCtrl.getColumnLeft();
                                //    for( var i = 0; i < tfoot.length; i++){
                                //        angular.element(tfoot[i]).outerWidth( arr[i] );
                                //        angular.element(tfoot[i]).css('left',columnLeft[i]);
                                //    }
                                //});
                                //
                                //scope.$on("$destroy",function(){
                                //    clearFooterWatch();
                                //})
                            }
                        })

                    }
                }
            }
        }
    }

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");
    /**
     * 表头列宽拖拽控制
     */
    module.directive("dragColumns",dragColumns);

    dragColumns.$inject = ['$document','$timeout'];

    /**
     * Grid 表头列宽拖拽指令
     * @param $document
     * @param $timeout
     */
    function dragColumns($document,$timeout){
        return {
            restrict : 'A',
            scope : true,
            require : '^classTable',
            compile : function(){
                return {
                    post : function( scope, tElement,tAttr, tableController ){

                        tableController.renderHeaderPromise.promise.then(function(value) {

                            if (value == "finished") {

                                if( tableController.isBaseGrid() ){

                                    _dragColumns();

                                } else {

                                    var clearWatch = scope.$watchCollection(function(){
                                        return tableController.getGridData();
                                    },function(newValue,oldValue){
                                        if( oldValue != newValue || ( oldValue == newValue && newValue != null ) ){
                                            $timeout(function(){
                                                _dragColumns();
                                            },300);
                                        }
                                    });

                                    scope.$on("$destroy",function(){
                                        clearWatch();
                                    })


                                }


                            }
                        });

                        var _dragColumns = function(){
                            var headerTr = tElement.find(".thead_tr"),
                                headerTh = headerTr.find("div"),
                                table = headerTr.parents('.classic-table'),
                                body = table.find('.tbody'),
                                foot = table.find('.tfoot'),
                                pagination = table.find('.tpagination');

                            /**
                             * 表头拖动缩放列
                             */
                            //拖动列竖线，一共两个竖线，前者为列右侧可拖动竖线，后者为标识当前列左边距竖线
                            var posLine = angular.element("<div class='grid-pos-line'></div>"),
                                startPosLine = posLine.clone();
                            //一个拖动状态标识符，判断是否已经开始拖动列
                            var isDragging = false;
                            //拖动列竖线位置
                            var posLineInitLeft = 0;
                            //拖动的像素数量
                            var dragPos = 0;
                            //拖动的列下标，标识目前拖动的是哪一列
                            var dragIdx = 0;
                            //拖动列最小宽度
                            var dragLimit = 50;
                            headerTh.each(function(idx){
                                var thisTh = $(this);
                                //checkbox列不在拖动范围
                                if( thisTh.find("input[type=checkbox]").length ){
                                    thisTh.addClass("column-checkbox");
                                    return;
                                }

                                thisTh.on("mousemove",function(event){

                                    thisTh.addClass("column-drag");

                                    //拖动时不响应其他列的高亮样式
                                    if( isDragging && dragIdx != idx ) thisTh.removeClass("column-drag");

                                    var posX = event.offsetX;

                                    var targetWidth = angular.element(event.target).outerWidth();

                                    var scrollLeft = body.scrollLeft();
                                    //设置一个拖动列感知范围，在距离边框7像素内即可拖动列
                                    if( targetWidth - posX  < 7 ){
                                        thisTh.css('cursor','col-resize');
                                    }else{
                                        thisTh.css('cursor','default');
                                    }
                                });
                                thisTh.on("mouseleave",function(){
                                    thisTh.removeClass("column-drag");
                                });
                            });
                            headerTh.each(function(idx){
                                var thisTh = $(this);
                                //checkbox列不在拖动范围
                                if( thisTh.find("input[type=checkbox]").length ) return;
                                thisTh.on("mousedown",function(event){

                                    var posX = event.offsetX;

                                    //这里计算页面当前所操作的列之前的真正没有被隐藏列的总宽度
                                    var realColumns = angular.element(event.target).prevAll('div:visible');
                                    var realColumnIdx = realColumns.length;
                                    var realLeft = 0;
                                    for( var t = 0; t < realColumnIdx; t++){
                                        realLeft +=  angular.element(realColumns[t]).outerWidth();
                                    }
                                    //
                                    var scrollLeft = body.scrollLeft();

                                    var targetWidth = angular.element(event.target).outerWidth();

                                    posLine.appendTo(table);
                                    startPosLine.appendTo(table);

                                    //这里的NodeName == span表示点击的对象可能为排序对象，需要排除掉，否则在计算位置时会出错
                                    if( targetWidth - posX  < 7 && event.target.nodeName != 'SPAN' ) {
                                        isDragging = true;
                                        dragIdx = idx;
                                        var dragstart = event.clientX;
                                        var gridHeight = table.outerHeight() - foot.outerHeight() - pagination.outerHeight();
                                        posLine.outerHeight(gridHeight);
                                        startPosLine.outerHeight(gridHeight);
                                        posLineInitLeft = realLeft + targetWidth;
                                        posLine.css({
                                            'top': 0,
                                            'left':  posLineInitLeft - scrollLeft - 1
                                        });
                                        startPosLine.css({
                                            'top' : 0,
                                            'left' : realLeft - scrollLeft
                                        });
                                        posLine.show();
                                        startPosLine.show();
                                        table.addClass('table-unselect');

                                        //行拖动，设置实际拖动距离
                                        //设置拖动最小距离
                                        headerTr.bind("mousemove",function(event){
                                            if( event.clientX - dragstart > 0 ){
                                                dragPos = event.clientX - dragstart;
                                            } else {
                                                if( dragPos + targetWidth > dragLimit ){
                                                    dragPos = event.clientX - dragstart;
                                                }
                                            }
                                            //点击了以后开始拖动时，设置竖线位移
                                            posLine.css({
                                                'left' :  posLineInitLeft + dragPos - scrollLeft
                                            });
                                        });

                                    }
                                    //拖动开始后绑定更新事件
                                    $document.on("mouseup",updatePosGrid);
                                });
                            });

                            //拖动后需要绑定的更新Grid事件
                            var dragTimeout;
                            var updatePosGrid = function(){

                                if( dragTimeout ) $timeout.cancel(dragTimeout);

                                $timeout(function(){

                                    //如果拖动成功后，设置所有属性并更新Grid
                                    if( isDragging ){
                                        //如果产生了拖动距离，则执行Grid更新
                                        if( dragPos ){
                                            var columnLeft = tableController.getColumnLeft();
                                            var columnWidth = tableController.getColumnWidth();
                                            var gridWidth = tableController.getGridMinWidth();

                                            for( var i = dragIdx; i < columnLeft.length; i++ ){
                                                columnLeft[i] = columnLeft[i] + dragPos;
                                            }

                                            gridWidth = gridWidth + dragPos;
                                            columnWidth[dragIdx] = columnWidth[dragIdx] + dragPos;
                                            headerTr.outerWidth( gridWidth );
                                            //foot.outerWidth( gridWidth );
                                            tableController.updateGrid(columnWidth,gridWidth,true);

                                        }

                                        //鼠标松开后，重置所有属性值
                                        isDragging = false;
                                        posLineInitLeft = 0;
                                        dragPos = 0;
                                        dragIdx = 0;
                                        posLine.hide();
                                        startPosLine.hide();
                                        headerTr.off("mousemove");
                                        table.removeClass('table-unselect');

                                        $document.off("mouseup",updatePosGrid);

                                    }

                                },20);

                            }
                        }


                    }
                }
            }
        }
    }


})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");

    /**
     * Grid自定义列隐藏
     */
    module.directive("hideColumns",hideColumns);

    hideColumns.$inject = ['$document','gridUtil'];

    /**
     * Grid 列隐藏指令，这里依赖于浏览器的sessionStorage暂存列隐藏字段，用于在翻页或查询时保持列隐藏状态。
     * 页面重载后隐藏列重置。
     *
     * 目前根据项目直接判断前两列是否为checkbox与序号，如果是则此列不能被隐藏
     *
     * PS：此目前仅为纯前端隐藏，因此计算稍显复杂
     */
    function hideColumns($document,gridUtil){
        return {
            restrict : 'A',
            scope : true,
            require : '^?classTable',
            compile : function(){

                return {
                    post : function( scope, tElement, tAttrs, classTableCtrl ){

                        //一个判断多少列被隐藏的临时数值
                        var columnLen = 0;

                        function createElement(){

                            var element =  tElement.parents('.table').find(".table-hide-columns-menu");
                            if( element.length ) return element;

                            var menu = angular.element("<div class='dropdown-menu table-hide-columns-menu'></div>");
                            var menuLi = angular.element("<li><label><input type='checkbox' checked='true' /><span></span></label></li>");
                            var canBeHideColumns = tElement.find("div");

                            //设置一个标识，标识出某些字段不在 设置隐藏列 之内，这里只做前两列字段自动判断
                            var hideColumnLoop = 0;

                            //如果第一例TH为checkAll，则不算入隐藏列之内
                            if( angular.element(canBeHideColumns).eq(0).find("input[type=checkbox]").length ) hideColumnLoop += 1;

                            for( var i = 0; i < canBeHideColumns.length; i++ ){
                                // 除去排除列后循环
                                if( i >= hideColumnLoop ){
                                    var column = angular.element(canBeHideColumns[i]);
                                    var menuContext = menuLi.clone();
                                    menuContext.find("span").text( column.text() );
                                    menuContext.find("input[type='checkbox']").attr('field', i );
                                    if( column.is(":hidden") ) menuContext.find("input[type='checkbox']").prop("checked",false);
                                    menuContext.appendTo(menu);
                                }
                            };

                            //绑定选择事件
                            menu.find("input[type='checkbox']").bind('change',function(){

                                var checked = $(this).prop("checked");
                                var eqIdx = $(this).attr("field");

                                var table = tElement.parents(".table");
                                var ths = table.find('.thead_tr');
                                var tfs = table.find('.tfoot');
                                var trs = table.find('.tbody_tr');

                                if( !checked ){
                                    hideColumnFields.push( eqIdx );
                                    classTableCtrl.setHideColumns(hideColumnFields);
                                    changeColumn(eqIdx,'hide');
                                    columnLen++;

                                } else {
                                    hideColumnFields.remove( eqIdx );
                                    classTableCtrl.setHideColumns(hideColumnFields);
                                    changeColumn(eqIdx,'show');
                                    columnLen--;
                                }

                                //目前隐藏列时，如果隐藏列数大于0，则全部DIV设置为静态布局，以便将位移交给浏览器自动计算。
                                //当不存在隐藏列时，全部DIV设置回absolute定位
                                if( columnLen > 0 ){
                                    ths.find("div").css('position','static');
                                    trs.find("div").css('position','static');
                                    tfs.find("div").css('position','static');
                                }
                                if( columnLen == 0 ){
                                    ths.find("div").css('position','absolute');
                                    trs.find("div").css('position','absolute');
                                    tfs.find("div").css('position','absolute');
                                }

                                //不能所有列都隐藏，必须剩余1列
                                var menuLiLen = menu.find("li");
                                if( menuLiLen.length - columnLen <= 1 ){
                                    checkedColumn(menuLiLen,true);
                                } else {
                                    checkedColumn(menuLiLen,false);
                                }
                            });

                            menu.appendTo( tElement.parents('.table') );

                            return menu;
                        }

                        //初始化一个已隐藏列临时数组
                        var hideColumnFields = [];

                        var clearDataWatch = scope.$watchCollection(function(){
                            return classTableCtrl.getGridData();
                        },function(value){
                            if(value){
                                hideColumnFields = classTableCtrl.getHideColumns();
                                if( hideColumnFields.length ){
                                    autoHideColumns(hideColumnFields);
                                }
                            }
                        });

                        //scope.$on('hideGridColumn',function(ev,column){
                        //
                        //    if( !angular.isArray(column) ) return;
                        //    for( var i = 0; i < column.length; i++){
                        //        if( $.inArray(column[i], hideColumnFields) == -1 ){
                        //            hideColumnFields.push(column);
                        //            classTableCtrl.setHideColumns(hideColumnFields);
                        //            changeColumn(column[i],'hide');
                        //            columnLen++;
                        //        }
                        //    }
                        //
                        //    var table = tElement.parents(".table");
                        //    var ths = table.find('.thead_tr');
                        //    var trs = table.find('.tbody_tr');
                        //    //目前隐藏列时，如果隐藏列数大于0，则全部DIV设置为静态布局，以便将位移交给浏览器自动计算。
                        //    //当不存在隐藏列时，全部DIV设置回absolute定位
                        //    if( columnLen > 0 ){
                        //        ths.find("div").css('position','static');
                        //        trs.find("div").css('position','static');
                        //    }
                        //    if( columnLen == 0 ){
                        //        ths.find("div").css('position','absolute');
                        //        trs.find("div").css('position','absolute');
                        //    }
                        //
                        //
                        //});

                        //var element =  tElement.parents('.table').find(".table-hide-columns-menu");

                        //隐藏列
                        function changeColumn(eqIdx,status){

                            var table = tElement.parents(".table");
                            var trs = table.find('.tbody_tr');
                            var tfs = table.find('.tfoot');

                            if( status == 'hide'){
                                tElement.find("div").eq(eqIdx).hide();
                                for( var j = 0; j < trs.length; j++ ){
                                    angular.element(trs[j]).find("div").eq(eqIdx).hide();
                                    angular.element(tfs[j]).find("div").eq(eqIdx).hide();
                                }

                            } else {
                                tElement.find("div").eq(eqIdx).show();
                                for( var j = 0; j < trs.length; j++ ){
                                    angular.element(trs[j]).find("div").eq(eqIdx).show();
                                    angular.element(tfs[j]).find("div").eq(eqIdx).show();
                                }

                            }

                        }

                        //不能所有列都隐藏，必须剩余1列
                        //对剩余列进行操作
                        function checkedColumn(menuLen,status){
                            menuLen.each(function(){
                                var li = $(this);
                                if( li.find("label > input[type=checkbox]").prop("checked") ){
                                    li.find("label > input[type=checkbox]").attr("disabled",status);
                                }
                            })
                        }

                        //页面数据变更时自动隐藏列（隐藏单元格）
                        function autoHideColumns(eqIdxs){
                            var trs = tElement.parents('.table').find('.tbody_tr');
                            //循环行
                            var status;
                            if( columnLen > 0 ){
                                status = 'static';
                            }
                            if( columnLen == 0 ){
                                status = 'absolute';
                            }
                            for( var j = 0; j < trs.length; j++ ){
                                var tds = angular.element(trs[j]).find("div");
                                //循环行内单元格
                                for( var t = 0; t < tds.length; t++){
                                    if( eqIdxs.indexOf( String(t) ) >= 0 ){
                                        angular.element(tds[t]).hide();

                                    }
                                    angular.element(tds[t]).css('position',status);
                                }
                            }

                        }


                        //表头右键菜单
                        tElement.bind("contextmenu",function(event){

                            var element = createElement();

                            var docWidth = gridUtil.getDocWidth(),
                                docHeight = gridUtil.getDocHeight();
                            var elementWidth = parseInt( element.width() ),
                                elementHeight = parseInt( element.outerHeight() );

                            var left = event.clientX,
                                top = event.clientY;

                            if( (event.clientX + elementWidth > docWidth  ) ){
                                left = docWidth - ( elementWidth + 20 );
                            }

                            if( event.clientY + elementHeight > docHeight ){
                                top = docHeight - ( elementHeight + 10 );
                            }

                            element.css({
                                "left" : left,
                                "top" : top
                            })
                            element.show();

                            $document.bind("click",hideColumnsMenu);

                            //屏蔽系统默认右键
                            return false;
                        });

                        //隐藏右键菜单
                        function hideColumnsMenu(event){
                            var menu = angular.element( event.target ).parents('.table-hide-columns-menu');
                            var element =  tElement.parents('.table').find(".table-hide-columns-menu");
                            if( !menu.length && element.is(":visible") ){
                                element.remove();
                                $document.unbind("click",hideColumnsMenu);
                            }
                        }

                        scope.$on("$destroy",function(){
                            clearDataWatch();
                        })

                    }
                }
            }
        }
    }

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");

    /**
     * Grid自定义表头排序
     */
    module.directive("ordersTr",ordersTr);
    module.directive("orderBy",orderBy);

    /**
     * Grid 表头排序
     * 此指令仅对表头排序做交互处理，每次职能对其中一列进行排序，不支持组合排序
     */
    function ordersTr(){
        return {
            restrict : 'A',
            scope: true,
            controller : function(){
                var that = this;
                this.orders = [];

                this.pushOrder = function( order ){
                    that.orders.push(order);
                };
                this.showThisOrder = function( order ){
                    order.showMe = true;
                };
                this.hideOthers = function( thisOrder ){
                    angular.forEach( that.orders, function(others,key){
                        if(  thisOrder != others ){
                            others.showMe = false;
                        }
                    })
                }
            }
        }
    };
    /**
     * 指令排序方法，
     * 依赖classTable指令与ordersTr指令。
     * classTable指令主要用于排序后加载Grid的Loading.
     */
    function orderBy(){
        return {
            restrict : 'A',
            scope : {
                orderBy : '@',
                orderEvent : '&'
            },
            require : ['^?classTable','?^ordersTr'],
            transclude : true,
            template : '<span ng-transclude class="table-orderby"></span>' +
            '<span class="glyphicon" ng-show="showMe" ng-class="{\'glyphicon-menu-down\': orderValue == \'desc\', \'glyphicon-menu-up\': orderValue == \'asc\'}"></span>',
            compile : function(){

                return {
                    post : function( scope, element, attrs, ctrl ){
                        if( ctrl === null ){
                            console.error("没有加载tableLoading指令-classTable");
                            console.error("没有加载父级排序指令-ordersTr");
                        }

                        var tableLoadingCtrl = ctrl[0],
                            ordersTrCtrl = ctrl[1];

                        if( ordersTrCtrl == null ){
                            console.error("没有设置父级排序指令-ordersTr.");
                            return;
                        } else {
                            ordersTrCtrl.pushOrder( scope );
                        }

                        scope.showMe = false;
                        scope.orderValue = 'desc';

                        element.find(".table-orderby").bind("click",function(){

                            //显示当前点击的图标
                            if( ordersTrCtrl !== null ) ordersTrCtrl.showThisOrder(scope);

                            //show Loading
                            if( tableLoadingCtrl !== null ){
                                var gridData = tableLoadingCtrl.getGridData();
                                if( gridData != null && ( gridData && gridData.length ) ){
                                    tableLoadingCtrl.showLoading();
                                }
                            }

                            var orderKey = scope.orderBy;

                            if( element.attr('desc') != "true" ){
                                element.attr("desc", true);
                                scope.orderValue = 'desc';
                                scope.orderEvent({ order: orderKey, desc: scope.orderValue });
                            } else {
                                element.attr("desc", false);
                                scope.orderValue = 'asc';
                                scope.orderEvent({ order: orderKey, desc: scope.orderValue });

                            }

                            //隐藏其他排序图标
                            if( ordersTrCtrl !== null ) ordersTrCtrl.hideOthers(scope);

                        });
                    }
                }
            }
        }
    }

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");

    /**
     * 为当前行之后展开一个指定高度的新行
     * @param expandRowHeight 指定行高度
     * @param expandRow 对应父控制器的方法，用来为站开行提供数据支持, 穿出当前expandRow的DOM ID。
     *                  可以将当前循环行的data一起在模板中传入控制器
     *
     * 例如：假设行循环数据为 ng-repeat=" rowData in gridData ">
     * 则模板中这样应用：
     * <div expand-row="afterRowExpanded(rowId,rowData)" expand-row-height="200"></div>
     */
    module.directive("expandRow",expandRow);

    expandRow.$inject = ['$compile','gridUtil'];

    function expandRow($compile,gridUtil){
        return {
            restrict : 'A',
            scope : {
                expandRowHeight : '=',
                expandRow : '&'
            },
            require: '^classTable',
            compile : function(tElement,tAttrs){

                tElement.addClass('table-unselect');

                return {
                    post : function( scope, tElement, tAttr, classTableCtrl ){

                        var rowScope = scope.$new(true);

                        rowScope.id = 'expandedRow-' + gridUtil.newId();

                        var tElementHeight = tElement.outerHeight();

                        tElement.bind("click",function(event){

                            event.stopPropagation();

                            if( !rowScope.expanded || rowScope.expanded == undefined ){
                                classTableCtrl.expandThisRow(rowScope);
                            } else {
                                classTableCtrl.collapseThisRow(rowScope);
                            }

                            var rowTemplate;

                            if( !rowScope.hasRowTemplate ){

                                rowScope.rowStyle = {
                                    height : scope.expandRowHeight,
                                    top : tElementHeight
                                };

                                rowTemplate = $compile("<div id='{{id}}' class='tbody_tr_expandedRow table-unselect' ng-style='rowStyle' ng-show='expanded'></div>")(rowScope);

                                rowScope.hasRowTemplate = true;

                                rowTemplate.bind('click',function(event){
                                    event.stopPropagation();
                                });

                                rowTemplate.insertAfter( tElement );
                            };

                            classTableCtrl.hideOtherExpandRow( rowScope );

                            scope.expandRow({ rowId: rowScope.id });

                        });

                        var rowWatch = rowScope.$watch('expanded',function(expanded){
                            if( !expanded ) {
                                classTableCtrl.multiExpandRows.remove( rowScope );
                                tElement.parent().outerHeight( tElementHeight );
                            } else {
                                classTableCtrl.multiExpandRows.push( rowScope );
                                tElement.parent().outerHeight( scope.expandRowHeight + tElementHeight );
                            }
                        });
                        rowScope.$on("destroy",function(){
                            rowWatch();
                        });
                    }
                }
            }
        }
    }

})();
(function(){
    'use strict';

    var module = angular.module("zhxDataGrid");

    /**
     * Grid翻页指令
     */
    module.directive("paging",paging);

    /**
     * 全局Grid页面的翻页组件
     * 翻页指令目前依赖于浏览器 sessionStorage
     */
    function paging(){
        return {
            restrict: 'E',
            scope: {
                gridName : '=',
                onSelectPage: '&'
            },
            require: '^?classTable',
            templateUrl: 'views/components/pagination.html',
            replace: true,
            link: function(scope, element, attrs, tableLoadingCtrl) {

                var clearPageWatch = scope.$watchCollection(function(){

                    return sessionStorage.getItem( scope.gridName + 'Params' );

                },function( pageInfo ){

                    pageInfo = JSON.parse(pageInfo);

                    scope.totalItems = pageInfo.totalItems;
                    scope.pageSize = pageInfo.pageSize;
                    scope.currentPage = pageInfo.currentPage;
                    scope.numPages = Math.ceil( scope.totalItems / scope.pageSize);

                });

                scope.$on("$destroy",function(){
                    clearPageWatch();
                })

                //定义默认PageSize选项
                scope.pageSizeOptions = [15,50,100];

                scope.changePageSize = function(pageSize){

                    if( tableLoadingCtrl !== null ){
                        tableLoadingCtrl.showLoading();
                    }

                    scope.onSelectPage({ nowPage : 1, pageSize: pageSize });
                };
                scope.isActive = function(page) {
                    return scope.currentPage === page;
                };

                scope.selectPage = function(page) {
                    if (!scope.isActive(page)) {
                        scope.currentPage = page;

                        if( tableLoadingCtrl !== null ) tableLoadingCtrl.showLoading();

                        scope.onSelectPage({ nowPage : page, pageSize: scope.pageSize });

                    }
                };
                scope.toFirstPage = function(){
                    if (!scope.noPrevious() ){
                        scope.selectPage(1);
                    }
                }
                scope.selectPrevious = function() {
                    if (!scope.noPrevious()) {
                        scope.selectPage(scope.currentPage - 1);
                    }
                };
                scope.toLastPage = function() {
                    if( !scope.noNext() ){
                        scope.selectPage( scope.numPages );
                    }
                }
                scope.selectNext = function() {
                    if (!scope.noNext()) {
                        scope.selectPage(scope.currentPage + 1);
                    }
                };
                scope.noPrevious = function() {
                    return scope.currentPage == 1 || scope.totalItems == 0 ;
                };
                scope.noNext = function() {
                    return scope.currentPage == scope.numPages || scope.totalItems == 0 ;
                };

            }
        };
    };

})();
(function(){
    "use strict";

    var module = angular.module("zhxDataGrid");

    /**
     * Grid Checkbox List
     * 用于设置Grid 首列checkbox，可复选，翻页复选，全选。
     */
    module.directive("checkList", function(gridService){
        return{
            restrict : "A",
            require : '^?classTable',
            scope: {
                data  : '='
            },
            compile : function(){

                //本页数据ROW条数，初始化为0;
                var gridLength = 0;
                //已勾选条数
                var checkedRow = 0;

                return {
                    post : function( scope, element, attrs, classTableCtrl ){

                        //引用父作用域中的gridName;
                        scope.gridName =  scope.$parent.gridName;
                        if( scope.gridName == undefined ) console.warn("没有在父控制器指定gridName");

                        /**
                         * 获取到所有已被勾选的checkbox,
                         * return Array
                         */
                        var selectedIds = gridService.getCheckedIds(scope.gridName);

                        if( selectedIds == undefined ) selectedIds = [];

                        //先通知父设置checkAll为选中
                        //下面在循环当前ROW时，如果有没选中的就通知父将选中状态改为未选中状态
                        scope.$emit('setCheckAll',true);
                        /**
                         * 如果data有变化（例如翻页）时候，自动将已选数组中的列表在View中选中
                         */
                        gridLength = 0;
                        checkedRow = 0;
                        var clearCheckWatch = scope.$watch('data',function(){
                            //每次读取数据条数+1
                            gridLength++;
                            //判断是否有选中，有选中的需要checked，并将已勾选数量+1
                            if( $.inArray(scope.data.id, selectedIds) != -1 ){
                                $(element).attr("checked", true );
                                var tr = element.parents('.tbody_tr');
                                tr.addClass('selectedRow');
                                checkedRow++;
                            }

                            //只要页面加载当前ROW没有被选中，checkAll按钮就不能处于选中状态
                            if( !element.prop("checked") ){
                                //通知table并让table告知全选按钮，现在为非全选状态
                                scope.$emit('setCheckAll',false);
                            }

                        });

                        scope.$on("$destroy",function(){
                            clearCheckWatch();
                        })


                        //监控是否需要全选
                        scope.$on("checkSelf",function(ev,value){

                            //首先判断如果全选，目前当前ROW是否已被勾选，如果被勾选且当前为 要全选动作，则什么也不做。
                            //如果是全部反选，则忽略
                            var hasChecked = element.prop('checked');
                            if( hasChecked && value  ) return;


                            element.prop('checked',value);

                            var tr = element.parents('.tbody_tr');
                            var selectedIds = gridService.getCheckedIds(scope.gridName);

                            if( value ) {

                                gridService.setCheckedItem(scope.gridName,scope.data);
                                gridService.setCheckedId(scope.gridName,scope.data.id);

                                tr.addClass('selectedRow');

                                checkedRow++;

                            } else {

                                if( selectedIds.length ){
                                    gridService.removeItem(scope.gridName, scope.data.id );
                                    tr.removeClass('selectedRow');

                                    checkedRow--;

                                }
                            }
                        });


                        /**
                         * 为checkbox设置一个change事件，将选中或反选的对象和ID设置到service中的数组中
                         */
                        var handler = function(){

                            var checked = element.prop('checked');
                            var tr = element.parents('.tbody_tr');
                            var selectedIds = gridService.getCheckedIds(scope.gridName);

                            if( checked ) {
                                gridService.setCheckedItem(scope.gridName,scope.data);
                                gridService.setCheckedId(scope.gridName,scope.data.id);

                                tr.addClass('selectedRow');

                                checkedRow++;

                                if( checkedRow == gridLength ) scope.$emit('setCheckAll',true);

                            } else {
                                if( selectedIds.length ){
                                    gridService.removeItem(scope.gridName, scope.data.id );
                                    tr.removeClass('selectedRow');

                                    //通知table并让table告知全选按钮，现在为非全选状态
                                    scope.$emit('setCheckAll',false);

                                    checkedRow--;

                                }
                            }

                        }

                        element.bind('change',function(){
                            scope.$apply(handler);
                        });

                    }
                }

            }
        }
    });

})()