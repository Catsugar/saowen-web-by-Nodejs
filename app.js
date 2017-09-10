var express=require('express'),//加载模块
    path=require('path'),
    bodyParser = require('body-parser'),
    mongoose=require('mongoose'),
    _underscore=require('underscore'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    http = require('http');
var port=process.env.PORT || 3000;//设置端口
var app=express();//启动web服务器
//创建服务器实例，设置端口
app.set('views','./views');
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({
  secret: 'saowen',
  resave: false,
  saveUninitialized: true
}))
app.listen(port)//监听端口
app.set('port',3000)
console.log(port+'端口启动')
//启动数据库
var users = require('./models/user.js'); 
var novels=require('./models/novel.js');
var authors=require('./models/author.js');
var collections=require('./models/collection.js');
var comments=require('./models/comment.js');
//加载各个模块
mongoose.connect('mongodb://localhost:27017/saowen', {useMongoClient: true,});
mongoose.connection.on('connected', () => {
  console.log('MongoDB Connection Success!');
});
mongoose.connection.on('error', (err) => {
  console.log('MongoDB Connection Error: ' + err);
});
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Connection Failed!');
});
//设置模板
var partials = require('express-partials');
app.use(partials());
app.locals.moment = require('moment'); 
app.use(bodyParser.urlencoded({ extended: true }));
//设置静态路由
app.use(express.static('public'));

//****************************************************************************************
//预处理
app.use((req, res, next) => {
  var _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  next();
});

