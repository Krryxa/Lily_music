
//播放对象
function dom(id){
	return document.getElementById(id);
};

// 音乐进度条拖动回调函数
function krcallback(newVal) {
    var newTime = krAudio.audioDom.duration * newVal;
    // 应用新的进度
    krAudio.audioDom.currentTime = newTime;
}

//获取并设置移动的百分比, flag:true代表是进度条，false代表是音量条
function barMove(e,minLength,maxLength,bars) {
	if(!krAudio.kdown) return;
	var e = e || window.event;
    var percent = 0;
    if(e.clientX < minLength){ 
        percent = 0; 
    }else if(e.clientX > maxLength){ 
        percent = 1;
    }else{  
        percent = (e.clientX - minLength) / (maxLength - minLength);
    }
    //音乐播放定位到当前点击的播放位置
    if(bars == "music-progress") krcallback(percent); //音乐进度回调函数
    else{
    	krAudio.audioDom.volume = percent;  //设置当前的音量
    	if(percent == 0){
    		$(".btn-quiet").addClass("btn-state-quiet"); // 添加静音样式
    		krAudio.flag_volume = false; //静音锁上	
    	} 
    	else{
    		$(".btn-quiet").removeClass("btn-state-quiet"); // 移除静音样式
    		krAudio.flag_volume = true; //静音解锁
    	} 
    	krAudio.curentVoice = percent;
    } 

    //跳转至某处的进度条样式
    krAudio.goto(bars,percent);
}

