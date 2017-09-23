//加载各个模块
var Render = require('../app/controllers/render.js'); 
var Add = require('../app/controllers/add.js'); 
var Admin = require('../app/controllers/admin.js'); 
var Del = require('../app/controllers/delete.js'); 
var Love = require('../app/controllers/love.js'); 
var Edit = require('../app/controllers/edit.js'); 
var Search = require('../app/controllers/search.js'); 
//*********************抛出模块
module.exports=function (app) {
  app.use((req, res, next) => {
    var _user = req.session.user;
    res.locals.user = _user;
    next();
  });
  //各种模型路由
  app.route('/').get(Render.index);
  app.route('/author-list').get(Render.authorlist);
  app.route('/collect-list').get(Render.collectlist);
  app.route('/author/:id').get(Render.author);
  app.route('/collect/:id').get(Render.collect);
  app.route('/novel/:id').get(Render.novel);
  app.route('/back/:id').get(Render.back);
  app.route('/search').post(Search.search)
  app.route('/result').get(Search.result);//搜索功能
  app.route('/new/novel').post(Add.Addnovel);
  app.route('/new/collect').post(Add.Addcover,Add.Addcollect);
  app.route('/new/comment').post(Add.Addcomment);
  app.route('/new/user').post(Admin.Adduser);//注册
  app.route('/edit/novel').post(Edit.Editnovel);
  app.route('/edit/author').post(Edit.Editauthor);
  app.route('/edit/collect').post(Add.Addcover,Edit.Editcollect);
  app.route('/edit/user/photo').post(Add.Addphoto,Edit.Edituser);
  app.route('/edit/user/des').post(Edit.Edituser);
  app.route('/back/admin').delete(Del.Delete);
  app.route('/back/love').post(Love.Love);//收藏
  app.route('/back/cancel').post(Love.Cancel);//取消收藏
  app.route('/user/signin').post(Admin.Signin);//登录
  app.route('/user/logout').get(Admin.Logout);//登出
}





