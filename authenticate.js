// ==> so we use this file for store the authentication strategy which we configure
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // getting the local strategy from the passport-local
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;  // so this will provide us  the jwt strategies
var ExtractJwt = require('passport-jwt').ExtractJwt;  // import for extracting the jwt
var jwt = require('jsonwebtoken');    // getting the jsonwebtoken module

var config = require('./config');   // getting  config file data


// User.authenticate call the function which will check the user is authenticated or not
// this User.authenticate function is available passport-local-mongoose otherwise we have to made this function like we did in previous session part-2 lecture
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// the given two line of code will take care of the support for sessions
passport.serializeUser(User.serializeUser());       // this will serialize the data into the session
passport.deserializeUser(User.deserializeUser());   // this will deserialize the data into the session

// helps to gererate the jwt token
exports.getToken = function(user){             // need to pass the user unique info to create the token
    return jwt.sign(user, config.secretKey,  // it will take 3 parameters to generate jwt first user , then secret key and then expiry date
        {expiresIn: 3600});
};

// creating the options to extract the token method
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // so here we set the option in opts that we will extract the token from the header field
opts.secretOrKey = config.secretKey;                            // so this is the second option for extracting the token where we use our secret key to extracting the token

// here we creating the jwt strategy to check wheather the user is exist where we pass opts and then a function which have 2 params jwt_payload and done and done help to send the callback
exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => { // jwt_payload._id contains the user id so using that we will trying to find the user from the database
            if(err){
                return done(err, false); // this containe three params error user and info, info is optional and we have no user the we pass false
            }else if (user){ // if use exists
                return done(null, user); // null means no error and we give the user
            }else{
                return done(null, false);        
            }
        });
    }));


// creating funtion for verify the user            
// so here we using the jwt stretgy for verify the user which we configured above it will automatically use the strategy
exports.verifyUser = passport.authenticate('jwt', {session: false}) // we are not creating session so set it false

exports.verifyAdmin = (req, res, next) =>{
    if(req.user.admin){
        return next();
    }else{
        err = new Error("You are not authenticated to perform this operation"); // creating the new error
        err.status = 403; // giving the status code not authenticated
        return next(err)  // sending the error which is handle by the app.js error handler globally
    }
};

