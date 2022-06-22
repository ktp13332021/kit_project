
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var CCHPIMasterSchema = new Schema({
       /** Code {string} has to be unique */
      code : {type : String,required:true, index: true},
       /** Name {string} defines the  name given for the cchpi concept*/
      name : {type :String,required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** locallangdesc {String} - local language for the cchpi concept*/
      locallangdesc : String,
       /** activefrom {Date} - start date for the cchpi concept */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the cchpi concept. */ 
      activeto : Date,
      /** templateuid {ObjectId} - reference to dynamic form uid. */ 
      templateuid :  { type: Schema.ObjectId, ref: 'FormTemplate' },
      /** bodysites[{ObjectId}] - reference to referencedomain 'BODYSI' */
      bodysites : [{type: Schema.ObjectId, ref: 'ReferenceValue' }]
    
  });
  
 CCHPIMasterSchema.plugin(resuable);
 
 module.exports = mongoose.model('CCHPIMaster', CCHPIMasterSchema);
