var createError = require('http-errors');         // helps to create the error
var express = require('express');               // importing express to use the express
var path = require('path');                     // importing path for use path for serving static files
var cookieParser = require('cookie-parser');   // cookie-parser is helps to read the cookie
var logger = require('morgan');               // morgan helps to console log the data 
var session  = require('express-session');    // so here we are importing the sesion parser
var FileStore = require('session-file-store')(session)  // so here we are getting file storage for storing data of sessions
var passport = require('passport');             // getting the passport module
var authenticate = require('./authenticate');   // getting the authectiation strategy
var config = require('./config');       // getting the config data

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter'); // importing the dish router module
var leaderRouter = require('./routes/leaderRouter');
var promotionRouter = require('./routes/promotionRouter');

// Getting the mongoose ODM 
const mongoose = require('mongoose');
//const Dishes = require('./models/dishes'); // get the dishes model which we make using schemas

const url = config.mongoUrl; // getting the url from the config file
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


// so this middleware will set the user property which is session at request
// so the further it is available in request for use
app.use(passport.initialize());

// this is built in routers
app.use('/', indexRouter);
app.use('/users', usersRouter); // so we modify this router


app.use(express.static(path.join(__dirname, 'public')));

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
