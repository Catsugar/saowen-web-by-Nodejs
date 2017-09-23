 //加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
  //收藏作者或者文单
  exports.Love=function (req, res) {
    var tid= req.query.tid;
    var uid= req.query.uid;
    if (tid && uid) {
      //收藏作者
      authors.findOne({_id:tid}).exec(function (err, author) {
        if (err) {console.log(err);}
        if(author!==null){
          users.findOne({_id:uid}).exec(function (err, user){
            if (err) {console.log(err);}
            //在作者处加入喜爱人
            var authorObj=author;
            if(authorObj.loved.indexOf(uid)===-1){
              authorObj.loved.push(uid);
            }
            var _author = _underscore.extend(author, authorObj); 
            _author.save(function (err, author) {
              if (err) {console.log(err);}
            });
            //在用户处加入喜爱的作者
            var userObj=user;
            if(userObj.myauthor.indexOf(tid)===-1){
              userObj.myauthor.push(tid);
            }
            var _user = _underscore.extend(user, userObj); 
            _user.save(function (err, user) {
              if (err) {console.log(err);}
              res.json({success: 1});
            })
          })
        }
      }) 
      //收藏文单
      collections.findOne({_id:tid}).exec(function (err, collect) { 
        if (err) {console.log(err);}
        if(collect!==null){
          users.findOne({_id:uid}).exec(function (err, user){
            if (err) {console.log(err);}
            //在作者处加入喜爱人
            var collectObj=collect;
            if(collectObj.loved.indexOf(uid)===-1){
              collectObj.loved.push(uid);
            }
            var _collect = _underscore.extend(collect, collectObj); 
            _collect.save(function (err, collect) {
              if (err) {console.log(err);}
            });
            //在用户处加入喜爱的文单
            var userObj=user;
            if(userObj.mycollect.indexOf(tid)===-1){
              userObj.mycollect.push(tid);
            }
            var _user = _underscore.extend(user, userObj); 
            _user.save(function (err, user) {
              if (err) {console.log(err);}
              res.json({success: 1});
            })
          })
        }
      }) 
       //文单收藏小说
      novels.findOne({_id:tid}).exec(function (err, novel) { 
        if (err) {console.log(err);}
        if(novel!==null){
          collections.findOne({_id:uid}).exec(function (err, collect){
            if (err) {console.log(err);}
            //在小说处加入文单
            var novelObj=novel;
            if(novelObj.collects.indexOf(uid)===-1){
              novelObj.collects.push(uid);
            }
            var _novel = _underscore.extend(novel, novelObj); 
            _novel.save(function (err, novel) {
              if (err) {console.log(err);}
            });
            //在文单处加入小说
            var collectObj=collect;
            if(collectObj.novels.indexOf(tid)===-1){
              collectObj.novels.push(tid);
            }
            var _collect = _underscore.extend(collect, collectObj); 
            _collect.save(function (err, collect) {
              if (err) {console.log(err);}
              res.json({success: 1});
            })
          })
        }
      }) 
    }
  }
  
  /****************************************************************/
  //取消收藏作者
  exports.Cancel=function (req, res) {
    var tid= req.query.tid;
    var uid= req.query.uid;
    if (tid && uid) {
      //取消收藏作者
      authors.findOne({_id:tid}).exec(function (err, author) {
        if (err) {console.log(err);}
        if(author!==null ){
          users.findOne({_id:uid}).exec(function (err, user){
            if (err) {console.log(err);}
            //在作者处减少喜爱人
            var authorObj=author;
            removeByValue(authorObj.loved, uid); 
            var _author = _underscore.extend(author, authorObj); 
            _author.save(function (err, author) {
              if (err) {console.log(err);}
            });
            //在用户处减少喜爱的作者
            var userObj=user;
            removeByValue(userObj.myauthor, tid);
            var _user = _underscore.extend(user, userObj); 
            _user.save(function (err, user) {
              if (err) {console.log(err);}
              res.json({success: 1});
            })
          })
        }
      }) 
      //取消收藏文单
      collections.findOne({_id:tid}).exec(function (err, collect) { 
        if (err) {console.log(err);}
        if(collect!==null ){
          users.findOne({_id:uid}).exec(function (err, user){
            if (err) {console.log(err);}
            //在作者处取消喜爱人
            var collectObj=collect;
            removeByValue(collectObj.loved, uid); 
            var _collect = _underscore.extend(collect, collectObj); 
            _collect.save(function (err, collect) {
              if (err) {console.log(err);}
            });
            //在用户处取消喜爱的文单
            var userObj=user;
            removeByValue(userObj.mycollect, tid); 
            var _user = _underscore.extend(user, userObj); 
            _user.save(function (err, user) {
              if (err) {console.log(err);}
              res.json({success: 1});
            })
          })
        }
      })
      //文单内取消小说
      novels.findOne({_id:tid}).exec(function (err, novel) { 
        if (err) {console.log(err);}
        console.log(novel);
        if(novel!==null ){
          collections.findOne({_id:uid}).exec(function (err, collect){
            if (err) {console.log(err);}
            //在小说处取消文单
            var novelObj=novel;
            removeByValue(novelObj.collects, uid); 
            var _novel = _underscore.extend(novel, novelObj); 
            _novel.save(function (err, novel) {
              if (err) {console.log(err);}
            });
            //在文单取消小说
            var collectObj=collect;
            removeByValue(collectObj.novels, tid); 
            var _collect = _underscore.extend(collect, collectObj); 
            _collect.save(function (err, collect) {
              if (err) {console.log(err);}
              res.json({success: 1});
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