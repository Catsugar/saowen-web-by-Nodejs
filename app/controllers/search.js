 
  //加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
var count=8;//每页几条数据
  exports.search=function(req,res){
    var key = req.body.key;
    var p=0;
    res.redirect('/result?key='+ key+'&p='+p);
  }

  //搜索页
  exports.result=function(req,res){
    var _user = req.session.user;
    var KEY = req.query.key;
    var page= parseInt(req.query.p) || 0;
    var num=page*count;
    novels.find({}).sort({'look':-1}).limit(10).populate('author').populate('comments').exec(function(err, novelRanks) {
      if(err){console.log(err);}
      authors.find({}).sort({'look':-1}).limit(10).populate('novels').exec(function(err, authorRanks) {
        if(err){console.log(err);}
        collections.find({}).sort({'look':-1}).limit(10).exec(function(err, collectionRanks) {
          if(err){console.log(err);} 
          novels.find({'name': { $regex: KEY, $options: 'i' }})
          .populate('author').populate('comments').sort({'meta.updateAt': -1}).limit(10).skip(index).exec(function(err, allnovels) {  
            if(err){console.log(err);}  
            var novels=allnovels.slice(num,num+count);
            res.render('search',{
              title:KEY+'的搜索结果：',
              novels: novels,
              currentPage:page,
              totalPage: Math.ceil(allnovels.length/count),
              novelRanks:novelRanks,
              authorRanks:authorRanks,
              collectionRanks:collectionRanks,
              _user:_user,
              KEY:KEY
            })
          })
        })
      })
    })
  }
