
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');
var Schema = mongoose.Schema;

//Departments defined the speciality

// create an export function to encapsulate the model creation

  // define schema

  
  var ImportLogSchema = new Schema({
        useruid : { type: Schema.ObjectId, ref: 'User', index: true },
        username : String,
        url : String,
        dataset : String,
        datasetuid : { type: Schema.ObjectId },
        datasetcode : String,
        resulttype : String,
        auditdate : {type :Date, index: true},
        datalog : String,
        ipaddress : String,
        errorlog : String
        
  });
//need to add dept to service depts based on order categories.

ImportLogSchema.plugin(resuable);
module.exports = mongoose.model('ImportLog', ImportLogSchema);
