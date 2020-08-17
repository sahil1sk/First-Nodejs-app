// SO HERE WE ARE USING EXPRESS ROUTERS -- so that to make large number of api endpoint become easy

// getting the modules
const express = require('express');
const bodyParser = require('body-parser');

// so here we declare leaderRouter as express router
const leaderRouter = express.Router();

// so here we using body parser
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');      // so here we sending the plan data
    next();      // so here we calling the next this will help to go for seeing next endpoint which are with /leaders endpoint
})
.get((req, res, next) => {
    // just constructing normal  reply message
res.end('Will send all the leaders to you!'); 
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + 
    ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all the leaders!');
});

// this is for specific leaders
leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');      // so here we sending the plan data
    next();      // so here we calling the next this will help to go for seeing next endpoint which are with /dishes endpoint
})
.get((req, res, next) => {
    res.end('Will send details of the leader: ' + 
            req.params.leaderId + ' to you!');  // req.params.leaderId helps to fetch the id 
})
.post((req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('POST operation not supoorted on /leader/' + 
            req.params.leaderId);
})
.put((req, res, next) => {
    // res.write will help to add the line to the reply message
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + 
            req.body.description)
})
.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;