//首页
var Methodindex=function(req,res){
  console.log('user in session:');
  console.log(req.session.user);
  var _user = req.session.user;
  novels.find({}).sort({'comments':-1}).limit(10).populate('author').populate('comments').exec(function(err, novelRanks) {
    if(err){console.log(err);}
    authors.find({}).sort({'loved.length':-1}).limit(10).populate('novels').exec(function(err, authorRanks) {
      if(err){console.log(err);}
      collections.find({}).sort({'loved.length':-1}).limit(10).exec(function(err, collectionRanks) {
        if(err){console.log(err);}   
        comments.find({}).populate('userID').populate({path:'novelID', populate:{path:'author'}}).sort({'meta.updateAt': -1}).exec(function(err, comments) {	
  	      if(err){console.log(err);}
	        res.render('index',{
		        title:'看什喵？！',
		        comments: comments,
            novelRanks:novelRanks,
            authorRanks:authorRanks,
            collectionRanks:collectionRanks,
            _user:_user
	        })
        })
      })
    })
  })
}
//作者列表
var Methodauthorlist=function(req,res){
  var _user = req.session.user;
  novels.find({}).sort({'comments.length':-1}).limit(10).populate('author').populate('comments').exec(function(err, novelRanks) {
    if(err){console.log(err);}
    authors.find({}).sort({'loved.length':-1}).limit(10).populate('novels').exec(function(err, authorRanks) {
      if(err){console.log(err);}
      collections.find({}).sort({'loved.length':-1}).limit(10).exec(function(err, collectionRanks) {
        if(err){console.log(err);} 
        authors.find({}).populate('novels').sort({'meta.updateAt': -1}).exec(function(err, authors) {	
  	      if(err){console.log(err);}
	        res.render('author-list',{
		        title:'作者列表',
            authors: authors,
            novelRanks:novelRanks,
            authorRanks:authorRanks,
            collectionRanks:collectionRanks,
            _user:_user

          })
        })
      })
    })
  })
}
//书单列表
var Methodcollectlist=function(req,res){
  var _user = req.session.user;
  novels.find({}).sort({'comments.length':-1}).limit(10).populate('author').populate('comments').exec(function(err, novelRanks) {
    if(err){console.log(err);}
    authors.find({}).sort({'loved.length':-1}).limit(10).populate('novels').exec(function(err, authorRanks) {
      if(err){console.log(err);}
      collections.find({}).sort({'loved.length':-1}).limit(10).exec(function(err, collectionRanks) {
        if(err){console.log(err);}   
        collections.find({}).populate('editor').sort({'meta.updateAt': -1}).exec(function(err, collections) {	
          if(err){console.log(err);};
          res.render('collect-list',{
      	    title:'书单列表',
            collections: collections,
            novelRanks:novelRanks,
            authorRanks:authorRanks,
            collectionRanks:collectionRanks,
            _user:_user
          })
        })
      })
    })
  })
}
//作者详情
var Methodauthor=function(req,res){
  var _user = req.session.user;
  novels.find({}).sort({'comments.length':-1}).limit(10).populate('author').populate('comments').exec(function(err, novelRanks) {
    if(err){console.log(err);}
    authors.find({}).sort({'loved.length':-1}).limit(10).populate('novels').exec(function(err, authorRanks) {
      if(err){console.log(err);}
      collections.find({}).sort({'loved.length':-1}).limit(10).exec(function(err, collectionRanks) {
        if(err){console.log(err);}   
      	var ID = req.params.id;
      	authors.findOne({id: ID}).populate('editor').populate({path:'novels', populate:{path:'comments'}})
        .exec(function(err, author) {
      	  if(err){console.log(err);};
          res.render('author',{
      		  title:'作者:'+ author.name,
      		  author: author,
            novelRanks:novelRanks,
            authorRanks:authorRanks,
            collectionRanks:collectionRanks,
            _user:_user
          })
        })
      })
    })
  })
}
//书单详情
var Methodcollect=function(req,res){
  var _user = req.session.user;
  novels.find({}).sort({'comments.length':-1}).limit(10).populate('author').populate('comments').exec(function(err, novelRanks) {
    if(err){console.log(err);}
    authors.find({}).sort({'loved.length':-1}).limit(10).populate('novels').exec(function(err, authorRanks) {
      if(err){console.log(err);}
      collections.find({}).sort({'loved.length':-1}).limit(10).exec(function(err, collectionRanks) {
        if(err){console.log(err);} 
      	var ID = req.params.id;
      	collections.findOne({id: ID}).populate('editor').populate({path:'novels', populate:[{path:'author'},{path:'comments'}]})
        .exec(function(err,collection) {
          if(err){console.log(err);};
          res.render('collect',{
      		  title:'书单:'+ collection.name,
      		  collection: collection,
            novelRanks:novelRanks,
            authorRanks:authorRanks,
            collectionRanks:collectionRanks,
            _user:_user
          })
        })
      })
    })
  })
}
//小说详情
var Methodnovel=function(req,res){
  var _user = req.session.user;
  novels.find({}).sort({'comments.length':-1}).limit(10).populate('author').populate('comments').exec(function(err, novelRanks) {
    if(err){console.log(err);}
    authors.find({}).sort({'loved.length':-1}).limit(10).populate('novels').exec(function(err, authorRanks) {
      if(err){console.log(err);}
      collections.find({}).sort({'loved.length':-1}).limit(10).exec(function(err, collectionRanks) {
        if(err){console.log(err);} 
      	var ID = req.params.id;
      	novels.findOne({id: ID}).populate('author').populate('collects').populate({ path:'comments', populate:{path:'userID'}})
        .exec(function(err,novel) {
          if(err){console.log(err);};
      	  res.render('novel',{
      		  title:'小说:'+novel.name,
      		  novel: novel,
            novelRanks:novelRanks,
            authorRanks:authorRanks,
            collectionRanks:collectionRanks,
            _user:_user
          })
        })
      })
    })
  })
}
//后台页
var Methodback=function(req,res){
  var _user = req.session.user;
  var ID = req.params.id;
  users.findOne({id: ID})
  .populate('editcollect')
  .populate({ path:'mycollect', populate:{path:'editor'}})
  .populate({ path:'myauthor', populate:{path:'novels'}})
  .populate({ path:'mycomment', populate:{path:'novelID',populate:{path:'author'}}})
  .populate({ path:'editnovel', populate:[{path:'author'},{path:'comments'}]})
  .exec(function(err,user) {
    if(err){console.log(err);};
    res.render('back',{
		  title:user.name+'的后台',
		  user: user,
      _user:_user
    })
  })
}
//搜索页
var Methodsearch=function(req,res){
  var _user = req.session.user;
	novels.find({}).sort({'comments.length':-1}).limit(10).populate('author').populate('comments').exec(function(err, novelRanks) {
    if(err){console.log(err);}
    authors.find({}).sort({'loved.length':-1}).limit(10).populate('novels').exec(function(err, authorRanks) {
      if(err){console.log(err);}
      collections.find({}).sort({'loved.length':-1}).limit(10).exec(function(err, collectionRanks) {
        if(err){console.log(err);} 
        var KEY = req.params.key;  
        novels.find({'name': KEY})
        .populate('author').populate('comments').sort({'meta.updateAt': -1}).exec(function(err, novels) {  
          if(err){console.log(err);}  
          console.log(novels);
          res.render('search',{
            title:'搜索结果：'+KEY,
            novels: novels,
            novelRanks:novelRanks,
            authorRanks:authorRanks,
            collectionRanks:collectionRanks,
            _user:_user
          })
        })
      })
    })
  })
}
//**********************************************************************************************************/
//小说增加
var Addnovel=function(req,res){
	var novelObj = req.body.newnovel;
  var Newname=novelObj.name;
  var Newauthor=novelObj.author;
  if((Newname=='undefined' || '') || (Newauthor=='undefined' || '')){
    console.log('没有填写完整');
    return;
  }
  novels.findOne({}).sort({'id': -1}).exec(function(err,lastnovel) { 
    authors.findOne({}).sort({'id': -1}).exec(function(err,lastauthor) {  
      var authorLen=parseInt(lastauthor.id.slice(2));
      var novelLen=parseInt(lastnovel.id.slice(2));
      novels.findOne({name:Newname}).exec(function (err, novel) {
        if (err) {console.log(err);}
        authors.findOne({name:Newauthor}).exec(function (err, author) {
          if (err) {console.log(err);}
          users.findOne({_id:novelObj.editor}).exec(function (err, user) {
            console.log(user);
            if (err) {console.log(err);}
            if(author==null){ //作者不存在----先创作者，创小说
              var authorObj=createAuthor(novelObj,authorLen); 
              authorObj.save(function (err, author) {
                if (err) {console.log(err);}
              });  
            }else if(author!==null && novel==null){//作者存在-----找作者，创小说
              var authorObj=author; 
            }
            var _novel=createNovel(novelObj,novelLen,authorObj); 
             _novel.save(function (err, novel) {
              if (err) {console.log(err);}
              res.redirect('/novel/' + novel.id);
            });
            //放入作者内
            authorObj.novels.push(_novel._id);
            var _author = _underscore.extend(author, authorObj);
            _author.save(function (err, author) {
              if (err) {console.log(err);}
            });
            //放入编辑者
            var userObj=user;
            userObj.editnovel.push(_novel._id);
            var _user = _underscore.extend(user, userObj);
            _user.save(function (err, user) {
              if (err) {console.log(err);}
            })
          })
        })
      })
    })
  })
}
//增加文单
var Addcollect=function(req,res){
  var collectObj = req.body.newcollect;
  var Newname=collectObj.name;
  collections.findOne({}).sort({'id': -1}).exec(function(err,lastcollect) {
    var collectLen=parseInt(lastcollect.id.slice(2));
    collections.findOne({name:Newname}).exec(function (err, collect) {
      if (err) {console.log(err);}
      users.findOne({_id:collectObj.editor}).exec(function (err, user) {
        if (err) {console.log(err);}
        if(collect==null){//书单不存在
          var _collect=createCollect(collectObj,collectLen);
          _collect.save(function (err, collect) {
            if (err) {console.log(err);}
            res.redirect('/collect/' + collect.id);
          });
          //放入编辑者
          var userObj=user;
          userObj.editcollect.push(_collect._id);
          var _user = _underscore.extend(user, userObj);
          _user.save(function (err, user) {
            if (err) {console.log(err);}
          });
        }
      }) 
    })
  })
}
//增加评论
var Addcomment=function(req,res){
  var commentObj = req.body.newcomment;
  var novelID=commentObj.novelID;
  novels.findOne({_id:novelID}).exec(function (err, novel) {
    comments.findOne({}).sort({'id': -1}).exec(function(err,lastcomment) {
      users.findOne({_id:commentObj.userID}).exec(function (err, user) {
        var commentLen=parseInt(lastcomment.id.slice(2));
        if (err) {console.log(err);}
        var _comment=createComment(commentObj,commentLen); 
        _comment.save(function (err, comment) {
          if (err) {console.log(err);}  
        })
        var novelObj=novel; 
        novelObj.comments.push(_comment._id);
        novelObj.tags.push(commentObj.tag);
        var _novel = _underscore.extend(novel, novelObj);
        _novel.save(function (err, novel) {
          if (err) {console.log(err);}
          res.redirect('/novel/' + novel.id);
        });
        //放入编辑者
        var userObj=user;
        userObj.mycomment.push(_comment._id);
        var _user = _underscore.extend(user, userObj);
        _user.save(function (err, user) {
          if (err) {console.log(err);}
        });
      })
    })
  })
}

