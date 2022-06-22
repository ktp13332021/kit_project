
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

  // define schema



  var ReferenceValueSchema = new Schema({
   
        valuecode : {type : String, required:true, index: true},
        valuedescription : {type :String, index: true},
        locallanguagedesc : String,
        isdefault : Boolean,
        activefrom : Date,
        activeto : Date,
        domaincode : {type : String, required:true},
        relatedvalue : String,
        displayorder : Number
     			
  });  

ReferenceValueSchema.plugin(resuable);
module.exports = mongoose.model('ReferenceValue', ReferenceValueSchema);

