var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId;
var userSchema=new Schema({
    id: {type:String,unique:true},
    name: String,
    password: String,
    emaill: String,
    description: String,
    isLoad: Boolean,
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
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});
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