/*******************************************************************/
//增加作者函数
function createAuthor(novelObj,len) {
  var  _author= new authors({
      id: 'a'+("000000" + (len+1)).slice(-6),
      name: novelObj.author,
      description: '',
      editor:  novelObj.editor,
      meta: {'createAt': Date.now(),
             'updateAt': Date.now()},
      loved: [],
      novels: []
  });
  return _author;
}
//增加小说函数
function createNovel(novelObj,len,authorObj) {
  var _novel = new novels({
      id: 'n'+("000000" + (len+1)).slice(-6),
      name:'《' + novelObj.name + '》',
      editor: novelObj.editor,
      meta: {'createAt': Date.now(),
             'updateAt': Date.now()},
      author: authorObj._id,
      type: novelObj.type,
      progress: novelObj.progress,
      len: novelObj.len,
      year: novelObj.year,
      taste: novelObj.taste,
      actor: novelObj.actor,
      web: novelObj.web,
      tags: [],
      collects: [],
      comments: []
  });
  return _novel;
}
//增加用户函数
function createUser(userObj,len) {
  var _user = new users({
      id: 'u'+("000000" + (len+1)).slice(-6),
      name: userObj.name,
      password: userObj.password,
      emaill: userObj.emaill,
      description: 'Ta还木有个人介绍呢',
      photo:'photo/'+Math.round(Math.random()*10)+'.jpg',
      editnovel: [],
      editcollect: [],
      mycollect: [],
      myauthor: [],
      mycomment:[],
      meta: {'createAt': Date.now(),
             'updateAt': Date.now()}
  });
  return _user;
}
//增加书单函数
function createCollect(collectObj,len) {
  var  _collect= new collections({
      id: 'c'+("000000" + (len+1)).slice(-6),
      name: collectObj.name,
      description: '',
      editor:collectObj.editor,
      meta: {'createAt': Date.now(),
             'updateAt': Date.now()},
      cover:'cover/b'+Math.round(Math.random()*10)+'.jpg' ,       
      loved: [],
      novels: []
  });
  return _collect;
}
//增加评论函数
function createComment(commentObj,len) {
  var _comment = new comments({
      id: 'p'+("000000" + (len+1)).slice(-6),
      userID: commentObj.userID,
      novelID: commentObj.novelID,
      meta: {'createAt': Date.now(),
             'updateAt': Date.now()},
      state: commentObj.state,
      score: commentObj.score,
      text: commentObj.text,
  });
  return _comment;
}
/****************************************************************/
//编辑小说
var Editnovel=function (req, res) {
  var novelObj = req.body.newnovel;
  var ID=novelObj.id;
  novels.findOne({id:ID}).exec(function (err, novel) {
    if (err) {console.log(err);}
    var _novel = _underscore.extend(novel, novelObj); 
    _novel.save(function (err, novel) {
      if (err) {console.log(err);}
      res.redirect('/novel/' + novel.id);
    })
  })
}
//编辑作者
var Editauthor=function (req, res) {
  var authorObj = req.body.newauthor;
  var ID=authorObj.id;
  authors.findOne({id:ID}).exec(function (err, author) {
    if (err) {console.log(err);}
    var _author = _underscore.extend(author, authorObj); 
    _author.save(function (err, author) {
      if (err) {console.log(err);}
      res.redirect('/author/' + author.id);
    })
  }) 
}
//编辑文单
var Editcollect=function (req, res) {
  var collectObj = req.body.newcollect;
  var ID=collectObj.id;
  collections.findOne({id:ID}).exec(function (err, collect) {
    if (err) {console.log(err);}
    var _collect = _underscore.extend(collect, collectObj); 
    _collect.save(function (err, collect) {
      if (err) {console.log(err);}
      res.redirect('/collect/' + collect.id);
    })
  })
}
//编辑用户
var Edituser=function (req, res) {
  var userObj = req.body.newuser;
  var ID=userObj.id;
  var DES=userObj.description;
  users.findOne({id:ID}).exec(function (err, user) {
    if (err) {console.log(err);}
    var edituser=user;
    edituser.description=DES;
    var _user = _underscore.extend(user, edituser); 
    _user.save(function (err, user) {
      if (err) {console.log(err);}
      res.redirect('/back/' + user.id);
    })
  })
}
/************************************************************/
//删除
var Admin=function (req, res) {
  var id= req.query.id;
  if (id) {
    //删除评论
    comments.findOne({_id:id}).exec(function (err, comment) {
      if(comment!==null){
        var userID=comment.userID;
        var novelID=comment.novelID;
        novels.findOne({_id:novelID}).exec(function (err, novel) {
          if (err) {console.log(err);}
          var novelObj=novel; 
          removeByValue(novelObj.comments, comment._id); 
          var _novel = _underscore.extend(novel, novelObj); 
          _novel.save(function (err, novel) {
            if (err) {console.log(err);}
          })
        })
        users.findOne({_id:userID}).exec(function (err, user) {
          if (err) {console.log(err);}
          var userObj=user;
          removeByValue(userObj.mycomment, comment._id); 
          var _user = _underscore.extend(user, userObj); 
          _user.save(function (err, user) {
            if (err) {console.log(err);}
          })
        }) 
        comments.remove({_id: id}, function (err,comment) {
          if (err) {
            console.log(err);
          } else {
            res.json({success: 1});
          }
        })
      }
    });
    //删除文单
    collections.findOne({_id:id}).exec(function (err, collect) { 
      if(collect!==null){
        var editor=collect.editor;
        //删除编辑者
        users.findOne({_id:editor}).exec(function (err, user) {
          if (err) {console.log(err);}
          var userObj=user;
          removeByValue(userObj.editcollect, collect._id); 
          var _user = _underscore.extend(user, userObj); 
          _user.save(function (err, user) {
            if (err) {console.log(err);}
          })
        }) 
        collections.remove({_id: id}, function (err,collect) {
          if (err) {
            console.log(err);
          } else {
            res.json({success: 1});
          }
        })
      }
    })
  }
}

