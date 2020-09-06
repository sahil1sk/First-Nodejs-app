var createError = require('http-errors');         // helps to create the error
var express = require('express');               // importing express to use the express
var path = require('path');                     // importing path for use path for serving static files
var cookieParser = require('cookie-parser');   // cookie-parser is helps to read the cookie
var logger = require('morgan');               // morgan helps to console log the data 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter'); // importing the dish router module
var leaderRouter = require('./routes/leaderRouter');
var promotionRouter = require('./routes/promotionRouter');

// Getting the mongoose ODM 
const mongoose = require('mongoose');
const Dishes = require('./models/dishes'); // get the dishes model which we make using schemas

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

// connecting the mongodb server
connect.then((db) => {
  console.log("Connected correctly to the server");

}, (err) => { console.log("Error is: ", err); }); 
// this is the another way of showing the error instead of using catch


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());                           // with the help of this we are able to send the json data
app.use(express.urlencoded({ extended: false }));

// so here we are using cookie-parser by default and in this we will pass the secret-key
// so we will pass the fake secret id because this will help to encrypt the data which is comming through signed cookie
app.use(cookieParser('12345-67890-09876-54321'));  


// so here we will use the authentication 
// before accesing any of the static file and api
// so here befor going down at there using this line 
// we will check wheather the user is able to perform all the actions or not

// => so here in this function we check the user is authenticated or not
function auth(req, res, next){ // req, res, next are available as we connect to server
  console.log(req.signedCookies); // so here we will info of signedCookies

  if(!req.signedCookies.user){ // so if the signed cookies having  not the user field means a cookie is not set then we will go for the basic authentication in if
    console.log(req.headers); // printing all the information

    var authHeader = req.headers.authorization; // getting the authorization data from header
    if(!authHeader){ // so if the header is null then we sent the error
      var err = new Error('You are not authenticated!');

      res.setHeader('WWW-Authenticate', 'Basic'); // setting the header that it is by authentication
      err.status = 401; // 401 means not authenticated
      return next(err); // so we will returning the error 
    }

    // so here we spliting the auth header string from space 
    // for ex:- we have (Basic jklmkyuiop24kj) 
    // when we split [1] this will split into the array [0] => will contain Basic and [1] => will contain base string
    // we will get base64 encoded string that's we write base64
    // after getting [1] which contain string we will then again split from : because it will contain username 
    // and password in encrypt format and convert into array [0] => contain username [1] => contain password
    // Remember : is not shown it is also in string encoded only with the help of Buffer we able to split it
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); 

    var username = auth[0];
    var password = auth[1];

    if(username === 'admin' && password === 'password'){ // just dummy
      // after user login we will set cookie and also we will set al signed cookie
      res.cookie('user','admin', {signed: true}); 
      next(); // so using next now the request will go through next set of middleware
    }
    else{
      var err = new Error('Your are not authenticated!');

      res.setHeader('WWW-Authenticate', 'Basic'); // setting the header that it is by authentication
      err.status = 401; // 401 means not authenticated
      return next(err); // so we will returning the error var err = new Error('You are not authenticated');
    }
  }
  else{
    // in if it will check the signed cookie value
    if(req.signedCookies.user === "admin"){
      next();
    }else{
      var err = new Error('Your are not authenticated!');

      // so here we will not setHeader because this is set when the user at first time
      err.status = 401; // 401 means not authenticated
      return next(err); // so we will returning the error var err = new Error('You are not authenticated');     
    }
  }  

};

app.use(auth);  // so her we call the function


app.use(express.static(path.join(__dirname, 'public')));

// this is built in routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
// this is our own made routers
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promotionRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler  so this part will handle all the errors
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
