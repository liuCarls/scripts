(function($){
  $.fn.tooltip = function(option){
  /*
  * 提示框jq插件
  * Author by 秋叶博客 http://www.mizuiren.com/494.html
  * option参数
  * {
  * background: "#ddd",(option可选)
  * position: "top|left|bottom|right",(option可选)
  * content: "这是实例提示文字！",(needed必选)
  * event: "hover|click",(event type事件类型, 可选)
  * color: "#3c4751"(font color文字颜色)
  * borderColor: "#ddd",(color 颜色 option可选)
  * fontSize: "14px",(font size 字号 option可选)
  * width:"200px",(width 宽度 option可选)
  * height:"auto"(height 高度 option可选)
  * }
  *
  */
  if(!$.isPlainObject(option)){
      return console.error("tooltip传参类型居然不是个纯对象!");
  }
  var _this = this, $tipContent;
  option.borderColor = option.borderColor || "#ddd";
  option.color = option.color || "#444";
  option.fontSize = option.fontSize || "14px";
  option.width = option.width || "auto";
  option.height = option.height || "auto";
  option.background = option.background || "#fff";
  function createTip(_this){
      $tipContent && $tipContent.remove();
      var timeId = "qiuye-tooltip-" + new Date().getTime();
      $("body").append('<div id="'+ timeId +'" style="display:none;"><div class="qiuye-con"></div><i></i><i></i><style>#'+timeId+'{z-index:9999;border-radius:3px;position: absolute; padding: 5px 10px; display: inline-block;width: '+option.width+';height: '+option.height+'; min-width: 100px; word-break: break-all; background: rgb(255, 255, 255); border: 1px solid '+option.borderColor+';font-size:'+option.fontSize+';color:'+option.color+';} #'+timeId+' i{position:absolute;display:inline-block;}</style></div>');
      $tipContent = $("#" + timeId);
      var $angle = $("i",$tipContent), $angle1 = $angle.eq(0), $angle2 = $angle.eq(1), $angleSize = 8;
      $(".qiuye-con",$tipContent).html(option.content || _this.attr("title") || "");
      var eleVar = {
          width: _this.outerWidth(),
          height: _this.outerHeight(),
          left: _this.offset().left,
          top: _this.offset().top
      }
      var tipVar = {
          width: $tipContent.outerWidth(),
          height: $tipContent.outerHeight()
      }
      var position = {}, offset = $angleSize * 2;
      //Set tip container position and style(设置消息提示框的位置以及样式)
      if(!option.position){
          option.position = "top";
      }
      switch (option.position){
          case "top":
          position.top = eleVar.top - tipVar.height - offset + "px";
          position.left = eleVar.left - tipVar.width/2 + eleVar.width/2 + "px";
          break;
      case "bottom":
          position.top = eleVar.top + eleVar.height + offset + "px";
          position.left = eleVar.left - tipVar.width/2 + eleVar.width/2 + "px";
          break;
      case "left":
          position.top = eleVar.top + eleVar.height/2 - tipVar.height/2 + "px";
          position.left = eleVar.left - tipVar.width - offset + "px";
          break;
      case "right":
          position.top = eleVar.top + eleVar.height/2 - tipVar.height/2 + "px";
          position.left = eleVar.left + eleVar.width + offset + "px";
          break;
      default:
          position.top = eleVar.top - tipVar.height - offset + "px";
          position.left = eleVar.left - tipVar.width/2 + eleVar.width/2 + "px";
          break;
      }
      position.background = option.background;
      $tipContent.css(position);
      //Set angle position and style(设置指示三角的位置以及样式)
      var angleStyle1 = {}, angleStyle2 = {};
      if(option.position === "left"){
          angleStyle1.right = "-" + ($angleSize) + "px";
          angleStyle2.right = "-" + ($angleSize - 1) + "px";
      }else if(option.position === "right"){
          angleStyle1.left = "-" + ($angleSize) + "px";
          angleStyle2.left = "-" + ($angleSize - 1) + "px";
      }else if(option.position === "top"){
          angleStyle1.bottom = "-" + ($angleSize) + "px";
          angleStyle2.bottom = "-" + ($angleSize - 1) + "px";
      }else if(option.position === "bottom"){
          angleStyle1.top = "-" + ($angleSize) + "px";
          angleStyle2.top = "-" + ($angleSize - 1) + "px";
      }
      if(option.position === "left" || option.position === "right"){
          $angle.css({
              "top": "50%"
          });
          $angle1.css($.extend({
              "margin-top": "-" + $angleSize + "px",
              "border-top": $angleSize + "px solid transparent",
              "border-bottom": $angleSize + "px solid transparent"
          },angleStyle1, option.position === "left" ? {
              "border-left": $angleSize + "px solid " + option.borderColor
          } : {
              "border-right": $angleSize + "px solid " + option.borderColor,
          }));
          $angle2.css($.extend({
              "margin-top": "-" + ($angleSize-1) + "px",
              "border-top": $angleSize-1 + "px solid transparent",
              "border-bottom": $angleSize-1 + "px solid transparent"
          },angleStyle2, option.position === "left" ? {
              "border-left": $angleSize-1 + "px solid " + option.background
          } : {
              "border-right": $angleSize-1 + "px solid " + option.background
          }));
     }else if(option.position === "top" || option.position === "bottom"){
          $angle.css({
              "left": "50%"
          });
          $angle1.css($.extend({
              "margin-left": "-" + $angleSize + "px",
              "border-left": $angleSize + "px solid transparent",
              "border-right": $angleSize + "px solid transparent"
          },angleStyle1, option.position === "top" ? {
              "border-top": $angleSize + "px solid " + option.borderColor
          } : {
              "border-bottom": $angleSize + "px solid " + option.borderColor
          }));
          $angle2.css($.extend({
              "margin-left": "-" + ($angleSize-1) + "px",
              "border-left": $angleSize-1 + "px solid transparent",
              "border-right": $angleSize-1 + "px solid transparent"
          },angleStyle2, option.position === "top" ? {
              "border-top": $angleSize + "px solid " + option.background
          } : {
              "border-bottom": $angleSize + "px solid " + option.background
          }));
      }
  }
  //Bind event(绑定事件)
  if(option.event){
       $(window).on(option.event+".qiuye",function(e) {
           e = e || window.event;
           var index = Array.prototype.slice.call(_this).indexOf(e.target);
           if(index>-1) {
               createTip($(_this[index]));
               $tipContent.fadeIn(200);
           } else {
               $tipContent && $tipContent.remove();
           }
      });
  }else{
      Array.prototype.slice.call(_this).forEach(function(item,index){
          createTip($(item));
          $tipContent.fadeIn(200);
      })
  }
  return _this;
  }
  }(jQuery));