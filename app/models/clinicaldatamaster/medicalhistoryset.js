
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var MedicalHistorySetSchema = new Schema({
      
      /** isglobalsetting {Boolean} whether this setting is a global setting or a department specific setting */
      isglobalsetting : {type : Boolean, required:true, index: true},
       /** departmentuid {ObjectId} - reference to the Department schema*/
      departmentuid : {type : Schema.ObjectId, ref:'Department'},
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
      /** problemlist[{ObjectId}]  - list of problem concepts */
      problemlist : [{type: Schema.ObjectId, ref: 'Problem' }]
     
  });
  
 MedicalHistorySetSchema.plugin(resuable);
 
 module.exports = mongoose.model('MedicalHistorySet', MedicalHistorySetSchema);
