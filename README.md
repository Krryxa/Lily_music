# Lily_music
## Lily_music 

## 悦动你的生活


## 闲言碎语：

有好几天没有发表博客了，这也是因为一直开发音乐和完善我的博客项目，好不容易抽出时间总结一下这几天所做的东西，还这么多课，实则匆忙
今天难得逃了一次课，就趁这时间，该写写就写写吧~~

 

## 进入正题：Lily_music

本次开发，参照本人之前所做的 乐诗博客（文末会说到）的相关播放控制等功能，继续优化的结果。<br>
前端模仿qq音乐界面，然后在此之上进行修改的界面，并使用了一点 es6 的语法<br>
话说个人挺喜欢qq音乐界面的，简洁，当然也少不了背景模糊插件以及滚动条美化相关插件，<br>
也用到了弹窗、点击复制歌曲链接和歌词链接相关功能，但是目前歌曲分享功能暂未实现、后续....<br>
致谢：歌曲搜索参照某位大佬封装的 qq 音乐的 api，UI 界面参照另一位大神的一些解决方案，在此表示感谢<br>

 

## 相关链接：<br>

那么相关使用的开源插件有：<br>
jQuery官方类库：https://jquery.com/<br>
layer弹窗插件：http://layer.layui.com/<br>
复制粘贴库插件：https://www.npmjs.com/package/clipboard-js<br>
mCustomScrollbar滚动条美化插件：http://manos.malihu.gr/jquery-custom-content-scroller/<br>
background-blur背景图片模糊特效插件：https://msurguy.github.io/background-blur/<br>
还有播放、控制、歌词解析、搜索、加载动画sg类库等功能全部手写，爽的不行。<br>

## 温馨提醒：<br>

本播放器并不需要什么特别的运行环境，直接下载打开就能用了 ^_^<br>
响应式优化，可在各种大小的设备运行打开<br>
音乐搜索的结果均来自 qq音乐 （后续会继续扩大到多个平台）<br>
本播放器还有一些 bug，需求就是不断满足的，虚心请教...<br>

 
## 谈谈开发：<br>

果断使用的是 H5 播放器，十分好用<br>
一般在做这种播放器的开发，要多多使用面向对象的开发思想。<br>
定义一个播放器对象，相关参数、方法如下：<br>

播放器对象：krAudio<br>
参数：<br>
　　播放器：audioDom<br>
　　进度条锁定：locked:true<br>
　　进度条按下的锁：kdown<br>
　　静音的锁：flag_volume<br>
　　当前音量：curentVoice<br>
　　当前播放的列表序号：Currentplay<br>
　　当前播放列表歌曲总数：allItem<br>
　　播放模式，1为列表循环：orderModes<br>
  
方法：<br>
　　播放器初始化：init<br>
　　设置播放的音乐地址：seturl<br>
　　播放：play<br>
　　暂停：stop<br>
　　播放时间监听及处理：time<br>
　　时间格式化：format<br>
　　下一首：next<br>
　　上一首：prev<br>
　　播放模式：ordermode<br>
　　拖动进度条：controlTime<br>
　　拖动音量条：controlVoice<br>
  
上面部分的参数及方法基本涵盖播放器该有的功能<br><br><br>
 

歌词解析，我之前做的乐诗博客采用自己写的一种歌词解析滚动播放的方法：<br>

首先明白一般歌词的形式是：[00:13.80]期望飞上恬静月球遥望每家的窗 [00:18.24]谁伴深爱细味露台玫瑰香<br>