//播放器
var krAudio = {
	audioDom:dom("audio"), //播放器
	locked:true, //进度条锁定
	kdown:false, //按下的锁
	flag_volume:true, //静音的锁
	curentVoice:0, //当前音量
	Currentplay:0, //当前播放的序号
	allItem:0,  //当前播放列表的总数

	init:function(){//播放器初始化
		this.audioDom.volume = 0.5;  //初始音量为一半
		this.allItem = $("#main-list").children('.list-item').length; //播放列表的总数
		this.controlTime("music-progress"); //播放进度条
		this.controlVoice("volume-progress"); //音量条
	},

	//设置播放的音乐地址
	seturl:function(url){
		this.audioDom.src = url;
	},
	
	//播放
	play:function(){
		this.audioDom.play();
		$(".btn-play").addClass("btn-state-paused");   //恢复暂停按钮样式
		$("#music-progress .mkpgb-dot").addClass("dot-move");   //增加小点闪烁效果
		var currentObject = $("#main-list .list-item").eq(this.Currentplay-1); //当前播放对象
		//获取音乐标题
		var music_title = currentObject.find(".music-name").text();
		$(".progress_msg .music_title").text(music_title); //设置音乐标题
		//获取音乐总时间
		var music_time = currentObject.find(".music-album").text();
		$(".all_time").text(music_time); //设置当前音乐总时间
	},
	
	//暂停
	stop:function(){
		this.audioDom.pause();
		$(".btn-play").removeClass("btn-state-paused");  //取消暂停按钮样式
		$("#music-progress .mkpgb-dot").removeClass("dot-move");   //取消小点闪烁效果
	},
	
	time:function(){//时间

		//播放中的函数 timeupdate
		this.audioDom.addEventListener("timeupdate",function(){
			krAudio.locked = false; //进度条解锁
			//获取总时长
			var time = this.duration;
			//当前获取播放时长
			var ctime = this.currentTime;
			var percent = ((ctime / this.duration) * 100).toFixed(2);

			//获取播放进度
			var scurrent = ctime / time;
			//转换成百分比
			var percent = scurrent * 100;

			//根据歌曲进度赋值
			$("#music-progress .mkpgb-cur").width(percent+"%");
			$("#music-progress .mkpgb-dot").css("left",percent+"%"); 

			//
			$(".current_time").text(krAudio.format(ctime));
		});
		//播放结束的时候
		this.audioDom.addEventListener("ended",function(){
			
		});
	},
	
	format:function(time){//日期格式化
		var m=Math.floor(time/60);
		var s =Math.floor(time%60);
		if(m<10)m="0"+m;
		if(s<10)s="0"+s;
		return m+":"+s;
	},
	
	next:function(){//下一首
		this.Currentplay++;
		if(this.Currentplay > this.allItem) this.Currentplay = 1;
		var currentObject = $("#main-list .list-item").eq(this.Currentplay-1); //当前播放对象
		var url = currentObject.data("url");
		this.seturl(url);
		this.time();
		this.play();
	},
	
	prev:function(){//上一首
		this.Currentplay--;
		if(this.Currentplay < 1) this.Currentplay = 1;
		var currentObject = $("#main-list .list-item").eq(this.Currentplay-1); //当前播放对象
		var url = currentObject.data("url");
		this.seturl(url);
		this.time();
		this.play();
	},
	
	randomMusic:function(){//随机播放
		
	},
	
	loadLrc:function(){//加载歌词
		var vallrc = $(".hidetextlrc").text();
		//如果没有上传歌词或者删除了歌词
		if(!vallrc || $(".is_deleteLrc").text() == 1){
			$(".lrc_content_notext").text("暂无歌词");
			$(".lrc_content_notext").show();
			return;
		}
		$.ajax({  //异步请求获取本地歌词
			url:basePath+"/"+vallrc,
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
				scrollTop:(($(".lrcsel").index()+1)*29 - 145)//减去159.5的偏差，使当前歌词在中间
			},240);
			//全屏歌词的控制
			$("#lyrics").stop().animate({
				scrollTop:(($(".lrcsel").index()+1)*24 - 168)//减去159.5的偏差，使当前歌词在中间
			},240);
		});
	},
	//拖动进度条
	controlTime:function(mubar){
		var krry = this;
		// 获取偏移量
        var minLength = $("#"+mubar).offset().left; 
        var maxLength = $("#"+mubar).width() + minLength;

        // 窗口大小改变偏移量重置
        $(window).resize(function(){
            minLength = $("#"+mubar).offset().left; 
            maxLength = $("#"+mubar).width() + minLength;
        });
        // 监听小点的鼠标按下事件
        $("#"+mubar + " .mkpgb-dot").onmousedown = function(e){
            e.preventDefault();    // 取消原有事件的默认动作
        };
        // 监听进度条整体的鼠标按下事件
        dom(mubar).onmousedown = function(e){
        	//如果播放中，解锁移动进度条的锁
        	if(!krry.locked) krry.kdown = true;
        	barMove(e,minLength,maxLength,mubar);	
            // 监听鼠标移动事件，用于拖动
	        document.onmousemove = function(e){
	            barMove(e,minLength,maxLength,mubar);
	        };
        };
        
        // 监听鼠标弹起事件，用于释放拖动
        document.onmouseup = function(){
			krry.kdown = false;
        };

		
	},

	// 跳转至某处的进度条样式 bars:进度条或音量条，percent：百分比
    goto: function(bars,percent) {
        if(percent > 1) percent = 1;
        if(percent < 0) percent = 0;
        $("#"+bars + " .mkpgb-dot").css("left", (percent*100) +"%"); 
        $("#"+bars + " .mkpgb-cur").css("width", (percent*100)+"%");
        return true;
    },

    //音量条控制
	controlVoice:function(mubar){
		var lockvolume = true; //静音的锁
		var krry = this;
		// 获取偏移量
        var minLength = $("#"+mubar).offset().left; 
        var maxLength = $("#"+mubar).width() + minLength;
        // 窗口大小改变偏移量重置
        $(window).resize(function(){
            minLength = $("#"+mubar).offset().left; 
            maxLength = $("#"+mubar).width() + minLength;
        });
        // 监听小点的鼠标按下事件
        $("#"+mubar + " .mkpgb-dot").onmousedown = function(e){
            e.preventDefault();    // 取消原有事件的默认动作
        };
        // 监听进度条整体的鼠标按下事件
        dom(mubar).onmousedown = function(e){
        	//任何时候都可以设置音量
        	krry.kdown = true;
        	barMove(e,minLength,maxLength,mubar);		
            // 监听鼠标移动事件，用于拖动
	        document.onmousemove = function(e){
	            barMove(e,minLength,maxLength,mubar);
	        };
        };
        
        // 监听鼠标弹起事件，用于释放拖动
        document.onmouseup = function(){
			krry.kdown = false;
        };


        //点击静音
        $(".btn-quiet").click(function(){
        	if(krry.flag_volume){
        		krry.flag_volume = false;
        		krry.curentVoice = krry.audioDom.volume;
        		krAudio.audioDom.volume = 0;  //设置当前的音量
	    		$(".btn-quiet").addClass("btn-state-quiet"); // 添加静音样式
	    		krry.goto(mubar,0);

        	}else{
        		krry.flag_volume = true;
        		//恢复音量
        		//如果是自己拖动到静音，则点击恢复音量的时候默认恢复0.1
        		if(krry.curentVoice == 0) krry.curentVoice = 0.1; 
        		krAudio.audioDom.volume = krry.curentVoice;  //设置当前的音量
	        	$(".btn-quiet").removeClass("btn-state-quiet"); 
		    	krry.goto(mubar,krry.curentVoice);
        	}
        	
        });


	}
};


window.onload = function(){
	//播放器初始化
	krAudio.init();
	//注册播放器事件
	$(".list-item").click(function(){
		krAudio.Currentplay = $(this).index();//当前播放的音乐序号
		var url = $(this).data("url");
		krAudio.seturl(url);
		krAudio.time();
		krAudio.play();
	});

	//播放暂停按钮
	$(".btn-play").click(function(){
		if(!krAudio.audioDom.paused){
			krAudio.stop();
		}else{
			//地址不为空才播放
			if(!isEmpty(krAudio.audioDom.src)) {
				krAudio.play();
			}
		}
	});
	//下一首
	$(".btn-next").click(function(){
		krAudio.next();
	});
	//上一首
	$(".btn-prev").click(function(){
		krAudio.prev();
	});

};

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