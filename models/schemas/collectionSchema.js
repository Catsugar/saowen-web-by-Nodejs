var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId;
var collectionSchema=new Schema({    
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
    cover: String,
    loved: [{type: ObjectId, ref:'User'}],
    novels: [{type: ObjectId, ref:'Novel'}]
})

// 表示每次存储数据之前都先调用这个方法
collectionSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});
// 模式的静态方法
collectionSchema.statics = {
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
    /*renderChild: function(cb) {
        this.forEach(function(item){
            var keys=Object.keys(item);
            for(var i=0;i<keys.length;i++){
               if(keys.type==ObjectId){
               console.log(db[key.ref].findOne({"_id":key}));
               Object.keys(item)[i]=db[key.ref].findOne({"_id":key});
               }
            }
        })
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    lovedSort: function(cb) {
        return this
        .find({})
        .sort('loved')
        .exec(cb);
    } */
}
// 导出
module.exports = collectionSchema;