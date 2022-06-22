// import the necessary modules
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

// define schema



var VitalSignDataSchema = new Schema({
    visitid: String,
    data: [{
        resultitem: String,
        value: String
    }]
});

module.exports = mongoose.model('VitalSingData', VitalSignDataSchema);

