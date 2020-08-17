// SO HERE WE ARE USING EXPRESS ROUTERS -- so that to make large number of api endpoint become easy

// getting the modules
const express = require('express');
const bodyParser = require('body-parser');

// so here we declare dishRouter as express router
const dishRouter = express.Router();

// so here we using body parser
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');      // so here we sending the plan data
    next();      // so here we calling the next this will help to go for seeing next endpoint which are with /dishes endpoint
})
.get((req, res, next) => {
    // just constructing normal  reply message
res.end('Will send all the dishes to you!'); 
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + 
    ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all the dishes!');
});

// this is for specific dishes
dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');      // so here we sending the plan data
    next();      // so here we calling the next this will help to go for seeing next endpoint which are with /dishes endpoint
})
.get((req, res, next) => {
    res.end('Will send details of the dish: ' + 
            req.params.dishId + ' to you!');  // req.params.dishId helps to fetch the id 
})
.post((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('POST operation not supoorted on /dishes/' + 
            req.params.dishId);
})
.put((req, res, next) => {
    // res.write will help to add the line to the reply message
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + 
            req.body.description)
})
.delete((req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});

module.exports = dishRouter;
