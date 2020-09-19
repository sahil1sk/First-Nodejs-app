// SO HERE WE ARE USING EXPRESS ROUTERS -- so that to make large number of api endpoint become easy

// getting the modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   // getting the mongoose for using mongoose ODM
const authenticate = require('../authenticate'); // getting the authenticate module
const cors = require('./cors');           // getting the cors 

const Dishes = require('../models/dishes'); // getting the Dishes model
// so at the begining of the app.js we will connect with mongo database so there is no need to connect it again this will work

// so here we declare dishRouter as express router
const dishRouter = express.Router();

// so here we using body parser
dishRouter.use(bodyParser.json()); // for getting the body data we use bodyParser

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)})  // so client will first send the req to check which methods are allowed to him on this route and according to it's his host we check it's origin from that we will send the option which are allowed to him 
.get(cors.cors, (req, res, next) => {  // cors.cors means fully allowed cors.corsWithOptions for the request which have our whitelist host which we specified in cors.js file
    Dishes.find(req.query)        // req.query means /?freatured=true this will come in query like {"featured":"true"}
    .populate('comments.author') // so here we set the build in funtion we send that to populate the user info
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);    // so res.json will help to send the json response
    }, (err) => next(err))    
    .catch((err) => next(err)) // next will help to send at the next so that it will handle at the global level                   
})   // so by giving authenticate.verifyUser we will set that the user must be authenticated before posting any data                               // sending the error which is handle by the app.js error handler globally
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {  // this operation is for admin only
    Dishes.create(req.body)     // inside the body we will send the dish which has to be created
    .then((dish) => {
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))
})// so by giving authenticate.verifyUser we will set that the user must be authenticated before performing put
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { 
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);    // so res.json will help to send the json response        
    }, (err) => next(err))
    .catch((err) => next(err))
});

// this is for specific dishes
dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)})
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId) // so here we find the dish by id and req.params.dishId having the id which will come with request
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('POST operation not supoorted on /dishes/' + 
            req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {  
    // update the dish by it's id 
    // first we pass the id then send the update value and {new: true} means get the update data back
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)  // so here we delete the dish by using it's id
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))  // sending the error which is handle by the app.js error handler globally
});



module.exports = dishRouter;