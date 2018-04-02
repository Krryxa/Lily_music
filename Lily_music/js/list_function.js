
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
        	var title = $(this).parents(".list-item").find(".music-name-cult").text();
            thisDownload(url,title);
        	break;
        case "share":   // 分享
            loading("敬请期待...",5);
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
function mobileClickPlay(){
    if(isMobile) {
        krAudio.Currentplay = $(this).index();//当前播放的音乐序号
		krAudio.seturl();
		krAudio.play();
    }
}

//点击右下方的下载按钮
$(".btn-download").click(function(){
	//如果未选择音乐，不能下载
	if(krAudio.Currentplay == 0){
		loading("选择播放的歌曲哦~",5);
		return;	
	} 
	var obj = $("#main-list .list-item").eq(krAudio.Currentplay-1); //当前播放对象
	var url = obj.data("url");
	var title = obj.find(".music-name-cult").text();
    thisDownload(url,title);
});

// 下载正在播放的这首歌
function thisDownload(url,title) {
	//下载
	var eledow = dom("downabo");
	eledow.setAttribute("href",url);
	eledow.setAttribute("download",title+".mp3");
	eledow.click();
}

// 移动端顶部按钮点击处理
$(".btn").click(function(){
    switch($(this).data("action")) {
        case "player":    // 播放器
            dataBox("player");
        break;
        case "list": // 播放列表
            dataBox("list"); // 显示正在播放列表
        break;
    }
});

// 移动端选择顶部栏要显示的信息
// 参数：要显示的信息（list、player）
function dataBox(choose) {
    $('.btn-box .active').removeClass('active');
    switch(choose) {
        case "list":    // 显示播放列表
            if($(".btn[data-action='player']").css('display') !== 'none') {
                $("#player").hide();
            } else if ($("#player").css('display') == 'none') {
                $("#player").fadeIn();
            }
            $("#main-list").fadeIn();
            $("#sheet").fadeOut();
            $(".serchsongs").show(); //搜索栏显示
            $(".btn[data-action='list']").addClass('active');
            
        break;
        case "player":  // 显示播放器
            $("#player").fadeIn();
            $("#sheet").fadeOut();
            $("#main-list").fadeOut();
            $(".serchsongs").hide();  //搜索栏隐藏
            $(".btn[data-action='player']").addClass('active');
        break;
    }
}

/* 初始化背景根据图片虚化效果 */
function initblurImgs(){
	if(isMobile) {  // 移动端采用另一种模糊方案
        $('#blur-img').html('<div class="blured-img" id="mobile-blur"></div><div class="blur-mask mobile-mask"></div>');
    } else {
        // 背景图片初始化
        $('#blur-img').backgroundBlur({
            //imageURL : imageURL, // URL to the image that will be used for blurring
            blurAmount : 50, // 模糊度
            imageClass : 'blured-img', // 背景区应用样式
            overlayClass : 'blur-mask', // 覆盖背景区class，可用于遮罩或额外的效果
            duration: 1000, // 图片淡出时间
            endOpacity : 1 // 图像最终的不透明度
        });
    }
    
    $('.blur-mask').fadeIn(1000);   // 遮罩层淡出
}

/* 更换背景图片，动画效果 */
function blurImages(img){
	var animate = false;
	var imgload = false;
	if(isMobile){    
        $("#music-cover").load(function(){
            $("#mobile-blur").css('background-image', 'url("' + img + '")');
        });
    }  //PC端封面
    else if(!isMobile){ 
        $("#music-cover").load(function(){
            if(animate) {   // 渐变动画也已完成
                $("#blur-img").backgroundBlur(img);    // 替换图像并淡出
                $("#blur-img").animate({opacity:"1"}, 1500); // 背景更换特效
            } else {
                imgload = true;     // 告诉下面的函数，图片已准备好
            }
            
        });
        
        // 渐变动画
        $("#blur-img").animate({opacity: "0.2"}, 1000, function(){
            if(imgload) {   // 如果图片已经加载好了
                $("#blur-img").backgroundBlur(img);    // 替换图像并淡出
                $("#blur-img").animate({opacity:"1"}, 1500); // 背景更换特效
            } else {
                animate = true;     // 等待图像加载完
            }
        });
    }
}

// 图片加载失败处理
$('img').error(function(){
    $(this).attr('src', 'images/player_cover.png');
});


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

/* 默认首页是网易云音乐热歌榜，处理返回的json数据用了一点es6的语法 */
function indexSong(){
	var count = 1;
	loading("加载中-QQ音乐热歌榜...",500);
	$.ajax({
		url: 'https://api.hibai.cn/api/index/index',
		type: 'POST',
		data: {"TransCode":"020337","OpenId":"Test","Body":{}},
		success:function(data){
			var NECsongs = data.Body; //是个数组对象，存放多个json数据
			var length = NECsongs.length;
			var html = `<div class="listitems list-head">
		                    <span class="music-album">时长</span>
		                    <span class="auth-name">歌手</span>
		                    <span class="music-name">歌曲</span>
		                </div>`;
			for(var vals of NECsongs){
				var ctime = krAudio.format(vals.time);
				html += `<div class="list-item" data-url="${vals.url}" data-pic="${vals.pic}" data-lrc="${vals.lrc}">
	                    <span class="list-num">${count}</span>
	                    <span class="list-mobile-menu"></span>
	                    <span class="music-album">${ctime}</span>
	                    <span class="auth-name">${vals.author}</span>
	                    <span class="music-name">${vals.title}</span>
	                </div>`;
                count++;
			}
			html += `<div class="list-item text-center" title="全部加载完了哦~" id="list-foot">全部加载完了哦~</div>`;
			$("#mCSB_1_container").html(html);
			// 播放列表滚动到顶部
			listToTop();
			tzUtil.animates($("#tzloading"),"slideUp");//加载动画消失
			//刷新播放列表的总数
			krAudio.allItem = $("#mCSB_1_container").children('.list-item').length;
			//更新列表小菜单
			appendlistMenu();
			//移动端列表点击播放
			$(".music-list .list-item").click(mobileClickPlay);
			//移动端列表右边信息按钮的点击
			$(".list-mobile-menu").click(mobileListMenu);
		}
	});
}


