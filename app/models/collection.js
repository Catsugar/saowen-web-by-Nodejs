var mongoose=require('mongoose');
var CollectionSchema = require('../schemas/collectionSchema');
var Collection=mongoose.model('Collection', CollectionSchema);
module.exports = Collection;