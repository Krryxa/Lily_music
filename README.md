# Lily_music
##Lily_music 

##悦动你的生活


##闲言碎语：<br>

有好几天没有发表博客了，这也是因为一直开发音乐和完善我的博客项目，好不容易抽出时间总结一下这几天所做的东西，还这么多课，实则匆忙
今天难得逃了一次课，就趁这时间，该写写就写写吧~~<br>

 

##进入正题：Lily_music<br>

本次开发，参照本人之前所做的 乐诗博客（文末会说到）的相关播放控制等功能，继续优化的结果。<br>
前端模仿qq音乐界面，然后在此之上进行修改的界面，并使用了一点 es6 的语法<br>
话说个人挺喜欢qq音乐界面的，简洁，当然也少不了背景模糊插件以及滚动条美化相关插件，<br>
也用到了弹窗、点击复制歌曲链接和歌词链接相关功能，但是目前歌曲分享功能暂未实现、后续....<br>
致谢：歌曲搜索参照某位大佬封装的 qq 音乐的 api，UI 界面参照另一位大神的一些解决方案，在此表示感谢<br>

 

##相关链接：<br>

那么相关使用的开源插件有：<br>
jQuery官方类库：https://jquery.com/<br>
layer弹窗插件：http://layer.layui.com/<br>
复制粘贴库插件：https://www.npmjs.com/package/clipboard-js<br>
mCustomScrollbar滚动条美化插件：http://manos.malihu.gr/jquery-custom-content-scroller/<br>
background-blur背景图片模糊特效插件：https://msurguy.github.io/background-blur/<br>
还有播放、控制、歌词解析、搜索、加载动画sg类库等功能全部手写，爽的不行。<br>

##温馨提醒：<br>

本播放器并不需要什么特别的运行环境，直接下载打开就能用了 ^_^<br>
响应式优化，可在各种大小的设备运行打开<br>
音乐搜索的结果均来自 qq音乐 （后续会继续扩大到多个平台）<br>
本播放器还有一些 bug，需求就是不断满足的，虚心请教...<br>

 
##谈谈开发：<br>

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


鼠标拖动进度条的时候，有三个监听事件，<br>

按下：onmousedown <br>

移动：onmousemove <br>

弹起：onmouseup <br>

这里鼠标移动事件需要放在鼠标按下事件里面，当鼠标弹起时，在里面清除移动、弹起两个事件，以免弹起时还执行鼠标按下拖动事件（也可以定义一把锁来控制）<br><br>
 

还有很多细节点的问题，上一曲下一曲临界值、搜索后的播放控制、列表小菜单与主按钮之间的联动、三种播放模式等等等等... 有坑也有欢笑<br><br>

ES6 都出来了，那当然要好好使用，在字符串拼接的代码，均使用 es6 语法，十分好用<br><br>


##截图展示：<br>

 ![](https://images2018.cnblogs.com/blog/1344447/201804/1344447-20180404143732731-1100813367.jpg)<br>
 ![](https://images2018.cnblogs.com/blog/1344447/201804/1344447-20180404144244268-87447227.jpg)
 ![](https://images2018.cnblogs.com/blog/1344447/201804/1344447-20180404144026206-1287124697.jpg)<br><br>
 
 
##项目链接：<br>

在线演示：https://www.ainyi.com/Lily_music/<br>
乐诗博客：https://www.ainyi.com/<br>

乐诗博客是一个音乐、日记分享平台，我们致力于让用户发表自己的心情，分享自己喜爱的音乐，聆听你我的声音。欢迎访问 ^_^


