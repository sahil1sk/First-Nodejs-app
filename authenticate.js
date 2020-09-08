// ==> so we use this file for store the authentication strategy which we configure
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // getting the local strategy from the passport-local
var User = require('./models/user');

// User.authenticate call the function which will check the user is authenticated or not
// this User.authenticate function is available passport-local-mongoose otherwise we have to made this function like we did in previous session part-2 lecture
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// the given two line of code will take care of the support for sessions
passport.serializeUser(User.serializeUser());       // this will serialize the data into the session
passport.deserializeUser(User.deserializeUser());   // this will deserialize the data into the session

