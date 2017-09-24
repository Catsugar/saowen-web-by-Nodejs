var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId;
var novelSchema=new Schema({    
    id: {type:String,unique:true},
    name: String,
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
    author: {type: ObjectId, ref:'Author'},
    type: String,
    progress: String,
    len: String,
    year: String,
    taste: String,
    actor: String,
    web: String,
    tags: [],
    look: {type:Number, default:0},
    collects: [{type: ObjectId, ref:'Collection'}],
    comments: [{type: ObjectId, ref:'Comment'}]  
})
// 表示每次存储数据之前都先调用这个方法
novelSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// 导出
module.exports = novelSchema;