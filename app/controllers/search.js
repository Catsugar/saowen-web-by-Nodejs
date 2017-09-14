 
  //加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
  //搜索页
  exports.search=function(req,res){
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
