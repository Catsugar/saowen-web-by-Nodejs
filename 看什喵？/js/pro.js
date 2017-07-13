
/*****************公共的变量************************/
var list=document.getElementById("list");
var root=document.getElementById("root");
var title=document.getElementById("title");
var showbox=document.getElementById("showbox");
var title=document.getElementById("title");
/*****************生成树型目录************************/
function render(parent,tree){
	for (var i = 0; i < tree.length; i++) {
		//添加li
		var li=document.createElement("li");
		if(tree[i].hasOwnProperty('children')==false){
			if(tree[i].url=="null"){
				li.innerHTML="<div class='p-name'><i></i>"+tree[i].name+"</div>";
			}else{
				li.innerHTML="<div class='c-name' title='"+tree[i].url+"'><i></i>"+tree[i].name+"</div>";
			}
			parent.appendChild(li);
		}else{
			if(tree[i].url=="null"){
				li.innerHTML="<div class='p-name'><i></i>"+tree[i].name+"</div><ul class='hide'></ul>";
			}else{
				li.innerHTML="<div class='c-name' title='"+tree[i].url+"'><i></i>"+tree[i].name+"</div><ul class='hide'></ul>";
			}
			parent.appendChild(li);
			 var newtree=new Array();
			 newtree=tree[i].children;
			 var newparent=parent.children[parent.children.length-1].getElementsByTagName("ul")[0];
			 render(newparent,newtree);
		}
	}
	console.log(parent.innerHTML);
}
/*****************清楚其他颜色************************/
function clearbg(a){
  var alldivs=a.getElementsByTagName("div");
  for (var i = 0; i < alldivs.length; i++) {
	  alldivs[i].style.backgroundColor="rgba(255,255,255,0)";
  }
}
/*****************生成右边展示************************/
function show(a){
  //先清空
  showbox.innerHTML="";	
  var ul=document.createElement("ul");
  var showlis=a.parentNode.children[1].children;
  if(a.className=='c-name'){return;}
  for (var i = 0; i < showlis.length; i++) {
	if(showlis[i].children[0].className=="p-name"){
	  ul.innerHTML+="<li class='P'><a href=''>"+showlis[i].children[0].innerHTML+"</a></li>";
    }else{
	  ul.innerHTML+="<li class='C'><a href='"+showlis[i].children[0].title+"'>"+showlis[i].children[0].innerHTML+"</a></li>";
	}
  }
  showbox.appendChild(ul);
}
/*****************展开和收起************************/
function change(a){
     var sj=a.getElementsByTagName("i")[0];
     var ul=a.parentNode.children[1];
	 if(ul.className=="hide"){
	   //三角形旋转
	   sj.style.transform="rotate(90deg)";
	   sj.style.webkitTransform="rotate(90deg)";
	   ul.className="show";//子元素展开
	}else{
	   //三角形旋转
	   sj.style.transform="rotate(0deg)";
	   sj.style.webkitTransform="rotate(0deg)";
	   ul.className="hide";//子元素收起
	}
}
/*****************绑定按钮************************/
function btn(){
	var divs=list.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
		divs[i].onclick=function(){
			clearbg(list);
			this.style.backgroundColor="#ccc";
			title.innerHTML="<h2>"+this.innerHTML+"</h2>";
			change(this);
			show(this);}
	}
}
/*****************执行函数************************/
render(root,nodes);
btn();