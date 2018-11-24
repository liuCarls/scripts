/**
 * Created by user on 2018/11/24.
 */
var i=0;

function timedCount()
{
    i=i+1;
    postMessage(i);
    setTimeout("timedCount()",500);
}

timedCount();

/*
 1. 代码中重要的部分是 postMessage() 方法 - 它用于向 HTML 页面传回一段消息。
 2. 通常不用于如此简单的脚本，而是用于更耗费 CPU 资源的任务。
 */