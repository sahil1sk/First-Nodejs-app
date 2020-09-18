// SO HERE WE ARE USING EXPRESS ROUTERS -- so that to make large number of api endpoint become easy

// getting the modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   // getting the mongoose for using mongoose ODM
const authenticate = require('../authenticate'); // getting the authenticate module
const cors = require('./cors');           // getting the cors 

const Favourites = require('../models/favourites'); // getting the Favourites model

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json()); // for getting the body data we use bodyParser

// find will give array findOne will give one element in dict
favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)}) 
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {      
    Favourites.findOne({user: req.user._id}) // becuase of find we will get data in array form
    .populate('user')
    .populate('dishes')
    .then((favData) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favData);
    }, (err) => next(err))
    .catch((err) => next(err)) 
})   
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {  // this operation is for admin only
    Favourites.findOne({user: req.user._id})
    .then((favData) => {
        if(favData !== null){  //typeof favData.dishes !== 'undefined' && favData.dishes.length > 0
            
            //var ObjectId = mongoose.Schema.Types.ObjectId;
            var ObjectId = mongoose.Types.ObjectId; // for making new object id
            var bodyDishes = req.body;
            
            for(var j = (bodyDishes.length - 1); j>=0; j--){
                var havingDish = true;
                for (var i = (favData.dishes.length - 1); i>=0; i--){ 
                    //if(favData.dishes.id(favData.dishes[i]._id) === bodyDishes[j]._id) havingDish = false;
                    if (String(favData.dishes[i]._id)  === bodyDishes[j]._id) havingDish = false;
                }
                if(havingDish){
                    var dish = {"_id": ObjectId(bodyDishes[j]._id)} // so here we converting into object id because sometime it will not take string
                    favData.dishes.push(dish);
                }         
            }
            
            favData.save()       // so we saving the changes
            .then((allData) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(allData);    // so res.json will help to send the json response  
            }, (err) => next(err))  //if there is an error so it will send the error which is handle globally
            .catch((err) => next(err))

        }else{
            console.log("in else part");
            const newData = {
                user: req.user._id,
                dishes: req.body
            }
            Favourites.create(newData)     // inside the body we will send the dish which has to be created
            .then((allData) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(allData);    // so res.json will help to send the json response
            }, (err) => next(err))
            .catch((err) => next(err)) 
        } 
    }, (err) => next(err))    
    .catch((err) => next(err)) 
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { 
    Favourites.find({user: req.user._id})
    .then((favData) => {
        var favId;
        for (i in favData) favId = favData[i]._id; 

        Favourites.findByIdAndRemove(favId)  // so here we delete the dish by using it's id
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);    // so res.json will help to send the json response
        }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))
});


/* posting the new fav dish */
favouriteRouter.post('/:dishId', cors.corsWithOptions, authenticate.verifyUser,  function(req, res, next) {
    var ObjectId = mongoose.Types.ObjectId; // helps to setup the object id
            
    Favourites.findOne({user: req.user._id})
    .then((favData) => {
        if(favData !== null){    
            var ParamId = req.params.dishId;

            var havingDish = true;
            for(var i = (favData.dishes.length - 1); i>=0; i--){
                if (String(favData.dishes[i]._id)  === ParamId) havingDish = false;
            }

            // we make this so that if there is already exists or not
            if(havingDish){
                var dish = {"_id": ObjectId(ParamId)}
                favData.dishes.push(dish);
            }         
                    
            favData.save()       // so we saving the changes
            .then((allData) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(allData);    // so res.json will help to send the json response  
            }, (err) => next(err))  //if there is an error so it will send the error which is handle globally
            .catch((err) => next(err))

        }else{
            const newData = {
                user: req.user._id,
                dishes: [{"_id": ObjectId(req.params.dishId)}]       // so here we converting into array because we are getting only one dish
            }
            Favourites.create(newData)     // inside the body we will send the dish which has to be created
            .then((allData) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(allData);    // so res.json will help to send the json response
            }, (err) => next(err))
            .catch((err) => next(err)) 
        } 
    }, (err) => next(err))    
    .catch((err) => next(err))  
});
  
// deleteting the new dishId       
favouriteRouter.delete('/:dishId', cors.corsWithOptions, authenticate.verifyUser,  function(req, res, next) {
    Favourites.find({user: req.user._id})
    .then((favData) => {
        var favId;     // this is the document id where client data exists
        for (i in favData) favId = favData[i]._id;  // just another way to get the id

        Favourites.findById(favId)  
        .then((favDishes) => {
            
            // using the for loop for removing the id
            for (var i = (favDishes.dishes.length - 1); i >= 0; i--) {
                if (String(favDishes.dishes[i]._id) === req.params.dishId) {
                    console.log("Inside the if");
                    favDishes.dishes.remove(favDishes.dishes[i]._id); // Just removing the id from the dish
                }
            }

            favDishes.save()
            .then((DishData) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(DishData);    // so res.json will help to send the json response  
                
            },(err) => next(err))  // so here we send the error to handle globally if there is an error while saving
            .catch((err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))
});


module.exports = favouriteRouter;