// SO HERE WE ARE USING EXPRESS ROUTERS -- so that to make large number of api endpoint become easy

// getting the modules
const express = require('express');
const bodyParser = require('body-parser');

// so here we declare promotionRouter as express router
const promotionRouter = express.Router();

// so here we using body parser
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');      // so here we sending the plan data
    next();      // so here we calling the next this will help to go for seeing next endpoint which are with /promotions endpoint
})
.get((req, res, next) => {
    // just constructing normal  reply message
res.end('Will send all the promotions to you!'); 
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + 
    ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all the promotions!');
});

// this is for specific promotions
promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');      // so here we sending the plan data
    next();      // so here we calling the next this will help to go for seeing next endpoint which are with /dishes endpoint
})
.get((req, res, next) => {
    res.end('Will send details of the promotion: ' + 
            req.params.promotionId + ' to you!');  // req.params.promotionId helps to fetch the id 
})
.post((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('POST operation not supoorted on /promotion/' + 
            req.params.promotionId);
})
.put((req, res, next) => {
    // res.write will help to add the line to the reply message
    res.write('Updating the promotion: ' + req.params.promotionId + '\n');
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + 
            req.body.description)
})
.delete((req, res, next) => {
    res.end('Deleting promotion: ' + req.params.promotionId);
});

module.exports = promotionRouter;
