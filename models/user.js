// in this file we will make user model
var mongoose = require('mongoose'); // getting mongo for creating schema
var Schema = mongoose.Schema;          // creating the Schema constant

var User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true        // the username must be unique
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', User); // Users will automatically change into the plural means Users in database 
