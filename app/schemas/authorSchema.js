var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId;
var authorSchema=new Schema({
    id: {type:String,unique:true},
    name: String,
    description: String,
    editor: {type: ObjectId, ref:'User'},
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
    look: {type:Number, default:0},
    loved: [{type: ObjectId, ref:'User'}],
    novels: [{type: ObjectId, ref:'Novel'}]
})
// 表示每次存储数据之前都先调用这个方法
authorSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// 导出
module.exports = authorSchema;