var express=require('express')
var port=process.env.PORT || 3000//设置端口
var app=express()//启动web服务器
//创建服务器实例，设置端口
app.set('views','./views/pages')
app.set('view engine','jade')
app.listen(port)//监听端口
app.set('port',3000)
console.log(port+'端口启动')
//设置路由
app.get('/',function(req,res){
	res.render('index',{title:'首页'})
})

app.get('/detail/:id',function(req,res){
	res.render('detail',{title:'详细页'})
})

app.get('/admin/movie',function(req,res){
	res.render('admin',{title:'后台'})
})

app.get('/admin/list',function(req,res){
	res.render('list',{title:'列表'})
})