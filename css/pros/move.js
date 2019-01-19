/**
 * Created by user on 2019/1/18.
 */
"use strict";

var up = function(event){
    // 获取页面某一元素的绝对X,Y坐标
    // var X = $('#ElementID').offset().top;
    // var Y = $('#ElementID').offset().left;
    // 获取相对(父元素)位置:
    // var X = $('#ElementID').position().top;
    // var Y = $('#ElementID').position().left;

    var te = $('#d2');
    te.offset({top:te.offset().top-25, left:te.offset().left});
    console.log(event);
};

var down = function(){
    var te = $('#d2');
    te.offset({top:te.offset().top+25, left:te.offset().left});
};


var upD11 = function(){
    var te = $('#d11');
    te.offset({top:te.offset().top-5, left:te.offset().left});
};

var show = function () {
    console.log('show');
}