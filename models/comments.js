// --> here getting the mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

// ==> Creating the comment schema
const commentSchema = new Schema({
    rating:{
        type: Number, // defining the type
        min: 1,
        max: 5,
        required: true,
    },
    comment:{
        type: String,
        required: true,
    }, 
    author:{
        type: mongoose.Schema.Types.ObjectId, // setting up the object id for populating the author data when require
        ref: 'User'         // so setting the reference of user model which means this will contain user id
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
},{
    timestamps: true
});

var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;


