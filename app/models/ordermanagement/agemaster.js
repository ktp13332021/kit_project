
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var AgeMasterSchema = new Schema({
      /** Code {string} has to be unique */
      code : {type : String, required:true, index: true},
      /** Name {string} defines the  name given for the age*/
      name : {type : String, required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** activefrom {Date} - start date for the age */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the age. */ 
      activeto : Date,
      /** locallangdesc {String} - local language for the age*/
      locallangdesc : String,
      /** from {Number} - denotes the starting value of the age */
      from : Number,
      /** fromunit {ObjectId} -  denotes if the age unit has to be restricted to day, month or year */
      fromunit : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** to {Number} - denotes the ending value of the age */
      to : Number,
      /** tounit {ObjectId} -  denotes if the age unit has to be restricted to day, month or year */
      tounit : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** fromdays {Number} - Calculated by (from x fromunitvalue) */
      fromdays : Number,
      /** fromdays {Number} - Calculated by (to x tounitvalue) */
      todays : Number
  });
  
 AgeMasterSchema.plugin(resuable);
 
 module.exports = mongoose.model('AgeMaster', AgeMasterSchema);