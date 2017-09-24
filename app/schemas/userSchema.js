var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId,
        bcrypt= require('bcryptjs'),//加密库
        SALT_WORK_FACTOR=10;

var userSchema=new Schema({
    id: {type:String,unique:true},
    name: {type:String,unique:true},
    password: String,
    emaill: String,
    description: String,
    photo: String,
    editnovel: [{type: ObjectId, ref:'Novel'}],
    editcollect: [{type: ObjectId, ref:'Collection'}],
    mycollect: [{type: ObjectId, ref:'Collection'}],
    myauthor: [{type: ObjectId, ref:'Author'}],
    mycomment: [{type: ObjectId, ref:'Comment'}],
    meta: {
        createAt: {
        type: Date,
        default: Date.now()
        },
        updateAt: {
        type: Date,
        default: Date.now()
        }
    }
})

// 表示每次存储数据之前都先调用这个方法
userSchema.pre('save', function (next) {
    var user=this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next()
    //生成随机的盐
    /*bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })*/
})
//模式的实例方法
userSchema.methods = {
    //验证盐
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)
      cb(null, isMatch)
    })
  }
}
// 模式的静态方法
userSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (ID, cb) {
        return this
            .findOne({id: ID})
            .exec(cb)
    }
}
// 导出
module.exports = userSchema;