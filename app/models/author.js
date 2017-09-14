var mongoose=require('mongoose');
var AuthorSchema = require('../schemas/authorSchema');
var Author=mongoose.model('Author', AuthorSchema);
module.exports = Author;