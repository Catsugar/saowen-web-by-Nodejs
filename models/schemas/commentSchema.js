var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId;
var commentSchema=new Schema({    
    id: {type:String,unique:true},
    userID:{type: ObjectId, ref:'User'},
    novelID: {type: ObjectId, ref:'Novel'},
    meta: {
        createAt: {
        type: Date,
        default: Date.now()
        },
        updateAt: {
        type: Date,
        default: Date.now()
        }
    },
    state: String,
    score: Number,
    text: String    
})

// 表示每次存储数据之前都先调用这个方法
commentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});
// 静态方法
commentSchema.statics = {
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
module.exports = commentSchema;