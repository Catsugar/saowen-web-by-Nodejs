# Node建站
>仿扫文小院
>用于练习和学习
>所有素材来自网络
<hr>

### 用到的技术栈
Node.js+Express+MongoDB+ejs
<hr>

#### 项目结构初始化

```
npm install express

npm install ejs

npm install mongoose

npm install bower -g

npm install bootstrap
```
#### Grunt 集成

```
npm install grunt --save

npm install grunt-cli -g

npm install grunt-contrib-watch --save

npm install grunt-concurrent --save

npm install grunt-nodemon --save

npm install bcryptjs --save

```
#### 密码加密
```
npm install bcryptjs  --save

```
#### 会话持久化

```
npm install connect-mongo --save

```
#### 单元测试

```
npm install mocha grunt-mocha-test --save
npm install should --save

```

#### 网站部署
* 买服务器和域名
* 配置环境
```
vi /etc/ssh/sshd_config
```
* 更新
```
apt-get update
```
* 安装相关模块
```
apt-get install vim openssl build-essential libssl-dev wget curl git
```
* 安装nvm
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
nvm install v6.11.3
nvm use v6.11.3
nvm alias default v6.11.3
node -v
``
* 指定npm配置
```
npm --registry=https://registry.npm.taobao.org install -g npm
npm -v
echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p
npm --registry=https://registry.npm.taobao.org install -g cnpm
cnpm install webpack grunt-cli -g
``
* 安装
```
apt-get install nginx 
/etc/nginx/conf.d
``
#### 进度记录
已经搭好了基本框架，目前做好的：
* 基本框架和每个页面的渲染。
* 小说，作者，文单的新建，只能在后台管理页操作。
* 评论，文单的删除，只能在后台管理页操作。
* 小说的评论，和添加tag，在小说详情页面操作。
* 小说和文单信息的编辑，在小说详情页面和文单详情页面操作。
* 登录和注册功能。
* 文档结构调整完毕。
* 用户的权限，以及用户未登录时提示登录。
* 登录后的各种操作。
* 收藏功能。
* 搜索功能和tag功能。
* 分页。
*上传封面和海报
* 统计功能
* 文单收录小说功能。
* 解决密码二次加密问题

***
到这里基本上就全部写完了，开心O(∩_∩)O~~，小bug以后慢慢改吧



还没做好的功能：

* 暂时不做互相评论功能。




#### 项目预览
预览1<br>
![截图1](https://catsugar.github.io/pics/4-1.png)<br>
预览2<br>
![截图1](https://catsugar.github.io/pics/4-2.png)<br>
预览3<br>
![截图1](https://catsugar.github.io/pics/4-3.png)<br>
预览4<br>
![截图1](https://catsugar.github.io/pics/4-4.png)<br>


