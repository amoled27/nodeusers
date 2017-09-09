 var mongoose = require('mongoose');
 var bcrypt = require('bcrypt-nodejs');
 

 var userSchema = mongoose.Schema({
 	email: String,
 	password: String,
 	name: String
 });



 module.exports=mongoose.model('User', userSchema);