// in this file we will make user model
var mongoose = require('mongoose'); // getting mongo for creating schema
var Schema = mongoose.Schema;          // creating the Schema constant
var passportLocalMongoose = require('passport-local-mongoose'); // getting the variable of passport-local-mngoose read README File

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

// so passportLocalMongoose automatically add the username and password field with additional method like encrpting password
User.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', User); // Users will automatically change into the plural means Users in database 
