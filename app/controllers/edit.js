//加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
 //编辑小说
  exports.Editnovel=function (req, res) {
    var novelObj = req.body.newnovel;
    var ID=novelObj.id;
    novels.findOne({id:ID}).exec(function (err, novel) {
      if (err) {console.log(err);}
      users.findOne({_id:novelObj.editor}).exec(function (err, user) {
        if (err) {console.log(err);}
        if(user!==null){
          var _novel = _underscore.extend(novel, novelObj); 
          _novel.save(function (err, novel) {
            if (err) {console.log(err);}
            res.redirect('/novel/' + novel.id);
          })
        }
      })
    })
  }
  //编辑作者
  exports.Editauthor=function (req, res) {
    var authorObj = req.body.newauthor;
    var ID=authorObj.id;
    authors.findOne({id:ID}).exec(function (err, author) {
      if (err) {console.log(err);}
      users.findOne({_id:novelObj.editor}).exec(function (err, user) {
        if (err) {console.log(err);}
        if(user!==null){
          var _author = _underscore.extend(author, authorObj); 
          _author.save(function (err, author) {
            if (err) {console.log(err);}
            res.redirect('/author/' + author.id);
          })
        }
      })
    }) 
  }
  //编辑文单
  exports.Editcollect=function (req, res) {
    var collectObj = req.body.newcollect;
    var ID=collectObj.id;
    collections.findOne({id:ID}).exec(function (err, collect) {
      if (err) {console.log(err);}
      users.findOne({_id:novelObj.editor}).exec(function (err, user) {
        if (err) {console.log(err);}
        if(user!==null){
          var _collect = _underscore.extend(collect, collectObj); 
          _collect.save(function (err, collect) {
            if (err) {console.log(err);}
            res.redirect('/collect/' + collect.id);
          })
        }
      })
    })
  }
  //编辑用户
  exports.Edituser=function (req, res) {
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