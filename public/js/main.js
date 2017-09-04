var tips=["label-default","label-primary","label-success","label-info","label-warning","label-danger"];
$(document).ready(function(){
	//给标签添加颜色
	var j=0;
	var k=0;
    for(var i=0;i<$('.label').length;i++){
		if(i%tips.length===0){j=0;}
        $('.label:eq('+i+')').addClass(tips[j]);
		j++;
	}
	//随机生成标签大小
	for(var i=0;i<$('.tip').length;i++){
		var s=Math.random()*16+10;
		var m=Math.round(s/3);
        $('.tip:eq('+i+')').css("font-size",s+"px");
		$('.tip:eq('+i+')').css("margin",m+"px");
	}
	/*****返回顶部*******/
	$('#backbtn').click(function(){
		$('html,body').animate({
		scrollTop:0
		},800)
	})
	$(window).scroll(function(){
		if($(window).scrollTop()>$(window).height()){
		  $('#backbtn').fadeIn();
		 }else if($(window).scrollTop()<$(window).height()){
		   $('#backbtn').fadeOut();
		}
	})
	$(window).trigger('scroll');

	//输入框拉长
	$('textarea').focus(function(){
	    $(this).animate({
		minHeight:160
		},800)
	})
	$('textarea').blur(function(){
	    $(this).animate({
		minHeight:80
		},800)
	})
	//阻止收藏按钮时间冒泡
	$("#lovedbtn").mousedown(function(event){
            event.stopPropagation();
    });
});








