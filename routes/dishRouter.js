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
    Dishes.find({})
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


// for specific dishs for it's all the comments
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)})
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)  // getting the dish with it's id
    .populate('comments.author')
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
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)  // getting the dish with it's id
    .then((dish) => {
        if(dish !== null) {  // req.user._id we will get when we properly authenticate then it will set by the passport on the request
            req.body.author = req.user._id; // so here we setting up the author field in the body for author field for comment which will help to populate the data
            dish.comments.push(req.body); // so here body of the message contains all the messages so that's why we push it
            dish.save()       // so we saving the changes
            .then((dish) => {
                Dishes.findById(dish._id) // there we do find because for populate the data
                    .populate('comments.author')   // so here we populate the user data while sending back the comment
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);    // so res.json will help to send the json response
                    })  
            }, (err) => next(err))  //if there is an error so it will send the error which is handle globally
        }else{
            err = new Error("Dish " + req.params.dishId + " not found"); // creating the new error
            err.statusCode = 404; // giving the status code not found
            return next(err)  // sending the error which is handle by the app.js error handler globally
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /dishes/'+req.params.dishId+'/comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.options(cors.corsWithOptions, (req, res) => {res.statusCode(200)})
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId) // so here we find the dish by id and req.params.dishId having the id which will come with request
    .populate('comments.author')
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
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('POST operation not supoorted on /dishes/' + 
            req.params.dishId + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {  
    Dishes.findById(req.params.dishId) // so here we find the dish by id and req.params.dishId having the id which will come with request
    .then((dish) => {   // so in if we check dish will exist but also in subdocument comment id also exists means comment also exists
        if(dish !== null && dish.comments.id(req.params.commentId) !== null) {
            
            if(String(dish.comments.id(req.params.commentId).author._id) !== String(req.user._id)){
                err = new Error("You are not authorized to update this comment"); // creating the new error
                err.status = 403; // giving the status code of not authorized
                return next(err);  // sending the error which is handle by the app.js error handler globally
            }
    
            if(req.body.rating){ //if there is rating in body so only allow to change rating
                dish.comments.id(req.params.commentId).rating = req.body.rating; // updating the rating of the comment through specific id
            }
            if(req.body.comment){ //if there is comment in the body only allow to change comment
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()       // so we saving the changes
            .then((dish) => {
                Dishes.findById(dish._id)  // there we do find because for populate the data
                .populate('comments.author') // so here we populate the author data before sending the updated comment
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);    // so res.json will help to send the json response  
                })
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
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)  // getting the dish with it's id
    .then((dish) => {
        if(dish !== null && dish.comments.id(req.params.commentId) !== null) {
            
            if(String(dish.comments.id(req.params.commentId).author._id) !== String(req.user._id)){
                err = new Error("You are not authorized to update this comment"); // creating the new error
                err.status = 403; // giving the status code of not authorized
                return next(err);  // sending the error which is handle by the app.js error handler globally
            }
            
            // getting the id of the comments using subdocument comments.id
            dish.comments.id(req.params.commentId).remove(); // so here we removing all the comments one by one
            dish.save()       // so we saving the changes
            .then((dish) => {
                Dishes.findById(dish._id)  // there we do find because for populate the data
                .populate('comments.author') // so here we populate the author data before sending the updated comment
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);    // so res.json will help to send the json response  
                })
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