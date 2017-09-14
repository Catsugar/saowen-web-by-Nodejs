var mongoose=require('mongoose');
var UserSchema = require('../schemas/userSchema');
var User=mongoose.model('User', UserSchema);
module.exports = User;