/****************************************************************/
//收藏作者
var Loveauthor=function (req, res) {
  var authorObj = req.body.newauthor;
  var ID=authorObj.id;
  authors.findOne({id:ID}).exec(function (err, author) {
    if (err) {console.log(err);}
    var _author = _underscore.extend(author, authorObj); 
    _author.save(function (err, author) {
      if (err) {console.log(err);}
      res.redirect('/author/' + author.id);
    })
  }) 
}
//收藏文单
var Lovecollect=function (req, res) {
  var collectObj = req.body.newcollect;
  var ID=collectObj.id;
  collections.findOne({id:ID}).exec(function (err, collect) {
    if (err) {console.log(err);}
    var _collect = _underscore.extend(collect, collectObj); 
    _collect.save(function (err, collect) {
      if (err) {console.log(err);}
      res.redirect('/collect/' + collect.id);
    })
  })
}
/****************************************************************/
//取消收藏作者
var Cancel=function (req, res) {
  var Newuser='597d2432c6213c1130b9fba9';
  var id= req.query.id;
  if (id) {
    //取消收藏作者
    authors.findOne({_id:id}).exec(function (err, author) {
      if(author!==null){
        
      }
    });
    //删除文单
    collections.findOne({_id:id}).exec(function (err, collect) { 
      if(collect!==null){
        //删除编辑者
        users.findOne({_id:editor}).exec(function (err, user) {
          if (err) {console.log(err);}
          var userObj=user;
          removeByValue(userObj.editcollect, collect._id); 
          var _user = _underscore.extend(user, userObj); 
          _user.save(function (err, user) {
            if (err) {console.log(err);}
          })
        }) 
      }
    })
  }
}
//删除特定值
function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
/**********************************************/
//增加用户----注册
var Adduser=function(req,res){
  var userObj = req.body.newuser;//req.param('user')
  var Newname=userObj.name;
  var Newemaill=userObj.emaill;
  users.findOne({}).sort({'id': -1}).exec(function(err,lastuser) {
    var userLen=parseInt(lastuser.id.slice(2));
    users.findOne({$or: [{name:Newname}, {emaill:Newemaill}]}).exec(function (err, user) {
      if (err) {console.log(err);}
      if(user!==null){
        console.log("该用户已经被注册");
      } else if(user==null ){//用户不存在
        var _user=createUser(userObj,userLen); 
        _user.save(function (err, user) {
          if (err) {console.log(err);}
        });
      }
    })
  })
  res.redirect('/');
}
//登录
var Signin=function(req,res){
  var userObj = req.body.newuser;
  var logname=userObj.name;
  var logpassword=userObj.password;
  users.findOne({name:logname}).exec(function (err, user) {
    if (err) {console.log(err);}
    if(user==null){
      console.log("不存在该用户");
      return res.redirect('/');
    } else if(user!==null ){
      console.log("存在该用户");
      user.comparePassword(logpassword,function (err,isMatch) {
        if (err) {console.log(err);}
        if(isMatch){
          console.log("密码正确，可以登录");
          req.session.user=user;
          res.redirect('/back/' + user.id);  
          
        }else{
          console.log("密码不正确");
          res.redirect('/');
        }          
      })
    }
  })
}
//登出
var Logout=function(req,res){
  delete req.session.user;
  delete app.locals.user;
  console.log("退出成功");
  res.redirect('/');
}
//各种模型路由
app.route('/').get(Methodindex);
app.route('/author-list').get(Methodauthorlist);
app.route('/collect-list').get(Methodcollectlist);
app.route('/author/:id').get(Methodauthor);
app.route('/collect/:id').get(Methodcollect);
app.route('/novel/:id').get(Methodnovel);
app.route('/back/:id').get(Methodback);
app.route('/search/:key').get(Methodsearch);
app.route('/new/novel').post(Addnovel);
app.route('/new/collect').post(Addcollect);
app.route('/new/comment').post(Addcomment);
app.route('/new/user').post(Adduser);//注册
app.route('/edit/novel').post(Editnovel);
app.route('/edit/author').post(Editauthor);
app.route('/edit/collect').post(Editcollect);
app.route('/edit/user').post(Edituser);
app.route('/back/admin').delete(Admin);
app.route('/back/love').delete(Cancel);
app.route('/user/signin').post(Signin);//登录
app.route('/user/logout').get(Logout);//登出


