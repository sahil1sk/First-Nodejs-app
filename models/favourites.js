// --> here getting the mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

// ==> Creating the dish schema
// const dishSchema = new Schema({
//     dish:{
//         type: mongoose.Schema.Types.ObjectId, // setting up the object id for populating the author data when require
//         ref: 'Dish'         // so setting the reference of Dish model which means this will contain user id
//     }
// });

const favouriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // setting up the object id for populating the author data when require
        ref: 'User'         // so setting the reference of user model which means this will contain user id
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ] 
},{     
    timestamps: true    
});

var Favourites = mongoose.model('Favourite', favouriteSchema);  // this will make plural automatically like in django

module.exports = Favourites; 


