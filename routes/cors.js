// ==> In this file we configure the cors module

const express = require('express');
const cors = require('cors');
const app = express();


// the white list will contain all the origin that the server will accept
const whitelist = ['http://localhost:3000','https://localhost:3443']; 

// making the function that will check the req origin is present in whitelist or not
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    
    // checking that the cors headers origin is present in whitelist or not if not then it will give -1
    if(whitelist.indexOf(req.header('Origin')) !== -1 ){
        corsOptions = { origin: true };    // so if it's origin is present in whitelist then we set the corsOption to true
    }else{
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
};

exports.cors = cors(); // so here we directly use this then it will allow the all origin routes with wild card * means routes are allowed
exports.corsWithOptions = cors(corsOptionsDelegate); // so here it is for checking the options sometime wheather the origin is in whitelist or not

