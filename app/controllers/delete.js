//加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
//删除
  exports.Delete=function (req, res) {
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
  //删除特定值
  function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
      if(arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }