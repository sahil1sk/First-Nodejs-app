// --> here getting the mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
// the mongoose currency will help to deal with currency type
require('mongoose-currency').loadType(mongoose); // so here we load the currecy type into the mongoose
const Currency = mongoose.Types.Currency; // so here we get the currecy of const

const promotionSchema = new Schema({
    name: {
        type: String,          
        required: true,       
        unique: true         
    },
    description: {
        type: String,
        required: true,
    },  
    image:{
        type: String,
        required: true
    },
    label:{
        type: String,
        default: '',     // so here we give the defautl value empty string because this is not required
    },
    price:{
        type: Currency,   // so here we declare the Currency which is not given internally which we get from the upper const
        required: true,
        min: 0              // so here we give the minmum value
    },
    featured:{
        type: Boolean,
        default: false
    }
},{     
    timestamps: true    
});

var Promotions = mongoose.model('Promotion', promotionSchema); // this will make plural automatically like in django

module.exports = Promotions; 


