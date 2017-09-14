var mongoose=require('mongoose');
var CommentSchema = require('../schemas/commentSchema');
var Comment=mongoose.model('Comment', CommentSchema);
module.exports = Comment;