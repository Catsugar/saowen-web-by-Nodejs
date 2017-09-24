//加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
var fs=require('fs');
var path=require('path');
  //存储海报
  exports.Addcover=function(req,res,next){
    var posterData=req.files.upposter;
    var filePath=posterData.path;
    var originalFilename=posterData.originalFilename;
    if(originalFilename){
      fs.readFile(filePath,function (err,data) {
        var timestamp=Date.now();
        var type=posterData.type.split('/')[1];
        var poster=timestamp+'.'+type;
        var newPath=path.join(__dirname, '../../', '/public/cover/' + poster);
        fs.writeFile(newPath, data, function(err) {
          req.poster=poster;
          next();
        })
      })
    }else{
      next();
    }
  }
  //增加头像
  exports.Addphoto=function(req,res,next){
    var photoData=req.files.upphoto;
    var filePath=photoData.path;
    var originalFilename=photoData.originalFilename;
    if(originalFilename){
      fs.readFile(filePath,function (err,data) {
        var timestamp=Date.now();
        var type=photoData.type.split('/')[1];
        var photo=timestamp+'.'+type;
        var newPath=path.join(__dirname, '../../', '/public/photo/' + photo);
        fs.writeFile(newPath, data, function(err) {
          req.photo=photo;
          next();
        })
      })
    }else{
      next();
    }
  }
  //小说增加
  exports.Addnovel=function(req,res){
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
              if (err) {console.log(err);}
              if(user!==null){
                if(author==null){ //作者不存在----先创作者，创小说
                  var authorObj=createAuthor(novelObj,authorLen); 
                  authorObj.save(function (err, author) {
                    if (err) {console.log(err);}
                  }); 
                  var _novel=createNovel(novelObj,novelLen,authorObj); 
                  _novel.save(function (err, novel) {
                    if (err) {console.log(err);}
                    res.redirect('/novel/' + novel.id);
                  });
                  //放入作者内
                  authorObj.novels.push(_novel._id); 
                }else if(author!==null && novel==null){//作者存在-----找作者，创小说
                  var authorObj=author; 
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
                  })
                }
                //放入编辑者
                var userObj=user;
                userObj.editnovel.push(_novel._id);
                var _user = _underscore.extend(user, userObj);
                _user.save(function (err, user) {
                  if (err) {console.log(err);}
                })
              }
            })
          })
        })
      })
    })
  }
  //增加文单
  exports.Addcollect=function(req,res){
    var collectObj = req.body.newcollect;
    var Newname=collectObj.name;
    console.log(collectObj);
    if(req.poster){
      collectObj.cover="cover/"+req.poster;
    }
    console.log('修改后'+collectObj);
    collections.findOne({}).sort({'id': -1}).exec(function(err,lastcollect) {
      var collectLen=parseInt(lastcollect.id.slice(2));
      collections.findOne({name:Newname}).exec(function (err, collect) {
        if (err) {console.log(err);}
        users.findOne({_id:collectObj.editor}).exec(function (err, user) {
          if (err) {console.log(err);}
          if(collect==null && user!==null){//书单不存在
            var _collect=createCollect(collectObj,collectLen);
            //增加fengmian
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
  exports.Addcomment=function(req,res){
    var commentObj = req.body.newcomment;
    var novelID=commentObj.novelID;
    novels.findOne({_id:novelID}).exec(function (err, novel) {
      comments.findOne({}).sort({'id': -1}).exec(function(err,lastcomment) {
        users.findOne({_id:commentObj.userID}).exec(function (err, user) {
          if(user!==null){
            var commentLen=parseInt(lastcomment.id.slice(2));
            if (err) {console.log(err);}
            var _comment=createComment(commentObj,commentLen); 
            _comment.save(function (err, comment) {
              if (err) {console.log(err);}  
            })
            var novelObj=novel; 
            novelObj.comments.push(_comment._id);
            if(commentObj.tag!==''&& novelObj.tags.indexOf(commentObj.tag)==-1){
              novelObj.tags.push(commentObj.tag);
            }
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
          }
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
        look:0,
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
        look:0,
        collects: [],
        comments: []
    });
    return _novel;
  }
  //增加书单函数
  function createCollect(collectObj,len) {
    var  _collect= new collections({
        id: 'c'+("000000" + (len+1)).slice(-6),
        name: collectObj.name,
        description: collectObj.description,
        editor:collectObj.editor,
        meta: {'createAt': Date.now(),
               'updateAt': Date.now()},
        cover: collectObj.cover || 'cover/b'+Math.round(Math.random()*10)+'.jpg' ,   
        look:0,    
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