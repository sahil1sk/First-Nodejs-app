// SO HERE WE ARE USING EXPRESS ROUTERS -- so that to make large number of api endpoint become easy

// getting the modules
const express = require('express');
const bodyParser = require('body-parser');      // helps to read the data inside the body
const authenticate = require('../authenticate'); // getting the authenticate module
const multer = require('multer');     // getting the multer module for using the file uploading

// ==> Use the given link how to upload multiple files
// https://github.com/expressjs/multer

// so here we make storage as which way the file will store
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');  // null for error and 2nd parmatere is destination where file will stored
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname); // null for no error and giving the file name as user provided
    }
});

// so here we filtering the file means which file (like .png) is allowed
const imageFileFilter = (req, file, callback) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){ // so here if the file extension doesn't match with any one of the extension then we will return the error
        return callback(new Error('You can upload only image files!'), false);
    }
    callback(null, true);
};

// so here we uploading the file // specifing storage and imageFileFilter as which way it will store file
const upload = multer({storage: storage, fileFilter: imageFileFilter});

// so here we declare uploadRouter as express router
const uploadRouter = express.Router();

// so here we using body parser
uploadRouter.use(bodyParser.json()); // for getting the body data we use bodyParser

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('GET operation not supoorted on /imageUpload');
})                                                     // uploading the single file  // when the user will upload file from client side at input name attribute is set to imageFile                                   
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);   // req.file for one file req.files for multiple req.files so here we sending back the file which will also contain the file url
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('PUT operation not supoorted on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;   // 403 means not supported
    res.end('DELETE operation not supoorted on /imageUpload');
})

module.exports = uploadRouter; 
