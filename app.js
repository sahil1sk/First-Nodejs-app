var createError = require('http-errors');         // helps to create the error
var express = require('express');               // importing express to use the express
var path = require('path');                     // importing path for use path for serving static files
var cookieParser = require('cookie-parser');   // cookie-parser is helps to read the cookie
var logger = require('morgan');               // morgan helps to console log the data 
var session  = require('express-session');    // so here we are importing the sesion parser
var FileStore = require('session-file-store')(session)  // so here we are getting file storage for storing data of sessions

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
//app.use(cookieParser('12345-67890-09876-54321'));  
// so here we comment the cookie parser because in place of cookie parser we are now using sessions

app.use(session({
  name: 'session-id',                   // giving the name
  secret: '12345-67890-09876-54321',    // giving the secret key which will help to encrypt the data when the request is comming next time
  saveUninitialized: false,    // 	If	true	it	forces	a	newly	created	session	without	any	modifications	to	be	saved	to	the	session	store.
  resave: false,              //	If	true	forces	a	session	to	be	saved	back	to	store	even	if	it	was	not	modified	in	the	request
  store: new FileStore() // so use new file store for the session
}));


// this is built in routers
app.use('/', indexRouter);
app.use('/users', usersRouter); // so we modify this router


// so here we will use the authentication 
// before accesing any of the static file and api
// so here befor going down at there using this line 
// we will check wheather the user is able to perform all the actions or not

// => so here in this function we check the user is authenticated or not
function auth(req, res, next){ // req, res, next are available as we connect to server
  console.log(req.session); // so here we will info of session

  if(!req.session.user){ // so if the session having  not the user field means a cookie is not set then we will go for the basic authentication in if
    var err = new Error('You are not authenticated!');
    err.status = 403; // forbidden
    return next(err); // so we will returning the error 
  }
  else{
    // so you know in user router at login function we set the req.session.user to authenticated
    if(req.session.user === "authenticated"){
      next();
    }else{
      var err = new Error('Your are not authenticated!');

      // so here we will not setHeader because this is set when the user at first time
      err.status = 403; // 403 forbidden error
      return next(err); // so we will returning the error var err = new Error('You are not authenticated');     
    }
  }  

};

app.use(auth);  // so her we call the function


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
