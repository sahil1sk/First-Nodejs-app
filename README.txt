 ---- WE USE EXPRESS GENERATOR FOR MAKING THIS FOLDER ----

# First we need to instll the express generator
Express Generator:- Quicky scaffolding tool to generate an express skeleton (helps to generate quick skelton)
Installing Express generator
npm install express-generator -g  // this is for installing globaly

# after installing now we are going to make the folder using given command
express conFusionServer

# --> after that go inside (cd conFusionServer) and then install the dependency
 	using the given command:-
	npm install

# --> Then just normally type (npm start) you will see your server is start and up 
	and running

==> Understanding With Mongo

==> Installation More
// mongoose will help to interact with mongoDB and also provide 
// schema model for set the data in structured form
npm install mongoose@5.1.7 --save // for using mongoose ODM 

// for using mongoose currency (mongocurrency will help to store the currecy value)
npm install mongoose-currency@0.2.0 --save  

// in express generator cookie parsor is comming with it for install it on express normally use given command
 npm install cookie-parser@1.4.3 --save

// so here we are intall express session
npm install express-session@1.15.6 --save
// so here we are installing express file store for storing the info of the express sessions
npm install session-file-store@1.2.0 --save

// ==> Installing Modules for using passport
npm install passport@0.4.0 --save  				// installing for using passport
npm intstall passport-local@1.0.0 --save        // installing for using local passport which make the local authentication easy
npm install passport-local-mongoose@5.0.1 --save // mongoose passport is very smart it is supportive with mongoose schema automatically done all the stuff

// ==> Install for using JWT 
npm install jsonwebtoken@8.3.0 --save    // installing JWT
npm install passport-jwt@4.0.0 --save    // install for using JWT with passport which provides many built in things

// ==> Installing Multer which will help to uploading files
npm install multer@1.2.1 --save

// ==> Installing cors Module
npm install cors@2.8.4 --save // cors module

