// SO HERE WE ARE USING EXPRESS ROUTERS -- so that to make large number of api endpoint become easy

// getting the modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   // getting the mongoose for using mongoose ODM
const authenticate = require('../authenticate'); // getting the authenticate module
const cors = require('./cors');           // getting the cors 

const Leaders = require('../models/leaders'); // getting the Dishes model
// so at the begining of the app.js we will connect with mongo database so there is no need to connect it again this will work


// so here we declare leaderRouter as express router
const leaderRouter = express.Router();

// so here we using body parser
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)})  // so client will first send the req to check which methods are allowed to him on this route and according to it's his host we check it's origin from that we will send the option which are allowed to him 
.get(cors.cors, (req, res, next) => {
    Leaders.find(req.query)        // req.query means /?freatured=true this will come in query like {"featured":"true"}
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);    // so res.json will help to send the json response
    }, (err) => next(err))    
    .catch((err) => next(err)) // next will help to send at the next so that it will handle at the global level                   
})// so by giving authenticate.verifyUser we will set that the user must be authenticated before posting any data                               // sending the error which is handle by the app.js error handler globally
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)     // inside the body we will send the dish which has to be created
    .then((leaders) => {
        console.log('Leaders Created', leaders);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /leaders');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);    // so res.json will help to send the json response        
    }, (err) => next(err))
    .catch((err) => next(err))
});


// this is for specific leaders
leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)})  // so client will first send the req to check which host are allowed and then send the original req so we will send status code 200 when client will send options preflight
.get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId) // so here we find the dish by id and req.params.dishId having the id which will come with request
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('POST operation not supoorted on /leaders/' + 
            req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {  
    // update the dish by it's id 
    // first we pass the id then send the update value and {new: true} means get the update data back
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {new: true})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)  // so here we delete the dish by using it's id
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))  // sending the error which is handle by the app.js error handler globally
});

module.exports = leaderRouter;
