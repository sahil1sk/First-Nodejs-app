// SO HERE WE ARE USING EXPRESS ROUTERS -- so that to make large number of api endpoint become easy

// getting the modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   // getting the mongoose for using mongoose ODM

const Dishes = require('../models/dishes'); // getting the Dishes model
// so at the begining of the app.js we will connect with mongo database so there is no need to connect it again this will work

// so here we declare dishRouter as express router
const dishRouter = express.Router();

// so here we using body parser
dishRouter.use(bodyParser.json()); // for getting the body data we use bodyParser

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);    // so res.json will help to send the json response
    }, (err) => next(err))    
    .catch((err) => next(err)) // next will help to send at the next so that it will handle at the global level                   
})                              // sending the error which is handle by the app.js error handler globally
.post((req, res, next) => {
    Dishes.create(req.body)     // inside the body we will send the dish which has to be created
    .then((dish) => {
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /dishes');
})
.delete((req, res, next) => {
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
.get((req, res, next) => {
    Dishes.findById(req.params.dishId) // so here we find the dish by id and req.params.dishId having the id which will come with request
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('POST operation not supoorted on /dishes/' + 
            req.params.dishId);
})
.put((req, res, next) => {  
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
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)  // so here we delete the dish by using it's id
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);    // so res.json will help to send the json response
    }, (err) => next(err))
    .catch((err) => next(err))  // sending the error which is handle by the app.js error handler globally
});


// for specific dishs for it's all the comments
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)  // getting the dish with it's id
    .then((dish) => {
        if(dish !== null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);    // so res.json will help to send the json response
        }else{
            err = new Error("Dish " + req.params.dishId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally
        }
    }, (err) => next(err))    
    .catch((err) => next(err)) // next will help to send at the next so that it will handle at the global level                   
})  
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)  // getting the dish with it's id
    .then((dish) => {
        if(dish !== null) {
            dish.comments.push(req.body); // so here body of the message contains all the messages so that's why we push it
            dish.save()       // so we saving the changes
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);    // so res.json will help to send the json response  
            }, (err) => next(err))  //if there is an error so it will send the error which is handle globally
        }else{
            err = new Error("Dish " + req.params.dishId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /dishes/'+req.params.dishId+'/comments');
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)  // getting the dish with it's id
    .then((dish) => {
        if(dish !== null) {
            for (var i = (dish.comments.length - 1); i>=0; i--){ // for loop for loop through all the comments
                // getting the di of the comments using subdocument comments.id
                dish.comments.id(dish.comments[i]._id).remove(); // so here we removing all the comments one by one
            }
            dish.save()       // so we saving the changes 
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);    // so res.json will help to send the json response  
            },(err) => next(err))  // so here we send the error to handle globally if there is an error while saving
        }else{
            err = new Error("Dish " + req.params.dishId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally
        } 
    }, (err) => next(err))
    .catch((err) => next(err))
});

// this is for specific dish comments
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId) // so here we find the dish by id and req.params.dishId having the id which will come with request
    .then((dish) => {   // so in if we check dish will exist but also in subdocument comment id also exists means comment also exists
        if(dish !== null && dish.comments.id(req.params.commentId) !== null ) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
                                            // sending the specific comment
            res.json(dish.comments.id(req.params.commentId));    // so res.json will help to send the json response
        }else if(dish === null){
            err = new Error("Dish " + req.params.dishId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally
        }else{
            err = new Error("Comment " + req.params.commentId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally            
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('POST operation not supoorted on /dishes/' + 
            req.params.dishId + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {  
    Dishes.findById(req.params.dishId) // so here we find the dish by id and req.params.dishId having the id which will come with request
    .then((dish) => {   // so in if we check dish will exist but also in subdocument comment id also exists means comment also exists
        if(dish !== null && dish.comments.id(req.params.commentId) !== null) {
            if(req.body.rating){ //if there is rating in body so only allow to change rating
                dish.comments.id(req.params.commentId).rating = req.body.rating; // updating the rating of the comment through specific id
            }
            if(req.body.comment){ //if there is comment in the body only allow to change comment
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()       // so we saving the changes
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);    // so res.json will help to send the json response  
            }, (err) => next(err))  // if there is an error so it will send the error which is handle globally 
        }else if(dish === null){
            err = new Error("Dish " + req.params.dishId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally
        }else{
            err = new Error("Comment " + req.params.commentId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally            
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)  // getting the dish with it's id
    .then((dish) => {
        if(dish !== null && dish.comments.id(req.params.commentId) !== null) {
            // getting the id of the comments using subdocument comments.id
            dish.comments.id(req.params.commentId).remove(); // so here we removing all the comments one by one
            dish.save()       // so we saving the changes
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);    // so res.json will help to send the json response  
            },(err) => next(err))  // so here we send the error to handle globally if there is an error while saving
        }else if(dish === null){
            err = new Error("Dish " + req.params.dishId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally
        }else{
            err = new Error("Comment " + req.params.commentId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally            
        } 
    }, (err) => next(err))    
    .catch((err) => next(err))
});


module.exports = dishRouter;
