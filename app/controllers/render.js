 //加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
 //首页
  exports.index=function(req,res){
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
  exports.authorlist=function(req,res){
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
  //作者详情
  exports.author=function(req,res){
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
    //书单列表
  exports.collectlist=function(req,res){
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
    //书单详情
  exports.collect=function(req,res){
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
  exports.novel=function(req,res){
    var User = req.session.user;
    var userID=(User!==undefined) ? User._id:undefined;
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
            users.findOne({_id:userID}).populate('editcollect').sort({'meta.updateAt': -1}).exec(function(err, _user) {  
              if(err){console.log(err);}
              if(_user==null){_user=undefined;}
              console.log(_user);
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
    })
  }
  //后台页
  exports.back=function(req,res){
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