/* 更据关键词搜索，处理返回的json数据用了一点es6的语法 接入qq音乐搜索 */
function searchSong(keywords){
	$("#krserwords").blur();  //文本框失焦
	var count = 1;
	loading("搜索中...",500);
	$.ajax({
		url: 'https://api.hibai.cn/api/index/index',
		type: 'POST',
		data: {"TransCode":"020336","OpenId":"Test","Body":{"key":keywords}},
		success:function(data){
			var NECsongs = data.Body; //是个数组对象，存放多个json数据
			var length = NECsongs.length;
			var html = `<div class="listitems list-head">
		                    <span class="music-album">时长</span>
		                    <span class="auth-name">歌手</span>
		                    <span class="music-name">歌曲</span>
		                </div>`;
			for(var vals of NECsongs){
				var ctime = krAudio.format(vals.time);
				html += `<div class="list-item" data-url="${vals.url}" data-pic="${vals.pic}" data-lrc="${vals.lrc}">
	                    <span class="list-num">${count}</span>
	                    <span class="list-mobile-menu"></span>
	                    <span class="music-album">${ctime}</span>
	                    <span class="auth-name">${vals.author}</span>
	                    <span class="music-name">${vals.title}</span>
	                </div>`;
                count++;
			}
			html += `<div class="list-item text-center" title="全部加载完了哦~" id="list-foot">全部加载完了哦~</div>`;
			$("#mCSB_1_container").html(html);
			//播放列表滚动到顶部
			listToTop();
			tzUtil.animates($("#tzloading"),"slideUp");//加载动画消失
			//刷新播放列表的总数
			krAudio.allItem = $("#mCSB_1_container").children('.list-item').length;
			//更新列表小菜单
			appendlistMenu();
			//移动端列表点击播放
			$(".music-list .list-item").click(mobileClickPlay);
			//移动端列表右边信息按钮的点击
			$(".list-mobile-menu").click(mobileListMenu);
		}
	});
}

// 播放列表滚动到顶部
function listToTop() {
    $("#main-list").mCustomScrollbar("scrollTo", 0, "top");
}


/* 点击搜索按钮或者在文本框回车搜索 */
$(".searchDivIcon").click(function() {
	var keywords = $("#krserwords").val();
	if(isEmpty(keywords)) return;
	searchSong(keywords);//进行搜索
});

$("#krserwords").keyup(function(event){
	var keywords = $("#krserwords").val();
	if(event.keyCode ==13){
		if(isEmpty(keywords)) return;
		searchSong(keywords);//进行搜索
	}
});

//当前播放歌曲的详细信息的按钮点击
$("#music-info").click(function(){
	if(isEmpty(krAudio.audioDom.src)) {
		loading("选择播放的歌曲哦~",5);
	}else{
		musicInfo(krAudio.Currentplay-1);
	}
});

//移动端的每首歌点击详细信息的按钮
function mobileListMenu(){
	var index = $(this).parents(".list-item").index();
	musicInfo(index-1);
	//取消冒泡，防止点击播放
	return false;
};

// 展现系统列表中任意首歌的歌曲信息（或者当前歌曲）
function musicInfo(index) {
    var currentObject = $("#main-list .list-item").eq(index); //获取点击的对象
    var title = currentObject.find(".music-name-cult").text();
    var url = currentObject.data("url");
    var lrc = currentObject.data("lrc");
    var tempStr = `<span class="info-title">歌曲：</span> ${title}
				    <br><span class="info-title">歌手：</span> ${currentObject.find(".auth-name").text()}
				    <br><span class="info-title">时长：</span> ${currentObject.find(".music-album").text()}`;
    
    tempStr += `<br><span class="info-title">链接：</span>
    		<span class="info-btn" id="info-songs" data-text="${url}">歌曲&nbsp;&nbsp;</span>
    		<span class="info-btn" id="info-lrcs" data-text="${lrc}">歌词</span><br>
    		<span class="info-title">操作：</span>
    		<span class="info-btn" onclick="thisDownload('${url}','${title}')">下载</span>`;
    
    layer.open({
        type: 0,
        closeBtn:0,
        shadeClose:true,
        title: false, //不显示标题
        btn: false,
        skin :'mylayerClass',
        content: tempStr
    });
    /* 实现点击复制歌曲链接、歌词链接 */
    zclips("#info-songs");
	zclips("#info-lrcs");
}

/* 实现点击复制歌曲链接、歌词链接 */
function zclips(obj){
	var clipboard = new ClipboardJS(obj, {
        text: function() {
            return $(obj).data("text");
        }
    });

    clipboard.on('success', function(e) {
        loading("复制成功",5);
    });

    clipboard.on('error', function(e) {
        loading("复制失败",5);
    });
}


