
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

  // define schema



  var SequenceNumberSchema = new Schema({
    code : {type : String, required:true, index: true},
    description : {type : String},
    entypeuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    initvalue : Number,
    runningvalue : Number,
    formatlength : Number,
    reseedperiod : String,
    activefrom : Date,
    activeto : Date,
    displayformat : String,
    paramtype : String,
    paramvalue : String,
    reseeddate : Date
    
  });  

SequenceNumberSchema.plugin(resuable);
module.exports = mongoose.model('SequenceNumber', SequenceNumberSchema);

