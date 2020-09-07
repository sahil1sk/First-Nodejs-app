var express = require('express');
const bodyParser = require('body-parser'); // getting body parser for reading the req body contect
var User = require('../models/user');

var router = express.Router(); // getting the router
router.use(bodyParser.json()); // so here we ask router to use body parser


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next){
  User.findOne({username: req.body.username})  // so here we try to find the username in the database
  .then((user)=>{
    if(user != null){ // so if user is exists then we send the error
      var err = new Error("User " + req.body.username + " already exists");
      err.status = 403;      // forbidden
      next(err);            //  handle by the global error
    }else{
      // so if no user is exist then we will create the new user
      return User.create({username: req.body.username,
                          password: req.body.password,
                        })
    }
  },(err) => next(err)) // so if there is an error while finding the user we will send the error
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({status: 'Registration Successful!', user:user});
  }, (err) => next(err))  // so if there is any error while creating user we will  then send the error
  .catch((err) => next(err)); // => send the error to error handler
});

router.post('/login', (req, res, next) => {
  if(!req.session.user){ // so if the session having  not the user field means a cookie is not set then we will go for the basic authentication in if
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

    // so here we will try to find the user wil the username
    User.findOne({username: username})
    .then((user) => {
      if (user === null) {
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password) {
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    })
    .catch((err) => next(err));
  }else{ // if user has session id
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated')
  }
});

router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy();          // so here we destroy the session from our server side means from our file storage system
    res.clearCookie('session-id'); // here we clear the session cookie from the client side which is generated automatically when we adding session
    res.redirect('/'); // here we redirect the client to the home page
  }else{
    var err = new Error('You are not logged in!');
    err.status = 403;  // forbidden
    next(err);
  }
});


module.exports = router;
