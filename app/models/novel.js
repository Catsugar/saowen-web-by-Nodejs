var mongoose=require('mongoose');
var NovelSchema = require('../schemas/novelSchema');
var Novel=mongoose.model('Novel', NovelSchema);
module.exports = Novel;