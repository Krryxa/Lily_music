
//对象获取
function dom(id){
	return document.getElementById(id);
};

// 判断是否是移动设备
var isMobile = {  
    Android: function() {  
        return navigator.userAgent.match(/Android/i) ? true : false;  
    },  
    BlackBerry: function() {  
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;  
    },  
    iOS: function() {  
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;  
    },  
    Windows: function() {  
        return navigator.userAgent.match(/IEMobile/i) ? true : false;  
    },  
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());  
    }
};


var isMobile = isMobile.any(); // 判断是否是移动设备

var stopTag = "<span class='list-icon icon-play icon-stops' data-function='stop' title='暂停'></span>";
var playTag = "<span class='list-icon icon-play' data-function='play' title='播放'></span>";

// 列表中的菜单点击
$(".music-list").on("click",".icon-play,.icon-download,.icon-share", function() {
    
    switch($(this).data("function")) {
        case "play": // 播放
        	//如果当前地址为空，或者点击的歌曲与当前不一样，则选择当前点击的歌曲播放
        	var flag = krAudio.Currentplay == $(this).parents(".list-item").index() ? false : true;
        	if(isEmpty(krAudio.audioDom.src) || flag){
        		krAudio.Currentplay = $(this).parents(".list-item").index();//当前播放的音乐序号
        		listMenuStyleChange(krAudio.Currentplay);  //列表菜单的播放暂停按钮的变换
				krAudio.seturl();
				krAudio.play();
        	}
        	else palystop(); //否则，默认执行播放和暂停

        	break;
        case "stop":
        	palystop();  //默认执行播放和暂停
        	break;
        case "download":    // 下载
        	var url = $(this).parents(".list-item").data("url");
            thisDownload(url);
        	break;
        case "share":   // 分享
            alert("敬请期待")
        	break;
    }
    return true;
});


//初始化追加列表小菜单
function appendlistMenu(){
	$(".list-item").each(function(index,el) {
	    var target = $(el).find(".music-name");
	    var html = '<span class="music-name-cult">' + 
	    target.html() + 
	    '</span>' +
	    '<div class="list-menu">' +
	        '<span class="list-icon icon-play" data-function="play" title="播放"></span>' +
	        '<span class="list-icon icon-download" data-function="download" title="下载"></span>' +
	        '<span class="list-icon icon-share" data-function="share" title="分享"></span>' +
	    '</div>';
	    target.html(html);
	});
}


//列表菜单的播放暂停按钮的变换
function listMenuStyleChange(Currindex){
	var currobj = $("#main-list .list-item").eq(Currindex-1); //获取当前播放对象
	//其他全部变成播放样式,用 not 过滤掉当前元素 
	$(".list-item").not(currobj).each(function(index,el) {
		$(el).find(".icon-play").replaceWith(playTag);
	});
    //自己变成暂停样式
	currobj.find(".icon-play").replaceWith(stopTag);
}


// 移动端列表项单击播放
$(".music-list .list-item").click(function() {
    if(isMobile) {
        krAudio.Currentplay = $(this).index();//当前播放的音乐序号
		krAudio.seturl();
		krAudio.play();
    }
});

//点击右下方的下载按钮
$(".btn-download").click(function(){
	//如果未选择音乐，不能下载
	if(krAudio.Currentplay == 0) return;
	var obj = $("#main-list .list-item").eq(krAudio.Currentplay-1); //当前播放对象
	var url = obj.data("url");
	thisDownload(url);
});

// 下载正在播放的这首歌
function thisDownload(url) {
	//下载
	var eledow = dom("downabo");
	eledow.setAttribute("href",url);
	eledow.click();
}

//判断非空
function isEmpty(val) {
	val = $.trim(val);
	if (val == null)
		return true;
	if (val == undefined || val == 'undefined')
		return true;
	if (val == "")
		return true;
	if (val.length == 0)
		return true;
	if (!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
}
