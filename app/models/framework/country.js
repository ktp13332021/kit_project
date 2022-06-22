
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

  // define schema



  var CountrySchema = new Schema({
    code : {type : String, required:true, index: true},
    name : {type : String, required:true, index: true},
    locallangname : String,
    activefrom : Date,
    activeto : Date
    
  });  

CountrySchema.plugin(resuable);
module.exports = mongoose.model('Country', CountrySchema);

