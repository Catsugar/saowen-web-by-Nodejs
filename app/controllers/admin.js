//加载各个模块
var users = require('../models/user.js'); 
var novels=require('../models/novel.js');
var authors=require('../models/author.js');
var collections=require('../models/collection.js');
var comments=require('../models/comment.js');
var _underscore=require('underscore');
var bcrypt= require('bcryptjs'),//加密库
    SALT_WORK_FACTOR=10;
 //增加用户----注册
  exports.Adduser=function(req,res){
    var userObj = req.body.newuser;//req.param('user')
    var Newname=userObj.name;
    var Newemaill=userObj.emaill;
    users.findOne({}).sort({'id': -1}).exec(function(err,lastuser) {
      var userLen=parseInt(lastuser.id.slice(2));
      users.findOne({$or: [{name:Newname}, {emaill:Newemaill}]}).exec(function (err, user) {
        if (err) {console.log(err);}
        if(user!==null){
          console.log("该用户已经被注册");
          res.redirect('/');
        } else {//用户不存在
          var _user=createUser(userObj,userLen);
          
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(_user.password, salt);
          _user.password=hash;

          _user.save(function (err, user) {
            if (err) {console.log(err);}
            res.redirect('/');
          });
        }
      })
    })
  }
  //登录
  exports.Signin=function(req,res){
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
  exports.Logout=function(req,res){
    delete req.session.user;
    //delete app.locals.user;
    console.log("退出成功");
    res.redirect('/');
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