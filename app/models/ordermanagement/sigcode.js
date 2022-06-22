
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var SIGCodeSchema = new Schema({
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
      /** quantityperday {Number} - local language for the age*/
      type : {type : String, enum:['FREQUENCY','FORM','ROUTE', 'INSTRUCTION', 'ORDERITEM','UOM']},
      /** reftypeuid {[ObjectId]} - points to one of the masters referenced by type */
      reftypeuid : { type: Schema.ObjectId}
  });
  
 SIGCodeSchema.plugin(resuable);
 
 module.exports = mongoose.model('SIGCode', SIGCodeSchema);