const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    id: {
        type: Number
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    category:{
        type:String
    },
    sold:{
        type:Boolean
    },
    dateOfSale:{
        type:String
    }
    
});

const collection = mongoose.model("Transcation",transactionSchema);

module.exports = collection;