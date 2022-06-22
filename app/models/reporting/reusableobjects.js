
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = exports = function auditinfo(schema,options) {
  // define schema

   schema.add({
      createdby : { type: Schema.ObjectId, ref: 'User' , required: true },
      createdat : {type : Date, required: true},
      modifiedby : { type: Schema.ObjectId, ref: 'User',required: true },
      modifiedat : {type : Date, required: true},
      statusflag : {type : String, required: true, index: true},
      orguid : { type: Schema.ObjectId, ref: 'Organisation' ,required: true, index: true}

   });

  };
