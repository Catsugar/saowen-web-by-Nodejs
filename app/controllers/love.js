 //加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
  //收藏作者
  exports.Loveauthor=function (req, res) {
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
  exports.Lovecollect=function (req, res) {
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
  exports.Cancel=function (req, res) {
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