这样子的形式，利用 ajax 异步请求到歌词文件，然后就可以进行字符串裁剪，单单取出时间和歌词，一一对应<br>
```javascript
loadLrc:function(){//加载歌词
        var vallrc = $(".hidetextlrc").text();
        //如果没有上传歌词或者删除了歌词
        if(!vallrc || $(".is_deleteLrc").text() == 1){
            $(".lrc_content_notext").text("暂无歌词");
            $(".lrc_content_notext").show();
            return;
        }
        var isHrefLrc = $(".is_href_lrc").text();
        //如果是上传的歌词，那就要拼接上服务器地址
        if(isHrefLrc == 0) vallrc = basePath + "/" + vallrc;
        $.ajax({  //异步请求获取本地歌词
            url:vallrc,
            type:"post",
            success:function(data){
                //第一次分离歌词
                var lrcArr = data.split("[");
                //存放分离后的歌词
                var html = "";
                var lrclast = null; //记录上一行的歌词
                var lrcmes = null; //记录当前行的歌词
                var bofo = -1; //记录上一行歌词的秒数
                var ms = -1; //当前这一行的秒数
                for(var i = 0;i < lrcArr.length;i++){
                    //第二次分割歌词，变成["03:01.08","这个世界变得更加美丽"],数组以逗号分隔
                    var arr = lrcArr[i].split("]");
                    //取到数组arr下标为1的歌词部分
                    //将上一行的歌词赋值给lrclast
                    lrclast = lrcmes; 
                    //得到当前歌词
                    lrcmes = arr[1];
                    //取到时间
                    var time = arr[0].split("."); //变成["03:01","08"]
                    //取到time下标为0的分钟和秒
                    var ctime = time[0].split(":"); //变成["03","01"];
                    //将上一行的秒数赋值给bofo
                    bofo = ms;
                    //转化成秒数
                    ms = ctime[0]*60 + ctime[1]*1;
                    //如果上一行和当前行秒数相同，则当前行秒数++ ,解决秒数相同的办法
                    if(bofo == ms){
                        ms++;
                    }else if(ms >= 0){
                        if(!isNaN(bofo)){ //如果是数字
                            var classeName = "l_"+bofo;
                            var concon = bofo;//bofo会自增，所以下面for循环条件用这个变量来代替
                            for(var j = 0;j < ms-concon-1;j++){
                                classeName += " l_"+ ++bofo;
                            }
                            if(ms>=0 && lrclast != null){
                                html += "<li class='"+classeName+"'>"+lrclast+"</li>";
                            }
                        }
                    }
                }
                //装载最后一行歌词的机制，先获取歌曲总时间
                setTimeout(function(){
                    var allall = krAudio.audioDom.duration;
                    var classlaName = "l_"+ms;
                    var conben = ms; //ms会自增，所以下面for循环条件必须用这个变量来代替
                    for(var j = 0;j < allall-conben-1;j++){
                        classlaName += " l_"+ ++ms;
                    }
                    html += "<li class='"+classlaName+"'>"+lrcmes+"</li>";
                    //把解析好的歌词放入歌词展示区中
                    $("#lrcly").html(html);
                    $("#lyrics").html(html);
                },200);
            }
        });
        // 联动音乐播放歌词
        krAudio.audioDom.addEventListener("timeupdate",function(){
            //获取当前播放时间,获得的是秒数
            var time = this.currentTime;
            //解析音乐对应的时间
            var m = parseInt(time / 60);//获取此时的分钟
            var s = parseInt(time); //转换int类型，获取此时的秒数
            $(".l_"+s).addClass("lrcsel").siblings().removeClass("lrcsel");
            //歌词滚动条，使歌词在中间的计算公式：
            //第n行歌词*li的高度-歌词区域中间的li（就是包括这个li,取这个li的一半）以上的li的总高度
            //局部歌词的控制
            $(".lrc_content_box").stop().animate({
                scrollTop:(($(".lrcsel").index()+1)*29 - 145)//减去偏差，使当前歌词在中间
            },240);
            //全屏歌词的控制
            $("#lyrics").stop().animate({
                scrollTop:(($(".lrcsel").index()+1)*24 - 168)//减去偏差，使当前歌词在中间
            },240);
        });
    },
```
这种歌词解析、联动播放的进度进行滚动是我之前乐诗博客采用的一种方案，感觉也不错<br><br>


此次采用另一种解析方式，利用 js 正则表达式全部替换的方式<br>

替换方式：<br>
```javascript
var reg = /-/g;  // g表示全部替换 ，要替换的字符串是-
createTime = createTime.replace(reg,"/"); // 第二个参数表示替换成 /
 //替换成2018/04/03
 ```
 歌词解析：<br>
 ```javascript
 //解析歌词
function parseLyric(lrc) {
    var lyrics = lrc.split("\n");
    var lrcText = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcText[time] = clause;
        }
    }
    return lrcText;
}
```
这样子解析出来的是一个对象，存放着键值对，键：时间（秒），值（歌词）<br>

就可以直接做一个 for in 循环将每句歌词添加到歌词区域，将时间添加到每句歌词的样式控制class<br>

根据每句歌词的时间，就可以在播放器的 timeupdate 监听事件里实现滚动播放歌词了<br><br>



鼠标拖动进度条的时候，有三个监听事件，<br>

按下：onmousedown <br>

移动：onmousemove <br>

弹起：onmouseup <br>

这里鼠标移动事件需要放在鼠标按下事件里面，当鼠标弹起时，在里面清除移动、弹起两个事件，以免弹起时还执行鼠标按下拖动事件（也可以定义一把锁来控制）<br><br>
 

还有很多细节点的问题，上一曲下一曲临界值、搜索后的播放控制、列表小菜单与主按钮之间的联动、三种播放模式等等等等... 有坑也有欢笑<br><br>

ES6 都出来了，那当然要好好使用，在字符串拼接的代码，均使用 es6 语法，十分好用<br><br>


## 截图展示：<br>

 ![](https://github.com/Krryxa/Lily_music/blob/master/images/cutImg/1.jpg)
 ![](https://github.com/Krryxa/Lily_music/blob/master/images/cutImg/2.jpg)
 ![](https://github.com/Krryxa/Lily_music/blob/master/images/cutImg/3.jpg)
 
 
## 项目链接：

在线演示：https://www.ainyi.com/Lily_music/<br>
krryblog：https://ainyi.com<br>

乐诗博客是一个音乐、日记分享平台，我们致力于让用户发表自己的心情，分享自己喜爱的音乐，聆听你我的声音。欢迎访问 ^_^


