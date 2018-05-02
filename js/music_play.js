


// 音乐进度条拖动回调函数
function krcallback(newVal) {
    var newTime = krAudio.audioDom.duration * newVal;
    // 应用新的进度
    krAudio.audioDom.currentTime = newTime;
    // 强制滚动歌词到当前进度
    refreshLyric(newTime);  
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
	orderModes:1, //播放模式，1为列表循环
	changeURL:true, //播放地址改变的标志（意思就是并非当前歌曲暂停后点击播放的标志，就是换了一首歌的意思）

	init:function(){//播放器初始化
		this.audioDom.volume = 0.5;  //初始音量为一半
		this.allItem = $("#main-list").children('.list-item').length; //播放列表的总数
		this.time(); //正在播放和播放结束
		this.controlTime("music-progress"); //播放进度条
		this.controlVoice("volume-progress"); //音量条
	},

	//设置播放的音乐地址
	seturl:function(){
		if(this.Currentplay > this.allItem) this.Currentplay = 1;
		if(this.Currentplay < 1) this.Currentplay = 1;
		var currentObject = $("#main-list .list-item").eq(this.Currentplay-1); //获取当前播放对象
		var url = currentObject.data("url");
		this.audioDom.src = url;
	},
	
	//播放
	play:function(){
		$(".btn-play").attr("title","暂停");
		$(".btn-play").addClass("btn-state-paused");   //恢复暂停按钮样式
		$("#music-progress .mkpgb-dot").addClass("dot-move");   //增加小点闪烁效果
		//如果播放的是搜索之前的那首歌，点击暂停，再播放后应该是继续这首歌曲，不能更换播放地址
		//并且不能是当前歌曲暂停后继续播放，一定是播放地址改变后才能进入
		if(!search && this.changeURL){ //搜索标志位是false和播放地址改变才会进入
			var currentObject = $("#main-list .list-item").eq(this.Currentplay-1); //获取当前播放对象
			currentObject.addClass("list-playing").siblings().removeClass("list-playing");  // 添加正在播放样式
			//设置专辑封面
			var pic = currentObject.data("pic");
			$("#music-cover").attr("src",pic);
			//背景切换图片
			blurImages(pic);
			//获取音乐标题
			var music_title = currentObject.find(".music-name").text();
			//获取音乐作者
			var author = currentObject.find(".auth-name").text();
			$(".progress_msg .music_title").text(music_title+" - "+author); //设置音乐标题
			$(document).attr("title",music_title+" - "+author); //设置网页标题
			//获取歌词
			var lrcSrc = currentObject.data("lrc");
			lyricCallback(lrcSrc);
		}
		this.changeURL = true;
		this.audioDom.play(); //播放
	},
	
	//暂停
	stop:function(){
		this.audioDom.pause();
		$(".btn-play").attr("title","播放");
		$(".btn-play").removeClass("btn-state-paused");  //取消暂停按钮样式
		$("#music-progress .mkpgb-dot").removeClass("dot-move");   //取消小点闪烁效果
	},
	
	//时间：播放中、播放结束的监听事件
	time:function(){

		//播放中的函数 timeupdate
		this.audioDom.addEventListener("timeupdate",function(){
			krAudio.locked = false; //进度条解锁
			//获取总时长
			var time = this.duration;
			if(!isNaN(time)) $(".all_time").text(krAudio.format(time)); //设置当前音乐总时间

			//当前获取播放时长，单位：秒
			var ctime = this.currentTime;
			var percent = ((ctime / this.duration) * 100).toFixed(2);

			//获取播放进度
			var scurrent = ctime / time;
			//转换成百分比
			var percent = scurrent * 100;

			//根据歌曲进度赋值
			$("#music-progress .mkpgb-cur").width(percent+"%");
			$("#music-progress .mkpgb-dot").css("left",percent+"%"); 

			//设置当前播放的时间
			$(".current_time").text(krAudio.format(ctime));

			// 同步歌词显示	
			scrollLyric(ctime);
		});

		//播放结束的时候
		this.audioDom.addEventListener("ended",function(){
			//先设置暂停按钮的样式
			$(".btn-play").removeClass("btn-state-paused");  //取消暂停按钮样式
			$("#music-progress .mkpgb-dot").removeClass("dot-move");   //取消小点闪烁效果//先暂停

			setTimeout(function(){
				//1:列表循环   2:单曲循环  3:随机播放
				switch(krAudio.orderModes) {
			        case 2:     
			            //不做任何事，已经设置了loop属性
			            break;
			            
			        case 3:  
			        	search = false;  //搜索标志结束
			        	//随机获取播放序号
			            var indexRan = Math.floor(Math.random() * krAudio.allItem)+1;
			            krAudio.Currentplay = indexRan; //设置当前播放的序号
			            listMenuStyleChange(krAudio.Currentplay);//列表菜单的播放暂停按钮的变换
			            krAudio.seturl();
			            krAudio.play();
			            break;
			        // case 1:
			        default:
			            krAudio.next();  //直接下一首
		 	    }
			},400);
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
		search = false;  //搜索标志结束
		this.Currentplay++;
		if(this.Currentplay > this.allItem) this.Currentplay = 1;
		listMenuStyleChange(this.Currentplay);
    	//设置播放地址并播放
		this.seturl();
		this.play();
	},
	
	prev:function(){//上一首
		search = false;  //搜索标志结束
		this.Currentplay--;
		if(this.Currentplay < 1) this.Currentplay = 1;
		listMenuStyleChange(this.Currentplay);
    	//设置播放地址并播放
		this.seturl();
		this.play();
	},
	
	//播放模式  1:列表循环   2:单曲循环  3:随机播放
	ordermode:function(){
		var orderDiv = $(".btn-order");
	    orderDiv.removeClass();
	    switch(krAudio.orderModes) {
	        case 2:     // 单曲循环 -> 列表循环
	            orderDiv.addClass("player-btn btn-order btn-order-list");
	            orderDiv.attr("title", "列表循环");
	            krAudio.audioDom.removeAttribute("loop");  //移除单曲循环的属性
	            krAudio.orderModes = 1;
	            break;
	            
	        case 3:     // 随机播放 -> 单曲循环
	            orderDiv.addClass("player-btn btn-order btn-order-single");
	            orderDiv.attr("title", "单曲循环");
	            krAudio.audioDom.setAttribute("loop","");  //设置单曲循环的属性
	            krAudio.orderModes = 2;
	            break;
	            
	        // case 1:
	        default:    // 列表循环 -> 随机播放
	            orderDiv.addClass("player-btn btn-order btn-order-random");
	            orderDiv.attr("title", "随机播放");
	            krAudio.audioDom.removeAttribute("loop");  //移除单曲循环的属性 
	            krAudio.orderModes = 3;
	    }
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

//默认的播放和暂停控制函数
function palystop(){
	var currobj = $("#main-list .list-item").eq(krAudio.Currentplay-1); //获取当前播放对象
	//暂停
	if(!krAudio.audioDom.paused){
		krAudio.stop();
        //自己变成播放样式
    	currobj.find(".icon-play").replaceWith(playTag);	
	}else{
		//播放
		//地址为空的时候，播放列表第一首
		if(isEmpty(krAudio.audioDom.src)) {
			krAudio.Currentplay = 1;//播放列表第一首
			search = false; //设置搜索标志为false
			$(".list-item").eq(0).find(".icon-play").replaceWith(stopTag);
			krAudio.seturl();
			krAudio.play();
		}else{ //暂停后的播放，不会更换播放地址
			//自己变成播放样式
    		currobj.find(".icon-play").replaceWith(stopTag);
    		krAudio.changeURL = false; //当前播放地址未改变
    		krAudio.play();
		}
	}
}


window.onload = function(){

	//加载歌曲，默认首页是qq音乐热歌榜
	indexSong();
	//背景更据专辑图片虚化
	initblurImgs();

	//播放器初始化
	krAudio.init();

	//播放暂停按钮
	$(".btn-play").click(function(){
		palystop();
	});

	//下一首
	$(".btn-next").click(function(){
		krAudio.next();
	});
	//上一首
	$(".btn-prev").click(function(){
		krAudio.prev();
	});

	//点击播放模式
	$(".btn-order").click(krAudio.ordermode); //播放模式

	//列表小菜单初始化
	appendlistMenu();

};

