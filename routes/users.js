var express = require('express');
const bodyParser = require('body-parser'); // getting body parser for reading the req body contect
var User = require('../models/user');
var passport = require('passport');   // getting the passport module
var authenticate = require('../authenticate'); // authenticate we use here for getting token and for checking admin
var cors = require('./cors');

var router = express.Router(); // getting the router
router.use(bodyParser.json()); // so here we ask router to use body parser


/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
    .populate('comments.author') // so here we set the build in funtion we send that to populate the user info
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);    // so res.json will help to send the json response
    }, (err) => next(err))    
    .catch((err) => next(err)) // next will help to send at the next so that it will handle at the global level                  
});


// the register method is available by the user plugin by passport-local-mongoose which we set up in user model
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), // in this we passing the new username, password and getting the callback
    req.body.password, (err, user) => {
    if(err) { // if error then show the error
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else { // if no any error then authenticate the user with local passport
      if(req.body.firstname) user.firstname = req.body.firstname;
      if(req.body.lastname) user.lastname = req.body.lastname;
      user.save((err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {  //we export the authenticate.js file in app.js so it is available in whole code so this ('local') will automatically export the authentication strategy which we describe authenticate.js
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

// we suppose that we will get password and username in the body not in the header
// while authentication if there is any error then it will automatically send the error
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  // so req.user is automatically present by middleware which we set in app.js file i.e passport intialize when the user is authenticated successfully
  var token = authenticate.getToken({_id: req.user._id}); // here we generating the token by passing the user id
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
                          // so here we send the token back which we created so that next time it will take token with ourself for login
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', cors.corsWithOptions, (req, res) => {
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
