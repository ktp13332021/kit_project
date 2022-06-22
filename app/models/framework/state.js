
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

  // define schema



  var StateSchema = new Schema({
    code : {type : String, required:true, index: true},
    name : {type : String, required:true, index: true},
    locallangname : String,
    activefrom : Date,
    activeto : Date,
    countryuid : { type: Schema.ObjectId, ref: 'Country' },
    country : String
    
  });  

StateSchema.plugin(resuable);
module.exports = mongoose.model('State', StateSchema);

